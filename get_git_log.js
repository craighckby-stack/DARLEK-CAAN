/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: get_git_log.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const https = require('https');

/**
 * Configuration constants for GitHub API interaction.
 */
const GITHUB_CONFIG = {
  USER_AGENT: 'EMG-Core-v49-Optimizer',
  ACCEPT_HEADER: 'application/vnd.github.v3+json',
  TARGET_PATH: 'src/app/page.tsx',
  TIMEOUT_MS: 10000,
  MAX_COMMITS_DISPLAY: 10
};

/**
 * Validates the repository input parameter.
 * 
 * @param {string} repo - The repository name to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidRepository(repo) {
  return typeof repo === 'string' && repo.trim().length > 0;
}

/**
 * Constructs the GitHub API URL for a specific repository and target path.
 * 
 * @param {string} repo - The repository name.
 * @returns {string} The fully qualified API URL.
 */
function buildGitHubApiUrl(repo) {
  return `https://api.github.com/repos/craighckby-stack/${repo}/commits?path=${GITHUB_CONFIG.TARGET_PATH}`;
}

/**
 * Configures network request options for the GitHub API.
 * 
 * @returns {Object} The request options object.
 */
function getRequestOptions() {
  return {
    headers: {
      'User-Agent': GITHUB_CONFIG.USER_AGENT,
      'Accept': GITHUB_CONFIG.ACCEPT_HEADER
    }
  };
}

/**
 * Formats and displays commit information to the console.
 * 
 * @param {string} repo - The repository name.
 * @param {Array<Object>} commits - The array of commit objects from the API.
 */
function displayCommits(repo, commits) {
  if (!Array.isArray(commits)) {
    console.log(`Unexpected response structure for ${repo}`);
    return;
  }

  console.log(`Found ${commits.length} commits for ${repo}:`);
  
  commits
    .slice(0, GITHUB_CONFIG.MAX_COMMITS_DISPLAY)
    .forEach((commitObj) => {
      const sha = commitObj?.sha ?? 'UNKNOWN_SHA';
      const message = commitObj?.commit?.message ?? 'No message provided';
      const date = commitObj?.commit?.author?.date ?? 'Unknown date';
      
      console.log(`- SHA: ${sha} | Message: ${message} | Date: ${date}`);
    });
}

/**
 * Handles the HTTP response stream by accumulating data and parsing JSON results.
 * 
 * @param {import('http').IncomingMessage} res - The HTTP response object.
 * @param {string} repo - The repository name.
 * @param {Function} resolve - Promise resolution callback.
 */
function handleResponse(res, repo, resolve) {
  res.setEncoding('utf8');
  
  let rawData = '';

  res.on('data', (chunk) => {
    rawData += chunk;
  });

  res.on('end', () => {
    try {
      if (res.statusCode !== 200) {
        console.error(`Failed to fetch commits for ${repo}: HTTP Status ${res.statusCode} - ${rawData}`);
        return resolve();
      }

      const parsedData = JSON.parse(rawData);
      displayCommits(repo, parsedData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error parsing commits for ${repo}:`, errorMessage);
    } finally {
      resolve();
    }
  });
}

/**
 * Fetches and displays recent commits for a specific file in a GitHub repository.
 * 
 * @param {string} repo - The repository name.
 * @returns {Promise<void>}
 */
function fetchCommits(repo) {
  return new Promise((resolve) => {
    if (!isValidRepository(repo)) {
      console.error('Invalid repository name provided.');
      return resolve();
    }

    const url = buildGitHubApiUrl(repo);
    console.log(`Fetching commits for ${repo} ${GITHUB_CONFIG.TARGET_PATH}...`);

    const req = https.get(url, getRequestOptions(), (res) => {
      handleResponse(res, repo, resolve);
    });

    req.on('error', (err) => {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Error requesting commits for ${repo}:`, errorMessage);
      resolve();
    });

    req.setTimeout(GITHUB_CONFIG.TIMEOUT_MS, () => {
      req.destroy();
      console.error(`Request timeout while fetching commits for ${repo}.`);
      resolve();
    });
  });
}

/**
 * Executes the commit retrieval process across targeted repositories.
 * 
 * @returns {Promise<void>}
 */
async function run() {
  try {
    await fetchCommits('DARLEK_CAAN_ENGINE');
    await fetchCommits('Darlek-Caan-vs-Jesus-Chess');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Critical execution failure in run():', errorMessage);
  }
}

// Execute core runner
run();