/**
 * @file restore_repo_fast.js
 * @version 49.4.0
 * @author EMG Core v49 Neural Code and Documentation Optimizer Engine
 * @description High-performance, memory-efficient, sovereign repository restoration engine with concurrency throttling and robust error handling.
 */

'use strict';

const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');

const CONFIG = Object.freeze({
  OWNER: 'craighckby-stack',
  REPO: 'DARLEK_CAAN_ENGINE',
  BRANCH: 'main',
  MAX_CONCURRENT_REQUESTS: 16,
  TIMEOUT_MS: 30000,
  USER_AGENT: 'EMG-Core-Neural-Optimizer/49.4',
  ACCEPT_HEADER: 'application/vnd.github.v3+json'
});

/**
 * Performs an HTTPS GET request returning a promise resolving to the response body string with strict timeout protection.
 * @param {string} url - Target URL
 * @returns {Promise<string>} Response body
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      headers: {
        'User-Agent': CONFIG.USER_AGENT,
        'Accept': CONFIG.ACCEPT_HEADER
      }
    };

    const req = https.get(url, requestOptions, (res) => {
      if (res.statusCode && res.statusCode >= 400) {
        res.resume();
        return reject(new Error(`HTTP status code ${res.statusCode} for ${url}`));
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });

    req.setTimeout(CONFIG.TIMEOUT_MS, () => {
      req.destroy(new Error(`Request timeout exceeded (${CONFIG.TIMEOUT_MS}ms) for ${url}`));
    });

    req.on('error', (err) => reject(err));
  });
}

/**
 * Validates whether a file path is safe against directory traversal and absolute path injection.
 * @param {string} rawPath - The target file path from the repository tree
 * @returns {boolean} True if the path is safe, false otherwise
 */
function isPathSafe(rawPath) {
  const normalizedPath = path.normalize(rawPath);
  return !normalizedPath.startsWith('..') && !path.isAbsolute(normalizedPath) && !normalizedPath.includes('\0');
}

/**
 * Restores repository files matching target constraints with concurrency limiting.
 * @returns {Promise<void>}
 */
async function restoreRepository() {
  const treeUrl = `https://api.github.com/repos/${CONFIG.OWNER}/${CONFIG.REPO}/git/trees/${CONFIG.BRANCH}?recursive=1`;
  
  console.log(`[EMG-v49] Fetching repository tree from ${CONFIG.REPO}...`);
  
  let rawTreeData;
  try {
    rawTreeData = await fetchUrl(treeUrl);
  } catch (err) {
    console.error(`[EMG-v49] Critical Error: Failed to fetch repository tree: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  let parsedTree;
  try {
    parsedTree = JSON.parse(rawTreeData);
  } catch (err) {
    console.error(`[EMG-v49] Critical Error: Failed to parse repository tree JSON: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  const tree = parsedTree.tree;
  if (!Array.isArray(tree)) {
    console.error('[EMG-v49] Critical Error: Invalid repository tree structure received.');
    process.exitCode = 1;
    return;
  }

  const sourceFiles = tree.filter((file) => file && file.type === 'blob' && typeof file.path === 'string' && file.path.startsWith('src/'));
  console.log(`[EMG-v49] Restoring ${sourceFiles.length} files from ${CONFIG.REPO}...`);

  let queueIndex = 0;
  let restoredCount = 0;
  let failedCount = 0;

  async function processWorker() {
    while (true) {
      const currentIndex = queueIndex++;
      if (currentIndex >= sourceFiles.length) {
        return;
      }

      const file = sourceFiles[currentIndex];
      const filePath = path.normalize(file.path);
      
      if (!isPathSafe(filePath)) {
        console.warn(`[EMG-v49] Skipped unsafe path: ${file.path}`);
        failedCount++;
        continue;
      }

      const fileUrl = `https://raw.githubusercontent.com/${CONFIG.OWNER}/${CONFIG.REPO}/${CONFIG.BRANCH}/${file.path}`;

      try {
        const content = await fetchUrl(fileUrl);
        const targetDirectory = path.dirname(filePath);
        
        fs.mkdirSync(targetDirectory, { recursive: true });
        fs.writeFileSync(filePath, content, 'utf8');
        restoredCount++;
      } catch (err) {
        console.warn(`[EMG-v49] Warning: Failed to restore ${file.path}: ${err.message}`);
        failedCount++;
      }
    }
  }

  const activeWorkers = Array.from(
    { length: Math.min(CONFIG.MAX_CONCURRENT_REQUESTS, sourceFiles.length) },
    () => processWorker()
  );

  await Promise.all(activeWorkers);

  console.log(`[EMG-v49] ALL RESTORED! Successfully restored: ${restoredCount}, Failed: ${failedCount}`);
}

if (require.main === module) {
  restoreRepository().catch((err) => {
    console.error(`[EMG-v49] Fatal Engine Exception: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { restoreRepository };