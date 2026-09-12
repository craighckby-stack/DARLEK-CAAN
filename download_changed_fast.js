import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const REMOTE_BLOBS_PATH = 'remote_blobs.json';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/';
const USER_AGENT = 'DarlekCaan-IngestionModule/89.1';
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_CONCURRENCY = 16;
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const ABSOLUTE_BASE_PATH = path.resolve(process.cwd());
const ALLOWED_HOSTNAME = 'raw.githubusercontent.com';

/**
 * Validates target file path to prevent path traversal vulnerability.
 * @param {string} userPath
 * @returns {string} Safe absolute path
 */
function validateAndResolvePath(userPath) {
  if (typeof userPath !== 'string' || !userPath.trim()) {
    throw new Error('Invalid path: non-empty string required.');
  }

  if (userPath.includes('\0')) {
    throw new Error('Security violation: Null byte detected in path.');
  }

  const normalizedRelative = path.normalize(userPath).replace(/^(\.\.[\/\\])+/, '');
  const resolvedPath = path.resolve(ABSOLUTE_BASE_PATH, normalizedRelative);

  if (!resolvedPath.startsWith(ABSOLUTE_BASE_PATH)) {
    throw new Error(`Security violation: Path traversal prohibited: ${userPath}`);
  }

  return resolvedPath;
}

/**
 * Validates remote URL against origin and protocol constraints.
 * @param {string} targetUrl
 * @returns {URL}
 */
function validateAndParseUrl(targetUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    throw new Error(`Invalid URL structure: ${targetUrl}`);
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error(`Security violation: Only HTTPS permitted (${parsedUrl.protocol})`);
  }

  if (parsedUrl.hostname !== ALLOWED_HOSTNAME) {
    throw new Error(`Security violation: Unauthorized host '${parsedUrl.hostname}'.`);
  }

  return parsedUrl;
}

/**
 * Executes high-performance fetch with enforced 15s AbortSignal timeout and payload limit.
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchRemoteContent(url) {
  const verifiedUrl = validateAndParseUrl(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(verifiedUrl.toString(), {
      method: 'GET',
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE_BYTES) {
      throw new Error('Payload length exceeds maximum allowable threshold (50MB).');
    }

    const text = await response.text();
    if (Buffer.byteLength(text, 'utf8') > MAX_FILE_SIZE_BYTES) {
      throw new Error('Buffer payload limit exceeded safety threshold.');
    }

    return text;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Worker pool processor for controlled concurrent file updates.
 * @param {Array<Object>} items
 * @param {number} limit
 * @param {Function} taskFn
 */
async function mapConcurrent(items, limit, taskFn) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const promise = Promise.resolve().then(() => taskFn(item));
    results.push(promise);
    executing.add(promise);

    const clean = () => executing.delete(promise);
    promise.then(clean, clean);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

/**
 * Main execution loop matching the DARLEK CANN ingestion specification.
 */
async function main() {
  let remoteBlobs;

  try {
    const safeMetaPath = validateAndResolvePath(REMOTE_BLOBS_PATH);
    const rawMeta = await fs.readFile(safeMetaPath, 'utf8');
    remoteBlobs = JSON.parse(rawMeta);
  } catch (err) {
    console.error(`Failed to load architectural meta file (${REMOTE_BLOBS_PATH}):`, err.message);
    process.exit(1);
  }

  if (!Array.isArray(remoteBlobs)) {
    console.error(`Invalid structure in ${REMOTE_BLOBS_PATH}: Expected Root Array.`);
    process.exit(1);
  }

  const candidateFiles = [];
  for (const entry of remoteBlobs) {
    if (entry && typeof entry.path === 'string' && entry.path.startsWith('src/')) {
      try {
        const safePath = validateAndResolvePath(entry.path);
        if (existsSync(safePath)) {
          candidateFiles.push({ ...entry, safePath });
        }
      } catch {
        // Skip invalid candidate paths securely
      }
    }
  }

  const updatedFiles = [];

  await mapConcurrent(candidateFiles, MAX_CONCURRENCY, async (fileObj) => {
    try {
      const localContent = await fs.readFile(fileObj.safePath, 'utf8');
      const remoteUrl = GITHUB_RAW_BASE + fileObj.path;
      const remoteContent = await fetchRemoteContent(remoteUrl);

      if (remoteContent !== localContent) {
        await fs.writeFile(fileObj.safePath, remoteContent, 'utf8');
        console.log(`Updated: ${fileObj.path}`);
        updatedFiles.push(fileObj.path);
      }
    } catch (err) {
      console.warn(`Sync omitted for ${fileObj.path}:`, err.message);
    }
  });

  console.log(`Sync Complete: Synchronized ${updatedFiles.length} changed files.`);
}

main().catch((err) => {
  console.error('Fatal execution anomaly:', err);
  process.exit(1);
});