/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fetch_siphon.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const https = require('node:https');

/**
 * Operational constants for the network transaction.
 */
const SIPHON_ENDPOINT = 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/src/utils/siphon.ts';
const TIMEOUT_MS = 10000;
const MAX_CONTENT_LENGTH_BYTES = 5 * 1024 * 1024; // 5 MB bounds check to prevent memory exhaustion
const REQUEST_HEADERS = Object.freeze({
  'User-Agent': 'EMG-Core-Neural-Optimizer/4.9',
  'Accept': 'text/plain,application/typescript'
});

/**
 * Validates that the endpoint URL strictly adheres to HTTPS protocol constraints.
 * @param {string} urlString 
 * @throws {TypeError} If the URL fails protocol validation.
 */
function validateEndpoint(urlString) {
  let parsedUrl;
  try {
    parsedUrl = new URL(urlString);
  } catch {
    throw new TypeError('Malformed siphon endpoint URL.');
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error('Security violation: Only secure HTTPS endpoints are permitted.');
  }
}

/**
 * Handles payload extraction using the modern global fetch API.
 * @returns {Promise<void>}
 */
async function fetchUsingGlobalAPI() {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort(new Error('Network operation timed out.'));
  }, TIMEOUT_MS);

  try {
    const response = await globalThis.fetch(SIPHON_ENDPOINT, {
      headers: REQUEST_HEADERS,
      signal: abortController.signal,
      redirect: 'error'
    });

    if (!response.ok) {
      throw new Error(`HTTP Operation Failed: Status Code ${response.status}`);
    }

    const contentLengthHeader = response.headers.get('content-length');
    if (contentLengthHeader && parseInt(contentLengthHeader, 10) > MAX_CONTENT_LENGTH_BYTES) {
      throw new Error('Payload size exceeds safety bounds limit.');
    }

    const responseText = await response.text();
    if (Buffer.byteLength(responseText, 'utf8') > MAX_CONTENT_LENGTH_BYTES) {
      throw new Error('Payload size exceeds safety bounds limit.');
    }

    process.stdout.write(responseText + (responseText.endsWith('\n') ? '' : '\n'));
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Handles payload extraction using the fallback Node.js https module.
 * @returns {Promise<void>}
 */
function fetchUsingLegacyHttps() {
  return new Promise((resolve, reject) => {
    const request = https.get(
      SIPHON_ENDPOINT,
      { headers: REQUEST_HEADERS, timeout: TIMEOUT_MS },
      (response) => {
        const { statusCode, headers } = response;

        if (statusCode !== 200) {
          response.resume();
          return reject(new Error(`HTTP Operation Failed: Status Code ${statusCode}`));
        }

        const contentLengthHeader = headers['content-length'];
        if (contentLengthHeader && parseInt(contentLengthHeader, 10) > MAX_CONTENT_LENGTH_BYTES) {
          response.resume();
          return reject(new Error('Payload size exceeds safety bounds limit.'));
        }

        let totalBytesAccumulated = 0;
        const dataChunks = [];

        response.on('data', (chunk) => {
          totalBytesAccumulated += chunk.length;
          if (totalBytesAccumulated > MAX_CONTENT_LENGTH_BYTES) {
            response.destroy(new Error('Payload size exceeds safety bounds limit.'));
            return;
          }
          dataChunks.push(chunk);
        });

        response.on('end', () => {
          try {
            const assembledData = Buffer.concat(dataChunks).toString('utf8');
            process.stdout.write(assembledData + (assembledData.endsWith('\n') ? '' : '\n'));
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        response.on('error', reject);
      }
    );

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy(new Error('Network operation timed out.'));
    });
  });
}

/**
 * Fetches the remote siphon utility script with robust error handling, protocol validation, and strict stream bounds checking.
 * @returns {Promise<void>} Resolves when the payload is successfully outputted to stdout.
 */
async function fetchSiphon() {
  validateEndpoint(SIPHON_ENDPOINT);

  if (typeof globalThis.fetch === 'function') {
    return fetchUsingGlobalAPI();
  }

  return fetchUsingLegacyHttps();
}

// Execute immediately to preserve operational signature
fetchSiphon().catch((error) => {
  console.error(`[EMG-CRITICAL-ERROR]: ${error.message}`);
  process.exitCode = 1;
});

module.exports = { fetchSiphon };