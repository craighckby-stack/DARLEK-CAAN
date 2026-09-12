/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix3.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Sovereign, type-safe, resilient file transformation module.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

/** @type {Readonly<{relativePath: string, pattern: RegExp, replacement: string}>} */
const CONFIG = Object.freeze({
  relativePath: 'src/app/api/evolution/propose/route.ts',
  pattern: /siphonedCodeContext\}\n```\n\$\{fileContent/g,
  replacement: 'siphonedCodeContext}\n\\`\\`\\`\n${fileContent',
});

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

/**
 * Validates that the target path securely resides within the base directory.
 * 
 * @param {string} baseDir - The trusted root directory.
 * @param {string} targetPath - The resolved absolute path to check.
 * @returns {boolean} True if the path is secure, false otherwise.
 */
function isPathSecure(baseDir, targetPath) {
  return targetPath.startsWith(baseDir + path.sep) || targetPath === baseDir;
}

/**
 * Executes an idempotent, resilient code patch operation on the target route file.
 * Performs strict path validation, traversal protection, zero-write bypass, and comprehensive error containment.
 * 
 * @returns {boolean} True if the file was modified, false otherwise.
 */
function applyEvolutionPatch() {
  const baseDir = path.resolve();
  const resolvedPath = path.resolve(baseDir, CONFIG.relativePath);

  if (!isPathSecure(baseDir, resolvedPath)) {
    console.error(`[EMG Core] Security Violation: Path traversal attempt detected for "${CONFIG.relativePath}".`);
    process.exitCode = 1;
    return false;
  }

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

  if (stats.size > MAX_FILE_SIZE_BYTES) {
    console.error(`[EMG Core] Security Warning: File exceeds maximum permissible size bounds (${MAX_FILE_SIZE_BYTES} bytes).`);
    process.exitCode = 1;
    return false;
  }

  try {
    const sourceContent = fs.readFileSync(resolvedPath, 'utf8');

    CONFIG.pattern.lastIndex = 0;
    if (!CONFIG.pattern.test(sourceContent)) {
      console.log(`[EMG Core] Target pattern not detected in "${CONFIG.relativePath}". Operations skipped.`);
      return false;
    }

    CONFIG.pattern.lastIndex = 0;
    const transformedContent = sourceContent.replace(CONFIG.pattern, CONFIG.replacement);

    if (transformedContent === sourceContent) {
      return false;
    }

    fs.writeFileSync(resolvedPath, transformedContent, 'utf8');
    console.log(`[EMG Core] Sovereign transformation applied successfully to "${CONFIG.relativePath}".`);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[EMG Core] Critical failure during file transformation execution: ${errorMessage}`);
    process.exitCode = 1;
    return false;
  }
}

applyEvolutionPatch();