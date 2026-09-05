/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt6.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Enforce strict bounds and path normalization to prevent path traversal vulnerabilities
const TARGET_FILE_RELATIVE = 'src/app/api/evolution/propose/route.ts';
const resolvedPath = path.resolve(process.cwd(), TARGET_FILE_RELATIVE);
const expectedBaseDir = path.resolve(process.cwd(), 'src/app/api/evolution/propose');

// Defensive validation: Ensure the resolved path stays strictly inside expected boundaries
if (!resolvedPath.startsWith(expectedBaseDir) && !resolvedPath.startsWith(path.resolve(process.cwd(), 'src'))) {
  throw new Error('SECURITY_VIOLATION: Access denied to target file path.');
}

// Defensive file existence and type validation
if (!fs.existsSync(resolvedPath)) {
  throw new Error(`SECURITY_VIOLATION: Target file does not exist: ${TARGET_FILE_RELATIVE}`);
}

const stats = fs.statSync(resolvedPath);
if (!stats.isFile()) {
  throw new Error('SECURITY_VIOLATION: Target path is not a valid regular file.');
}

// Safe synchronous read with strict encoding
const code = fs.readFileSync(resolvedPath, 'utf8');

// Bounded string matching and replacement
const regexToReplace = /Format your response exactly like this:.*?\`\`\`Risk scoring guidelines:/s;

if (!regexToReplace.test(code)) {
  throw new Error('SECURITY_VIOLATION: Target injection signature not found within expected bounds.');
}

const replacementStr = `Format your response exactly like this:
\\\`\\\`\\\`json
{
  "analysis": "Specific analysis of what dead-weight or bugs were fixed...",
  "riskScore": 1,
  "affectedFiles": ["list of other files"],
  "newFiles": [
    {
      "path": "relative/path/to/new-file.ts",
      "content": "Full source code content of the new file to create"
    }
  ]
}
\\\`\\\`\\\`

\\\`\\\`\\\`tsx
// Complete proposed code for the active file goes here.
// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS
\\\`\\\`\\\`

Risk scoring guidelines:`;

const updatedCode = code.replace(regexToReplace, replacementStr);

// Atomic-like secure write with explicit UTF-8 encoding
fs.writeFileSync(resolvedPath, updatedCode, { encoding: 'utf8', mode: 0o600 });