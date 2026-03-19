/* ============================================================
   KAVIN J.S — script.js  v6
   Antigravity-inspired cursor: orbiting ring particles + trails
   + Navbar · Hamburger · Reveal · Algo bars · Active nav
============================================================ */

/* ── 1. CURSOR — ANTIGRAVITY CONFETTI (cursor-only) ──────────
   Particles ONLY appear at the cursor position.
   They burst outward, fall with gravity, and fade out.
   The screen is clean — confetti only exists near/around cursor.
─────────────────────────────────────────────────────────────── */
(function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Green only
  const COLORS = [
    '#4ade80', '#4ade80', '#4ade80',
    '#22c55e', '#22c55e',
    '#86efac',
    '#16a34a',
  ];

  let mx = -500, my = -500;
  let pmx = -500, pmy = -500;
  const particles = [];

  // Spawn a burst of confetti at (x,y)
  function spawn(x, y, count, speedMult) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (1.5 + Math.random() * 3.5) * speedMult;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 1.5, // slight upward bias
        len:   3 + Math.random() * 6,
        width: 1.2 + Math.random() * 1.4,
        rot:   angle,
        rotV:  (Math.random() - 0.5) * 0.12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.9 + Math.random() * 0.1,
        decay: 0.022 + Math.random() * 0.018,
        gravity: 0.08 + Math.random() * 0.05,
        drag:    0.94,
      });
    }
  }

  // Track cursor movement — spawn only when moving
  let lastSpawn = 0;
  document.addEventListener('mousemove', e => {
    pmx = mx; pmy = my;
    mx = e.clientX; my = e.clientY;

    const dx = mx - pmx, dy = my - pmy;
    const speed = Math.sqrt(dx * dx + dy * dy);
    if (speed < 1) return; // don't spawn if barely moving

    const now = performance.now();
    if (now - lastSpawn < 16) return; // max ~60fps spawning
    lastSpawn = now;

    // Scale count with movement speed, 1–5 particles per frame
    spawn(mx, my, Math.min(1 + Math.floor(speed * 0.18), 5), 1);
  }, { passive: true });

  // Big burst on click
  document.addEventListener('mousedown', () => {
    spawn(mx, my, 24, 1.4);
  });

  // Render loop
  function render() {
    ctx.clearRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Physics
      p.vx *= p.drag;
      p.vy  = p.vy * p.drag + p.gravity;
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.rotV;
      p.alpha -= p.decay;

      if (p.alpha <= 0) { particles.splice(i, 1); continue; }

      // Draw dash
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.strokeStyle = p.color;
      ctx.lineWidth   = p.width;
      ctx.lineCap     = 'round';
      ctx.beginPath();
      ctx.moveTo(-p.len / 2, 0);
      ctx.lineTo( p.len / 2, 0);
      ctx.stroke();
      ctx.restore();
    }

    // Sharp cursor dot
    if (mx > -400) {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  render();

  const ring = document.getElementById('cursor-ring');
  if (ring) ring.style.display = 'none';
})();

/* ── 2. NAVBAR ───────────────────────────────────────────── */
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
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── 5. ALGO BARS ────────────────────────────────────────── */
(function () {
  const bars = document.querySelectorAll('.ab');
  if (!bars.length) return;
  const rand = () => bars.forEach(b => b.style.setProperty('--h', (Math.random() * 74 + 16) + '%'));
  rand();
  setInterval(rand, 1700);
})();

/* ── 6. ACTIVE NAV ───────────────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  if (!sections.length || !links.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => {
        const active = a.getAttribute('href') === `#${e.target.id}`;
        a.style.color      = active ? '#fff' : '';
        a.style.fontWeight = active ? '500'  : '';
      });
    });
  }, { threshold: 0.45 });
  sections.forEach(s => io.observe(s));
})();

/* ── 7. HERO PHOTO PARALLAX (subtle) ─────────────────────── */
(function () {
  const photo = document.querySelector('.hero-photo');
  const hero  = document.querySelector('.hero');
  if (!photo || !hero || window.matchMedia('(hover:none)').matches) return;
  hero.addEventListener('mousemove', e => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;
    const y = (e.clientY - top)  / height - 0.5;
    photo.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 4}deg) scale(1.015)`;
  }, { passive: true });
  hero.addEventListener('mouseleave', () => { photo.style.transform = ''; });
})();

/* ── 8. PROJECT CARD 3D TILT ─────────────────────────────── */
(function () {
  if (window.matchMedia('(hover:none)').matches) return;
  document.querySelectorAll('.pj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width  - 0.5;
      const y = (e.clientY - top)  / height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 4}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();
