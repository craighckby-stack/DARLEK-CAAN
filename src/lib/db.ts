import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File: src/lib/db.ts
 * Description: Resilient Prisma SQLite database manager with automated self-healing 
 * and dynamic proxy-based corruption recovery.
 */

// Global type augmentation for development hot-reloading context
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Database paths configuration
const PRISMA_DIR = path.join(process.cwd(), 'prisma');
const DB_PATH = path.join(PRISMA_DIR, 'dev.db');
const WAL_PATH = path.join(PRISMA_DIR, 'dev.db-wal');
const SHM_PATH = path.join(PRISMA_DIR, 'dev.db-shm');

const SQLITE_CONNECTION_URL = `file:${DB_PATH}?connection_limit=1&socket_timeout=15`;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_PRODUCTION_BUILD = process.env.NEXT_PHASE === 'phase-production-build';

// Internal singleton state
let prismaInstance: PrismaClient | null = null;
let isHealingInProgress = false;
let isDatabaseChecked = false;

/**
 * Safely removes SQLite Write-Ahead Log (WAL) and shared memory files if they exist.
 */
function cleanupWalFiles(): void {
  try {
    if (fs.existsSync(WAL_PATH)) fs.unlinkSync(WAL_PATH);
    if (fs.existsSync(SHM_PATH)) fs.unlinkSync(SHM_PATH);
  } catch {
    // Suppress clean-up access exceptions
  }
}

/**
 * Retrieves or initializes the active PrismaClient singleton instance.
 */
function getPrismaInstance(): PrismaClient {
  if (!isDatabaseChecked) {
    isDatabaseChecked = true;
    if (!fs.existsSync(DB_PATH)) {
      performSelfHealing();
    }
  }

  if (prismaInstance) {
    return prismaInstance;
  }

  if (!IS_PRODUCTION && globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
    return prismaInstance;
  }

  prismaInstance = new PrismaClient({
    datasources: {
      db: { url: SQLITE_CONNECTION_URL },
    },
    log: !IS_PRODUCTION ? ['error'] : [],
  });

  if (!IS_PRODUCTION) {
    globalForPrisma.prisma = prismaInstance;
  }

  return prismaInstance;
}

/**
 * Automatically wipes corrupted or missing database files and regenerates the schema via Prisma CLI.
 */
export function performSelfHealing(): void {
  if (isHealingInProgress || IS_PRODUCTION_BUILD) return;
  isHealingInProgress = true;
  
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

    if (fs.existsSync(DB_PATH)) {
      try { fs.unlinkSync(DB_PATH); } catch {}
    }
    
    cleanupWalFiles();
    
    try {
      execSync('npx prisma db push --accept-data-loss', { stdio: 'pipe' });
      console.log('[Database Setup] Database healing completed successfully!');
    } catch (pushError) {
      console.warn('[Database Setup] Prisma push warning:', pushError);
    }
  } catch (healingError) {
    console.error('[Database Setup] Self-healing error:', healingError);
  } finally {
    isHealingInProgress = false;
  }
}

/**
 * Analyzes errors to determine if they stem from SQLite corruption or database dropouts.
 */
function isCorruptionError(error: unknown): boolean {
  if (!error) return false;
  const errorMessage = String((error as any)?.message || (error as any)?.stack || error).toLowerCase();
  
  return [
    'malformed',
    'corrupt',
    'disk image',
    'sqlite_corrupt',
    'database_closed',
    'connectorerror',
    'sqliteerror',
  ].some((keyword) => errorMessage.includes(keyword));
}

// Caching layer for dynamic model proxies
const proxyCache = new Map<string | symbol, any>();

/**
 * Creates a robust Proxy handler capable of capturing model invocations, 
 * catching storage corruption anomalies, and executing automatic self-healing retries.
 */
function createCallableProxy(propertyKey: string | symbol): any {
  if (proxyCache.has(propertyKey)) {
    return proxyCache.get(propertyKey);
  }

  const dummyFunction = () => {};
  
  const proxy = new Proxy(dummyFunction, {
    apply(_, __, args) {
      const executeOperation = async (attempt = 1): Promise<any> => {
        const activePrisma = getPrismaInstance();
        const targetMethod = (activePrisma as any)[propertyKey];
        
        if (typeof targetMethod !== 'function') {
          throw new Error(`Prisma method "${String(propertyKey)}" is not a function.`);
        }
        
        try {
          const result = targetMethod.apply(activePrisma, args);
          return (result && typeof result === 'object' && typeof result.then === 'function')
            ? await result
            : result;
        } catch (error: unknown) {
          if (isCorruptionError(error)) {
            console.error(`[Prisma Proxy Direct] Database corruption detected on ${String(propertyKey)}. Healing database...`);
            performSelfHealing();
            if (attempt < 2) {
              return executeOperation(attempt + 1);
            }
          }
          throw error;
        }
      };
      return executeOperation();
    },

    get(_, subPropertyKey) {
      if (subPropertyKey === 'then' || subPropertyKey === 'toJSON' || typeof subPropertyKey === 'symbol') {
        return undefined;
      }

      return function (...args: any[]) {
        const executeModelOperation = async (attempt = 1): Promise<any> => {
          const activePrisma = getPrismaInstance();
          const modelInstance = (activePrisma as any)[propertyKey];
          
          if (!modelInstance) {
            throw new Error(`Prisma model or method "${String(propertyKey)}" not found.`);
          }
          
          const modelMethod = modelInstance[subPropertyKey];
          if (typeof modelMethod !== 'function') {
            throw new Error(`Prisma method "${String(subPropertyKey)}" on model/service "${String(propertyKey)}" is not a function.`);
          }

          try {
            const result = modelMethod.apply(modelInstance, args);
            return (result && typeof result === 'object' && typeof result.then === 'function')
              ? await result
              : result;
          } catch (error: unknown) {
            if (isCorruptionError(error)) {
              console.error(`[Prisma Proxy Model] Database corruption detected on ${String(propertyKey)}.${String(subPropertyKey)}. Rebuilding...`);
              performSelfHealing();
              if (attempt < 2) {
                return executeModelOperation(attempt + 1);
              }
            }
            throw error;
          }
        };

        return executeModelOperation();
      };
    }
  });

  proxyCache.set(propertyKey, proxy);
  return proxy;
}

/**
 * Resilient database client proxy wrapper guaranteeing automatic failure recovery and transparent model access.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_, propertyKey) {
    if (propertyKey === 'then' || propertyKey === 'toJSON' || typeof propertyKey === 'symbol') {
      return undefined;
    }
    return createCallableProxy(propertyKey);
  }
});