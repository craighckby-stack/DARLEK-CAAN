/**
 * @fileoverview Secure API proposal utility utilizing native fetch with AbortController,
 * error boundary handling, and payload serialization.
 * @path "test-propose-header.js"
 */

'use strict';

/**
 * Executes an evolution proposal request to the local API endpoint.
 * 
 * @async
 * @function proposeEvolution
 * @param {Object} [overrides={}] - Optional overrides for the payload.
 * @returns {Promise<Object>} The parsed JSON response from the server.
 * @throws {Error} Throws an error if the network request fails or returns a non-2xx status code.
 */
async function proposeEvolution(overrides = {}) {
  const endpoint = 'http://localhost:3000/api/evolution/propose';
  const timeoutMs = 10000;

  const defaultPayload = Object.freeze({
    fileContent: "/**\n * Header\n */\nexport const hello = 'world';",
    filePath: "src/test.ts",
    apiKeys: Object.freeze({}),
    sessionId: "test-session"
  });

  const payload = { ...defaultPayload, ...overrides };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
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

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Evolution proposal request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Immediate execution block with error boundary tracking
(async () => {
  try {
    const result = await proposeEvolution();
    console.log('Evolution proposal successful:', result);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Failed to execute evolution proposal:', errorMessage);
    process.exitCode = 1;
  }
})();