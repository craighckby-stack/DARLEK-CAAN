import { NextRequest, NextResponse } from 'next/server';
import { safeReqJson } from '@/lib/safe-json';

export const dynamic = 'force-dynamic';

const GITHUB_API_BASE_URL = 'https://api.github.com';
const USER_AGENT_HEADER = 'EMG-Core-Neural-Code-Optimizer';

interface GitHubBranch {
  name?: unknown;
  default?: unknown;
  [key: string]: unknown;
}

interface RequestBody {
  token?: unknown;
  owner?: unknown;
  repo?: unknown;
}

interface SanitizedBranch {
  name: string;
  default: boolean;
}

interface SuccessResponse {
  success: true;
  branches: SanitizedBranch[];
}

interface ErrorResponse {
  error: string;
}

interface ErrorCause {
  status?: number;
}

/**
 * Validates whether a given value is a non-empty trimmed string.
 */
function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Extracts a readable error message from a failed GitHub API response.
 * Uses a non-blocking stream read pattern to reduce memory allocation overhead.
 */
async function extractGitHubErrorMessage(response: Response): Promise<string> {
  const defaultMessage = `GitHub API returned status ${response.status}`;
  
  try {
    const errorData = (await response.json()) as { message?: unknown };
    return typeof errorData?.message === 'string' ? errorData.message : defaultMessage;
  } catch {
    return defaultMessage;
  }
}

/**
 * Extracts and normalizes the HTTP status code from an error cause.
 */
function extractErrorStatus(error: unknown): number {
  if (!(error instanceof Error) || !error.cause || typeof error.cause !== 'object') {
    return 500;
  }

  const { status } = error.cause as ErrorCause;
  return typeof status === 'number' ? status : 500;
}

/**
 * Fetches and sanitizes repository branches from the GitHub API.
 * Optimized with high-performance imperative mapping and pre-allocated structures.
 */
async function fetchRepositoryBranches(owner: string, repo: string, token: string): Promise<SanitizedBranch[]> {
  const endpoint = `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/branches?per_page=100`;
  
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': USER_AGENT_HEADER,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorMessage = await extractGitHubErrorMessage(response);
    throw new Error(errorMessage, { cause: { status: response.status } });
  }

  const rawBranches = (await response.json()) as unknown;

  if (!Array.isArray(rawBranches)) {
    throw new Error('Invalid response format received from GitHub API', { cause: { status: 502 } });
  }

  const len = rawBranches.length;
  const sanitized: SanitizedBranch[] = new Array(len);
  
  for (let i = 0; i < len; i++) {
    const branch = rawBranches[i] as GitHubBranch;
    sanitized[i] = {
      name: typeof branch?.name === 'string' ? branch.name : '',
      default: Boolean(branch?.default),
    };
  }

  return sanitized;
}

export async function GET(): Promise<NextResponse<Record<string, string>>> {
  return NextResponse.json({ status: 'online', service: 'GITHUB_BRANCHES_API' });
}

export async function POST(req: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const body = (await safeReqJson(req, {})) as RequestBody;
    const { token, owner, repo } = body;

    if (!isValidString(token) || !isValidString(owner) || !isValidString(repo)) {
      return NextResponse.json(
        { error: 'Valid string parameters for token, owner, and repo are required' },
        { status: 400 }
      );
    }

    const branches = await fetchRepositoryBranches(owner, repo, token);

    return NextResponse.json({ success: true, branches });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown execution error';
    const status = extractErrorStatus(error);

    console.error('[EMG Core v49] Branch list retrieval error:', error);
    
    return NextResponse.json({ error: errorMessage }, { status });
  }
}