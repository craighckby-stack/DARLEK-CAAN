require('dotenv').config({ path: '.env' });
const { GoogleGenAI } = require('@google/genai');

// Cache the singleton instance to eliminate redundant object allocations and initialization overhead
let cachedClient = null;

/**
 * Initializes and validates the Google GenAI client instance using a cached singleton pattern.
 * @throws {Error} If GEMINI_API_KEY is missing from the environment.
 * @returns {GoogleGenAI} The initialized GoogleGenAI client instance.
 */
function createGenAIClient() {
  if (cachedClient !== null) {
    return cachedClient;
  }
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    throw new Error('CRITICAL: GEMINI_API_KEY environment variable is missing, null, or malformed.');
  }
  
  cachedClient = new GoogleGenAI({ apiKey });
  return cachedClient;
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
    console.error('ERROR [Initialization Failed]:', initError instanceof Error ? initError.message : initError);
    process.exitCode = 1;
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello',
    });

    if (!response || typeof response.text !== 'string') {
      throw new Error('Received malformed or empty response structure from Gemini API.');
    }

    console.log('SUCCESS:', response.text);
  } catch (error) {
    console.error('ERROR [Execution Failed]:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

// Execute the sovereign diagnostic routine
void testGeminiConnection();