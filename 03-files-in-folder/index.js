const fs = require('node:fs/promises');
const path = require('node:path');

const FOLDER_PATH = path.resolve(__dirname, 'secret-folder');

async function getFileList() {
  const files = await fs.readdir(FOLDER_PATH, { withFileTypes: true });

  Promise.all(
    files.map(async (file) => {
      if (file.isFile()) {
        const stats = await fs.stat(path.resolve(FOLDER_PATH, file.name));
        const [name, ext] = file.name.split('.');
        const size = stats.size / 1000;
        return `${name}-${ext}-${size}kb`;
      }
    }),
  ).then((files) => console.log(files.join('\n')));
}

getFileList();
