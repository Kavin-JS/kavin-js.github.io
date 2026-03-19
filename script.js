/* ============================================================
   KAVIN J.S — script.js  v6
   Antigravity-inspired cursor: orbiting ring particles + trails
   + Navbar · Hamburger · Reveal · Algo bars · Active nav
============================================================ */

/* ── 1. CURSOR — ANTIGRAVITY CONFETTI-BURST ─────────────────
   Matches Google Antigravity exactly:
   · Coloured dash/streak confetti that BURST outward from cursor
   · Each particle is a short rotated rectangle (not a dot)
   · Physics: initial velocity outward + gravity drag + fade
   · Colours: Google's palette — blue, red, yellow, green, purple
   · Continuous stream while moving, burst on click
   · Tiny sharp dot follows cursor exactly
─────────────────────────────────────────────────────────────── */
(function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ── Mouse state
  let mx = -300, my = -300;
  let pmx = -300, pmy = -300; // previous position (for velocity)
  let isMoving = false;
  let moveTimer;

  // ── Antigravity colour palette — exact hues from the site
  const COLORS = [
    '#4285F4', // Google blue
    '#EA4335', // Google red
    '#FBBC05', // Google yellow
    '#34A853', // Google green
    '#AB47BC', // purple
    '#00ACC1', // cyan
    '#FF7043', // deep orange
    '#7E57C2', // deep purple
  ];

  // ── Confetti particle pool
  const particles = [];

  function spawnConfetti(x, y, vxBase, vyBase, count) {
    for (let i = 0; i < count; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const speed  = 1.5 + Math.random() * 4.5;
      const color  = COLORS[Math.floor(Math.random() * COLORS.length)];

      particles.push({
        x, y,
        // Outward burst + bias from mouse velocity
        vx: Math.cos(angle) * speed + vxBase * 0.25,
        vy: Math.sin(angle) * speed + vyBase * 0.25,
        // Each particle is a short dash stroke
        len:    4 + Math.random() * 7,      // stroke length
        width:  1.5 + Math.random() * 1.5,  // stroke width
        rot:    angle,                       // initial rotation = launch angle
        color,
        alpha:  0.85 + Math.random() * 0.15,
        decay:  0.018 + Math.random() * 0.022,
        gravity:0.06 + Math.random() * 0.06, // slight downward pull
        drag:   0.96,                        // air resistance
      });
    }
  }

  // ── Continuous gentle stream while mouse moves
  let lastSpawn = 0;
  document.addEventListener('mousemove', e => {
    const dx = e.clientX - mx;
    const dy = e.clientY - my;
    pmx = mx; pmy = my;
    mx = e.clientX; my = e.clientY;

    isMoving = true;
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => { isMoving = false; }, 80);

    // Throttle: spawn every ~20ms during movement
    const now = performance.now();
    if (now - lastSpawn > 20) {
      lastSpawn = now;
      const speed = Math.sqrt(dx * dx + dy * dy);
      // More particles the faster you move
      const count = Math.min(2 + Math.floor(speed * 0.2), 6);
      spawnConfetti(mx, my, dx, dy, count);
    }
  }, { passive: true });

  // ── Big burst on click
  document.addEventListener('mousedown', () => {
    spawnConfetti(mx, my, 0, 0, 28);
  });

  // ── Render loop
  function render() {
    ctx.clearRect(0, 0, W, H);

    // Update + draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Physics
      p.vx   *= p.drag;
      p.vy    = p.vy * p.drag + p.gravity;
      p.x    += p.vx;
      p.y    += p.vy;
      p.alpha -= p.decay;
      p.rot  += 0.04; // gentle spin

      if (p.alpha <= 0) { particles.splice(i, 1); continue; }

      // Draw as a short angled dash (matching Antigravity's stroke style)
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

    // ── Cursor dot — sharp white dot, snaps instantly to cursor
    if (mx > -200) {
      // Soft halo
      const halo = ctx.createRadialGradient(mx, my, 0, mx, my, 16);
      halo.addColorStop(0, 'rgba(255,255,255,0.12)');
      halo.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(mx, my, 16, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // Dot
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 1;
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();

  // ── Hide #cursor-ring — not needed for confetti style
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
