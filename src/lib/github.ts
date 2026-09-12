/**
 * @fileoverview GitHub Configuration and Credential Manager
 * Provides type-safe access and retrieval of GitHub integration settings.
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

const STORAGE_KEYS = {
  USERNAME: "af_github_username",
  REPO: "af_github_repo",
  TOKEN: "af_github_token",
} as const;

const EMPTY_TOKEN = "";

const DEFAULT_CONFIG: GitHubConfig = Object.freeze({
  username: DEFAULT_USERNAME,
  repoName: DEFAULT_REPO,
  token: EMPTY_TOKEN,
  hasValidToken: false,
  isDemoMode: true,
});

/**
 * Checks if the window runtime environment is currently available.
 */
const isBrowser = (): boolean => typeof window !== "undefined";

/**
 * Safely accesses persistent local storage layers with robust fallback handling.
 */
const getLocalStorageItem = (key: string): string | null => {
  try {
    return isBrowser() && localStorage.length > 0 ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
};

/**
 * Safely accesses temporary session storage layers with robust fallback handling.
 */
const getSessionStorageItem = (key: string): string | null => {
  try {
    return isBrowser() && sessionStorage.length > 0 ? sessionStorage.getItem(key) : null;
  } catch {
    return null;
  }
};

/**
 * Retrieves and validates GitHub configuration and authorization tokens from storage layers.
 * 
 * @returns {GitHubConfig} The frozen configuration object.
 */
export const getGitHubConfig = (): GitHubConfig => {
  const storedUsername = getLocalStorageItem(STORAGE_KEYS.USERNAME);
  const storedRepoName = getLocalStorageItem(STORAGE_KEYS.REPO);
  const storedToken = getSessionStorageItem(STORAGE_KEYS.TOKEN) ?? getLocalStorageItem(STORAGE_KEYS.TOKEN);

  if (!storedUsername && !storedRepoName && !storedToken) {
    return DEFAULT_CONFIG;
  }

  const resolvedUsername = storedUsername ?? DEFAULT_USERNAME;
  const resolvedRepoName = storedRepoName ?? DEFAULT_REPO;
  const resolvedToken = storedToken ?? EMPTY_TOKEN;

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