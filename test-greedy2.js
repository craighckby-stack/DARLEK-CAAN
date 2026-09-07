/**
 * EMG Core v49 Neural Code & Documentation Optimizer Engine
 * File Path: "test-greedy2.js"
 * Optimization Goal: COMPREHENSIVE - Sovereign Overhaul
 */

/**
 * Extracts and parses the first valid JSON block or object found within unstructured text.
 * Utilizes robust state tracking for string literals, escape sequences, and brace matching.
 * 
 * @param {string} text - The raw text containing potential JSON payloads.
 * @returns {any | null} The parsed JSON object/value, or null if extraction fails.
 */
function extractJSON(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return null;
  }

  // Phase 1: Try to match standard markdown code blocks (```json ... ``` or ``` ... ```)
  const jsonBlockMatch = text.match(/```(?:json)?\s*\n([\s\S]*?)```/);
  if (jsonBlockMatch?.[1]) {
    try {
      return JSON.parse(jsonBlockMatch[1].trim());
    } catch {
      // Fallback to structural scanning if markdown block parsing fails
    }
  }
  
  // Phase 2: Locate the first opening brace and scan incrementally for balanced JSON structures
  const firstBrace = text.indexOf('{');
  if (firstBrace === -1) {
    return null;
  }

  let braceCount = 0;
  let inString = false;
  let escape = false;
  const textLength = text.length;

  for (let i = firstBrace; i < textLength; i++) {
    const char = text[i];

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
          const jsonStr = text.slice(firstBrace, i + 1);
          try {
            return JSON.parse(jsonStr);
          } catch {
            // If the balanced section is invalid JSON, terminate early
            break;
          }
        }
      }
    }
  }

  return null;
}

const rawText = `Here is my thought:
{
  "analysis": "Test { nested }",
  "newFiles": [{"a": 1}]
}
export function myFunc() {
  return { a: 1 };
}`;

console.log(extractJSON(rawText));