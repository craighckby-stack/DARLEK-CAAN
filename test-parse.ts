const rawText1 = `Here is the response:
\`\`\`json
{
  "analysis": "Added stuff",
  "riskScore": 1
}
\`\`\`
And the code:
\`\`\`tsx
const x = 1;
\`\`\`
`;

const rawText2 = `\`\`\`json
{
  "analysis": "Added stuff",
  "riskScore": 1
}
\`\`\`
const y = 2;
`;

const rawText3 = `{
  "analysis": "Added stuff",
  "riskScore": 1
}
const z = 3;
`;

function parseLlmResponse(rawText, fallbackCode) {
  let parsedResponse = null;
  let proposedCode = '';
  let analysis = 'Analysis complete.';
  
  // 1. Try to extract JSON from anywhere in the text
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0].replace(/[\u0000-\u001F\u007F-\u009F]/g, ' '));
      if (parsed.analysis || parsed.riskScore !== undefined || parsed.newFiles) {
        parsedResponse = parsed;
      }
    }
  } catch (e) {
    // Ignore JSON parse errors
  }

  // 2. Try to extract code blocks
  const codeBlocks = [...rawText.matchAll(/```(?:[^\n]*)\n([\s\S]*?)```/g)];
  
  for (const block of codeBlocks) {
    const content = block[1].trim();
    // Skip if this block is just the JSON we already parsed
    if (parsedResponse && content.includes(parsedResponse.analysis || '')) {
      continue;
    }
    // Skip if it looks like JSON
    if (content.startsWith('{') && content.endsWith('}')) {
      try {
        JSON.parse(content);
        continue;
      } catch (e) {
        // Not valid JSON, might be code
      }
    }
    
    if (!proposedCode && content.length > 10) {
      proposedCode = content;
    }
  }
  
  // 3. If no proposed code found in code blocks, assume the rest of the text outside the JSON is the code
  if (!proposedCode) {
    const textWithoutJson = rawText.replace(/\{[\s\S]*\}/, '').replace(/```(?:json|tsx|)[^\n]*/g, '').replace(/```/g, '').trim();
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

console.log("TEST 1", parseLlmResponse(rawText1, "fallback"));
console.log("TEST 2", parseLlmResponse(rawText2, "fallback"));
console.log("TEST 3", parseLlmResponse(rawText3, "fallback"));
