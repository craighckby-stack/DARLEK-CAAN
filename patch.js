const { readFileSync, writeFileSync } = require('fs');

const FILE_PATH = 'src/app/api/evolution/propose/route.ts';
const SEARCH_TARGET = 'const userPrompt = `Analyze this file';

const content = readFileSync(FILE_PATH, 'utf8');
const idx = content.indexOf(SEARCH_TARGET);

if (idx !== -1) {
    const lineEndIdx = content.indexOf('\n', idx);
    const insertSnippet = `    const repoFilesContext = Array.isArray((body as any)?.repoFiles) ? \`\\nEXISTING REPOSITORY FILES:\\n\${(body as any).repoFiles.slice(0, 1000).join('\\n')}\\n\` : '';\n`;
    
    let updated = content.slice(0, lineEndIdx + 1) + insertSnippet + content.slice(lineEndIdx + 1);
    updated = updated.replace('${userReposContextStr}', '${userReposContextStr}${repoFilesContext}');

    writeFileSync(FILE_PATH, updated);
    console.log('Patched userPrompt');
}