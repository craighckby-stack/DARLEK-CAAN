/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix5.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const CONFIG = Object.freeze({
  RELATIVE_TARGET_PATH: 'src/app/api/evolution/propose/route.ts',
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  SEARCH_PATTERN: /siphonedCodeContext\}```\$\{fileContent/g,
  REPLACEMENT_STRING: 'siphonedCodeContext}\\`\\`\\`${fileContent',
});

/**
 * Validates target path security to ensure it resides strictly within the base directory.
 *
 * @param {string} baseDir - The trusted base directory absolute path.
 * @param {string} targetPath - The resolved target path to evaluate.
 * @throws {Error} If path traversal or boundary violations are detected.
 */
function assertPathSecurity(baseDir, targetPath) {
  if (!targetPath.startsWith(baseDir) || !path.isAbsolute(targetPath)) {
    throw new Error('[EMG Core v49 Security Violation]: Path traversal attempt detected.');
  }
}

/**
 * Validates file existence, type status, and size constraints.
 *
 * @param {string} targetPath - The absolute path of the file to inspect.
 * @throws {Error} If the target is missing, not a file, or exceeds size limits.
 */
function validateFileConstraints(targetPath) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`Target path does not exist: ${targetPath}`);
  }

  const stats = fs.statSync(targetPath);
  if (!stats.isFile()) {
    throw new Error(`Target path is not a valid file: ${targetPath}`);
  }

  if (stats.size > CONFIG.MAX_FILE_SIZE_BYTES) {
    throw new Error(`Target file exceeds maximum allowed size bounds: ${stats.size} bytes`);
  }
}

/**
 * Executes targeted code transformation on the evolution propose route module.
 * Incorporates robust error handling, path resolution, strict mode, and idempotent I/O optimization.
 *
 * @returns {void}
 */
function applyEvolutionFix() {
  const baseDir = path.resolve(process.cwd());
  const targetPath = path.resolve(baseDir, CONFIG.RELATIVE_TARGET_PATH);

  assertPathSecurity(baseDir, targetPath);

  try {
    validateFileConstraints(targetPath);

    const code = fs.readFileSync(targetPath, { encoding: 'utf8', flag: 'r' });
    const updatedCode = code.replace(CONFIG.SEARCH_PATTERN, CONFIG.REPLACEMENT_STRING);

    if (updatedCode !== code) {
      fs.writeFileSync(targetPath, updatedCode, { encoding: 'utf8', flag: 'w', mode: 0o600 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[EMG Core v49 Execution Error]: Failed to apply file fix to evolution route.', errorMessage);
    throw error;
  }
}

applyEvolutionFix();