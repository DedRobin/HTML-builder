const fs = require('fs');
const path = require('path');
const readable = fs.createReadStream(path.resolve(__dirname, './text.txt'));
readable.on('data', (chunk) => {
  console.log(chunk.toString());
});
