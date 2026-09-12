import { existsSync } from 'node:fs';
import { readFile, mkdir, unlink, stat } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MISSING_FILE_MANIFEST_PATH = path.resolve('missing_files.json');
const BASE_REPOSITORY_URL = 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/';
const REQUEST_TIMEOUT_MS = 15_000; // Aligned with DARLEK CANN 15-second safeguard standard
const CLIENT_USER_AGENT = 'DARLEK-CANN-Engine/89.1';
const MAX_MANIFEST_SIZE_BYTES = 1_048_576; // 1MB upper bound
const MAX_FILE_SIZE_BYTES = 50 * 1_048_576; // 50MB streaming limit

const PARSED_BASE_URL = new URL(BASE_REPOSITORY_URL);
const CWD = process.cwd();

/**
 * Safely extracts error messages from unknown error types.
 * @param {unknown} error - The caught error object.
 * @returns {string} Formatted error message.
 */
function extractErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Unlinks a partially downloaded file asynchronously upon failure or cancellation.
 * @param {string} targetPath - Absolute path of partial file.
 */
async function cleanupPartialFile(targetPath) {
  try {
    await unlink(targetPath);
  } catch {
    // Suppress unlinking errors for missing or locked files
  }
}

/**
 * Asynchronously loads and parses the missing files manifest with strict memory boundaries.
 * @returns {Promise<Array<{path: string}>>} Array of missing file objects.
 */
export async function loadMissingManifest() {
  try {
    const resolvedPath = path.resolve(MISSING_FILE_MANIFEST_PATH);
    if (!existsSync(resolvedPath)) {
      throw new Error(`Manifest not found at ${MISSING_FILE_MANIFEST_PATH}`);
    }

    const fileStats = await stat(resolvedPath);
    if (fileStats.size > MAX_MANIFEST_SIZE_BYTES) {
      throw new Error(`Manifest size (${fileStats.size} bytes) exceeds limit of ${MAX_MANIFEST_SIZE_BYTES} bytes.`);
    }

    const rawData = await readFile(resolvedPath, 'utf-8');
    const parsed = JSON.parse(rawData);

    if (!Array.isArray(parsed)) {
      throw new Error('Manifest content must be an array of objects.');
    }

    return parsed;
  } catch (error) {
    console.error(`[CRITICAL] Failed to load missing files manifest: ${extractErrorMessage(error)}`);
    throw error;
  }
}

/**
 * Validates target file path against path traversal attacks and working directory escapes.
 * @param {string} rawFilePath - Raw target relative file path.
 * @returns {string|null} Resolved absolute path or null if validation fails.
 */
export function validateAndResolveTargetPath(rawFilePath) {
  if (typeof rawFilePath !== 'string' || !rawFilePath.trim()) {
    return null;
  }

  const sanitizedInput = rawFilePath.replace(/^(\.\.[\/\\])+/, '');
  const normalizedPath = path.normalize(sanitizedInput);

  if (path.isAbsolute(normalizedPath) || normalizedPath.startsWith('..')) {
    console.error(`[ERROR] Security violation: Path traversal attempt blocked -> ${rawFilePath}`);
    return null;
  }

  const resolvedTargetPath = path.resolve(CWD, normalizedPath);
  if (!resolvedTargetPath.startsWith(CWD)) {
    console.error(`[ERROR] Security violation: Path escape attempt blocked -> ${resolvedTargetPath}`);
    return null;
  }

  return resolvedTargetPath;
}

/**
 * Constructs and validates target URL against origin mismatch / SSRF attacks.
 * @param {string} normalizedPath - Relative path.
 * @returns {string|null} Fully qualified URL or null if invalid.
 */
export function constructTargetUrl(normalizedPath) {
  try {
    const parsedFullUrl = new URL(normalizedPath, PARSED_BASE_URL);

    if (parsedFullUrl.origin !== PARSED_BASE_URL.origin) {
      console.error(`[ERROR] SSRF Guard: Target URL origin mismatch -> ${parsedFullUrl.href}`);
      return null;
    }

    return parsedFullUrl.href;
  } catch (urlError) {
    console.error(`[ERROR] Malformed target URL construction for ${normalizedPath}: ${extractErrorMessage(urlError)}`);
    return null;
  }
}

