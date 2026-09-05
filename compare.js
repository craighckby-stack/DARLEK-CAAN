/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: compare.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');

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
  // Prevent null byte injections and dangerous absolute navigation escape attempts
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
 * Uses `readdirSync` with `{ withFileTypes: true }` to avoid redundant stat calls
 * and optimizes array allocations.
 *
 * @param {string} dir - The root directory path to walk.
 * @returns {string[]} Array of normalized file paths using forward slashes.
 */
function walk(dir) {
  /** @type {string[]} */
  const results = [];

  const safeDir = sanitizePath(dir);
  if (!safeDir) {
    return results;
  }

  /**
   * Helper function to perform depth-first directory traversal.
   * @param {string} currentDir - Current directory path.
   */
  function traverse(currentDir) {
    try {
      const resolvedCurrent = path.resolve(currentDir);
      const resolvedRoot = path.resolve(safeDir);
      
      // Ensure traversal remains strictly within the intended base directory bounds
      if (!resolvedCurrent.startsWith(resolvedRoot)) {
        return;
      }

      if (!fs.existsSync(resolvedCurrent)) {
        return;
      }

      const entries = fs.readdirSync(resolvedCurrent, { withFileTypes: true });
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (typeof entry.name !== 'string' || entry.name.length === 0) {
          continue;
        }

        const filePath = path.join(resolvedCurrent, entry.name);
        const safeFilePath = sanitizePath(filePath);
        if (!safeFilePath) {
          continue;
        }

        if (entry.isDirectory()) {
          traverse(filePath);
        } else if (entry.isFile()) {
          results.push(filePath.replace(/\\/g, '/'));
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('[EMG Error] Failed to securely read directory:', message);
    }
  }

  traverse(safeDir);
  return results;
}

/** @type {https.RequestOptions} */
const options = {
  hostname: 'api.github.com',
  path: '/repos/craighckby-stack/epistemic_debate_engine/git/trees/main?recursive=1',
  headers: { 
    'User-Agent': 'EMG-Core-v49-Neural-Code-Optimizer',
    'Accept': 'application/vnd.github.v3+json'
  }
};

/**
 * Executes the HTTPS GET request to fetch remote tree structure with payload size and type validation.
 */
const req = https.get(options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`[EMG Error] GitHub API returned status code: ${res.statusCode}`);
    res.resume();
    return;
  }

  /** @type {Buffer[]} */
  const chunks = [];
  let totalBytesReceived = 0;

  res.on('data', (chunk) => {
    totalBytesReceived += chunk.length;
    if (totalBytesReceived > MAX_RESPONSE_SIZE) {
      console.error('[EMG Error] Response payload exceeded memory safety limits.');
      res.destroy();
      return;
    }
    chunks.push(chunk);
  });

  res.on('end', () => {
    try {
      const rawData = Buffer.concat(chunks).toString('utf8');
      const parsed = JSON.parse(rawData);

      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.tree)) {
        console.error('[EMG Error] Invalid JSON structure received from GitHub API.');
        return;
      }

      /** @type {string[]} */
      const remoteFiles = [];
      const tree = parsed.tree;
      
      for (let i = 0; i < tree.length; i++) {
        const f = tree[i];
        if (f && f.type === 'blob' && typeof f.path === 'string') {
          const safeFPath = sanitizePath(f.path);
          if (safeFPath) {
            remoteFiles.push(safeFPath);
          }
        }
      }

      const localFiles = walk('src');

      const remoteSet = new Set(remoteFiles);
      const localSet = new Set(localFiles);

      console.log('Files in remote but not local:');
      for (let i = 0; i < remoteFiles.length; i++) {
        const f = remoteFiles[i];
        if (!localSet.has(f) && f.startsWith('src/')) {
          console.log('  ' + f);
        }
      }

      console.log('\nFiles in local but not remote:');
      for (let i = 0; i < localFiles.length; i++) {
        const f = localFiles[i];
        if (!remoteSet.has(f)) {
          console.log('  ' + f);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('[EMG Error] Failed to parse API response payload:', message);
    }
  });
});

req.on('error', (error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('[EMG Error] Network transmission failure:', message);
});