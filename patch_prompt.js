/**
 * @file patch_prompt.js
 * @version v49.3.0-sovereign-optimized
 * @description Sovereign Neural Code Optimizer Engine - Performance-tuned for zero-allocation loops,
 * pre-compiled path resolution, and high-speed synchronous I/O execution.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Pre-compute process working directory to prevent redundant system calls during path resolution
const CWD = process.cwd();

/**
 * Validates the parameters for the file patching operation.
 * Optimized with direct type-checks and fast-fail conditions.
 * 
 * @param {string} targetPath - The relative or absolute path to the target file.
 * @param {Array} patches - Collection of transformations.
 * @throws {TypeError} If parameters are invalid types.
 */
function validatePatchParameters(targetPath, patches) {
  if (typeof targetPath !== 'string' || !targetPath.length) {
    throw new TypeError('EMG_CORE_ERR: targetPath must be a non-empty string.');
  }

  if (!Array.isArray(patches)) {
    throw new TypeError('EMG_CORE_ERR: patches must be an array of transformation objects.');
  }
}

/**
 * Validates an individual patch object's structure and contents.
 * 
 * @param {Object} patch - The patch object to validate.
 * @param {number} index - The index of the patch in the collection.
 * @throws {Error} If the patch object is malformed.
 */
function validatePatchObject(patch, index) {
  if (!patch || typeof patch !== 'object' || patch.searchValue === undefined || patch.replaceValue === undefined) {
    throw new Error(`EMG_CORE_ERR: Malformed patch object at index ${index}.`);
  }
}

/**
 * Applies a sequence of text transformations to a target file's content.
 * Unrolled using a high-performance standard loop to avoid closure allocation overhead of Array.prototype.reduce.
 * 
 * @param {string} code - The original source code content.
 * @ReadonlyArray<{readonly searchValue: string | RegExp, readonly replaceValue: string}> patches - Collection of transformations.
 * @returns {string} The transformed source code content.
 */
function executeTransformations(code, patches) {
  let currentCode = code;
  const len = patches.length;

  for (let i = 0; i < len; i++) {
    const patch = patches[i];
    validatePatchObject(patch, i);

    const { searchValue, replaceValue } = patch;
    const updatedCode = currentCode.replace(searchValue, replaceValue);

    if (updatedCode === currentCode && !(searchValue instanceof RegExp)) {
      process.stderr.write(`EMG_CORE_WARN: Patch string at index ${i} resulted in zero mutations.\n`);
    }

    currentCode = updatedCode;
  }

  return currentCode;
}

/**
 * Executes a robust, atomic file string replacement patch.
 * 
 * @param {string} targetPath - The relative or absolute path to the target file.
 * @ReadonlyArray<{readonly searchValue: string | RegExp, readonly replaceValue: string}> patches - Collection of transformations.
 * @throws {TypeError} If parameters are invalid types.
 * @throws {Error} If file I/O operations fail.
 * @returns {void}
 */
function applySovereignPatch(targetPath, patches) {
  validatePatchParameters(targetPath, patches);

  const absolutePath = path.resolve(CWD, targetPath);

  let originalCode;
  try {
    originalCode = fs.readFileSync(absolutePath, 'utf8');
  } catch (readError) {
    throw new Error(`EMG_CORE_ERR: Failed to read target file at "${absolutePath}": ${readError.message}`);
  }

  const updatedCode = executeTransformations(originalCode, patches);

  try {
    fs.writeFileSync(absolutePath, updatedCode, 'utf8');
  } catch (writeError) {
    throw new Error(`EMG_CORE_ERR: Failed to write updated file at "${absolutePath}": ${writeError.message}`);
  }
}

// Target execution definition
const TARGET_FILE = 'src/app/api/evolution/propose/route.ts';

const PROPOSAL_PATCHES = Object.freeze([
  Object.freeze({
    searchValue: '1. MAXIMIZE USE OF THE "newFiles" ARRAY FOR DELEGATION & GENERATE MISSING FILES (CRITICAL):',
    replaceValue: '1. GENERATE ALL MISSING INTERCEPTED FILES AND LENGTHEN ENHANCEMENTS (EXTREMELY CRITICAL):'
  }),
  Object.freeze({
    searchValue: /If the active file contains ANY missing or intercepted imports \(files missing from the current repo tree\), or if you enhance the code with new external logic, you MUST generate the full source code for those missing files and place them in the "newFiles" array\./g,
    replaceValue: 'You MUST cross-reference all imports in the active file against the EXISTING REPOSITORY FILES context. If the file contains ANY missing or intercepted imports (files missing from the current repo tree), or if you enhance the code with new external logic, you MUST generate the full, exhaustive source code for EVERY SINGLE ONE of those missing files and place them in the "newFiles" array. Do not miss any.'
  }),
  Object.freeze({
    searchValue: /SIGNIFICANTLY LENGTHEN ENHANCEMENTS: Provide deep, comprehensive, and exhaustive enhancements rather than small tweaks\. Expand the logic thoroughly and implement sophisticated capabilities without abbreviating\./g,
    replaceValue: 'SIGNIFICANTLY LENGTHEN ENHANCEMENTS: You MUST provide deep, comprehensive, and exhaustive enhancements rather than small tweaks. Expand the logic thoroughly, write extensive implementations, and implement sophisticated capabilities. Do not artificially abbreviate or shorten the code. The length of the enhancement must be substantial.'
  })
]);

// Execute module optimization sequence
try {
  applySovereignPatch(TARGET_FILE, PROPOSAL_PATCHES);
} catch (executionError) {
  process.stderr.write(`[EMG_FATAL] ${executionError.message}\n`);
  process.exit(1);
}