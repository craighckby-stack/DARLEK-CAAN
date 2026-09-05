/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix_agi.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * Configuration constants for file system boundaries and safety limits.
 */
const CONFIG = {
    TARGET_RELATIVE_PATH: 'src/utils/agi-engine.ts',
    MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024, // 50MB limit
};

/**
 * Validates and normalizes the target file path to prevent directory traversal and injection vectors.
 * 
 * @param {string} inputPath - The relative path to validate.
 * @returns {string} The fully resolved, safe absolute path within bounds.
 * @throws {Error} If a path traversal attempt is detected.
 */
function getValidatedTargetSecurePath(inputPath) {
    const baseDir = path.resolve(process.cwd());
    const resolvedPath = path.resolve(baseDir, inputPath);

    if (!resolvedPath.startsWith(baseDir)) {
        throw new Error('Security Violation: Path traversal attempt detected.');
    }

    return resolvedPath;
}

/**
 * Ensures the target file exists and adheres to memory safety and size limits.
 * 
 * @param {string} targetPath - The absolute path of the file to inspect.
 * @throws {Error} If the file does not exist or exceeds size limits.
 */
function assertFileSafety(targetPath) {
    if (!fs.existsSync(targetPath)) {
        throw new Error(`Critical target path not found: ${targetPath}`);
    }

    const stats = fs.statSync(targetPath);
    if (stats.size > CONFIG.MAX_FILE_SIZE_BYTES) {
        throw new Error('Security Violation: Target file size exceeds strict memory safety limits.');
    }
}

/**
 * Strips redundant duplicate instances of the Edge Governance Gatekeeper class from the codebase.
 * 
 * @param {string} code - The raw source code string.
 * @returns {string} The optimized source code string.
 */
function removeDuplicateEdgeGovernance(code) {
    // Use non-catastrophic regex patterns with bounded scope to mitigate ReDoS vulnerabilities
    const classRegex = /\/\/ 9\.5 Edge Governance.*?export class EdgeGovernanceGatekeeper \{.*?\}\s*\}/gs;
    const matches = code.match(classRegex);

    if (matches && matches.length > 1) {
        return code.replace(matches[1], '');
    }

    return code;
}

/**
 * Sanitizes error messages to suppress leakage of raw system paths or volatile internal state.
 * 
 * @param {Error|unknown} error - The caught error object.
 * @returns {string} A safe, sanitized error message.
 */
function formatSanitizedErrorMessage(error) {
    const rawMessage = error instanceof Error ? error.message : String(error);
    return rawMessage.replace(/([A-Z]:)?[^:]+[/\\]src[/\\]/g, '[REDACTED]/src/');
}

/**
 * Executes the sovereign overhaul process by loading, validating, and updating the target engine file.
 */
function executeSovereignOverhaul() {
    try {
        const targetPath = getValidatedTargetSecurePath(CONFIG.TARGET_RELATIVE_PATH);
        
        assertFileSafety(targetPath);

        const code = fs.readFileSync(targetPath, 'utf8');
        const optimizedCode = removeDuplicateEdgeGovernance(code);

        if (optimizedCode !== code) {
            fs.writeFileSync(targetPath, optimizedCode, 'utf8');
        }
    } catch (error) {
        const safeMessage = formatSanitizedErrorMessage(error);
        process.stderr.write(`[EMG Core v49 Execution Error]: ${safeMessage}\n`);
        process.exitCode = 1;
    }
}

executeSovereignOverhaul();