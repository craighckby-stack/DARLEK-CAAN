/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt6.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Cache static constants and resolved paths to avoid redundant allocations and syscalls
const CWD = process.cwd();
const EXPECTED_BASE_DIR = path.resolve(CWD, 'src/app/api/evolution/propose');
const ALLOWED_SOURCE_DIR = path.resolve(CWD, 'src');

// Cache constant replacement string to eliminate redundant template instantiation overhead
const REPLACEMENT_CONTENT = `Format your response exactly like this:
\\\`\\\`\\\`json
{
  "analysis": "Specific analysis of what dead-weight or bugs were fixed...",
  "riskScore": 1,
  "affectedFiles": ["list of other files"],
  "newFiles": [
    {
      "path": "relative/path/to/new-file.ts",
      "content": "Full source code content of the new file to create"
    }
  ]
}
\\\`\\\`\\\`

\\\`\\\`\\\`tsx
// Complete proposed code for the active file goes here.
// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS
\\\`\\\`\\\`

Risk scoring guidelines:`;

const TARGET_PATTERN = /Format your response exactly like this:.*?\`\`\`Risk scoring guidelines:/s;

/**
 * Validates path traversal boundaries and file system integrity with cached base checks.
 * 
 * @param {string} targetRelativePath - The relative path to the target file.
 * @returns {string} The fully resolved and validated absolute file path.
 * @throws {Error} If path traversal or file validation fails.
 */
function getValidatedFilePath(targetRelativePath) {
  if (typeof targetRelativePath !== 'string' || targetRelativePath.trim() === '') {
    throw new Error('SECURITY_VIOLATION: Invalid target path provided.');
  }

  const resolvedPath = path.resolve(CWD, targetRelativePath);

  if (!resolvedPath.startsWith(EXPECTED_BASE_DIR) && !resolvedPath.startsWith(ALLOWED_SOURCE_DIR)) {
    throw new Error('SECURITY_VIOLATION: Access denied to target file path.');
  }

  let fileStats;
  try {
    fileStats = fs.statSync(resolvedPath);
  } catch (error) {
    throw new Error(`SECURITY_VIOLATION: Target file does not exist: ${targetRelativePath}`);
  }

  if (!fileStats.isFile()) {
    throw new Error('SECURITY_VIOLATION: Target path is not a valid regular file.');
  }

  return resolvedPath;
}

/**
 * Constructs the structured replacement block for the evolution prompt formatting guidelines.
 * 
 * @returns {string} The formatted replacement string.
 */
function buildReplacementContent() {
  return REPLACEMENT_CONTENT;
}

/**
 * Executes the targeted string replacement within the file contents.
 * 
 * @param {string} sourceCode - Original file content.
 * @returns {string} Updated file content.
 * @throws {Error} If the injection signature is missing.
 */
function applyPromptPatch(sourceCode) {
  if (typeof sourceCode !== 'string') {
    throw new Error('SECURITY_VIOLATION: Source code content must be a valid string.');
  }

  if (!TARGET_PATTERN.test(sourceCode)) {
    throw new Error('SECURITY_VIOLATION: Target injection signature not found within expected bounds.');
  }

  return sourceCode.replace(TARGET_PATTERN, REPLACEMENT_CONTENT);
}

/**
 * Main execution routine for file transformation with robust error handling.
 */
function main() {
  const TARGET_FILE_RELATIVE = 'src/app/api/evolution/propose/route.ts';
  
  try {
    const targetFilePath = getValidatedFilePath(TARGET_FILE_RELATIVE);
    const sourceCode = fs.readFileSync(targetFilePath, 'utf8');
    const updatedCode = applyPromptPatch(sourceCode);

    fs.writeFileSync(targetFilePath, updatedCode, { encoding: 'utf8', mode: 0o600 });
  } catch (error) {
    console.error(`[EMG-CORE-ERROR] Evolution prompt patch failure: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  getValidatedFilePath,
  buildReplacementContent,
  applyPromptPatch
};