/**
 * Ensures parent directory exists recursively using non-blocking async IO.
 * @param {string} targetFilePath - Absolute target file path.
 * @returns {Promise<boolean>} Success indicator.
 */
export async function ensureTargetDirectoryExists(targetFilePath) {
  const parentDirectory = path.dirname(targetFilePath);
  try {
    await mkdir(parentDirectory, { recursive: true, mode: 0o755 });
    return true;
  } catch (error) {
    console.error(`[ERROR] Failed to create directory ${parentDirectory}: ${extractErrorMessage(error)}`);
    return false;
  }
}

/**
 * Asynchronously fetches a target file using native Fetch API, AbortController, and streaming pipeline.
 * @param {{ path: string }} fileObj - Object containing target relative path.
 * @returns {Promise<boolean>} Success indicator.
 */
export async function download(fileObj) {
  if (!fileObj || typeof fileObj.path !== 'string' || !fileObj.path.trim()) {
    console.error('[ERROR] Invalid file object provided for download.');
    return false;
  }

  const sanitizedInput = fileObj.path.replace(/^(\.\.[\/\\])+/, '');
  const normalizedPath = path.normalize(sanitizedInput);
  const resolvedTargetPath = validateAndResolveTargetPath(fileObj.path);

  if (!resolvedTargetPath) return false;

  const targetUrl = constructTargetUrl(normalizedPath);
  if (!targetUrl) return false;

  const dirReady = await ensureTargetDirectoryExists(resolvedTargetPath);
  if (!dirReady) return false;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': CLIENT_USER_AGENT },
    });

    if (!response.ok) {
      console.error(`[ERROR] Download failed for ${fileObj.path}: HTTP status ${response.status}`);
      return false;
    }

    const contentLengthHeader = response.headers.get('content-length');
    if (contentLengthHeader) {
      const contentLength = parseInt(contentLengthHeader, 10);
      if (!isNaN(contentLength) && contentLength > MAX_FILE_SIZE_BYTES) {
        console.error(`[ERROR] File size threshold exceeded for ${fileObj.path}: ${contentLength} bytes`);
        return false;
      }
    }

    if (!response.body) {
      console.error(`[ERROR] Received empty response body for ${fileObj.path}`);
      return false;
    }

    const nodeStream = Readable.fromWeb(response.body);
    const fileWriteStream = createWriteStream(resolvedTargetPath, { mode: 0o644 });

    let downloadedBytes = 0;
    nodeStream.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      if (downloadedBytes > MAX_FILE_SIZE_BYTES) {
        controller.abort();
      }
    });

    await pipeline(nodeStream, fileWriteStream);
    console.log(`[SUCCESS] Downloaded: ${fileObj.path}`);
    return true;

  } catch (error) {
    await cleanupPartialFile(resolvedTargetPath);
    if (error.name === 'AbortError') {
      console.error(`[ERROR] Request aborted or timed out (${REQUEST_TIMEOUT_MS}ms limit) for ${fileObj.path}`);
    } else {
      console.error(`[ERROR] Stream pipeline error downloading ${fileObj.path}: ${extractErrorMessage(error)}`);
    }
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Orchestrates batch download of missing files sequentially.
 * @returns {Promise<void>}
 */
export async function doAll() {
  const missingFilesManifest = await loadMissingManifest();
  let successfullyProcessedCount = 0;

  for (const manifestEntry of missingFilesManifest) {
    if (manifestEntry?.path && typeof manifestEntry.path === 'string' && manifestEntry.path.startsWith('src/')) {
      const isSuccess = await download(manifestEntry);
      if (isSuccess) {
        successfullyProcessedCount++;
      }
    }
  }

  console.log(`[COMPLETE] Download operation finished. Total files processed: ${successfullyProcessedCount}.`);
}

// Auto-execution for CLI entry point
const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFilePath) {
  doAll().catch((executionError) => {
    console.error(`[FATAL] Unhandled execution error in doAll: ${extractErrorMessage(executionError)}`);
    process.exit(1);
  });
}