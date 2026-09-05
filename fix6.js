/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix6.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('node:fs');
const path = require('node:path');

const TARGET_FILE_PATH = path.resolve('src/app/api/evolution/propose/route.ts');
const ALLOWED_BASE_DIRECTORY = path.resolve('src');

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
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
    
    if (typeof fileContent !== 'string') {
        throw new TypeError('FATAL: File stream did not resolve to a valid string primitive.');
    }
    
    return fileContent;
}

/**
 * Applies necessary template escaping transformations to the source code.
 */
function applyTemplateEscapingTransformations(sourceCode) {
    return sourceCode
        .replace(/siphonedCodeContext\}\r?\n```\r?\n\$\{fileContent/g, "siphonedCodeContext}\n\\`\\`\\`\n${fileContent")
        .replace(/```\$\{fileContent/g, "\\`\\`\\`${fileContent");
}

/**
 * Writes the updated evolution route source code back to disk with secure permissions.
 */
function saveEvolutionRouteSource(filePath, sourceCode) {
    fs.writeFileSync(filePath, sourceCode, { encoding: 'utf8', mode: 0o600 });
}

/**
 * Executes the complete evolution code repair pipeline.
 */
function executeEvolutionCodeRepair() {
    validatePathSecurity(TARGET_FILE_PATH, ALLOWED_BASE_DIRECTORY);
    
    const originalCode = readEvolutionRouteSource(TARGET_FILE_PATH);
    const optimizedCode = applyTemplateEscapingTransformations(originalCode);
    
    saveEvolutionRouteSource(TARGET_FILE_PATH, optimizedCode);
}

executeEvolutionCodeRepair();