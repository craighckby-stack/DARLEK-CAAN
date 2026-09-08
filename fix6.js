/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix6.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, normalize, sep } from 'node:path';

/**
 * Target path resolution configuration.
 * @type {string}
 */
const TARGET_FILE_PATH = resolve('src/app/api/evolution/propose/route.ts');

/**
 * Allowed base directory boundary.
 * @type {string}
 */
const ALLOWED_BASE_DIRECTORY = resolve('src');

// Pre-compiled global regexes to prevent allocation overhead across execution cycles
const REGEX_ESCAPE_PRIMARY = /siphonedCodeContext\}\r?\n```\r?\n\$\{fileContent/g;
const REGEX_ESCAPE_SECONDARY = /```\$\{fileContent/g;

/**
 * Validates that the target path remains securely within the allowed base directory,
 * preventing directory traversal attacks using robust boundary checks.
 * 
 * @param {string} targetPath - The absolute path to validate.
 * @param {string} allowedBase - The designated base directory boundary.
 * @throws {TypeError} When parameters are invalid.
 * @throws {Error} When the target path attempts directory traversal or escapes the base directory.
 */
function validatePathSecurity(targetPath, allowedBase) {
    if (typeof targetPath !== 'string' || typeof allowedBase !== 'string') {
        throw new TypeError('SECURITY VIOLATION: Path parameters must be strings.');
    }

    const normalizedTarget = normalize(targetPath);
    const normalizedBase = normalize(allowedBase);

    if (
        normalizedTarget !== normalizedBase &&
        !normalizedTarget.startsWith(normalizedBase + sep)
    ) {
        throw new Error(`SECURITY VIOLATION: Target path "${normalizedTarget}" escapes allowed base directory "${normalizedBase}".`);
    }
}

/**
 * Reads the evolution route source file content securely.
 * 
 * @param {string} filePath - Path of the file to read.
 * @returns {string} The raw file contents.
 * @throws {Error} When file read operations fail.
 */
function readEvolutionRouteSource(filePath) {
    if (typeof filePath !== 'string') {
        throw new TypeError('PARAMETER ERROR: File path must be a string.');
    }

    try {
        return readFileSync(filePath, { encoding: 'utf8' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`FAILED_FILE_READ: Unable to read file at "${filePath}". Details: ${errorMessage}`);
    }
}

/**
 * Applies necessary template escaping transformations to the source code efficiently.
 * 
 * @param {string} sourceCode - The raw source text.
 * @returns {string} The transformed source text.
 * @throws {TypeError} When source code is not a string.
 */
function applyTemplateEscapingTransformations(sourceCode) {
    if (typeof sourceCode !== 'string') {
        throw new TypeError('TRANSFORMATION ERROR: Source code must be a string.');
    }

    return sourceCode
        .replace(REGEX_ESCAPE_PRIMARY, 'siphonedCodeContext}\n\\`\\`\\`\n${fileContent')
        .replace(REGEX_ESCAPE_SECONDARY, '\\`\\`\\`${fileContent');
}

/**
 * Writes the updated evolution route source code back to disk with secure permissions.
 * 
 * @param {string} filePath - Path of the file to write.
 * @param {string} sourceCode - The updated source text.
 * @throws {Error} When file write operations fail.
 */
function saveEvolutionRouteSource(filePath, sourceCode) {
    if (typeof filePath !== 'string') {
        throw new TypeError('PARAMETER ERROR: File path must be a string.');
    }
    if (typeof sourceCode !== 'string') {
        throw new TypeError('PERSISTENCE ERROR: Source code payload must be a string.');
    }

    try {
        writeFileSync(filePath, sourceCode, { encoding: 'utf8', mode: 0o600, flag: 'w' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`FAILED_FILE_WRITE: Unable to persist file at "${filePath}". Details: ${errorMessage}`);
    }
}

/**
 * Executes the complete evolution code repair pipeline with fault tolerance.
 * 
 * @throws {Error} When any stage of the evolution repair pipeline fails.
 */
function executeEvolutionCodeRepair() {
    try {
        validatePathSecurity(TARGET_FILE_PATH, ALLOWED_BASE_DIRECTORY);
        
        const originalSource = readEvolutionRouteSource(TARGET_FILE_PATH);
        const repairedSource = applyTemplateEscapingTransformations(originalSource);
        
        saveEvolutionRouteSource(TARGET_FILE_PATH, repairedSource);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[EMG CORE v49] Evolution Repair Pipeline Failure: ${errorMessage}`);
        throw error;
    }
}

executeEvolutionCodeRepair();