# Photographer Portfolio

Drop your images into these folders:

- `images/sport`
- `images/person`
- `images/nature`

Then run:

```bash
npm install   # optional
npm run build # scans images and generates data/galleries.json
npm start     # serves on http://localhost:5000 using npx serve
```

Notes:
- The `build` script creates `data/galleries.json` used by the site.
- If you host this on static hosting, run `npm run build` after adding images.
- For best results, export web-optimized JPG/PNG/WEBP files.

Sample template images:
- The project includes built-in template files in `images/sport`, `images/person`, and `images/nature` so the site renders immediately. Replace them with your own photos.

Customizing site text:

- Edit `data/site.json` to change the site title, subtitle, and About text shown on the homepage.

Contact form:

- The site includes a contact form wired to Formspree. Replace the form `action` in `index.html` with your Formspree form ID.

Image processing:

- Run `npm run process-images` to generate `thumbs/*-thumb.jpg` files and `*.webp` copies in each category. The `build` script runs this automatically.
- Requires the `sharp` package: `npm install` will install devDependencies listed in `package.json`.

Uploader:

- The drag-and-drop uploader uses the browser File System Access API when available. Drop files in the Upload area and choose your repository `images/<category>` folder when prompted. If unsupported, copy files manually into `images/`.


