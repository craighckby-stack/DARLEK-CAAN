/**
 * @file patch_logging.js
 * @module EMG/Core/v49/NeuralCodeOptimizer
 * @description Sovereign Overhaul - High-performance file patch utility with robust error handling and strict type-safety.
 */

'use strict';

const { readFileSync, writeFileSync } = require('node:fs');
const { normalize } = require('node:path');

/** @type {Readonly<string>} */
const TARGET_FILE_PATH = normalize('src/app/api/evolution/propose/route.ts');

/**
 * @typedef {Object} PatchConfig
 * @property {string} name
 * @property {string} search
 * @property {string} replacement
 */

/** @type {ReadonlyArray<PatchConfig>} */
const PATCH_CONFIGS = Object.freeze([
    Object.freeze({
        name: 'Target Signature 1',
        search: 'let proposedCode = parsed?.proposedCode;',
        replacement: "if (!parsed) console.log('[Propose] JSON parse failed. rawText length:', rawText.length, 'preview:', rawText.slice(0, 200));\n    let proposedCode = parsed?.proposedCode;"
    }),
    Object.freeze({
        name: 'Target Signature 2',
        search: 'proposedCode = fileContent;',
        replacement: "console.log('[Propose] Fallback matched no code fences. Using fileContent.');\n        proposedCode = fileContent;"
    })
]);

/**
 * Validates that all required target strings exist within the source code content.
 * 
 * @param {string} sourceContent - The original file content to inspect.
 * @param {string} filePath - The path of the target file for logging context.
 * @returns {void}
 */
function validateTargetSignatures(sourceContent, filePath) {
    const len = PATCH_CONFIGS.length;
    for (let i = 0; i < len; i++) {
        const config = PATCH_CONFIGS[i];
        if (!sourceContent.includes(config.search)) {
            console.warn(`[EMG-v49] Warning: ${config.name} not found in ${filePath}`);
        }
    }
}

/**
 * Applies configured string replacement patches sequentially to the source code.
 * 
 * @param {string} sourceContent - The original file content.
 * @returns {string} The updated file content.
 */
function applyPatches(sourceContent) {
    let content = sourceContent;
    const len = PATCH_CONFIGS.length;
    for (let i = 0; i < len; i++) {
        const config = PATCH_CONFIGS[i];
        content = content.replace(config.search, config.replacement);
    }
    return content;
}

/**
 * Executes a targeted string replacement patch on a specific target file.
 * 
 * @function patchLogging
 * @throws {Error} If the target file cannot be read or written securely.
 * @returns {void}
 */
function patchLogging() {
    try {
        const originalCode = readFileSync(TARGET_FILE_PATH, 'utf8');

        validateTargetSignatures(originalCode, TARGET_FILE_PATH);

        const updatedCode = applyPatches(originalCode);

        writeFileSync(TARGET_FILE_PATH, updatedCode, 'utf8');
        console.log(`[EMG-v49] Successfully patched target file: ${TARGET_FILE_PATH}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[EMG-v49] Critical execution failure during patching of ${TARGET_FILE_PATH}:`, errorMessage);
        process.exitCode = 1;
        throw error;
    }
}

patchLogging();