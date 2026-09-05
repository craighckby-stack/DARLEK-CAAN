/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fetch_repo.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const https = require('https');
const { URL } = require('url');

/**
 * Interface specification for fetch options.
 * @typedef {Object} RequestOptions
 * @property {string} url - Target HTTP endpoint.
 * @property {number} timeout - Maximum duration in milliseconds before request abort.
 * @property {Record<string, string>} headers - Headers attached to outgoing request.
 */

/** @type {Readonly<RequestOptions>} */
const DEFAULT_CONFIG = Object.freeze({
  url: 'https://api.github.com/repos/craighckby-stack/epistemic_debate_engine/git/trees/main?recursive=1',
  timeout: 10000,
  headers: Object.freeze({
    'User-Agent': 'node.js',
    'Accept': 'application/vnd.github.v3+json'
  })
});

const MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10MB strict safety bounds check for buffer allocation

/**
 * Validates target URL scheme and host restrictions to prevent SSRF and injection vulnerabilities.
 * @param {string} inputUrl - The URL string to evaluate.
 * @returns {URL} Parsed and validated URL object.
 */
function validateAndParseUrl(inputUrl) {
  if (typeof inputUrl !== 'string' || inputUrl.length === 0) {
    throw new Error('Target URL must be a non-empty string.');
  }

  let parsed;
  try {
    parsed = new URL(inputUrl);
  } catch (err) {
    throw new Error(`Invalid URL format: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('Security policy violation: Only HTTPS protocol is allowed.');
  }

  // Enforce host validation bounds to prevent unauthorized endpoints
  const allowedHostname = 'api.github.com';
  if (parsed.hostname !== allowedHostname && !parsed.hostname.endsWith('.' + allowedHostname)) {
    throw new Error(`Security policy violation: Hostname '${parsed.hostname}' is not permitted.`);
  }

  return parsed;
}

/**
 * Fetches repository payload asynchronously with optimized buffer allocation, strict bounds checking, and defense-in-depth security validations.
 * @param {string} [targetUrl=DEFAULT_CONFIG.url] - Target endpoint to fetch data from.
 * @returns {Promise<string>} Promise resolving to raw output string.
 */
function fetchRepositoryData(targetUrl = DEFAULT_CONFIG.url) {
  return new Promise((resolve, reject) => {
    let parsedUrl;
    try {
      parsedUrl = validateAndParseUrl(targetUrl);
    } catch (validationErr) {
      reject(validationErr);
      return;
    }

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: DEFAULT_CONFIG.headers
    };

    const req = https.request(requestOptions, (res) => {
      const statusCode = res.statusCode || 0;

      if (statusCode < 200 || statusCode >= 300) {
        res.resume();
        reject(new Error(`HTTP Request Failed with Status Code: ${statusCode}`));
        return;
      }

      /** @type {Buffer[]} */
      const chunks = [];
      let totalBytesReceived = 0;

      res.on('data', (chunk) => {
        totalBytesReceived += chunk.length;
        if (totalBytesReceived > MAX_RESPONSE_SIZE) {
          res.destroy(new Error('Response payload exceeded maximum allowable size bounds (Overflow Protection).'));
          return;
        }
        chunks.push(chunk);
      });

      res.on('end', () => {
        try {
          const rawData = Buffer.concat(chunks).toString('utf8');
          resolve(rawData);
        } catch (parseError) {
          reject(parseError);
        }
      });

      res.on('error', (streamErr) => {
        reject(streamErr);
      });
    });

    req.on('error', (netErr) => {
      reject(netErr);
    });

    req.setTimeout(DEFAULT_CONFIG.timeout, () => {
      req.destroy(new Error(`Request timed out after ${DEFAULT_CONFIG.timeout}ms`));
    });

    req.end();
  });
}

/**
 * Main execution handler driving payload processing.
 */
(async function execute() {
  try {
    const data = await fetchRepositoryData();
    console.log(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(message);
  }
})();