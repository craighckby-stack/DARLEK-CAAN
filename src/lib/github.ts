/**
 * @fileoverview GitHub Configuration and Credential Manager (EMG Core v49 Optimized)
 * Maximizes type-safety, memory efficiency, and runtime execution speed for state retrieval.
 */

export interface GitHubConfig {
  readonly username: string;
  readonly repoName: string;
  readonly token: string;
  readonly hasValidToken: boolean;
  readonly isDemoMode: boolean;
}

const DEFAULT_USERNAME = "craighckby-stack";
const DEFAULT_REPO = "DARLEK-CAAN-Cognitive-Engine";
const TOKEN_MIN_VALID_LENGTH = 15;

// Pre-allocated frozen default configuration for zero-allocation performance paths when storage is empty
const EMPTY_TOKEN = "";
const DEFAULT_CONFIG: GitHubConfig = Object.freeze({
  username: DEFAULT_USERNAME,
  repoName: DEFAULT_REPO,
  token: EMPTY_TOKEN,
  hasValidToken: false,
  isDemoMode: true,
});

/**
 * Safely accesses storage layers with robust fallback handling and optimized lookups.
 */
const getStorageItem = (key: string): string | null => {
  try {
    return (typeof window !== "undefined" && localStorage.length > 0) ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
};

const getSessionStorageItem = (key: string): string | null => {
  try {
    return (typeof window !== "undefined" && sessionStorage.length > 0) ? sessionStorage.getItem(key) : null;
  } catch {
    return null;
  }
};

/**
 * Retrieves and validates GitHub configuration and authorization tokens from storage layers.
 * Utilizes constant-time assertions and zero-allocation immutable returns with robust error isolation.
 * 
 * @returns {GitHubConfig} The frozen configuration object.
 */
export const getGitHubConfig = (): GitHubConfig => {
  const username = getStorageItem("af_github_username");
  const repoName = getStorageItem("af_github_repo");
  const token = getSessionStorageItem("af_github_token") ?? getStorageItem("af_github_token");

  // Fast-path return for default baseline configuration to prevent object allocation churn
  if (!username && !repoName && !token) {
    return DEFAULT_CONFIG;
  }

  const resolvedUsername = username ?? DEFAULT_USERNAME;
  const resolvedRepoName = repoName ?? DEFAULT_REPO;
  const resolvedToken = token ?? EMPTY_TOKEN;

  const hasValidToken = resolvedToken.length > TOKEN_MIN_VALID_LENGTH;
  const isDemoMode = resolvedUsername === DEFAULT_USERNAME && resolvedRepoName === DEFAULT_REPO;

  return Object.freeze({
    username: resolvedUsername,
    repoName: resolvedRepoName,
    token: resolvedToken,
    hasValidToken,
    isDemoMode,
  });
};