const fs = require('fs');
const path = require('node:path');
const process = require('node:process');

const filename = 'text.txt';
const writable = fs.createWriteStream(path.resolve(__dirname, filename));

console.log('->> Welcome! Type text:');

process.stdin.on('data', (chunk) => {
  const isExit = chunk.toString().toLocaleLowerCase().trim() === 'exit';
  if (isExit) {
    console.log(
      `--> Commdand 'exit'. Data has been stored in '${filename}' file.`,
    );
    process.exit();
  }
  writable.write(chunk);
});

process.on('SIGINT', () => {
  console.log(
    `--> The process has been interrupted by shortcut CTRL + C. Please, check the data in '${filename}' file.`,
  );
  process.exit();
});
