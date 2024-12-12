const fs = require('node:fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const path = require('node:path');

const stylePath = path.resolve(__dirname, 'styles');

const filterFiles = (files) =>
  files.filter((file) => {
    const isFile = file.isFile();
    const isCSS = path.extname(file.name) === '.css';
    return isFile && isCSS;
  });

const mergeStyle = (styledFiles) => {
  const bundledPath = path.resolve(__dirname, 'project-dist', 'bundle.css');

  const writable = createWriteStream(bundledPath);

  styledFiles.forEach((file) => {
    const filePath = path.resolve(file.path, file.name);

    const readable = createReadStream(filePath);
    readable.on('data', (chunk) => {
      writable.write(chunk);
    });
  });
};

fs.readdir(stylePath, { withFileTypes: true })
  .then((files) => filterFiles(files))
  .then((styledFiles) => mergeStyle(styledFiles));
