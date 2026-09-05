import { NextRequest, NextResponse } from 'next/server';
import type { ScanRepoBody, GitHubFile } from '@/lib/types';
import { safeReqJson } from '@/lib/safe-json';

export const dynamic = 'force-dynamic';

const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_API_VERSION_HEADER = 'application/vnd.github.v3+json';

const EXCLUDED_DIRECTORIES = Object.freeze([
  'node_modules/',
  '.git/',
  'dist/',
  'build/',
  '.next/',
  '__pycache__/',
  '.svn/',
]);

const EXCLUDED_FILES = Object.freeze([
  '.env',
  '.env.local',
  'package-lock.json',
  'yarn.lock',
  '.DS_Store',
]);

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
 * Validates whether a file path resides within an excluded directory.
 */
function isPathInExcludedDirectory(filePath: string): boolean {
  return EXCLUDED_DIRECTORIES.some((dir) => filePath.includes(dir));
}

/**
 * Validates whether a file name matches any explicitly excluded system/config files.
 */
function isExcludedFileName(filePath: string): boolean {
  const pathSegments = filePath.split('/');
  const fileName = pathSegments[pathSegments.length - 1];
  return EXCLUDED_FILES.includes(fileName);
}

/**
 * Determines if a tree item should be retained in the final file scan list.
 */
function isValidBlobItem(item: GitHubTreeItem): boolean {
  if (item.type !== 'blob') {
    return false;
  }

  return !isPathInExcludedDirectory(item.path) && !isExcludedFileName(item.path);
}

/**
 * Handles health-check requests for the GitHub scan service.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'online', service: 'GITHUB_SCAN_API' });
}

/**
 * Scans a GitHub repository tree recursively while filtering out ignored files and directories.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: ScanRepoBody = await safeReqJson(req, {} as ScanRepoBody);
    const { token, owner, repo, branch } = body;

    const encodedBranch = encodeURIComponent(branch);
    const repositoryTreeUrl = `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/git/trees/${encodedBranch}?recursive=1`;

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

    if (!data.tree) {
      return NextResponse.json(
        { error: 'No tree data returned. Check the branch name.' },
        { status: 400 }
      );
    }

    const allBlobs = data.tree.filter((item) => item.type === 'blob');
    const filteredFiles: GitHubFile[] = allBlobs
      .filter(isValidBlobItem)
      .map((item) => ({
        path: item.path,
        size: item.size,
        type: item.type,
        sha: item.sha,
      }));

    return NextResponse.json({
      files: filteredFiles,
      total: filteredFiles.length,
      repoTotal: allBlobs.length,
    });
  } catch (error) {
    console.error('Scan repo error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}