/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: find_changed.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');

const MAX_RESPONSE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit for DoS mitigation
const BASE_WATCH_DIR = 'src';
const RESOLVED_BASE = path.resolve(BASE_WATCH_DIR);

/**
 * Recursively scans a directory for files using synchronous iteration to minimize overhead.
 * Utilizes pre-resolved base paths to eliminate redundant path calculations.
 *
 * @param {string} dirPath - Directory path to traverse.
 * @param {string[]} [accumulator=[]] - Accumulator array for accumulated file paths.
 * @returns {string[]} List of discovered file paths.
 */
function walk(dirPath, accumulator = []) {
  if (typeof dirPath !== 'string' || dirPath.length === 0) {
    return accumulator;
  }

  const resolvedTarget = path.resolve(dirPath);

  if (!resolvedTarget.startsWith(RESOLVED_BASE)) {
    console.error(`Security violation: Attempted path traversal outside base directory: '${dirPath}'`);
    return accumulator;
  }

  let entries;
  try {
    entries = fs.readdirSync(resolvedTarget, { withFileTypes: true });
  } catch {
    return accumulator;
  }

  const len = entries.length;
  for (let i = 0; i < len; ++i) {
    const entry = entries[i];
    if (!entry || typeof entry.name !== 'string') {
      continue;
    }
    
    const fullPath = path.join(resolvedTarget, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, accumulator);
    } else if (entry.isFile()) {
      accumulator.push(fullPath);
    }
  }

  return accumulator;
}

/**
 * Processes the raw response payload from the GitHub API tree endpoint.
 * Validates schema integrity, extracts blob nodes, and serializes results locally.
 *
 * @param {string} rawData - Raw JSON string from the API response.
 */
function processTreeResponse(rawData) {
  try {
    const parsedData = JSON.parse(rawData);

    if (!parsedData || !Array.isArray(parsedData.tree)) {
      throw new TypeError('Invalid response schema: missing "tree" array');
    }

    const tree = parsedData.tree;
    const len = tree.length;
    const remoteFiles = [];
    
    for (let i = 0; i < len; ++i) {
      const node = tree[i];
      if (node && node.type === 'blob') {
        remoteFiles.push(node);
      }
    }

    walk(BASE_WATCH_DIR);

    fs.writeFileSync('remote_blobs.json', JSON.stringify(remoteFiles, null, 2), {
      encoding: 'utf8',
      mode: 0o600
    });
    
    console.log('Written blobs');
  } catch (error) {
    console.error('Failed to parse response or write remote blobs:', error);
  }
}

/**
 * Executes remote Git repository tree fetch and handles local repository indexing.
 * Implements strict payload size limits, protocol enforcement, and response validation.
 */
function executeSyncCycle() {
  const targetUrl = 'https://api.github.com/repos/craighckby-stack/epistemic_debate_engine/git/trees/main?recursive=1';
  const parsedUrl = new URL(targetUrl);

  if (parsedUrl.protocol !== 'https:') {
    console.error('Security violation: Non-HTTPS protocol rejected.');
    return;
  }

  const requestOptions = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'GET',
    headers: {
      'User-Agent': 'EMG-Core-v49',
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  const req = https.request(requestOptions, (res) => {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      console.error(`GitHub API HTTP request failed with status code ${res.statusCode}`);
      res.resume();
      return;
    }

    const chunks = [];
    let totalBytes = 0;

    res.on('data', (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > MAX_RESPONSE_SIZE_BYTES) {
        console.error('Security error: Response payload exceeded maximum allowable size (DoS mitigation).');
        res.destroy();
        return;
      }
      chunks.push(chunk);
    });

    res.on('end', () => {
      const rawData = Buffer.concat(chunks).toString('utf8');
      processTreeResponse(rawData);
    });
  });

  req.on('error', (error) => {
    console.error('Network failure during GitHub API fetch:', error);
  });

  req.end();
}

executeSyncCycle();