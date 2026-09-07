/**
 * @file test-greedy3.js
 * @version 4.0.0
 * @author EMG Core v49 Neural Code and Documentation Optimizer Engine
 * @description Sovereign Overhaul: Enhanced memory efficiency, robust type-safe structure, 
 * optimized parsing mechanics, and hardened error resilience.
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
 * Safely sanitizes control characters from potential JSON strings.
 * @param {string} str 
 * @returns {string}
 */
function sanitizeJsonString(str) {
  return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ');
}

/**
 * Parses LLM responses, extracting JSON metadata and code blocks robustly.
 * 
 * @param {string} rawText - The raw string response from the LLM.
 * @param {string} fallbackCode - Fallback code string if no valid code is extracted.
 * @returns {ParseResult} The structured parsing result.
 */
function parseLlmResponse(rawText, fallbackCode) {
  /** @type {LlmParsedResponse | null} */
  let parsedResponse = null;
  let proposedCode = '';
  let analysis = 'Analysis complete.';
  let jsonString = '';

  if (typeof rawText !== 'string' || rawText.length === 0) {
    return {
      parsedResponse: null,
      proposedCode: typeof fallbackCode === 'string' ? fallbackCode : '',
      analysis
    };
  }
  
  // 1. Optimized JSON extraction with state machine tracking
  const firstBrace = rawText.indexOf('{');
  if (firstBrace !== -1) {
    let braceCount = 0;
    let inString = false;
    let escape = false;
    const len = rawText.length;
    
    for (let i = firstBrace; i < len; i++) {
      const char = rawText[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            jsonString = rawText.substring(firstBrace, i + 1);
            try {
              const sanitized = sanitizeJsonString(jsonString);
              /** @type {LlmParsedResponse} */
              const parsed = JSON.parse(sanitized);
              if (parsed && (parsed.analysis !== undefined || parsed.riskScore !== undefined || parsed.newFiles !== undefined)) {
                parsedResponse = parsed;
              }
            } catch {
              // Ignore invalid JSON parsing segments and continue execution flow
            }
            break;
          }
        }
      }
    }
  }

  // 2. Extract code blocks via regex execution
  const codeBlockRegex = /```(?:[^\n]*)\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(rawText)) !== null) {
    const content = match[1].trim();
    
    // Skip if this block is identical to our extracted JSON payload
    if (parsedResponse && jsonString && content.replace(/\s+/g, '') === jsonString.replace(/\s+/g, '')) {
      continue;
    }
    
    // Skip if block is structured strictly as JSON
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
  
  // 3. Fallback extraction outside JSON regions if no block matched
  if (!proposedCode) {
    let textWithoutJson = rawText;
    if (jsonString) {
      textWithoutJson = rawText.replace(jsonString, '');
    }
    textWithoutJson = textWithoutJson
      .replace(/```(?:json|tsx|ts|js|jsx|html|css|python)?[ \t]*\n?/g, '')
      .replace(/```/g, '')
      .trim();
    
    if (textWithoutJson.length > 10) {
      proposedCode = textWithoutJson;
    }
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