fetch('http://localhost:3000/api/evolution/propose', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fileContent: "/**\n * Header\n */\nexport const hello = 'world';",
    filePath: "src/test.ts",
    apiKeys: {},
    sessionId: "test-session"
  })
}).then(res => res.json()).then(data => console.log(data)).catch(err => console.error(err));
