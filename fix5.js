/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix5.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Executes targeted code transformation on the evolution propose route module.
 * Incorporates robust error handling, path resolution, strict mode, and idempotent I/O optimization.
 *
 * @returns {void}
 */
function applyEvolutionFix() {
  const baseDir = path.resolve(process.cwd());
  const relativeTarget = 'src/app/api/evolution/propose/route.ts';
  const targetPath = path.resolve(baseDir, relativeTarget);

  // Strict bounds checking: ensure resolved path strictly resides within the base directory to prevent path traversal attacks.
  if (!targetPath.startsWith(baseDir) || !path.isAbsolute(targetPath)) {
    throw new Error('[EMG Core v49 Security Violation]: Path traversal attempt detected.');
  }

  const searchPattern = /siphonedCodeContext\}```\$\{fileContent/g;
  const replacementString = "siphonedCodeContext}\\`\\`\\`${fileContent";

  try {
    if (!fs.existsSync(targetPath)) {
      throw new Error(`Target path does not exist: ${targetPath}`);
    }

    const stats = fs.statSync(targetPath);
    if (!stats.isFile()) {
      throw new Error(`Target path is not a valid file: ${targetPath}`);
    }

    // Defensive input validation: Limit file size reading to prevent potential memory overflow vulnerabilities (e.g., max 10MB).
    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
    if (stats.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`Target file exceeds maximum allowed size bounds: ${stats.size} bytes`);
    }

    const code = fs.readFileSync(targetPath, { encoding: 'utf8', flag: 'r' });
    const updatedCode = code.replace(searchPattern, replacementString);

    if (updatedCode !== code) {
      fs.writeFileSync(targetPath, updatedCode, { encoding: 'utf8', flag: 'w', mode: 0o600 });
    }
  } catch (error) {
    console.error('[EMG Core v49 Execution Error]: Failed to apply file fix to evolution route.', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

applyEvolutionFix();