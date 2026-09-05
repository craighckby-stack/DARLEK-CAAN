/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt5.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import fs from 'node:fs';
import path from 'node:path';

// System Constants
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit to prevent memory exhaustion
const ALLOWED_BASE_DIR = path.resolve('src/app/api/evolution');
const TARGET_RELATIVE_PATH = path.join('src', 'app', 'api', 'evolution', 'propose', 'route.ts');

/**
 * Validates and resolves the target file path against security boundaries.
 * @param {string} relativePath - The relative path to validate and resolve.
 * @returns {string} The fully resolved and validated absolute path.
 */
function resolveAndValidatePath(relativePath) {
    const resolvedPath = path.resolve(relativePath);

    if (!resolvedPath.startsWith(ALLOWED_BASE_DIR)) {
        throw new Error('Security Violation: Access denied to target file path.');
    }

    return resolvedPath;
}

/**
 * Performs rigorous security and sanity checks on the target file.
 * @param {string} filePath - The absolute file path to inspect.
 */
function validateFileConstraints(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Security Violation: Target file does not exist: ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
        throw new Error('Security Violation: Target path is not a valid regular file.');
    }

    if (stats.size > MAX_FILE_SIZE_BYTES) {
        throw new Error('Security Violation: File size exceeds safety bounds.');
    }
}

/**
 * Executes the targeted text mutation on the file content safely.
 * @param {string} sourceCode - The original source code string.
 * @returns {string} The mutated source code string.
 */
function mutateSourceCode(sourceCode) {
    if (typeof sourceCode !== 'string') {
        throw new Error('Memory Safety Error: Invalid file content buffer.');
    }

    if (sourceCode.length > MAX_FILE_SIZE_BYTES) {
        throw new Error('Volatile Memory Safety Error: String expansion exceeded limits.');
    }

    // Safe, bounded regex replacement configuration
    const malformedBlockRegex = /\\`\\`\\`tsx\\n\/\/ Complete proposed code for the active file goes here\.\\n\/\/ MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`\}``````tsx\/\/ Complete proposed code for the active file goes here\.\/\/ MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS```/;
    const pristineReplacement = "\\`\\`\\`\\n`";

    return sourceCode.replace(malformedBlockRegex, pristineReplacement);
}

/**
 * Main execution routine for safe file transformation.
 */
function executeEvolutionFix() {
    const targetFile = resolveAndValidatePath(TARGET_RELATIVE_PATH);
    
    validateFileConstraints(targetFile);

    const originalCode = fs.readFileSync(targetFile, 'utf8');
    const optimizedCode = mutateSourceCode(originalCode);

    fs.writeFileSync(targetFile, optimizedCode, 'utf8');
}

// Invoke operational workflow
executeEvolutionFix();