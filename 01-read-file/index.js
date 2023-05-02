const fs = require('fs');
const path = require('path');


const fileName = 'text.txt';
const directory = path.join(__dirname, fileName);
const encode = 'utf-8'

fs.readFile(directory, encode, (err, data) => {
    if (err) {
        console.error(err?.message);
    }

    console.log(data);
})