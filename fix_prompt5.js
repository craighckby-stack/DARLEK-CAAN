/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt5.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import fs from 'node:fs';
import path from 'node:path';

// System Constants & Pre-computed Boundaries
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_BASE_DIR = path.resolve('src/app/api/evolution');
const TARGET_RELATIVE_PATH = path.join('src', 'app', 'api', 'evolution', 'propose', 'route.ts');

// Pre-compiled regex and static replacement buffer to eliminate runtime compilation overhead
const MALFORMED_BLOCK_REGEX = /\\`\\`\\`tsx\\n\/\/ Complete proposed code for the active file goes here\.\\n\/\/ MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`\}``````tsx\/\/ Complete proposed code for the active file goes here\.\/\/ MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS/;
const PRISTINE_REPLACEMENT = "\\`\\`\\`\\n`";

/**
 * Validates and resolves the target file path against security boundaries using zero-allocation string checks.
 * @param {string} relativePath - The relative path to validate and resolve.
 * @returns {string} The fully resolved and validated absolute path.
 * @throws {Error} If the resolved path falls outside the allowed security base directory.
 */
function resolveAndValidatePath(relativePath) {
    const resolvedPath = path.resolve(relativePath);
    if (!resolvedPath.startsWith(ALLOWED_BASE_DIR)) {
        throw new Error('Security Violation: Access denied to target file path.');
    }
    return resolvedPath;
}

/**
 * Performs rigorous security and sanity checks utilizing sync syscall stats efficiently.
 * @param {string} filePath - The absolute file path to inspect.
 * @throws {Error} If the file does not exist, is not a regular file, or exceeds size limits.
 */
function validateFileConstraints(filePath) {
    let stats;
    try {
        stats = fs.statSync(filePath);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Security Violation: Target file does not exist: ${filePath}. Details: ${errorMessage}`);
    }

    if (!stats.isFile()) {
        throw new Error('Security Violation: Target path is not a valid regular file.');
    }

    if (stats.size > MAX_FILE_SIZE_BYTES) {
        throw new Error('Security Violation: File size exceeds safety bounds.');
    }
}

/**
 * Executes targeted text mutation with pre-compiled regex engine patterns.
 * @param {string} sourceCode - The original source code string.
 * @returns {string} The mutated source code string.
 * @throws {Error} If the input is invalid or exceeds memory safety bounds.
 */
function mutateSourceCode(sourceCode) {
    if (typeof sourceCode !== 'string') {
        throw new Error('Memory Safety Error: Invalid file content buffer.');
    }

    if (sourceCode.length > MAX_FILE_SIZE_BYTES) {
        throw new Error('Volatile Memory Safety Error: String expansion exceeded limits.');
    }

    return sourceCode.replace(MALFORMED_BLOCK_REGEX, PRISTINE_REPLACEMENT);
}

/**
 * Main execution routine optimized for memory footprint reduction and fast execution.
 * @throws {Error} If file resolution, validation, mutation, or disk I/O operations fail.
 */
function executeEvolutionFix() {
    try {
        const targetFile = resolveAndValidatePath(TARGET_RELATIVE_PATH);
        validateFileConstraints(targetFile);

        const originalCode = fs.readFileSync(targetFile, 'utf8');
        const optimizedCode = mutateSourceCode(originalCode);

        fs.writeFileSync(targetFile, optimizedCode, 'utf8');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('CRITICAL: Evolution fix execution failed:', errorMessage);
        process.exitCode = 1;
        throw error;
    }
}

// Invoke operational workflow
executeEvolutionFix();