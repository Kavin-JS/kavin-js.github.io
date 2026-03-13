/* ═══════════════════════════════════════════
   KAVIN JS — PORTFOLIO SCRIPTS
   main.js
═══════════════════════════════════════════ */

/* ── THEME TOGGLE ── */
const html    = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
const ICONS   = { dark: '🌙', light: '☀️' };

function applyTheme(t) {
  html.setAttribute('data-theme', t);
  themeBtn.textContent = ICONS[t];
  localStorage.setItem('theme', t);
}

// Detect system preference and apply saved or system theme
const sysDark = window.matchMedia('(prefers-color-scheme: dark)');
const saved   = localStorage.getItem('theme');
applyTheme(saved || (sysDark.matches ? 'dark' : 'light'));

// React to system changes only if user hasn't manually picked
sysDark.addEventListener('change', e => {
  if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light');
});

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* ── CURSOR ── */
const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
const spot = document.getElementById('spotlight');

let mx = innerWidth / 2, my = innerHeight / 2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
  spot.style.setProperty('--sx', mx + 'px');
  spot.style.setProperty('--sy', my + 'px');
});

// Ring follows with smooth spring lerp — no weird snapping
(function ringLoop() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(ringLoop);
})();

// Grow ring on interactive elements
document.querySelectorAll('a, button, .glass, .pill, .proj-card, .shono-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('big'));
  el.addEventListener('mouseleave', () => ring.classList.remove('big'));
});

document.addEventListener('mousedown', () => ring.classList.add('click'));
document.addEventListener('mouseup',   () => ring.classList.remove('click'));

/* ── SUBTLE TRAIL ── */
// 6 small dots spaced along recent mouse path — understated, not distracting
const TRAIL_LEN = 6;
const trailDots = [];

for (let i = 0; i < TRAIL_LEN; i++) {
  const d = document.createElement('div');
  d.className = 'tr';
  const sz = 5 - i * 0.6;
  d.style.cssText = `width:${sz}px;height:${sz}px;opacity:0;background:var(--purple-l);`;
  document.body.appendChild(d);
  trailDots.push(d);
}

const mouseHistory = [];
document.addEventListener('mousemove', e => {
  mouseHistory.push({ x: e.clientX, y: e.clientY });
  if (mouseHistory.length > 80) mouseHistory.shift();
});

(function trailLoop() {
  for (let i = 0; i < TRAIL_LEN; i++) {
    const idx = Math.max(0, mouseHistory.length - 1 - i * 5);
    const p   = mouseHistory[idx];
    if (p) {
      trailDots[i].style.left    = p.x + 'px';
      trailDots[i].style.top     = p.y + 'px';
      trailDots[i].style.opacity = (1 - i / TRAIL_LEN) * 0.4;
    }
  }
  requestAnimationFrame(trailLoop);
})();

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll(
  '.btn-grad, .btn-out, .nav-cta, .shono-btn-live, .shono-btn-gh'
).forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── LEETCODE SVG RING ANIMATION TRIGGER ── */
// Re-trigger animation when scrolled into view
const lcRing = document.querySelector('.lc-ring-circle');
if (lcRing) {
  const lcObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        lcRing.style.animation = 'none';
        lcRing.getBoundingClientRect(); // reflow
        lcRing.style.animation = '';
      }
    });
  }, { threshold: 0.5 });
  lcObs.observe(lcRing);
}
