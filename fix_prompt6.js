/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt6.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * Validates path traversal boundaries and file system integrity.
 * 
 * @param {string} targetRelativePath - The relative path to the target file.
 * @returns {string} The fully resolved and validated absolute file path.
 * @throws {Error} If path traversal or file validation fails.
 */
function getValidatedFilePath(targetRelativePath) {
  const currentWorkingDirectory = process.cwd();
  const resolvedPath = path.resolve(currentWorkingDirectory, targetRelativePath);
  const expectedBaseDir = path.resolve(currentWorkingDirectory, 'src/app/api/evolution/propose');
  const allowedSourceDir = path.resolve(currentWorkingDirectory, 'src');

  const isWithinBounds = 
    resolvedPath.startsWith(expectedBaseDir) || 
    resolvedPath.startsWith(allowedSourceDir);

  if (!isWithinBounds) {
    throw new Error('SECURITY_VIOLATION: Access denied to target file path.');
  }

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`SECURITY_VIOLATION: Target file does not exist: ${targetRelativePath}`);
  }

  const fileStats = fs.statSync(resolvedPath);
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
  return `Format your response exactly like this:
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
}

/**
 * Executes the targeted string replacement within the file contents.
 * 
 * @param {string} sourceCode - Original file content.
 * @returns {string} Updated file content.
 * @throws {Error} If the injection signature is missing.
 */
function applyPromptPatch(sourceCode) {
  const targetPattern = /Format your response exactly like this:.*?\`\`\`Risk scoring guidelines:/s;

  if (!targetPattern.test(sourceCode)) {
    throw new Error('SECURITY_VIOLATION: Target injection signature not found within expected bounds.');
  }

  return sourceCode.replace(targetPattern, buildReplacementContent());
}

/**
 * Main execution routine for file transformation.
 */
function main() {
  const TARGET_FILE_RELATIVE = 'src/app/api/evolution/propose/route.ts';
  const targetFilePath = getValidatedFilePath(TARGET_FILE_RELATIVE);

  const sourceCode = fs.readFileSync(targetFilePath, 'utf8');
  const updatedCode = applyPromptPatch(sourceCode);

  fs.writeFileSync(targetFilePath, updatedCode, { encoding: 'utf8', mode: 0o600 });
}

main();