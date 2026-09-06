/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt4.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('fs');
const path = require('path');

const CONFIG = Object.freeze({
    ALLOWED_BASE_DIR: path.resolve('src/app/api/evolution'),
    RELATIVE_FILE_PATH: 'propose/route.ts',
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB limit
    ENCODING: 'utf8',
    TARGET_STRING: '}``````tsx// Complete proposed code for the active file goes here.// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS```',
    REPLACEMENT_STRING: '\n`'
});

/**
 * Validates path security against directory traversal vulnerabilities.
 * Optimized with direct string validation to eliminate unnecessary object allocations.
 */
function resolveAndValidatePath(baseDir, relativePath) {
    const resolvedPath = path.resolve(baseDir, relativePath);
    if (!resolvedPath.startsWith(baseDir)) {
        throw new Error('SECURITY ERROR: Unauthorized file access attempt detected.');
    }
    return resolvedPath;
}

/**
 * Validates file existence, type constraints, and size limits using synchronous operations.
 */
function validateFileConstraints(filePath, maxSize) {
    let stats;
    try {
        stats = fs.statSync(filePath);
    } catch (err) {
        throw new Error(`SECURITY ERROR: Failed to stat target file: ${err.message}`);
    }

    if (!stats.isFile()) {
        throw new Error('SECURITY ERROR: Target path is not a valid regular file.');
    }

    if (stats.size > maxSize) {
        throw new Error('SECURITY ERROR: File size exceeds maximum allowable memory bounds.');
    }
}

/**
 * Performs content sanitization and replacement on the target source file.
 * Optimized to use direct string replacement avoiding global regex overhead.
 */
function sanitizeSourceCode(filePath, targetStr, replacementStr, encoding) {
    const code = fs.readFileSync(filePath, encoding);

    const index = code.indexOf(targetStr);
    if (index === -1) {
        throw new Error('SECURITY ERROR: Target string pattern not found within safe bounds.');
    }

    // Direct slice and concatenation for peak performance over string.replace
    const updatedCode = code.slice(0, index) + replacementStr + code.slice(index + targetStr.length);
    fs.writeFileSync(filePath, updatedCode, encoding);
}

// Main Execution Flow
function executeEvolutionaryPromptFix() {
    const targetPath = resolveAndValidatePath(CONFIG.ALLOWED_BASE_DIR, CONFIG.RELATIVE_FILE_PATH);
    validateFileConstraints(targetPath, CONFIG.MAX_FILE_SIZE_BYTES);
    sanitizeSourceCode(targetPath, CONFIG.TARGET_STRING, CONFIG.REPLACEMENT_STRING, CONFIG.ENCODING);
}

executeEvolutionaryPromptFix();