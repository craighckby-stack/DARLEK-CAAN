/**
 * File: patch.js
 * Description: Modifies the evolution propose API route to integrate repository file context.
 */

const { readFileSync, writeFileSync } = require('node:fs');

const TARGET_FILE_PATH = 'src/app/api/evolution/propose/route.ts';
const SEARCH_TARGET = 'const userPrompt = `Analyze this file';

function applyPatch() {
    let fileContent;
    try {
        fileContent = readFileSync(TARGET_FILE_PATH, 'utf8');
    } catch {
        return;
    }
    const targetIndex = fileContent.indexOf(SEARCH_TARGET);

    if (targetIndex === -1) {
        return;
    }

    const lineEndIndex = fileContent.indexOf('\n', targetIndex);
    if (lineEndIndex === -1) {
        return;
    }

    const insertSnippet = '    const repoFilesContext = Array.isArray(body?.repoFiles) ? `\\nEXISTING REPOSITORY FILES:\\n${body.repoFiles.slice(0, 1000).join(\'\\n\')}\\n` : \'\';\n';

    let updatedContent = fileContent.slice(0, lineEndIndex + 1) + insertSnippet + fileContent.slice(lineEndIndex + 1);
    updatedContent = updatedContent.replace('${userReposContextStr}', '${userReposContextStr}${repoFilesContext}');

    writeFileSync(TARGET_FILE_PATH, updatedContent, 'utf8');
}

applyPatch();