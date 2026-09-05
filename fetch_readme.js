/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fetch_readme.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const https = require('node:https');

const CONFIG = Object.freeze({
  targetUrl: 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/README.md',
  maxDataSizeBytes: 1024 * 1024, // 1MB bounds check to prevent memory exhaustion / overflow
  requestOptions: Object.freeze({
    headers: Object.freeze({
      'User-Agent': 'EMG-Core-v49-Neural-Code-Optimizer'
    })
  })
});

/**
 * Handles the incoming HTTPS response stream with strict memory bounds validation.
 * @param {import('http').IncomingMessage} response 
 * @param {import('http').ClientRequest} request 
 */
function handleResponse(response, request) {
  if (response.statusCode !== 200) {
    console.error(`Error: Non-200 status code received (${response.statusCode})`);
    response.resume();
    return;
  }

  let accumulatedData = '';
  let currentDataSize = 0;

  response.on('data', (chunk) => {
    currentDataSize += chunk.length;
    if (currentDataSize > CONFIG.maxDataSizeBytes) {
      console.error('Error: Payload size exceeds safety bounds.');
      request.destroy();
      return;
    }
    accumulatedData += chunk;
  });

  response.on('end', () => {
    if (typeof accumulatedData === 'string' && accumulatedData.length <= CONFIG.maxDataSizeBytes) {
      process.stdout.write(accumulatedData + '\n');
    } else {
      console.error('Error: Invalid data payload format or size.');
    }
  });
}

/**
 * Handles transmission errors securely without exposing stack traces.
 * @param {Error} error 
 */
function handleError(error) {
  console.error('Network transmission error encountered securely handled.');
}

const req = https.get(CONFIG.targetUrl, CONFIG.requestOptions, (res) => handleResponse(res, req));
req.on('error', handleError);
req.end();