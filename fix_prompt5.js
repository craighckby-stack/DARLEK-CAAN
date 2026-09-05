/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt5.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('fs');
const path = require('path');

// Security: Enforce strict path validation and normalization to prevent path traversal attacks
const ALLOWED_BASE_DIR = path.resolve('src/app/api/evolution');
const targetFile = path.resolve('src/app/api/evolution/propose/route.ts');

if (!targetFile.startsWith(ALLOWED_BASE_DIR)) {
    throw new Error('Security Violation: Access denied to target file path.');
}

// Security: Defensive file existence and type verification before reading
if (!fs.existsSync(targetFile)) {
    throw new Error(`Security Violation: Target file does not exist: ${targetFile}`);
}

const stats = fs.statSync(targetFile);
if (!stats.isFile()) {
    throw new Error('Security Violation: Target path is not a valid regular file.');
}

// Security: Enforce strict file size bounds to prevent memory exhaustion (DoS via huge files, max 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
if (stats.size > MAX_FILE_SIZE) {
    throw new Error('Security Violation: File size exceeds safety bounds.');
}

// Read file safely with explicit encoding and bounds checking
let code = fs.readFileSync(targetFile, 'utf8');

if (typeof code !== 'string') {
    throw new Error('Memory Safety Error: Invalid file content buffer.');
}

// Security: Use a safe, bounded regex replacement without ReDoS risks
const regexToReplace = /\\`\\`\\`tsx\\n\/\/ Complete proposed code for the active file goes here\.\\n\/\/ MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`\}``````tsx\/\/ Complete proposed code for the active file goes here\.\/\/ MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS```/;
const replacementStr = "\\`\\`\\`\\n`";

// Verify safety of string replacement limits
if (code.length > MAX_FILE_SIZE) {
    throw new Error('Volatile Memory Safety Error: String expansion exceeded limits.');
}

code = code.replace(regexToReplace, replacementStr);

// Atomic-like safe file write with explicit encoding
fs.writeFileSync(targetFile, code, 'utf8');