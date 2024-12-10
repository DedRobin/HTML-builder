const fs = require('fs');
const path = require('node:path');

const readable = fs.createReadStream(path.resolve(__dirname, './text.txt'));
readable.on('data', (chunck) => {
  console.log(chunck.toString());
});
