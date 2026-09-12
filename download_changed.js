import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * RemoteBlob definition.
 * @typedef {Object} RemoteBlob
 * @property {string} path
 * @property {string} [sha]
 */

const REPOSITORY_BASE_URL = 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/';
const USER_AGENT = 'DARLEK-CANN-SovereignEngine/89.1 (Ingestion-Layer)';
const HTTP_TIMEOUT_MS = 15_000;
const MAX_CONTENT_LENGTH = 10 * 1024 * 1024; // 10MB bounds safety limit
const CONCURRENCY_LIMIT = 5;

const REPOSITORY_BASE_URL_OBJ = new URL(REPOSITORY_BASE_URL);

/**
 * Safely loads and parses remote_blobs.json asynchronously with structure validation.
 * @returns {Promise<RemoteBlob[]>}
 */
export async function loadRemoteBlobs() {
  try {
    const rawData = await fs.readFile('remote_blobs.json', 'utf8');
    const parsed = JSON.parse(rawData);

    if (!Array.isArray(parsed)) {
      console.warn('Warning: remote_blobs.json did not contain a valid array.');
      return [];
    }

    return parsed.filter(isValidRemoteBlob);
  } catch (error) {
    console.error('CRITICAL: Failed to read or parse remote_blobs.json:', formatErrorMessage(error));
    return [];
  }
}

/**
 * Validates target file path constraints to prevent directory traversal attacks.
 * @param {string} rawPath - Target file path string.
 * @returns {string|null} Sanitized safe relative path or null if unsafe.
 */
export function getSanitizedFilePath(rawPath) {
  if (typeof rawPath !== 'string' || !rawPath.trim()) return null;

  const normalized = path.normalize(rawPath).replace(/^(\.\.(\/|\\))+/, '');
  const rootPath = process.cwd();
  const absoluteTarget = path.resolve(rootPath, normalized);

  const isOutsideRoot = !absoluteTarget.startsWith(rootPath);
  const containsNullByte = normalized.includes('\0');
  const attemptsTraversal = normalized.startsWith('..');

  if (isOutsideRoot || containsNullByte || attemptsTraversal) {
    return null;
  }

  return normalized;
}

/**
 * Fetches remote file content via standard fetch API with enforced 15s timeout and memory limits.
 * @param {string} url - Target URL to fetch content from.
 * @returns {Promise<string>} Decoded string content from remote response.
 */
export async function fetchRemoteContent(url) {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'https:') {
    throw new Error('Security Violation: Insecure protocol blocked. HTTPS required.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);

  try {
    const response = await fetch(parsedUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/plain, application/octet-stream, */*',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength && Number.parseInt(contentLength, 10) > MAX_CONTENT_LENGTH) {
      throw new Error(`Response exceeds maximum size bounds (${contentLength} bytes)`);
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_CONTENT_LENGTH) {
      throw new Error(`Downloaded content exceeds size limit (${arrayBuffer.byteLength} bytes)`);
    }

    return new TextDecoder('utf-8').decode(arrayBuffer);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`Request timed out after ${HTTP_TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Checks whether a local file path exists.
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
export async function checkFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Executes array mapping in concurrent batches to balance network IO and performance.
 * @template T, R
 * @param {T[]} items
 * @param {number} limit
 * @param {(item: T) => Promise<R>} workerFn
 * @returns {Promise<R[]>}
 */
async function mapConcurrent(items, limit, workerFn) {
  const results = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    const chunkResults = await Promise.all(chunk.map(workerFn));
    results.push(...chunkResults);
  }
  return results;
}

/**
 * Processes remote blobs concurrently, detects modifications, synchronizes files securely, and outputs state.
 * @returns {Promise<void>}
 */
export async function processBlobsSequentially() {
  const remoteBlobs = await loadRemoteBlobs();

  const syncSingleBlob = async (blob) => {
    if (!blob || typeof blob.path !== 'string') {
      return null;
    }

    const sanitizedPath = getSanitizedFilePath(blob.path);
    if (!sanitizedPath) {
      console.warn(`Warning: Skipped unsafe or malformed path: "${blob.path}"`);
      return null;
    }

    if (!sanitizedPath.startsWith('src/')) {
      return null;
    }

    try {
      const fileExists = await checkFileExists(sanitizedPath);
      if (!fileExists) {
        return null;
      }

      const localContent = await fs.readFile(sanitizedPath, 'utf8');
      const remoteUrl = new URL(sanitizedPath, REPOSITORY_BASE_URL_OBJ).toString();
      const remoteContent = await fetchRemoteContent(remoteUrl);

      if (remoteContent !== localContent) {
        console.log(`Changed: ${sanitizedPath}`);

        // Guarantee target directory structure exists prior to writing
        await fs.mkdir(path.dirname(sanitizedPath), { recursive: true });
        await fs.writeFile(sanitizedPath, remoteContent, 'utf8');
        return blob;
      }
    } catch (error) {
      console.warn(`Warning: Failed to process path "${blob.path}":`, formatErrorMessage(error));
    }
    return null;
  };

  const results = await mapConcurrent(remoteBlobs, CONCURRENCY_LIMIT, syncSingleBlob);
  const changedFilesList = results.filter(Boolean);

  try {
    await fs.writeFile('changed_files.json', JSON.stringify(changedFilesList, null, 2), 'utf8');
    console.log(`Found ${changedFilesList.length} changed files.`);
  } catch (error) {
    console.error('CRITICAL: Failed to write changed_files.json:', formatErrorMessage(error));
  }
}

// Direct execution check for modern ES module runtime
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('download_changed.js')) {
  processBlobsSequentially().catch((error) => {
    console.error('Unhandled fatal error in processBlobsSequentially:', error);
  });
}