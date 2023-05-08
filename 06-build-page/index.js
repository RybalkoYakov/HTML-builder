const { readdir, readFile, writeFile, mkdir, copyFile, unlink, rmdir} = require('fs/promises');
const path = require('path');

/**
 * Production directory path
 */
const output = path.join(__dirname, 'project-dist');

/**
 * Generate final template according to component's templates
 * @param pathDir {PathLike | string}
 * @returns {Promise<void>}
 */
async function getFinalTemplate(pathDir) {
  const extension = '.html';
  const components = await readdir(pathDir, {withFileTypes: true});
  const componentsMap = new Map();

  for (const component of components) {
    const name = path.basename(path.join(pathDir, component.name), extension);
    const componentTemplate = await readFile(path.join(pathDir, component.name), "utf8");
    componentsMap.set(name, componentTemplate);
  }

  const template = await readFile(path.join(__dirname, 'template.html'), "utf8");
  const replacer = /\{\{(.*?)}}/g;

  const modified = template.replace(replacer, (substring, args) => {
    if (componentsMap.has(args)) {
      return componentsMap.get(args);
    } else {
      return '';
    }
  });

  return new Promise((resolve, reject) => {
    try {
      resolve(modified);
    } catch (err) {
      reject(err);
    }
  })
}

async function generateStyles(pathDir) {
  const files = await readdir(pathDir, {withFileTypes: true});
  const extension = '.css';
  const outputFileName = 'style';
  const outputPath = path.join(output, outputFileName + extension);

  const data = [];
  for (const file of files) {
    const fileExtension = path.extname(path.join(pathDir, file.name));

    if (file.isFile() && fileExtension === extension) {
      const content = await readFile(path.join(pathDir, file.name));
      data.push(content);
    }
  }

  await writeFile(outputPath, data.join('\n'), {encoding: "utf8"});
}

async function deepCopyFolder(readPath, writePath) {
  await deepRemoveFolder(writePath);
  await mkdir(writePath);

  const nodes = await readdir(readPath, {withFileTypes: true});

  for (const node of nodes) {
    if (node.isDirectory()) {
      await deepCopyFolder(path.join(readPath, node.name), path.join(writePath, node.name));
    } else {
      await copyFile(path.join(readPath, node.name), path.join(writePath, node.name));
    }
  }
}

async function deepRemoveFolder(node) {
  const pathInfo = path.parse(node);
  const nodes = await readdir(pathInfo.dir);
  if (!nodes.some(value => value === pathInfo.name)) return;

  const files = await readdir(node, {withFileTypes: true});

  for (const file of files) {
    if (file.isFile()) {
      await unlink(path.join(node, file.name));
    } else {
      await deepRemoveFolder(path.join(node, file.name));
      await rmdir(path.join(node, file.name));
    }
  }
}

async function bundle() {
  const template = await getFinalTemplate(path.join(__dirname, 'components'));
  await deepRemoveFolder(output);
  await mkdir(output, {recursive: true});
  await writeFile(path.join(output, 'index.html'), template);

  await generateStyles(path.join(__dirname, 'styles'));

  await deepCopyFolder(path.join(__dirname, 'assets'), path.join(output, 'assets'));
}

bundle().then(() => {
  process.stdout.write('Bundle ready.');
});