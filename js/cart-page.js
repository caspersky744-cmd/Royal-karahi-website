/* ============================================================
   CART-PAGE.JS — Cart page render & checkout logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', renderCartPage);

function renderCartPage() {
  const wrap = document.getElementById('cartPageContent');
  if (!wrap) return;

  if (!Cart.items.length) {
    wrap.innerHTML = `
      <div class="cart-empty">
        <div class="icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet. Explore our menu!</p>
        <a href="menu.html" class="btn-primary btn-glow">Browse Menu</a>
      </div>`;
    return;
  }

  wrap.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items-list" id="cartItemsList"></div>
      <div class="order-summary">
        <h2 class="summary-title">Order Summary</h2>
        <div class="summary-row">
          <span>Subtotal</span>
          <span class="val" id="sumSubtotal">${formatPrice(Cart.subtotal())}</span>
        </div>
        <div class="summary-row">
          <span>Delivery</span>
          <span class="val" id="sumDelivery">${Cart.delivery() === 0 ? '<span style="color:#27ae60">FREE</span>' : formatPrice(Cart.delivery())}</span>
        </div>
        <div class="summary-row" id="discountRow" style="display:${Cart.discount() > 0 ? 'flex' : 'none'}">
          <span>Discount</span>
          <span class="val" style="color:#27ae60" id="sumDiscount">- ${formatPrice(Cart.discount())}</span>
        </div>
        <hr class="summary-divider"/>
        <div class="summary-total">
          <span>Total</span>
          <span id="sumTotal">${formatPrice(Cart.total())}</span>
        </div>
        <div class="promo-input">
          <input type="text" id="promoInput" placeholder="Promo code (e.g. ROYAL20)" autocomplete="off"/>
          <button class="promo-btn" onclick="applyPromoCode()">Apply</button>
        </div>
        <button class="checkout-btn" onclick="openCheckout()">Proceed to Checkout →</button>
        <a href="menu.html" class="continue-shopping">← Continue Shopping</a>
        <div style="margin-top:var(--spacing-md);padding:var(--spacing-md);background:rgba(212,168,67,0.06);border-radius:var(--radius-md);border:1px solid var(--border-color);font-size:0.8rem;color:var(--text-secondary);">
          🚀 Free delivery on orders above Rs. 1,500<br/>
          🎁 Use code <strong style="color:var(--gold-primary)">ROYAL20</strong> for 20% off!
        </div>
      </div>
    </div>`;

  renderCartItems();
}

function renderCartItems() {
  const list = document.getElementById('cartItemsList');
  if (!list) return;

  list.innerHTML = Cart.items.map(item => `
    <div class="cart-item-card" id="cart-item-${item.id}">
      <div class="cart-item-img-wrapper">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      </div>
      <div class="cart-item-info">
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-cat">${catLabel(item.category)}</p>
        <p class="cart-item-price">${formatPrice(item.price)} each</p>
      </div>
      <div class="cart-item-controls">
        <span class="cart-item-total">${formatPrice(item.price * item.qty)}</span>
        <div class="cart-qty-controls">
          <button class="cart-qty-btn" onclick="cartChangeQty(${item.id}, -1)">−</button>
          <span class="cart-qty-val">${item.qty}</span>
          <button class="cart-qty-btn" onclick="cartChangeQty(${item.id}, 1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="cartRemove(${item.id})">🗑️ Remove</button>
      </div>
    </div>
  `).join('');
}

function catLabel(cat) {
  const map = { karahi:'Chicken Karahi', biryani:'Biryani', shawarma:'Shawarma', mutton:'Mutton', beef:'Beef' };
  return map[cat] || cat;
}

function cartChangeQty(id, delta) {
  const item = Cart.items.find(i => i.id === id);
  if (!item) return;
  Cart.setQty(id, item.qty + delta);
  renderCartPage();
}

function cartRemove(id) {
  Cart.remove(id);
  renderCartPage();
}

function applyPromoCode() {
  const code = document.getElementById('promoInput')?.value?.trim();
  if (!code) return;
  const ok = Cart.applyPromo(code);
  if (ok) renderCartPage();
}

// ── Checkout modal ────────────────────────────────────────────
function openCheckout() {
  const overlay = document.getElementById('checkoutOverlay');
  const totalEl = document.getElementById('chkTotal');
  if (totalEl) totalEl.textContent = formatPrice(Cart.total());

  // Pre-fill if logged in
  const user = UserDB.getCurrent();
  if (user) {
    const nameEl = document.getElementById('chkName');
    if (nameEl) nameEl.value = user.name || '';
  }

  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  const overlay = document.getElementById('checkoutOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on backdrop click
document.getElementById('checkoutOverlay')?.addEventListener('click', function(e) {
  if (e.target === this) closeCheckout();
});

// Form submit
document.getElementById('checkoutForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const name    = document.getElementById('chkName')?.value?.trim();
  const phone   = document.getElementById('chkPhone')?.value?.trim();
  const address = document.getElementById('chkAddress')?.value?.trim();
  const city    = document.getElementById('chkCity')?.value?.trim();
  const payment = document.getElementById('chkPayment')?.value;
  const notes   = document.getElementById('chkNotes')?.value?.trim();

  if (!name || !phone || !address || !city) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const orderId = 'RK-' + Date.now().toString().slice(-6);
  const order = {
    id: orderId,
    customer: { name, phone, address, city, payment, notes },
    items: [...Cart.items],
    subtotal: Cart.subtotal(),
    delivery: Cart.delivery(),
    discount: Cart.discount(),
    total: Cart.total(),
    status: 'pending',
    placedAt: new Date().toISOString(),
    userId: UserDB.getCurrent()?.id || null,
  };

  OrderDB.save(order);
  Cart.clear();
  DB.remove('rk_promo_discount');
  DB.remove('rk_promo_code');

  // Show success
  document.getElementById('checkoutContent').innerHTML = `
    <div class="order-success">
      <div class="success-icon">🎉</div>
      <h2>Order Placed!</h2>
      <p>Thank you, <strong>${name}</strong>! Your royal feast is on its way.</p>
      <p class="order-id">${orderId}</p>
      <p style="color:var(--text-muted);font-size:0.85rem;margin-top:var(--spacing-sm)">
        Expected delivery: <strong>30–45 minutes</strong>
      </p>
      <div style="display:flex;gap:var(--spacing-md);justify-content:center;margin-top:var(--spacing-xl);flex-wrap:wrap">
        <button class="btn-primary" onclick="closeCheckout();renderCartPage()">Back to Home</button>
        <a href="https://wa.me/923001234567?text=Hi! My order ID is ${orderId}. Can you confirm?" class="btn-whatsapp" target="_blank">Track on WhatsApp</a>
      </div>
    </div>`;
});
