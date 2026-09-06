const https = require('https');
const fs = require('fs/promises');
const path = require('path');

const REPOSITORY_CONFIG = Object.freeze({
  owner: 'craighckby-stack',
  repo: 'DARLEK_CAAN_ENGINE',
  branch: 'main',
  targetDirectoryFilter: 'src/',
  userAgent: 'node.js'
});

/**
 * Performs an optimized HTTPS GET request with pre-allocated buffer sizing.
 * @param {string} url - Target URL.
 * @returns {Promise<string>} Response body payload.
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': REPOSITORY_CONFIG.userAgent } }, (res) => {
      if (res.statusCode >= 400) {
        res.resume();
        return reject(new Error(`Request failed with status code ${res.statusCode}`));
      }

      const chunks = [];
      let totalLength = 0;

      res.on('data', chunk => {
        chunks.push(chunk);
        totalLength += chunk.length;
      });

      res.on('end', () => {
        resolve(Buffer.concat(chunks, totalLength).toString('utf8'));
      });
    }).on('error', reject);
  });
}

/**
 * Downloads and persists a single file from the remote repository efficiently.
 * @param {Object} fileNode - Git tree file node metadata.
 * @returns {Promise<void>}
 */
async function restoreFile(fileNode) {
  const destinationPath = fileNode.path;
  
  try {
    await fs.mkdir(path.dirname(destinationPath), { recursive: true });
    const rawFileUrl = `https://raw.githubusercontent.com/${REPOSITORY_CONFIG.owner}/${REPOSITORY_CONFIG.repo}/${REPOSITORY_CONFIG.branch}/${destinationPath}`;
    const fileContent = await fetchUrl(rawFileUrl);
    await fs.writeFile(destinationPath, fileContent, 'utf8');
  } catch (error) {
    console.error(`\nFailed to restore file: ${destinationPath}`, error.message);
  }
}

/**
 * Sequentially restores an array of source files with minimized overhead.
 * @param {Object[]} files - Array of file nodes to restore.
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
 * Orchestrates the repository restoration process with zero-redundancy parsing.
 */
async function main() {
  const { owner, repo, branch, targetDirectoryFilter } = REPOSITORY_CONFIG;
  const treeApiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

  try {
    console.log(`Fetching repository tree for ${repo}...`);
    const treeJsonResponse = await fetchUrl(treeApiUrl);
    const parsedTree = JSON.parse(treeJsonResponse).tree;

    if (!Array.isArray(parsedTree)) {
      throw new Error('No valid git tree found in response.');
    }

    const srcFiles = [];
    for (let i = 0, len = parsedTree.length; i < len; ++i) {
      const node = parsedTree[i];
      if (node.type === 'blob' && node.path.startsWith(targetDirectoryFilter)) {
        srcFiles.push(node);
      }
    }

    console.log(`Restoring ${srcFiles.length} files from ${repo} (${targetDirectoryFilter})...`);
    await restoreFilesSequentially(srcFiles);
  } catch (error) {
    console.error('Repository restoration failed:', error.message);
    process.exit(1);
  }
}

main();