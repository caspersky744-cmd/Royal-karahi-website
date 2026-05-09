/* ============================================================
   HOME.JS — Home page: featured dishes, reviews slider
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedDishes();
  renderReviews();
  initReviewsSlider();
  initParallaxFood();
  showLoadingScreen();
});

// ── Loading screen ────────────────────────────────────────────
function showLoadingScreen() {
  const el = document.getElementById('loadingScreen');
  if (!el) return;
  window.addEventListener('load', () => {
    setTimeout(() => el.classList.add('hidden'), 800);
    setTimeout(() => el.remove(), 1500);
  });
}

// ── Category label helper ─────────────────────────────────────
function catLabel(cat) {
  const map = { karahi:'Chicken Karahi', biryani:'Biryani', shawarma:'Shawarma', mutton:'Mutton', beef:'Beef' };
  return map[cat] || cat;
}

// ── Render featured dishes (top 6 popular / high rated) ───────
function renderFeaturedDishes() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  const featured = MenuDB.getAll()
    .filter(i => i.badge === 'popular' || i.rating >= 4.8)
    .slice(0, 6);

  grid.innerHTML = featured.map((item, idx) => `
    <div class="featured-card reveal-up" style="transition-delay:${idx * 90}ms">
      <div class="food-img-wrapper">
        <img src="${item.image}" alt="${item.name}" class="featured-food-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';this.onerror=null;">
      </div>
      <div class="featured-card-body">
        <p class="featured-card-category">${catLabel(item.category)}</p>
        <h3 class="featured-card-title">${item.name}</h3>
        <p class="featured-card-desc">${item.desc}</p>
        <div class="featured-card-footer">
          <span class="featured-card-price">
            <span class="currency">Rs. </span>${item.price.toLocaleString()}
          </span>
          <button class="add-to-cart-btn" onclick="handleAddToCart(${item.id}, this)">
            🛒 Add
          </button>
        </div>
      </div>
    </div>
  `).join('');

  initRevealAnimations();
}

// ── Render reviews ────────────────────────────────────────────
function renderReviews() {
  const slider = document.getElementById('reviewsSlider');
  if (!slider) return;

  slider.innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer-avatar">${r.avatar}</div>
        <div class="reviewer-info">
          <h4>${r.name}</h4>
          <span>📍 ${r.city}</span>
        </div>
      </div>
      <div class="review-stars">
        <span>${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
      </div>
      <p class="review-text">"${r.text}"</p>
      <span class="review-dish">${r.dish}</span>
    </div>
  `).join('');
}

// ── Slider ────────────────────────────────────────────────────
let currentSlide    = 0;
let slideInterval   = null;
const VISIBLE_COUNT = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
const TOTAL_SLIDES  = () => Math.ceil(REVIEWS.length / VISIBLE_COUNT());

function initReviewsSlider() {
  const prev = document.getElementById('prevReview');
  const next = document.getElementById('nextReview');
  if (prev) prev.addEventListener('click', () => { advance(-1); resetAuto(); });
  if (next) next.addEventListener('click', () => { advance(1);  resetAuto(); });
  buildDots();
  startAuto();
  window.addEventListener('resize', () => { currentSlide = 0; buildDots(); applySlide(); });
}

function buildDots() {
  const dotsEl = document.getElementById('sliderDots');
  if (!dotsEl) return;
  const total = TOTAL_SLIDES();
  dotsEl.innerHTML = Array.from({ length: total }, (_, i) =>
    `<button class="slider-dot${i === 0 ? ' active' : ''}" onclick="goSlide(${i})" aria-label="Slide ${i+1}"></button>`
  ).join('');
}

function advance(dir) {
  currentSlide = (currentSlide + dir + TOTAL_SLIDES()) % TOTAL_SLIDES();
  applySlide();
}

function goSlide(idx) {
  currentSlide = idx;
  applySlide();
  resetAuto();
}

function applySlide() {
  const slider = document.getElementById('reviewsSlider');
  if (!slider) return;
  const card   = slider.children[0];
  if (!card)   return;
  const gap    = 24; // matches var(--spacing-lg) approximation
  const stride = VISIBLE_COUNT();
  const offset = currentSlide * stride * (card.offsetWidth + gap);
  slider.style.transform = `translateX(-${offset}px)`;

  document.querySelectorAll('.slider-dot').forEach((d, i) =>
    d.classList.toggle('active', i === currentSlide)
  );
}

function startAuto() {
  slideInterval = setInterval(() => advance(1), 5000);
}
function resetAuto() {
  clearInterval(slideInterval);
  startAuto();
}

// ── 3D Parallax food on mouse move ────────────────────────────
function initParallaxFood() {
  const foods = document.querySelectorAll('.food-3d');
  if (!foods.length || window.matchMedia('(pointer:coarse)').matches) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    foods.forEach(el => {
      const d  = parseFloat(el.dataset.depth) || 0.3;
      const tx = dx * 28 * d;
      const ty = dy * 18 * d;
      el.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  });
}
