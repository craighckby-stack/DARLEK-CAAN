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
const SHA_REGEX = /^[a-fA-F0-9]{40}$/;

if (!SHA_REGEX.test(COMMIT_SHA)) {
  throw new Error('CRITICAL SECURITY: Invalid COMMIT_SHA format detected.');
}

const CONFIG = {
  targetUrl: `https://raw.githubusercontent.com/craighckby-stack/DARLEK_CAAN_ENGINE/${COMMIT_SHA}/src/app/page.tsx`,
  targetPath: path.resolve('src/app/page.tsx'),
  minLineCountThreshold: 1000,
  maxContentLength: 10 * 1024 * 1024 // 10MB defensive upper bound
};

/**
 * Validates and parses the request URL against allowed security parameters.
 * @param {string} requestUrl - The raw endpoint URL string.
 * @returns {URL} The parsed URL object.
 */
function validateAndParseUrl(requestUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(requestUrl);
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
 * @param {string} requestUrl - The HTTPS endpoint URL to fetch data from.
 * @returns {Promise<string>} The retrieved response body as a string.
 */
function fetchContent(requestUrl) {
  return new Promise((resolve, reject) => {
    let parsedUrl;
    try {
      parsedUrl = validateAndParseUrl(requestUrl);
    } catch (err) {
      return reject(err);
    }

    const requestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'DARLEK-CANN-Optimizer/4.9'
      }
    };

    const req = https.request(requestOptions, (res) => {
      const { statusCode } = res;

      if (statusCode !== 200) {
        res.resume();
        return reject(new Error(`Server returned HTTP status ${statusCode}`));
      }

      res.setEncoding('utf8');
      const chunks = [];
      let totalLength = 0;

      res.on('data', (chunk) => {
        totalLength += chunk.length;
        if (totalLength > CONFIG.maxContentLength) {
          res.destroy();
          return reject(new Error('Security limit exceeded: Response payload exceeds maximum safety threshold.'));
        }
        chunks.push(chunk);
      });

      res.on('end', () => resolve(chunks.join('')));
      res.on('error', reject);
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Ensures the target file path is securely contained within the workspace root directory.
 * @param {string} targetPath - The filesystem path to validate.
 */
function ensureWorkspaceContainment(targetPath) {
  const baseWorkspace = path.resolve('.');
  if (!targetPath.startsWith(baseWorkspace)) {
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
    const fileContent = await fetchContent(CONFIG.targetUrl);
    const lines = fileContent.split('\n');

    console.log(`Downloaded ${lines.length} lines. First 5 lines:`);
    console.log(lines.slice(0, 5).join('\n'));

    if (lines.length <= CONFIG.minLineCountThreshold) {
      console.log(`Warning: Downloaded file has less than ${CONFIG.minLineCountThreshold} lines, did not overwrite local file.`);
      return;
    }

    ensureWorkspaceContainment(CONFIG.targetPath);

    const targetDirectory = path.dirname(CONFIG.targetPath);
    if (!fs.existsSync(targetDirectory)) {
      fs.mkdirSync(targetDirectory, { recursive: true });
    }

    fs.writeFileSync(CONFIG.targetPath, fileContent, 'utf8');
    console.log(`Successfully restored ${CONFIG.targetPath} from commit ${COMMIT_SHA.slice(0, 8)}!`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Error downloading file:', errorMessage);
  }
}

executeDownloadPipeline();