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

/**
 * Escapes markdown code block delimiters within the evolution proposal route source code.
 * @param {string} sourceCode - The raw source code contents.
 * @returns {string} The transformed source code with escaped code blocks.
 */
function sanitizeMarkdownCodeBlocks(sourceCode) {
    return sourceCode
        .replace(/```json/g, '\\`\\`\\`json')
        .replace(/```tsx/g, '\\`\\`\\`tsx')
        .replace(/}\n```\n/g, '}\n\\`\\`\\`\n')
        .replace(/\n```\nRisk/g, '\n\\`\\`\\`\nRisk');
}

/**
 * Executes the file transformation routine for the target route.
 */
function applyProposalRouteFix() {
    try {
        const rawCode = readFileSync(TARGET_ROUTE_PATH, ENCODING_UTF8);
        const optimizedCode = sanitizeMarkdownCodeBlocks(rawCode);
        
        writeFileSync(TARGET_ROUTE_PATH, optimizedCode, ENCODING_UTF8);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        process.stderr.write(`[DARLEK-CANN-ERROR] Failed to process proposal route fix: ${errorMessage}\n`);
        process.exit(1);
    }
}

applyProposalRouteFix();