/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix2.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

import fs from 'node:fs';
import path from 'node:path';

/**
 * Target path relative to the process execution root directory.
 * @type {string}
 */
const TARGET_FILE_PATH = 'src/app/api/evolution/propose/route.ts';

/**
 * Maximum permitted file size in bytes (10MB) to prevent memory exhaustion/overflow.
 * @type {number}
 */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Normalizes code content by escaping markdown code fences safely and efficiently.
 * Performs rigorous type and boundary checking to prevent injection or resource abuse.
 * @param {string} content - Raw source code string.
 * @returns {string} Sanitized source code string.
 */
function sanitizeFences(content) {
  if (typeof content !== 'string') {
    throw new TypeError('Expected content to be a string.');
  }

  // Bounds checking to prevent memory exhaustion and buffer overflows from massive strings
  if (content.length > MAX_FILE_SIZE_BYTES) {
    throw new RangeError(`Content size exceeds maximum allowable limit of ${MAX_FILE_SIZE_BYTES} bytes.`);
  }

  return content
    .replaceAll('```json', '\\`\\`\\`json')
    .replaceAll('```tsx', '\\`\\`\\`tsx')
    .replaceAll('}\n```', '}\n\\`\\`\\`')
    .replaceAll('TRUNCATIONS\n```', 'TRUNCATIONS\n\\`\\`\\`');
}

/**
 * Core execution routine for route file sanitization cycles.
 * Reads, sanitizes, and writes target route files back to disk conditionally with strict path traversal defense.
 * @param {string} relativePath - Path to target file.
 * @returns {boolean} True if file was modified and updated; false otherwise.
 */
function processRouteFile(relativePath) {
  if (typeof relativePath !== 'string' || relativePath.trim() === '') {
    throw new TypeError('Expected a valid relative path string.');
  }

  // Enforce absolute path sanitization and strict traversal jail
  const cwd = process.cwd();
  const absolutePath = path.resolve(cwd, relativePath);

  if (!absolutePath.startsWith(cwd)) {
    throw new Error(`Security Violation: Path traversal attempt detected outside working directory: ${relativePath}`);
  }

  try {
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Target file not found at path: ${absolutePath}`);
    }

    // Defensive file stats verification to guard against race conditions and size overruns
    const stats = fs.statSync(absolutePath);
    if (!stats.isFile()) {
      throw new Error(`Target path is not a valid regular file: ${absolutePath}`);
    }
    if (stats.size > MAX_FILE_SIZE_BYTES) {
      throw new RangeError(`File size (${stats.size} bytes) exceeds maximum security threshold.`);
    }

    const originalCode = fs.readFileSync(absolutePath, 'utf8');
    const sanitizedCode = sanitizeFences(originalCode);

    // Skip unnecessary disk I/O operations if code is unchanged
    if (sanitizedCode === originalCode) {
      return false;
    }

    fs.writeFileSync(absolutePath, sanitizedCode, 'utf8');
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[EMG Core] Failed to process route file safely: ${message}`);
    throw error;
  }
}

// Execute sovereign evolution cycle step
processRouteFile(TARGET_FILE_PATH);