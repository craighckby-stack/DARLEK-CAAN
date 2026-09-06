/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix6.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const { readFileSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const TARGET_FILE_PATH = resolve('src/app/api/evolution/propose/route.ts');
const ALLOWED_BASE_DIRECTORY = resolve('src');

// Pre-compiled global regexes to prevent allocation overhead across execution cycles
const REGEX_ESCAPE_1 = /siphonedCodeContext\}\r?\n```\r?\n\$\{fileContent/g;
const REGEX_ESCAPE_2 = /```\$\{fileContent/g;

/**
 * Validates that the target path remains securely within the allowed base directory.
 */
function validatePathSecurity(targetPath, allowedBase) {
    if (!targetPath.startsWith(allowedBase)) {
        throw new Error('SECURITY VIOLATION: Target path escapes allowed base directory.');
    }
}

/**
 * Reads the evolution route source file content securely.
 */
function readEvolutionRouteSource(filePath) {
    return readFileSync(filePath, 'utf8');
}

/**
 * Applies necessary template escaping transformations to the source code efficiently.
 */
function applyTemplateEscapingTransformations(sourceCode) {
    return sourceCode
        .replace(REGEX_ESCAPE_1, 'siphonedCodeContext}\n\\`\\`\\`\n${fileContent')
        .replace(REGEX_ESCAPE_2, '\\`\\`\\`${fileContent');
}

/**
 * Writes the updated evolution route source code back to disk with secure permissions.
 */
function saveEvolutionRouteSource(filePath, sourceCode) {
    writeFileSync(filePath, sourceCode, { encoding: 'utf8', mode: 0o600 });
}

/**
 * Executes the complete evolution code repair pipeline.
 */
function executeEvolutionCodeRepair() {
    validatePathSecurity(TARGET_FILE_PATH, ALLOWED_BASE_DIRECTORY);
    saveEvolutionRouteSource(
        TARGET_FILE_PATH, 
        applyTemplateEscapingTransformations(readEvolutionRouteSource(TARGET_FILE_PATH))
    );
}

executeEvolutionCodeRepair();