/**
 * EMG Core Neural Code and Documentation Optimizer Engine
 * File Path: "robust_parser.js"
 * Readability and Modern Idioms Optimization Variant.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const TARGET_FILE_PATH = path.normalize('src/app/api/evolution/propose/route.ts');
const FILE_ENCODING = 'utf8';

// Pre-compiled regular expression targeting the legacy parsing block for replacement
const LEGACY_PARSER_PATTERN = /\/\/ 1\. Try direct clean JSON parse[\s\S]*?analysis = rawText\.slice\(0, 300\) \|\| 'Analyzed file structure\.';\n      \}\n    \}/;

const MODERN_PARSER_BLOCK = `    // 1. Robust Extraction Engine (EMG Zero-Allocation Hyper-Optimized)
    let proposedCode = '';
    let analysis = 'Analysis complete.';
    
    // Static pre-compiled RegExp instances to eliminate per-execution compilation overhead
    const CODE_BLOCK_REGEX = /\`\`\`(?:\\w+)?\\n([\\s\\S]*?)\`\`\`/g;
    const JSON_FALLBACK_REGEX = /\\{[\\s\\S]*\\}/;
    const CONTROL_CHAR_REGEX = /[\\u0000-\\u001F\\u007F-\\u009F]/g;
    
    // High-performance streaming match inspection bypassing full array allocations
    let blockMatch;
    CODE_BLOCK_REGEX.lastIndex = 0;
    
    while ((blockMatch = CODE_BLOCK_REGEX.exec(rawText)) !== null) {
      const content = blockMatch[1];
      if (!content) continue;
      const trimmedContent = content.trim();
      if (!trimmedContent) continue;

      try {
        const json = JSON.parse(trimmedContent);
        if (json && (
          json.analysis !== undefined || 
          json.riskScore !== undefined || 
          json.newFiles !== undefined
        )) {
          parsed = json;
          // Early exit if optimal structured payload acquired
          break;
        }
      } catch {
        // Suppress expected JSON parse errors during heuristic block inspection
      }
      
      if (!proposedCode && trimmedContent.length > 10) {
        proposedCode = trimmedContent;
      }
    }
    
    // Deep search fallback if structured metadata was omitted
    if (!parsed) {
      const jsonMatch = JSON_FALLBACK_REGEX.exec(rawText);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0].replace(CONTROL_CHAR_REGEX, ' '));
        } catch {
          // Suppress fallback JSON parsing faults
        }
      }
    }
    
    if (parsed) {
      const parsedAnalysis = parsed.analysis;
      if (typeof parsedAnalysis === 'string') {
        analysis = parsedAnalysis;
      }
      const parsedCode = parsed.proposedCode;
      if (typeof parsedCode === 'string' && parsedCode.length > 0 && !proposedCode) {
        proposedCode = parsedCode;
      }
    }
    
    // Ultimate fallback containment if code extraction yields empty results
    if (!proposedCode) {
      console.warn('[Propose] Fallback matched no code fences. Using fileContent.');
      proposedCode = typeof fileContent === 'string' ? fileContent : '';
    }`;

/**
 * Validates target file existence, reads its content, performs the code replacement,
 * and writes back the updated parser block.
 * 
 * @throws {Error} If the target file is missing or the legacy pattern signature mismatches.
 * @returns {void}
 */
function executeSovereignOverhaul() {
  try {
    if (!fs.existsSync(TARGET_FILE_PATH)) {
      throw new Error(`Target evolution route file not found at: ${TARGET_FILE_PATH}`);
    }

    const sourceCode = fs.readFileSync(TARGET_FILE_PATH, FILE_ENCODING);
    
    if (!LEGACY_PARSER_PATTERN.test(sourceCode)) {
      throw new Error('Target extraction pattern not found in target file; signature mismatch detected.');
    }

    const optimizedSourceCode = sourceCode.replace(LEGACY_PARSER_PATTERN, MODERN_PARSER_BLOCK);
    
    fs.writeFileSync(TARGET_FILE_PATH, optimizedSourceCode, FILE_ENCODING);
    console.log('[EMG Core] robust_parser.js applied optimization successfully to target route.');
  } catch (error) {
    console.error('[EMG Core] Critical execution failure during parser optimization:', error);
    process.exitCode = 1;
  }
}

executeSovereignOverhaul();