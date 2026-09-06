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

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_API_HEADERS = (token: string): HeadersInit => ({
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github.v3+json',
});

const POPULAR_ORGS_QUERY = 'user:microsoft+user:google+user:ibm+user:firebase+user:deepmind+user:vercel+user:facebook';

// Pre-allocate map mapping for inline transformation and deduplication to avoid intermediate array allocations.
function mapRepositoryData(rawRepo: GitHubRepoRaw, isGlobalSiphon: boolean): SanitizedRepository {
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
    headers: GITHUB_API_HEADERS(token),
    cache: 'no-store',
  });
}

async function fetchGlobalSiphonRepositories(token: string): Promise<Response> {
  return fetch(`${GITHUB_API_BASE}/search/repositories?q=${POPULAR_ORGS_QUERY}&sort=stars&order=desc&per_page=50`, {
    headers: GITHUB_API_HEADERS(token),
    cache: 'no-store',
  });
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

    // Use a Map directly for O(1) insertion deduplication, minimizing object allocations.
    const repoMap = new Map<number, SanitizedRepository>();

    if (userResponse.ok) {
      const userReposData = (await userResponse.json()) as GitHubRepoRaw[];
      const len = userReposData.length;
      for (let i = 0; i < len; i++) {
        const repo = userReposData[i];
        repoMap.set(repo.id, mapRepositoryData(repo, false));
      }
    } else {
      userResponse.body?.cancel();
      console.warn('Failed to load user repos:', userResponse.status);
    }

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      const searchReposItems = (searchData.items || []) as GitHubRepoRaw[];
      const len = searchReposItems.length;
      for (let i = 0; i < len; i++) {
        const repo = searchReposItems[i];
        // Only set if not already present or prioritize user repos cleanly
        if (!repoMap.has(repo.id)) {
          repoMap.set(repo.id, mapRepositoryData(repo, true));
        }
      }
    } else {
      searchResponse.body?.cancel();
      console.warn('Failed to load global siphon repos:', searchResponse.status);
    }

    return NextResponse.json({ success: true, repos: Array.from(repoMap.values()) });
  } catch (error) {
    console.error('User repos list error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}