/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: "patch_prompt_json.js"
 * Optimization Goal: READABILITY - Focus on pristine modern idioms, descriptive naming, modular decomposition, and clean architectural clarity.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * Validates that the provided target path is a non-empty string.
 * 
 * @param {string} targetFilePath - The file path to validate.
 * @throws {TypeError} If the path is not a valid non-empty string.
 */
function validateTargetPath(targetFilePath) {
  if (typeof targetFilePath !== 'string' || targetFilePath.trim() === '') {
    throw new TypeError('[EMG-v49] Critical Error: targetFilePath must be a non-empty string.');
  }
}

/**
 * Resolves and verifies the existence of the target file.
 * 
 * @param {string} targetFilePath - The relative or absolute path.
 * @returns {string} The fully resolved file path.
 * @throws {Error} If the file does not exist.
 */
function resolveExistingFile(targetFilePath) {
  const resolvedPath = path.resolve(targetFilePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`[EMG-v49] Critical Error: Target file not found at path -> ${resolvedPath}`);
  }

  return resolvedPath;
}

/**
 * Reads source code text from disk safely.
 * 
 * @param {string} resolvedPath - The absolute file path.
 * @returns {string} The file contents.
 * @throws {Error} If reading fails.
 */
function readSourceCode(resolvedPath) {
  try {
    return fs.readFileSync(resolvedPath, { encoding: 'utf8' });
  } catch (readError) {
    throw new Error(`[EMG-v49] Critical Error: Failed to read file at ${resolvedPath}: ${readError.message}`);
  }
}

/**
 * Writes updated source code text back to disk safely.
 * 
 * @param {string} resolvedPath - The absolute file path.
 * @param {string} updatedCode - The transformed code content.
 * @throws {Error} If writing fails.
 */
function writeSourceCode(resolvedPath, updatedCode) {
  try {
    fs.writeFileSync(resolvedPath, updatedCode, { encoding: 'utf8' });
  } catch (writeError) {
    throw new Error(`[EMG-v49] Critical Error: Failed to write file at ${resolvedPath}: ${writeError.message}`);
  }
}

/**
 * Applies text mutations to transition the prompt format from JSON-only to dual-block layout.
 * 
 * @param {string} code - The original source code content.
 * @returns {string} The transformed source code.
 */
function transformPromptContent(code) {
  let transformedCode = code;

  const targetString1 = 'Your response MUST be in this exact JSON format (no markdown, no code fences):';
  const replacementString1 = `Your response MUST contain two parts:
1. A JSON object with your analysis and other metadata.
2. A Markdown code block containing the complete proposed code.

DO NOT put the proposed code inside the JSON object.

Format your response exactly like this:
\`\`\`json
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
\`\`\`

\`\`\`tsx
// Complete proposed code for the active file goes here.
// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS
\`\`\``;

  if (transformedCode.includes(targetString1)) {
    transformedCode = transformedCode.replace(targetString1, replacementString1);
  }

  const legacyJsonSchemaPattern = /\{\s*"analysis": "Specific analysis[\s\S]*?"newFiles": \[\s*\{\s*"path": "relative\/path\/to\/new-file\.ts",\s*"content": "Full source code content of the new file to create"\s*\}\s*\]\s*\}/;
  if (legacyJsonSchemaPattern.test(transformedCode)) {
    transformedCode = transformedCode.replace(legacyJsonSchemaPattern, '');
  }

  const targetString3 = 'Your response MUST be in this exact JSON format:{';
  const replacementString3 = 'Your response MUST contain a JSON block and a Code block:';
  if (transformedCode.includes(targetString3)) {
    transformedCode = transformedCode.replace(targetString3, replacementString3);
  }

  return transformedCode;
}

/**
 * Executes a robust, fault-tolerant text replacement on the target source file.
 * 
 * @param {string} targetFilePath - Relative or absolute path to the file to patch.
 * @returns {void}
 * @throws {Error} If file reading, writing, or validation fails.
 */
function patchPromptJson(targetFilePath) {
  validateTargetPath(targetFilePath);
  const resolvedPath = resolveExistingFile(targetFilePath);
  
  const originalCode = readSourceCode(resolvedPath);
  const updatedCode = transformPromptContent(originalCode);
  
  writeSourceCode(resolvedPath, updatedCode);
}

// Module Execution Guard
try {
  const fileToPatch = 'src/app/api/evolution/propose/route.ts';
  patchPromptJson(fileToPatch);
} catch (error) {
  console.error('[EMG-v49] Execution Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
}