/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt2.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Modular unit with resilient state verification.
 * Optimized by: EMG Core v49 Neural Code and Documentation Optimizer Engine.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Constants & Pre-compiled Regex/Strings
const TARGET_FILE_RELATIVE = 'src/app/api/evolution/propose/route.ts';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Pre-compiled literal regex to avoid recompilation overhead during execution cycles
const REGEX_TO_REPLACE = /```json\n\{\n  "analysis": "Specific analysis of what dead-weight or bugs were fixed\.\.\.",\n  "riskScore": 1,\n  "affectedFiles": \["list of other files"\],\n  "newFiles": \[\n    \{\n      "path": "relative\/path\/to\/new-file\.ts",\n      "content": "Full source code content of the new file to create"\n    \}\n  \]/;

const NEW_STRING = '\\`\\`\\`json\\n{\\n  \\\"analysis\\\": \\\"Specific analysis of what dead-weight or bugs were fixed...\\\",\\n  \\\"riskScore\\\": 1,\\n  \\\"affectedFiles\\\": [\\\"list of other files\\\"],\\n  \\\"newFiles\\\": [\\n    {\\n      \\\"path\\\": \\\"relative/path/to/new-file.ts\\\",\\n      \\\"content\\\": \\\"Full source code content of the new file to create\\\"\\n    }\\n  ]\\n}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n// Complete proposed code for the active file goes here.\\n// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`';

/**
 * Validates path security against directory traversal and symlink attacks.
 * @param {string} relativePath - The relative path to validate and resolve.
 * @returns {string} The fully validated, real absolute file path.
 * @throws {TypeError|Error} If security boundaries are breached or path resolution fails.
 */
function getValidatedSecurePath(relativePath) {
    if (typeof relativePath !== 'string' || relativePath.length === 0) {
        throw new TypeError('SECURITY_VIOLATION: Relative path must be a non-empty string.');
    }

    const cwd = process.cwd();
    const expectedBaseDir = path.resolve(cwd, 'src');
    const resolvedPath = path.resolve(cwd, relativePath);

    if (!resolvedPath.startsWith(expectedBaseDir)) {
        throw new Error('SECURITY_VIOLATION: Access outside permitted base directory is strictly prohibited.');
    }

    let realPath;
    try {
        realPath = fs.realpathSync(resolvedPath);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        throw new Error(`SECURITY_VIOLATION: Target file does not exist or cannot be accessed at validated path: ${relativePath} (${errorMessage})`);
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
 * @throws {Error} If file constraints, size limits, or I/O checks fail.
 */
function readTargetFile(filePath) {
    let fileDescriptor;
    try {
        fileDescriptor = fs.openSync(filePath, 'r');
        const stats = fs.fstatSync(fileDescriptor);

        if (!stats.isFile()) {
            throw new Error('SECURITY_VIOLATION: Target path does not resolve to a standard file.');
        }

        if (stats.size > MAX_FILE_SIZE) {
            throw new Error('SECURITY_VIOLATION: File size exceeds safety bounds limit.');
        }

        if (stats.size === 0) {
            return '';
        }

        const buffer = Buffer.allocUnsafe(stats.size);
        fs.readSync(fileDescriptor, buffer, 0, stats.size, 0);
        return buffer.toString('utf8');
    } finally {
        if (fileDescriptor !== undefined) {
            try {
                fs.closeSync(fileDescriptor);
            } catch {
                // Suppress secondary cleanup exceptions during error propagation
            }
        }
    }
}

/**
 * Executes the targeted prompt pattern replacement within the source code.
 * @param {string} code - Original source code content.
 * @returns {string} Modified source code content.
 * @throws {TypeError} If code content is not a valid string.
 */
function transformCodeContent(code) {
    if (typeof code !== 'string') {
        throw new TypeError('TRANSFORM_ERROR: Code content must be provided as a valid string.');
    }
    return code.replace(REGEX_TO_REPLACE, NEW_STRING);
}

/**
 * Main Execution Flow with robust error handling and exit codes.
 */
function main() {
    try {
        const securePath = getValidatedSecurePath(TARGET_FILE_RELATIVE);
        const originalCode = readTargetFile(securePath);
        const updatedCode = transformCodeContent(originalCode);
        
        fs.writeFileSync(securePath, updatedCode, { encoding: 'utf8', flag: 'w' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        process.stderr.write(`[EMG-CORE-CRITICAL] Execution Failed: ${errorMessage}\n`);
        process.exitCode = 1;
    }
}

// Execute main process
main();