const https = require('https');
const fs = require('fs');
const path = require('path');

const REPOSITORY_CONFIG = Object.freeze({
  owner: 'craighckby-stack',
  repo: 'DARLEK_CAAN_ENGINE',
  branch: 'main',
  targetDirectoryFilter: 'src/',
  userAgent: 'node.js'
});

/**
 * Performs an HTTPS GET request and resolves with the response body.
 * @param {string} url - Target URL.
 * @returns {Promise<string>} Response body payload.
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 'User-Agent': REPOSITORY_CONFIG.userAgent }
    };

    https.get(url, options, (res) => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => resolve(rawData));
    }).on('error', reject);
  });
}

/**
 * Downloads and persists a single file from the remote repository.
 * @param {Object} fileNode - Git tree file node metadata.
 * @returns {Promise<void>}
 */
async function restoreFile(fileNode) {
  const destinationPath = fileNode.path;
  const targetDir = path.dirname(destinationPath);
  
  fs.mkdirSync(targetDir, { recursive: true });

  const rawFileUrl = `https://raw.githubusercontent.com/${REPOSITORY_CONFIG.owner}/${REPOSITORY_CONFIG.repo}/${REPOSITORY_CONFIG.branch}/${destinationPath}`;
  
  try {
    const fileContent = await fetchUrl(rawFileUrl);
    fs.writeFileSync(destinationPath, fileContent);
  } catch (error) {
    console.error(`Failed to restore file: ${destinationPath}`, error.message);
  }
}

/**
 * Sequentially restores an array of source files to maintain clean I/O order.
 * @param {Object[]} files - Array of file nodes to restore.
 * @returns {Promise<void>}
 */
async function restoreFilesSequentially(files) {
  for (const [index, file] of files.entries()) {
    process.stdout.write(`[${index + 1}/${files.length}] Restoring: ${file.path}\r`);
    await restoreFile(file);
  }
  console.log('\nALL RESTORED!');
}

/**
 * Orchestrates the repository restoration process.
 */
async function main() {
  const { owner, repo, branch, targetDirectoryFilter } = REPOSITORY_CONFIG;
  const treeApiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

  try {
    console.log(`Fetching repository tree for ${repo}...`);
    const treeJsonResponse = await fetchUrl(treeApiUrl);
    const parsedTree = JSON.parse(treeJsonResponse).tree;

    if (!parsedTree || !Array.isArray(parsedTree)) {
      throw new Error('No valid git tree found in response.');
    }

    const srcFiles = parsedTree.filter(node => 
      node.type === 'blob' && node.path.startsWith(targetDirectoryFilter)
    );

    console.log(`Restoring ${srcFiles.length} files from ${repo} (${targetDirectoryFilter})...`);
    await restoreFilesSequentially(srcFiles);
  } catch (error) {
    console.error('Repository restoration failed:', error.message);
    process.exit(1);
  }
}

main();