/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: download_missing.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');
const { URL } = require('node:url');

const MISSING_FILE_MANIFEST_PATH = path.resolve('missing_files.json');
const BASE_REPOSITORY_URL = 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/';
const REQUEST_TIMEOUT_MS = 30000;
const CLIENT_USER_AGENT = 'EMG-Neural-Code-Optimizer/4.9';
const MAX_MANIFEST_SIZE_BYTES = 1024 * 1024; // 1MB upper bound for memory safety
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB defensive stream bounds checking

/**
 * @typedef {Object} FileManifestEntry
 * @property {string} path - Relative path of the missing target file.
 */

/**
 * Extracts and parses the error message safely from an unknown error type.
 * @param {unknown} error - The caught error object.
 * @returns {string} The formatted error message.
 */
function extractErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Validates and reads the missing files manifest securely with strict memory boundaries and path restrictions.
 * @returns {FileManifestEntry[]} Array of missing file objects.
 */
function loadMissingManifest() {
  try {
    const resolvedManifestPath = path.resolve(MISSING_FILE_MANIFEST_PATH);
    if (!fs.existsSync(resolvedManifestPath)) {
      throw new Error(`Manifest not found at ${MISSING_FILE_MANIFEST_PATH}`);
    }

    const manifestStats = fs.statSync(resolvedManifestPath);
    if (manifestStats.size > MAX_MANIFEST_SIZE_BYTES) {
      throw new Error(`Manifest file exceeds maximum allowed size of ${MAX_MANIFEST_SIZE_BYTES} bytes.`);
    }

    const rawManifestData = fs.readFileSync(resolvedManifestPath, 'utf8');
    const parsedManifest = JSON.parse(rawManifestData);
    if (!Array.isArray(parsedManifest)) {
      throw new Error('Manifest content must be an array of file objects.');
    }

    return parsedManifest;
  } catch (manifestError) {
    console.error(`[CRITICAL] Failed to load missing files manifest: ${extractErrorMessage(manifestError)}`);
    process.exit(1);
  }
}

/**
 * Validates target file path against directory traversal attacks and working directory bounds.
 * @param {string} rawFilePath - The raw relative file path from the manifest.
 * @returns {string|null} The resolved absolute target path, or null if validation fails.
 */
function validateAndResolveTargetPath(rawFilePath) {
  const sanitizedInput = rawFilePath.replace(/^(\.\.[\/\\])+/, '');
  const normalizedPath = path.normalize(sanitizedInput);
  
  if (path.isAbsolute(normalizedPath) || normalizedPath.startsWith('..')) {
    console.error(`[ERROR] Path traversal attempt detected and blocked: ${rawFilePath}`);
    return null;
  }

  const resolvedTargetPath = path.resolve(process.cwd(), normalizedPath);
  const currentWorkingDirectory = process.cwd();
  
  if (!resolvedTargetPath.startsWith(currentWorkingDirectory)) {
    console.error(`[ERROR] Resolved path escapes working directory boundaries: ${resolvedTargetPath}`);
    return null;
  }

  return resolvedTargetPath;
}

/**
 * Constructs and validates the absolute target URL against SSRF and origin manipulation.
 * @param {string} normalizedPath - The normalized relative file path.
 * @returns {string|null} The validated target URL string, or null if construction fails.
 */
function constructTargetUrl(normalizedPath) {
  try {
    const parsedBaseUrl = new URL(BASE_REPOSITORY_URL);
    const parsedFullUrl = new URL(normalizedPath, parsedBaseUrl);
    
    if (parsedFullUrl.origin !== parsedBaseUrl.origin) {
      console.error(`[ERROR] Target URL origin mismatch detected: ${parsedFullUrl.href}`);
      return null;
    }
    
    return parsedFullUrl.href;
  } catch (urlError) {
    console.error(`[ERROR] Malformed URL construction for ${normalizedPath}: ${extractErrorMessage(urlError)}`);
    return null;
  }
}

/**
 * Ensures the target parent directory exists recursively with secure permissions.
 * @param {string} targetFilePath - The absolute target file path.
 * @returns {boolean} Success status of directory preparation.
 */
function ensureTargetDirectoryExists(targetFilePath) {
  const parentDirectory = path.dirname(targetFilePath);
  try {
    if (!fs.existsSync(parentDirectory)) {
      fs.mkdirSync(parentDirectory, { recursive: true, mode: 0o755 });
    }
    return true;
  } catch (directoryError) {
    console.error(`[ERROR] Failed to create directory ${parentDirectory}: ${extractErrorMessage(directoryError)}`);
    return false;
  }
}

/**
 * Safely unlinks a file in the event of an error or aborted download.
 * @param {string} targetPath - The absolute path of the file to clean up.
 */
function cleanupPartialFile(targetPath) {
  fs.unlink(targetPath, () => {});
}

