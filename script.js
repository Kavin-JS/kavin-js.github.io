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

/* ── 8. SCRATCH CARD PHOTO REVEAL ────────────────────────────
   Canvas sits over the photo. Drawing with destination-out
   compositing erases the cover layer — revealing the photo.
   Tracks % revealed; auto-completes at 55% scratched.
─────────────────────────────────────────────────────────────── */
(function initScratchCard() {
  const wrap   = document.getElementById('scratch-wrap');
  const canvas = document.getElementById('scratch-canvas');
  const hint   = document.getElementById('scratch-hint');
  const done   = document.getElementById('scratch-done');
  const photo  = document.getElementById('scratch-photo');
  if (!wrap || !canvas || !photo) return;

  const ctx = canvas.getContext('2d');
  let W, H, isDrawing = false, revealed = false, hintHidden = false;

  // ── Fill canvas with the scratch cover once photo loads ───
  function initCover() {
    W = canvas.width  = wrap.offsetWidth;
    H = canvas.height = wrap.offsetHeight;

    // Dark textured cover — grid of dots like a real scratch card
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    // Dot-pattern texture
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let x = 0; x < W; x += 8) {
      for (let y = 0; y < H; y += 8) {
        if ((x / 8 + y / 8) % 2 === 0) ctx.fillRect(x, y, 4, 4);
      }
    }

    // Green shimmer label in centre
    ctx.save();
    ctx.font = '500 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.2em';

    // Subtle repeating text rows
    ctx.fillStyle = 'rgba(74,222,128,0.07)';
    for (let row = 30; row < H; row += 44) {
      ctx.fillText('✦  SCRATCH TO REVEAL  ✦  SCRATCH TO REVEAL  ✦', W / 2, row);
    }
    ctx.restore();

    // Green border glow on cover
    ctx.save();
    ctx.strokeStyle = 'rgba(74,222,128,0.2)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, W - 2, H - 2);
    ctx.restore();
  }

  // Wait for photo to load before sizing canvas
  if (photo.complete) {
    initCover();
  } else {
    photo.addEventListener('load', initCover, { once: true });
  }
  window.addEventListener('resize', initCover, { passive: true });

  // ── Scratch at position (x, y) ────────────────────────────
  const BRUSH = 38; // scratch brush radius in px

  function scratch(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();

    // Soft eraser — radial gradient for feathered edges
    const grad = ctx.createRadialGradient(x, y, 0, x, y, BRUSH);
    grad.addColorStop(0,   'rgba(0,0,0,1)');
    grad.addColorStop(0.6, 'rgba(0,0,0,0.8)');
    grad.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.arc(x, y, BRUSH, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';

    // Hide hint after first scratch
    if (!hintHidden) {
      hintHidden = true;
      hint?.classList.add('hide');
    }
  }

  // ── Check % revealed ──────────────────────────────────────
  let checkTimer;
  function checkReveal() {
    clearTimeout(checkTimer);
    checkTimer = setTimeout(() => {
      const px    = ctx.getImageData(0, 0, W, H).data;
      let transparent = 0;
      // Sample every 16th pixel for performance
      for (let i = 3; i < px.length; i += 64) {
        if (px[i] < 128) transparent++;
      }
      const pct = transparent / (px.length / 64);
      if (pct > 0.55 && !revealed) completeReveal();
    }, 150);
  }

  // ── Full reveal animation ─────────────────────────────────
  function completeReveal() {
    revealed = true;
    let alpha = 1;
    const fade = setInterval(() => {
      alpha -= 0.035;
      ctx.clearRect(0, 0, W, H);
      if (alpha > 0) {
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      } else {
        clearInterval(fade);
        canvas.style.pointerEvents = 'none'; // disable canvas after reveal
      }
    }, 18);

    // Show ✓ badge
    setTimeout(() => done?.classList.add('show'), 400);
  }

  // ── Pointer events (mouse + touch) ───────────────────────
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (W / rect.width),
      y: (src.clientY - rect.top)  * (H / rect.height),
    };
  }

  canvas.addEventListener('mousedown', e => {
    isDrawing = true;
    const p = getPos(e); scratch(p.x, p.y);
  });
  canvas.addEventListener('mousemove', e => {
    if (!isDrawing || revealed) return;
    const p = getPos(e); scratch(p.x, p.y); checkReveal();
  });
  canvas.addEventListener('mouseup',   () => { isDrawing = false; checkReveal(); });
  canvas.addEventListener('mouseleave',() => { isDrawing = false; });

  // Touch support
  canvas.addEventListener('touchstart', e => {
    e.preventDefault(); isDrawing = true;
    const p = getPos(e); scratch(p.x, p.y);
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!isDrawing || revealed) return;
    const p = getPos(e); scratch(p.x, p.y); checkReveal();
  }, { passive: false });
  canvas.addEventListener('touchend', () => { isDrawing = false; checkReveal(); });
})();
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
