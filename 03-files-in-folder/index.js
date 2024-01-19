const fs = require('fs/promises');
const path = require('path');

const folderPath = path.resolve(__dirname, 'secret-folder');

async function getFileInfo() {
  const files = await fs.readdir(folderPath, { withFileTypes: true });
  files.forEach(async (file) => {
    if (file.isFile()) {
      const [name, extension] = file.name.split('.');
      const stats = await fs.stat(path.resolve(folderPath, file.name));
      console.log(`${name} - ${extension} - ${stats.size}kb`);
    }
  });
}

getFileInfo();
