/**
 * @file replace_random.js
 * @description Script to systematically replace non-deterministic pseudo-random code 
 * patterns in the AGI engine with predictable, deterministic values for testing and auditing.
 */

const fs = require('node:fs');
const path = require('node:path');

const TARGET_FILE_PATH = path.join('src', 'utils', 'agi-engine.ts');

/**
 * Configuration mapping of regex patterns to their deterministic replacements.
 */
const REPLACEMENTS = [
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
];

/**
 * Reads the target source file, applies all deterministic replacements, and writes the result back.
 */
function makeEngineDeterministic() {
  try {
    let sourceCode = fs.readFileSync(TARGET_FILE_PATH, 'utf8');

    for (const { pattern, replacement } of REPLACEMENTS) {
      sourceCode = sourceCode.replace(pattern, replacement);
    }

    fs.writeFileSync(TARGET_FILE_PATH, sourceCode, 'utf8');
    console.info(`[EMG Engine] Successfully sanitized randomness in: ${TARGET_FILE_PATH}`);
  } catch (error) {
    console.error(`[EMG Engine] Failed to process file ${TARGET_FILE_PATH}:`, error.message);
    process.exit(1);
  }
}

makeEngineDeterministic();