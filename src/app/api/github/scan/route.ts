import { NextRequest, NextResponse } from 'next/server';
import type { ScanRepoBody, GitHubFile } from '@/lib/types';
import { safeReqJson } from '@/lib/safe-json';

export const dynamic = 'force-dynamic';

const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_API_VERSION_HEADER = 'application/vnd.github.v3+json';

const MAX_OWNER_LENGTH = 100;
const MAX_REPO_LENGTH = 100;
const MAX_BRANCH_LENGTH = 255;
const MAX_TOKEN_LENGTH = 500;
const MAX_TREE_ITEMS = 50000;

const SAFE_NAME_REGEX = /^[a-zA-Z0-9_.-]+$/;

const EXCLUDED_DIRECTORIES = Object.freeze([
  'node_modules/',
  '.git/',
  'dist/',
  'build/',
  '.next/',
  '__pycache__/',
  '.svn/',
]);

const EXCLUDED_FILES_SET = Object.freeze(
  new Set([
    '.env',
    '.env.local',
    'package-lock.json',
    'yarn.lock',
    '.DS_Store',
  ])
);

interface GitHubTreeItem {
  path: string;
  size: number;
  type: string;
  sha: string;
}

interface GitHubTreeResponse {
  tree?: GitHubTreeItem[];
}

/**
 * Determines whether a given tree item is a valid file that passes exclusion filters and bounds constraints.
 */
function isValidBlobItem(item: GitHubTreeItem): boolean {
  if (!item || item.type !== 'blob' || typeof item.path !== 'string' || typeof item.size !== 'number') {
    return false;
  }

  const { path } = item;
  if (path.length > 1024 || path.includes('..') || path.startsWith('/')) {
    return false;
  }

  for (let i = 0; i < EXCLUDED_DIRECTORIES.length; i++) {
    if (path.includes(EXCLUDED_DIRECTORIES[i])) {
      return false;
    }
  }

  const lastSlashIndex = path.lastIndexOf('/');
  const fileName = lastSlashIndex === -1 ? path : path.substring(lastSlashIndex + 1);

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
    const body = await safeReqJson<ScanRepoBody>(req, {} as ScanRepoBody);
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

    const repositoryTreeUrl = `${GITHUB_API_BASE_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(branch)}?recursive=1`;

    const githubResponse = await fetch(repositoryTreeUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: GITHUB_API_VERSION_HEADER,
      },
    });

    if (!githubResponse.ok) {
      const errorDetails = await githubResponse.text();
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
    let repoTotal = 0;

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
  } catch (error) {
    console.error('Scan repo error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}