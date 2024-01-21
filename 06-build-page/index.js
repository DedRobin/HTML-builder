const fs = require('fs/promises');
const path = require('path');

async function buildPage() {
  // Paths
  const projectDistPath = path.resolve(__dirname, 'project-dist');
  const templateHtmlPath = path.resolve(__dirname, 'template.html');
  const componentPath = path.resolve(__dirname, 'components');
  const copyHtmlPath = path.resolve(projectDistPath, 'index.html');
  const assetsPath = path.resolve(__dirname, 'assets');
  const projectAssetsPath = path.resolve(projectDistPath, 'assets');

  // Create 'project-dist' folder
  await fs.mkdir(projectDistPath, { recursive: true });

  // Receive template.html
  let template = (await fs.readFile(templateHtmlPath)).toString();

  // Read file names of page snippets
  const componentFiles = await fs.readdir(componentPath);

  // Include components to template
  await includeComponents(componentFiles, template, copyHtmlPath);

  // Bundle style.css
  await bundleStyles();

  // Copy assets
  await copyFiles(assetsPath, projectAssetsPath);
  // --------------------Functions--------------------

  async function includeComponents(componentFiles, template) {
    for (let componentFile of componentFiles) {
      // Path to specific component
      const specComponentPath = path.resolve(componentPath, componentFile);
      const component = (await fs.readFile(specComponentPath)).toString();

      // Get name of file
      const componentName = componentFile.split('.')[0];

      // Replace component variables to page snippets
      //   newTemplate = template.replace(`{{${componentName}}}`, component);
      template = template.replace(`{{${componentName}}}`, component);

      // Save page in index.html
      await fs.writeFile(copyHtmlPath, template);
    }
  }

  async function bundleStyles() {
    const pathToStyles = path.resolve(__dirname, 'styles');
    const pathToDist = path.resolve(__dirname, 'project-dist');

    // Create bundle file
    const fd = await fs.open(path.resolve(pathToDist, 'style.css'), 'w+');

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

  async function copyFiles(src, dest) {
    // Variables
    const pathToFiles = src;
    const pathToFilesCopy = dest;

    // Read files
    const files = await fs.readdir(pathToFiles, { withFileTypes: true });

    // Make folder even if it exists
    await fs.mkdir(pathToFilesCopy, { recursive: true });

    files.forEach(async (file) => {
      if (file.isFile()) {
        // Copy files
        await fs.copyFile(
          path.resolve(src, file.name),
          path.resolve(dest, file.name),
        );
      } else {
        // Follow next folder recursivly if current file is folder
        await copyFiles(
          path.resolve(src, file.name),
          path.resolve(dest, file.name),
        );
      }
    });
  }
}

buildPage();
