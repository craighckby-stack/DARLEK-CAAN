/**
 * @fileoverview Secure, type-safe API proposal utility utilizing native fetch with AbortController,
 * comprehensive error boundary handling, and optimized payload serialization.
 * @path "test-propose-header.js"
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
 * Executes an evolution proposal request to the local API endpoint.
 * 
 * @async
 * @function proposeEvolution
 * @param {Partial<EvolutionPayload>} [overrides={}] - Optional overrides for the payload.
 * @returns {Promise<any>} The parsed JSON response from the server.
 * @throws {Error} Throws an error if the network request fails or returns a non-2xx status code.
 */
async function proposeEvolution(overrides = {}) {
  const ENDPOINT = 'http://localhost:3000/api/evolution/propose';
  const TIMEOUT_MS = 10000;

  const defaultPayload = {
    fileContent: "/**\n * Header\n */\nexport const hello = 'world';",
    filePath: "src/test.ts",
    apiKeys: Object.freeze({}),
    sessionId: "test-session"
  };

  const payload = { ...defaultPayload, ...overrides };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'same-origin'
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error response');
      throw new Error(`HTTP Error Status: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Evolution proposal request timed out after ${TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Immediate execution block with robust error boundary tracking
(async () => {
  try {
    const result = await proposeEvolution();
    console.log('Evolution proposal successful:', result);
  } catch (err) {
    console.error('Failed to execute evolution proposal:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
})();