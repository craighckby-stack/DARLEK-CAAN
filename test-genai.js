/**
 * @file test-genai.js
 * @description Gemini API interaction utility providing test content generation with cached client instantiation.
 * @version 3.0.0-EMG
 */

'use strict';

const { GoogleGenAI } = require('@google/genai');

const DEFAULT_MODEL = 'gemini-1.5-pro';
const DEFAULT_TEST_PROMPT = 'Hello';

let cachedGeminiClient = null;

/**
 * Retrieves an existing GoogleGenAI client instance or initializes a new one.
 *
 * @returns {GoogleGenAI} The initialized Gemini API client instance.
 * @throws {Error} If the GEMINI_API_KEY environment variable is missing.
 */
function getGeminiClient() {
  if (cachedGeminiClient) {
    return cachedGeminiClient;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('CRITICAL: GEMINI_API_KEY environment variable is not defined.');
  }

  cachedGeminiClient = new GoogleGenAI({ apiKey });
  return cachedGeminiClient;
}

/**
 * Sends a content generation request to the Gemini API.
 *
 * @param {GoogleGenAI} client - The GoogleGenAI client instance.
 * @param {string} [prompt=DEFAULT_TEST_PROMPT] - The input text prompt.
 * @param {string} [model=DEFAULT_MODEL] - The target Gemini model name.
 * @returns {Promise<string>} The generated text response.
 */
async function requestContentGeneration(client, prompt = DEFAULT_TEST_PROMPT, model = DEFAULT_MODEL) {
  const response = await client.models.generateContent({
    model,
    contents: prompt,
  });

  if (!response || typeof response.text !== 'string') {
    throw new Error('Received malformed response structure from Gemini API.');
  }

  return response.text;
}

/**
 * Initializes and executes a test generation request against the Gemini API.
 *
 * @async
 * @returns {Promise<void>}
 */
async function executeGeminiTest() {
  try {
    const client = getGeminiClient();
    const resultText = await requestContentGeneration(client);

    process.stdout.write(`Success: ${resultText}\n`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Error: ${errorMessage}\n`);
    process.exitCode = 1;
  }
}

executeGeminiTest();