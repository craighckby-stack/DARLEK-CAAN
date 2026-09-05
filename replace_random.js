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
 */
const RANDOMNESS_REPLACEMENTS = Object.freeze([
  {
    name: 'Random ID Generation',
    pattern: /Math\.random\(\)\.toString\(36\)\.substring\([^)]*\)/g,
    replacement: 'Date.now().toString(36)',
  },
  {
    name: 'Random Coordinate Array',
    pattern: /Array\.from\(\{ length: 3 \}, \(\) => Math\.random\(\)\)/g,
    replacement: '[0.42, 0.88, 0.15]',
  },
  {
    name: 'Random Candidate Selection',
    pattern: /safeCandidates\[Math\.floor\(Math\.random\(\) \* safeCandidates\.length\)\]/g,
    replacement: 'safeCandidates[0]',
  },
  {
    name: 'Random Verification Hash',
    pattern: /'0x' \+ Math\.random\(\)\.toString\(16\)\.substring\([^)]*\)\.toUpperCase\(\)/g,
    replacement: "'0x' + Date.now().toString(16).toUpperCase()",
  },
]);

/**
 * Applies a sequence of pattern replacements to a source code string.
 * 
 * @param {string} sourceCode - The raw source code to transform.
 * @param {Array<{pattern: RegExp, replacement: string}>} replacements - The mapping of patterns.
 * @returns {string} The updated, deterministic source code.
 */
function applyReplacements(sourceCode, replacements) {
  return replacements.reduce(
    (currentCode, { pattern, replacement }) => currentCode.replace(pattern, replacement),
    sourceCode
  );
}

/**
 * Reads the target source file, applies all deterministic replacements, and writes the result back.
 */
function makeEngineDeterministic() {
  try {
    const originalSource = fs.readFileSync(TARGET_FILE_PATH, 'utf8');
    const sanitizedSource = applyReplacements(originalSource, RANDOMNESS_REPLACEMENTS);

    fs.writeFileSync(TARGET_FILE_PATH, sanitizedSource, 'utf8');
    console.info(`[EMG Engine] Successfully sanitized randomness in: ${TARGET_FILE_PATH}`);
  } catch (error) {
    console.error(`[EMG Engine] Failed to process file ${TARGET_FILE_PATH}:`, error.message);
    process.exit(1);
  }
}

makeEngineDeterministic();