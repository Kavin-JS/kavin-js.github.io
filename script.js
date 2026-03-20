(function () {

  /* ── 1. GREEN CONFETTI CURSOR ─────────────────────────────── */
  var cc = document.getElementById('cc');
  if (cc) {
    var ctx = cc.getContext('2d');
    var W, H;
    function resize() { W = cc.width = window.innerWidth; H = cc.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    var G = ['#4ade80','#4ade80','#4ade80','#22c55e','#22c55e','#86efac','#16a34a'];
    var pts = [], mx = -999, my = -999, pmx = -999, pmy = -999, lastT = 0;
    var touch = window.matchMedia('(hover:none)').matches;

    if (!touch) {
      document.body.classList.add('js-cursor');
      document.addEventListener('mousemove', function (e) {
        pmx = mx; pmy = my; mx = e.clientX; my = e.clientY;
        var dx = mx - pmx, dy = my - pmy, spd = Math.sqrt(dx*dx+dy*dy);
        if (spd < 1) return;
        var now = performance.now();
        if (now - lastT < 16) return;
        lastT = now;
        var n = Math.min(1 + Math.floor(spd * 0.18), 5);
        for (var i = 0; i < n; i++) spawn(mx, my, 1);
      }, { passive: true });
      document.addEventListener('mousedown', function () {
        for (var i = 0; i < 24; i++) spawn(mx, my, 1.5);
      });
    }

    function spawn(x, y, sm) {
      var a = Math.random() * Math.PI * 2, s = (1.5 + Math.random() * 3.5) * sm;
      pts.push({ x:x, y:y, vx:Math.cos(a)*s, vy:Math.sin(a)*s - Math.random()*1.5,
        len:3+Math.random()*6, w:1.2+Math.random()*1.4, rot:a, rv:(Math.random()-.5)*.12,
        col:G[Math.floor(Math.random()*G.length)], al:.9+Math.random()*.1,
        dc:.022+Math.random()*.018, gv:.08+Math.random()*.05, dr:.94 });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = pts.length - 1; i >= 0; i--) {
        var p = pts[i];
        p.vx *= p.dr; p.vy = p.vy * p.dr + p.gv;
        p.x += p.vx; p.y += p.vy; p.rot += p.rv; p.al -= p.dc;
        if (p.al <= 0) { pts.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = p.al;
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.strokeStyle = p.col; ctx.lineWidth = p.w; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-p.len/2, 0); ctx.lineTo(p.len/2, 0); ctx.stroke();
        ctx.restore();
      }
      if (!touch && mx > -900) {
        ctx.save(); ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(mx, my, 3, 0, Math.PI*2);
        ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── 2. NAVBAR ─────────────────────────────────────────────── */
  var nav = document.getElementById('nav');
  if (nav) {
    function chk() { nav.classList.toggle('sc', window.scrollY > 24); }
    window.addEventListener('scroll', chk, { passive: true }); chk();
  }

  /* ── 3. HAMBURGER ──────────────────────────────────────────── */
  var hbg = document.getElementById('hbg'), nul = document.getElementById('navul');
  if (hbg && nul) {
    hbg.addEventListener('click', function () {
      var op = nul.classList.toggle('op');
      hbg.classList.toggle('op', op);
      document.body.style.overflow = op ? 'hidden' : '';
    });
    nul.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nul.classList.remove('op'); hbg.classList.remove('op'); document.body.style.overflow = ''; });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { nul.classList.remove('op'); hbg.classList.remove('op'); document.body.style.overflow = ''; }
    });
  }

  /* ── 4. SCROLL REVEAL ─────────────────────────────────────── */
  var rvEls = document.querySelectorAll('.rv');
  rvEls.forEach(function (el) { el.classList.add('animated'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  rvEls.forEach(function (el) { io.observe(el); });

  /* ── 5. ALGO BARS ─────────────────────────────────────────── */
  var bars = document.querySelectorAll('.ab');
  if (bars.length) {
    function randBars() { bars.forEach(function (b) { b.style.setProperty('--h', (Math.random()*74+16)+'%'); }); }
    randBars(); setInterval(randBars, 1700);
  }

  /* ── 6. ACTIVE NAV ────────────────────────────────────────── */
  var secs = document.querySelectorAll('section[id]'), nls = document.querySelectorAll('.nav-ul a');
  if (secs.length && nls.length) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        nls.forEach(function (a) {
          var act = a.getAttribute('href') === '#' + e.target.id;
          a.style.color = act ? '#fff' : ''; a.style.fontWeight = act ? '500' : '';
        });
      });
    }, { threshold: 0.45 });
    secs.forEach(function (s) { nio.observe(s); });
  }

  /* ── 7. CARD TILT ─────────────────────────────────────────── */
  if (!window.matchMedia('(hover:none)').matches) {
    document.querySelectorAll('.pjc').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX-r.left)/r.width - 0.5, y = (e.clientY-r.top)/r.height - 0.5;
        c.style.transform = 'perspective(800px) rotateY('+(x*5)+'deg) rotateX('+(-y*4)+'deg) translateY(-5px)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
  }

  /* ── 8. HERO PHOTO PARALLAX ───────────────────────────────── */
  var photo = document.querySelector('.hphoto');
  if (photo && !window.matchMedia('(hover:none)').matches) {
    var hero = document.querySelector('.hero');
    hero && hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX-r.left)/r.width - 0.5, y = (e.clientY-r.top)/r.height - 0.5;
      photo.style.transform = 'perspective(900px) rotateY('+(x*4)+'deg) rotateX('+(-y*3)+'deg) scale(1.02)';
    }, { passive: true });
    hero && hero.addEventListener('mouseleave', function () { photo.style.transform = ''; });
  }

})();
