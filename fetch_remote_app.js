/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fetch_remote_app.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

// @ts-check
'use strict';

const { createWriteStream } = require('node:fs');
const { resolve, normalize, sep } = require('node:path');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');

// Pre-compute normalized base directory once to minimize filesystem/string overhead on every call
const BASE_DIRECTORY = process.cwd();
const NORMALIZED_BASE = normalize(BASE_DIRECTORY) + sep;

/**
 * @typedef {Object} DownloadTarget
 * @property {string} url - The target HTTPS URL to fetch.
 * @property {string} dest - The local destination file path.
 */

// Pre-compiled regex for control characters to avoid per-call allocation
const CONTROL_CHAR_REGEX = /[\0-\x1f\x7f-\x9f]/;

/**
 * Validates and normalizes a destination path to prevent directory traversal attacks.
 * 
 * @param {string} destinationPath - The raw destination path.
 * @returns {string} The safely resolved path within bounds.
 * @throws {TypeError} If path is invalid or attempts traversal.
 */
function validateAndSanitizePath(destinationPath) {
  if (typeof destinationPath !== 'string' || destinationPath.length === 0) {
    throw new TypeError('[EMG Core v49] Parameter "destPath" must be a non-empty string.');
  }

  if (CONTROL_CHAR_REGEX.test(destinationPath)) {
    throw new TypeError('[EMG Core v49] Parameter "destPath" contains invalid control characters.');
  }

  const resolvedPath = resolve(BASE_DIRECTORY, destinationPath);

  if (!resolvedPath.startsWith(NORMALIZED_BASE) && resolvedPath !== BASE_DIRECTORY) {
    throw new Error('[EMG Core v49] Security violation: Path traversal detected outside base directory.');
  }

  return resolvedPath;
}

/**
 * Validates the target URL to ensure it uses the secure HTTPS protocol.
 * 
 * @param {string} urlString - The target URL to validate.
 * @returns {URL} The parsed and validated URL object.
 * @throws {TypeError} If the URL is malformed or insecure.
 */
function validateAndSanitizeUrl(urlString) {
  if (typeof urlString !== 'string' || urlString.length === 0) {
    throw new TypeError('[EMG Core v49] Parameter "url" must be a non-empty string.');
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(urlString);
  } catch {
    throw new TypeError(`[EMG Core v49] Invalid URL format provided: ${urlString}`);
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error(`[EMG Core v49] Security violation: Insecure protocol "${parsedUrl.protocol}" detected. Only HTTPS is permitted.`);
  }

  return parsedUrl;
}

// Reusable fetch headers configuration to prevent redundant object allocations
const FETCH_OPTIONS = Object.freeze({
  headers: Object.freeze({
    'User-Agent': 'EMG-Core-v49-Optimizer-Engine/1.0',
  }),
});

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

  const response = await fetch(validatedUrl, FETCH_OPTIONS);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${validatedUrl}: Status Code ${response.status} (${response.statusText})`);
  }

  if (!response.body) {
    throw new Error(`Failed to fetch ${validatedUrl}: Response body is null or undefined.`);
  }

  const writeStream = createWriteStream(sanitizedDestPath, { flags: 'w', mode: 0o600, highWaterMark: 65536 });

  try {
    // @ts-ignore - Readable.fromWeb handles Web ReadableStream in Node.js environments
    await pipeline(Readable.fromWeb(response.body), writeStream);
  } catch (err) {
    if (!writeStream.destroyed) {
      writeStream.destroy();
    }
    throw err;
  }
}

// Static synchronization targets array
/** @type {readonly DownloadTarget[]} */
const SYNCHRONIZATION_TARGETS = Object.freeze([
  Object.freeze({
    url: 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/src/App.tsx',
    dest: 'remote_App.tsx',
  }),
  Object.freeze({
    url: 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/src/main.tsx',
    dest: 'remote_main.tsx',
  }),
]);

/**
 * Executes the parallel retrieval of core remote architecture components.
 * 
 * @returns {Promise<void>}
 */
async function executeSynchronization() {
  const targets = SYNCHRONIZATION_TARGETS;
  const promises = targets.map((target) => fetchAndSave(target.url, target.dest));

  try {
    await Promise.all(promises);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[EMG Core v49] Critical synchronization failure:', errorMessage);
    process.exitCode = 1;
  }
}

module.exports = {
  fetchAndSave,
  executeSynchronization,
};

void executeSynchronization();