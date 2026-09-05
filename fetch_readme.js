/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fetch_readme.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const https = require('https');

const TARGET_URL = 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/README.md';
const MAX_DATA_SIZE = 1024 * 1024; // 1MB bounds check to prevent memory exhaustion / overflow

const options = {
  headers: {
    'User-Agent': 'EMG-Core-v49-Neural-Code-Optimizer'
  }
};

const req = https.get(TARGET_URL, options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Error: Non-200 status code received (${res.statusCode})`);
    res.resume(); // Consume response data to free up memory
    return;
  }

  let data = '';
  let dataSize = 0;

  res.on('data', (chunk) => {
    dataSize += chunk.length;
    if (dataSize > MAX_DATA_SIZE) {
      console.error('Error: Payload size exceeds safety bounds.');
      req.destroy();
      return;
    }
    data += chunk;
  });

  res.on('end', () => {
    // Basic sanitization/validation check on output string length bounds
    if (typeof data === 'string' && data.length <= MAX_DATA_SIZE) {
      process.stdout.write(data + '\n');
    } else {
      console.error('Error: Invalid data payload format or size.');
    }
  });
});

req.on('error', (err) => {
  // Defensive error logging preventing potential exposure of stack traces
  console.error('Network transmission error encountered securely handled.');
});

req.end();