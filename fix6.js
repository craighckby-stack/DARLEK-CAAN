/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix6.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('fs');
const path = require('path');

const TARGET_FILE_PATH = path.resolve('src/app/api/evolution/propose/route.ts');
const ALLOWED_BASE_DIRECTORY = path.resolve('src');

function validatePathSecurity(targetPath, allowedBase) {
    if (!targetPath.startsWith(allowedBase)) {
        throw new Error('SECURITY VIOLATION: Target path escapes allowed base directory.');
    }
}

function readEvolutionRouteSource(filePath) {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
    
    if (typeof fileContent !== 'string') {
        throw new TypeError('FATAL: File stream did not resolve to a valid string primitive.');
    }
    
    return fileContent;
}

function applyTemplateEscapingTransformations(sourceCode) {
    return sourceCode
        .replace(/siphonedCodeContext\}\r?\n```\r?\n\$\{fileContent/g, "siphonedCodeContext}\n\\`\\`\\`\n${fileContent")
        .replace(/```\$\{fileContent/g, "\\`\\`\\`${fileContent");
}

function saveEvolutionRouteSource(filePath, sourceCode) {
    fs.writeFileSync(filePath, sourceCode, { encoding: 'utf8', mode: 0o600 });
}

function executeEvolutionCodeRepair() {
    validatePathSecurity(TARGET_FILE_PATH, ALLOWED_BASE_DIRECTORY);
    
    const originalCode = readEvolutionRouteSource(TARGET_FILE_PATH);
    const optimizedCode = applyTemplateEscapingTransformations(originalCode);
    
    saveEvolutionRouteSource(TARGET_FILE_PATH, optimizedCode);
}

executeEvolutionCodeRepair();