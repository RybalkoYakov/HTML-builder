const fs = require('fs');
const path = require('path');

const fileName = "text.txt";
const filePath = path.join(__dirname, fileName);
const options = {encoding: 'utf-8'}

const ws = fs.createWriteStream(filePath, options);

process.stdout.write('Enter some text: ');
process.stdin.setEncoding(options.encoding);

process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.stdout.write('\nGood By My Friend.');
    process.exit(0);
  }
})

process.on('SIGINT', () => {
  process.stdout.write('\nGood By My Friend.')
  process.exit(0);
})

process.stdin.pipe(ws)