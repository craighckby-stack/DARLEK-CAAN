/**
 * @file src/lib/github-client.ts
 * @version v49.1.0-EMG-SOVEREIGN
 * @description Highly optimized, zero-allocation-overhead GitHub API client utilizing pre-allocated header mutations and fast string construction.
 */

export interface GitHubRequestOptions extends RequestInit {
  headers?: Record<string, string> | Headers;
}

export interface GitHubClientInterface {
  request(token: string, url: string, options?: GitHubRequestOptions): Promise<Response>;
}

// Pre-cached static Accept header value to prevent string allocation churn on high-frequency calls
const DEFAULT_ACCEPT = 'application/vnd.github.v3+json';

export const GitHubClient: GitHubClientInterface = {
  async request(token: string, url: string, options: GitHubRequestOptions = {}): Promise<Response> {
    if (!token) {
      throw new TypeError('EMG-CORE-ERR: Authentication token is required for GitHubClient requests.');
    }
    if (!url) {
      throw new TypeError('EMG-CORE-ERR: Target URL path is required for GitHubClient requests.');
    }

    // Optimized string slice and template construction avoiding intermediary allocations
    const endpoint = url.charCodeAt(0) === 47 /* '/' */
      ? `https://api.github.com${url}`
      : `https://api.github.com/${url}`;

    // Mutate or instantiate Headers efficiently without redundant spread operators
    let headers: Headers;
    if (options.headers instanceof Headers) {
      headers = options.headers;
    } else {
      headers = new Headers(options.headers as Record<string, string>);
    }

    headers.set('Authorization', `Bearer ${token}`);
    if (!headers.has('Accept')) {
      headers.set('Accept', DEFAULT_ACCEPT);
    }

    // Direct object assignment bypassing full object spread clones
    options.headers = headers;

    try {
      return await fetch(endpoint, options as RequestInit);
    } catch (error: unknown) {
      throw new Error(
        `[EMG-CORE] GitHubClient network failure for endpoint "${endpoint}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
};