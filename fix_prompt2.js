/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt2.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('fs');
const path = require('path');

// Enforce strict path validation to prevent path traversal vulnerabilities
const TARGET_FILE_RELATIVE = 'src/app/api/evolution/propose/route.ts';
const resolvedPath = path.resolve(process.cwd(), TARGET_FILE_RELATIVE);
const expectedBaseDir = path.resolve(process.cwd(), 'src');

if (!resolvedPath.startsWith(expectedBaseDir)) {
    throw new Error('SECURITY_VIOLATION: Access outside permitted base directory is strictly prohibited.');
}

// Defensive file existence and type verification
if (!fs.existsSync(resolvedPath)) {
    throw new Error(`SECURITY_VIOLATION: Target file does not exist at validated path: ${TARGET_FILE_RELATIVE}`);
}

const stats = fs.statSync(resolvedPath);
if (!stats.isFile()) {
    throw new Error('SECURITY_VIOLATION: Target path does not resolve to a standard file.');
}

// Bounded file reading with explicit size limit (max 5MB to prevent memory exhaustion / overflow)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
if (stats.size > MAX_FILE_SIZE) {
    throw new Error('SECURITY_VIOLATION: File size exceeds safety bounds limit.');
}

let code = fs.readFileSync(resolvedPath, 'utf8');

const regexToReplace = /```json\n\{\n  "analysis": "Specific analysis of what dead-weight or bugs were fixed\.\.\.",\n  "riskScore": 1,\n  "affectedFiles": \["list of other files"\],\n  "newFiles": \[\n    \{\n      "path": "relative\/path\/to\/new-file\.ts",\n      "content": "Full source code content of the new file to create"\n    \}\n  \]/;

const newString = "\\`\\`\\`json\\n{\\n  \\\"analysis\\\": \\\"Specific analysis of what dead-weight or bugs were fixed...\\\",\\n  \\\"riskScore\\\": 1,\\n  \\\"affectedFiles\\\": [\\\"list of other files\\\"],\\n  \\\"newFiles\\\": [\\n    {\\n      \\\"path\\\": \\\"relative/path/to/new-file.ts\\\",\\n      \\\"content\\\": \\\"Full source code content of the new file to create\\\"\\n    }\\n  ]\\n}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n// Complete proposed code for the active file goes here.\\n// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`";

// Perform safe string replacement
code = code.replace(regexToReplace, newString);

// Atomic-style safe write operations with explicit encoding
fs.writeFileSync(resolvedPath, code, 'utf8');