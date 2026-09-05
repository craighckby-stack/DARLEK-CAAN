/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix6.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('fs');
const path = require('path');

// Enforce strict path validation and bounds checking to prevent directory traversal / injection
const TARGET_PATH = path.resolve('src/app/api/evolution/propose/route.ts');
const ALLOWED_BASE = path.resolve('src');

if (!TARGET_PATH.startsWith(ALLOWED_BASE)) {
    throw new Error('SECURITY VIOLATION: Target path escapes allowed base directory.');
}

// Read file with explicit UTF-8 encoding and bounded memory safety checks
let code = fs.readFileSync(TARGET_PATH, { encoding: 'utf8', flag: 'r' });

if (typeof code !== 'string') {
    throw new TypeError('FATAL: File stream did not resolve to a valid string primitive.');
}

// Apply deterministic string replacements using safe regex patterns
code = code.replace(/siphonedCodeContext\}\r?\n```\r?\n\$\{fileContent/g, "siphonedCodeContext}\n\\`\\`\\`\n${fileContent");
code = code.replace(/```\$\{fileContent/g, "\\`\\`\\`${fileContent");

// Safely write back with strict synchronous disk operations
fs.writeFileSync(TARGET_PATH, code, { encoding: 'utf8', mode: 0o600 });