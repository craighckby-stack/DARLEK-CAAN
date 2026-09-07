function extractJSON(text) {
  // Try to find ```json ... ```
  const jsonBlock = text.match(/```(?:json)?\n([\s\S]*?)```/);
  if (jsonBlock) {
    try {
      return JSON.parse(jsonBlock[1]);
    } catch(e) {}
  }
  
  // Try to find the first '{' and parse incrementally to find the end
  const firstBrace = text.indexOf('{');
  if (firstBrace !== -1) {
    let braceCount = 0;
    let inString = false;
    let escape = false;
    for (let i = firstBrace; i < text.length; i++) {
      const char = text[i];
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
            const jsonStr = text.substring(firstBrace, i + 1);
            try {
              return JSON.parse(jsonStr);
            } catch (e) {
              break;
            }
          }
        }
      }
    }
  }
  return null;
}

const rawText = `Here is my thought:
{
  "analysis": "Test { nested }",
  "newFiles": [{"a": 1}]
}
export function myFunc() {
  return { a: 1 };
}`;

console.log(extractJSON(rawText));
