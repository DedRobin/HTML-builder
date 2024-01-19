const fs = require('fs/promises');
const path = require('path');

async function bundleStyles() {
  const pathToStyles = path.resolve(__dirname, 'styles');
  const pathToDist = path.resolve(__dirname, 'project-dist');

  // Create bundle file
  const fd = await fs.open(path.resolve(pathToDist, 'bundle.css'), 'w+');

  // Read styles
  let styles = await fs.readdir(pathToStyles);

  // Leave only files with css-extension
  styles = styles.filter((style) => path.extname(style) === '.css');

  styles.forEach(async (file) => {
    // Retrive data from file
    const buffer = await fs.readFile(path.resolve(pathToStyles, file));

    // Write data to bundle file
    await fd.appendFile(buffer.toString());
  });
}

bundleStyles();
