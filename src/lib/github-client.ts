/**
 * @file src/lib/github-client.ts
 * @version v49.2.0-EMG-SOVEREIGN
 * @description Readable, modular, and modern GitHub API client utilizing pristine idioms and clear architectural boundaries.
 */

export interface GitHubRequestOptions extends RequestInit {
  headers?: Record<string, string> | Headers;
}

export interface GitHubClientInterface {
  request(token: string, url: string, options?: GitHubRequestOptions): Promise<Response>;
}

const GITHUB_API_BASE_URL = 'https://api.github.com';
const DEFAULT_GITHUB_ACCEPT_HEADER = 'application/vnd.github.v3+json';

/**
 * Normalizes relative or absolute GitHub URL paths into a fully qualified API endpoint.
 */
function buildGitHubEndpoint(url: string): string {
  const isRelativePath = url.startsWith('/');
  return isRelativePath ? `${GITHUB_API_BASE_URL}${url}` : `${GITHUB_API_BASE_URL}/${url}`;
}

/**
 * Ensures request headers are instantiated as a Headers instance with required authentication and defaults.
 */
function prepareRequestHeaders(token: string, customHeaders?: Record<string, string> | Headers): Headers {
  const headers = customHeaders instanceof Headers 
    ? customHeaders 
    : new Headers(customHeaders);

  headers.set('Authorization', `Bearer ${token}`);
  
  if (!headers.has('Accept')) {
    headers.set('Accept', DEFAULT_GITHUB_ACCEPT_HEADER);
  }

  return headers;
}

export const GitHubClient: GitHubClientInterface = {
  async request(token: string, url: string, options: GitHubRequestOptions = {}): Promise<Response> {
    if (!token) {
      throw new TypeError('EMG-CORE-ERR: Authentication token is required for GitHubClient requests.');
    }
    if (!url) {
      throw new TypeError('EMG-CORE-ERR: Target URL path is required for GitHubClient requests.');
    }

    const endpoint = buildGitHubEndpoint(url);
    const headers = prepareRequestHeaders(token, options.headers);

    const sanitizedOptions: RequestInit = {
      ...options,
      headers,
    };

    try {
      return await fetch(endpoint, sanitizedOptions);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`[EMG-CORE] GitHubClient network failure for endpoint "${endpoint}": ${errorMessage}`);
    }
  },
};