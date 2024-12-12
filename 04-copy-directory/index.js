const fs = require('node:fs/promises');
const path = require('node:path');

const copyPath = path.resolve(__dirname, 'files-copy');
const filesPath = path.resolve(__dirname, 'files');

fs.mkdir(copyPath, { recursive: true })
  .then(() => fs.readdir(filesPath, { withFileTypes: true }))
  .then((files) =>
    Promise.all(
      files.map((file) => {
        if (file.isFile()) {
          const src = path.resolve(filesPath, file.name);
          const dest = path.resolve(copyPath, file.name);

          return fs.copyFile(src, dest);
        }
      }),
    ),
  );
