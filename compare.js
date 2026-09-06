/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: compare.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');

// Security configuration limits
const MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10MB memory protection limit
const MAX_PATH_LENGTH = 1024;

/**
 * Validates and normalizes input path strings to prevent directory traversal and injection.
 * 
 * @param {string} inputPath - The path string to validate.
 * @returns {string|null} The normalized safe path or null if invalid.
 */
function sanitizePath(inputPath) {
  if (typeof inputPath !== 'string' || inputPath.length === 0 || inputPath.length > MAX_PATH_LENGTH) {
    return null;
  }
  
  if (inputPath.includes('\0')) {
    return null;
  }
  
  const normalized = path.normalize(inputPath);
  if (normalized.startsWith('..') || path.isAbsolute(normalized)) {
    return null;
  }
  
  return normalized;
}

/**
 * Recursively walks a directory to collect all file paths synchronously with strict bounds checking.
 * Optimized with iterative traversal using a stack to eliminate recursion overhead and reduce call-stack allocations.
 * 
 * @param {string} dir - The root directory path to walk.
 * @returns {string[]} Array of normalized file paths using forward slashes.
 */
function walk(dir) {
  const safeDir = sanitizePath(dir);
  if (!safeDir) {
    return [];
  }

  const results = [];
  const resolvedRoot = path.resolve(safeDir);
  const stack = [resolvedRoot];

  while (stack.length > 0) {
    const currentDir = stack.pop();
    try {
      if (!currentDir.startsWith(resolvedRoot)) {
        continue;
      }

      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      const len = entries.length;
      
      // Unroll loop for small directories or optimize iteration speed
      for (let i = 0; i < len; ++i) {
        const entry = entries[i];
        const name = entry.name;
        if (typeof name !== 'string' || name.length === 0) {
          continue;
        }

        const filePath = path.join(currentDir, name);
        const safeFilePath = sanitizePath(filePath);
        if (!safeFilePath) {
          continue;
        }

        if (entry.isDirectory()) {
          stack.push(path.resolve(filePath));
        } else if (entry.isFile()) {
          results.push(filePath.replace(/\\/g, '/'));
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[EMG Error] Failed to securely read directory:', errorMessage);
    }
  }

  return results;
}

/** @type {https.RequestOptions} */
const requestOptions = {
  hostname: 'api.github.com',
  path: '/repos/craighckby-stack/epistemic_debate_engine/git/trees/main?recursive=1',
  headers: { 
    'User-Agent': 'EMG-Core-v49-Neural-Code-Optimizer',
    'Accept': 'application/vnd.github.v3+json',
    'Connection': 'close'
  }
};

/**
 * Executes the HTTPS GET request to fetch remote tree structure with payload size and type validation.
 */
const req = https.get(requestOptions, (response) => {
  if (response.statusCode !== 200) {
    console.error(`[EMG Error] GitHub API returned status code: ${response.statusCode}`);
    response.resume();
    return;
  }

  /** @type {Buffer[]} */
  const responseChunks = [];
  let totalBytesReceived = 0;

  response.on('data', (chunk) => {
    totalBytesReceived += chunk.length;
    if (totalBytesReceived > MAX_RESPONSE_SIZE) {
      console.error('[EMG Error] Response payload exceeded memory safety limits.');
      response.destroy();
      return;
    }
    responseChunks.push(chunk);
  });

  response.on('end', () => {
    try {
      const rawData = Buffer.concat(responseChunks, totalBytesReceived).toString('utf8');
      const parsedData = JSON.parse(rawData);

      if (!parsedData || typeof parsedData !== 'object' || !Array.isArray(parsedData.tree)) {
        console.error('[EMG Error] Invalid JSON structure received from GitHub API.');
        return;
      }

      const tree = parsedData.tree;
      const treeLen = tree.length;
      const remoteFiles = [];
      
      for (let i = 0; i < treeLen; ++i) {
        const item = tree[i];
        if (item && item.type === 'blob' && typeof item.path === 'string') {
          const safeFilePath = sanitizePath(item.path);
          if (safeFilePath) {
            remoteFiles.push(safeFilePath);
          }
        }
      }

      const localFiles = walk('src');
      const remoteFileSet = new Set(remoteFiles);
      const localFileSet = new Set(localFiles);

      console.log('Files in remote but not local:');
      const remoteLen = remoteFiles.length;
      for (let i = 0; i < remoteLen; ++i) {
        const filePath = remoteFiles[i];
        if (!localFileSet.has(filePath) && filePath.startsWith('src/')) {
          console.log(`  ${filePath}`);
        }
      }

      console.log('\nFiles in local but not remote:');
      const localLen = localFiles.length;
      for (let i = 0; i < localLen; ++i) {
        const filePath = localFiles[i];
        if (!remoteFileSet.has(filePath)) {
          console.log(`  ${filePath}`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[EMG Error] Failed to parse API response payload:', errorMessage);
    }
  });
});

req.on('error', (error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('[EMG Error] Network transmission failure:', errorMessage);
});