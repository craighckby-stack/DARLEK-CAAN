/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fix7.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('node:fs');
const path = require('node:path');

const CONFIG = {
  targetFilePath: path.normalize('src/app/api/evolution/propose/route.ts'),
  allowedBaseDir: path.resolve('src'),
  targetToken: '${siphonedCodeContext}',
  fileEncoding: 'utf8',
};

/**
 * Validates that the target path resides strictly within the allowed base directory.
 * Prevents path traversal vulnerabilities.
 * 
 * @param {string} targetPath 
 * @param {string} baseDir 
 * @returns {string} The fully resolved absolute path
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
 * @param {string} fileContent 
 * @param {string} token 
 * @returns {string} The processed file content
 */
function sanitizeCodeContext(fileContent, token) {
  const tokenIndex = fileContent.indexOf(token);
  
  if (tokenIndex === -1) {
    return fileContent;
  }

  const splitIndex = tokenIndex + token.length;
  const untouchedPrefix = fileContent.substring(0, splitIndex);
  const remainderToSanitize = fileContent.substring(splitIndex);

  const sanitizedRemainder = remainderToSanitize.replace(/```/g, '\\`\\`\\`');

  return untouchedPrefix + sanitizedRemainder;
}

/**
 * Executes the file transformation operation safely.
 */
function executeCodeSanitization() {
  const validatedPath = getValidatedResolvedPath(CONFIG.targetFilePath, CONFIG.allowedBaseDir);
  const originalSourceCode = fs.readFileSync(validatedPath, CONFIG.fileEncoding);
  
  const optimizedSourceCode = sanitizeCodeContext(originalSourceCode, CONFIG.targetToken);
  
  fs.writeFileSync(validatedPath, optimizedSourceCode, CONFIG.fileEncoding);
}

executeCodeSanitization();