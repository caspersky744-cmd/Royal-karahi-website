/* ============================================================
   DATA.JS — Menu Items Database (localStorage-based)
   ============================================================ */

const MENU_DATA = [
  // ── CHICKEN KARAHI ──
  { id:1,  name:'Royal Chicken Karahi',    category:'karahi',  image:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80', price:1299, rating:4.9, badge:'popular', desc:'Our signature dish — tender chicken cooked in a fiery tomato gravy with hand-ground spices, green chillies, and fresh ginger.' },
  { id:2,  name:'White Karahi',            category:'karahi',  image:'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80', price:1199, rating:4.7, badge:'new',     desc:'Creamy, mild-spiced chicken karahi in a rich yoghurt-based gravy. A silky, royal experience for milder palates.' },
  { id:3,  name:'Dahi Karahi',             category:'karahi',  image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', price:1150, rating:4.6, badge:null,      desc:'Slow-cooked chicken in tangy yoghurt and whole spices — a timeless classic straight from the Punjab.' },
  { id:4,  name:'Karahi Boneless',         category:'karahi',  image:'https://images.unsplash.com/photo-1589187151032-573a91317445?auto=format&fit=crop&w=800&q=80', price:1399, rating:4.8, badge:'popular', desc:'All the flavour of our signature karahi — served boneless for effortless, indulgent eating.' },
  { id:5,  name:'Achari Chicken Karahi',   category:'karahi',  image:'https://images.unsplash.com/photo-1626777553732-4899533a4590?auto=format&fit=crop&w=800&q=80', price:1249, rating:4.5, badge:'spicy',   desc:'Pickle-spiced chicken karahi with mustard seeds, fennel, and a punch of tangy heat.' },

  // ── BIRYANI ──
  { id:6,  name:'Royal Chicken Biryani',   category:'biryani', image:'https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&w=800&q=80', price:899,  rating:4.9, badge:'popular', desc:'Long-grain basmati rice layered with spiced chicken, saffron, caramelised onions, and fresh mint. Fit for a king.' },
  { id:7,  name:'Mutton Biryani',          category:'biryani', image:'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80', price:1199, rating:4.8, badge:'popular', desc:'Slow-cooked mutton on the bone, layered with saffron rice and whole aromatic spices.' },
  { id:8,  name:'Beef Biryani',            category:'biryani', image:'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80', price:1099, rating:4.7, badge:null,      desc:'Tender beef cubes in a rich spice base, layered with fluffy basmati and golden fried onions.' },
  { id:9,  name:'Special Dum Biryani',     category:'biryani', image:'https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&w=800&q=80', price:1299, rating:4.9, badge:'new',     desc:'Slow-cooked dum-style biryani sealed and steamed to let every grain absorb the richest flavours.' },
  { id:10, name:'Prawn Biryani',           category:'biryani', image:'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80', price:1399, rating:4.6, badge:'new',     desc:'Coastal-style biryani with juicy prawns, coconut hints, and aromatic spices layered with basmati.' },
  { id:11, name:'Zarda (Sweet Rice)',      category:'biryani', image:'https://images.unsplash.com/photo-1514516322520-572535a29990?auto=format&fit=crop&w=800&q=80', price:499,  rating:4.4, badge:null,      desc:'Traditional sweet saffron rice garnished with nuts, raisins, and fragrant rose water.' },

  // ── SHAWARMA ──
  { id:12, name:'Classic Chicken Shawarma',category:'shawarma',image:'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80', price:349,  rating:4.8, badge:'popular', desc:'Marinated chicken strips, garlic sauce, pickles, and fresh veggies wrapped in warm pita bread.' },
  { id:13, name:'Beef Shawarma',           category:'shawarma',image:'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80', price:399,  rating:4.7, badge:null,      desc:'Slow-roasted spiced beef in a toasted pita with tahini, tomatoes, and crispy onions.' },
  { id:14, name:'Shawarma Platter',        category:'shawarma',image:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', price:699,  rating:4.8, badge:'popular', desc:'A royal spread — two shawarmas with fries, garlic dip, and a refreshing salad.' },
  { id:15, name:'Crispy Shawarma Roll',    category:'shawarma',image:'https://images.unsplash.com/photo-1619096279114-bb42eb237e61?auto=format&fit=crop&w=800&q=80', price:379,  rating:4.6, badge:'spicy',   desc:'Extra-crispy grilled chicken in a toasted roll with spicy chilli sauce and crunchy slaw.' },

  // ── MUTTON ──
  { id:16, name:'Mutton Karahi',           category:'mutton',  image:'https://images.unsplash.com/photo-1631515223360-5d92d7650132?auto=format&fit=crop&w=800&q=80', price:1699, rating:4.9, badge:'popular', desc:'On-the-bone mutton slow-cooked with tomatoes, green chillies, and aromatic spices — the ultimate indulgence.' },
  { id:17, name:'Mutton Nihari',           category:'mutton',  image:'https://images.unsplash.com/photo-1628294895950-98301be9c29d?auto=format&fit=crop&w=800&q=80', price:1499, rating:4.8, badge:'popular', desc:'A slow-braised overnight stew of mutton shanks in a deep, spiced broth — a Lahori breakfast legend.' },
  { id:18, name:'Mutton Paye (Trotters)', category:'mutton',  image:'https://images.unsplash.com/photo-1627308595186-e6bb36712645?auto=format&fit=crop&w=800&q=80', price:1299, rating:4.7, badge:null,      desc:'Braised mutton trotters in a rich, gelatinous broth with whole spices. A warming winter delicacy.' },
  { id:19, name:'Mutton Chops Karahi',     category:'mutton',  image:'https://images.unsplash.com/photo-1606416132922-22ab37c12312?auto=format&fit=crop&w=800&q=80', price:1899, rating:4.8, badge:'new',     desc:'Succulent mutton chops cooked karahi-style — charred edges, tender inside, and full of flavour.' },
  { id:20, name:'Lamb Rogan Josh',         category:'mutton',  image:'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=800&q=80', price:1599, rating:4.7, badge:null,      desc:'Kashmiri-style slow-braised lamb in a deep red, aromatic gravy with whole spices and dried chillies.' },

  // ── BEEF ──
  { id:21, name:'Beef Karahi',             category:'beef',    image:'https://images.unsplash.com/photo-1589187151032-573a91317445?auto=format&fit=crop&w=800&q=80', price:1599, rating:4.8, badge:'popular', desc:'Juicy beef cubes in a bold, spicy tomato-based karahi gravy. Rich, hearty, and deeply satisfying.' },
  { id:22, name:'Beef Nihari',             category:'beef',    image:'https://images.unsplash.com/photo-1631515223360-5d92d7650132?auto=format&fit=crop&w=800&q=80', price:1399, rating:4.9, badge:'popular', desc:'Lahore\'s iconic slow-cooked beef shank stew — simmered overnight in a complex spice blend.' },
  { id:23, name:'Beef Seekh Kabab Platter',category:'beef',    image:'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80', price:1099, rating:4.7, badge:null,      desc:'Minced beef seekh kababs grilled over charcoal, served with naan, raita, and chutney.' },
  { id:24, name:'Beef Chapli Kabab',       category:'beef',    image:'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80', price:999,  rating:4.8, badge:'spicy',   desc:'Peshwari-style flat beef patties fried in tallow with tomatoes, pomegranate seeds, and coriander.' },
];

const REVIEWS = [
  { name:'Ahmed Raza',     city:'Lahore',    rating:5, text:'The Royal Chicken Karahi is absolutely divine. I\'ve tried karahi all over Lahore, but nothing comes close to this. The spices are perfectly balanced!', dish:'Royal Chicken Karahi',    avatar:'A' },
  { name:'Fatima Malik',   city:'Karachi',   rating:5, text:'Ordered the Special Dum Biryani for my family and everyone was speechless. The rice was perfectly cooked, aroma was incredible. Will order again!', dish:'Special Dum Biryani',      avatar:'F' },
  { name:'Usman Sheikh',   city:'Islamabad', rating:5, text:'The Mutton Nihari is life-changing. Slow-cooked to perfection — the broth is so rich and deep. I drove 2 hours just for this!', dish:'Mutton Nihari',              avatar:'U' },
  { name:'Sara Khan',      city:'Lahore',    rating:5, text:'Best Chicken Shawarma in the city, hands down. The garlic sauce is incredible and the chicken is always fresh and juicy. My go-to!', dish:'Classic Chicken Shawarma', avatar:'S' },
  { name:'Bilal Chaudhry', city:'Lahore',    rating:4, text:'Beef Nihari rivals the best in Lahore. Thick, rich, and absolutely soul-satisfying. The naan that came with it was perfectly puffed.', dish:'Beef Nihari',               avatar:'B' },
  { name:'Ayesha Noor',    city:'Faisalabad',rating:5, text:'The Beef Chapli Kabab is out of this world! Crispy on the outside, juicy inside. Never had anything like it. Royal Karahi never disappoints.', dish:'Beef Chapli Kabab',         avatar:'A' },
];

// ── Storage helpers ──────────────────────────────────────────
const DB = {
  get(key, fallback = null) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  remove(key)   { localStorage.removeItem(key); },
};

// ── User system ──────────────────────────────────────────────
const UserDB = {
  getAll()        { return DB.get('rk_users', []); },
  getCurrent()    { return DB.get('rk_current_user', null); },
  isLoggedIn()    { return !!this.getCurrent(); },
  isAdmin()       { const u = this.getCurrent(); return u && u.role === 'admin'; },

  register(name, email, password) {
    const users = this.getAll();
    if (users.find(u => u.email === email)) return { ok:false, msg:'Email already registered.' };
    const user = { id: Date.now(), name, email, password, role:'user', createdAt: new Date().toISOString() };
    users.push(user);
    DB.set('rk_users', users);
    DB.set('rk_current_user', user);
    return { ok:true, user };
  },

  login(email, password) {
    // Hard-coded admin
    if (email === 'admin@royalkarahi.pk' && password === 'admin123') {
      const admin = { id:0, name:'Admin', email, role:'admin' };
      DB.set('rk_current_user', admin);
      return { ok:true, user:admin };
    }
    const user = this.getAll().find(u => u.email === email && u.password === password);
    if (!user) return { ok:false, msg:'Invalid email or password.' };
    DB.set('rk_current_user', user);
    return { ok:true, user };
  },

  logout() { DB.remove('rk_current_user'); },
};

// ── Orders system ────────────────────────────────────────────
const OrderDB = {
  getAll()    { return DB.get('rk_orders', []); },
  save(order) {
    const orders = this.getAll();
    orders.unshift(order);
    DB.set('rk_orders', orders);
  },
  updateStatus(id, status) {
    const orders = this.getAll();
    const idx = orders.findIndex(o => o.id === id);
    if (idx > -1) { orders[idx].status = status; DB.set('rk_orders', orders); }
  },
};

// ── Menu management ──────────────────────────────────────────
const MenuDB = {
  getAll() {
    // FORCE RESET for new image system - ensures version 2.1 is loaded
    const version = localStorage.getItem('rk_menu_version');
    if (version !== '2.1') {
      DB.remove('rk_menu_custom');
      localStorage.setItem('rk_menu_version', '2.1');
      return MENU_DATA;
    }
    const custom = DB.get('rk_menu_custom', null);
    return custom || MENU_DATA;
  },
  save(items) { DB.set('rk_menu_custom', items); },
  add(item) {
    const items = this.getAll();
    item.id = Date.now();
    items.push(item);
    this.save(items);
    return item;
  },
  update(id, data) {
    const items = this.getAll();
    const idx = items.findIndex(i => i.id === id);
    if (idx > -1) { items[idx] = { ...items[idx], ...data }; this.save(items); }
  },
  delete(id) {
    const items = this.getAll().filter(i => i.id !== id);
    this.save(items);
  },
};
