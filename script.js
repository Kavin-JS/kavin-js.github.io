/* ============================================================
   KAVIN J.S — script.js  v6
   Antigravity-inspired cursor: orbiting ring particles + trails
   + Navbar · Hamburger · Reveal · Algo bars · Active nav
============================================================ */

/* ── 1. CURSOR — ANTIGRAVITY AMBIENT FIELD ───────────────────
   Matches Google Antigravity EXACTLY (Image 2):
   · Hundreds of tiny colored dots/dashes fill the ENTIRE viewport
   · They float gently, always visible across the whole screen
   · The cursor ATTRACTS / DISTURBS nearby particles as it moves
   · On move: nearby particles scatter outward (repulsion burst)
   · Particles slowly drift back to random idle positions
   · Colors: Google palette — blue, red, yellow, green, purple, etc.
   · No ring. No orbit. Just the ambient confetti field.
─────────────────────────────────────────────────────────────── */
(function initAmbientCursor() {
  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const isTouch = window.matchMedia('(hover: none)').matches;

  let W, H;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });

  // ── Google Antigravity colour palette — brightened for dark bg
  const COLORS = [
    '#60a5fa', '#60a5fa', '#60a5fa', // bright blue (most common)
    '#f87171', '#f87171',             // bright red
    '#fcd34d',                        // bright yellow
    '#4ade80',                        // bright green
    '#c084fc',                        // bright purple
    '#22d3ee',                        // bright cyan
    '#fb923c',                        // bright orange
    '#818cf8',                        // bright indigo
  ];

  // ── Particle count scales with screen size
  const COUNT = () => Math.floor((W * H) / 6000);

  let particles = [];
  let mx = -9999, my = -9999; // cursor off screen initially

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  // Each particle: position, velocity, idle drift, color, shape
  function makeParticle() {
    const angle = Math.random() * Math.PI * 2;
    const isLong = Math.random() > 0.45; // mix of dots and dashes
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: 0,
      vy: 0,
      // Idle drift — very slow natural float
      driftX: randBetween(-0.08, 0.08),
      driftY: randBetween(-0.12, 0.04), // slight upward bias
      // Visual
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha:  randBetween(0.55, 1.0),
      targetAlpha: randBetween(0.5, 1.0),
      len:    isLong ? randBetween(3, 9) : randBetween(1, 2.5),
      width:  randBetween(1.2, 2.2),
      rot:    Math.random() * Math.PI * 2,
      rotV:   randBetween(-0.008, 0.008),
      // State
      scattered: false,
      returnX: 0, returnY: 0, // set when scattered
    };
  }

  function initParticles() {
    const n = COUNT();
    particles = Array.from({ length: n }, makeParticle);
  }
  initParticles();

  // ── Track cursor
  if (!isTouch) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    }, { passive: true });

    // Big burst on click
    document.addEventListener('mousedown', () => {
      particles.forEach(p => {
        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 6;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
          p.scattered = true;
        }
      });
    });
  }

  // ── Render
  const INFLUENCE_RADIUS = 120; // px — cursor disturbs particles within this radius
  const REPEL_STRENGTH   = 0.8;
  const FRICTION         = 0.92;
  const RETURN_SPEED     = 0.015;

  function render() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // ── Cursor repulsion
      if (!isTouch && mx > -9000) {
        const dx   = p.x - mx;
        const dy   = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INFLUENCE_RADIUS && dist > 0) {
          const force  = (INFLUENCE_RADIUS - dist) / INFLUENCE_RADIUS;
          const angle  = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * REPEL_STRENGTH;
          p.vy += Math.sin(angle) * force * REPEL_STRENGTH;
        }
      }

      // ── Idle drift + velocity
      p.vx  = (p.vx + p.driftX) * FRICTION;
      p.vy  = (p.vy + p.driftY) * FRICTION;
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.rotV;

      // ── Wrap around screen edges (particles re-enter from opposite side)
      if (p.x < -20)    p.x = W + 10;
      if (p.x > W + 20) p.x = -10;
      if (p.y < -20)    p.y = H + 10;
      if (p.y > H + 20) p.y = -10;

      // ── Gentle alpha breathing
      p.alpha += (p.targetAlpha - p.alpha) * 0.02;
      if (Math.abs(p.alpha - p.targetAlpha) < 0.01) {
        p.targetAlpha = randBetween(0.45, 1.0);
      }

      // ── Draw particle
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.strokeStyle = p.color;
      ctx.fillStyle   = p.color;
      ctx.lineWidth   = p.width;
      ctx.lineCap     = 'round';

      if (p.len > 2.5) {
        // Dash stroke
        ctx.beginPath();
        ctx.moveTo(-p.len / 2, 0);
        ctx.lineTo( p.len / 2, 0);
        ctx.stroke();
      } else {
        // Tiny dot
        ctx.beginPath();
        ctx.arc(0, 0, p.len, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // ── Cursor dot (sharp white, snaps to cursor instantly)
    if (!isTouch && mx > -9000) {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(mx, my, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  render();

  // Hide the old ring element — not used in this mode
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
