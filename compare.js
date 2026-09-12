import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10MB limit
const MAX_PATH_LENGTH = 1024;
const DEFAULT_TIMEOUT_MS = 15_000; // Enforced 15s timeout safeguard

interface CompareOptions {
  owner?: string;
  repo?: string;
  branch?: string;
  localDir?: string;
  githubToken?: string;
}

interface TreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
}

interface TreeResponse {
  sha: string;
  url: string;
  tree: TreeItem[];
  truncated: boolean;
}

export interface ComparisonResult {
  remoteOnly: string[];
  localOnly: string[];
  common: string[];
}

/**
 * Validates and normalizes path strings to prevent directory traversal attack vectors.
 */
export function sanitizePath(inputPath: string): string | null {
  if (typeof inputPath !== 'string' || inputPath.length === 0 || inputPath.length > MAX_PATH_LENGTH) {
    return null;
  }

  if (inputPath.includes('\0')) {
    return null;
  }

  const normalized = path.normalize(inputPath);
  if (normalized.startsWith('..') || path.isAbsolute(normalized)) {
    return null;
  }

  return normalized.replace(/\\/g, '/');
}

/**
 * Asynchronously walks local directory structure without blocking the event loop.
 */
export async function walkLocalDirectory(dir: string): Promise<string[]> {
  const safeDir = sanitizePath(dir);
  if (!safeDir) {
    return [];
  }

  const results: string[] = [];
  const resolvedRoot = path.resolve(safeDir);
  const stack: string[] = [resolvedRoot];

  while (stack.length > 0) {
    const currentDir = stack.pop()!;
    
    try {
      if (!currentDir.startsWith(resolvedRoot)) {
        continue;
      }

      const entries = await readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const entryName = entry.name;
        if (!entryName || entryName.startsWith('.')) {
          continue;
        }

        const fullPath = path.join(currentDir, entryName);
        const relativePath = path.relative(process.cwd(), fullPath);
        const safeFilePath = sanitizePath(relativePath);

        if (!safeFilePath) {
          continue;
        }

        if (entry.isDirectory()) {
          stack.push(fullPath);
        } else if (entry.isFile()) {
          results.push(safeFilePath);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[DARLEK CANN] Directory access failure at (${currentDir}):`, message);
    }
  }

  return results;
}

/**
 * Fetches the GitHub repository tree structure using standard REST v3 API and 15s timeout safeguard.
 */
export async function fetchRemoteTree(
  owner: string,
  repo: string,
  branch: string = 'main',
  token?: string
): Promise<string[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const headers: Record<string, string> = {
    'User-Agent': 'DARLEK-CANN-Sovereign-Engine',
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`GitHub API HTTP status failure: ${response.status} ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_SIZE) {
      throw new Error(`Remote payload exceeds max buffer capacity (${MAX_RESPONSE_SIZE} bytes)`);
    }

    const payload = (await response.json()) as TreeResponse;

    if (!payload || !Array.isArray(payload.tree)) {
      throw new Error('Invalid JSON schema structure received from GitHub REST API');
    }

    const remoteFiles: string[] = [];
    for (const item of payload.tree) {
      if (item && item.type === 'blob' && item.path) {
        const safePath = sanitizePath(item.path);
        if (safePath) {
          remoteFiles.push(safePath);
        }
      }
    }

    return remoteFiles;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`GitHub API connection timed out after ${DEFAULT_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Performs state divergence audit between local workspace and remote repository snapshot.
 */
export async function compareRepositoryState(options: CompareOptions = {}): Promise<ComparisonResult> {
  const owner = options.owner || process.env.GITHUB_OWNER || 'darlek-cann-org';
  const repo = options.repo || process.env.GITHUB_REPO || 'core-system';
  const branch = options.branch || process.env.GITHUB_BRANCH || 'main';
  const localDir = options.localDir || 'src';

  console.info(`[DARLEK CANN] Initiating state analysis for target [${owner}/${repo}:${branch}] against [${localDir}]`);

  const [localFiles, remoteFiles] = await Promise.all([
    walkLocalDirectory(localDir),
    fetchRemoteTree(owner, repo, branch, options.githubToken || process.env.GITHUB_TOKEN),
  ]);

  const remoteSet = new Set(remoteFiles);
  const localSet = new Set(localFiles);

  const remoteOnly = remoteFiles.filter((file) => !localSet.has(file) && file.startsWith(`${localDir}/`));
  const localOnly = localFiles.filter((file) => !remoteSet.has(file));
  const common = localFiles.filter((file) => remoteSet.has(file));

  return { remoteOnly, localOnly, common };
}

// CLI Execution handler
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      const audit = await compareRepositoryState();
      
      console.log('\n=== DARLEK CANN STATE DIVERGENCE REPORT ===');
      console.log('\nFiles present in Remote but missing locally:');
      audit.remoteOnly.forEach((f) => console.log(`  + ${f}`));
      if (audit.remoteOnly.length === 0) console.log('  (None)');

      console.log('\nFiles present locally but missing in Remote:');
      audit.localOnly.forEach((f) => console.log(`  - ${f}`));
      if (audit.localOnly.length === 0) console.log('  (None)');

      console.log(`\nSynchronization state: ${audit.common.length} aligned, ${audit.remoteOnly.length} remote-only, ${audit.localOnly.length} local-only.`);
    } catch (error) {
      console.error('[DARLEK CANN Error] Evolution state sync failed:', error);
      process.exitCode = 1;
    }
  })();
}