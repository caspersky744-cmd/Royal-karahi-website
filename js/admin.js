/* ============================================================
   ADMIN.JS — Admin Panel Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Guard: only admin can access
  if (!UserDB.isAdmin()) {
    showToast('⚠️ Admin access required.', 'error');
    setTimeout(() => location.href = 'login.html', 1500);
    return;
  }

  initThemeToggle();
  renderDashboard();
  renderOrders();
  renderAdminMenu();
  renderUsers();

  document.getElementById('addItemForm')?.addEventListener('submit', handleSaveItem);
  document.getElementById('adminModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeAdminModal();
  });
});

// ── Tab switching ────────────────────────────────────────────
function switchTab(tabId, link) {
  document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const tab = document.getElementById('tab-' + tabId);
  if (tab) tab.classList.add('active');
  if (link) link.classList.add('active');
  // Refresh content
  if (tabId === 'dashboard') renderDashboard();
  if (tabId === 'orders')    renderOrders();
  if (tabId === 'menu')      renderAdminMenu();
  if (tabId === 'users')     renderUsers();
  return false;
}

// ── Dashboard ─────────────────────────────────────────────────
function renderDashboard() {
  const orders = OrderDB.getAll();
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pending = orders.filter(o => o.status === 'pending').length;
  const users   = UserDB.getAll().length;
  const menuCnt = MenuDB.getAll().length;

  const stats = [
    { label:'Total Orders',   value: orders.length, icon:'📦', change:'+12% this week' },
    { label:'Revenue (Rs.)',  value: revenue.toLocaleString(), icon:'💰', change:'+8% this month' },
    { label:'Pending Orders', value: pending, icon:'⏳', change: pending > 0 ? 'Needs attention' : 'All clear ✅', cls: pending > 0 ? 'down' : '' },
    { label:'Menu Items',     value: menuCnt, icon:'🍽️', change:`Across 5 categories` },
  ];

  const statsEl = document.getElementById('dashStats');
  if (statsEl) statsEl.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-card-header">
        <span class="stat-card-label">${s.label}</span>
        <span class="stat-card-icon">${s.icon}</span>
      </div>
      <div class="stat-card-value">${s.value}</div>
      <div class="stat-card-change ${s.cls || ''}">${s.change}</div>
    </div>`).join('');

  // Recent orders (last 5)
  const tbody = document.getElementById('recentOrdersBody');
  if (tbody) {
    const recent = orders.slice(0, 5);
    tbody.innerHTML = recent.length ? recent.map(o => orderRow(o, true)).join('') :
      `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:var(--spacing-xl)">No orders yet</td></tr>`;
  }
}

// ── Orders ────────────────────────────────────────────────────
function renderOrders() {
  const filter = document.getElementById('orderStatusFilter')?.value || 'all';
  let orders = OrderDB.getAll();
  if (filter !== 'all') orders = orders.filter(o => o.status === filter);

  const tbody = document.getElementById('allOrdersBody');
  if (!tbody) return;
  tbody.innerHTML = orders.length ? orders.map(o => orderRow(o, false)).join('') :
    `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:var(--spacing-xl)">No orders found</td></tr>`;
}

function orderRow(o, compact) {
  const statusMap = { pending:'status-pending', preparing:'status-preparing', delivered:'status-delivered', cancelled:'status-cancelled' };
  const date = new Date(o.placedAt).toLocaleDateString('en-PK', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
  if (compact) {
    return `<tr>
      <td><strong style="color:var(--gold-primary)">${o.id}</strong></td>
      <td>${o.customer?.name || '—'}</td>
      <td>${o.items?.length || 0} items</td>
      <td><strong>Rs. ${(o.total||0).toLocaleString()}</strong></td>
      <td><span class="status-badge ${statusMap[o.status] || ''}">${o.status}</span></td>
      <td style="color:var(--text-muted);font-size:0.8rem">${date}</td>
      <td><div class="actions-group">
        <button class="action-btn action-view" onclick="viewOrder('${o.id}')">View</button>
        <select onchange="updateOrderStatus('${o.id}',this.value)" style="background:var(--bg-card);border:1px solid var(--border-color);color:var(--text-secondary);padding:4px 8px;border-radius:var(--radius-sm);font-size:0.75rem;cursor:pointer">
          <option value="pending" ${o.status==='pending'?'selected':''}>Pending</option>
          <option value="preparing" ${o.status==='preparing'?'selected':''}>Preparing</option>
          <option value="delivered" ${o.status==='delivered'?'selected':''}>Delivered</option>
          <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Cancelled</option>
        </select>
      </div></td>
    </tr>`;
  }
  return `<tr>
    <td><strong style="color:var(--gold-primary)">${o.id}</strong></td>
    <td>${o.customer?.name || '—'}</td>
    <td>${o.customer?.phone || '—'}</td>
    <td><strong>Rs. ${(o.total||0).toLocaleString()}</strong></td>
    <td>${o.customer?.payment || 'COD'}</td>
    <td><span class="status-badge ${statusMap[o.status] || ''}">${o.status}</span></td>
    <td><div class="actions-group">
      <button class="action-btn action-view" onclick="viewOrder('${o.id}')">View</button>
      <select onchange="updateOrderStatus('${o.id}',this.value)" style="background:var(--bg-card);border:1px solid var(--border-color);color:var(--text-secondary);padding:4px 8px;border-radius:var(--radius-sm);font-size:0.75rem;cursor:pointer">
        <option value="pending" ${o.status==='pending'?'selected':''}>Pending</option>
        <option value="preparing" ${o.status==='preparing'?'selected':''}>Preparing</option>
        <option value="delivered" ${o.status==='delivered'?'selected':''}>Delivered</option>
        <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Cancelled</option>
      </select>
    </div></td>
  </tr>`;
}

function updateOrderStatus(id, status) {
  OrderDB.updateStatus(id, status);
  showToast(`✅ Order ${id} → ${status}`, 'success');
  renderOrders();
  renderDashboard();
}

function viewOrder(id) {
  const o = OrderDB.getAll().find(x => x.id === id);
  if (!o) return;
  openAdminModal(`
    <div class="modal-header">
      <h2>Order <span style="color:var(--gold-primary)">${o.id}</span></h2>
      <button class="modal-close" onclick="closeAdminModal()">✕</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md);margin-bottom:var(--spacing-lg)">
      <div><strong style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase">Customer</strong><p style="color:var(--text-primary);margin-top:4px">${o.customer?.name}</p></div>
      <div><strong style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase">Phone</strong><p style="color:var(--text-primary);margin-top:4px">${o.customer?.phone}</p></div>
      <div><strong style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase">Address</strong><p style="color:var(--text-primary);margin-top:4px">${o.customer?.address}, ${o.customer?.city}</p></div>
      <div><strong style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase">Payment</strong><p style="color:var(--text-primary);margin-top:4px">${o.customer?.payment}</p></div>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:var(--spacing-lg)">
      <thead><tr style="border-bottom:1px solid var(--border-color)">
        <th style="text-align:left;padding:8px 0;color:var(--text-muted);font-size:0.75rem;text-transform:uppercase">Item</th>
        <th style="text-align:right;padding:8px 0;color:var(--text-muted);font-size:0.75rem;text-transform:uppercase">Qty</th>
        <th style="text-align:right;padding:8px 0;color:var(--text-muted);font-size:0.75rem;text-transform:uppercase">Price</th>
      </tr></thead>
      <tbody>${(o.items||[]).map(i => `<tr style="border-bottom:1px solid rgba(255,255,255,0.04)">
        <td style="padding:10px 0;color:var(--text-primary);display:flex;align-items:center;gap:10px">
          <img src="${i.image}" alt="" style="width:32px;height:32px;border-radius:4px;object-fit:cover">
          ${i.name}
        </td>
        <td style="text-align:right;color:var(--text-secondary)">×${i.qty}</td>
        <td style="text-align:right;color:var(--text-primary)">Rs. ${(i.price*i.qty).toLocaleString()}</td>
      </tr>`).join('')}</tbody>
    </table>
    <div style="text-align:right;border-top:1px solid var(--border-color);padding-top:var(--spacing-md)">
      <div style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:4px">Delivery: Rs. ${(o.delivery||0).toLocaleString()}</div>
      ${o.discount > 0 ? `<div style="color:#27ae60;font-size:0.88rem;margin-bottom:4px">Discount: -Rs. ${o.discount.toLocaleString()}</div>` : ''}
      <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--gold-primary);font-weight:700">Total: Rs. ${(o.total||0).toLocaleString()}</div>
    </div>
    ${o.customer?.notes ? `<p style="margin-top:var(--spacing-md);color:var(--text-secondary);font-size:0.85rem;border-top:1px solid var(--border-color);padding-top:var(--spacing-md)">📝 Notes: ${o.customer.notes}</p>` : ''}
  `);
}

// ── Menu CRUD ─────────────────────────────────────────────────
function renderAdminMenu() {
  const q = document.getElementById('menuAdminSearch')?.value?.toLowerCase() || '';
  let items = MenuDB.getAll();
  if (q) items = items.filter(i => i.name.toLowerCase().includes(q) || i.category.includes(q));

  const tbody = document.getElementById('menuAdminBody');
  if (!tbody) return;
  tbody.innerHTML = items.map(item => `
    <tr>
      <td><img src="${item.image}" alt="" style="width:40px;height:40px;border-radius:8px;object-fit:cover;border:1px solid var(--border-color)"></td>
      <td style="color:var(--text-primary);font-weight:500">${item.name}</td>
      <td style="text-transform:capitalize">${item.category}</td>
      <td style="color:var(--gold-primary);font-weight:600">Rs. ${item.price.toLocaleString()}</td>
      <td>⭐ ${item.rating}</td>
      <td>${item.badge ? `<span class="status-badge status-${item.badge==='popular'?'preparing':item.badge==='new'?'delivered':'pending'}">${item.badge}</span>` : '—'}</td>
      <td><div class="actions-group">
        <button class="action-btn action-edit" onclick="editItem(${item.id})">Edit</button>
        <button class="action-btn action-delete" onclick="deleteItem(${item.id})">Delete</button>
      </div></td>
    </tr>`).join('');
}

function editItem(id) {
  const item = MenuDB.getAll().find(i => i.id === id);
  if (!item) return;
  document.getElementById('editItemId').value = item.id;
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemCategory').value = item.category;
  document.getElementById('itemPrice').value = item.price;
  document.getElementById('itemImage').value = item.image || '';
  document.getElementById('itemRating').value = item.rating;
  document.getElementById('itemBadge').value = item.badge || '';
  document.getElementById('itemDesc').value = item.desc;
  document.getElementById('addItemTitle').textContent = 'Edit Menu Item';
  switchTab('add-item', null);
  showToast('📝 Editing: ' + item.name, '');
}

function deleteItem(id) {
  if (!confirm('Delete this menu item? This cannot be undone.')) return;
  MenuDB.delete(id);
  renderAdminMenu();
  showToast('🗑️ Item deleted.', '');
}

function handleSaveItem(e) {
  e.preventDefault();
  const id    = document.getElementById('editItemId').value;
  const name  = document.getElementById('itemName').value.trim();
  const cat   = document.getElementById('itemCategory').value;
  const price = parseInt(document.getElementById('itemPrice').value);
  const image = document.getElementById('itemImage').value.trim();
  const rating= parseFloat(document.getElementById('itemRating').value) || 4.5;
  const badge = document.getElementById('itemBadge').value || null;
  const desc  = document.getElementById('itemDesc').value.trim();

  if (!name || !price || !desc || !image) { showToast('Please fill all required fields.', 'error'); return; }

  const data = { name, category: cat, price, image, rating, badge, desc };
  if (id) {
    MenuDB.update(parseInt(id), data);
    showToast('✅ Item updated!', 'success');
  } else {
    MenuDB.add(data);
    showToast('✅ Item added!', 'success');
  }
  resetItemForm();
  switchTab('menu', null);
}

function resetItemForm() {
  document.getElementById('addItemForm')?.reset();
  document.getElementById('editItemId').value = '';
  document.getElementById('addItemTitle').textContent = 'Add Menu Item';
}

// ── Users ─────────────────────────────────────────────────────
function renderUsers() {
  const users = UserDB.getAll();
  const tbody = document.getElementById('usersBody');
  if (!tbody) return;
  tbody.innerHTML = users.length ? users.map(u => `
    <tr>
      <td style="color:var(--text-muted)">#${u.id}</td>
      <td style="color:var(--text-primary);font-weight:500">${u.name}</td>
      <td>${u.email}</td>
      <td><span class="status-badge ${u.role==='admin'?'status-preparing':'status-delivered'}">${u.role}</span></td>
      <td style="color:var(--text-muted);font-size:0.8rem">${new Date(u.createdAt).toLocaleDateString()}</td>
    </tr>`).join('') :
    `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:var(--spacing-xl)">No registered users yet</td></tr>`;
}

// ── Admin Modal ───────────────────────────────────────────────
function openAdminModal(html) {
  document.getElementById('adminModalContent').innerHTML = html;
  document.getElementById('adminModal').classList.add('open');
}
function closeAdminModal() {
  document.getElementById('adminModal').classList.remove('open');
}

// ── Admin Logout ──────────────────────────────────────────────
function adminLogout() {
  UserDB.logout();
  location.href = 'login.html';
}
