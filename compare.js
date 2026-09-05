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

  /**
   * Performs depth-first directory traversal.
   * @param {string} currentDir - Current directory path.
   */
  function traverse(currentDir) {
    try {
      const resolvedCurrent = path.resolve(currentDir);
      const resolvedRoot = path.resolve(safeDir);
      
      if (!resolvedCurrent.startsWith(resolvedRoot) || !fs.existsSync(resolvedCurrent)) {
        return;
      }

      const entries = fs.readdirSync(resolvedCurrent, { withFileTypes: true });
      for (const entry of entries) {
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[EMG Error] Failed to securely read directory:', errorMessage);
    }
  }

  traverse(safeDir);
  return results;
}

/** @type {https.RequestOptions} */
const requestOptions = {
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
      const rawData = Buffer.concat(responseChunks).toString('utf8');
      const parsedData = JSON.parse(rawData);

      if (!parsedData || typeof parsedData !== 'object' || !Array.isArray(parsedData.tree)) {
        console.error('[EMG Error] Invalid JSON structure received from GitHub API.');
        return;
      }

      const remoteFiles = [];
      for (const item of parsedData.tree) {
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
      for (const filePath of remoteFiles) {
        if (!localFileSet.has(filePath) && filePath.startsWith('src/')) {
          console.log(`  ${filePath}`);
        }
      }

      console.log('\nFiles in local but not remote:');
      for (const filePath of localFiles) {
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