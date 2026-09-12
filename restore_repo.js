/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: restore_repo.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const https = require('https');
const fs = require('fs/promises');
const path = require('path');

/**
 * @typedef {Object} RepositoryConfig
 * @property {string} owner
 * @property {string} repo
 * @property {string} branch
 * @property {string} targetDirectoryFilter
 * @property {string} userAgent
 */

/**
 * @typedef {Object} FileNode
 * @property {string} path
 * @property {string} type
 * @property {string} [sha]
 * @property {number} [size]
 * @property {string} [url]
 */

/** @type {RepositoryConfig} */
const REPOSITORY_CONFIG = Object.freeze({
  owner: 'craighckby-stack',
  repo: 'DARLEK_CAAN_ENGINE',
  branch: 'main',
  targetDirectoryFilter: 'src/',
  userAgent: 'node.js'
});

/**
 * Performs an HTTPS GET request with pre-allocated buffer sizing and strict error boundaries.
 * @param {string} url - Target URL.
 * @returns {Promise<string>} Response body payload.
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': REPOSITORY_CONFIG.userAgent } }, (res) => {
      const statusCode = res.statusCode || 500;
      if (statusCode >= 400) {
        res.resume();
        return reject(new Error(`Request failed with status code ${statusCode}`));
      }

      /** @type {Buffer[]} */
      const chunks = [];
      let totalLength = 0;

      res.on('data', (chunk) => {
        chunks.push(chunk);
        totalLength += chunk.length;
      });

      res.on('end', () => {
        try {
          const payload = Buffer.concat(chunks, totalLength).toString('utf8');
          resolve(payload);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

/**
 * Downloads and persists a single file from the remote repository efficiently.
 * @param {FileNode} fileNode - Git tree file node metadata.
 * @returns {Promise<void>}
 */
async function restoreFile(fileNode) {
  const destinationPath = fileNode.path;
  
  try {
    const absoluteDestination = path.resolve(destinationPath);
    await fs.mkdir(path.dirname(absoluteDestination), { recursive: true });
    
    const rawFileUrl = `https://raw.githubusercontent.com/${REPOSITORY_CONFIG.owner}/${REPOSITORY_CONFIG.repo}/${REPOSITORY_CONFIG.branch}/${destinationPath}`;
    const fileContent = await fetchUrl(rawFileUrl);
    
    await fs.writeFile(absoluteDestination, fileContent, 'utf8');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`\nFailed to restore file: ${destinationPath}`, errorMessage);
  }
}

/**
 * Sequentially restores an array of source files with minimized overhead.
 * @param {FileNode[]} files - Array of file nodes to restore.
 * @returns {Promise<void>}
 */
async function restoreFilesSequentially(files) {
  const totalFiles = files.length;
  for (let i = 0; i < totalFiles; ++i) {
    process.stdout.write(`[${i + 1}/${totalFiles}] Restoring: ${files[i].path}\r`);
    await restoreFile(files[i]);
  }
  console.log('\nALL RESTORED!');
}

/**
 * Orchestrates the repository restoration process with zero-redundancy parsing and strict memory safety.
 * @returns {Promise<void>}
 */
async function main() {
  const { owner, repo, branch, targetDirectoryFilter } = REPOSITORY_CONFIG;
  const treeApiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

  try {
    console.log(`Fetching repository tree for ${repo}...`);
    const treeJsonResponse = await fetchUrl(treeApiUrl);
    
    let parsedTree;
    try {
      parsedTree = JSON.parse(treeJsonResponse).tree;
    } catch {
      throw new Error('Failed to parse repository tree JSON response.');
    }

    if (!Array.isArray(parsedTree)) {
      throw new Error('No valid git tree found in response.');
    }

    /** @type {FileNode[]} */
    const srcFiles = [];
    for (let i = 0, len = parsedTree.length; i < len; ++i) {
      const node = parsedTree[i];
      if (node && node.type === 'blob' && typeof node.path === 'string' && node.path.startsWith(targetDirectoryFilter)) {
        srcFiles.push(node);
      }
    }

    console.log(`Restoring ${srcFiles.length} files from ${repo} (${targetDirectoryFilter})...`);
    await restoreFilesSequentially(srcFiles);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Repository restoration failed:', errorMessage);
    process.exit(1);
  }
}

main();