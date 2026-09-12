/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fetch_readme.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Modular unit with resilient state interfaces.
 */

'use strict';

const https = require('node:https');

const CONFIG = Object.freeze({
  targetUrl: 'https://raw.githubusercontent.com/craighckby-stack/epistemic_debate_engine/main/README.md',
  maxDataSizeBytes: 1024 * 1024,
  timeoutMs: 10000,
  requestOptions: Object.freeze({
    headers: Object.freeze({
      'User-Agent': 'EMG-Core-v49-Neural-Code-Optimizer'
    })
  })
});

/**
 * Validates HTTP status and wires up data collection streams with strict bounds checking.
 * @param {import('http').IncomingMessage} response 
 * @param {import('http').ClientRequest} request 
 */
function handleResponse(response, request) {
  if (response.statusCode !== 200) {
    console.error(`Error: Non-200 status code received (${response.statusCode})`);
    response.resume();
    return;
  }

  const chunks = [];
  let currentDataSize = 0;

  response.on('data', (chunk) => {
    currentDataSize += chunk.length;
    if (currentDataSize > CONFIG.maxDataSizeBytes) {
      console.error('Error: Payload size exceeds safety bounds.');
      request.destroy(new Error('Payload size limit exceeded'));
      return;
    }
    chunks.push(chunk);
  });

  response.on('end', () => {
    if (currentDataSize <= CONFIG.maxDataSizeBytes) {
      try {
        const finalBuffer = Buffer.concat(chunks, currentDataSize);
        process.stdout.write(finalBuffer.toString('utf8') + '\n');
      } catch (err) {
        console.error('Error processing data stream payload securely handled.');
      }
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
req.setTimeout(CONFIG.timeoutMs, () => {
  console.error('Error: Request timeout exceeded.');
  req.destroy(new Error('Request timeout'));
});
req.on('error', handleError);
req.end();