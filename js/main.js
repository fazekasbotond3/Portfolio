function normalizePath(src) {
  if (!src || typeof src !== 'string') return src;
  return src.startsWith('/') ? src.slice(1) : src;
}

async function loadSiteData() {
  try {
    const res = await fetch('data/site.json');
    if (!res.ok) throw new Error('No site data');
    const data = await res.json();
    const title = document.getElementById('site-title');
    const subtitle = document.getElementById('site-subtitle');
    const about = document.getElementById('about-text');
    if (title && data.title) title.textContent = data.title;
    if (subtitle && data.subtitle) subtitle.textContent = data.subtitle;
    if (about && data.about) about.innerHTML = data.about;
    const hero = document.getElementById('hero');
    const heroCardMain = document.querySelector('.mosaic-card-lg');
    const heroCard1 = document.querySelector('.mosaic-card-1');
    const heroCard2 = document.querySelector('.mosaic-card-2');
    const heroCard3 = document.querySelector('.mosaic-card-3');
    const heroSlides = Array.isArray(data.heroSlides) ? data.heroSlides.map(normalizePath) : [];
    const heroBackground = normalizePath(data.heroImage || heroSlides[0]);
    const heroMainImage = normalizePath(heroSlides[1] || heroBackground);
    if (hero && heroBackground) hero.style.setProperty('--hero-img', `url('${heroBackground}')`);
    if (heroCardMain && heroMainImage) heroCardMain.style.backgroundImage = `url('${heroMainImage}')`;
    [heroCard1, heroCard2, heroCard3].forEach((card, index) => {
      const src = normalizePath(heroSlides[index + 2] || heroBackground);
      if (card && src) card.style.backgroundImage = `url('${src}')`;
    });
  } catch (e) {
    // ignore — use defaults in HTML
  }
}

async function loadGalleries() {
  try {
    const res = await fetch('data/galleries.json');
    if (!res.ok) throw new Error('No galleries data');
    const data = await res.json();
    renderGalleries(data);
  } catch (e) {
    document.getElementById('gallery-root').innerHTML = '<p class="meta">No images found. Paste images into the <strong>images/</strong> folders and run <code>npm run build</code>.</p>';
  }
}

function renderGalleries(data) {
  const root = document.getElementById('gallery-root');
  root.innerHTML = '';
  const categoryNames = {
    nature: 'Természet',
    sport: 'Sport',
    person: 'Person'
  };

  for (const [key, images] of Object.entries(data)) {
    const section = document.createElement('section');
    section.className = 'g-section';

    const header = document.createElement('div');
    header.className = 'g-title';
    const title = document.createElement('h3');
    title.textContent = categoryNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
    const viewAll = document.createElement('button');
    viewAll.className = 'view-all-btn';
    viewAll.textContent = 'Galéria';
    viewAll.addEventListener('click', () => openCategoryModal(key, images));
    header.appendChild(title);
    header.appendChild(viewAll);
    section.appendChild(header);

    const previewImages = images.slice(0, Math.min(4, images.length));
    const grid = document.createElement('div');
    grid.className = 'grid';

    previewImages.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'card';
      const img = document.createElement('img');
      img.src = item.thumb || item.full || item;
      img.loading = 'lazy';
      img.alt = `${key} photo ${i+1}`;
      card.appendChild(img);
      card.addEventListener('click', () => openCategoryModal(key, images, i));
      grid.appendChild(card);
    });

    section.appendChild(grid);
    root.appendChild(section);
  }
}

function openCategoryModal(category, images, startIndex = 0) {
  const modal = document.getElementById('category-modal');
  const title = document.getElementById('category-modal-title');
  const grid = document.getElementById('category-modal-grid');
  if (!modal || !title || !grid) return;

  const categoryNames = {
    nature: 'Természet',
    sport: 'Sport',
    person: 'Person'
  };
  title.textContent = `${categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)} Galéria`;
  grid.innerHTML = '';
  const fullSet = images.map(it => it.full || it);

  fullSet.forEach((src, index) => {
    const card = document.createElement('div');
    card.className = 'modal-card';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${category} photo ${index + 1}`;
    card.appendChild(img);
    card.addEventListener('click', () => {
      closeCategoryModal();
      openLightbox(fullSet, index);
    });
    grid.appendChild(card);
  });

  modal.setAttribute('aria-hidden', 'false');
  if (startIndex >= 0 && startIndex < fullSet.length) {
    const firstCard = grid.children[startIndex];
    if (firstCard && firstCard.scrollIntoView) firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function closeCategoryModal() {
  const modal = document.getElementById('category-modal');
  if (modal) modal.setAttribute('aria-hidden', 'true');
}

/* Lightbox */
const lightbox = document.getElementById('lightbox');
const lbImg = document.querySelector('.lightbox-img');
let currentSet = [];
let currentIndex = 0;

function openLightbox(set, index) {
  currentSet = set; currentIndex = index;
  lbImg.src = set[index];
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lightbox.setAttribute('aria-hidden', 'true');
  lbImg.src = '';
}

function prevImage() {
  currentIndex = (currentIndex - 1 + currentSet.length) % currentSet.length;
  lbImg.src = currentSet[currentIndex];
}

function nextImage() {
  currentIndex = (currentIndex + 1) % currentSet.length;
  lbImg.src = currentSet[currentIndex];
}

document.addEventListener('click', e => {
  if (e.target.matches('.lightbox .close')) closeLightbox();
  if (e.target.matches('.lightbox .prev')) prevImage();
  if (e.target.matches('.lightbox .next')) nextImage();
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCategoryModal();
    if (lightbox.getAttribute('aria-hidden') === 'false') closeLightbox();
  }
  if (lightbox.getAttribute('aria-hidden') === 'false') {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  }
});

document.addEventListener('click', e => {
  if (e.target && e.target.id === 'category-modal-close') closeCategoryModal();
});

loadSiteData().then(loadGalleries);

const btn = document.getElementById("hamburgerBtn");
const menu = document.getElementById("menu");
const scrollTopBtn = document.getElementById("scrollTopBtn");

btn.addEventListener("click", () => {
  menu.classList.toggle("active");
});

window.addEventListener("scroll", () => {
  if (!scrollTopBtn) return;
  if (window.scrollY > 240) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
