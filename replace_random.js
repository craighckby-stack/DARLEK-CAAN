/**
 * @file replace_random.js
 * @description Script to systematically replace non-deterministic pseudo-random code 
 * patterns in the cognitive engine with predictable, deterministic values for testing and auditing.
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * @typedef {Object} ReplacementRule
 * @property {RegExp} pattern
 * @property {string} replacement
 */

/** @readonly */
const TARGET_FILE_PATH = path.normalize(path.join('src', 'utils', 'agi-engine.ts'));

/**
 * Configuration mapping of regex patterns to their deterministic replacements.
 * Object.freeze provides protection and hints to V8 for inline caching optimization.
 * @type {ReadonlyArray<ReplacementRule>}
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
 * @param {ReadonlyArray<ReplacementRule>} replacements - The mapping of patterns.
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
 * 
 * @returns {void}
 */
function makeEngineDeterministic() {
  try {
    const originalSource = fs.readFileSync(TARGET_FILE_PATH, 'utf8');
    const sanitizedSource = applyReplacements(originalSource, RANDOMNESS_REPLACEMENTS);

    if (originalSource === sanitizedSource) {
      console.info(`[EMG Engine] No non-deterministic patterns found in: ${TARGET_FILE_PATH}`);
      return;
    }

    fs.writeFileSync(TARGET_FILE_PATH, sanitizedSource, 'utf8');
    console.info(`[EMG Engine] Successfully sanitized randomness in: ${TARGET_FILE_PATH}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[EMG Engine] Failed to process file ${TARGET_FILE_PATH}:`, errorMessage);
    process.exitCode = 1;
  }
}

makeEngineDeterministic();