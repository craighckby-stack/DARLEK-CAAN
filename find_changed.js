/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: find_changed.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');
const crypto = require('crypto');

/**
 * @typedef {Object} GitTreeNode
 * @property {string} path - The file path in the repository.
 * @property {string} mode - The file mode.
 * @property {string} type - The node type ('blob' | 'tree').
 * @property {string} sha - The Git SHA hash.
 * @property {number} [size] - The file size in bytes if available.
 * @property {string} [url] - API URL for the blob.
 */

/**
 * @typedef {Object} GitTreeResponse
 * @property {string} sha - The commit SHA.
 * @property {string} url - The tree API URL.
 * @property {GitTreeNode[]} tree - Array of tree nodes.
 * @property {boolean} truncated - Whether the response was truncated.
 */

/**
 * Recursively scans a directory for files using dirents to minimize filesystem I/O overhead.
 * Enforces strict input validation and path traversal sanitization.
 *
 * @param {string} dirPath - Directory path to traverse.
 * @param {string[]} [accumulator=[]] - Accumulator array for accumulated file paths.
 * @returns {string[]} List of discovered file paths.
 */
function walk(dirPath, accumulator = []) {
  if (typeof dirPath !== 'string' || dirPath.length === 0) {
    return accumulator;
  }

  // Resolve and validate absolute base path to protect against path traversal attacks
  const resolvedBase = path.resolve('src');
  const resolvedTarget = path.resolve(dirPath);

  if (!resolvedTarget.startsWith(resolvedBase)) {
    console.error(`Security violation: Attempted path traversal outside base directory: '${dirPath}'`);
    return accumulator;
  }

  if (!fs.existsSync(resolvedTarget)) {
    return accumulator;
  }

  try {
    const entries = fs.readdirSync(resolvedTarget, { withFileTypes: true });
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!entry || typeof entry.name !== 'string') {
        continue;
      }
      
      const fullPath = path.join(resolvedTarget, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, accumulator);
      } else if (entry.isFile()) {
        accumulator.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error traversing directory '${dirPath}':`, error);
  }

  return accumulator;
}

/**
 * Executes remote Git repository tree fetch and handles local repository indexing.
 * Implements strict payload size limits, protocol enforcement, and response validation.
 */
function executeSyncCycle() {
  const targetUrl = 'https://api.github.com/repos/craighckby-stack/epistemic_debate_engine/git/trees/main?recursive=1';
  const parsedUrl = new URL(targetUrl);

  // Enforce secure HTTPS protocol strictly
  if (parsedUrl.protocol !== 'https:') {
    console.error('Security violation: Non-HTTPS protocol rejected.');
    return;
  }

  const requestOptions = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'GET',
    headers: {
      'User-Agent': 'EMG-Core-v49',
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  const req = https.request(requestOptions, (res) => {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      console.error(`GitHub API HTTP request failed with status code ${res.statusCode}`);
      res.resume();
      return;
    }

    const chunks = [];
    let totalBytes = 0;
    const MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10 MB strict upper bounds check to prevent memory exhaustion

    res.on('data', (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > MAX_RESPONSE_SIZE) {
        console.error('Security error: Response payload exceeded maximum allowable size (DoS mitigation).');
        res.destroy();
        return;
      }
      chunks.push(chunk);
    });

    res.on('end', () => {
      try {
        const rawData = Buffer.concat(chunks).toString('utf8');
        /** @type {GitTreeResponse} */
        const parsedData = JSON.parse(rawData);

        if (!parsedData || !Array.isArray(parsedData.tree)) {
          throw new TypeError('Invalid response schema: missing "tree" array');
        }

        const remoteFiles = parsedData.tree.filter((node) => node && node.type === 'blob');
        const localFiles = walk('src');

        // We need to compare contents because git shas are blob shas (which include length headers).
        // Let's just download the remote files that are present locally and compare their text!
        fs.writeFileSync('remote_blobs.json', JSON.stringify(remoteFiles, null, 2), { encoding: 'utf8', mode: 0o600 });
        console.log("Written blobs");
      } catch (error) {
        console.error('Failed to parse response or write remote blobs:', error);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Network failure during GitHub API fetch:', error);
  });

  req.end();
}

executeSyncCycle();