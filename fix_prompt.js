/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 * Optimized by EMG Core v49 Neural Code and Documentation Optimizer Engine.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const CONFIG = Object.freeze({
  BASE_DIR: path.resolve('src/app/api/evolution/propose'),
  TARGET_FILE: path.resolve('src/app/api/evolution/propose/route.ts'),
  MAX_FILE_SIZE_BYTES: 5_000_000,
});

const PROMPT_PATTERNS = Object.freeze({
  PRIMARY_REGEX: /Your response MUST contain two parts:[\s\S]*?NO PLACEHOLDERS OR TRUNCATIONS"/,
  SECONDARY_REGEX: /,[\s]*"riskScore": 1-10,[\s]*"affectedFiles": \["list of other files that might be affected by this change"\],[\s]*"newFiles": \[[\s\S]*?\][\s]*\}/,
  REPLACEMENT_TEXT: `Your response MUST contain two parts:
1. A JSON object with your analysis and other metadata.
2. A Markdown code block containing the complete proposed code.

DO NOT put the proposed code inside the JSON object.

Format your response exactly like this:
\`\`\`json
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
\`\`\`

\`\`\`tsx
// Complete proposed code for the active file goes here.
// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS
\`\`\``,
});

/**
 * Validates path security boundaries to prevent directory traversal vulnerabilities.
 * @param {string} targetPath - The absolute path to validate.
 * @param {string} basePath - The allowed root boundary path.
 */
function assertSecurePath(targetPath, basePath) {
  if (!targetPath.startsWith(basePath)) {
    throw new Error('[EMG Security] Access denied: Target path resolves outside the allowed base directory.');
  }
}

/**
 * Validates file content integrity and sizing boundaries.
 * @param {any} content - The file content to validate.
 */
function assertValidFileContent(content) {
  if (typeof content !== 'string' || content.length > CONFIG.MAX_FILE_SIZE_BYTES) {
    throw new Error('[EMG Security] File content exceeds safety limit or is improperly formatted.');
  }
}

/**
 * Safely executes the prompt string replacement on the target route file
 * with robust error handling, strict path resolution bounds-checking, and defensive validation.
 */
function executePromptFix() {
  try {
    assertSecurePath(CONFIG.TARGET_FILE, CONFIG.BASE_DIR);

    if (!fs.existsSync(CONFIG.TARGET_FILE)) {
      throw new Error(`Target evolution route file not found at: ${CONFIG.TARGET_FILE}`);
    }

    let code = fs.readFileSync(CONFIG.TARGET_FILE, 'utf8');
    assertValidFileContent(code);

    if (!PROMPT_PATTERNS.PRIMARY_REGEX.test(code)) {
      console.warn('[EMG Warning] Primary prompt pattern not found in target file. Skipping primary replacement.');
    } else {
      code = code.replace(PROMPT_PATTERNS.PRIMARY_REGEX, PROMPT_PATTERNS.REPLACEMENT_TEXT);
    }

    if (PROMPT_PATTERNS.SECONDARY_REGEX.test(code)) {
      code = code.replace(PROMPT_PATTERNS.SECONDARY_REGEX, '');
    }

    fs.writeFileSync(CONFIG.TARGET_FILE, code, 'utf8');
    console.log(`[EMG Success] Successfully optimized and updated prompt structures in ${CONFIG.TARGET_FILE}`);
  } catch (error) {
    console.error(`[EMG Error] Failed to execute prompt fix: ${error.message}`);
    process.exitCode = 1;
  }
}

executePromptFix();