/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix4.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('fs');
const path = require('path');

// Resolve path securely and validate input boundaries
const targetPath = path.resolve('src/app/api/evolution/propose/route.ts');
const normalizedPath = path.normalize(targetPath);

// Ensure the path stays within expected project boundaries to prevent path traversal
if (!normalizedPath.startsWith(path.resolve('src'))) {
    throw new Error('Security Violation: Access denied to path outside target boundary.');
}

// Read file with explicit UTF-8 encoding and bounded size checks
const stats = fs.statSync(normalizedPath);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit to prevent memory overflow
if (stats.size > MAX_FILE_SIZE) {
    throw new Error('Security Violation: File size exceeds safe memory thresholds.');
}

let code = fs.readFileSync(normalizedPath, 'utf8');

// Strict pattern replacement using safer string escaping and boundaries
const targetPattern = /siphonedCodeContext\}\r?\n```\r?\n\$\{fileContent/g;
const replacementString = "siphonedCodeContext}\n\\`\\`\\`\n${fileContent";

if (targetPattern.test(code)) {
    code = code.replace(targetPattern, replacementString);
    fs.writeFileSync(normalizedPath, code, 'utf8');
}