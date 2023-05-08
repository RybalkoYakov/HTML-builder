const fs = require('fs');
const path = require('path');

const fileName = "text.txt";
const filePath = path.join(__dirname, fileName);
const options = { encoding: 'utf-8' };
const exitCommands = ['exit'];

const ws = fs.createWriteStream(filePath, options);

const farewell = () => {
  process.stdout.write('Good By My Friend.');
  process.exit(0);
}

/**
 * Greet and set some initial options
 */
process.stdout.write('Enter some text:\n');
process.stdin.setEncoding(options.encoding);

process.stdin.on('data', (data) => {
  if (exitCommands.some(value => value === data.toString().trim())) farewell();
})

process.on('SIGINT', () => {
  farewell();
})

process.stdin.pipe(ws);