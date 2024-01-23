const fs = require('fs/promises');
const path = require('path');

async function copyFiles() {
  // Paths
  const pathToFiles = path.resolve(__dirname, 'files');
  const pathToFilesCopy = path.resolve(__dirname, 'files-copy');

  // Remove copy folder if it it exists
  await fs.rm(pathToFilesCopy, { recursive: true, force: true });

  // Read files
  const files = await fs.readdir(pathToFiles);

  // Make folder even if it exists
  await fs.mkdir(pathToFilesCopy, { recursive: true });

  //   Copy each file
  files.forEach(async (file) => {
    await fs.copyFile(
      path.resolve(pathToFiles, file),
      path.resolve(pathToFilesCopy, file),
    );
  });
}

copyFiles();
