/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt4.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('fs');
const path = require('path');

// Defensive input validation & strict bounds checking for file path resolution
const ALLOWED_BASE_DIR = path.resolve('src/app/api/evolution');
const relativeFilePath = 'propose/route.ts';
const resolvedPath = path.resolve(ALLOWED_BASE_DIR, relativeFilePath);

// Security check: Ensure target path remains strictly within the allowed base directory to prevent path traversal
if (!resolvedPath.startsWith(ALLOWED_BASE_DIR)) {
    throw new Error('SECURITY ERROR: Unauthorized file access attempt detected.');
}

// Volatile memory safety & resource limit handling
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
let stats;
try {
    stats = fs.statSync(resolvedPath);
} catch (err) {
    throw new Error(`SECURITY ERROR: Failed to stat target file: ${err.message}`);
}

if (!stats.isFile()) {
    throw new Error('SECURITY ERROR: Target path is not a valid regular file.');
}

if (stats.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('SECURITY ERROR: File size exceeds maximum allowable memory bounds.');
}

// Safe synchronous read with strict encoding
let code = fs.readFileSync(resolvedPath, 'utf8');

const targetStr = "}``````tsx// Complete proposed code for the active file goes here.// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS```";
const replacementStr = "\n`";

// Strict replacement ensuring memory integrity
if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
} else {
    throw new Error('SECURITY ERROR: Target string pattern not found within safe bounds.');
}

// Safe atomic-like write implementation
fs.writeFileSync(resolvedPath, code, 'utf8');