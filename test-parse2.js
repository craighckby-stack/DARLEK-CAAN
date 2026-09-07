function parseLlmResponse(rawText, fallbackCode) {
  let parsedResponse = null;
  let proposedCode = '';
  let analysis = 'Analysis complete.';
  
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0].replace(/[\u0000-\u001F\u007F-\u009F]/g, ' '));
      if (parsed.analysis || parsed.riskScore !== undefined || parsed.newFiles) {
        parsedResponse = parsed;
      }
    }
  } catch (e) {
  }

  const codeBlocks = [...rawText.matchAll(/```(?:[^\n]*)\n([\s\S]*?)```/g)];
  
  for (const block of codeBlocks) {
    const content = block[1].trim();
    if (parsedResponse && content.includes(parsedResponse.analysis || '')) continue;
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
  
  if (!proposedCode) {
    const textWithoutJson = rawText.replace(/\{[\s\S]*\}/, '').replace(/```(?:json|tsx|)[^\n]*/g, '').replace(/```/g, '').trim();
    if (textWithoutJson.length > 20) {
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
  "analysis": "Specific analysis of what dead-weight or bugs were fixed... (must be detailed)",
  "riskScore": 1,
  "affectedFiles": [],
  "newFiles": []
}
\`\`\`tsx
export const x = 1;
\`\`\`
`;
console.log(parseLlmResponse(rawText1, "fallback"));
