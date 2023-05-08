const { mkdir, readdir, copyFile, unlink, rmdir} = require('fs/promises');
const path = require('path');

/**
 * Removes the folder with all attached files and folders.
 * This is reusable function in the context of this task(to be used by the 06-build-page task),
 * so commented out to make it clearer and also to practice commenting correctly.
 * Plus I add a some kind of typing to the vanilla js, plus I train my English )))).
 *
 * @param node {PathLike | string}
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
   * Returns if nothing to delete
   */
  if (!nodes.some(value => value === pathInfo.name)) return;

  /**
   * Scan directory's nodes
   * @type {Dirent[]}
   */
  const files = await readdir(node, {withFileTypes: true});

  /**
   * Delete all nodes in the directory
   */
  for (const file of files) {
    if (file.isFile()) {
      await unlink(path.join(node, file.name));
    } else {
      await removeDirectory(path.join(node, file.name));
      await rmdir(path.join(node, file.name));
    }
  }
}

(async () => {
  const folderName = 'files';
  const folderMod = 'copy';

  const pathToRead = path.join(__dirname, folderName);
  const pathToWrite = path.join(__dirname, `${folderName}-${folderMod}`);

  const files = await readdir(pathToRead, {withFileTypes: true});

  await removeDirectory(pathToWrite);
  await mkdir(pathToWrite, {recursive: true});

  for (const file of files) {
    const sourceFile = path.join(pathToRead, file.name);
    const destFile = path.join(pathToWrite, file.name);

    await copyFile(sourceFile, destFile);
  }
})();

module.exports = { removeDirectory }