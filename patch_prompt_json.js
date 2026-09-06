/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: "patch_prompt_json.js"
 * Optimization Goal: PERFORMANCE - Execution speed, memory footprint reduction, caching, avoiding unnecessary allocations, loop unrolling where sensible, and data structure efficiency.
 */

'use strict';

const { readFileSync, writeFileSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');

const TARGET_STR_1 = 'Your response MUST be in this exact JSON format (no markdown, no code fences):';
const REPLACEMENT_STR_1 = `Your response MUST contain two parts:
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

const LEGACY_JSON_SCHEMA_PATTERN = /\{\s*"analysis": "Specific analysis[\s\S]*?"newFiles": \[\s*\{\s*"path": "relative\/path\/to\/new-file\.ts",\s*"content": "Full source code content of the new file to create"\s*\}\s*\]\s*\}/;

const TARGET_STR_3 = 'Your response MUST be in this exact JSON format:{';
const REPLACEMENT_STR_3 = 'Your response MUST contain a JSON block and a Code block:';

/**
 * Validates target path without intermediate string allocations (.trim() avoided when possible).
 * 
 * @param {string} targetFilePath - The file path to validate.
 * @throws {TypeError} If the path is not a valid non-empty string.
 */
function validateTargetPath(targetFilePath) {
  if (typeof targetFilePath !== 'string' || targetFilePath.length === 0) {
    throw new TypeError('[EMG-v49] Critical Error: targetFilePath must be a non-empty string.');
  }
}

/**
 * Resolves and verifies the existence of the target file using direct bindings.
 * 
 * @param {string} targetFilePath - The relative or absolute path.
 * @returns {string} The fully resolved file path.
 * @throws {Error} If the file does not exist.
 */
function resolveExistingFile(targetFilePath) {
  const resolvedPath = resolve(targetFilePath);

  if (!existsSync(resolvedPath)) {
    throw new Error(`[EMG-v49] Critical Error: Target file not found at path -> ${resolvedPath}`);
  }

  return resolvedPath;
}

/**
 * Reads source code text from disk safely with pre-bound encoding options.
 * 
 * @param {string} resolvedPath - The absolute file path.
 * @returns {string} The file contents.
 * @throws {Error} If reading fails.
 */
function readSourceCode(resolvedPath) {
  try {
    return readFileSync(resolvedPath, 'utf8');
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
    writeFileSync(resolvedPath, updatedCode, 'utf8');
  } catch (writeError) {
    throw new Error(`[EMG-v49] Critical Error: Failed to write file at ${resolvedPath}: ${writeError.message}`);
  }
}

/**
 * Applies text mutations with minimal intermediate allocations and optimized conditional branches.
 * 
 * @param {string} code - The original source code content.
 * @returns {string} The transformed source code.
 */
function transformPromptContent(code) {
  let transformedCode = code;

  if (transformedCode.includes(TARGET_STR_1)) {
    transformedCode = transformedCode.replace(TARGET_STR_1, REPLACEMENT_STR_1);
  }

  if (LEGACY_JSON_SCHEMA_PATTERN.test(transformedCode)) {
    transformedCode = transformedCode.replace(LEGACY_JSON_SCHEMA_PATTERN, '');
  }

  if (transformedCode.includes(TARGET_STR_3)) {
    transformedCode = transformedCode.replace(TARGET_STR_3, REPLACEMENT_STR_3);
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
  patchPromptJson('src/app/api/evolution/propose/route.ts');
} catch (error) {
  console.error('[EMG-v49] Execution Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
}