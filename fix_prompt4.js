/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt4.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve, normalize } from 'node:path';

/**
 * System configuration parameters bound to immutable frozen structures.
 */
const CONFIG = Object.freeze({
    ALLOWED_BASE_DIR: resolve('src/app/api/evolution'),
    RELATIVE_FILE_PATH: 'propose/route.ts',
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB limit
    ENCODING: /** @type {BufferEncoding} */ ('utf8'),
    TARGET_STRING: '}``````tsx// Complete proposed code for the active file goes here.// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS```',
    REPLACEMENT_STRING: '\n`'
});

/**
 * Validates path security against directory traversal vulnerabilities.
 * Optimized with direct string validation and normalized path segments.
 * 
 * @param {string} baseDir - The trusted base directory path.
 * @param {string} relativePath - The relative path to validate and resolve.
 * @returns {string} The fully resolved and validated file path.
 * @throws {Error} If path traversal or unauthorized access is attempted.
 */
function resolveAndValidatePath(baseDir, relativePath) {
    const resolvedPath = resolve(baseDir, relativePath);
    const normalizedBase = normalize(baseDir);
    const normalizedTarget = normalize(resolvedPath);

    if (!normalizedTarget.startsWith(normalizedBase)) {
        throw new Error('SECURITY ERROR: Unauthorized file access attempt detected.');
    }
    return normalizedTarget;
}

/**
 * Validates file existence, type constraints, and size limits using synchronous operations.
 * 
 * @param {string} filePath - The verified absolute file path.
 * @param {number} maxSize - Maximum permissible file size in bytes.
 * @throws {Error} If the file fails stat inspection, is not a regular file, or exceeds size limits.
 */
function validateFileConstraints(filePath, maxSize) {
    let stats;
    try {
        stats = statSync(filePath);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        throw new Error(`SECURITY ERROR: Failed to stat target file: ${errorMessage}`);
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
 * 
 * @param {string} filePath - The absolute target file path.
 * @param {string} targetStr - The exact string sequence to search for.
 * @param {string} replacementStr - The replacement string sequence.
 * @param {BufferEncoding} encoding - The character encoding format.
 * @throws {Error} If the target string pattern cannot be located.
 */
function sanitizeSourceCode(filePath, targetStr, replacementStr, encoding) {
    const code = readFileSync(filePath, encoding);

    const index = code.indexOf(targetStr);
    if (index === -1) {
        throw new Error('SECURITY ERROR: Target string pattern not found within safe bounds.');
    }

    // Direct slice and concatenation for peak performance over string.replace
    const updatedCode = code.slice(0, index) + replacementStr + code.slice(index + targetStr.length);
    writeFileSync(filePath, updatedCode, encoding);
}

/**
 * Main Execution Flow for evolutionary prompt fixes.
 * 
 * @throws {Error} If path resolution, constraint validation, or sanitization fails.
 */
function executeEvolutionaryPromptFix() {
    try {
        const targetPath = resolveAndValidatePath(CONFIG.ALLOWED_BASE_DIR, CONFIG.RELATIVE_FILE_PATH);
        validateFileConstraints(targetPath, CONFIG.MAX_FILE_SIZE_BYTES);
        sanitizeSourceCode(targetPath, CONFIG.TARGET_STRING, CONFIG.REPLACEMENT_STRING, CONFIG.ENCODING);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[EMG CORE v49 FATAL]: ${errorMessage}`);
        process.exitCode = 1;
        throw error;
    }
}

executeEvolutionaryPromptFix();