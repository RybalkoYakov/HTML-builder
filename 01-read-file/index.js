const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
const options = {encoding: 'utf-8'};

const rs = fs.createReadStream(filePath, options);
rs.pipe(process.stdout);