/**
 * @file test-parse2.js
 * @version 4.2.18
 * @engine EMG Core v49 Neural Code and Documentation Optimizer Engine
 */

/**
 * @typedef {Object} LlmParsedResponse
 * @property {string} [analysis]
 * @property {number} [riskScore]
 * @property {string[]} [affectedFiles]
 * @property {string[]} [newFiles]
 * @property {string} [proposedCode]
 */

/**
 * @typedef {Object} ParseResult
 * @property {LlmParsedResponse | null} parsedResponse
 * @property {string} proposedCode
 * @property {string} analysis
 */

/**
 * Sanitizes control characters from potential JSON strings for secure parsing.
 * Enforces strict input validation against non-string inputs.
 * 
 * @param {unknown} input - The input value to sanitize.
 * @returns {string} The sanitized string.
 */
function sanitizeControlCharacters(input) {
  if (typeof input !== 'string') {
    return '';
  }
  return input.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ');
}

/**
 * Parses an LLM response string to extract structured metadata, analysis, and code blocks safely.
 * Implements strict type checking and bounds/length protection against injection/overflow.
 * 
 * @param {string} rawText - The raw string output from the LLM.
 * @param {string} fallbackCode - The default code fallback if no valid code is identified.
 * @returns {ParseResult} The structured parsing results.
 */
function parseLlmResponse(rawText, fallbackCode) {
  /** @type {LlmParsedResponse | null} */
  let parsedResponse = null;
  let proposedCode = '';
  let analysis = 'Analysis complete.';

  if (typeof rawText !== 'string' || rawText.length === 0) {
    return {
      parsedResponse: null,
      proposedCode: typeof fallbackCode === 'string' ? fallbackCode : '',
      analysis
    };
  }

  // Enforce a strict length boundary check to mitigate potential buffer/overflow or resource exhaustion
  const MAX_INPUT_LENGTH = 1048576; // 1MB limit
  const safeRawText = rawText.length > MAX_INPUT_LENGTH ? rawText.slice(0, MAX_INPUT_LENGTH) : rawText;

  // 1. Attempt to extract and parse JSON payload safely
  try {
    const jsonMatch = safeRawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const sanitizedJson = sanitizeControlCharacters(jsonMatch[0]);
      /** @type {LlmParsedResponse} */
      const parsed = JSON.parse(sanitizedJson);
      if (parsed && typeof parsed === 'object' && (typeof parsed.analysis === 'string' || parsed.riskScore !== undefined || Array.isArray(parsed.newFiles))) {
        parsedResponse = parsed;
      }
    }
  } catch {
    // Graceful fallback on JSON parse failure
  }

  // 2. Extract code blocks via regex iterator with safe iteration limit
  const codeBlockRegex = /```(?:[^\n]*)\n([\s\S]*?)```/g;
  let blockMatch;
  let iterations = 0;
  const MAX_ITERATIONS = 1000;

  while ((blockMatch = codeBlockRegex.exec(safeRawText)) !== null && iterations < MAX_ITERATIONS) {
    iterations++;
    const content = typeof blockMatch[1] === 'string' ? blockMatch[1].trim() : '';
    
    // Skip if content matches the extracted analysis string
    if (parsedResponse && typeof parsedResponse.analysis === 'string' && content.includes(parsedResponse.analysis)) {
      continue;
    }

    // Skip if the block is purely a JSON structure
    if (content.startsWith('{') && content.endsWith('}')) {
      try {
        JSON.parse(content);
        continue;
      } catch {
        // Not valid JSON, treat as standard code block
      }
    }

    if (!proposedCode && content.length > 10) {
      proposedCode = content;
      break; // Found primary proposed code block
    }
  }

  // 3. Fallback extraction if no code blocks were found
  if (!proposedCode) {
    const textWithoutJson = safeRawText
      .replace(/\{[\s\S]*\}/, '')
      .replace(/```(?:json|tsx|ts|js|)[^\n]*/gi, '')
      .replace(/```/g, '')
      .trim();

    if (textWithoutJson.length > 20) {
      proposedCode = textWithoutJson;
    }
  }

  // 4. Merge parsed response overrides
  if (parsedResponse) {
    if (typeof parsedResponse.analysis === 'string' && parsedResponse.analysis.length > 0) {
      analysis = parsedResponse.analysis;
    }
    if (typeof parsedResponse.proposedCode === 'string' && parsedResponse.proposedCode.length > 0 && !proposedCode) {
      proposedCode = parsedResponse.proposedCode;
    }
  }

  // 5. Apply final fallback code safeguard
  if (!proposedCode) {
    proposedCode = typeof fallbackCode === 'string' ? fallbackCode : '';
  }

  return { parsedResponse, proposedCode, analysis };
}

const rawText1 = `
{
  "analysis": "Specific analysis of what dead-weight or bugs were fixed... (must be detailed)",
  "riskScore": 1,
  "affectedFiles": [],
  "newFiles": []
}
\`\`\`tsx
export const x = 1;
\`\`\`
`;

console.log(parseLlmResponse(rawText1, 'fallback'));

module.exports = { parseLlmResponse };