const fs = require('node:fs');
const path = require('node:path');

const TARGET_FILE_PATH = path.join(process.cwd(), 'src/app/api/evolution/propose/route.ts');

const PROMPT_DECLARATION_PATTERN = /(const userPrompt = `Analyze this file and propose improvements:\\n\$\{rejectionContext\}\\n\$\{appliedMutationsContext\}\\n\$\{userReposContextStr\}\\nACTUAL SIPHONED CODE PATTERNS)/;
const PROMPT_INTERPOLATION_PATTERN = /(const userPrompt = `Analyze this file and propose improvements:\\n\$\{rejectionContext\}\\n\$\{appliedMutationsContext\}\\n\$\{userReposContextStr\})/;

const REPO_FILES_CONTEXT_DECLARATION = `const repoFilesContext = Array.isArray((body as any)?.repoFiles) 
      ? \`\\nEXISTING REPOSITORY FILES:\\n\${(body as any).repoFiles.slice(0, 1000).join('\\n')}\\n\` 
      : '';\n    $1`;

/**
 * Injects repository files context extraction and template injection into the prompt code.
 * 
 * @param {string} sourceCode - Raw source code of the target API route.
 * @returns {string} Modified source code with repository files context integrated.
 */
function injectRepoFilesContext(sourceCode) {
  return sourceCode
    .replace(PROMPT_DECLARATION_PATTERN, REPO_FILES_CONTEXT_DECLARATION)
    .replace(PROMPT_INTERPOLATION_PATTERN, '$1\n${repoFilesContext}');
}

/**
 * Main execution driver for updating the propose route source file.
 */
function updateProposeRoute() {
  const currentCode = fs.readFileSync(TARGET_FILE_PATH, 'utf8');
  const updatedCode = injectRepoFilesContext(currentCode);
  
  fs.writeFileSync(TARGET_FILE_PATH, updatedCode, 'utf8');
}

updateProposeRoute();