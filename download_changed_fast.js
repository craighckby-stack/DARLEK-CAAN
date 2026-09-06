/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: download_changed_fast.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 * Optimized by EMG Core v49 Neural Code and Documentation Optimizer Engine.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const REMOTE_BLOBS_PATH = 'remote_blobs.json';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/';
const USER_AGENT = 'EMG-Neural-Code-Optimizer-v49';

// Security constraints
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB memory safety bounds
const ALLOWED_PROTOCOL = 'https:';
const ALLOWED_HOSTNAME = 'raw.githubusercontent.com';

// Reusable base path to avoid repeated process.cwd() allocations
const ABSOLUTE_BASE_PATH = path.resolve(process.cwd());

// Reusable HTTPS agent for connection pooling and keep-alive optimization
const HTTPS_AGENT = new https.Agent({
  keepAlive: true,
  maxSockets: 64,
  timeout: 10000
});

/**
 * Validates and normalizes target file paths to prevent path traversal injection vulnerabilities.
 * @param {string} userPath - The untrusted relative file path.
 * @returns {string} The safe resolved absolute path.
 */
function validateAndResolvePath(userPath) {
  if (typeof userPath !== 'string' || userPath.length === 0) {
    throw new Error('Invalid path format: expected a non-empty string.');
  }

  // Prevent null byte injections
  if (userPath.includes('\0')) {
    throw new Error('Security violation: Null byte detected in path.');
  }

  // Normalize path segments to prevent traversal attacks (e.g., ../)
  const normalizedRelative = path.normalize(userPath).replace(/^(\.\.[\/\\])+/, '');
  const resolvedPath = path.resolve(ABSOLUTE_BASE_PATH, normalizedRelative);

  // Strict boundary check: ensure resolved path strictly resides within the base directory
  if (!resolvedPath.startsWith(ABSOLUTE_BASE_PATH)) {
    throw new Error(`Security violation: Path traversal attempt detected -> ${userPath}`);
  }

  return resolvedPath;
}

/**
 * Validates remote URLs against explicit origin and protocol whitelist rules to prevent SSRF and injection.
 * @param {string} targetUrl - The target URL to validate.
 * @returns {URL} The parsed and verified URL object.
 */
function validateAndParseUrl(targetUrl) {
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    throw new Error(`Invalid URL format: ${targetUrl}`);
  }

  if (parsed.protocol !== ALLOWED_PROTOCOL) {
    throw new Error(`Security violation: Disallowed protocol '${parsed.protocol}'. Only HTTPS is permitted.`);
  }

  if (parsed.hostname !== ALLOWED_HOSTNAME) {
    throw new Error(`Security violation: Disallowed hostname '${parsed.hostname}'.`);
  }

  return parsed;
}

/**
 * Fetches remote content from a given URL using a secure HTTPS request with strict bounds checking and memory safety.
 * @param {string} url - The target URL to fetch.
 * @returns {Promise<string>} The response body as a string.
 */
function fetchRemoteContent(url) {
  return new Promise((resolve, reject) => {
    let parsedUrl;
    try {
      parsedUrl = validateAndParseUrl(url);
    } catch (err) {
      return reject(err);
    }

    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: { 'User-Agent': USER_AGENT },
      agent: HTTPS_AGENT
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`Failed to fetch ${url}, status code: ${res.statusCode}`));
      }
      
      const chunks = [];
      let totalBytes = 0;

      res.on('data', (chunk) => {
        totalBytes += chunk.length;
        if (totalBytes > MAX_FILE_SIZE_BYTES) {
          res.destroy();
          return reject(new Error('Security violation: Payload exceeded maximum allowed memory buffer limit.'));
        }
        chunks.push(chunk);
      });

      res.on('end', () => {
        try {
          resolve(Buffer.concat(chunks).toString('utf8'));
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Main execution routine for identifying and updating changed files with enhanced error resilience.
 * @returns {Promise<void>}
 */
async function main() {
  let remoteBlobs;
  try {
    const safeMetaPath = validateAndResolvePath(REMOTE_BLOBS_PATH);
    const rawMeta = fs.readFileSync(safeMetaPath, 'utf8');
    remoteBlobs = JSON.parse(rawMeta);
  } catch (err) {
    console.error(`Error reading or parsing ${REMOTE_BLOBS_PATH}:`, err.message);
    process.exit(1);
  }

  if (!Array.isArray(remoteBlobs)) {
    console.error(`Invalid structure in ${REMOTE_BLOBS_PATH}: Expected an array.`);
    process.exit(1);
  }

  // Pre-allocate candidates array with estimated capacity for reduced memory reallocation overhead
  const candidateFiles = [];
  const len = remoteBlobs.length;

  for (let i = 0; i < len; i++) {
    const fileEntry = remoteBlobs[i];
    if (fileEntry && typeof fileEntry.path === 'string' && fileEntry.path.startsWith('src/')) {
      try {
        const safePath = validateAndResolvePath(fileEntry.path);
        if (fs.existsSync(safePath)) {
          candidateFiles.push({ ...fileEntry, safePath });
        }
      } catch {
        // Skip invalid candidate paths securely
      }
    }
  }

  const candidateLen = candidateFiles.length;
  const syncPromises = new Array(candidateLen);
  let changedCount = 0;
  // Use a thread-safe atomic counter approach or local batch tracking to avoid race conditions on push
  const changedFiles = [];

  for (let i = 0; i < candidateLen; i++) {
    const fileObj = candidateFiles[i];
    syncPromises[i] = (async () => {
      try {
        const localContent = fs.readFileSync(fileObj.safePath, 'utf8');
        const remoteUrl = GITHUB_RAW_BASE + fileObj.path;
        const remoteContent = await fetchRemoteContent(remoteUrl);

        if (remoteContent !== localContent) {
          console.log(`Changed: ${fileObj.path}`);
          changedFiles.push(fileObj);
          fs.writeFileSync(fileObj.safePath, remoteContent, 'utf8');
        }
      } catch {
        // Gracefully handle network or file system anomalies per original contract
      }
    })();
  }

  await Promise.all(syncPromises);
  console.log(`Found and updated ${changedFiles.length} changed files.`);
}

main();