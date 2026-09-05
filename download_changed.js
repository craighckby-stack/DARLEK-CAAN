/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: download_changed.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const https = require('node:https');
const path = require('node:path');
const { URL } = require('node:url');

/**
 * @typedef {Object} RemoteBlob
 * @property {string} path
 * @property {string} [sha]
 */

const REPOSITORY_BASE_URL = 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/';
const USER_AGENT = 'EMG-Core-v49-Neural-Code-Optimizer';
const HTTP_TIMEOUT_MS = 15000;
const MAX_CONTENT_LENGTH = 10 * 1024 * 1024; // 10MB bounds limit for memory safety

/**
 * Safely loads and parses the remote blobs inventory with robust validation.
 * @returns {RemoteBlob[]} Array of validated RemoteBlob objects.
 */
function loadRemoteBlobs() {
  try {
    const rawData = fs.readFileSync('remote_blobs.json', 'utf8');
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      /**
       * @param {any} item
       * @returns {item is RemoteBlob}
       */
      (item) => item !== null && typeof item === 'object' && typeof item.path === 'string'
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('CRITICAL: Failed to read or parse remote_blobs.json:', message);
    return [];
  }
}

/**
 * Fetches remote file content via HTTPS with strict error handling, memory-efficient buffering, bounds checking, and request timeouts.
 * @param {string} url - Target URL to fetch content from.
 * @returns {Promise<string>} Resolved string content from remote response.
 */
function fetchRemoteContent(url) {
  return new Promise((resolve, reject) => {
    // Strict URL validation against SSRF and injection
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (err) {
      return reject(new Error(`Invalid URL provided: ${url}`));
    }

    if (parsedUrl.protocol !== 'https:') {
      return reject(new Error('Insecure protocol blocked; HTTPS required.'));
    }

    const req = https.get(
      parsedUrl,
      {
        headers: { 'User-Agent': USER_AGENT },
        timeout: HTTP_TIMEOUT_MS,
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP Status Code: ${res.statusCode}`));
        }

        const contentLengthHeader = res.headers['content-length'];
        if (contentLengthHeader) {
          const contentLength = parseInt(contentLengthHeader, 10);
          if (!isNaN(contentLength) && contentLength > MAX_CONTENT_LENGTH) {
            res.resume();
            return reject(new Error(`Response exceeds maximum allowed size bounds: ${contentLength} bytes`));
          }
        }

        /** @type {Buffer[]} */
        const chunks = [];
        let totalBytes = 0;

        res.on('data', (chunk) => {
          totalBytes += chunk.length;
          if (totalBytes > MAX_CONTENT_LENGTH) {
            res.destroy(new Error('Response body exceeded maximum allowed memory buffer size bounds.'));
            return;
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

        res.on('error', (err) => reject(err));
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error(`Request timed out after ${HTTP_TIMEOUT_MS}ms`));
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

/**
 * Asynchronously processes remote blobs, detects modifications, synchronizes files securely, and outputs results.
 * @returns {Promise<void>}
 */
async function processBlobsSequentially() {
  const remoteBlobs = loadRemoteBlobs();
  /** @type {RemoteBlob[]} */
  const changed = [];

  for (const fileObj of remoteBlobs) {
    if (!fileObj || typeof fileObj.path !== 'string') {
      continue;
    }

    // Strict path normalization and traversal protection
    const sanitizedPath = path.normalize(fileObj.path).replace(/^(\.\.(\/|\\))+/, '');
    if (path.isAbsolute(sanitizedPath) || sanitizedPath.startsWith('..') || sanitizedPath.includes('\0')) {
      console.warn(`Warning: Skipped unsafe or malformed file path detected: "${fileObj.path}"`);
      continue;
    }

    if (!sanitizedPath.startsWith('src/')) {
      continue;
    }

    try {
      let fileExists = false;
      try {
        await fsPromises.access(sanitizedPath, fs.constants.F_OK);
        fileExists = true;
      } catch {
        fileExists = false;
      }

      if (fileExists) {
        const localContent = await fsPromises.readFile(sanitizedPath, 'utf8');
        
        // Construct and validate absolute repository target URL cleanly
        const base = new URL(REPOSITORY_BASE_URL);
        const remoteUrl = new URL(sanitizedPath, base).toString();

        const remoteContent = await fetchRemoteContent(remoteUrl);

        if (remoteContent !== localContent) {
          console.log(`Changed: ${sanitizedPath}`);
          changed.push(fileObj);
          await fsPromises.writeFile(sanitizedPath, remoteContent, 'utf8');
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Warning: Failed to process path "${fileObj.path}":`, message);
    }
  }

  try {
    await fsPromises.writeFile('changed_files.json', JSON.stringify(changed, null, 2), 'utf8');
    console.log(`Found ${changed.length} changed files.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('CRITICAL: Failed to write changed_files.json:', message);
  }
}

if (require.main === module) {
  processBlobsSequentially().catch((err) => {
    console.error('Unhandled fatal error in processBlobsSequentially:', err);
  });
}

module.exports = {
  loadRemoteBlobs,
  fetchRemoteContent,
  processBlobsSequentially,
};