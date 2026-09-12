/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix7.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 * Engine: EMG Core v49 Neural Code and Documentation Optimizer Engine
 */

'use strict';

const { readFileSync, writeFileSync } = require('node:fs');
const { resolve, normalize, sep } = require('node:path');

/**
 * Immutable system configuration utilizing defensive freezing.
 * @type {Readonly<{targetFilePath: string, allowedBaseDir: string, targetToken: string, fileEncoding: BufferEncoding}>}
 */
const SYSTEM_CONFIG = Object.freeze({
  targetFilePath: normalize('src/app/api/evolution/propose/route.ts'),
  allowedBaseDir: resolve('src'),
  targetToken: '${siphonedCodeContext}',
  fileEncoding: 'utf8',
});

/**
 * Validates that the target path resides strictly within the allowed base directory.
 * Prevents path traversal vulnerabilities with boundary separator checks.
 * 
 * @param {string} targetPath - The target file path to validate.
 * @param {string} baseDir - The permitted base directory boundary.
 * @returns {string} The fully resolved absolute path.
 * @throws {TypeError} If parameters are invalid types.
 * @throws {Error} If path traversal is detected.
 */
function getValidatedResolvedPath(targetPath, baseDir) {
  if (typeof targetPath !== 'string' || typeof baseDir !== 'string') {
    throw new TypeError('Path parameters must be of type string.');
  }

  const resolvedPath = resolve(targetPath);
  const normalizedBase = resolve(baseDir);

  if (!resolvedPath.startsWith(normalizedBase + sep) && resolvedPath !== normalizedBase) {
    throw new Error(`Access denied: Path traversal attempt detected for path -> ${targetPath}`);
  }
  
  return resolvedPath;
}

/**
 * Sanitizes markdown code blocks following the target token within the source content.
 * Employs memory-efficient string slicing and global replacement.
 * 
 * @param {string} fileContent - The raw content of the target file.
 * @param {string} token - The injection boundary token.
 * @returns {string} The processed file content with escaped markdown blocks.
 * @throws {TypeError} If parameters are invalid types.
 */
function sanitizeCodeContext(fileContent, token) {
  if (typeof fileContent !== 'string' || typeof token !== 'string') {
    throw new TypeError('Content and token parameters must be of type string.');
  }

  const tokenIndex = fileContent.indexOf(token);
  
  if (tokenIndex === -1) {
    return fileContent;
  }

  const splitIndex = tokenIndex + token.length;
  
  return fileContent.slice(0, splitIndex) + fileContent.slice(splitIndex).replaceAll('```', '\\`\\`\\`');
}

/**
 * Executes the file transformation operation safely using system configurations.
 * Enforces robust error handling and execution logging.
 * 
 * @returns {void}
 */
function executeCodeSanitization() {
  try {
    const validatedPath = getValidatedResolvedPath(
      SYSTEM_CONFIG.targetFilePath, 
      SYSTEM_CONFIG.allowedBaseDir
    );
    
    const originalSourceCode = readFileSync(validatedPath, { 
      encoding: SYSTEM_CONFIG.fileEncoding 
    });
    
    const optimizedSourceCode = sanitizeCodeContext(
      originalSourceCode, 
      SYSTEM_CONFIG.targetToken
    );
    
    writeFileSync(validatedPath, optimizedSourceCode, { 
      encoding: SYSTEM_CONFIG.fileEncoding 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[EMG-CORE-V49] Fatal execution failure in executeCodeSanitization: ${errorMessage}`);
    process.exitCode = 1;
  }
}

executeCodeSanitization();