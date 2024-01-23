const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, './text.txt');
const { stdin, stdout } = process;

function sayGoodbuy() {
  stdout.write('Good luck learning Node.js!');
}

const greetings = `
Greetings!
Enter a text that you want to write to file: 
`;

// output 'greetings' message to console
stdout.write(greetings);

// subcribe to ...
process.on('exit', sayGoodbuy); // ... enter 'exit'
process.on('SIGINT', () => process.exit()); //  ... ctrl + c

// subscribe to any data entry
stdin.on('data', (chunk) => {
  if (chunk.toString().trimEnd() === 'exit') {
    // terminate programm if message = 'exit'
    process.exit();
  } else {
    // write data to file
    fs.appendFile(filePath, chunk, (err) => {
      if (err) throw err;
    });
  }
});
