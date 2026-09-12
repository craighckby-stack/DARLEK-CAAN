/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix5.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * @typedef {Object} SystemConfig
 * @property {string} RELATIVE_TARGET_PATH
 * @property {number} MAX_FILE_SIZE_BYTES
 * @property {RegExp} SEARCH_PATTERN
 * @property {string} REPLACEMENT_STRING
 */

/** @type {Readonly<SystemConfig>} */
const CONFIG = Object.freeze({
  RELATIVE_TARGET_PATH: 'src/app/api/evolution/propose/route.ts',
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  SEARCH_PATTERN: /siphonedCodeContext\}```\$\{fileContent/g,
  REPLACEMENT_STRING: 'siphonedCodeContext}\\`\\`\\`${fileContent',
});

// Cache resolved base directory and target path to minimize path allocation overhead
const BASE_DIR = path.resolve(process.cwd());
const TARGET_PATH = path.resolve(BASE_DIR, CONFIG.RELATIVE_TARGET_PATH);

/**
 * Validates target path security to ensure it resides strictly within the base directory.
 *
 * @param {string} baseDir - The trusted base directory absolute path.
 * @param {string} targetPath - The resolved target path to evaluate.
 * @throws {Error} If path traversal or boundary violations are detected.
 */
function assertPathSecurity(baseDir, targetPath) {
  const normalizedTarget = path.resolve(targetPath);
  const normalizedBase = path.resolve(baseDir);

  if (!normalizedTarget.startsWith(normalizedBase) || !path.isAbsolute(normalizedTarget)) {
    throw new Error('[EMG Core v49 Security Violation]: Path traversal attempt detected.');
  }
}

/**
 * Validates file existence, type status, and size constraints efficiently.
 *
 * @param {string} targetPath - The absolute path of the file to inspect.
 * @throws {Error} If the target is missing, not a file, or exceeds size limits.
 */
function validateFileConstraints(targetPath) {
  /** @type {import('node:fs').Stats} */
  let stats;
  try {
    stats = fs.statSync(targetPath);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Target path does not exist or is inaccessible: ${targetPath}. Reason: ${reason}`);
  }

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
  assertPathSecurity(BASE_DIR, TARGET_PATH);

  try {
    validateFileConstraints(TARGET_PATH);

    const code = fs.readFileSync(TARGET_PATH, { encoding: 'utf8', flag: 'r' });
    const updatedCode = code.replace(CONFIG.SEARCH_PATTERN, CONFIG.REPLACEMENT_STRING);

    if (updatedCode !== code) {
      fs.writeFileSync(TARGET_PATH, updatedCode, { encoding: 'utf8', flag: 'w', mode: 0o600 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[EMG Core v49 Execution Error]: Failed to apply file fix to evolution route.', errorMessage);
    throw error;
  }
}

applyEvolutionFix();