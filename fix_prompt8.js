/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt8.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const { readFileSync, writeFileSync } = require('node:fs');

const TARGET_FILE_PATH = 'src/app/api/evolution/propose/route.ts';

const FORMATTING_REPLACEMENTS = Object.freeze([
    {
        pattern: /\\`\\`\\`json\{/g,
        replacement: '\\`\\`\\`json\\n{',
    },
    {
        pattern: /\}\\`\\`\\`\\`\\`\\`tsx/g,
        replacement: '}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n',
    },
]);

/**
 * Applies a sequence of regex transformations to string content.
 * 
 * @param {string} content - The source string to transform.
 * @returns {string} The transformed string.
 */
function applyFormattingTransforms(content) {
    return FORMATTING_REPLACEMENTS.reduce(
        (currentContent, { pattern, replacement }) => currentContent.replace(pattern, replacement),
        content
    );
}

/**
 * Normalizes code block formatting within the target file.
 * 
 * @param {string} filePath - Path to the target file.
 */
function normalizeCodeBlockFormatting(filePath) {
    const originalContent = readFileSync(filePath, 'utf8');
    const normalizedContent = applyFormattingTransforms(originalContent);

    if (originalContent !== normalizedContent) {
        writeFileSync(filePath, normalizedContent, 'utf8');
    }
}

normalizeCodeBlockFormatting(TARGET_FILE_PATH);