/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fetch_siphon.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Clean JavaScript module with robust error handling and stream limits.
 */

'use strict';

const https = require('node:https');

const SIPHON_ENDPOINT = 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/src/utils/siphon.ts';
const TIMEOUT_MS = 10000;
const MAX_CONTENT_LENGTH_BYTES = 5 * 1024 * 1024;
const REQUEST_HEADERS = Object.freeze({
  'User-Agent': 'EMG-Core-Neural-Optimizer/4.9',
  'Accept': 'text/plain,application/typescript'
});

const PARSED_ENDPOINT = new URL(SIPHON_ENDPOINT);
if (PARSED_ENDPOINT.protocol !== 'https:') {
  throw new Error('Security violation: Only secure HTTPS endpoints are permitted.');
}

/**
 * Handles payload extraction using the modern global fetch API with minimized allocations.
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

    if (response.status !== 200) {
      throw new Error(`HTTP Operation Failed: Status Code ${response.status}`);
    }

    const contentLengthHeader = response.headers.get('content-length');
    if (contentLengthHeader !== null && Number(contentLengthHeader) > MAX_CONTENT_LENGTH_BYTES) {
      throw new Error('Payload size exceeds safety bounds limit.');
    }

    const responseText = await response.text();
    if (Buffer.byteLength(responseText) > MAX_CONTENT_LENGTH_BYTES) {
      throw new Error('Payload size exceeds safety bounds limit.');
    }

    process.stdout.write(responseText.endsWith('\n') ? responseText : responseText + '\n');
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Handles payload extraction using the fallback Node.js https module with pre-allocated buffer streams.
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
        if (contentLengthHeader !== undefined && Number(contentLengthHeader) > MAX_CONTENT_LENGTH_BYTES) {
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
            process.stdout.write(assembledData.endsWith('\n') ? assembledData : assembledData + '\n');
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
 * Fetches the remote siphon utility script with optimized caching and minimal runtime overhead.
 * @returns {Promise<void>} Resolves when the payload is successfully outputted to stdout.
 */
async function fetchSiphon() {
  return typeof globalThis.fetch === 'function' ? fetchUsingGlobalAPI() : fetchUsingLegacyHttps();
}

fetchSiphon().catch((error) => {
  console.error(`[EMG-CRITICAL-ERROR]: ${error.message}`);
  process.exitCode = 1;
});

module.exports = { fetchSiphon };