/**
 * Downloads a single file via HTTPS with advanced stream management, memory buffering, strict bounds checking, and atomic cleanup.
 * @param {FileManifestEntry} fileObj - Object containing file path details.
 * @returns {Promise<boolean>} Success status of the download operation.
 */
function download(fileObj) {
  return new Promise((resolve) => {
    if (!fileObj || typeof fileObj.path !== 'string' || !fileObj.path.trim()) {
      console.error('[ERROR] Invalid file object provided for download.');
      return resolve(false);
    }

    const sanitizedInput = fileObj.path.replace(/^(\.\.[\/\\])+/, '');
    const normalizedPath = path.normalize(sanitizedInput);
    const resolvedTargetPath = validateAndResolveTargetPath(fileObj.path);
    if (!resolvedTargetPath) {
      return resolve(false);
    }

    const targetUrl = constructTargetUrl(normalizedPath);
    if (!targetUrl) {
      return resolve(false);
    }

    if (!ensureTargetDirectoryExists(resolvedTargetPath)) {
      return resolve(false);
    }

    const requestOptions = {
      headers: { 'User-Agent': CLIENT_USER_AGENT }
    };

    const httpRequest = https.get(targetUrl, requestOptions, (responseStream) => {
      if (responseStream.statusCode !== 200) {
        console.error(`[ERROR] Failed to download ${fileObj.path}: HTTP status code ${responseStream.statusCode}`);
        responseStream.resume(); // Consume response stream to free memory
        return resolve(false);
      }

      const contentLengthHeader = responseStream.headers['content-length'];
      if (contentLengthHeader) {
        const contentLength = parseInt(contentLengthHeader, 10);
        if (!isNaN(contentLength) && contentLength > MAX_FILE_SIZE_BYTES) {
          console.error(`[ERROR] File size exceeds security threshold for ${fileObj.path}: ${contentLength} bytes`);
          responseStream.resume();
          return resolve(false);
        }
      }

      const writeStream = fs.createWriteStream(resolvedTargetPath, { mode: 0o644 });
      let downloadedBytes = 0;
      let hasAborted = false;

      responseStream.on('data', (chunk) => {
        if (hasAborted) return;
        downloadedBytes += chunk.length;
        if (downloadedBytes > MAX_FILE_SIZE_BYTES) {
          hasAborted = true;
          console.error(`[ERROR] Download exceeded maximum memory bounds during streaming for ${fileObj.path}`);
          responseStream.destroy();
          writeStream.destroy();
          cleanupPartialFile(resolvedTargetPath);
          resolve(false);
        }
      });

      responseStream.pipe(writeStream);

      writeStream.on('finish', () => {
        if (hasAborted) return;
        writeStream.close((streamCloseError) => {
          if (streamCloseError) {
            console.error(`[ERROR] Failed to close write stream for ${fileObj.path}: ${streamCloseError.message}`);
            cleanupPartialFile(resolvedTargetPath);
            return resolve(false);
          }
          console.log(`Successfully downloaded: ${fileObj.path}`);
          resolve(true);
        });
      });

      writeStream.on('error', (writeError) => {
        if (hasAborted) return;
        console.error(`[ERROR] Failed to write file ${fileObj.path}: ${writeError.message}`);
        writeStream.destroy();
        cleanupPartialFile(resolvedTargetPath);
        resolve(false);
      });

      responseStream.on('error', (responseError) => {
        if (hasAborted) return;
        console.error(`[ERROR] Response stream error downloading ${fileObj.path}: ${responseError.message}`);
        writeStream.destroy();
        cleanupPartialFile(resolvedTargetPath);
        resolve(false);
      });
    });

    httpRequest.setTimeout(REQUEST_TIMEOUT_MS, () => {
      console.error(`[ERROR] Request timeout downloading ${fileObj.path}`);
      httpRequest.destroy();
      resolve(false);
    });

    httpRequest.on('error', (networkError) => {
      console.error(`[ERROR] Network error downloading ${fileObj.path}: ${networkError.message}`);
      resolve(false);
    });

    httpRequest.end();
  });
}

/**
 * Orchestrates the sequential download of all qualifying missing files with robust lifecycle tracking.
 * @returns {Promise<void>}
 */
async function doAll() {
  const missingFilesManifest = loadMissingManifest();
  let successfullyProcessedCount = 0;

  for (const manifestEntry of missingFilesManifest) {
    if (manifestEntry && typeof manifestEntry.path === 'string' && manifestEntry.path.startsWith('src/')) {
      const isDownloadSuccessful = await download(manifestEntry);
      if (isDownloadSuccessful) {
        successfullyProcessedCount++;
      }
    }
  }

  console.log(`Download operation complete. Total files processed: ${successfullyProcessedCount}.`);
}

module.exports = {
  loadMissingManifest,
  download,
  doAll
};

// Execute execution cycle
if (require.main === module) {
  doAll().catch((executionError) => {
    console.error(`[FATAL] Unhandled execution error in doAll: ${extractErrorMessage(executionError)}`);
    process.exit(1);
  });
}