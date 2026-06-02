const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '..', 'images');
const categories = ['sport', 'person', 'nature'];

async function ensure(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function process() {
  await ensure(imagesDir);
  for (const cat of categories) {
    const dir = path.join(imagesDir, cat);
    const thumbs = path.join(dir, 'thumbs');
    await ensure(dir);
    await ensure(thumbs);
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.match(/\.(jpe?g|png|webp|avif)$/i)) : [];
    for (const file of files) {
      const src = path.join(dir, file);
      const name = file.replace(/\.[^.]+$/, '');
      const thumbOut = path.join(thumbs, name + '-thumb.jpg');
      const webpOut = path.join(dir, name + '.webp');
      try {
        // write thumbnail (jpg)
        if (!fs.existsSync(thumbOut)) {
          await sharp(src).resize(600, 400, { fit: 'cover' }).jpeg({ quality: 76 }).toFile(thumbOut);
          console.log('Wrote', thumbOut);
        }
        // write webp fullsize copy for modern browsers
        if (!fs.existsSync(webpOut)) {
          await sharp(src).webp({ quality: 84 }).toFile(webpOut);
          console.log('Wrote', webpOut);
        }
      } catch (e) {
        console.warn('Skipping', src, e.message);
      }
    }
  }
}

process().catch(err => { console.error(err); process.exit(1); });
