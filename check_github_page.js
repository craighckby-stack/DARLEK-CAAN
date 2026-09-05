/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: check_github_page.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const https = require('https');

/**
 * Configuration constants for network operations.
 */
const NETWORK_CONFIG = {
  USER_AGENT: 'DARLEK-CANN-Engine/4.9 (Node.js)',
  TIMEOUT_MS: 10000,
  PREVIEW_LINE_COUNT: 5
};

/**
 * Logs a standardized error block for a given label.
 * 
 * @param {string} label - The descriptive label for logging output.
 * @param {string} message - The error message to log.
 */
function logError(label, message) {
  console.error(`=== ${label} ===`);
  console.error(`[ERROR] ${message}`);
}

/**
 * Collects and aggregates response stream chunks into a complete string.
 * 
 * @param {import('http').IncomingMessage} response - The incoming HTTP response stream.
 * @returns {Promise<string>} The complete response body.
 */
function consumeResponseBody(response) {
  return new Promise((resolve, reject) => {
    let rawData = '';
    response.setEncoding('utf8');

    response.on('data', (chunk) => {
      rawData += chunk;
    });

    response.on('end', () => resolve(rawData));
    response.on('error', (err) => reject(err));
  });
}

/**
 * Analyzes and outputs structural metrics of the fetched page content.
 * 
 * @param {string} label - The descriptive label for logging output.
 * @param {string} data - The raw page content.
 */
function analyzeAndReportContent(label, data) {
  const lines = data.split(/\r?\n/);
  const totalLines = lines.length;
  const firstLines = lines.slice(0, NETWORK_CONFIG.PREVIEW_LINE_COUNT).join('\n');
  const lastLines = lines.slice(-NETWORK_CONFIG.PREVIEW_LINE_COUNT).join('\n');

  console.log(`=== ${label} ===`);
  console.log(`Length: ${Buffer.byteLength(data, 'utf8')} bytes`);
  console.log(`Lines: ${totalLines}`);
  console.log(`First ${NETWORK_CONFIG.PREVIEW_LINE_COUNT} lines:\n${firstLines}`);
  console.log(`Last ${NETWORK_CONFIG.PREVIEW_LINE_COUNT} lines:\n${lastLines}`);
}

/**
 * Checks a remote GitHub page via HTTPS with memory-efficient stream processing and robust error handling.
 * 
 * @param {string} url - The target URL to fetch.
 * @param {string} label - The descriptive label for logging output.
 * @returns {void}
 */
function checkPage(url, label) {
  if (typeof url !== 'string' || typeof label !== 'string') {
    logError(label || 'UNKNOWN', 'Invalid parameters passed to checkPage.');
    return;
  }

  const requestOptions = {
    headers: {
      'User-Agent': NETWORK_CONFIG.USER_AGENT
    },
    timeout: NETWORK_CONFIG.TIMEOUT_MS
  };

  const req = https.get(url, requestOptions, async (res) => {
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