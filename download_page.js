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

// Strict validation regex for cryptographic SHA-1/SHA-256 hex strings to prevent injection/path traversal
if (!/^[a-fA-F0-9]{40}$/.test(COMMIT_SHA)) {
  throw new Error('CRITICAL SECURITY: Invalid COMMIT_SHA format detected.');
}

const TARGET_URL = `https://raw.githubusercontent.com/craighckby-stack/DARLEK_CAAN_ENGINE/${COMMIT_SHA}/src/app/page.tsx`;
const TARGET_PATH = path.resolve('src/app/page.tsx');
const MIN_LINE_COUNT_THRESHOLD = 1000;
const MAX_CONTENT_LENGTH = 10 * 1024 * 1024; // 10MB defensive upper bound to prevent resource exhaustion / DoS

console.log(`Downloading page.tsx from commit ${COMMIT_SHA}...`);

/**
 * Performs an HTTPS GET request wrapped in a Promise interface with memory-efficient chunk buffering, status checks, and bounds enforcement.
 * @param {string} requestUrl - The HTTPS endpoint URL to fetch data from.
 * @returns {Promise<string>} The retrieved response body as a string.
 */
function fetchContent(requestUrl) {
  return new Promise((resolve, reject) => {
    // Strict URL validation against expected domain structure
    let parsedUrl;
    try {
      parsedUrl = new URL(requestUrl);
    } catch (err) {
      return reject(new Error('Invalid URL format supplied to fetchContent.'));
    }

    if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname !== 'raw.githubusercontent.com') {
      return reject(new Error('Security violation: Untrusted domain or protocol in request URL.'));
    }

    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'DARLEK-CANN-Optimizer/4.9'
      }
    };

    const req = https.request(options, (res) => {
      const { statusCode } = res;

      if (statusCode !== 200) {
        res.resume(); // Consume response stream to prevent memory leakage
        return reject(new Error(`Server returned HTTP status ${statusCode}`));
      }

      res.setEncoding('utf8');
      const chunks = [];
      let totalLength = 0;

      res.on('data', (chunk) => {
        totalLength += chunk.length;
        if (totalLength > MAX_CONTENT_LENGTH) {
          res.destroy();
          return reject(new Error('Security limit exceeded: Response payload exceeds maximum safety threshold.'));
        }
        chunks.push(chunk);
      });

      res.on('end', () => {
        resolve(chunks.join(''));
      });

      res.on('error', (err) => {
        reject(err);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

/**
 * Main execution routine handling file download, verification, and filesystem operations with strict path normalization.
 * @returns {Promise<void>}
 */
async function executeDownloadPipeline() {
  try {
    const data = await fetchContent(TARGET_URL);
    const lines = data.split('\n');

    console.log(`Downloaded ${lines.length} lines. First 5 lines:`);
    console.log(lines.slice(0, 5).join('\n'));

    if (lines.length > MIN_LINE_COUNT_THRESHOLD) {
      const targetDirectory = path.dirname(TARGET_PATH);
      
      // Ensure target path is safely contained within intended workspace boundary
      const baseWorkspace = path.resolve('.');
      if (!TARGET_PATH.startsWith(baseWorkspace)) {
        throw new Error('Security violation: Target path escapes root workspace directory.');
      }

      if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true });
      }

      fs.writeFileSync(TARGET_PATH, data, 'utf8');
      console.log(`Successfully restored ${TARGET_PATH} from commit ${COMMIT_SHA.slice(0, 8)}!`);
    } else {
      console.log(`Warning: Downloaded file has less than ${MIN_LINE_COUNT_THRESHOLD} lines, did not overwrite local file.`);
    }
  } catch (err) {
    const errorMessage = err && typeof err === 'object' && 'message' in err ? err.message : String(err);
    console.error("Error downloading file:", errorMessage);
  }
}

executeDownloadPipeline();