/**
 * @file test-propose.js
 * @description Optimized sovereign client script for proposing evolution payloads.
 * @version 4.0.0
 */

'use strict';

/**
 * @typedef {Object} EvolutionPayload
 * @property {string} fileContent
 * @property {string} filePath
 * @property {Record<string, string>} apiKeys
 * @property {string} sessionId
 */

/** @type {Readonly<EvolutionPayload>} */
const PAYLOAD = Object.freeze({
  fileContent: "export const hello = 'world';",
  filePath: "src/test.ts",
  apiKeys: Object.freeze({}),
  sessionId: "test-session"
});

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

async function submitEvolutionProposal() {
  try {
    const response = await fetch('http://localhost:3000/api/evolution/propose', REQUEST_CONFIG);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.info('[EMG-CORE] Evolution proposal response:', data);
    return data;
  } catch (err) {
    console.error('[EMG-CORE] Critical failure during evolution proposal dispatch:', err instanceof Error ? err.message : String(err));
    throw err;
  }
}

void submitEvolutionProposal();