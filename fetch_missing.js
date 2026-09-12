/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: fetch_missing.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Modular unit with resilient state interfaces.
 * Optimization Engine: EMG Core v49 Neural Code and Documentation Optimizer Engine
 */

'use strict';

const fs = require('fs/promises');
const https = require('https');
const path = require('path');

const API_ENDPOINT = 'https://api.github.com/repos/craighckby-stack/epistemic_debate_engine/git/trees/main?recursive=1';
const LOCAL_DIR = 'src';
const OUTPUT_FILE = 'missing_files.json';

/**
 * Fetches repository structure from GitHub API asynchronously with resilience.
 * @param {string} url - Target endpoint URL.
 * @returns {Promise<Object>} Resolves with JSON response object.
 */
function fetchRemoteTree(url) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      headers: {
        'User-Agent': 'node.js/EMG-Core-v49',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.get(url, requestOptions, (res) => {
      const { statusCode } = res;
      if (statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTPS GET failed with status code: ${statusCode}`));
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        try {
          const rawString = Buffer.concat(chunks).toString('utf8');
          const data = JSON.parse(rawString);
          resolve(data);
        } catch (err) {
          reject(new Error(`Failed to parse remote response payload: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Network transmission failed: ${err.message}`));
    });

    req.end();
  });
}

/**
 * Asynchronously traverses local filesystem directory and returns normalized POSIX relative paths.
 * @param {string} dir - Directory to recursively traverse.
 * @returns {Promise<string[]>} Array of POSIX relative file paths.
 */
async function walkDirectory(dir) {
  const results = [];

  try {
    await fs.access(dir);
  } catch {
    return results;
  }

  async function scan(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await scan(fullPath);
        } else if (entry.isFile()) {
          const normalizedPath = fullPath.split(path.sep).join('/');
          results.push(normalizedPath);
        }
      })
    );
  }

  await scan(dir);
  return results;
}

/**
 * Core orchestration logic executing parallel tree processing and delta calculation.
 * @returns {Promise<void>}
 */
async function run() {
  try {
    const [remotePayload, localFiles] = await Promise.all([
      fetchRemoteTree(API_ENDPOINT),
      walkDirectory(LOCAL_DIR)
    ]);

    if (!remotePayload || !Array.isArray(remotePayload.tree)) {
      throw new Error('Received malformed payload structure from GitHub API.');
    }

    const localFileSet = new Set(localFiles);
    const targetPrefix = `${LOCAL_DIR}/`;

    const missingFiles = remotePayload.tree.filter((item) => {
      return (
        item.type === 'blob' &&
        item.path.startsWith(targetPrefix) &&
        !localFileSet.has(item.path)
      );
    });

    await fs.writeFile(
      OUTPUT_FILE,
      JSON.stringify(missingFiles, null, 2),
      'utf8'
    );

    console.log(`Found ${missingFiles.length} missing files.`);
  } catch (err) {
    console.error(`[EMG Core Engine Error]: ${err.message}`);
    process.exitCode = 1;
  }
}

run();