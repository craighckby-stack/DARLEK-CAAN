/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt8.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const { readFileSync, writeFileSync } = require('node:fs');

/** @type {string} */
const TARGET_FILE_PATH = 'src/app/api/evolution/propose/route.ts';

/**
 * @typedef {Object} FormattingReplacement
 * @property {RegExp} pattern
 * @property {string} replacement
 */

/** @type {ReadonlyArray<FormattingReplacement>} */
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
 * Applies a sequence of regex transformations to string content efficiently.
 * 
 * @param {string} content - The source string to transform.
 * @returns {string} The transformed string.
 */
function applyFormattingTransforms(content) {
    if (typeof content !== 'string') {
        throw new TypeError('Expected content to be a string.');
    }

    return FORMATTING_REPLACEMENTS.reduce(
        (acc, { pattern, replacement }) => acc.replace(pattern, replacement),
        content
    );
}

/**
 * Normalizes code block formatting within the target file with robust error handling.
 * 
 * @param {string} filePath - Path to the target file.
 * @throws {Error} If file read/write operations fail.
 */
function normalizeCodeBlockFormatting(filePath) {
    if (typeof filePath !== 'string' || filePath.trim() === '') {
        throw new TypeError('Expected a valid non-empty file path string.');
    }

    try {
        const originalContent = readFileSync(filePath, 'utf8');
        const normalizedContent = applyFormattingTransforms(originalContent);

        if (originalContent !== normalizedContent) {
            writeFileSync(filePath, normalizedContent, 'utf8');
        }
    } catch (error) {
        const err = /** @type {Error} */ (error);
        throw new Error(`Failed to normalize code block formatting for "${filePath}": ${err.message}`);
    }
}

normalizeCodeBlockFormatting(TARGET_FILE_PATH);