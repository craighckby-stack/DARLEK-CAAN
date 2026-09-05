import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { safeReqJson } from '@/lib/safe-json';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

interface RebootFileResult {
  file: string;
  status: 'updated' | 'skipped' | 'error';
  backup?: string;
  error?: string;
}

interface RebootRequestBody {
  token?: string;
  owner?: string;
  repo?: string;
  branch?: string;
  sessionId?: string;
}

interface GitHubTreeItem {
  type: string;
  path: string;
}

interface GitHubTreeResponse {
  tree?: GitHubTreeItem[];
}

interface GitHubContentResponse {
  encoding?: string;
  content?: string;
}

const ALLOWED_ROOT_FILES = new Set([
  'package.json',
  'next.config.ts',
  'next.config.js',
  'next.config.mjs',
  'tsconfig.json',
  'tailwind.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  'postcss.config.mjs',
  '.eslintrc.json',
  '.eslintrc.js',
]);

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.html']);
const RATE_LIMIT_DELAY_MS = 300;
const FETCH_TIMEOUT_MS = 8000;

function isAllowedFile(filePath: string): boolean {
  return filePath.startsWith('src/') || filePath.startsWith('public/') || ALLOWED_ROOT_FILES.has(filePath);
}

function createGitHubHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };
}

async function fetchSessionMutations(sessionId: string): Promise<string[]> {
  try {
    const mutations = await db.mutationHistory.findMany({
      where: { sessionId, status: 'applied' },
      orderBy: { createdAt: 'desc' },
      select: { filePath: true },
    });
    return mutations.map((m: { filePath: string }) => m.filePath);
  } catch {
    return [];
  }
}

async function fetchRepositoryTreeSources(owner: string, repo: string, branch: string, token: string): Promise<string[]> {
  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`;
  const response = await fetch(treeUrl, { headers: createGitHubHeaders(token) });

  if (!response.ok) return [];

  const data = (await response.json()) as GitHubTreeResponse;
  const treeItems = data.tree ?? [];

  return treeItems
    .filter((item) => {
      if (item.type !== 'blob') return false;
      if (item.path.includes('node_modules/') || item.path.includes('.next/') || item.path.includes('.git/')) {
        return false;
      }
      const extension = `.${item.path.split('.').pop()?.toLowerCase() ?? ''}`;
      const isSourceExt = SOURCE_EXTENSIONS.has(extension);
      const isConfigOrRoot =
        isSourceExt ||
        ['next.config', 'package.json', 'tsconfig.json', 'tailwind.config', 'postcss.config', '.eslintrc'].some(
          (prefix) => item.path === prefix || item.path.startsWith(`${prefix}.`)
        );
      return isConfigOrRoot;
    })
    .map((item) => item.path);
}

async function createTimestampedBackupDir(projectRoot: string): Promise<{ backupDir: string; timestamp: string }> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = path.join(projectRoot, '.darleK-backups', `pre-reboot-${timestamp}`);
  await fs.mkdir(backupDir, { recursive: true });
  return { backupDir, timestamp };
}

async function fetchGitHubFileContent(owner: string, repo: string, filePath: string, branch: string, token: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(branch)}`;
    const response = await fetch(fileUrl, {
      headers: createGitHubHeaders(token),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const fileData = (await response.json()) as GitHubContentResponse;
    if (fileData.encoding !== 'base64' || !fileData.content) {
      throw new Error('Binary or empty file');
    }

    return Buffer.from(fileData.content, 'base64').toString('utf-8');
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'online', service: 'SYSTEM_REBOOT_API' });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await safeReqJson(req, {})) as RebootRequestBody;
    const { token, owner, repo, branch, sessionId } = body;

    if (!token || !owner || !repo || !branch) {
      return NextResponse.json(
        { error: 'token, owner, repo, and branch are required' },
        { status: 400 }
      );
    }

    let mutatedFiles = sessionId ? await fetchSessionMutations(sessionId) : [];

    if (mutatedFiles.length === 0) {
      mutatedFiles = await fetchRepositoryTreeSources(owner, repo, branch, token);
    }

    if (mutatedFiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No files to reboot — no mutations found in this session.',
        results: [],
        total: 0,
        updated: 0,
      });
    }

    const projectRoot = process.cwd();
    const { backupDir, timestamp } = await createTimestampedBackupDir(projectRoot);

    const results: RebootFileResult[] = [];
    let updatedCount = 0;
    let failedCount = 0;

    for (const [index, filePath] of mutatedFiles.entries()) {
      if (!isAllowedFile(filePath)) {
        results.push({ file: filePath, status: 'skipped' });
        continue;
      }

      try {
        if (index > 0) {
          await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY_MS));
        }

        const newContent = await fetchGitHubFileContent(owner, repo, filePath, branch, token);
        const localPath = path.join(projectRoot, filePath);

        let fileExists = false;
        try {
          await fs.access(localPath);
          fileExists = true;
        } catch {
          fileExists = false;
        }

        if (fileExists) {
          const backupPath = path.join(backupDir, filePath);
          await fs.mkdir(path.dirname(backupPath), { recursive: true });
          await fs.copyFile(localPath, backupPath);

          const existingContent = await fs.readFile(localPath, 'utf-8');
          if (existingContent === newContent) {
            results.push({ file: filePath, status: 'skipped', backup: backupPath });
            continue;
          }
        }

        await fs.mkdir(path.dirname(localPath), { recursive: true });
        await fs.writeFile(localPath, newContent, 'utf-8');
        updatedCount++;

        results.push({ file: filePath, status: 'updated' });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({ file: filePath, status: 'error', error: errorMessage });
        failedCount++;
      }
    }

    const skippedCount = results.filter((r) => r.status === 'skipped').length;
    return NextResponse.json({
      success: true,
      message: `Reboot complete. ${updatedCount} files updated, ${skippedCount} skipped, ${failedCount} failed.`,
      results,
      total: mutatedFiles.length,
      updated: updatedCount,
      failed: failedCount,
      backupDir: `.darleK-backups/pre-reboot-${timestamp}`,
    });
  } catch (error: unknown) {
    console.error('Reboot error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}