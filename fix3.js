/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix3.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Sovereign, type-safe, resilient file transformation module.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Pattern configuration interface for code transformations.
 * @typedef {Object} TransformationConfig
 * @property {string} relativePath - Target file path relative to current working directory.
 * @property {RegExp} pattern - Regular expression matching target pattern.
 * @property {string} replacement - Escaped replacement string.
 */

/** @type {Readonly<TransformationConfig>} */
const CONFIG = Object.freeze({
  relativePath: 'src/app/api/evolution/propose/route.ts',
  pattern: /siphonedCodeContext\}\n```\n\$\{fileContent/g,
  replacement: 'siphonedCodeContext}\n\\`\\`\\`\n${fileContent',
});

/**
 * Executes an idempotent, resilient code patch operation on the target route file.
 * Performs strict path validation, traversal protection, zero-write bypass, and comprehensive error containment.
 * 
 * @returns {boolean} True if the file was modified, false otherwise.
 */
function applyEvolutionPatch() {
  // Defensive Input Validation & Path Traversal Prevention
  const baseDir = path.resolve(process.cwd());
  const resolvedPath = path.resolve(baseDir, CONFIG.relativePath);

  // Strict boundary enforcement to ensure path stays within base directory
  if (!resolvedPath.startsWith(baseDir + path.sep) && resolvedPath !== baseDir) {
    console.error(`[EMG Core] Security Violation: Path traversal attempt detected for "${CONFIG.relativePath}".`);
    process.exitCode = 1;
    return false;
  }

  try {
    // Stat check to ensure target is a regular file and avoid race conditions / symlink exploits
    let stats;
    try {
      stats = fs.lstatSync(resolvedPath);
    } catch {
      console.warn(`[EMG Core] Target file omitted - non-existent path: "${resolvedPath}"`);
      return false;
    }

    if (!stats.isFile()) {
      console.warn(`[EMG Core] Security Warning: Target path is not a standard file: "${resolvedPath}"`);
      return false;
    }

    // Enforce strict file size limits to prevent memory exhaustion / overflow (e.g., max 10MB)
    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
    if (stats.size > MAX_FILE_SIZE_BYTES) {
      console.error(`[EMG Core] Security Warning: File exceeds maximum permissible size bounds (${MAX_FILE_SIZE_BYTES} bytes).`);
      process.exitCode = 1;
      return false;
    }

    const sourceContent = fs.readFileSync(resolvedPath, 'utf8');

    // Reset regex index state prior to testing and replacement
    CONFIG.pattern.lastIndex = 0;
    if (!CONFIG.pattern.test(sourceContent)) {
      console.log(`[EMG Core] Target pattern not detected in "${CONFIG.relativePath}". Operations skipped.`);
      return false;
    }

    CONFIG.pattern.lastIndex = 0;
    const transformedContent = sourceContent.replace(CONFIG.pattern, CONFIG.replacement);

    if (transformedContent !== sourceContent) {
      fs.writeFileSync(resolvedPath, transformedContent, 'utf8');
      console.log(`[EMG Core] Sovereign transformation applied successfully to "${CONFIG.relativePath}".`);
      return true;
    }

    return false;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[EMG Core] Critical failure during file transformation execution: ${err.message}`);
    process.exitCode = 1;
    return false;
  }
}

applyEvolutionPatch();