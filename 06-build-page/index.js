const fs = require('node:fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const path = require('node:path');

const DIST_PATH = path.resolve(__dirname, 'project-dist');

async function createDistFolder() {
  await fs.mkdir(DIST_PATH, { recursive: true });
  await fs.mkdir(path.resolve(DIST_PATH, 'assets'), { recursive: true });
  await fs.copyFile(
    path.resolve(__dirname, 'template.html'),
    path.resolve(DIST_PATH, 'index.html'),
  );
}

async function buildIndex() {
  const buffer = await fs.readFile(path.resolve(DIST_PATH, 'index.html'));
  let template = buffer.toString();

  const components = await fs.readdir(path.resolve(__dirname, 'components'));

  await Promise.all(
    components.map(async (filename) => {
      const content = await fs.readFile(
        path.resolve(__dirname, 'components', filename),
      );
      template = template.replace(
        `{{${filename.split('.')[0]}}}`,
        content.toString(),
      );
    }),
  );
  await fs.writeFile(path.resolve(DIST_PATH, 'index.html'), template);
}

async function mergeStyles() {
  // const readable = createReadStream
  const writable = createWriteStream(path.resolve(DIST_PATH, 'style.css'));

  const styles = await fs.readdir(path.resolve(__dirname, 'styles'));
  await Promise.all(
    styles.map(async (style) => {
      const content = await fs.readFile(
        path.resolve(__dirname, 'styles', style),
      );
      writable.write(content.toString());
    }),
  );
}

async function copyAssets(assetPath) {
  const assets = await fs.readdir(assetPath, { withFileTypes: true });

  await Promise.all(
    assets.map(async (asset) => {
      if (asset.isFile()) {
        const src = path.resolve(assetPath, asset.name);
        const dist = path.resolve(
          DIST_PATH,
          'assets',
          assetPath.split('assets\\').at(-1),
          asset.name,
        );
        fs.copyFile(src, dist);
      } else {
        const newAssetPath = path.resolve(assetPath, asset.name);
        await fs.mkdir(path.resolve(DIST_PATH, 'assets', asset.name), {
          recursive: true,
        });
        await copyAssets(newAssetPath);
      }
    }),
  );
}
async function buildPage() {
  await createDistFolder();
  await buildIndex();
  await mergeStyles();
  await copyAssets(path.resolve(__dirname, 'assets'));
}

buildPage();
