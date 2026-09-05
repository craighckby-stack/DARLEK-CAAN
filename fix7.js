/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix7.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('fs');
const path = require('path');

const TARGET_FILE_PATH = path.normalize('src/app/api/evolution/propose/route.ts');
const ALLOWED_BASE_DIR = path.resolve('src');

const resolvedPath = path.resolve(TARGET_FILE_PATH);
if (!resolvedPath.startsWith(ALLOWED_BASE_DIR)) {
  throw new Error('Access denied: Path traversal attempt detected.');
}

let code = fs.readFileSync(resolvedPath, 'utf8');
const targetToken = '${siphonedCodeContext}';
const idx = code.indexOf(targetToken);

if (idx !== -1) {
  const tokenLength = targetToken.length;
  const start = code.substring(0, idx + tokenLength);
  let rest = code.substring(idx + tokenLength);
  rest = rest.replace(/```/g, '\\`\\`\\`');
  code = start + rest;
}

fs.writeFileSync(resolvedPath, code, 'utf8');