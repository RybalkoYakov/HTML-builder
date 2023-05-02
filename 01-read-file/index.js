const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
const options = {encoding: 'utf-8'};

let message = '';

const readStream = fs.createReadStream(filePath, options);

readStream.on("data", (chunk) => {
    if(chunk) {
        message += chunk;
    }
    process.stdout.write(message);
});