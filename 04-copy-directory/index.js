const { mkdir, readdir, copyFile, unlink, rmdir, readFile} = require('fs/promises');
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
