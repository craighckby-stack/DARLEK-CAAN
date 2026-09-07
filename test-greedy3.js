function parseLlmResponse(rawText, fallbackCode) {
  let parsedResponse = null;
  let proposedCode = '';
  let analysis = 'Analysis complete.';
  let jsonString = '';
  
  // 1. Better JSON extraction
  const firstBrace = rawText.indexOf('{');
  if (firstBrace !== -1) {
    let braceCount = 0;
    let inString = false;
    let escape = false;
    for (let i = firstBrace; i < rawText.length; i++) {
      const char = rawText[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            jsonString = rawText.substring(firstBrace, i + 1);
            try {
              const parsed = JSON.parse(jsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' '));
              if (parsed.analysis || parsed.riskScore !== undefined || parsed.newFiles) {
                parsedResponse = parsed;
              }
            } catch (e) {}
            break;
          }
        }
      }
    }
  }

  // 2. Try to extract code blocks
  const codeBlocks = [...rawText.matchAll(/```(?:[^\n]*)\n([\s\S]*?)```/g)];
  
  for (const block of codeBlocks) {
    const content = block[1].trim();
    // Skip if this block is just the JSON we already parsed
    if (parsedResponse && jsonString && content.replace(/\s/g, '') === jsonString.replace(/\s/g, '')) {
      continue;
    }
    // Skip if it looks like JSON
    if (content.startsWith('{') && content.endsWith('}')) {
      try {
        JSON.parse(content);
        continue;
      } catch (e) {}
    }
    
    if (!proposedCode && content.length > 10) {
      proposedCode = content;
    }
  }
  
  // 3. If no proposed code found in code blocks, assume the rest of the text outside the JSON is the code
  if (!proposedCode) {
    let textWithoutJson = rawText;
    if (jsonString) {
      textWithoutJson = rawText.replace(jsonString, '');
    }
    textWithoutJson = textWithoutJson.replace(/```(?:json|tsx|ts|js|jsx|html|css|python)?[ \t]*\n?/g, '').replace(/```/g, '').trim();
    
    if (textWithoutJson.length > 10) {
      proposedCode = textWithoutJson;
    }
  }
  
  if (parsedResponse) {
    analysis = parsedResponse.analysis || analysis;
    if (parsedResponse.proposedCode && !proposedCode) {
      proposedCode = parsedResponse.proposedCode;
    }
  }
  
  if (!proposedCode) {
    proposedCode = fallbackCode;
  }

  return { parsedResponse, proposedCode, analysis };
}

const rawText1 = `
{
  "analysis": "Test { nested }",
  "newFiles": [{"a": 1}]
}
export function myFunc() {
  return { a: 1 };
}
`;
console.log("No blocks:\n", parseLlmResponse(rawText1, "fallback"));

const rawText2 = `
\`\`\`json
{
  "analysis": "Test { nested }",
  "newFiles": [{"a": 1}]
}
\`\`\`
\`\`\`tsx
export function myFunc() {
  return { a: 1 };
}
\`\`\`
`;
console.log("Blocks:\n", parseLlmResponse(rawText2, "fallback"));

