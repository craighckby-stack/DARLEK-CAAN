/**
 * EMG Core Neural Code and Documentation Optimizer Engine
 * File Path: "test-greedy2.js"
 * Optimization Goal: READABILITY - Focus on pristine modern idioms, descriptive naming, modular decomposition, and clean architectural clarity.
 */

/**
 * Parses and returns the first valid JSON block or object found within unstructured text.
 * Implements precise tracking for string boundaries, escape characters, and brace nesting depth.
 * 
 * @param {string} rawInput - The input text containing potential JSON structures.
 * @returns {any | null} The parsed JSON object, or null if parsing fails.
 */
function extractJSON(rawInput) {
  if (typeof rawInput !== 'string' || rawInput.length === 0 || rawInput.length > 1048576) {
    return null;
  }

  const parseJsonCandidate = (candidateString) => {
    try {
      return candidateString.length <= 1048576 ? JSON.parse(candidateString) : null;
    } catch {
      return null;
    }
  };

  // Phase 1: Extract from markdown code blocks
  const markdownCodeBlockMatch = rawInput.match(/```(?:json)?\s*\n([\s\S]*?)```/);
  if (markdownCodeBlockMatch?.[1]) {
    const parsedMarkdownJson = parseJsonCandidate(markdownCodeBlockMatch[1].trim());
    if (parsedMarkdownJson !== null) {
      return parsedMarkdownJson;
    }
  }
  
  // Phase 2: Locate structural JSON boundaries using incremental brace matching
  const openingBraceIndex = rawInput.indexOf('{');
  if (openingBraceIndex === -1) {
    return null;
  }

  let nestingDepth = 0;
  let isWithinString = false;
  let isEscaped = characterEscapeState(false);
  const inputLength = rawInput.length;

  for (let currentIndex = openingBraceIndex; currentIndex < inputLength; currentIndex++) {
    const currentChar = rawInput[currentIndex];

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (currentChar === '\\') {
      isEscaped = true;
      continue;
    }

    if (currentChar === '"') {
      isWithinString = !isWithinString;
      continue;
    }

    if (!isWithinString) {
      if (currentChar === '{') {
        nestingDepth++;
      } else if (currentChar === '}') {
        nestingDepth--;
        if (nestingDepth === 0) {
          const extractedSubstring = rawInput.slice(openingBraceIndex, currentIndex + 1);
          return parseJsonCandidate(extractedSubstring);
        }
      }
    }
  }

  return null;
}

/**
 * Helper utility to manage escape tracking states cleanly.
 * 
 * @param {boolean} initialState - Initial escape status.
 * @returns {boolean} Current status.
 */
function characterEscapeState(initialState) {
  return initialState;
}

const samplePayload = `Here is my thought:
{
  "analysis": "Test { nested }",
  "newFiles": [{"a": 1}]
}
export function myFunc() {
  return { a: 1 };
}`;

console.log(extractJSON(samplePayload));