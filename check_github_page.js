/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: check_github_page.js
 * Role: GitHub Raw Content & State Ingestion Verification Utility
 * Architecture: ES-Next async network client with AbortController timeout bounds and structured reporting.
 */

const { URL } = require('node:url');

/**
 * System configuration parameters for ingestion and network operations.
 */
const NETWORK_CONFIG = Object.freeze({
  USER_AGENT: 'DARLEK-CANN-Engine/89.1 (Node.js/Sovereign)',
  TIMEOUT_MS: 15000, // Enforced 15-second safeguard timeout protection
  PREVIEW_LINE_COUNT: 5,
  MAX_RESPONSE_BYTES: 10 * 1024 * 1024, // 10MB memory protection limit
  ALLOWED_HOSTNAMES: Object.freeze([
    'raw.githubusercontent.com',
    'github.com',
    'api.github.com',
  ]),
});

/**
 * Standard headers matching DARLEK CANN ingestion specifications.
 */
const BASE_HEADERS = Object.freeze({
  'User-Agent': NETWORK_CONFIG.USER_AGENT,
  'Accept': 'text/plain,application/vnd.github.v3+raw,*/*',
  'Accept-Charset': 'utf-8',
});

/**
 * Logs structured error diagnostic frames.
 * 
 * @param {string} label 
 * @param {string} message 
 */
function logError(label, message) {
  console.error(`=== ${label} ===\n[ERROR] ${message}`);
}

/**
 * Validates and parses a given target URL against strict security boundaries.
 * 
 * @param {string} inputUrl 
 * @returns {URL | null}
 */
function validateAndParseUrl(inputUrl) {
  if (typeof inputUrl !== 'string' || !inputUrl.trim() || inputUrl.length > 2048) {
    return null;
  }

  try {
    const parsedUrl = new URL(inputUrl);
    if (parsedUrl.protocol !== 'https:') {
      return null;
    }

    const isHostAllowed = NETWORK_CONFIG.ALLOWED_HOSTNAMES.some(
      (allowedHost) => parsedUrl.hostname === allowedHost || parsedUrl.hostname.endsWith(`.${allowedHost}`)
    );

    return isHostAllowed ? parsedUrl : null;
  } catch {
    return null;
  }
}

/**
 * Extracts preview lines (head/tail) and structural line metrics from raw text content.
 * 
 * @param {string} data 
 * @param {number} lineLimit 
 * @returns {{ firstLines: string, lastLines: string, lineCount: number }}
 */
function extractLineMetrics(data, lineLimit = NETWORK_CONFIG.PREVIEW_LINE_COUNT) {
  const totalLength = data.length;
  if (totalLength === 0) {
    return { firstLines: '', lastLines: '', lineCount: 0 };
  }

  const newlineIndices = [];
  for (let index = 0; index < totalLength; index++) {
    if (data.charCodeAt(index) === 10) { // '\n'
      newlineIndices.push(index);
    }
  }

  const lineCount = newlineIndices.length + 1;
  const isTruncated = lineCount > lineLimit;

  const firstLinesEnd = isTruncated ? newlineIndices[lineLimit - 1] : totalLength;
  const firstLines = data.slice(0, firstLinesEnd);

  const lastLinesStart = isTruncated ? newlineIndices[lineCount - lineLimit - 1] + 1 : 0;
  const lastLines = data.slice(lastLinesStart);

  return { firstLines, lastLines, lineCount };
}

/**
 * Analyzes and prints structural metrics of page content.
 * 
 * @param {string} label 
 * @param {string} data 
 */
function analyzeAndReportContent(label, data) {
  const byteLength = Buffer.byteLength(data, 'utf8');
  const { firstLines, lastLines, lineCount } = extractLineMetrics(data);

  console.log(`=== ${label} ===`);
  console.log(`Length: ${byteLength} bytes`);
  console.log(`Lines: ${lineCount}`);
  console.log(`First ${NETWORK_CONFIG.PREVIEW_LINE_COUNT} lines:\n${firstLines}`);
  console.log(`Last ${NETWORK_CONFIG.PREVIEW_LINE_COUNT} lines:\n${lastLines}`);
}

/**
 * Fetches and audits a remote GitHub resource using modern Fetch API with AbortController safeguards.
 * 
 * @param {string} url 
 * @param {string} label 
 * @returns {Promise<{ url: string, status: number, content?: string, sha?: string } | null>}
 */
async function checkPage(url, label) {
  if (typeof label !== 'string' || !label) {
    logError('UNKNOWN', 'Invalid or missing label parameter.');
    return null;
  }

  const validatedUrl = validateAndParseUrl(url);
  if (!validatedUrl) {
    logError(label, 'Invalid or untrusted URL provided (Security bounds violation).');
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NETWORK_CONFIG.TIMEOUT_MS);

  try {
    const response = await fetch(validatedUrl.toString(), {
      method: 'GET',
      headers: BASE_HEADERS,
      signal: controller.signal,
    });

    if (!response.ok) {
      logError(label, `HTTP Status Code: ${response.status} ${response.statusText}`);
      return { url: validatedUrl.toString(), status: response.status };
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength && Number.parseInt(contentLength, 10) > NETWORK_CONFIG.MAX_RESPONSE_BYTES) {
      logError(label, 'Content-Length exceeds maximum allowed response threshold.');
      return null;
    }

    const data = await response.text();
    if (Buffer.byteLength(data, 'utf8') > NETWORK_CONFIG.MAX_RESPONSE_BYTES) {
      logError(label, 'Response body exceeded maximum allowed memory size.');
      return null;
    }

    // Extract SHA identifier from target URL path if available
    const commitShaMatch = validatedUrl.pathname.match(/\/([a-f0-9]{40})\//i);
    const sha = commitShaMatch ? commitShaMatch[1] : undefined;

    analyzeAndReportContent(label, data);

    return {
      url: validatedUrl.toString(),
      status: response.status,
      content: data,
      sha,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      logError(label, `Request timed out after ${NETWORK_CONFIG.TIMEOUT_MS}ms safeguard limit.`);
    } else {
      logError(label, `Network or request failure: ${error.message}`);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Autonomous self-execution sequence when executed as primary entry point
if (require.main === module) {
  (async () => {
    await checkPage(
      'https://raw.githubusercontent.com/craighckby-stack/DARLEK_CAAN_ENGINE/main/src/app/page.tsx',
      'MAIN BRANCH'
    );
    await checkPage(
      'https://raw.githubusercontent.com/craighckby-stack/DARLEK_CAAN_ENGINE/71f4f383afa014a1255d977791d6531a2033e323/src/app/page.tsx',
      'COMMIT 71f4f383'
    );
  })();
}

module.exports = {
  checkPage,
  validateAndParseUrl,
  extractLineMetrics,
  NETWORK_CONFIG,
};