/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt7.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const { readFileSync, writeFileSync } = require('node:fs');

const TARGET_FILE_PATH = 'src/app/api/evolution/propose/route.ts';

// Pre-allocated static template strings to minimize runtime allocations and string concatenation overhead
const PROMPT_FORMAT_TEMPLATE = `Format your response exactly like this:
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

// Compiled regex flag optimization for fast engine-level matching without state retention overhead
const TARGET_PATTERN = /Format your response exactly like this:[\s\S]*?Risk scoring guidelines:/;

/**
 * Updates the evolution prompt instructions within the target API route file
 * optimized for minimal memory footprint and synchronous I/O velocity.
 */
function updateEvolutionPrompt() {
  // Read file directly into string buffer using utf8 encoding
  const currentSourceCode = readFileSync(TARGET_FILE_PATH, 'utf8');

  // Fast-path guard check before triggering heavier string replacement execution
  if (!TARGET_PATTERN.test(currentSourceCode)) {
    throw new Error(`Target pattern not found in file: ${TARGET_FILE_PATH}`);
  }

  // Execute optimized string replacement and write back directly to minimize heap allocation lifecycle
  writeFileSync(TARGET_FILE_PATH, currentSourceCode.replace(TARGET_PATTERN, PROMPT_FORMAT_TEMPLATE), 'utf8');
}

updateEvolutionPrompt();