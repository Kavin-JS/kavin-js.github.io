/* ============================================================
   KAVIN J.S — script.js  v6
   Antigravity-inspired cursor: orbiting ring particles + trails
   + Navbar · Hamburger · Reveal · Algo bars · Active nav
============================================================ */

/* ── 1. CURSOR — RING PARTICLE SYSTEM ────────────────────────
   Mimics the Google Antigravity orbital ring cursor:
   - A sharp inner dot
   - A lagging outer ring
   - Multiple orbiting particles that ring around the cursor
   - Comet-style trailing particles that decay over time
─────────────────────────────────────────────────────────────── */
(function initCursor() {
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  // ── State
  let mx = -200, my = -200;          // mouse position
  let rx = -200, ry = -200;          // ring (lagging)
  let isHovering = false;

  const GREEN    = { r: 74, g: 222, b: 128 };
  const WHITE    = { r: 240, g: 240, b: 240 };

  // ── Trailing comet particles
  const TRAIL_MAX = 28;
  const trail = [];

  // ── Orbiting particles (ring)
  const ORBIT_COUNT = 8;
  const orbiters = Array.from({ length: ORBIT_COUNT }, (_, i) => ({
    angle:  (i / ORBIT_COUNT) * Math.PI * 2,
    speed:  0.028 + (i % 2 === 0 ? 0.008 : 0),
    radius: 24 + (i % 3) * 4,
    size:   1.2 + (i % 2) * 0.8,
    alpha:  0.5 + (i % 3) * 0.15,
  }));

  // ── Helper: lerp
  const lerp = (a, b, t) => a + (b - a) * t;

  // ── Resize
  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }, { passive: true });

  // ── Mouse tracking
  if (!isTouchDevice) {
    document.addEventListener('mousemove', e => {
      // Push trail particle
      trail.push({ x: mx, y: my, alpha: 1, size: 2.5 });
      if (trail.length > TRAIL_MAX) trail.shift();
      mx = e.clientX; my = e.clientY;
    }, { passive: true });
  }

  // ── Hover states on interactive elements
  const interactEls = () => document.querySelectorAll('a, button, .sk-tags span, .pj-card, .bc, .cl');
  const bindHover   = () => {
    interactEls().forEach(el => {
      el.addEventListener('mouseenter', () => { isHovering = true; });
      el.addEventListener('mouseleave', () => { isHovering = false; });
    });
  };
  bindHover();
  // Rebind after DOM updates (none expected but safe)
  setTimeout(bindHover, 1500);

  // ── Draw frame
  function draw() {
    ctx.clearRect(0, 0, W, H);

    if (mx < -100) { requestAnimationFrame(draw); return; } // hide before first move

    // Lerp ring toward cursor
    rx = lerp(rx, mx, 0.11);
    ry = lerp(ry, my, 0.11);

    const tHover = isHovering ? 1 : 0;
    const ringR  = lerp(18, 32, tHover);
    const dotR   = lerp(3.5, 5, tHover);

    // ── Trail comet particles
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      p.alpha *= 0.82;
      p.size  *= 0.92;
      if (p.alpha < 0.01) { trail.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GREEN.r},${GREEN.g},${GREEN.b},${p.alpha * 0.35})`;
      ctx.fill();
    }

    // ── Outer ring
    ctx.beginPath();
    ctx.arc(rx, ry, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${GREEN.r},${GREEN.g},${GREEN.b},${lerp(0.3, 0.55, tHover)})`;
    ctx.lineWidth   = lerp(1, 1.5, tHover);
    ctx.stroke();

    // Outer ring glow
    const glowGrad = ctx.createRadialGradient(rx, ry, ringR - 4, rx, ry, ringR + 10);
    glowGrad.addColorStop(0, `rgba(${GREEN.r},${GREEN.g},${GREEN.b},${lerp(0.06, 0.14, tHover)})`);
    glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(rx, ry, ringR + 10, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // ── Orbiting particles
    orbiters.forEach(orb => {
      orb.angle += orb.speed * (isHovering ? 1.5 : 1);
      const px = rx + Math.cos(orb.angle) * (ringR * 1.15 + orb.radius * tHover * 0.4);
      const py = ry + Math.sin(orb.angle) * (ringR * 1.15 + orb.radius * tHover * 0.4);

      // Glow behind particle
      const pgGrad = ctx.createRadialGradient(px, py, 0, px, py, orb.size * 4);
      pgGrad.addColorStop(0, `rgba(${GREEN.r},${GREEN.g},${GREEN.b},${orb.alpha * 0.5})`);
      pgGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(px, py, orb.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = pgGrad;
      ctx.fill();

      // Particle dot
      ctx.beginPath();
      ctx.arc(px, py, orb.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GREEN.r},${GREEN.g},${GREEN.b},${orb.alpha})`;
      ctx.fill();
    });

    // ── Inner dot (snaps to exact mouse position)
    ctx.beginPath();
    ctx.arc(mx, my, dotR, 0, Math.PI * 2);
    const dotGrad = ctx.createRadialGradient(mx, my, 0, mx, my, dotR * 2.5);
    dotGrad.addColorStop(0, `rgba(${WHITE.r},${WHITE.g},${WHITE.b},1)`);
    dotGrad.addColorStop(0.5, `rgba(${GREEN.r},${GREEN.g},${GREEN.b},0.8)`);
    dotGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = dotGrad;
    ctx.fill();

    // Inner dot glow
    const idGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 14);
    idGrad.addColorStop(0, `rgba(${GREEN.r},${GREEN.g},${GREEN.b},0.2)`);
    idGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(mx, my, 14, 0, Math.PI * 2);
    ctx.fillStyle = idGrad;
    ctx.fill();

    requestAnimationFrame(draw);
  }

  if (!isTouchDevice) draw();
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
