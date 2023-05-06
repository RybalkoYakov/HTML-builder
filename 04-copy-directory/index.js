const { mkdir, readdir, copyFile } = require('fs/promises');
const path = require('path');

(async () => {
  const folderName = 'files';
  const folderMod = 'copy';

  const pathToRead = path.join(__dirname, folderName);
  const pathToWrite = path.join(__dirname, `${folderName}-${folderMod}`);


  await mkdir(pathToWrite, {recursive: true});

  const files = await readdir(pathToRead, {withFileTypes: true});

  for (const file of files) {
    const sourceFile = path.join(pathToRead, file.name);
    const destFile = path.join(pathToWrite, file.name);

    copyFile(sourceFile, destFile);
  }
})()