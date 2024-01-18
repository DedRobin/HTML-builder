const fs = require('fs');
const path = require('path');

const folderPath = path.resolve(__dirname, 'secret-folder');

function getFileInfo() {
  fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (file.isFile()) {
          const [name, extension] = file.name.split('.');
          const size = fs.statSync(path.resolve(folderPath, file.name)).size;
          console.log(`${name} - ${extension} - ${size}kb`);
        }
      });
    }
  });
}

getFileInfo();
