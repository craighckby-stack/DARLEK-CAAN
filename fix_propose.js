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

const SANITIZE_PATTERN = /```json|```tsx|}\n```\n|\n```\nRisk/g;
const MARKDOWN_ESCAPE_MAP = Object.freeze({
    '```json': '\\`\\`\\`json',
    '```tsx': '\\`\\`\\`tsx',
    '}\n```\n': '}\n\\`\\`\\`\n',
    '\n```\nRisk': '\n\\`\\`\\`\nRisk'
});

/**
 * Escapes markdown code block delimiters within the evolution proposal route source code.
 * @param {string} sourceCode - The raw source code contents.
 * @returns {string} The transformed source code with escaped code blocks.
 */
function sanitizeMarkdownCodeBlocks(sourceCode) {
    return sourceCode.replace(SANITIZE_PATTERN, (matchedToken) => MARKDOWN_ESCAPE_MAP[matchedToken]);
}

/**
 * Executes the file transformation routine for the target route.
 * @throws {Error} Terminates process execution if file I/O operations fail.
 */
function applyProposalRouteFix() {
    try {
        const rawSourceCode = readFileSync(TARGET_ROUTE_PATH, ENCODING_UTF8);
        const optimizedSourceCode = sanitizeMarkdownCodeBlocks(rawSourceCode);
        
        writeFileSync(TARGET_ROUTE_PATH, optimizedSourceCode, ENCODING_UTF8);
    } catch (caughtError) {
        const errorMessage = caughtError instanceof Error ? caughtError.message : String(caughtError);
        process.stderr.write(`[DARLEK-CANN-ERROR] Failed to process proposal route fix: ${errorMessage}\n`);
        process.exit(1);
    }
}

applyProposalRouteFix();