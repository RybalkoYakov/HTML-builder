const { readdir, readFile, writeFile, mkdir, copyFile} = require('fs/promises');
const path = require('path');

const { removeDirectory }  = require("../04-copy-directory");

/**
 * Production directory path
 */
const output = path.join(__dirname, 'project-dist');

/**
 * Generate final template accordingly to component's templates
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
        }
    });

    return new Promise((resolve, reject) => {
        try {
            resolve(modified)
        } catch (err) {
            reject(err)
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
    await removeDirectory(writePath);
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

async function bundle() {
    const template = await getFinalTemplate(path.join(__dirname, 'components'));
    await removeDirectory(output);
    await mkdir(output, {recursive: true});
    await writeFile(path.join(output, 'index.html'), template);
    await generateStyles(path.join(__dirname, 'styles'));
    await deepCopyFolder(path.join(__dirname, 'assets'), path.join(output, 'assets'));
}

bundle().then(() => {
    process.stdout.write('Bundle ready.')
});