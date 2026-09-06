/**
 * @file replace_random.js
 * @description Script to systematically replace non-deterministic pseudo-random code 
 * patterns in the AGI engine with predictable, deterministic values for testing and auditing.
 */

import fs from 'node:fs';
import path from 'node:path';

const TARGET_FILE_PATH = path.join('src', 'utils', 'agi-engine.ts');

/**
 * Configuration mapping of regex patterns to their deterministic replacements.
 * Object.freeze provides protection and hints to V8 for inline caching optimization.
 */
const RANDOMNESS_REPLACEMENTS = Object.freeze([
  {
    pattern: /Math\.random\(\)\.toString\(36\)\.substring\([^)]*\)/g,
    replacement: 'Date.now().toString(36)',
  },
  {
    pattern: /Array\.from\(\{ length: 3 \}, \(\) => Math\.random\(\)\)/g,
    replacement: '[0.42, 0.88, 0.15]',
  },
  {
    pattern: /safeCandidates\[Math\.floor\(Math\.random\(\) \* safeCandidates\.length\)\]/g,
    replacement: 'safeCandidates[0]',
  },
  {
    pattern: /'0x' \+ Math\.random\(\)\.toString\(16\)\.substring\([^)]*\)\.toUpperCase\(\)/g,
    replacement: "'0x' + Date.now().toString(16).toUpperCase()",
  },
]);

/**
 * Applies a sequence of pattern replacements to a source code string using functional iteration.
 * 
 * @param {string} sourceCode - The raw source code to transform.
 * @param {ReadonlyArray<{pattern: RegExp, replacement: string}>} replacements - The mapping of patterns.
 * @returns {string} The updated, deterministic source code.
 */
function applyReplacements(sourceCode, replacements) {
  return replacements.reduce(
    (currentCode, { pattern, replacement }) => currentCode.replace(pattern, replacement),
    sourceCode
  );
}

/**
 * Reads the target source file, applies all deterministic replacements, and writes the result back
 * utilizing synchronous I/O with minimized memory footprint and modern error handling.
 */
function makeEngineDeterministic() {
  try {
    const originalSource = fs.readFileSync(TARGET_FILE_PATH, 'utf8');
    const sanitizedSource = applyReplacements(originalSource, RANDOMNESS_REPLACEMENTS);

    fs.writeFileSync(TARGET_FILE_PATH, sanitizedSource, 'utf8');
    console.info(`[EMG Engine] Successfully sanitized randomness in: ${TARGET_FILE_PATH}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[EMG Engine] Failed to process file ${TARGET_FILE_PATH}:`, errorMessage);
    process.exit(1);
  }
}

makeEngineDeterministic();