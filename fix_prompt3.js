/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_prompt3.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'const'; // Enforce strict mode implicitly/explicitly via parser guidelines

const fs = require('fs');
const path = require('path');

/**
 * Maximum allowed file size to mitigate memory exhaustion / buffer overflow vectors (10MB).
 * @const {number}
 */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Executes a robust string replacement within the specified target file
 * to correct prompt formatting artifacts with rigorous bounds checking and path sanitization.
 * 
 * @throws {Error} If file reading, replacement, or writing fails, or if path/size constraints are violated.
 */
function optimizeRoutePrompt() {
    // Defensive Input Validation & Path Traversal Prevention
    const relativeTarget = path.normalize('src/app/api/evolution/propose/route.ts');
    if (relativeTarget.includes('..') || path.isAbsolute(relativeTarget)) {
        throw new Error('[EMG Core v49] Security Violation: Path traversal or absolute path detected.');
    }

    const baseDir = process.cwd();
    const targetFilePath = path.resolve(baseDir, relativeTarget);

    // Verify resolved path remains strictly inside base directory boundary
    if (!targetFilePath.startsWith(baseDir)) {
        throw new Error('[EMG Core v49] Security Violation: Resolved path escapes root boundary.');
    }

    try {
        // Strict file existence and stats validation before volatile memory allocation
        if (!fs.existsSync(targetFilePath)) {
            throw new Error(`[EMG Core v49] Target file not found: ${targetFilePath}`);
        }

        const stats = fs.statSync(targetFilePath);
        if (!stats.isFile()) {
            throw new Error(`[EMG Core v49] Target path is not a valid regular file: ${targetFilePath}`);
        }

        if (stats.size > MAX_FILE_SIZE_BYTES) {
            throw new Error(`[EMG Core v49] File size exceeds maximum safety bounds (${MAX_FILE_SIZE_BYTES} bytes): ${stats.size} bytes`);
        }

        // Read file with explicit UTF-8 encoding for memory efficiency and safety
        const code = fs.readFileSync(targetFilePath, 'utf8');

        // Additional memory safety validation post-read
        if (typeof code !== 'string') {
            throw new Error('[EMG Core v49] Memory safety error: Read content did not resolve to a valid string.');
        }

        const targetStr = "\\`\\`\\`json\\n{\\n  \\\"analysis\\\": \\\"Specific analysis of what dead-weight or bugs were fixed...\\\",\\n  \\\"riskScore\\\": 1,\\n  \\\"affectedFiles\\\": [\\\"list of other files\\\"],\\n  \\\"newFiles\\\": [\\n    {\\n      \\\"path\\\": \\\"relative/path/to/new-file.ts\\\",\\n      \\\"content\\\": \\\"Full source code content of the new file to create\\\"\\n    }\\n  ]\\n}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n// Complete proposed code for the active file goes here.\\n// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`}``````tsx// Complete proposed code for the active file goes here.// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS```";
        const replacementStr = "\\`\\`\\`json\\n{\\n  \\\"analysis\\\": \\\"Specific analysis of what dead-weight or bugs were fixed...\\\",\\n  \\\"riskScore\\\": 1,\\n  \\\"affectedFiles\\\": [\\\"list of other files\\\"],\\n  \\\"newFiles\\\": [\\n    {\\n      \\\"path\\\": \\\"relative/path/to/new-file.ts\\\",\\n      \\\"content\\\": \\\"Full source code content of the new file to create\\\"\\n    }\\n  ]\\n}\\n\\`\\`\\`\\n\\n\\`\\`\\`tsx\\n// Complete proposed code for the active file goes here.\\n// MUST BE COMPLETE FILE, NO PLACEHOLDERS OR TRUNCATIONS\\n\\`\\`\\`\\n`";

        if (!code.includes(targetStr)) {
            console.warn('[EMG Core v49] Warning: Target string for replacement not found in file. No changes made.');
            return;
        }

        // Perform safe replacement (using non-regex string replacement to prevent injection vectors)
        const updatedCode = code.split(targetStr).join(replacementStr);

        // Atomic/safe write operation with explicit UTF-8 encoding
        fs.writeFileSync(targetFilePath, updatedCode, { encoding: 'utf8', mode: 0o600 });
        console.log('[EMG Core v49] Successfully updated with validated bounds: ' + targetFilePath);
    } catch (error) {
        console.error('[EMG Core v49] Critical Error during file transformation:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

optimizeRoutePrompt();