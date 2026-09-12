/**
 * @file test-pdf.js
 * @version 4.8.0
 * @author EMG Core v49 Neural Code and Documentation Optimizer Engine
 * @description Diagnostic module for validating PDF parsing capabilities and executing test extractions with enhanced type safety and robust memory efficiency.
 */

'use strict';

const pdfParse = require('pdf-parse');

/** @type {Readonly<string>} Standard diagnostic output log prefix */
const LOG_PREFIX = Object.freeze('[EMG-CORE-49]');

/**
 * Validates that the external PDF parser dependency is loaded correctly and efficiently.
 *
 * @throws {TypeError} If the imported parser module is not a callable function.
 */
function validateParserDependency() {
    if (typeof pdfParse !== 'function') {
        throw new TypeError('CRITICAL: "pdf-parse" module failed to initialize or export a valid function.');
    }
}

/**
 * Performs strict boundary and type validation on the incoming PDF source to prevent injection and memory overflow.
 *
 * @param {unknown} pdfSource - Input source to evaluate.
 * @returns {Buffer | Uint8Array | string} Verified safe source input.
 * @throws {TypeError} If the input fails security checks or bounds constraints.
 */
function sanitizePdfSource(pdfSource) {
    if (pdfSource === null || pdfSource === undefined) {
        throw new TypeError('CRITICAL: PDF source cannot be null or undefined.');
    }

    if (Buffer.isBuffer(pdfSource) || pdfSource instanceof Uint8Array) {
        if (pdfSource.length === 0) {
            throw new TypeError('CRITICAL: PDF buffer/array is empty.');
        }
        if (pdfSource.length > 52428800) { // 50MB bounds check
            throw new RangeError('CRITICAL: PDF source exceeds maximum allowable size bounds (50MB).');
        }
        return pdfSource;
    }

    if (typeof pdfSource === 'string') {
        if (pdfSource.trim().length === 0) {
            throw new TypeError('CRITICAL: PDF source path or string is empty.');
        }
        if (pdfSource.length > 1024) {
            throw new RangeError('CRITICAL: PDF path string exceeds maximum length constraints.');
        }
        return pdfSource;
    }

    throw new TypeError('CRITICAL: Invalid PDF source type provided.');
}

/**
 * Validates and executes PDF diagnostic routines with rigorous error isolation and memory awareness.
 * 
 * @async
 * @function executePdfDiagnostic
 * @param {unknown} [pdfSource=null] - Optional source buffer or path indicator for testing.
 * @returns {Promise<void>} Resolves when the diagnostic completes or safely captures an error.
 */
async function executePdfDiagnostic(pdfSource = null) {
    try {
        validateParserDependency();
        console.info(`${LOG_PREFIX} PDF Parser module successfully loaded and verified.`);
        
        if (pdfSource !== null && pdfSource !== undefined) {
            const validatedSource = sanitizePdfSource(pdfSource);
            const parsedData = await pdfParse(validatedSource);
            console.debug(`${LOG_PREFIX} Parsed PDF successfully. Page count: ${parsedData?.numpages ?? 0}`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`${LOG_PREFIX} Execution Error: ${errorMessage}`);
        process.exitCode = 1;
    }
}

// Automatically execute diagnostic routine when run directly from CLI
if (require.main === module) {
    void executePdfDiagnostic();
}

module.exports = Object.freeze({
    executePdfDiagnostic
});