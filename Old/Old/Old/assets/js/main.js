(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- theme ---------- */
  var toggle = $('#themeToggle');
  var meta = $$('meta[name="theme-color"]');
  function applyTheme(t, persist) {
    doc.setAttribute('data-theme', t);
    if (persist) { try { localStorage.setItem('theme', t); } catch (e) {} }
  }
  if (toggle) toggle.addEventListener('click', function () {
    applyTheme(doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });
  if (window.matchMedia) {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      var saved = null; try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (!saved) applyTheme(e.matches ? 'dark' : 'light', false);
    });
  }

  /* ---------- header: scrolled state, progress bar, mobile menu ---------- */
  var header = $('#header'), bar = $('#progress'), nav = $('#nav'), menuBtn = $('#menuBtn');
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || 0;
      header.classList.toggle('scrolled', y > 8);
      var h = doc.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    $$('.nav-link').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- active section in the nav ---------- */
  var links = $$('.nav-link');
  var map = {}; links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id] !== undefined) {
          links.forEach(function (l) { l.classList.remove('active'); });
          map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = $$('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- count-up ---------- */
  function countUp(el) {
    var target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '', sup = el.querySelector('sup');
    var node = el.childNodes[0];
    function write(v) {
      var t = dec ? v.toFixed(dec) : String(Math.round(v));
      if (sup) node.nodeValue = t; else el.textContent = t + suffix;
    }
    if (reduce) { write(target); return; }
    var start = null, dur = 1300;
    (function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      write(target * e);
      if (p < 1) requestAnimationFrame(step); else write(target);
    })(performance.now());
  }
  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- IST clock ---------- */
  var clock = $('#clock');
  if (clock) {
    var fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    var tick = function () { clock.textContent = fmt.format(new Date()) + ' IST'; };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- copy email ---------- */
  var copy = $('#copyMail'), mail = $('#mail');
  if (copy && mail) copy.addEventListener('click', function () {
    var text = mail.textContent.trim();
    var done = function () { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy'; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { window.location.href = 'mailto:' + text; });
    else window.location.href = 'mailto:' + text;
  });

  /* ---------- misc ---------- */
  var year = $('#year'); if (year) year.textContent = new Date().getFullYear();
  if (reduce) $$('svg.viz').forEach(function (s) { if (s.pauseAnimations) s.pauseAnimations(); });
})();
