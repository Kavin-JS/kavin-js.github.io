(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- theme: auto (follows the device) / light / dark ---------- */
  var toggle = $('#themeToggle');
  var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  var MODES = ['auto', 'light', 'dark'];
  var LABEL = { auto: 'Auto (follows your device)', light: 'Light', dark: 'Dark' };
  var hint = document.createElement('div'); hint.className = 'theme-hint'; hint.setAttribute('role', 'status'); document.body.appendChild(hint);
  var hintTimer;
  function getMode() { var m = 'auto'; try { var s = localStorage.getItem('theme'); if (s === 'light' || s === 'dark') m = s; } catch (e) {} return m; }
  function applyMode(mode, announce) {
    var dark = mode === 'dark' || (mode === 'auto' && mq && mq.matches);
    doc.setAttribute('data-theme', dark ? 'dark' : 'light');
    doc.setAttribute('data-theme-mode', mode);
    if (toggle) {
      var next = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
      toggle.title = 'Theme: ' + LABEL[mode];
      toggle.setAttribute('aria-label', 'Theme: ' + LABEL[mode] + '. Switch to ' + LABEL[next] + '.');
    }
    if (announce) {
      hint.textContent = 'Theme: ' + LABEL[mode]; hint.classList.add('show');
      clearTimeout(hintTimer); hintTimer = setTimeout(function () { hint.classList.remove('show'); }, 1600);
    }
  }
  if (toggle) toggle.addEventListener('click', function () {
    var m = MODES[(MODES.indexOf(getMode()) + 1) % MODES.length];
    try { if (m === 'auto') localStorage.removeItem('theme'); else localStorage.setItem('theme', m); } catch (e) {}
    applyMode(m, true);
  });
  if (mq) {
    var onChange = function () { if (getMode() === 'auto') applyMode('auto', false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }
  applyMode(getMode(), false);

  /* ---------- header: scrolled state, progress bar, mobile menu ---------- */
  var header = $('#header'), bar = $('#progress'), nav = $('#nav'), menuBtn = $('#menuBtn');
  var ticking = false;
  var feats = $$('.feature'), railLinks = $$('.stack-rail a');
  var stackMQ = window.matchMedia ? matchMedia('(min-width: 761px)') : { matches: false };
  function stackUpdate() {
    if (!feats.length) return;
    var on = stackMQ.matches && !reduce, hh = header ? header.offsetHeight : 68, cur = 0;
    feats.forEach(function (f, i) {
      var p = 0;
      if (on && feats[i + 1]) {
        var r = f.getBoundingClientRect(), n = feats[i + 1].getBoundingClientRect();
        p = Math.min(1, Math.max(0, (r.bottom - n.top) / r.height));
      }
      f.style.setProperty('--sc', (1 - 0.05 * p).toFixed(4));
      f.style.setProperty('--dim', (0.42 * p).toFixed(3));
      if (f.getBoundingClientRect().top <= hh + 90 + i * 16) cur = i;
    });
    railLinks.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
  }
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || 0;
      header.classList.toggle('scrolled', y > 8);
      var h = doc.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      stackUpdate();
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
  var clocks = $$('#clock, #clock2');
  if (clocks.length) {
    var fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    var tick = function () { var t = fmt.format(new Date()) + ' IST'; clocks.forEach(function (c) { c.textContent = t; }); };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- pointer spotlight on cards and the hero grid ---------- */
  if (!reduce && window.matchMedia && matchMedia('(hover: hover)').matches) {
    var sel = '.feature, .card, .skill-card, .entry, .cert, .profile, .tile, .note';
    document.addEventListener('pointermove', function (e) {
      var t = e.target.closest ? e.target.closest(sel) : null;
      if (t) { var r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px'); }
    }, { passive: true });
    var hero = $('.hero');
    if (hero) {
      hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); hero.style.setProperty('--hx', (e.clientX - r.left) + 'px'); hero.style.setProperty('--hy', (e.clientY - r.top) + 'px'); }, { passive: true });
      hero.addEventListener('pointerleave', function () { hero.style.setProperty('--hx', '-400px'); hero.style.setProperty('--hy', '-400px'); });
    }
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
