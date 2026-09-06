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

// Pre-allocate repository base URL object to prevent repeated instantiations
const REPOSITORY_BASE_URL_OBJ = new URL(REPOSITORY_BASE_URL);

/**
 * Safely loads and parses the remote blobs inventory with robust validation and memory efficiency.
 * @returns {RemoteBlob[]} Array of validated RemoteBlob objects.
 */
function loadRemoteBlobs() {
  try {
    const rawData = fs.readFileSync('remote_blobs.json', 'utf8');
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const len = parsed.length;
    /** @type {RemoteBlob[]} */
    const validItems = [];
    for (let i = 0; i < len; i++) {
      const item = parsed[i];
      if (item !== null && typeof item === 'object' && typeof item.path === 'string') {
        validItems.push(item);
      }
    }
    return validItems;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('CRITICAL: Failed to read or parse remote_blobs.json:', errorMessage);
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
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (err) {
      return reject(new Error(`Invalid URL provided: ${url}`));
    }

    if (parsedUrl.protocol !== 'https:') {
      return reject(new Error('Insecure protocol blocked; HTTPS required.'));
    }

    const request = https.get(
      parsedUrl,
      {
        headers: { 'User-Agent': USER_AGENT },
        timeout: HTTP_TIMEOUT_MS,
      },
      (response) => {
        if (response.statusCode !== 200) {
          response.resume();
          return reject(new Error(`HTTP Status Code: ${response.statusCode}`));
        }

        const contentLengthHeader = response.headers['content-length'];
        if (contentLengthHeader) {
          const contentLength = parseInt(contentLengthHeader, 10);
          if (!Number.isNaN(contentLength) && contentLength > MAX_CONTENT_LENGTH) {
            response.resume();
            return reject(new Error(`Response exceeds maximum allowed size bounds: ${contentLength} bytes`));
          }
        }

        /** @type {Buffer[]} */
        const dataChunks = [];
        let accumulatedBytes = 0;

        response.on('data', (chunk) => {
          accumulatedBytes += chunk.length;
          if (accumulatedBytes > MAX_CONTENT_LENGTH) {
            response.destroy(new Error('Response body exceeded maximum allowed memory buffer size bounds.'));
            return;
          }
          dataChunks.push(chunk);
        });

        response.on('end', () => {
          try {
            resolve(Buffer.concat(dataChunks).toString('utf8'));
          } catch (err) {
            reject(err);
          }
        });

        response.on('error', (err) => reject(err));
      }
    );

    request.on('timeout', () => {
      request.destroy(new Error(`Request timed out after ${HTTP_TIMEOUT_MS}ms`));
    });

    request.on('error', (err) => reject(err));
    request.end();
  });
}

/**
 * Asynchronously processes remote blobs, detects modifications, synchronizes files securely, and outputs results.
 * @returns {Promise<void>}
 */
async function processBlobsSequentially() {
  const remoteBlobs = loadRemoteBlobs();
  const len = remoteBlobs.length;
  /** @type {RemoteBlob[]} */
  const changedFilesList = [];

  for (let i = 0; i < len; i++) {
    const fileObj = remoteBlobs[i];
    if (!fileObj || typeof fileObj.path !== 'string') {
      continue;
    }

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
        const remoteUrl = new URL(sanitizedPath, REPOSITORY_BASE_URL_OBJ).toString();
        const remoteContent = await fetchRemoteContent(remoteUrl);

        if (remoteContent !== localContent) {
          console.log(`Changed: ${sanitizedPath}`);
          changedFilesList.push(fileObj);
          await fsPromises.writeFile(sanitizedPath, remoteContent, 'utf8');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Warning: Failed to process path "${fileObj.path}":`, errorMessage);
    }
  }

  try {
    await fsPromises.writeFile('changed_files.json', JSON.stringify(changedFilesList, null, 2), 'utf8');
    console.log(`Found ${changedFilesList.length} changed files.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('CRITICAL: Failed to write changed_files.json:', errorMessage);
  }
}

if (require.main === module) {
  processBlobsSequentially().catch((error) => {
    console.error('Unhandled fatal error in processBlobsSequentially:', error);
  });
}

module.exports = {
  loadRemoteBlobs,
  fetchRemoteContent,
  processBlobsSequentially,
};