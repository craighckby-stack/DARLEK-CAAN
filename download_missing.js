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

const MISSING_FILES_PATH = path.resolve('missing_files.json');
const BASE_URL = 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/';
const REQUEST_TIMEOUT_MS = 30000;
const USER_AGENT = 'EMG-Neural-Code-Optimizer/4.9';
const MAX_MANIFEST_SIZE_BYTES = 1024 * 1024; // 1MB upper bound for memory safety
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB defensive stream bounds checking

/**
 * @typedef {Object} FileManifestEntry
 * @property {string} path - Relative path of the missing target file.
 */

/**
 * Validates and reads the missing files manifest securely with strict memory boundaries and path restrictions.
 * @returns {FileManifestEntry[]} Array of missing file objects.
 */
function loadMissingManifest() {
  try {
    const resolvedManifestPath = path.resolve(MISSING_FILES_PATH);
    if (!fs.existsSync(resolvedManifestPath)) {
      throw new Error(`Manifest not found at ${MISSING_FILES_PATH}`);
    }

    const stats = fs.statSync(resolvedManifestPath);
    if (stats.size > MAX_MANIFEST_SIZE_BYTES) {
      throw new Error(`Manifest file exceeds maximum allowed size of ${MAX_MANIFEST_SIZE_BYTES} bytes.`);
    }

    const rawData = fs.readFileSync(resolvedManifestPath, 'utf8');
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      throw new Error('Manifest content must be an array of file objects.');
    }

    return parsed;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[CRITICAL] Failed to load missing files manifest: ${message}`);
    process.exit(1);
  }
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

    // Defensive Path Traversal Protection
    const sanitizedInput = fileObj.path.replace(/^(\.\.[\/\\])+/, '');
    const normalizedPath = path.normalize(sanitizedInput);
    if (path.isAbsolute(normalizedPath) || normalizedPath.startsWith('..')) {
      console.error(`[ERROR] Path traversal attempt detected and blocked: ${fileObj.path}`);
      return resolve(false);
    }

    const resolvedTargetPath = path.resolve(process.cwd(), normalizedPath);
    const cwd = process.cwd();
    if (!resolvedTargetPath.startsWith(cwd)) {
      console.error(`[ERROR] Resolved path escapes working directory boundaries: ${resolvedTargetPath}`);
      return resolve(false);
    }

    // Construct and validate absolute target URL to prevent SSRF/manipulation
    let targetUrl;
    try {
      const parsedBase = new URL(BASE_URL);
      const parsedFull = new URL(normalizedPath, parsedBase);
      if (parsedFull.origin !== parsedBase.origin) {
        console.error(`[ERROR] Target URL origin mismatch detected: ${parsedFull.href}`);
        return resolve(false);
      }
      targetUrl = parsedFull.href;
    } catch (urlError) {
      console.error(`[ERROR] Malformed URL construction for ${fileObj.path}: ${urlError.message}`);
      return resolve(false);
    }

    const requestOptions = {
      headers: { 'User-Agent': USER_AGENT }
    };

    const dir = path.dirname(resolvedTargetPath);
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
      }
    } catch (mkdirError) {
      const message = mkdirError instanceof Error ? mkdirError.message : String(mkdirError);
      console.error(`[ERROR] Failed to create directory ${dir}: ${message}`);
      return resolve(false);
    }

    const req = https.get(targetUrl, requestOptions, (res) => {
      if (res.statusCode !== 200) {
        console.error(`[ERROR] Failed to download ${fileObj.path}: HTTP status code ${res.statusCode}`);
        res.resume(); // Consume response stream to free memory
        return resolve(false);
      }

      const contentLengthHeader = res.headers['content-length'];
      if (contentLengthHeader) {
        const contentLength = parseInt(contentLengthHeader, 10);
        if (!isNaN(contentLength) && contentLength > MAX_FILE_SIZE_BYTES) {
          console.error(`[ERROR] File size exceeds security threshold for ${fileObj.path}: ${contentLength} bytes`);
          res.resume();
          return resolve(false);
        }
      }

      const writeStream = fs.createWriteStream(resolvedTargetPath, { mode: 0o644 });
      let downloadedBytes = 0;
      let hasAborted = false;

      res.on('data', (chunk) => {
        if (hasAborted) return;
        downloadedBytes += chunk.length;
        if (downloadedBytes > MAX_FILE_SIZE_BYTES) {
          hasAborted = true;
          console.error(`[ERROR] Download exceeded maximum memory bounds during streaming for ${fileObj.path}`);
          res.destroy();
          writeStream.destroy();
          fs.unlink(resolvedTargetPath, () => {});
          resolve(false);
        }
      });

      res.pipe(writeStream);

      writeStream.on('finish', () => {
        if (hasAborted) return;
        writeStream.close((err) => {
          if (err) {
            console.error(`[ERROR] Failed to close write stream for ${fileObj.path}: ${err.message}`);
            fs.unlink(resolvedTargetPath, () => {});
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
        fs.unlink(resolvedTargetPath, () => {}); // Asynchronously clean up partial file
        resolve(false);
      });

      res.on('error', (resError) => {
        if (hasAborted) return;
        console.error(`[ERROR] Response stream error downloading ${fileObj.path}: ${resError.message}`);
        writeStream.destroy();
        fs.unlink(resolvedTargetPath, () => {});
        resolve(false);
      });
    });

    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      console.error(`[ERROR] Request timeout downloading ${fileObj.path}`);
      req.destroy();
      resolve(false);
    });

    req.on('error', (err) => {
      console.error(`[ERROR] Network error downloading ${fileObj.path}: ${err.message}`);
      resolve(false);
    });

    req.end();
  });
}

/**
 * Orchestrates the sequential download of all qualifying missing files with robust lifecycle tracking.
 * @returns {Promise<void>}
 */
async function doAll() {
  const missing = loadMissingManifest();
  let count = 0;

  for (const f of missing) {
    if (f && typeof f.path === 'string' && f.path.startsWith('src/')) {
      const success = await download(f);
      if (success) {
        count++;
      }
    }
  }

  console.log(`Download operation complete. Total files processed: ${count}.`);
}

module.exports = {
  loadMissingManifest,
  download,
  doAll
};

// Execute execution cycle
if (require.main === module) {
  doAll().catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[FATAL] Unhandled execution error in doAll: ${message}`);
    process.exit(1);
  });
}