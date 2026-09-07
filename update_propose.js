/**
 * @file update_propose.js
 * @module EMG-Core-v49-Optimizer
 * @description Sovereign optimized transformer for mutating the propose API route code.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

/** 
 * Resolved absolute path for the targeted evolution propose route file.
 * @type {string}
 */
const TARGET_FILE_PATH = path.freeze(
  path.resolve(process.cwd(), 'src', 'app', 'api', 'evolution', 'propose', 'route.ts')
);

/** Regex pattern matching the prompt declaration string. */
const PROMPT_DECLARATION_PATTERN = /(const userPrompt = `Analyze this file and propose improvements:\\n\$\{rejectionContext\}\\n\$\{appliedMutationsContext\}\\n\$\{userReposContextStr\}\\nACTUAL SIPHONED CODE PATTERNS)/;

/** Regex pattern matching the prompt interpolation string. */
const PROMPT_INTERPOLATION_PATTERN = /(const userPrompt = `Analyze this file and propose improvements:\\n\$\{rejectionContext\}\\n\$\{appliedMutationsContext\}\\n\$\{userReposContextStr\})/;

/** Template string injected to handle repository files context safely. */
const REPO_FILES_CONTEXT_DECLARATION = `const repoFilesContext = Array.isArray((body as any)?.repoFiles) 
      ? \`\\nEXISTING REPOSITORY FILES:\\n\${(body as useAnyRepoFiles(body)).slice(0, 1000).join('\\n')}\\n\` 
      : '';\n    $1`;

/**
 * Safely extracts repoFiles from an arbitrary body payload with type checking.
 * 
 * @param {unknown} body - The request body payload.
 * @returns {string[]} The array of repository files or an empty array.
 */
function useAnyRepoFiles(body) {
  if (body !== null && typeof body === 'object' && 'repoFiles' in body) {
    const files = /** @type {Record<string, unknown>} */ (body).repoFiles;
    if (Array.isArray(files)) {
      return /** @type {string[]} */ (files);
    }
  }
  return [];
}

/**
 * Injects repository files context extraction and template injection into the prompt code.
 * 
 * @throws {TypeError} If sourceCode is invalid or not a string.
 * @param {string} sourceCode - Raw source code of the target API route.
 * @returns {string} Modified source code with repository files context integrated.
 */
function injectRepoFilesContext(sourceCode) {
  if (typeof sourceCode !== 'string') {
    throw new TypeError('Expected sourceCode to be of type string.');
  }

  let modified = sourceCode.replace(PROMPT_DECLARATION_PATTERN, REPO_FILES_CONTEXT_DECLARATION);
  modified = modified.replace(PROMPT_INTERPOLATION_PATTERN, '$1\n${repoFilesContext}');
  return modified;
}

/**
 * Main execution driver for updating the propose route source file with robust error handling.
 * 
 * @throws {NodeJS.ErrnoException} If file reading or writing fails.
 * @returns {void}
 */
function updateProposeRoute() {
  try {
    const currentCode = fs.readFileSync(TARGET_FILE_PATH, { encoding: 'utf8' });
    const updatedCode = injectRepoFilesContext(currentCode);
    
    if (currentCode === updatedCode) {
      console.warn('[EMG-Core-v49] Warning: Target file content remained unchanged after transformation.');
    }

    fs.writeFileSync(TARGET_FILE_PATH, updatedCode, { encoding: 'utf8', flag: 'w' });
    console.info(`[EMG-Core-v49] Successfully updated: ${TARGET_FILE_PATH}`);
  } catch (error) {
    console.error('[EMG-Core-v49] Critical execution failure during propose route update:', error);
    process.exitCode = 1;
    throw error;
  }
}

// Execute routine
updateProposeRoute();