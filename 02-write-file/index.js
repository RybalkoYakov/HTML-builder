const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fileName = "text.txt";
const filePath = path.join(__dirname, fileName);

fs.writeFile(filePath, '', () => {

})

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readlineInterface.on('data', (chunk) => {
    console.log(chunk);
});