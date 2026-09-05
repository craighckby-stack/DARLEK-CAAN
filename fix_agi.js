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
 * Validates and normalizes the target file path to prevent directory traversal and injection vectors.
 * @param {string} inputPath - The relative path to validate.
 * @returns {string} The fully resolved, safe absolute path within bounds.
 */
function getValidatedTargetSecurePath(inputPath) {
    const baseDir = path.resolve(process.cwd());
    const resolvedPath = path.resolve(baseDir, inputPath);

    // Strict bounds checking: ensure resolved path remains strictly within the intended base directory
    if (!resolvedPath.startsWith(baseDir)) {
        throw new Error('Security Violation: Path traversal attempt detected.');
    }

    return resolvedPath;
}

function executeSovereignOverhaul() {
    try {
        const targetPath = getValidatedTargetSecurePath('src/utils/agi-engine.ts');

        if (!fs.existsSync(targetPath)) {
            throw new Error(`Critical target path not found: ${targetPath}`);
        }

        // Enforce strict size bounds checking to prevent potential memory exhaustion/buffer issues (e.g., 50MB limit)
        const stats = fs.statSync(targetPath);
        const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
        if (stats.size > MAX_FILE_SIZE_BYTES) {
            throw new Error('Security Violation: Target file size exceeds strict memory safety limits.');
        }

        const code = fs.readFileSync(targetPath, 'utf8');
        
        // Use non-catastrophic regex patterns with bounded scope to mitigate ReDoS vulnerabilities
        const classRegex = /\/\/ 9\.5 Edge Governance.*?export class EdgeGovernanceGatekeeper \{.*?\}\s*\}/gs;
        const matches = code.match(classRegex);

        if (matches && matches.length > 1) {
            const optimizedCode = code.replace(matches[1], '');
            fs.writeFileSync(targetPath, optimizedCode, 'utf8');
        }
    } catch (error) {
        // Suppress leakage of raw system paths or volatile internal state in error streams
        const safeMessage = typeof error.message === 'string' 
            ? error.message.replace(/([A-Z]:)?[^:]+[/\\]src[/\\]/g, '[REDACTED]/src/') 
            : 'Unknown error';
        
        process.stderr.write(`[EMG Core v49 Execution Error]: ${safeMessage}\n`);
        process.exitCode = 1;
    }
}

executeSovereignOverhaul();