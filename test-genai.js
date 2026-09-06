/**
 * @file test-genai.js
 * @description Ultra-optimized Gemini API interaction utility with client instance caching and memory footprint reduction.
 * @version 2.1.0-EMG
 */

'use strict';

const { GoogleGenAI } = require('@google/genai');

// Cached client instance to prevent redundant allocations across executions
let cachedAIClient = null;

/**
 * Initializes and executes a test generation request against the Gemini API with maximum execution efficiency.
 * @async
 * @returns {Promise<void>}
 */
async function executeGeminiTest() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('CRITICAL: GEMINI_API_KEY environment variable is not defined.');
  }

  // Reuse cached client or instantiate once to conserve memory and overhead
  let ai = cachedAIClient;
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
    cachedAIClient = ai;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: 'Hello',
    });

    if (!response || typeof response.text !== 'string') {
      throw new Error('Received malformed response structure from Gemini API.');
    }

    process.stdout.write(`Success: ${response.text}\n`);
  } catch (error) {
    process.stderr.write(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

executeGeminiTest();