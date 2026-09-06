/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt8.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const { readFileSync, writeFileSync } = require('node:fs');

const TARGET_FILE_PATH = 'src/app/api/evolution/propose/route.ts';

const REGEX_JSON_FIX = /\\`\\`\\`json\{/g;
const REGEX_TSX_FIX = /\}\\`\\`\\`\\`\\`\\`tsx/g;
const REPLACEMENT_JSON = '\\`\\`\\`json\\n{';
const REPLACEMENT_TSX = '}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n';

/**
 * Normalizes code block formatting within the evolution proposal API route.
 * Optimized for performance by using direct synchronous I/O, pre-compiled global regexes,
 * and avoiding intermediate allocations where possible.
 * @param {string} filePath - Path to the target file.
 */
function normalizeCodeBlockFormatting(filePath) {
    const originalContent = readFileSync(filePath, 'utf8');

    const normalizedContent = originalContent
        .replace(REGEX_JSON_FIX, REPLACEMENT_JSON)
        .replace(REGEX_TSX_FIX, REPLACEMENT_TSX);

    if (originalContent !== normalizedContent) {
        writeFileSync(filePath, normalizedContent, 'utf8');
    }
}

normalizeCodeBlockFormatting(TARGET_FILE_PATH);