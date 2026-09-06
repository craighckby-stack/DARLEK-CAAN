require('dotenv').config({ path: '.env' });
const { GoogleGenAI } = require('@google/genai');

const CONFIG = Object.freeze({
  MODEL_NAME: 'gemini-2.5-flash',
  TEST_PROMPT: 'Hello',
});

let cachedClient = null;

/**
 * Retrieves the GEMINI_API_KEY environment variable after strict validation.
 * @throws {Error} If GEMINI_API_KEY is missing, non-string, or blank.
 * @returns {string} Validated API key.
 */
function getValidatedApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    throw new Error('CRITICAL: GEMINI_API_KEY environment variable is missing, null, or malformed.');
  }

  return apiKey.trim();
}

/**
 * Initializes and validates the Google GenAI client instance using a cached singleton pattern.
 * @throws {Error} If GEMINI_API_KEY validation fails.
 * @returns {GoogleGenAI} The initialized GoogleGenAI client instance.
 */
function createGenAIClient() {
  if (cachedClient !== null) {
    return cachedClient;
  }

  const apiKey = getValidatedApiKey();
  cachedClient = new GoogleGenAI({ apiKey });

  return cachedClient;
}

/**
 * Helper to safely extract message string from thrown errors or unknown objects.
 * @param {unknown} error - The caught exception.
 * @returns {string} Human-readable error message.
 */
function formatErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Executes a baseline generation test against the Gemini model.
 * Incorporates robust error handling, memory conservation, and secure initialization.
 * @async
 * @returns {Promise<void>}
 */
async function testGeminiConnection() {
  let ai;

  try {
    ai = createGenAIClient();
  } catch (initError) {
    console.error('ERROR [Initialization Failed]:', formatErrorMessage(initError));
    process.exitCode = 1;
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: CONFIG.MODEL_NAME,
      contents: CONFIG.TEST_PROMPT,
    });

    const responseText = response?.text;
    if (typeof responseText !== 'string' || responseText.trim() === '') {
      throw new Error('Received malformed or empty response structure from Gemini API.');
    }

    console.log('SUCCESS:', responseText);
  } catch (executionError) {
    console.error('ERROR [Execution Failed]:', formatErrorMessage(executionError));
    process.exitCode = 1;
  }
}

// Execute the sovereign diagnostic routine
void testGeminiConnection();