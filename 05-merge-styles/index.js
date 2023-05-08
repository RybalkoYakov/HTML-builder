const { readdir, readFile, writeFile } = require('fs/promises');
const path = require('path');

(async () => {
  const bundleName = 'bundle';
  const extension = '.css';

  const entryDir = path.join(__dirname, 'styles');
  const outputDir = path.join(__dirname, 'project-dist');

  const files = await readdir(entryDir, {withFileTypes: true});

  const filesData = [];

  for (const file of files) {
    const fileExt = path.extname(path.join(entryDir, file.name));
    if (file.isFile() && fileExt === extension) {
      const data = await readFile(path.join(entryDir, file.name), {encoding: 'utf8'});
      filesData.push(data);
    }
  }

  await writeFile(path.join(outputDir, `${bundleName}${extension}`), filesData.join('\n'), {encoding: "utf8"});
  process.stdout.write(`${bundleName}${extension} file is ready.`);
})()