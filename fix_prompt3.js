/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt3.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const BASE_DIRECTORY = process.cwd();

// Cached literal values for zero allocation overhead during string search/replace
const TARGET_SUBSTRING = "\\`\\`\\`json\\n{\\n  \\\"analysis\\\": \\\"Specific analysis of what dead-weight or bugs were fixed...\\\",\\n  \\\"riskScore\\\": 1,\\n  \\\"affectedFiles\\\": [\\\"list of other files\\\"],\\n  \\\"newFiles\\\": [\\n    {\\n      \\\"path\\\": \\\"relative/path/to/new-file.ts\\\",\\n      \\\"content\\\": \\\"Full source code content of the new file to create\\\"\\n    }\\n  ]\\n}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n// Complete proposed code for the active file goes here.\\n// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`}``````tsx// Complete proposed code for the active file goes here.// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS```";
const REPLACEMENT_SUBSTRING = "\\`\\`\\`json\\n{\\n  \\\"analysis\\\": \\\"Specific analysis of what dead-weight or bugs were fixed...\\\",\\n  \\\"riskScore\\\": 1,\\n  \\\"affectedFiles\\\": [\\\"list of other files\\\"],\\n  \\\"newFiles\\\": [\\n    {\\n      \\\"path\\\": \\\"relative/path/to/new-file.ts\\\",\\n      \\\"content\\\": \\\"Full source code content of the new file to create\\\"\\n    }\\n  ]\\n}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n// Complete proposed code for the active file goes here.\\n// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`\\n\\n";

/**
 * Validates the security boundaries of a target file path relative to the current working directory.
 * Optimized with pre-cached working directory lookup and strict boundary checks.
 * 
 * @param {string} relativeTargetPath - The relative path to validate.
 * @returns {string} The fully resolved, validated absolute file path.
 * @throws {Error} If path traversal, absolute path injection, or boundary escape is detected.
 */
function resolveAndValidatePath(relativeTargetPath) {
    if (typeof relativeTargetPath !== 'string' || relativeTargetPath.length === 0) {
        throw new Error('[EMG Core v49] Security Violation: Invalid path parameter provided.');
    }

    if (relativeTargetPath.includes('..') || path.isAbsolute(relativeTargetPath)) {
        throw new Error('[EMG Core v49] Security Violation: Path traversal or absolute path detected.');
    }

    const resolvedFilePath = path.resolve(BASE_DIRECTORY, relativeTargetPath);
    const normalizedBase = path.resolve(BASE_DIRECTORY);

    if (!resolvedFilePath.startsWith(normalizedBase + path.sep) && resolvedFilePath !== normalizedBase) {
        throw new Error('[EMG Core v49] Security Violation: Resolved path escapes root boundary.');
    }

    return resolvedFilePath;
}

/**
 * Validates the existence, type, and size constraints of a target file before memory operations using single stat call.
 * 
 * @param {string} filePath - The absolute path to the target file.
 * @throws {Error} If the file does not exist, is not a regular file, or exceeds size limits.
 */
function validateFileConstraints(filePath) {
    let fileStats;
    try {
        fileStats = fs.statSync(filePath);
    } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        throw new Error(`[EMG Core v49] Target file not found or inaccessible: ${filePath}. Details: ${detail}`);
    }
    
    if (!fileStats.isFile()) {
        throw new Error(`[EMG Core v49] Target path is not a valid regular file: ${filePath}`);
    }

    if (fileStats.size > MAX_FILE_SIZE_BYTES) {
        throw new Error(`[EMG Core v49] File size exceeds maximum safety bounds (${MAX_FILE_SIZE_BYTES} bytes): ${fileStats.size} bytes`);
    }
}

/**
 * Executes a robust string replacement within the specified target file
 * to correct prompt formatting artifacts with rigorous bounds checking and path sanitization.
 * 
 * @throws {Error} If file reading, replacement, or writing fails, or if path/size constraints are violated.
 */
function optimizeRoutePrompt() {
    try {
        const targetFilePath = resolveAndValidatePath('src/app/api/evolution/propose/route.ts');
        validateFileConstraints(targetFilePath);

        const fileContent = fs.readFileSync(targetFilePath, 'utf8');

        if (!fileContent.includes(TARGET_SUBSTRING)) {
            console.warn('[EMG Core v49] Warning: Target string for replacement not found in file. No changes made.');
            return;
        }

        const updatedCode = fileContent.replaceAll(TARGET_SUBSTRING, REPLACEMENT_SUBSTRING);

        fs.writeFileSync(targetFilePath, updatedCode, { encoding: 'utf8', mode: 0o600 });
        console.log(`[EMG Core v49] Successfully updated with validated bounds: ${targetFilePath}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[EMG Core v49] Critical Error during file transformation: ${errorMessage}`);
        process.exit(1);
    }
}

optimizeRoutePrompt();