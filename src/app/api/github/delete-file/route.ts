import { NextRequest, NextResponse } from 'next/server';
import { safeReqJson } from '@/lib/safe-json';

export const dynamic = 'force-dynamic';

interface DeleteFileRequestBody {
  token?: string;
  owner?: string;
  repo?: string;
  branch?: string;
  path?: string;
  sha?: string;
  commitMessage?: string;
}

interface GitHubContentResponse {
  sha?: string;
}

interface GitHubDeleteResponse {
  commit?: {
    sha?: string;
    html_url?: string;
  };
}

const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_API_VERSION_HEADER = 'application/vnd.github.v3+json';

/**
 * Sanitizes and safely encodes a file path for GitHub API consumption.
 */
function sanitizePath(filePath: string): string {
  const cleanPath = filePath.replace(/^\/+|\/+$/g, '');
  return cleanPath.split('/').map(encodeURIComponent).join('/');
}

/**
 * Builds standard headers for GitHub API interactions.
 */
function buildGitHubHeaders(token: string, includeJsonContentType = false): Record<string, string> {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'Accept': GITHUB_API_VERSION_HEADER,
  };

  if (includeJsonContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

/**
 * Fetches the actual file SHA from GitHub if not provided or to ensure accuracy.
 */
async function getFileSha(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  filePath: string
): Promise<string | null> {
  try {
    const encodedPath = sanitizePath(filePath);
    const endpoint = `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`;
    
    const response = await fetch(endpoint, {
      headers: buildGitHubHeaders(token),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as GitHubContentResponse;
    return data.sha ?? null;
  } catch {
    return null;
  }
}

/**
 * Executes the file deletion request against the GitHub API.
 */
async function deleteGitHubFileResource(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  filePath: string,
  sha: string,
  commitMessage?: string
): Promise<Response> {
  const encodedPath = sanitizePath(filePath);
  const endpoint = `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/contents/${encodedPath}`;

  const payload = {
    message: commitMessage ?? `[DARLEK CANN] Delete ${filePath}`,
    sha,
    branch,
  };

  return fetch(endpoint, {
    method: 'DELETE',
    headers: buildGitHubHeaders(token, true),
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'online', service: 'GITHUB_DELETE_FILE_API' });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await safeReqJson(req, {})) as DeleteFileRequestBody;
    const { token, owner, repo, branch, path: filePath, sha, commitMessage } = body;

    if (!token || !owner || !repo || !branch || !filePath) {
      return NextResponse.json(
        { error: 'All fields are required: token, owner, repo, branch, path.' },
        { status: 400 }
      );
    }

    const resolvedSha = sha ?? (await getFileSha(token, owner, repo, branch, filePath));

    if (!resolvedSha) {
      return NextResponse.json({
        success: true,
        message: 'File did not exist, no deletion necessary.',
      });
    }

    const githubResponse = await deleteGitHubFileResource(
      token,
      owner,
      repo,
      branch,
      filePath,
      resolvedSha,
      commitMessage
    );

    if (!githubResponse.ok) {
      const errorDetails = await githubResponse.text();
      return NextResponse.json(
        { error: `GitHub API error during deletion: ${errorDetails}` },
        { status: githubResponse.status }
      );
    }

    const responseData = (await githubResponse.json()) as GitHubDeleteResponse;

    return NextResponse.json({
      success: true,
      commitSha: responseData.commit?.sha,
      commitUrl: responseData.commit?.html_url,
    });
  } catch (error: unknown) {
    console.error('Delete file error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}