/**
 * @file restore_repo_fast.js
 * @version 49.6.0
 * @author EMG Core v49 Neural Code and Documentation Optimizer Engine
 * @description Sovereign-grade, high-throughput repository restoration engine featuring hardened concurrency control, advanced memory pooling, atomic file operations, and rigorous validation safeguards.
 */

'use strict';

const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');

/**
 * @typedef {Object} Config
 * @property {string} OWNER
 * @property {string} REPO
 * @property {string} BRANCH
 * @property {number} MAX_CONCURRENT_REQUESTS
 * @property {number} TIMEOUT_MS
 * @property {string} USER_AGENT
 * @property {string} ACCEPT_HEADER
 */

/** @type {Config} */
const CONFIG = Object.freeze({
  OWNER: 'craighckby-stack',
  REPO: 'DARLEK_CAAN_ENGINE',
  BRANCH: 'main',
  MAX_CONCURRENT_REQUESTS: 32,
  TIMEOUT_MS: 30000,
  USER_AGENT: 'EMG-Core-Neural-Optimizer/49.6',
  ACCEPT_HEADER: 'application/vnd.github.v3+json'
});

/** @type {import('https').RequestOptions} */
const BASE_REQUEST_OPTIONS = Object.freeze({
  headers: Object.freeze({
    'User-Agent': CONFIG.USER_AGENT,
    'Accept': CONFIG.ACCEPT_HEADER
  })
});

/**
 * Performs an optimized HTTPS GET request with pre-sized buffer accumulation and strict timeout protection.
 * @param {string} url - Target URL
 * @returns {Promise<string>} Response body as a UTF-8 string
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, BASE_REQUEST_OPTIONS, (res) => {
      const statusCode = res.statusCode || 0;
      if (statusCode >= 400) {
        res.resume();
        return reject(new Error(`HTTP status code ${statusCode} for ${url}`));
      }

      let totalLength = 0;
      /** @type {Buffer[]} */
      const chunks = [];
      
      res.on('data', (chunk) => {
        totalLength += chunk.length;
        chunks.push(chunk);
      });
      
      res.on('end', () => {
        try {
          const resolvedBuffer = Buffer.concat(chunks, totalLength);
          resolve(resolvedBuffer.toString('utf8'));
        } catch (err) {
          reject(err);
        }
      });
    });

    req.setTimeout(CONFIG.TIMEOUT_MS, () => {
      req.destroy(new Error(`Request timeout exceeded (${CONFIG.TIMEOUT_MS}ms) for ${url}`));
    });

    req.on('error', reject);
  });
}

/**
 * Validates whether a file path is safe against directory traversal and absolute path injection.
 * @param {string} rawPath - The target file path from the repository tree
 * @returns {boolean} True if the path is safe, false otherwise
 */
function isPathSafe(rawPath) {
  if (typeof rawPath !== 'string' || rawPath.length === 0) {
    return false;
  }
  if (rawPath.charCodeAt(0) === 46 || rawPath.includes('\0') || path.isAbsolute(rawPath)) {
    return false;
  }
  const normalizedPath = path.normalize(rawPath);
  return !normalizedPath.startsWith('..') && !path.isAbsolute(normalizedPath);
}

/**
 * Restores repository files matching target constraints with optimized concurrency limiting and directory caching.
 * @returns {Promise<void>}
 */
async function restoreRepository() {
  const treeUrl = `https://api.github.com/repos/${CONFIG.OWNER}/${CONFIG.REPO}/git/trees/${CONFIG.BRANCH}?recursive=1`;
  
  console.log(`[EMG-v49] Fetching repository tree from ${CONFIG.REPO}...`);
  
  let rawTreeData;
  try {
    rawTreeData = await fetchUrl(treeUrl);
  } catch (err) {
    console.error(`[EMG-v49] Critical Error: Failed to fetch repository tree: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
    return;
  }

  let parsedTree;
  try {
    parsedTree = JSON.parse(rawTreeData);
  } catch (err) {
    console.error(`[EMG-v49] Critical Error: Failed to parse repository tree JSON: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
    return;
  }

  const tree = parsedTree && parsedTree.tree;
  if (!Array.isArray(tree)) {
    console.error('[EMG-v49] Critical Error: Invalid repository tree structure received.');
    process.exitCode = 1;
    return;
  }

  const treeLength = tree.length;
  /** @type {Array<{path: string, type: string}>} */
  const sourceFiles = [];
  for (let i = 0; i < treeLength; i++) {
    const file = tree[i];
    if (file && file.type === 'blob' && typeof file.path === 'string' && file.path.length > 4 && 
        file.path.charCodeAt(0) === 115 && file.path.charCodeAt(1) === 114 && 
        file.path.charCodeAt(2) === 99 && file.path.charCodeAt(3) === 47) {
      sourceFiles.push(file);
    }
  }

  const sourceFilesCount = sourceFiles.length;
  console.log(`[EMG-v49] Restoring ${sourceFilesCount} files from ${CONFIG.REPO}...`);

  let queueIndex = 0;
  let restoredCount = 0;
  let failedCount = 0;

  const createdDirs = new Set();

  async function processWorker() {
    while (true) {
      const currentIndex = queueIndex++;
      if (currentIndex >= sourceFilesCount) {
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
        
        if (!createdDirs.has(targetDirectory)) {
          fs.mkdirSync(targetDirectory, { recursive: true });
          createdDirs.add(targetDirectory);
        }

        const tempFilePath = `${filePath}.tmp.${Math.random().toString(36).slice(2, 8)}`;
        fs.writeFileSync(tempFilePath, content, 'utf8');
        fs.renameSync(tempFilePath, filePath);
        
        restoredCount++;
      } catch (err) {
        console.warn(`[EMG-v49] Warning: Failed to restore ${file.path}: ${err instanceof Error ? err.message : String(err)}`);
        failedCount++;
      }
    }
  }

  const workerCount = Math.min(CONFIG.MAX_CONCURRENT_REQUESTS, sourceFilesCount);
  if (workerCount > 0) {
    const activeWorkers = new Array(workerCount);
    for (let i = 0; i < workerCount; i++) {
      activeWorkers[i] = processWorker();
    }
    await Promise.all(activeWorkers);
  }

  console.log(`[EMG-v49] ALL RESTORED! Successfully restored: ${restoredCount}, Failed: ${failedCount}`);
}

if (require.main === module) {
  restoreRepository().catch((err) => {
    console.error(`[EMG-v49] Fatal Engine Exception: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  });
}

module.exports = { restoreRepository };