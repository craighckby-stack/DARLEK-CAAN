export const GITHUB_API_BASE = 'https://api.github.com' as const;

export interface DeploymentResult {
  readonly file: string;
  readonly success: boolean;
  readonly error?: string;
}

export type GitHubToken = string & { readonly __brand: unique symbol };

export interface GitHubHeaders extends Readonly<Record<string, string>> {
  readonly Authorization: string;
  readonly Accept: 'application/vnd.github.v3+json';
  readonly 'Content-Type': 'application/json';
}

const HEADER_CACHE = new Map<string, GitHubHeaders>();

export const DEFAULT_HEADERS = (token: string): GitHubHeaders => {
  if (typeof token !== 'string') {
    throw new TypeError('A valid string token is required to construct GitHub API headers.');
  }

  const cached = HEADER_CACHE.get(token);
  if (cached !== undefined) {
    return cached;
  }

  if (token.length === 0 || token.charCodeAt(0) === 32) {
    const trimmed = token.trim();
    if (trimmed.length === 0) {
      throw new TypeError('A valid, non-empty string token is required to construct GitHub API headers.');
    }
  }

  const headers: GitHubHeaders = Object.freeze({
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  });

  HEADER_CACHE.set(token, headers);
  return headers;
};