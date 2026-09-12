import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const COMMIT_SHA = '71f4f383afa014a1255d977791d6531a2033e323';
const SHA_HASH_PATTERN = /^[a-fA-F0-9]{40}$/;
const SYSTEM_TIMEOUT_MS = 15_000;

if (!SHA_HASH_PATTERN.test(COMMIT_SHA)) {
  throw new Error('CRITICAL SECURITY: Invalid COMMIT_SHA format detected.');
}

const BASE_WORKSPACE_DIRECTORY = path.resolve('.');

const SYSTEM_CONFIG = Object.freeze({
  targetUrl: `https://raw.githubusercontent.com/craighckby-stack/DARLEK_CAAN_ENGINE/${COMMIT_SHA}/src/app/page.tsx`,
  targetPath: path.resolve('src/app/page.tsx'),
  minLineCountThreshold: 1000,
  maxContentLength: 10 * 1024 * 1024, // 10MB defensive upper bound
  timeoutMs: SYSTEM_TIMEOUT_MS,
});

/**
 * Validates and parses the request URL against allowed security parameters with strict boundary checking.
 * @param {string} rawRequestUrl - The raw endpoint URL string.
 * @returns {URL} The parsed URL object.
 */
function validateAndParseUrl(rawRequestUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(rawRequestUrl);
  } catch {
    throw new Error('Invalid URL format supplied to fetchContent.');
  }

  if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname !== 'raw.githubusercontent.com') {
    throw new Error('Security violation: Untrusted domain or protocol in request URL.');
  }

  return parsedUrl;
}

/**
 * Performs an HTTPS request using native fetch API and AbortController timeout protection.
 * @param {string} rawRequestUrl - The HTTPS endpoint URL to fetch data from.
 * @returns {Promise<string>} The retrieved response body as a string.
 */
async function fetchContent(rawRequestUrl) {
  const parsedUrl = validateAndParseUrl(rawRequestUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SYSTEM_CONFIG.timeoutMs);

  try {
    const response = await fetch(parsedUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'DARLEK-CANN-Optimizer/4.9',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP status ${response.status}: ${response.statusText}`);
    }

    const contentLengthHeader = response.headers.get('content-length');
    if (contentLengthHeader && parseInt(contentLengthHeader, 10) > SYSTEM_CONFIG.maxContentLength) {
      throw new Error('Security limit exceeded: Content-Length header exceeds maximum threshold.');
    }

    const text = await response.text();

    if (Buffer.byteLength(text, 'utf8') > SYSTEM_CONFIG.maxContentLength) {
      throw new Error('Security limit exceeded: Response payload exceeds maximum safety threshold.');
    }

    return text;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${SYSTEM_CONFIG.timeoutMs}ms limit.`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Ensures the target file path is securely contained within the workspace root directory.
 * @param {string} targetFileSystemPath - The filesystem path to validate.
 */
function ensureWorkspaceContainment(targetFileSystemPath) {
  const resolvedPath = path.resolve(targetFileSystemPath);
  const relativePath = path.relative(BASE_WORKSPACE_DIRECTORY, resolvedPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error('Security violation: Target path escapes root workspace directory.');
  }
}

/**
 * Counts the number of lines in a string using regex search for optimal execution speed.
 * @param {string} str - The target string.
 * @returns {number} The line count.
 */
function countLines(str) {
  if (!str) return 0;
  const matches = str.match(/\n/g);
  return matches ? matches.length + 1 : 1;
}

/**
 * Retrieves the first N lines from a string cleanly.
 * @param {string} str - The target string.
 * @param {number} maxLines - Maximum lines to retrieve.
 * @returns {string} The substring containing the first N lines.
 */
function getFirstNLines(str, maxLines) {
  return str.split('\n').slice(0, maxLines).join('\n');
}

/**
 * Main execution routine handling file download, verification, and filesystem operations.
 * @returns {Promise<void>}
 */
export async function executeDownloadPipeline() {
  try {
    console.log(`Downloading page.tsx from commit ${COMMIT_SHA.slice(0, 8)}...`);
    const fileContent = await fetchContent(SYSTEM_CONFIG.targetUrl);

    const lineCount = countLines(fileContent);
    console.log(`Downloaded ${lineCount} lines. First 5 lines:`);
    console.log(getFirstNLines(fileContent, 5));

    if (lineCount <= SYSTEM_CONFIG.minLineCountThreshold) {
      console.warn(
        `Warning: Downloaded file has ${lineCount} lines (threshold: ${SYSTEM_CONFIG.minLineCountThreshold}), did not overwrite local file.`
      );
      return;
    }

    ensureWorkspaceContainment(SYSTEM_CONFIG.targetPath);

    const targetDirectory = path.dirname(SYSTEM_CONFIG.targetPath);
    await fs.mkdir(targetDirectory, { recursive: true });
    await fs.writeFile(SYSTEM_CONFIG.targetPath, fileContent, 'utf8');

    console.log(`Successfully restored ${SYSTEM_CONFIG.targetPath} from commit ${COMMIT_SHA.slice(0, 8)}!`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error downloading file:', errorMessage);
    process.exitCode = 1;
  }
}

// Auto-execute if executed directly in Node
const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  executeDownloadPipeline();
}