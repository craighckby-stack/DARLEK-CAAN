import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaDir = path.join(process.cwd(), 'prisma');
const dbPath = path.join(prismaDir, 'dev.db');
const walPath = path.join(prismaDir, 'dev.db-wal');
const shmPath = path.join(prismaDir, 'dev.db-shm');

const SQLITE_URL = `file:${dbPath}?connection_limit=1&socket_timeout=15`;
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_BUILD = process.env.NEXT_PHASE === 'phase-production-build';

let prismaInstance: PrismaClient | null = null;
let isHealing = false;
let isDbChecked = false;

function cleanupWalFiles(): void {
  try {
    if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
    if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);
  } catch {}
}

function getPrismaInstance(): PrismaClient {
  if (!isDbChecked) {
    isDbChecked = true;
    if (!fs.existsSync(dbPath)) {
      performSelfHealing();
    }
  }

  if (prismaInstance) {
    return prismaInstance;
  }

  if (!IS_PROD && globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
    return prismaInstance;
  }

  prismaInstance = new PrismaClient({
    datasources: {
      db: { url: SQLITE_URL },
    },
    log: !IS_PROD ? ['error'] : [],
  });

  if (!IS_PROD) {
    globalForPrisma.prisma = prismaInstance;
  }

  return prismaInstance;
}

export function performSelfHealing(): void {
  if (isHealing || IS_BUILD) return;
  isHealing = true;
  
  try {
    console.warn('[Database Setup] Self-healing initiated. Rebuilding database schema...');
    
    if (prismaInstance) {
      const staleInstance = prismaInstance;
      prismaInstance = null;
      if (globalForPrisma.prisma) {
        globalForPrisma.prisma = undefined;
      }
      staleInstance.$disconnect().catch(() => {});
    }

    if (fs.existsSync(dbPath)) {
      try { fs.unlinkSync(dbPath); } catch {}
    }
    cleanupWalFiles();
    
    try {
      execSync('npx prisma db push --accept-data-loss', { stdio: 'pipe' });
      console.log('[Database Setup] Database healing completed successfully!');
    } catch (e) {
      console.warn('[Database Setup] Prisma push warning:', e);
    }
  } catch (healErr) {
    console.error('[Database Setup] Self-healing error:', healErr);
  } finally {
    isHealing = false;
  }
}

function isCorruptionError(err: unknown): boolean {
  if (!err) return false;
  const errMsg = String((err as any)?.message || (err as any)?.stack || err).toLowerCase();
  return (
    errMsg.includes('malformed') || 
    errMsg.includes('corrupt') || 
    errMsg.includes('disk image') || 
    errMsg.includes('sqlite_corrupt') || 
    errMsg.includes('database_closed') || 
    errMsg.includes('connectorerror') || 
    errMsg.includes('sqliteerror')
  );
}

const proxyCache = new Map<string | symbol, any>();

function createCallableProxy(prop: string | symbol): any {
  if (proxyCache.has(prop)) {
    return proxyCache.get(prop);
  }

  const dummy = () => {};
  
  const proxy = new Proxy(dummy, {
    apply(_, __, args) {
      const execute = async (attempt = 1): Promise<any> => {
        const activePrisma = getPrismaInstance();
        const method = (activePrisma as any)[prop];
        if (typeof method !== 'function') {
          throw new Error(`Prisma method "${String(prop)}" is not a function.`);
        }
        try {
          const result = method.apply(activePrisma, args);
          return (result && typeof result === 'object' && typeof result.then === 'function')
            ? await result
            : result;
        } catch (err: unknown) {
          if (isCorruptionError(err)) {
            console.error(`[Prisma Proxy Direct] Database corruption detected on ${String(prop)}. Healing database...`);
            performSelfHealing();
            if (attempt < 2) {
              return execute(attempt + 1);
            }
          }
          throw err;
        }
      };
      return execute();
    },

    get(_, subProp) {
      if (subProp === 'then' || subProp === 'toJSON' || typeof subProp === 'symbol') {
        return undefined;
      }

      return function (...args: any[]) {
        const execute = async (attempt = 1): Promise<any> => {
          const activePrisma = getPrismaInstance();
          const model = (activePrisma as any)[prop];
          if (!model) {
            throw new Error(`Prisma model or method "${String(prop)}" not found.`);
          }
          const method = model[subProp];
          if (typeof method !== 'function') {
            throw new Error(`Prisma method "${String(subProp)}" on model/service "${String(prop)}" is not a function.`);
          }

          try {
            const result = method.apply(model, args);
            return (result && typeof result === 'object' && typeof result.then === 'function')
              ? await result
              : result;
          } catch (err: unknown) {
            if (isCorruptionError(err)) {
              console.error(`[Prisma Proxy Model] Database corruption detected on ${String(prop)}.${String(subProp)}. Rebuilding ...`);
              performSelfHealing();
              if (attempt < 2) {
                return execute(attempt + 1);
              }
            }
            throw err;
          }
        };

        return execute();
      };
    }
  });

  proxyCache.set(prop, proxy);
  return proxy;
}

export const db = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (prop === 'then' || prop === 'toJSON' || typeof prop === 'symbol') {
      return undefined;
    }
    return createCallableProxy(prop);
  }
});