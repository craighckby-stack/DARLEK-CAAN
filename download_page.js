/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: download_page.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const COMMIT_SHA = '71f4f383afa014a1255d977791d6531a2033e323';
const SHA_HASH_PATTERN = /^[a-fA-F0-9]{40}$/;

if (!SHA_HASH_PATTERN.test(COMMIT_SHA)) {
  throw new Error('CRITICAL SECURITY: Invalid COMMIT_SHA format detected.');
}

const SYSTEM_CONFIG = Object.freeze({
  targetUrl: `https://raw.githubusercontent.com/craighckby-stack/DARLEK_CAAN_ENGINE/${COMMIT_SHA}/src/app/page.tsx`,
  targetPath: path.resolve('src/app/page.tsx'),
  minLineCountThreshold: 1000,
  maxContentLength: 10 * 1024 * 1024 // 10MB defensive upper bound
});

/**
 * Validates and parses the request URL against allowed security parameters.
 * @param {string} rawRequestUrl - The raw endpoint URL string.
 * @returns {URL} The parsed URL object.
 */
function validateAndParseUrl(rawRequestUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(rawRequestUrl);
  } catch {
    throw new Error('Invalid URL format supplied to fetchContent.');
  }

  if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname !== 'raw.githubusercontent.com') {
    throw new Error('Security violation: Untrusted domain or protocol in request URL.');
  }

  return parsedUrl;
}

/**
 * Performs an HTTPS GET request wrapped in a Promise with stream buffering and safety bounds.
 * @param {string} rawRequestUrl - The HTTPS endpoint URL to fetch data from.
 * @returns {Promise<string>} The retrieved response body as a string.
 */
function fetchContent(rawRequestUrl) {
  return new Promise((resolve, reject) => {
    let parsedUrl;
    try {
      parsedUrl = validateAndParseUrl(rawRequestUrl);
    } catch (err) {
      return reject(err);
    }

    const requestOptions = Object.freeze({
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: Object.freeze({
        'User-Agent': 'DARLEK-CANN-Optimizer/4.9'
      })
    });

    const networkRequest = https.request(requestOptions, (responseStream) => {
      const { statusCode } = responseStream;

      if (statusCode !== 200) {
        responseStream.resume();
        return reject(new Error(`Server returned HTTP status ${statusCode}`));
      }

      responseStream.setEncoding('utf8');
      const responseChunks = [];
      let accumulatedLength = 0;

      responseStream.on('data', (chunk) => {
        accumulatedLength += chunk.length;
        if (accumulatedLength > SYSTEM_CONFIG.maxContentLength) {
          responseStream.destroy();
          return reject(new Error('Security limit exceeded: Response payload exceeds maximum safety threshold.'));
        }
        responseChunks.push(chunk);
      });

      responseStream.on('end', () => resolve(responseChunks.join('')));
      responseStream.on('error', reject);
    });

    networkRequest.on('error', reject);
    networkRequest.end();
  });
}

/**
 * Ensures the target file path is securely contained within the workspace root directory.
 * @param {string} targetFileSystemPath - The filesystem path to validate.
 */
function ensureWorkspaceContainment(targetFileSystemPath) {
  const baseWorkspaceDirectory = path.resolve('.');
  if (!targetFileSystemPath.startsWith(baseWorkspaceDirectory)) {
    throw new Error('Security violation: Target path escapes root workspace directory.');
  }
}

/**
 * Main execution routine handling file download, verification, and filesystem operations.
 * @returns {Promise<void>}
 */
async function executeDownloadPipeline() {
  try {
    console.log(`Downloading page.tsx from commit ${COMMIT_SHA}...`);
    const fileContent = await fetchContent(SYSTEM_CONFIG.targetUrl);
    const contentLines = fileContent.split('\n');

    console.log(`Downloaded ${contentLines.length} lines. First 5 lines:`);
    console.log(contentLines.slice(0, 5).join('\n'));

    if (contentLines.length <= SYSTEM_CONFIG.minLineCountThreshold) {
      console.log(`Warning: Downloaded file has less than ${SYSTEM_CONFIG.minLineCountThreshold} lines, did not overwrite local file.`);
      return;
    }

    ensureWorkspaceContainment(SYSTEM_CONFIG.targetPath);

    const targetDirectory = path.dirname(SYSTEM_CONFIG.targetPath);
    if (!fs.existsSync(targetDirectory)) {
      fs.mkdirSync(targetDirectory, { recursive: true });
    }

    fs.writeFileSync(SYSTEM_CONFIG.targetPath, fileContent, 'utf8');
    console.log(`Successfully restored ${SYSTEM_CONFIG.targetPath} from commit ${COMMIT_SHA.slice(0, 8)}!`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error downloading file:', errorMessage);
  }
}

executeDownloadPipeline();