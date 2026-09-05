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
  });
}

async function fetchGlobalSiphonRepositories(token: string): Promise<Response> {
  return fetch(`${GITHUB_API_BASE}/search/repositories?q=${POPULAR_ORGS_QUERY}&sort=stars&order=desc&per_page=50`, {
    headers: GITHUB_API_HEADERS(token),
  });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'online', service: 'GITHUB_USER_REPOS_API' });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await safeReqJson(req, {});
    const { token } = body;

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

    const collectedRepositories: SanitizedRepository[] = [];

    if (userResponse.ok) {
      const userReposData: GitHubRepoRaw[] = await userResponse.json();
      const mappedUserRepos = userReposData.map((repo) => mapRepositoryData(repo, false));
      collectedRepositories.push(...mappedUserRepos);
    } else {
      const errorText = await userResponse.text();
      console.warn('Failed to load user repos:', userResponse.status, errorText);
    }

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      const searchReposItems: GitHubRepoRaw[] = searchData.items || [];
      const mappedSearchRepos = searchReposItems.map((repo) => mapRepositoryData(repo, true));
      collectedRepositories.push(...mappedSearchRepos);
    } else {
      const errorText = await searchResponse.text();
      console.warn('Failed to load global siphon repos:', searchResponse.status, errorText);
    }

    // Deduplicate repositories by unique ID
    const uniqueRepositories = Array.from(
      new Map(collectedRepositories.map((repo) => [repo.id, repo])).values()
    );

    return NextResponse.json({ success: true, repos: uniqueRepositories });
  } catch (error) {
    console.error('User repos list error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}