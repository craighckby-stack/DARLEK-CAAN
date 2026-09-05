/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt8.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('node:fs');

/**
 * Normalizes code block formatting within the evolution proposal API route.
 * @param {string} filePath - Path to the target file.
 */
function normalizeCodeBlockFormatting(filePath) {
    const originalContent = fs.readFileSync(filePath, 'utf8');

    const normalizedContent = originalContent
        .replace(/\\`\\`\\`json\{/g, '\\`\\`\\`json\\n{')
        .replace(/\}\\`\\`\\`\\`\\`\\`tsx/g, '}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n');

    fs.writeFileSync(filePath, normalizedContent, 'utf8');
}

const TARGET_FILE_PATH = 'src/app/api/evolution/propose/route.ts';

normalizeCodeBlockFormatting(TARGET_FILE_PATH);