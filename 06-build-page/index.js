const { readdir, readFile, writeFile, mkdir, copyFile} = require('fs/promises');
const path = require('path');

const {removeDirectory} = require("../04-copy-directory");

/**
 * Production directory path
 * @type {PathLike | URL}
 */
const output = path.join(__dirname, 'project-dist');

/**
 * Generate final template accordingly to component's templates
 * @param pathDir {PathLike | string}
 * @returns {Promise<void>}
 */
async function generateTemplate(pathDir) {
    /**
     * Extension of component's template
     * @type {string}
     */
    const extension = '.html';

    /**
     * Component's template files
     * @type {Dirent[]}
     */
    const components = await readdir(pathDir, {withFileTypes: true});

    /**
     * Map for replacing regular expression
     * @type {Map<any, any>}
     */
    const componentsMap = new Map();

    /**
     * Main template
     * @type {string}
     */
    const template = await readFile(path.join(__dirname, 'template.html'), "utf8");

    /**
     * Regular expression related angular replacer
     * @type {RegExp}
     */
    const replacer = /\{\{(.*?)}}/g;

    for (const component of components) {
        const name = path.basename(path.join(pathDir, component.name), extension);
        const componentTemplate = await readFile(path.join(pathDir, component.name), "utf8");
        componentsMap.set(name, componentTemplate);
    }

    /**
     * Modified template
     * @type {string}
     */
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
    const info = path.parse(readPath);
    const { dirName } = info; // the name of the directory to be copied;
    await removeDirectory(path.join(writePath, dirName));


    // TODO DEEP COPY
}

async function bundle() {
    const template = await generateTemplate(path.join(__dirname, 'components'));
    await removeDirectory(output);
    await mkdir(output, {recursive: true});
    await writeFile(path.join(output, 'index.html'), template);

    await generateStyles(path.join(__dirname, 'styles'));
    await deepCopyFolder(path.join(__dirname, 'assets'), output);
}

bundle();

module.exports = { deepCopyFolder }