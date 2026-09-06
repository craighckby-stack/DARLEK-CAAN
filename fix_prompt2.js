/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt2.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Constants & Pre-compiled Regex/Strings
const TARGET_FILE_RELATIVE = 'src/app/api/evolution/propose/route.ts';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Validates path security against directory traversal and symlink attacks.
 * @param {string} relativePath - The relative path to validate and resolve.
 * @returns {string} The fully validated, real absolute file path.
 */
function getValidatedSecurePath(relativePath) {
    const cwd = process.cwd();
    const expectedBaseDir = path.resolve(cwd, 'src');
    const resolvedPath = path.resolve(cwd, relativePath);

    if (!resolvedPath.startsWith(expectedBaseDir)) {
        throw new Error('SECURITY_VIOLATION: Access outside permitted base directory is strictly prohibited.');
    }

    let realPath;
    try {
        realPath = fs.realpathSync(resolvedPath);
    } catch {
        throw new Error(`SECURITY_VIOLATION: Target file does not exist at validated path: ${relativePath}`);
    }

    if (!realPath.startsWith(expectedBaseDir)) {
        throw new Error('SECURITY_VIOLATION: Symlink traversal outside permitted base directory is strictly prohibited.');
    }

    return realPath;
}

/**
 * Safely reads a file with strict size and type enforcement.
 * @param {string} filePath - The absolute real path of the file to read.
 * @returns {string} The UTF-8 decoded file contents.
 */
function readTargetFile(filePath) {
    const fd = fs.openSync(filePath, 'r');
    try {
        const stats = fs.fstatSync(fd);

        if (!stats.isFile()) {
            throw new Error('SECURITY_VIOLATION: Target path does not resolve to a standard file.');
        }

        if (stats.size > MAX_FILE_SIZE) {
            throw new Error('SECURITY_VIOLATION: File size exceeds safety bounds limit.');
        }

        const buffer = Buffer.allocUnsafe(stats.size);
        fs.readSync(fd, buffer, 0, stats.size, 0);
        return buffer.toString('utf8');
    } finally {
        fs.closeSync(fd);
    }
}

/**
 * Executes the targeted prompt pattern replacement within the source code.
 * @param {string} code - Original source code content.
 * @returns {string} Modified source code content.
 */
function transformCodeContent(code) {
    const regexToReplace = /```json\n\{\n  "analysis": "Specific analysis of what dead-weight or bugs were fixed\.\.\.",\n  "riskScore": 1,\n  "affectedFiles": \["list of other files"\],\n  "newFiles": \[\n    \{\n      "path": "relative\/path\/to\/new-file\.ts",\n      "content": "Full source code content of the new file to create"\n    \}\n  \]/;

    const newString = '\\`\\`\\`json\\n{\\n  \\\"analysis\\\": \\\"Specific analysis of what dead-weight or bugs were fixed...\\\",\\n  \\\"riskScore\\\": 1,\\n  \\\"affectedFiles\\\": [\\\"list of other files\\\"],\\n  \\\"newFiles\\\": [\\n    {\\n      \\\"path\\\": \\\"relative/path/to/new-file.ts\\\",\\n      \\\"content\\\": \\\"Full source code content of the new file to create\\\"\\n    }\\n  ]\\n}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n// Complete proposed code for the active file goes here.\\n// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`';

    return code.replace(regexToReplace, newString);
}

// Main Execution Flow
function main() {
    const securePath = getValidatedSecurePath(TARGET_FILE_RELATIVE);
    const originalCode = readTargetFile(securePath);
    const updatedCode = transformCodeContent(originalCode);
    
    fs.writeFileSync(securePath, updatedCode, { encoding: 'utf8', flag: 'w' });
}

main();