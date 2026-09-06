import { NextRequest, NextResponse } from 'next/server';
import { safeReqJson } from '@/lib/safe-json';

export const dynamic = 'force-dynamic';

interface GitHubRepoRaw {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  default_branch?: string;
  html_url: string;
  description?: string;
  language?: string;
}

interface SanitizedRepository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  defaultBranch: string;
  url: string;
  description: string;
  language: string;
  isGlobalSiphon: boolean;
}

interface GitHubSearchResponse {
  items?: GitHubRepoRaw[];
}

const GITHUB_API_BASE = 'https://api.github.com';
const POPULAR_ORGS_QUERY = 'user:microsoft+user:google+user:ibm+user:firebase+user:deepmind+user:vercel+user:facebook';

const createGitHubHeaders = (token: string): HeadersInit => ({
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github.v3+json',
});

function sanitizeRepository(rawRepo: GitHubRepoRaw, isGlobalSiphon: boolean): SanitizedRepository {
  return {
    id: rawRepo.id,
    name: rawRepo.name,
    fullName: rawRepo.full_name,
    owner: rawRepo.owner?.login ?? '',
    defaultBranch: rawRepo.default_branch || 'main',
    url: rawRepo.html_url,
    description: rawRepo.description || '',
    language: rawRepo.language || '',
    isGlobalSiphon,
  };
}

async function fetchUserRepositories(token: string): Promise<Response> {
  return fetch(`${GITHUB_API_BASE}/user/repos?per_page=50&sort=updated`, {
    headers: createGitHubHeaders(token),
    cache: 'no-store',
  });
}

async function fetchGlobalSiphonRepositories(token: string): Promise<Response> {
  return fetch(`${GITHUB_API_BASE}/search/repositories?q=${POPULAR_ORGS_QUERY}&sort=stars&order=desc&per_page=50`, {
    headers: createGitHubHeaders(token),
    cache: 'no-store',
  });
}

async function processRepositoryResponse(
  response: Response,
  repositoryMap: Map<number, SanitizedRepository>,
  isGlobalSiphon: boolean,
  warningLabel: string
): Promise<void> {
  if (!response.ok) {
    response.body?.cancel();
    console.warn(`Failed to load ${warningLabel}:`, response.status);
    return;
  }

  const data = await response.json();
  const rawRepos: GitHubRepoRaw[] = Array.isArray(data) ? data : (data as GitHubSearchResponse).items ?? [];

  for (const repo of rawRepos) {
    if (!isGlobalSiphon || !repositoryMap.has(repo.id)) {
      repositoryMap.set(repo.id, sanitizeRepository(repo, isGlobalSiphon));
    }
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'online', service: 'GITHUB_USER_REPOS_API' });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await safeReqJson(req, {});
    const token = body?.token;

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'GitHub token is required' }, { status: 400 });
    }

    const [userResponse, searchResponse] = await Promise.all([
      fetchUserRepositories(token),
      fetchGlobalSiphonRepositories(token),
    ]);

    if (!userResponse.ok && userResponse.status === 401) {
      return NextResponse.json(
        { error: 'GitHub token is invalid or expired. Please update your API key.' },
        { status: 401 }
      );
    }

    const repositoryMap = new Map<number, SanitizedRepository>();

    await processRepositoryResponse(userResponse, repositoryMap, false, 'user repos');
    await processRepositoryResponse(searchResponse, repositoryMap, true, 'global siphon repos');

    return NextResponse.json({ success: true, repos: Array.from(repositoryMap.values()) });
  } catch (error) {
    console.error('User repos list error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}