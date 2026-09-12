/**
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
const REMOTE_BLOBS_OUTPUT_FILE = 'remote_blobs.json';
const GITHUB_TREE_API_URL = 'https://api.github.com/repos/craighckby-stack/epistemic_debate_engine/git/trees/main?recursive=1';

/**
 * Validates whether a target path resides within the authorized base directory to prevent path traversal.
 *
 * @param {string} targetPath - Path to validate.
 * @returns {boolean} True if safe, false otherwise.
 */
function isPathWithinBase(targetPath) {
  if (typeof targetPath !== 'string' || targetPath.length === 0) {
    return false;
  }
  const resolvedTarget = path.resolve(targetPath);
  return resolvedTarget.startsWith(RESOLVED_BASE);
}

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

  if (!isPathWithinBase(dirPath)) {
    console.error(`Security violation: Attempted path traversal outside base directory: '${dirPath}'`);
    return accumulator;
  }

  let entries;
  try {
    entries = fs.readdirSync(path.resolve(dirPath), { withFileTypes: true });
  } catch {
    return accumulator;
  }

  for (const entry of entries) {
    if (!entry || typeof entry.name !== 'string') {
      continue;
    }
    
    const fullPath = path.join(path.resolve(dirPath), entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, accumulator);
    } else if (entry.isFile()) {
      accumulator.push(fullPath);
    }
  }

  return accumulator;
}

/**
 * Filters GitHub API tree nodes, retaining only blob entities representing remote files.
 *
 * @param {Array<Object>} treeNodes - Array of tree nodes from the GitHub API response.
 * @returns {Array<Object>} Filtered array of blob nodes.
 */
function extractRemoteBlobs(treeNodes) {
  if (!Array.isArray(treeNodes)) {
    return [];
  }
  return treeNodes.filter((node) => node && typeof node === 'object' && node.type === 'blob');
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

    const remoteFiles = extractRemoteBlobs(parsedData.tree);

    walk(BASE_WATCH_DIR);

    fs.writeFileSync(REMOTE_BLOBS_OUTPUT_FILE, JSON.stringify(remoteFiles, null, 2), {
      encoding: 'utf8',
      mode: 0o600
    });
    
    console.log('Written blobs');
  } catch (error) {
    console.error('Failed to parse response or write remote blobs:', error);
  }
}

/**
 * Configures HTTPS request options for fetching the remote repository tree.
 *
 * @param {URL} parsedUrl - Parsed URL instance of the target endpoint.
 * @returns {Object} Request configuration options.
 */
function createRequestOptions(parsedUrl) {
  return {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'GET',
    headers: {
      'User-Agent': 'EMG-Core-v49',
      'Accept': 'application/vnd.github.v3+json'
    }
  };
}

/**
 * Executes remote Git repository tree fetch and handles local repository indexing.
 * Implements strict payload size limits, protocol enforcement, and response validation.
 */
function executeSyncCycle() {
  let parsedUrl;
  try {
    parsedUrl = new URL(GITHUB_TREE_API_URL);
  } catch (error) {
    console.error('Security error: Malformed GITHUB_TREE_API_URL.', error);
    return;
  }

  if (parsedUrl.protocol !== 'https:') {
    console.error('Security violation: Non-HTTPS protocol rejected.');
    return;
  }

  const req = https.request(createRequestOptions(parsedUrl), (res) => {
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
      try {
        const rawData = Buffer.concat(chunks).toString('utf8');
        processTreeResponse(rawData);
      } catch (error) {
        console.error('Failed to process response stream payload:', error);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Network failure during GitHub API fetch:', error);
  });

  req.end();
}

executeSyncCycle();