/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fetch_remote_app.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

// @ts-check
'use strict';

const { createWriteStream } = require('node:fs');
const { resolve, normalize, isAbsolute } = require('node:path');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');

/**
 * @typedef {Object} DownloadTarget
 * @property {string} url - The target HTTPS URL to fetch.
 * @property {string} dest - The local destination file path.
 */

/**
 * Validates and normalizes a destination path to prevent directory traversal attacks.
 * 
 * @param {string} destPath - The raw destination path.
 * @returns {string} The safely resolved absolute or relative path within bounds.
 * @throws {TypeError} If path is invalid or attempts traversal.
 */
function validateAndSanitizePath(destPath) {
  if (typeof destPath !== 'string' || !destPath.trim()) {
    throw new TypeError('[EMG Core v49] Parameter "destPath" must be a non-empty string.');
  }

  // Prevent null bytes or control characters injection
  if (/[\0-\x1f\x7f-\x9f]/.test(destPath)) {
    throw new TypeError('[EMG Core v49] Parameter "destPath" contains invalid control characters.');
  }

  // Resolve and normalize to catch path traversal attempts (e.g., '../../')
  const baseDir = process.cwd();
  const resolvedPath = resolve(baseDir, destPath);
  const normalizedBase = normalize(baseDir);

  // Ensure the resolved path strictly starts within the base directory to prevent escaping
  if (!resolvedPath.startsWith(normalizedBase)) {
    throw new Error('[EMG Core v49] Security violation: Path traversal detected outside base directory.');
  }

  return resolvedPath;
}

/**
 * Validates the target URL to ensure it uses the secure HTTPS protocol and a safe domain format.
 * 
 * @param {string} urlString - The target URL to validate.
 * @returns {URL} The parsed and validated URL object.
 * @throws {TypeError} If the URL is malformed or uses an unauthorized protocol.
 */
function validateAndSanitizeUrl(urlString) {
  if (typeof urlString !== 'string' || !urlString.trim()) {
    throw new TypeError('[EMG Core v49] Parameter "url" must be a non-empty string.');
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(urlString);
  } catch {
    throw new TypeError(`[EMG Core v49] Invalid URL format provided: ${urlString}`);
  }

  // Enforce strict transport layer security bounds
  if (parsedUrl.protocol !== 'https:') {
    throw new Error(`[EMG Core v49] Security violation: Insecure protocol "${parsedUrl.protocol}" detected. Only HTTPS is permitted.`);
  }

  return parsedUrl;
}

/**
 * Fetches a remote resource securely and streams it directly to the specified destination path.
 * 
 * @param {string} url - The target HTTPS URL to fetch.
 * @param {string} destPath - The local file path to write the downloaded content.
 * @returns {Promise<void>} Resolves when stream writing is complete.
 * @throws {TypeError} If parameters are invalid.
 * @throws {Error} If the network request fails or returns a non-2xx status code.
 */
async function fetchAndSave(url, destPath) {
  const validatedUrl = validateAndSanitizeUrl(url);
  const sanitizedDestPath = validateAndSanitizePath(destPath);

  const response = await fetch(validatedUrl, {
    headers: {
      'User-Agent': 'EMG-Core-v49-Optimizer-Engine/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${validatedUrl.toString()}: Status Code ${response.status} (${response.statusText})`);
  }

  if (!response.body) {
    throw new Error(`Failed to fetch ${validatedUrl.toString()}: Response body is null or undefined.`);
  }

  const writeStream = createWriteStream(sanitizedDestPath, { flags: 'w', mode: 0o600 });

  try {
    // Stream response body to file with low memory overhead and strict bounds checking
    // @ts-ignore - Readable.fromWeb handles Web ReadableStream in Node.js environments
    await pipeline(Readable.fromWeb(response.body), writeStream);
  } catch (err) {
    if (!writeStream.destroyed) {
      writeStream.destroy();
    }
    throw err;
  }
}

/**
 * Executes the parallel retrieval of core remote architecture components.
 * 
 * @returns {Promise<void>}
 */
async function executeSynchronization() {
  /** @type {readonly DownloadTarget[]} */
  const targets = Object.freeze([
    {
      url: 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/src/App.tsx',
      dest: 'remote_App.tsx',
    },
    {
      url: 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/src/main.tsx',
      dest: 'remote_main.tsx',
    },
  ]);

  try {
    await Promise.all(targets.map((target) => fetchAndSave(target.url, target.dest)));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[EMG Core v49] Critical synchronization failure:', message);
    process.exitCode = 1;
  }
}

module.exports = {
  fetchAndSave,
  executeSynchronization,
};

void executeSynchronization();