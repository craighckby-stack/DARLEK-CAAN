/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt2.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const { realpathSync, readFileSync, writeFileSync } = require('fs');
const { resolve, normalize } = require('path');

// Constants & Pre-compiled Regex/Strings
const TARGET_FILE_RELATIVE = 'src/app/api/evolution/propose/route.ts';
const MAX_FILE_SIZE = 5242880; // 5MB in bytes

// Cache process.cwd() execution context
const cwd = process.cwd();
const expectedBaseDir = resolve(cwd, 'src');
const resolvedPath = resolve(cwd, TARGET_FILE_RELATIVE);

// Strict path and directory traversal validation
if (!resolvedPath.startsWith(expectedBaseDir)) {
    throw new Error('SECURITY_VIOLATION: Access outside permitted base directory is strictly prohibited.');
}

// Atomic file validation utilizing realpathSync to mitigate symlink attacks
let realPath;
try {
    realPath = realpathSync(resolvedPath);
} catch {
    throw new Error(`SECURITY_VIOLATION: Target file does not exist at validated path: ${TARGET_FILE_RELATIVE}`);
}

if (!realPath.startsWith(expectedBaseDir)) {
    throw new Error('SECURITY_VIOLATION: Symlink traversal outside permitted base directory is strictly prohibited.');
}

// Bounded file reading and state evaluation via direct buffer allocation check
const fd = require('fs').openSync(realPath, 'r');
const stats = require('fs').fstatSync(fd);

if (!stats.isFile()) {
    require('fs').closeSync(fd);
    throw new Error('SECURITY_VIOLATION: Target path does not resolve to a standard file.');
}

if (stats.size > MAX_FILE_SIZE) {
    require('fs').closeSync(fd);
    throw new Error('SECURITY_VIOLATION: File size exceeds safety bounds limit.');
}

// Fast buffered file read minimizing intermediate allocations
const buffer = Buffer.allocUnsafe(stats.size);
require('fs').readSync(fd, buffer, 0, stats.size, 0);
require('fs').closeSync(fd);

let code = buffer.toString('utf8');

const regexToReplace = /```json\n\{\n  "analysis": "Specific analysis of what dead-weight or bugs were fixed\.\.\.",\n  "riskScore": 1,\n  "affectedFiles": \["list of other files"\],\n  "newFiles": \[\n    \{\n      "path": "relative\/path\/to\/new-file\.ts",\n      "content": "Full source code content of the new file to create"\n    \}\n  \]/;

const newString = '\\`\\`\\`json\\n{\\n  \\\"analysis\\\": \\\"Specific analysis of what dead-weight or bugs were fixed...\\\",\\n  \\\"riskScore\\\": 1,\\n  \\\"affectedFiles\\\": [\\\"list of other files\\\"],\\n  \\\"newFiles\\\": [\\n    {\\n      \\\"path\\\": \\\"relative/path/to/new-file.ts\\\",\\n      \\\"content\\\": \\\"Full source code content of the new file to create\\\"\\n    }\\n  ]\\n}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n// Complete proposed code for the active file goes here.\\n// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`';

// Perform optimized string transformation
code = code.replace(regexToReplace, newString);

// High-performance synchronous disk write with explicit encoding
writeFileSync(realPath, code, { encoding: 'utf8', flag: 'w' });