const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
const options = {encoding: 'utf-8'};

const readStream = fs.createReadStream(filePath, options);

readStream.on("data", (chunk) => {
    console.log(chunk.toString());
});