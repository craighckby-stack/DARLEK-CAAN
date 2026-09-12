/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/app/api/github/scan/route.ts
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ScanRepoBody, GitHubFile } from '@/lib/types';
import { safeReqJson } from '@/lib/safe-json';

export const dynamic = 'force-dynamic';

const GITHUB_API_BASE_URL: string = 'https://api.github.com';
const GITHUB_API_VERSION_HEADER: string = 'application/vnd.github.v3+json';

const MAX_OWNER_LENGTH: number = 100;
const MAX_REPO_LENGTH: number = 100;
const MAX_BRANCH_LENGTH: number = 255;
const MAX_TOKEN_LENGTH: number = 500;
const MAX_TREE_ITEMS: number = 50000;

const SAFE_NAME_REGEX: RegExp = /^[a-zA-Z0-9_.-]+$/;

const EXCLUDED_DIRECTORIES: readonly string[] = Object.freeze([
  'node_modules/',
  '.git/',
  'dist/',
  'build/',
  '.next/',
  '__pycache__/',
  '.svn/',
]);

const EXCLUDED_FILES_SET: ReadonlySet<string> = Object.freeze(
  new Set([
    '.env',
    '.env.local',
    'package-lock.json',
    'yarn.lock',
    '.DS_Store',
  ])
);

interface GitHubTreeItem {
  readonly path: string;
  readonly size: number;
  readonly type: string;
  readonly sha: string;
}

interface GitHubTreeResponse {
  readonly tree?: GitHubTreeItem[];
}

/**
 * Determines whether a given tree item is a valid file that passes exclusion filters and bounds constraints.
 */
function isValidBlobItem(item: GitHubTreeItem): boolean {
  if (!item || item.type !== 'blob' || typeof item.path !== 'string' || typeof item.size !== 'number') {
    return false;
  }

  const { path }: GitHubTreeItem = item;
  if (path.length > 1024 || path.includes('..') || path.startsWith('/')) {
    return false;
  }

  for (let i = 0; i < EXCLUDED_DIRECTORIES.length; i++) {
    if (path.includes(EXCLUDED_DIRECTORIES[i])) {
      return false;
    }
  }

  const lastSlashIndex: number = path.lastIndexOf('/');
  const fileName: string = lastSlashIndex === -1 ? path : path.substring(lastSlashIndex + 1);

  return !EXCLUDED_FILES_SET.has(fileName);
}

/**
 * Handles health-check requests for the GitHub scan service.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'online', service: 'GITHUB_SCAN_API' });
}

/**
 * Scans a GitHub repository tree recursively while filtering out ignored files and directories with strict input validation.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: ScanRepoBody = await safeReqJson<ScanRepoBody>(req, {} as ScanRepoBody);
    const { token, owner, repo, branch } = body;

    if (!token || !owner || !repo || !branch) {
      return NextResponse.json(
        { error: 'Missing required parameters: token, owner, repo, or branch.' },
        { status: 400 }
      );
    }

    if (
      typeof token !== 'string' || token.length > MAX_TOKEN_LENGTH ||
      typeof owner !== 'string' || owner.length > MAX_OWNER_LENGTH || !SAFE_NAME_REGEX.test(owner) ||
      typeof repo !== 'string' || repo.length > MAX_REPO_LENGTH || !SAFE_NAME_REGEX.test(repo) ||
      typeof branch !== 'string' || branch.length > MAX_BRANCH_LENGTH
    ) {
      return NextResponse.json(
        { error: 'Invalid parameter formats or lengths.' },
        { status: 400 }
      );
    }

    const repositoryTreeUrl: string = `${GITHUB_API_BASE_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(branch)}?recursive=1`;

    const githubResponse: Response = await fetch(repositoryTreeUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: GITHUB_API_VERSION_HEADER,
        'User-Agent': 'Dalek-Cognition-Architecture/1.0',
      },
    });

    if (!githubResponse.ok) {
      const errorDetails: string = await githubResponse.text();
      return NextResponse.json(
        { error: `GitHub API error: ${errorDetails}` },
        { status: githubResponse.status }
      );
    }

    const data: GitHubTreeResponse = await githubResponse.json();
    const tree = data.tree;

    if (!tree || !Array.isArray(tree)) {
      return NextResponse.json(
        { error: 'No tree data returned or invalid format. Check the branch name.' },
        { status: 400 }
      );
    }

    if (tree.length > MAX_TREE_ITEMS) {
      return NextResponse.json(
        { error: 'Repository tree exceeds maximum allowed item count.' },
        { status: 400 }
      );
    }

    const filteredFiles: GitHubFile[] = [];
    let repoTotal: number = 0;

    for (let i = 0; i < tree.length; i++) {
      const item = tree[i];
      if (item && item.type === 'blob') {
        repoTotal++;
        if (isValidBlobItem(item)) {
          filteredFiles.push({
            path: item.path,
            size: item.size,
            type: item.type,
            sha: item.sha,
          });
        }
      }
    }

    return NextResponse.json({
      files: filteredFiles,
      total: filteredFiles.length,
      repoTotal,
    });
  } catch (error: unknown) {
    console.error('Scan repo error:', error);
    const errorMessage: string = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}