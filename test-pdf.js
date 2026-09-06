/**
 * @file test-pdf.js
 * @version 3.0.0
 * @author EMG Core v49 Neural Code and Documentation Optimizer Engine
 * @description Diagnostic module for validating PDF parsing capabilities and executing test extractions.
 */

'use strict';

const pdfParse = require('pdf-parse');

/** @type {string} Standard diagnostic output log prefix */
const LOG_PREFIX = '[EMG-CORE-49]';

/**
 * Validates that the external PDF parser dependency is loaded correctly.
 *
 * @throws {TypeError} If the imported parser module is not a callable function.
 */
function validateParserDependency() {
    if (typeof pdfParse !== 'function') {
        throw new TypeError('CRITICAL: "pdf-parse" module failed to initialize or export a valid function.');
    }
}

/**
 * Validates and executes PDF diagnostic routines.
 * 
 * @async
 * @function executePdfDiagnostic
 * @param {Buffer|Uint8Array|string|null} [pdfSource=null] - Optional source buffer or path indicator for testing.
 * @returns {Promise<void>} Resolves when the diagnostic completes or safely captures an error.
 */
async function executePdfDiagnostic(pdfSource = null) {
    try {
        validateParserDependency();
        console.info(`${LOG_PREFIX} PDF Parser module successfully loaded and verified.`);
        
        if (pdfSource != null) {
            const parsedData = await pdfParse(pdfSource);
            console.debug(`${LOG_PREFIX} Parsed PDF successfully. Page count: ${parsedData.numpages}`);
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

module.exports = {
    executePdfDiagnostic
};