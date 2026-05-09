/* ============================================================
   CART.JS — Cart System (localStorage-based)
   ============================================================ */

const Cart = {
  // ── State ─────────────────────────────────────────────────
  items: [],

  // ── Init ──────────────────────────────────────────────────
  init() {
    this.items = DB.get('rk_cart', []);
    this.updateUI();
  },

  // ── Persist ───────────────────────────────────────────────
  save() {
    DB.set('rk_cart', this.items);
    this.updateUI();
  },

  // ── Add item ──────────────────────────────────────────────
  add(menuItemId, qty = 1) {
    const item = MenuDB.getAll().find(m => m.id === menuItemId);
    if (!item) return;

    const existing = this.items.find(i => i.id === menuItemId);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ id: item.id, name: item.name, emoji: item.emoji, category: item.category, price: item.price, qty });
    }
    this.save();
    showToast(`✅ ${item.name} added to cart!`, 'success');
    this.animateCartBtn();
  },

  // ── Remove item ───────────────────────────────────────────
  remove(menuItemId) {
    this.items = this.items.filter(i => i.id !== menuItemId);
    this.save();
    showToast('🗑️ Item removed from cart.', '');
  },

  // ── Update qty ────────────────────────────────────────────
  setQty(menuItemId, qty) {
    if (qty < 1) { this.remove(menuItemId); return; }
    const item = this.items.find(i => i.id === menuItemId);
    if (item) { item.qty = qty; this.save(); }
  },

  // ── Clear ─────────────────────────────────────────────────
  clear() {
    this.items = [];
    this.save();
  },

  // ── Totals ────────────────────────────────────────────────
  count()    { return this.items.reduce((s, i) => s + i.qty, 0); },
  subtotal() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); },
  delivery() { return this.subtotal() >= 1500 ? 0 : 150; },
  discount() { return DB.get('rk_promo_discount', 0); },
  total()    { return Math.max(0, this.subtotal() + this.delivery() - this.discount()); },

  // ── Promo code ────────────────────────────────────────────
  applyPromo(code) {
    const codes = { 'ROYAL20': 20, 'FIRST10': 10, 'FEAST15': 15 };
    const pct = codes[code.toUpperCase()];
    if (!pct) { showToast('❌ Invalid promo code.', 'error'); return false; }
    const disc = Math.round(this.subtotal() * pct / 100);
    DB.set('rk_promo_discount', disc);
    DB.set('rk_promo_code', code.toUpperCase());
    showToast(`🎉 Promo applied! Rs. ${disc} off.`, 'success');
    return true;
  },

  // ── Update all cart-related UI ────────────────────────────
  updateUI() {
    const count = this.count();
    // Update all cart count badges on page
    document.querySelectorAll('#cartCount, .cart-count').forEach(el => {
      el.textContent = count;
      if (count > 0) {
        el.style.display = 'flex';
      }
    });
  },

  // ── Animate cart button ───────────────────────────────────
  animateCartBtn() {
    const btn = document.getElementById('cartCount');
    if (!btn) return;
    btn.classList.add('bump');
    setTimeout(() => btn.classList.remove('bump'), 400);
  },
};

// ── Global toast helper ───────────────────────────────────────
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Format currency ───────────────────────────────────────────
function formatPrice(price) {
  return `Rs. ${price.toLocaleString('en-PK')}`;
}

// ── Build add-to-cart button ──────────────────────────────────
function makeAddToCartBtn(itemId, cls = 'menu-add-btn') {
  return `<button class="${cls}" onclick="handleAddToCart(${itemId}, this)">
    <span>🛒</span> Add to Cart
  </button>`;
}

function handleAddToCart(id, btn) {
  Cart.add(id);
  if (btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '✅ Added!';
    btn.classList.add('added');
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('added'); }, 1500);
  }
}

// ── Init cart on every page ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => Cart.init());
