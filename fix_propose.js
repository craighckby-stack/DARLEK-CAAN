/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_propose.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const { readFileSync, writeFileSync } = require('node:fs');
const { normalize } = require('node:path');

const TARGET_ROUTE_PATH = normalize('src/app/api/evolution/propose/route.ts');
const ENCODING_UTF8 = 'utf8';

// Pre-compiled global regular expression for single-pass replacement efficiency.
const SANITIZE_REGEX = /```json|```tsx|}\n```\n|\n```\nRisk/g;
const REPLACEMENT_MAP = {
    '```json': '\\`\\`\\`json',
    '```tsx': '\\`\\`\\`tsx',
    '}\n```\n': '}\n\\`\\`\\`\n',
    '\n```\nRisk': '\n\\`\\`\\`\nRisk'
};

/**
 * Escapes markdown code block delimiters within the evolution proposal route source code.
 * @param {string} sourceCode - The raw source code contents.
 * @returns {string} The transformed source code with escaped code blocks.
 */
function sanitizeMarkdownCodeBlocks(sourceCode) {
    return sourceCode.replace(SANITIZE_REGEX, (match) => REPLACEMENT_MAP[match]);
}

/**
 * Executes the file transformation routine for the target route.
 */
function applyProposalRouteFix() {
    try {
        const optimizedCode = sanitizeMarkdownCodeBlocks(readFileSync(TARGET_ROUTE_PATH, ENCODING_UTF8));
        writeFileSync(TARGET_ROUTE_PATH, optimizedCode, ENCODING_UTF8);
    } catch (error) {
        process.stderr.write(`[DARLEK-CANN-ERROR] Failed to process proposal route fix: ${error.message || error}\n`);
        process.exit(1);
    }
}

applyProposalRouteFix();