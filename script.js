/* ============================================================
   KAVIN J.S — PORTFOLIO JAVASCRIPT  v3
   Canvas BG · Custom Cursor · Navbar · Reveal · Hamburger
   Algo Bars · Active Nav · Typing effect
============================================================ */

/* ── 1. BACKGROUND CANVAS ─────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  // Reduce count on mobile for perf
  const COUNT  = window.innerWidth < 768 ? 30 : 50;
  const A      = { r: 59, g: 130, b: 246 };
  const LINK   = 130; // max connection distance

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = init ? Math.random() * W : (Math.random() > 0.5 ? 0 : W);
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.2 + 0.4;
      const speed = Math.random() * 0.18 + 0.06;
      const ang   = Math.random() * Math.PI * 2;
      this.vx = Math.cos(ang) * speed;
      this.vy = Math.sin(ang) * speed;
      this.alpha = Math.random() * 0.45 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${A.r},${A.g},${A.b},${this.alpha})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${A.r},${A.g},${A.b},${(1 - d / LINK) * 0.1})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  let raf;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    raf = requestAnimationFrame(loop);
  }

  // Pause when tab hidden for perf
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else loop();
  });

  resize();
  init();
  loop();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); init(); }, 200);
  }, { passive: true });
})();

/* ── 2. CUSTOM CURSOR ─────────────────────────────────────── */
(function initCursor() {
  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  }, { passive: true });

  (function animRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(animRing);
  })();

  const hoverEls = document.querySelectorAll('a, button, .skill-pill, .project-card, .building-card, .contact-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
})();

/* ── 3. NAVBAR SCROLL ─────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ── 4. HAMBURGER MENU ────────────────────────────────────── */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  const open  = () => {
    links.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    links.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () =>
    links.classList.contains('open') ? close() : open()
  );

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && links.classList.contains('open')) close();
  });
})();

/* ── 5. SCROLL REVEAL ─────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ── 6. ALGO BARS ANIMATION ───────────────────────────────── */
(function initAlgoBars() {
  const card = document.querySelector('.project-img-placeholder.algo');
  if (!card) return;

  const bars = card.querySelectorAll('.bar');
  const randomize = () => {
    bars.forEach(b => b.style.setProperty('--h', Math.floor(Math.random() * 72 + 20) + '%'));
  };

  randomize();
  setInterval(randomize, 1500);
})();

/* ── 7. ACTIVE NAV HIGHLIGHT ──────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(a => {
        const active = a.getAttribute('href') === `#${id}`;
        a.style.color = active ? 'var(--white)' : '';
      });
    });
  }, { threshold: 0.45 });

  sections.forEach(s => io.observe(s));
})();

/* ── 8. JARVIS RING GLOW ON HOVER ─────────────────────────── */
(function initJarvisGlow() {
  const card = document.querySelector('.project-img-placeholder.jarvis');
  if (!card) return;
  const rings = card.querySelectorAll('.jr');

  card.closest('.project-card').addEventListener('mouseenter', () => {
    rings.forEach(r => r.style.borderColor = 'rgba(59,130,246,0.55)');
  });
  card.closest('.project-card').addEventListener('mouseleave', () => {
    rings.forEach((r, i) => {
      const opacities = [0.35, 0.2, 0.1];
      r.style.borderColor = `rgba(59,130,246,${opacities[i] || 0.1})`;
    });
  });
})();
