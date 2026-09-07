/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: "patch_prompt_json.js"
 * Optimization Goal: COMPREHENSIVE - Sovereign overhaul for maximum performance, memory efficiency, type safety, and error handling.
 */

'use strict';

const { readFileSync, writeFileSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');

/** @readonly */
const TARGET_STRICT_JSON_PROMPT = 'Your response MUST be in this exact JSON format (no markdown, no code fences):';

/** @readonly */
const REPLACEMENT_DUAL_FORMAT_PROMPT = `Your response MUST contain two parts:
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

/** @readonly */
const LEGACY_JSON_SCHEMA_PATTERN = /\{\s*"analysis": "Specific analysis[\s\S]*?"newFiles": \[\s*\{\s*"path": "relative\/path\/to\/new-file\.ts",\s*"content": "Full source code content of the new file to create"\s*\}\s*\]\s*\}/;

/** @readonly */
const TARGET_INLINE_JSON_PROMPT = 'Your response MUST be in this exact JSON format:{';

/** @readonly */
const REPLACEMENT_INLINE_JSON_PROMPT = 'Your response MUST contain a JSON block and a Code block:';

/**
 * Validates that the provided target path is a non-empty string.
 * 
 * @param {unknown} targetFilePath - The file path to validate.
 * @throws {TypeError} If the path is not a valid non-empty string.
 */
function validateTargetPath(targetFilePath) {
  if (typeof targetFilePath !== 'string' || targetFilePath.trim().length === 0) {
    throw new TypeError('[EMG-v49] Critical Error: targetFilePath must be a non-empty string.');
  }
}

/**
 * Resolves the given path and verifies that the file exists on disk.
 * 
 * @param {string} targetFilePath - The relative or absolute path.
 * @returns {string} The fully resolved absolute file path.
 * @throws {Error} If the file does not exist or access fails.
 */
function resolveExistingFile(targetFilePath) {
  let resolvedPath;
  try {
    resolvedPath = resolve(targetFilePath);
  } catch (error) {
    throw new Error(`[EMG-v49] Critical Error: Failed to resolve path "${targetFilePath}": ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!existsSync(resolvedPath)) {
    throw new Error(`[EMG-v49] Critical Error: Target file not found at path -> ${resolvedPath}`);
  }

  return resolvedPath;
}

/**
 * Reads source code text from disk safely using UTF-8 encoding.
 * 
 * @param {string} resolvedPath - The absolute file path.
 * @returns {string} The file contents.
 * @throws {Error} If reading fails.
 */
function readSourceCode(resolvedPath) {
  try {
    return readFileSync(resolvedPath, { encoding: 'utf8', flag: 'r' });
  } catch (readError) {
    const errorMessage = readError instanceof Error ? readError.message : String(readError);
    throw new Error(`[EMG-v49] Critical Error: Failed to read file at ${resolvedPath}: ${errorMessage}`);
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
  if (typeof updatedCode !== 'string') {
    throw new TypeError('[EMG-v49] Critical Error: updatedCode must be a string.');
  }

  try {
    writeFileSync(resolvedPath, updatedCode, { encoding: 'utf8', flag: 'w' });
  } catch (writeError) {
    const errorMessage = writeError instanceof Error ? writeError.message : String(writeError);
    throw new Error(`[EMG-v49] Critical Error: Failed to write file at ${resolvedPath}: ${errorMessage}`);
  }
}

/**
 * Applies text mutations to upgrade prompt formats and strip legacy schema patterns.
 * 
 * @param {string} code - The original source code content.
 * @returns {string} The transformed source code.
 */
function transformPromptContent(code) {
  if (typeof code !== 'string') {
    throw new TypeError('[EMG-v49] Critical Error: code content must be a string.');
  }

  let transformedCode = code;

  if (transformedCode.includes(TARGET_STRICT_JSON_PROMPT)) {
    transformedCode = transformedCode.replace(TARGET_STRICT_JSON_PROMPT, REPLACEMENT_DUAL_FORMAT_PROMPT);
  }

  if (LEGACY_JSON_SCHEMA_PATTERN.test(transformedCode)) {
    transformedCode = transformedCode.replace(LEGACY_JSON_SCHEMA_PATTERN, '');
  }

  if (transformedCode.includes(TARGET_INLINE_JSON_PROMPT)) {
    transformedCode = transformedCode.replace(TARGET_INLINE_JSON_PROMPT, REPLACEMENT_INLINE_JSON_PROMPT);
  }

  return transformedCode;
}

/**
 * Executes a robust, fault-tolerant text replacement workflow on the target source file.
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
  
  if (originalCode !== updatedCode) {
    writeSourceCode(resolvedPath, updatedCode);
  }
}

// Module Execution Guard with robust error serialization
if (require.main === module || true) {
  try {
    patchPromptJson('src/app/api/evolution/propose/route.ts');
  } catch (error) {
    const errorDetails = error instanceof Error ? error.stack || error.message : String(error);
    console.error('[EMG-v49] Execution Failed:', errorDetails);
    process.exit(1);
  }
}