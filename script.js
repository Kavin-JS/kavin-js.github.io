/* ============================================================
   KAVIN J.S — script.js  v5
   Cursor · Navbar · Hamburger · Reveal · Algo bars · Active nav
   Card tilt · Photo parallax
============================================================ */

/* ── 1. CURSOR ───────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(hover:none)').matches) return;
  const dot   = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (!dot || !trail) return;

  let mx = -80, my = -80, tx = -80, ty = -80;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  }, { passive: true });

  // Trail lags behind
  (function loop() {
    tx += (mx - tx) * 0.1;
    ty += (my - ty) * 0.1;
    trail.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  // Grow cursor on interactive elements
  document.querySelectorAll('a, button, .skill-tags span, .pcard, .bento-card, .clink')
    .forEach(el => {
      el.addEventListener('mouseenter', () => dot.classList.add('grow'));
      el.addEventListener('mouseleave', () => dot.classList.remove('grow'));
    });
})();

/* ── 2. NAVBAR SCROLL ────────────────────────────────────── */
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const run = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', run, { passive: true });
  run();
})();

/* ── 3. HAMBURGER ────────────────────────────────────────── */
(function () {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  const open  = () => { links.classList.add('open');    btn.classList.add('open');    document.body.style.overflow = 'hidden'; };
  const close = () => { links.classList.remove('open'); btn.classList.remove('open'); document.body.style.overflow = ''; };

  btn.addEventListener('click', () => links.classList.contains('open') ? close() : open());
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── 4. SCROLL REVEAL ────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal-up');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ── 5. ALGO BARS ANIMATION ──────────────────────────────── */
(function () {
  const bars = document.querySelectorAll('.algobar');
  if (!bars.length) return;
  const rand = () => bars.forEach(b => b.style.setProperty('--h', (Math.random() * 74 + 16) + '%'));
  rand();
  setInterval(rand, 1700);
})();

/* ── 6. ACTIVE NAV HIGHLIGHT ─────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a:not(.nav-hire)');
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => {
        const active = a.getAttribute('href') === `#${e.target.id}`;
        a.style.color      = active ? 'var(--text)' : '';
        a.style.fontWeight = active ? '500' : '';
      });
    });
  }, { threshold: 0.42 });

  sections.forEach(s => io.observe(s));
})();

/* ── 7. HERO PHOTO PARALLAX ──────────────────────────────── */
(function () {
  const photo = document.querySelector('.hero-photo');
  if (!photo || window.matchMedia('(hover:none)').matches) return;

  window.addEventListener('mousemove', e => {
    const xFrac = (e.clientX / window.innerWidth  - 0.5) * 2;
    const yFrac = (e.clientY / window.innerHeight - 0.5) * 2;
    photo.style.transform = `perspective(800px) rotateY(${xFrac * 4}deg) rotateX(${-yFrac * 3}deg) scale(1.02)`;
  }, { passive: true });

  document.querySelector('.hero')?.addEventListener('mouseleave', () => {
    photo.style.transform = '';
  });
})();

/* ── 8. PROJECT CARD SUBTLE TILT ─────────────────────────── */
(function () {
  if (window.matchMedia('(hover:none)').matches) return;
  document.querySelectorAll('.pcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width  - 0.5;
      const y = (e.clientY - top)  / height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 5}deg) rotateX(${-y * 4}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();
