/* ============================================================
   MENU.JS — Menu page: filter, search, rating, render
   ============================================================ */

let activeCategory = 'all';
let searchQuery    = '';

document.addEventListener('DOMContentLoaded', () => {
  // Check URL param
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat');
  if (cat) setCategory(cat);
  else renderMenu();

  initFilters();
  initSearch();
});

// ── Filter tabs ───────────────────────────────────────────────
function initFilters() {
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => setCategory(btn.dataset.cat));
  });
}

function setCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.filter-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.cat === cat)
  );
  renderMenu();
}

// ── Search ────────────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById('menuSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    searchQuery = input.value.trim().toLowerCase();
    renderMenu();
  });
}

// ── Render menu ───────────────────────────────────────────────
function renderMenu() {
  const container = document.getElementById('menuContent');
  if (!container) return;

  const all = MenuDB.getAll();
  let items = all;

  // Filter by category
  if (activeCategory !== 'all') {
    items = items.filter(i => i.category === activeCategory);
  }

  // Filter by search
  if (searchQuery) {
    items = items.filter(i =>
      i.name.toLowerCase().includes(searchQuery) ||
      i.desc.toLowerCase().includes(searchQuery) ||
      i.category.toLowerCase().includes(searchQuery)
    );
  }

  if (!items.length) {
    container.innerHTML = `
      <div class="no-results">
        <div class="icon">🍽️</div>
        <h3>No dishes found</h3>
        <p>Try a different search term or category</p>
      </div>`;
    return;
  }

  if (activeCategory === 'all' && !searchQuery) {
    // Group by category
    const cats = [
      { key:'karahi',  label:'Chicken Karahi', icon:'🍲' },
      { key:'biryani', label:'Biryani',         icon:'🍚' },
      { key:'shawarma',label:'Shawarma',        icon:'🌯' },
      { key:'mutton',  label:'Mutton Dishes',   icon:'🍖' },
      { key:'beef',    label:'Beef Dishes',     icon:'🥩' },
    ];
    container.innerHTML = cats.map(cat => {
      const catItems = items.filter(i => i.category === cat.key);
      if (!catItems.length) return '';
      return `
        <div>
          <h2 class="menu-category-title reveal-up">
            <span>${cat.icon}</span> ${cat.label}
          </h2>
          <div class="menu-grid">
            ${catItems.map(item => menuItemCard(item)).join('')}
          </div>
        </div>`;
    }).join('');
  } else {
    container.innerHTML = `<div class="menu-grid">${items.map(menuItemCard).join('')}</div>`;
  }

  initRevealAnimations();
}

// ── Single item card HTML ─────────────────────────────────────
function menuItemCard(item) {
  const badge = item.badge
    ? `<span class="item-badge badge-${item.badge}">${badgeLabel(item.badge)}</span>`
    : '';
  return `
    <div class="menu-item-card reveal-up">
      <div class="menu-item-img">
        ${badge}
        <span class="item-rating">⭐ ${item.rating}</span>
        <img src="${item.image}" alt="${item.name}" class="menu-food-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';this.onerror=null;">
      </div>
      <div class="menu-item-body">
        <p class="menu-item-cat">${catLabel(item.category)}</p>
        <h3 class="menu-item-name">${item.name}</h3>
        <p class="menu-item-desc">${item.desc}</p>
        <div class="menu-item-footer">
          <span class="menu-item-price"><span class="rs">Rs. </span>${item.price.toLocaleString()}</span>
          <button class="menu-add-btn" onclick="handleAddToCart(${item.id}, this)">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>`;
}

function badgeLabel(badge) {
  const map = { popular:'🔥 Popular', new:'✨ New', spicy:'🌶️ Spicy' };
  return map[badge] || badge;
}

function catLabel(cat) {
  const map = { karahi:'Chicken Karahi', biryani:'Biryani', shawarma:'Shawarma', mutton:'Mutton', beef:'Beef' };
  return map[cat] || cat;
}
