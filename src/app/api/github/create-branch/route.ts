import { NextRequest, NextResponse } from "next/server";
import { safeReqJson } from "@/lib/safe-json";

export const dynamic = "force-dynamic";

interface CreateBranchPayload {
  token?: string;
  owner?: string;
  repo?: string;
  baseBranch?: string;
  newBranch?: string;
}

interface GitHubRefResponse {
  object?: {
    sha?: string;
  };
}

interface GitHubErrorResponse {
  message?: string;
}

const GITHUB_API_BASE = "https://api.github.com";
const USER_AGENT = "EMG-Core-v49-Neural-Code-Optimizer";
const GITHUB_API_VERSION = "application/vnd.github.v3+json";

/**
 * Generates standard HTTP headers for GitHub API authentication and metadata.
 */
function createGitHubHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: GITHUB_API_VERSION,
    "User-Agent": USER_AGENT,
  };
}

/**
 * Safely parses and extracts error message from failed GitHub API responses.
 */
async function parseGitHubError(response: Response, defaultMessage: string): Promise<string> {
  const errorData = (await response.json().catch(() => ({}))) as GitHubErrorResponse;
  return errorData.message || `${defaultMessage}: ${response.status}`;
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: "online", service: "GITHUB_CREATE_BRANCH_API" });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await safeReqJson(req, {})) as CreateBranchPayload;
    const { token, owner, repo, baseBranch, newBranch } = body;

    if (!token || !owner || !repo || !baseBranch || !newBranch) {
      return NextResponse.json(
        { error: "token, owner, repo, baseBranch, and newBranch are required" },
        { status: 400 }
      );
    }

    const headers = createGitHubHeaders(token);

    // 1. Fetch the SHA of the base branch
    const baseRefUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(baseBranch)}`;
    const baseRefResponse = await fetch(baseRefUrl, { headers, cache: "no-store" });

    if (!baseRefResponse.ok) {
      const errorMessage = await parseGitHubError(baseRefResponse, "Failed to fetch base branch ref");
      return NextResponse.json({ error: errorMessage }, { status: baseRefResponse.status });
    }

    const refData = (await baseRefResponse.json()) as GitHubRefResponse;
    const baseSha = refData?.object?.sha;

    if (!baseSha) {
      return NextResponse.json(
        { error: "Failed to resolve SHA from base branch reference data." },
        { status: 502 }
      );
    }

    // 2. Create the new git reference (branch) using the base SHA
    const createRefUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs`;
    const createRefResponse = await fetch(createRefUrl, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: `refs/heads/${newBranch}`,
        sha: baseSha,
      }),
      cache: "no-store",
    });

    if (!createRefResponse.ok) {
      const errorMessage = await parseGitHubError(createRefResponse, "Failed to create branch");
      return NextResponse.json({ error: errorMessage }, { status: createRefResponse.status });
    }

    return NextResponse.json({ success: true, branch: newBranch });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Create branch internal execution error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}