const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'data');
const imagesDir = path.join(__dirname, '..', 'images');

const categories = [
  { key: 'sport', dir: path.join(imagesDir, 'sport') },
  { key: 'person', dir: path.join(imagesDir, 'person') },
  { key: 'nature', dir: path.join(imagesDir, 'nature') }
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(outDir);
ensureDir(imagesDir);
categories.forEach(c => ensureDir(c.dir));

const galleries = {};

categories.forEach(cat => {
  let items = [];
  try {
    items = fs.readdirSync(cat.dir)
      .filter(f => f.match(/\.(jpe?g|png|gif|webp|avif|svg)$/i))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch (e) {
    items = [];
  }
  // build objects with thumb and full paths
  const thumbsDir = path.join(cat.dir, 'thumbs');
  galleries[cat.key] = items.map(f => {
    const name = f.replace(/\.[^.]+$/, '');
    const thumbPath = fs.existsSync(path.join(thumbsDir, name + '-thumb.jpg'))
      ? path.join('images', cat.key, 'thumbs', name + '-thumb.jpg')
      : path.join('images', cat.key, f);
    const webpPath = fs.existsSync(path.join(cat.dir, name + '.webp'))
      ? path.join('images', cat.key, name + '.webp')
      : path.join('images', cat.key, f);
    return { thumb: thumbPath, full: webpPath };
  });
});

fs.writeFileSync(path.join(outDir, 'galleries.json'), JSON.stringify(galleries, null, 2));
console.log('Wrote data/galleries.json');
