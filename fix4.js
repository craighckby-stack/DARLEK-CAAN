/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix4.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const { readFileSync, writeFileSync, statSync } = require('node:fs');
const { resolve, normalize, sep } = require('node:path');

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB strict safety threshold
const TARGET_REL = 'src/app/api/evolution/propose/route.ts';
const BASE_DIR = resolve('src');
const targetPath = normalize(resolve(TARGET_REL));

if (!targetPath.startsWith(BASE_DIR + sep) && targetPath !== BASE_DIR) {
    throw new Error('Security Violation: Access denied to path outside target boundary.');
}

let stats;
try {
    stats = statSync(targetPath);
} catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    throw new Error(`Security Violation: Failed to read file stats for target path: ${err.message}`);
}

if (!stats.isFile()) {
    throw new Error('Security Violation: Target path does not point to a valid regular file.');
}

if (stats.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Security Violation: File size exceeds safe memory thresholds.');
}

let code;
try {
    code = readFileSync(targetPath, 'utf8');
} catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    throw new Error(`Execution Error: Failed to read target file content: ${err.message}`);
}

const targetPattern = /siphonedCodeContext\}\r?\n```\r?\n\$\{fileContent/g;

if (targetPattern.test(code)) {
    targetPattern.lastIndex = 0;
    code = code.replace(targetPattern, 'siphonedCodeContext}\n\\`\\`\\`\n${fileContent');
    
    try {
        writeFileSync(targetPath, code, 'utf8');
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        throw new Error(`Execution Error: Failed to write updated content to target file: ${err.message}`);
    }
}