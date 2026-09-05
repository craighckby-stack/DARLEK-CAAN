/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix7.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('node:fs');
const path = require('node:path');

const SYSTEM_CONFIG = Object.freeze({
  targetFilePath: path.normalize('src/app/api/evolution/propose/route.ts'),
  allowedBaseDir: path.resolve('src'),
  targetToken: '${siphonedCodeContext}',
  fileEncoding: 'utf8',
});

/**
 * Validates that the target path resides strictly within the allowed base directory.
 * Prevents path traversal vulnerabilities.
 * 
 * @param {string} targetPath - The target file path to validate.
 * @param {string} baseDir - The permitted base directory boundary.
 * @returns {string} The fully resolved absolute path.
 */
function getValidatedResolvedPath(targetPath, baseDir) {
  const resolvedPath = path.resolve(targetPath);
  
  if (!resolvedPath.startsWith(baseDir)) {
    throw new Error('Access denied: Path traversal attempt detected.');
  }
  
  return resolvedPath;
}

/**
 * Sanitizes markdown code blocks following the target token within the source content.
 * 
 * @param {string} fileContent - The raw content of the target file.
 * @param {string} token - The injection boundary token.
 * @returns {string} The processed file content with escaped markdown blocks.
 */
function sanitizeCodeContext(fileContent, token) {
  const tokenIndex = fileContent.indexOf(token);
  
  if (tokenIndex === -1) {
    return fileContent;
  }

  const splitIndex = tokenIndex + token.length;
  const untouchedPrefix = fileContent.slice(0, splitIndex);
  const remainderToSanitize = fileContent.slice(splitIndex);

  const sanitizedRemainder = remainderToSanitize.replaceAll('```', '\\`\\`\\`');

  return untouchedPrefix + sanitizedRemainder;
}

/**
 * Executes the file transformation operation safely using system configurations.
 */
function executeCodeSanitization() {
  const validatedPath = getValidatedResolvedPath(SYSTEM_CONFIG.targetFilePath, SYSTEM_CONFIG.allowedBaseDir);
  const originalSourceCode = fs.readFileSync(validatedPath, SYSTEM_CONFIG.fileEncoding);
  
  const optimizedSourceCode = sanitizeCodeContext(originalSourceCode, SYSTEM_CONFIG.targetToken);
  
  fs.writeFileSync(validatedPath, optimizedSourceCode, SYSTEM_CONFIG.fileEncoding);
}

executeCodeSanitization();