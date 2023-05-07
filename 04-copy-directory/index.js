const { mkdir, readdir, copyFile, unlink, rmdir, readFile, access, stat} = require('fs/promises');
const { constants } = require('fs');
const path = require('path');

(async () => {
  const folderName = 'files';
  const folderMod = 'copy';

  const pathToRead = path.join(__dirname, folderName);
  const pathToWrite = path.join(__dirname, `${folderName}-${folderMod}`);

  await mkdir(pathToWrite, {recursive: true});

  const files = await readdir(pathToRead, {withFileTypes: true});

  await removeDirectory(pathToWrite)

  for (const file of files) {
    const sourceFile = path.join(pathToRead, file.name);
    const destFile = path.join(pathToWrite, file.name);

    await copyFile(sourceFile, destFile);
  }
})()

/**
 * Removes directory with all files and directories
 * @param node {URL | PathLike}
 * @returns {Promise<void>}
 */
async function removeDirectory(node) {

  /**
   * Supporting object to check for the existence of the folder
   * @type {ParsedPath}
   */
  const pathInfo = path.parse(node);

  /**
   * Array of parent node's nodes
   * @type {string[]}
   */
  const nodes = await readdir(pathInfo.dir);

  /**
   * Returns undefined if nothing to delete
   */
  if (!nodes.some(value => value === pathInfo.name)) return;

  const files = await readdir(node, {withFileTypes: true});

  for (const file of files) {
    if (file.isFile()) {
      await unlink(path.join(node, file.name));
    } else {
      await removeDirectory(path.join(node, file.name));
      await rmdir(path.join(node, file.name));
    }
  }
}

module.exports = { removeDirectory }
