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
  if (userPath.indexOf('\0') !== -1) {
    throw new Error('Security violation: Null byte detected in path.');
  }

  // Normalize path segments to prevent traversal attacks (e.g., ../)
  const normalizedRelative = path.normalize(userPath).replace(/^(\.\.[\/\\])+/, '');
  const absoluteBasePath = path.resolve(process.cwd());
  const resolvedPath = path.resolve(absoluteBasePath, normalizedRelative);

  // Strict boundary check: ensure resolved path strictly resides within the base directory
  if (!resolvedPath.startsWith(absoluteBasePath)) {
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
  } catch (err) {
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
      headers: { 'User-Agent': USER_AGENT }
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

    req.on('error', (err) => {
      reject(err);
    });

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

  const changed = [];

  const candidateFiles = [];
  for (const f of remoteBlobs) {
    if (f && typeof f.path === 'string' && f.path.startsWith('src/')) {
      try {
        const safePath = validateAndResolvePath(f.path);
        if (fs.existsSync(safePath)) {
          candidateFiles.push({ ...f, safePath });
        }
      } catch (err) {
        // Skip invalid candidate paths securely
      }
    }
  }

  const promises = candidateFiles.map(async (fileObj) => {
    try {
      const localContent = fs.readFileSync(fileObj.safePath, 'utf8');
      const remoteUrl = GITHUB_RAW_BASE + fileObj.path;
      const remoteContent = await fetchRemoteContent(remoteUrl);

      if (remoteContent !== localContent) {
        console.log(`Changed: ${fileObj.path}`);
        changed.push(fileObj);
        fs.writeFileSync(fileObj.safePath, remoteContent, 'utf8');
      }
    } catch (err) {
      // Gracefully handle network or file system anomalies per original contract
    }
  });

  await Promise.all(promises);
  console.log(`Found and updated ${changed.length} changed files.`);
}

main();