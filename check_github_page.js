/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: check_github_page.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const https = require('https');
const { URL } = require('url');

/**
 * Configuration constants for network operations.
 */
const NETWORK_CONFIG = Object.freeze({
  USER_AGENT: 'DARLEK-CANN-Engine/4.9 (Node.js)',
  TIMEOUT_MS: 10000,
  PREVIEW_LINE_COUNT: 5,
  MAX_RESPONSE_BYTES: 10 * 1024 * 1024 // 10MB strict bounds limit for memory protection
});

/**
 * Base HTTP headers utilized across outgoing requests.
 */
const BASE_HEADERS = Object.freeze({
  'User-Agent': NETWORK_CONFIG.USER_AGENT,
  'Accept': 'text/plain,application/vnd.github.v3+raw,*/*',
  'Accept-Charset': 'utf-8'
});

/**
 * Logs a standardized error block for a given label.
 * 
 * @param {string} label - The descriptive label for logging output.
 * @param {string} message - The error message to log.
 */
function logError(label, message) {
  console.error(`=== ${label} ===\n[ERROR] ${message}`);
}

/**
 * Validates the target URL to ensure it is a safe HTTPS URL pointing to allowed domains.
 * 
 * @param {string} inputUrl - The URL string to validate.
 * @returns {URL|null} The parsed URL object or null if invalid.
 */
function validateAndParseUrl(inputUrl) {
  if (typeof inputUrl !== 'string' || inputUrl.length === 0 || inputUrl.length > 2048) {
    return null;
  }

  try {
    const parsed = new URL(inputUrl);
    if (parsed.protocol !== 'https:') {
      return null;
    }
    // Restrict host to trusted domains (e.g., githubusercontent.com)
    if (!parsed.hostname.endsWith('githubusercontent.com') && !parsed.hostname.endsWith('github.com')) {
      return null;
    }
    return parsed;
  } catch (err) {
    return null;
  }
}

/**
 * Collects and aggregates response stream chunks into a complete string with strict bounds checking.
 * 
 * @param {import('http').IncomingMessage} response - The incoming HTTP response stream.
 * @returns {Promise<string>} The complete response body.
 */
function consumeResponseBody(response) {
  return new Promise((resolve, reject) => {
    let totalBytes = 0;
    const chunks = [];
    
    response.setEncoding('utf8');

    response.on('data', (chunk) => {
      totalBytes += Buffer.byteLength(chunk, 'utf8');
      if (totalBytes > NETWORK_CONFIG.MAX_RESPONSE_BYTES) {
        response.destroy();
        reject(new Error('Response body exceeded maximum allowed length (Memory/Overflow protection).'));
        return;
      }
      chunks.push(chunk);
    });

    response.on('end', () => resolve(chunks.join('')));
    response.on('error', reject);
  });
}

/**
 * Analyzes and outputs structural metrics of the fetched page content with zero excessive array allocations.
 * 
 * @param {string} label - The descriptive label for logging output.
 * @param {string} data - The raw page content.
 */
function analyzeAndReportContent(label, data) {
  const contentLen = data.length;
  const previewLimit = NETWORK_CONFIG.PREVIEW_LINE_COUNT;
  
  let totalLines = 0;
  let firstLinesEnd = -1;
  let lastLinesStart = 0;
  
  // Single-pass newline tracking to prevent massive array creation from split()
  for (let i = 0; i < contentLen; i++) {
    if (data.charCodeAt(i) === 10) { // '\n'
      totalLines++;
      if (totalLines === previewLimit) {
        firstLinesEnd = i;
      }
      if (totalLines > previewLimit) {
        lastLinesStart = data.indexOf('\n', lastLinesStart) + 1;
      }
    }
  }
  totalLines++; // Account for final line without trailing newline

  const firstLines = firstLinesEnd !== -1 ? data.slice(0, firstLinesEnd) : data;
  const lastLines = totalLines > previewLimit ? data.slice(lastLinesStart) : data;

  console.log(`=== ${label} ===`);
  console.log(`Length: ${Buffer.byteLength(data, 'utf8')} bytes`);
  console.log(`Lines: ${totalLines}`);
  console.log(`First ${previewLimit} lines:\n${firstLines}`);
  console.log(`Last ${previewLimit} lines:\n${lastLines}`);
}

/**
 * Checks a remote GitHub page via HTTPS with memory-efficient stream processing and robust error handling.
 * 
 * @param {string} url - The target URL to fetch.
 * @param {string} label - The descriptive label for logging output.
 * @returns {void}
 */
function checkPage(url, label) {
  if (typeof label !== 'string') {
    logError('UNKNOWN', 'Invalid label parameter passed to checkPage.');
    return;
  }

  const validatedUrl = validateAndParseUrl(url);
  if (!validatedUrl) {
    logError(label, 'Invalid or untrusted URL provided (Security bounds violation).');
    return;
  }

  const requestOptions = {
    headers: BASE_HEADERS,
    timeout: NETWORK_CONFIG.TIMEOUT_MS
  };

  const req = https.get(validatedUrl, requestOptions, async (res) => {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      logError(label, `HTTP Status Code: ${res.statusCode} ${res.statusMessage || ''}`);
      res.resume();
      return;
    }

    try {
      const data = await consumeResponseBody(res);
      analyzeAndReportContent(label, data);
    } catch (processingError) {
      logError(label, `Failed to process response data: ${processingError.message}`);
    }
  });

  req.on('error', (error) => {
    logError(label, `Network or request failure: ${error.message}`);
  });

  req.on('timeout', () => {
    logError(label, 'Request timed out.');
    req.destroy();
  });
}

// Execute checks with preserved external API contracts and signatures
checkPage('https://raw.githubusercontent.com/craighckby-stack/DARLEK_CAAN_ENGINE/main/src/app/page.tsx', 'MAIN BRANCH');
checkPage('https://raw.githubusercontent.com/craighckby-stack/DARLEK_CAAN_ENGINE/71f4f383afa014a1255d977791d6531a2033e323/src/app/page.tsx', 'COMMIT 71f4f383');

module.exports = {
  checkPage
};