/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: "robust_parser.js"
 * Extreme Performance & Memory Optimization Variant.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const TARGET_FILE = path.normalize('src/app/api/evolution/propose/route.ts');
const BUFFER_ENCODING = 'utf8';

// Compiled regex targets hoisted out of execution paths to prevent reallocation overhead
const REGEX_TARGET = /\/\/ 1\. Try direct clean JSON parse[\s\S]*?analysis = rawText\.slice\(0, 300\) \|\| 'Analyzed file structure\.';\n      \}\n    \}/;

const NEW_PARSER_BLOCK = `    // 1. Robust Extraction Engine (EMG Zero-Allocation Hyper-Optimized)
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
 * Validates file existence, reads target content, performs regex replacement, and writes the optimized parser block.
 * @throws {Error} If the target file is missing or the target pattern signature mismatches.
 * @returns {void}
 */
function executeSovereignOverhaul() {
  try {
    if (!fs.existsSync(TARGET_FILE)) {
      throw new Error(`Target evolution route file not found at: ${TARGET_FILE}`);
    }

    const code = fs.readFileSync(TARGET_FILE, BUFFER_ENCODING);
    
    if (!REGEX_TARGET.test(code)) {
      throw new Error('Target extraction pattern not found in target file; signature mismatch detected.');
    }

    const optimizedCode = code.replace(REGEX_TARGET, NEW_PARSER_BLOCK);
    
    fs.writeFileSync(TARGET_FILE, optimizedCode, BUFFER_ENCODING);
    console.log('[EMG Core v49] robust_parser.js applied optimization successfully to target route.');
  } catch (error) {
    console.error('[EMG Core v49] Critical execution failure during parser optimization:', error);
    process.exitCode = 1;
  }
}

executeSovereignOverhaul();