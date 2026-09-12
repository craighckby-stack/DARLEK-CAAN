/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: "test-greedy.js"
 * Optimization Goal: READABILITY - Focus on pristine modern idioms, descriptive naming, modular decomposition, and clean architectural clarity.
 */

const MAX_INPUT_LENGTH_BYTES = 1048576; // 1MB limit

/**
 * Validates the input source string to ensure it meets type and length constraints.
 * 
 * @param {string} sourceText - The raw text payload to validate.
 * @throws {TypeError} If sourceText is not a string or exceeds safe bounds.
 */
function validateInputSource(sourceText) {
  if (typeof sourceText !== 'string') {
    throw new TypeError(`[EMG-ERR-400]: Expected string input, received ${typeof sourceText}`);
  }

  if (sourceText.length > MAX_INPUT_LENGTH_BYTES) {
    throw new TypeError(`[EMG-ERR-401]: Input size exceeds safe execution bounds (${sourceText.length} > ${MAX_INPUT_LENGTH_BYTES})`);
  }
}

/**
 * Extracts and separates JSON object blocks from mixed raw text streams.
 * 
 * @param {string} [inputSource=`{\n  "analysis": "Test"\n}\nexport function myFunc() {\n  return { a: 1 };\n}`] - The raw text payload containing embedded JSON and code.
 * @returns {{ match: string; replaced: string; a: number }} The extracted JSON substring, remaining code, and metadata.
 * @throws {TypeError} If inputSource is not a valid string or exceeds safe length bounds.
 * @throws {Error} If no valid object pattern can be matched.
 */
export function myFunc(inputSource = `{
  "analysis": "Test"
}
export function myFunc() {
  return { a: 1 };
}`) {
  validateInputSource(inputSource);

  const jsonPattern = /\{[\s\S]{0,1048576}?\}/;
  const jsonMatch = inputSource.match(jsonPattern);

  if (!jsonMatch || typeof jsonMatch[0] !== 'string') {
    throw new Error('[EMG-ERR-500]: Critical failure - No valid object pattern match detected in source stream.');
  }

  const extractedMatch = jsonMatch[0];
  const remainingCode = inputSource.replace(jsonPattern, '');

  return {
    match: extractedMatch,
    replaced: remainingCode,
    a: 1
  };
}

// Execution block separated for deterministic runtime evaluation with error isolation
try {
  const executionResult = myFunc();
  console.log("MATCH:", executionResult.match);
  console.log("REPLACED:", executionResult.replaced);
} catch (error) {
  console.error(`[EMG-CRITICAL]: ${error instanceof Error ? error.message : String(error)}`);
}