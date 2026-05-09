/* ============================================================
   MAIN.JS — Global JS: cursor, navbar, particles, animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initNavbar();
  initCursor();
  initParticles();
  initRevealAnimations();
  initThemeToggle();
  initHamburger();
  updateNavAuth();
});

// ── Loading Screen ──────────────────────────────────────────────
function initLoadingScreen() {
  const screen = document.getElementById('loadingScreen');
  if (!screen) return;
  const hide = () => {
    screen.classList.add('hidden');
    setTimeout(() => screen.remove(), 700);
  };
  // Hide when loaded or after max 2.5s
  if (document.readyState === 'complete') { setTimeout(hide, 600); }
  else { window.addEventListener('load', () => setTimeout(hide, 600)); }
  setTimeout(hide, 2500);
}

// ── Navbar scroll effect ─────────────────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
}

// ── Custom cursor ────────────────────────────────────────────
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  let raf;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const lerp = (a, b, t) => a + (b - a) * t;
  const tick = () => {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(tick);
  };
  tick();

  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '0.7'; });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
}

// ── Particle background ─────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const count = Math.min(60, Math.floor(W * H / 22000));

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.6 + 0.1,
      gold: Math.random() > 0.5,
    });
  }

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(212,168,67,${p.a})`
        : `rgba(192,57,43,${p.a * 0.6})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  };
  draw();
}

// ── Reveal on scroll ─────────────────────────────────────────
function initRevealAnimations() {
  const els = document.querySelectorAll('.reveal-up');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

// ── Theme toggle ─────────────────────────────────────────────
function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const html = document.documentElement;
  const saved = localStorage.getItem('rk_theme') || 'dark';
  html.setAttribute('data-theme', saved);
  if (btn) {
    btn.querySelector('.theme-icon').textContent = saved === 'dark' ? '☀️' : '🌙';
    btn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('rk_theme', next);
      btn.querySelector('.theme-icon').textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }
}

// ── Hamburger mobile menu ────────────────────────────────────
function initHamburger() {
  const ham   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!ham || !links) return;

  ham.addEventListener('click', () => {
    ham.classList.toggle('active');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      ham.classList.remove('active');
      links.classList.remove('open');
    })
  );
}

// ── Update nav based on auth state ───────────────────────────
function updateNavAuth() {
  const loginBtn = document.getElementById('loginBtn');
  if (!loginBtn) return;
  const user = UserDB.getCurrent();
  if (user) {
    loginBtn.textContent = user.name.split(' ')[0];
    loginBtn.href = user.role === 'admin' ? 'admin.html' : '#';
  } else {
    loginBtn.textContent = 'Login';
    loginBtn.href = 'login.html';
  }
}

// ── Parallax helper ──────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.3;
    const rect  = el.closest('section')?.getBoundingClientRect() || el.getBoundingClientRect();
    el.style.transform = `translateY(${-rect.top * speed * 0.3}px)`;
  });
}, { passive: true });

// ── Counter animation ────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = +el.dataset.target;
    const dur = 1800;
    const step = target / (dur / 16);
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur);
      if (cur >= target) clearInterval(timer);
    }, 16);
  });
}

// Trigger counter when hero stats are visible
const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  const statsIO = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); statsIO.disconnect(); }
  }, { threshold: 0.5 });
  statsIO.observe(statsEl);
}
// ── Image load handling ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');
  const handleLoad = (img) => img.classList.add('loaded');
  images.forEach(img => {
    if (img.complete) handleLoad(img);
    else img.addEventListener('load', () => handleLoad(img));
    // Diagnostic error log
    img.addEventListener('error', () => {
      console.error('❌ Failed to load:', img.src);
      img.style.display = 'none'; // Hide broken images
    });
  });
});
