const { readdir, stat } = require('fs/promises');
const path = require('path');

const dirToRead = path.join(__dirname, 'secret-folder');
const options = {encoding: 'utf8', withFileTypes: true};

(async function filesInFolder() {
  const files = await readdir(dirToRead, options);
  for (const file of files) {
    const filePath = path.join(dirToRead, file.name);
    const fileName = path.parse(filePath).name;
    const fileExt = path.extname(filePath).replace('.', '');

    const fileStat = await stat(filePath);
    const fileSizeKb = (fileStat.size / 1024).toFixed(3).toString() + 'Kb';

    if (file.isFile()) process.stdout.write(`${fileName} - ${fileExt} - ${fileSizeKb}\n`);
  }
})();