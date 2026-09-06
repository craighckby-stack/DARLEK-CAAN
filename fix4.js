/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix4.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const { readFileSync, writeFileSync, statSync } = require('fs');
const { resolve, normalize, sep } = require('path');

const TARGET_REL = 'src/app/api/evolution/propose/route.ts';
const BASE_DIR = resolve('src');
const targetPath = normalize(resolve(TARGET_REL));

if (!targetPath.startsWith(BASE_DIR + sep) && targetPath !== BASE_DIR) {
    throw new Error('Security Violation: Access denied to path outside target boundary.');
}

const stats = statSync(targetPath);
if (stats.size > 10485760) {
    throw new Error('Security Violation: File size exceeds safe memory thresholds.');
}

let code = readFileSync(targetPath, 'utf8');

const targetPattern = /siphonedCodeContext\}\r?\n```\r?\n\$\{fileContent/g;
if (targetPattern.test(code)) {
    code = code.replace(targetPattern, 'siphonedCodeContext}\n\\`\\`\\`\n${fileContent');
    writeFileSync(targetPath, code, 'utf8');
}