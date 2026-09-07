const rawText = `{
  "analysis": "Test"
}
export function myFunc() {
  return { a: 1 };
}`;

const jsonMatch = rawText.match(/\{[\s\S]*\}/);
console.log("MATCH:", jsonMatch[0]);

const replaced = rawText.replace(/\{[\s\S]*\}/, '');
console.log("REPLACED:", replaced);
