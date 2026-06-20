/* ═══════════════════════════════════════════════════
   THE ROYAL TASTE — script.js
═══════════════════════════════════════════════════ */

'use strict';

/* ── Navbar: scroll state & hamburger ─────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') && !navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ── Hero image subtle ken-burns on load ──────────────── */
(function initHeroBg() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  heroBg.addEventListener('load', () => heroBg.classList.add('loaded'));
  if (heroBg.complete) heroBg.classList.add('loaded');
})();

/* ── Scroll Reveal ────────────────────────────────────── */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // Stagger sibling reveals
      const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
      const index    = siblings.indexOf(el);
      setTimeout(() => el.classList.add('visible'), index * 80);
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ── Menu Tabs ────────────────────────────────────────── */
(function initTabs() {
  const tabBtns  = document.querySelectorAll('.tab-btn');
  const panels   = document.querySelectorAll('.menu-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b  => b.classList.remove('active'));
      panels.forEach(p   => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById('tab-' + target);
      if (activePanel) {
        activePanel.classList.add('active');
        // Re-trigger reveals inside the newly shown panel
        activePanel.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 80);
        });
      }
    });
  });
})();

/* ── Reservation Form ─────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('reservationForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  // Set minimum date to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Confirming…';
    btn.disabled = true;

    // Simulate async API call
    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('visible');
    }, 1200);
  });
})();

/* ── Back to Top ──────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── Smooth active nav link highlight on scroll ───────── */
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--gold)'
          : '';
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ── Parallax: hero content subtle drift ─────────────── */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function onScroll() {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── Gallery: lightbox-style overlay ─────────────────── */
(function initGalleryLightbox() {
  const items = document.querySelectorAll('.masonry-item');
  if (!items.length) return;

  // Create lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-content">
      <img src="" alt="" class="lb-img" />
      <p class="lb-caption"></p>
      <button class="lb-close" aria-label="Close">✕</button>
    </div>
  `;
  // Inject inline style for lightbox (kept here so CSS file stays clean)
  const lbStyle = document.createElement('style');
  lbStyle.textContent = `
    #lightbox { position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s; }
    #lightbox.open { opacity:1;pointer-events:auto; }
    .lb-backdrop { position:absolute;inset:0;background:rgba(0,0,0,.9);cursor:pointer; }
    .lb-content { position:relative;z-index:1;max-width:90vw;max-height:88vh;display:flex;flex-direction:column;align-items:center;gap:12px; }
    .lb-img { max-width:90vw;max-height:82vh;object-fit:contain;border-radius:2px;width:auto;height:auto; }
    .lb-caption { font-family:'Playfair Display',serif;font-style:italic;color:rgba(255,255,255,.7);font-size:.9rem; }
    .lb-close { position:absolute;top:-20px;right:-20px;width:36px;height:36px;background:var(--gold,#D4AF37);color:#000;border-radius:50%;font-size:1rem;line-height:36px;text-align:center;cursor:pointer;border:none;transition:.2s; }
    .lb-close:hover { transform:scale(1.1); }
  `;
  document.head.appendChild(lbStyle);
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('.lb-img');
  const lbCaption = lb.querySelector('.lb-caption');

  function openLb(src, caption) {
    lbImg.src = src.replace(/w=\d+/, 'w=1400');
    lbCaption.textContent = caption;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img     = item.querySelector('img');
      const caption = item.querySelector('.gallery-overlay span')?.textContent || '';
      openLb(img.src, caption);
    });
    item.style.cursor = 'pointer';
  });

  lb.querySelector('.lb-backdrop').addEventListener('click', closeLb);
  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
})();

/* ── Newsletter form (footer) ─────────────────────────── */
(function initNewsletter() {
  const form  = document.querySelector('.newsletter-form');
  if (!form) return;
  const input = form.querySelector('input');
  const btn   = form.querySelector('button');

  btn.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val || !val.includes('@')) {
      input.style.borderColor = '#e74c3c';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
      return;
    }
    btn.textContent = '✓ Joined';
    btn.disabled = true;
    input.disabled = true;
    input.style.opacity = '.5';
  });
})();

/* ── Stagger menu items on first load ─────────────────── */
(function staggerInitialMenuItems() {
  const firstPanel = document.querySelector('.menu-panel.active');
  if (!firstPanel) return;
  firstPanel.querySelectorAll('.reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 400 + i * 100);
  });
})();