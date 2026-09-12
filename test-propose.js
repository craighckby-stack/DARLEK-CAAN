/**
 * @file test-propose.js
 * @description Sovereign client script for proposing evolution payloads with defensive bounds checking and input validation.
 * @version 4.0.1
 */

'use strict';

/**
 * @typedef {Object} EvolutionPayload
 * @property {string} fileContent
 * @property {string} filePath
 * @property {Record<string, string>} apiKeys
 * @property {string} sessionId
 */

/**
 * Validates the structure and constraints of the evolution payload.
 * @param {EvolutionPayload} payload
 * @returns {EvolutionPayload}
 */
function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new TypeError('Payload must be a non-null object.');
  }
  if (typeof payload.fileContent !== 'string' || payload.fileContent.length > 1048576) {
    throw new TypeError('Invalid or oversized fileContent.');
  }
  if (typeof payload.filePath !== 'string' || payload.filePath.length === 0 || payload.filePath.length > 1024) {
    throw new TypeError('Invalid filePath.');
  }
  // Prevent path traversal attacks
  if (payload.filePath.includes('..') || payload.filePath.startsWith('/') || payload.filePath.startsWith('\\')) {
    throw new Error('Path traversal detected in filePath.');
  }
  if (!payload.apiKeys || typeof payload.apiKeys !== 'object' || Array.isArray(payload.apiKeys)) {
    throw new TypeError('apiKeys must be a valid dictionary.');
  }
  if (typeof payload.sessionId !== 'string' || payload.sessionId.length === 0 || payload.sessionId.length > 256) {
    throw new TypeError('Invalid sessionId.');
  }
  return payload;
}

/** @type {Readonly<EvolutionPayload>} */
const PAYLOAD = Object.freeze(validatePayload({
  fileContent: "export const hello = 'world';",
  filePath: "src/test.ts",
  apiKeys: Object.freeze({}),
  sessionId: "test-session"
}));

/** @type {Readonly<RequestInit>} */
const REQUEST_CONFIG = Object.freeze({
  method: 'POST',
  headers: Object.freeze({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }),
  body: JSON.stringify(PAYLOAD),
  cache: 'no-store',
  credentials: 'omit'
});

/**
 * Submits the evolution proposal with strict error handling and request sanitization.
 * @returns {Promise<any>}
 */
async function submitEvolutionProposal() {
  try {
    const targetUrl = 'http://localhost:3000/api/evolution/propose';
    const parsedUrl = new URL(targetUrl);
    
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Invalid protocol in target URL.');
    }

    const response = await fetch(parsedUrl.toString(), REQUEST_CONFIG);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.info('[EMG-CORE] Evolution proposal response received safely.');
    return data;
  } catch (err) {
    console.error('[EMG-CORE] Critical failure during evolution proposal dispatch:', err instanceof Error ? err.message : String(err));
    throw err;
  }
}

void submitEvolutionProposal();