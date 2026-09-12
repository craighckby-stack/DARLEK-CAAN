/**
 * @file test-greedy3.js
 * @version 4.1.0
 * @author EMG Core v49 Neural Code and Documentation Optimizer Engine
 * @description Modernized LLM response parser emphasizing readability, modular decomposition, and clean architectural clarity.
 */

/**
 * @typedef {Object} LlmParsedResponse
 * @property {string} [analysis]
 * @property {number} [riskScore]
 * @property {Array<any>} [newFiles]
 * @property {string} [proposedCode]
 */

/**
 * @typedef {Object} ParseResult
 * @property {LlmParsedResponse | null} parsedResponse
 * @property {string} proposedCode
 * @property {string} analysis
 */

/**
 * Sanitizes control characters from potential JSON strings.
 * @param {string} str - The input string to sanitize.
 * @returns {string} The sanitized string.
 */
function sanitizeJsonString(str) {
  return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ');
}

/**
 * Extracts embedded JSON metadata from raw LLM output using brace-matching state logic.
 * @param {string} rawText - The raw response text.
 * @returns {{ parsedResponse: LlmParsedResponse | null, jsonString: string }} Extracted response and raw JSON segment.
 */
function extractJsonMetadata(rawText) {
  const firstBraceIndex = rawText.indexOf('{');
  if (firstBraceIndex === -1) {
    return { parsedResponse: null, jsonString: '' };
  }

  let braceCount = 0;
  let isInString = false;
  let isEscaped = false;
  const textLength = rawText.length;

  for (let index = firstBraceIndex; index < textLength; index++) {
    const currentChar = rawText[index];

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (currentChar === '\\') {
      isEscaped = true;
      continue;
    }

    if (currentChar === '"') {
      isInString = !isInString;
      continue;
    }

    if (!isInString) {
      if (currentChar === '{') {
        braceCount++;
      } else if (currentChar === '}') {
        braceCount--;
        if (braceCount === 0) {
          const jsonString = rawText.substring(firstBraceIndex, index + 1);
          try {
            const sanitizedText = sanitizeJsonString(jsonString);
            /** @type {LlmParsedResponse} */
            const parsed = JSON.parse(sanitizedText);
            const isValidStructure = parsed && (
              parsed.analysis !== undefined || 
              parsed.riskScore !== undefined || 
              parsed.newFiles !== undefined
            );

            if (isValidStructure) {
              return { parsedResponse: parsed, jsonString };
            }
          } catch {
            // Ignore malformed JSON segments and continue
          }
          break;
        }
      }
    }
  }

  return { parsedResponse: null, jsonString: '' };
}

/**
 * Extracts proposed code snippets from Markdown code blocks.
 * @param {string} rawText - The raw response text.
 * @param {LlmParsedResponse | null} parsedResponse - Optional parsed JSON metadata.
 * @param {string} jsonString - The JSON string to ignore if matched.
 * @returns {string} The extracted code snippet or empty string.
 */
function extractCodeBlock(rawText, parsedResponse, jsonString) {
  const codeBlockRegex = /```(?:[^\n]*)\n([\s\S]*?)```/g;
  let match;
  let proposedCode = '';

  while ((match = codeBlockRegex.exec(rawText)) !== null) {
    const content = match[1].trim();

    const isJsonPayloadMatch = parsedResponse && jsonString && content.replace(/\s+/g, '') === jsonString.replace(/\s+/g, '');
    if (isJsonPayloadMatch) {
      continue;
    }

    if (content.startsWith('{') && content.endsWith('}')) {
      try {
        JSON.parse(content);
        continue;
      } catch {
        // Not valid JSON, process as potential code block
      }
    }

    if (!proposedCode && content.length > 10) {
      proposedCode = content;
    }
  }

  return proposedCode;
}

/**
 * Fallback extraction when no code blocks match.
 * @param {string} rawText - The raw response text.
 * @param {string} jsonString - The JSON string to filter out.
 * @returns {string} The fallback extracted code.
 */
function extractFallbackCode(rawText, jsonString) {
  let textWithoutJson = rawText;
  if (jsonString) {
    textWithoutJson = rawText.replace(jsonString, '');
  }

  const cleanedText = textWithoutJson
    .replace(/```(?:json|tsx|ts|js|jsx|html|css|python)?[ \t]*\n?/g, '')
    .replace(/```/g, '')
    .trim();

  return cleanedText.length > 10 ? cleanedText : '';
}

/**
 * Parses LLM responses, extracting JSON metadata and code blocks robustly.
 * 
 * @param {string} rawText - The raw string response from the LLM.
 * @param {string} fallbackCode - Fallback code string if no valid code is extracted.
 * @returns {ParseResult} The structured parsing result.
 */
function parseLlmResponse(rawText, fallbackCode) {
  let analysis = 'Analysis complete.';
  let proposedCode = '';

  if (typeof rawText !== 'string' || rawText.length === 0) {
    return {
      parsedResponse: null,
      proposedCode: typeof fallbackCode === 'string' ? fallbackCode : '',
      analysis
    };
  }

  const { parsedResponse, jsonString } = extractJsonMetadata(rawText);
  proposedCode = extractCodeBlock(rawText, parsedResponse, jsonString);

  if (!proposedCode) {
    proposedCode = extractFallbackCode(rawText, jsonString);
  }

  if (parsedResponse) {
    if (typeof parsedResponse.analysis === 'string') {
      analysis = parsedResponse.analysis;
    }
    if (typeof parsedResponse.proposedCode === 'string' && !proposedCode) {
      proposedCode = parsedResponse.proposedCode;
    }
  }

  if (!proposedCode) {
    proposedCode = fallbackCode;
  }

  return { parsedResponse, proposedCode, analysis };
}

// Validation Execution Suite
const rawText1 = `
{
  "analysis": "Test { nested }",
  "newFiles": [{"a": 1}]
}
export function myFunc() {
  return { a: 1 };
}
`;
console.log("No blocks:\n", parseLlmResponse(rawText1, "fallback"));

const rawText2 = `
\`\`\`json
{
  "analysis": "Test { nested }",
  "newFiles": [{"a": 1}]
}
\`\`\`
\`\`\`tsx
export function myFunc() {
  return { a: 1 };
}
\`\`\`
`;
console.log("Blocks:\n", parseLlmResponse(rawText2, "fallback"));