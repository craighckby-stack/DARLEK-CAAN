/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt3.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * Maximum allowed file size to mitigate memory exhaustion / buffer overflow vectors (10MB).
 * @type {number}
 */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Validates the security boundaries of a target file path relative to the current working directory.
 * 
 * @param {string} relativeTargetPath - The relative path to validate.
 * @returns {string} The fully resolved, validated absolute file path.
 * @throws {Error} If path traversal, absolute path injection, or boundary escape is detected.
 */
function resolveAndValidatePath(relativeTargetPath) {
    const normalizedPath = path.normalize(relativeTargetPath);
    
    if (normalizedPath.includes('..') || path.isAbsolute(normalizedPath)) {
        throw new Error('[EMG Core v49] Security Violation: Path traversal or absolute path detected.');
    }

    const baseDirectory = process.cwd();
    const resolvedFilePath = path.resolve(baseDirectory, normalizedPath);

    if (!resolvedFilePath.startsWith(baseDirectory)) {
        throw new Error('[EMG Core v49] Security Violation: Resolved path escapes root boundary.');
    }

    return resolvedFilePath;
}

/**
 * Validates the existence, type, and size constraints of a target file before memory operations.
 * 
 * @param {string} filePath - The absolute path to the target file.
 * @throws {Error} If the file does not exist, is not a regular file, or exceeds size limits.
 */
function validateFileConstraints(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`[EMG Core v49] Target file not found: ${filePath}`);
    }

    const fileStats = fs.statSync(filePath);
    
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

        if (typeof fileContent !== 'string') {
            throw new Error('[EMG Core v49] Memory safety error: Read content did not resolve to a valid string.');
        }

        const targetSubstring = "\\`\\`\\`json\\n{\\n  \\\"analysis\\\": \\\"Specific analysis of what dead-weight or bugs were fixed...\\\",\\n  \\\"riskScore\\\": 1,\\n  \\\"affectedFiles\\\": [\\\"list of other files\\\"],\\n  \\\"newFiles\\\": [\\n    {\\n      \\\"path\\\": \\\"relative/path/to/new-file.ts\\\",\\n      \\\"content\\\": \\\"Full source code content of the new file to create\\\"\\n    }\\n  ]\\n}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n// Complete proposed code for the active file goes here.\\n// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`}``````tsx// Complete proposed code for the active file goes here.// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS```";
        const replacementSubstring = "\\`\\`\\`json\\n{\\n  \\\"analysis\\\": \\\"Specific analysis of what dead-weight or bugs were fixed...\\\",\\n  \\\"riskScore\\\": 1,\\n  \\\"affectedFiles\\\": [\\\"list of other files\\\"],\\n  \\\"newFiles\\\": [\\n    {\\n      \\\"path\\\": \\\"relative/path/to/new-file.ts\\\",\\n      \\\"content\\\": \\\"Full source code content of the new file to create\\\"\\n    }\\n  ]\\n}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n// Complete proposed code for the active file goes here.\\n// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`\\n`";

        if (!fileContent.includes(targetSubstring)) {
            console.warn('[EMG Core v49] Warning: Target string for replacement not found in file. No changes made.');
            return;
        }

        const updatedCode = fileContent.split(targetSubstring).join(replacementSubstring);

        fs.writeFileSync(targetFilePath, updatedCode, { encoding: 'utf8', mode: 0o600 });
        console.log(`[EMG Core v49] Successfully updated with validated bounds: ${targetFilePath}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[EMG Core v49] Critical Error during file transformation: ${errorMessage}`);
        process.exit(1);
    }
}

optimizeRoutePrompt();