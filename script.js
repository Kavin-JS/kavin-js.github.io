(function () {

  /* ============================================================
     1. GREEN CONFETTI CURSOR
     Spawns at cursor position only. Bursts on click.
     Green shades only. Sharp white dot follows cursor.
  ============================================================ */
  var cc = document.getElementById('cc');
  if (cc) {
    var cctx = cc.getContext('2d');
    var cW, cH;
    function resizeCC() { cW = cc.width = window.innerWidth; cH = cc.height = window.innerHeight; }
    resizeCC();
    window.addEventListener('resize', resizeCC, { passive: true });

    var GREENS = ['#4ade80','#4ade80','#4ade80','#22c55e','#22c55e','#86efac','#16a34a'];
    var pts = [], mx = -999, my = -999, pmx = -999, pmy = -999, lastSpawn = 0;
    var isTouchDev = window.matchMedia('(hover:none)').matches;

    if (!isTouchDev) {
      document.body.classList.add('js-cursor');

      document.addEventListener('mousemove', function (e) {
        pmx = mx; pmy = my;
        mx = e.clientX; my = e.clientY;
        var dx = mx - pmx, dy = my - pmy;
        var spd = Math.sqrt(dx * dx + dy * dy);
        if (spd < 1) return;
        var now = performance.now();
        if (now - lastSpawn < 16) return;
        lastSpawn = now;
        var cnt = Math.min(1 + Math.floor(spd * 0.18), 5);
        for (var i = 0; i < cnt; i++) spawnPt(mx, my, 1);
      }, { passive: true });

      document.addEventListener('mousedown', function () {
        for (var i = 0; i < 24; i++) spawnPt(mx, my, 1.5);
      });
    }

    function spawnPt(x, y, sm) {
      var a = Math.random() * Math.PI * 2, s = (1.5 + Math.random() * 3.5) * sm;
      pts.push({
        x: x, y: y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - Math.random() * 1.5,
        len: 3 + Math.random() * 6,
        w:   1.2 + Math.random() * 1.4,
        rot: a, rv: (Math.random() - 0.5) * 0.12,
        col: GREENS[Math.floor(Math.random() * GREENS.length)],
        al:  0.9 + Math.random() * 0.1,
        dc:  0.022 + Math.random() * 0.018,
        gv:  0.08 + Math.random() * 0.05,
        dr:  0.94
      });
    }

    function drawCursor() {
      cctx.clearRect(0, 0, cW, cH);
      for (var i = pts.length - 1; i >= 0; i--) {
        var p = pts[i];
        p.vx *= p.dr; p.vy = p.vy * p.dr + p.gv;
        p.x += p.vx; p.y += p.vy;
        p.rot += p.rv; p.al -= p.dc;
        if (p.al <= 0) { pts.splice(i, 1); continue; }
        cctx.save();
        cctx.globalAlpha = p.al;
        cctx.translate(p.x, p.y); cctx.rotate(p.rot);
        cctx.strokeStyle = p.col; cctx.lineWidth = p.w; cctx.lineCap = 'round';
        cctx.beginPath(); cctx.moveTo(-p.len / 2, 0); cctx.lineTo(p.len / 2, 0); cctx.stroke();
        cctx.restore();
      }
      if (!isTouchDev && mx > -900) {
        cctx.save(); cctx.globalAlpha = 1;
        cctx.beginPath(); cctx.arc(mx, my, 3, 0, Math.PI * 2);
        cctx.fillStyle = '#ffffff'; cctx.fill();
        cctx.restore();
      }
      requestAnimationFrame(drawCursor);
    }
    drawCursor();
  }

  /* ============================================================
     2. NAVBAR SCROLL
  ============================================================ */
  var nav = document.getElementById('nav');
  if (nav) {
    function chk() { nav.classList.toggle('sc', window.scrollY > 24); }
    window.addEventListener('scroll', chk, { passive: true });
    chk();
  }

  /* ============================================================
     3. HAMBURGER
  ============================================================ */
  var hbg = document.getElementById('hbg'), nul = document.getElementById('navul');
  if (hbg && nul) {
    hbg.addEventListener('click', function () {
      var op = nul.classList.toggle('op');
      hbg.classList.toggle('op', op);
      document.body.style.overflow = op ? 'hidden' : '';
    });
    nul.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nul.classList.remove('op'); hbg.classList.remove('op'); document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { nul.classList.remove('op'); hbg.classList.remove('op'); document.body.style.overflow = ''; }
    });
  }

  /* ============================================================
     4. SCROLL REVEAL
  ============================================================ */
  var rvEls = document.querySelectorAll('.rv');
  rvEls.forEach(function (el) { el.classList.add('animated'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  rvEls.forEach(function (el) { io.observe(el); });

  /* ============================================================
     5. ALGO BARS
  ============================================================ */
  var bars = document.querySelectorAll('.ab');
  if (bars.length) {
    function randBars() { bars.forEach(function (b) { b.style.setProperty('--h', (Math.random() * 74 + 16) + '%'); }); }
    randBars(); setInterval(randBars, 1700);
  }

  /* ============================================================
     6. ACTIVE NAV
  ============================================================ */
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

  /* ============================================================
     7. CARD TILT
  ============================================================ */
  if (!window.matchMedia('(hover:none)').matches) {
    document.querySelectorAll('.pjc').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = 'perspective(800px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 4) + 'deg) translateY(-5px)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
  }

  /* ============================================================
     8. SCRATCH-TO-REVEAL PHOTO
     Dark overlay painted on a canvas sitting above the photo.
     Scratch/drag to erase it. Auto-completes at 55%.
  ============================================================ */
  window.addEventListener('load', function () {
    var wrap  = document.getElementById('scratch-wrap');
    var photo = document.getElementById('hphoto');
    var sc    = document.getElementById('sc');
    var hint  = document.getElementById('scratch-hint');
    var done  = document.getElementById('scratch-done');
    if (!wrap || !photo || !sc || !hint || !done) return;

    var sctx      = sc.getContext('2d');
    var drawing   = false;
    var finished  = false;
    var BRUSH     = 48;

    function initScratch() {
      var W = wrap.offsetWidth;
      var H = wrap.offsetHeight;
      if (!W || !H) return; // not laid out yet, retry
      sc.width  = W;
      sc.height = H;

      // Dark overlay — near-black with subtle green noise
      sctx.clearRect(0, 0, W, H);
      sctx.fillStyle = '#060c10';
      sctx.fillRect(0, 0, W, H);

      // Noise dots
      for (var i = 0; i < W; i += 3) {
        for (var j = 0; j < H; j += 3) {
          if (Math.random() > 0.55) {
            sctx.fillStyle = 'rgba(74,222,128,' + (Math.random() * 0.04) + ')';
            sctx.fillRect(i, j, 2, 2);
          }
        }
      }

      // "Scratch to reveal" text in centre
      sctx.font = 'bold 13px "JetBrains Mono", monospace';
      sctx.letterSpacing = '3px';
      sctx.textAlign = 'center';
      sctx.textBaseline = 'middle';
      sctx.fillStyle = 'rgba(74,222,128,0.18)';
      sctx.fillText('SCRATCH TO REVEAL', W / 2, H / 2 + 30);
    }

    // Wait until layout is ready
    setTimeout(initScratch, 100);
    window.addEventListener('resize', function () { if (!finished) setTimeout(initScratch, 100); }, { passive: true });

    function getXY(e) {
      var r = sc.getBoundingClientRect();
      var src = e.touches ? e.touches[0] : e;
      return { x: src.clientX - r.left, y: src.clientY - r.top };
    }

    function doScratch(x, y) {
      sctx.globalCompositeOperation = 'destination-out';
      sctx.beginPath();
      sctx.arc(x, y, BRUSH, 0, Math.PI * 2);
      sctx.fill();
      hint.classList.add('hide');
    }

    function checkDone() {
      if (finished) return;
      var d = sctx.getImageData(0, 0, sc.width, sc.height).data;
      var clear = 0, total = 0;
      for (var i = 3; i < d.length; i += 4 * 24) { if (d[i] < 128) clear++; total++; }
      if (clear / total > 0.55) {
        finished = true;
        sc.style.transition = 'opacity 0.9s ease';
        sc.style.opacity = '0';
        setTimeout(function () { sc.style.display = 'none'; }, 900);
        done.classList.add('show');
      }
    }

    // Mouse
    sc.addEventListener('mousedown', function (e) { drawing = true; var p = getXY(e); doScratch(p.x, p.y); });
    sc.addEventListener('mousemove', function (e) { if (!drawing) return; var p = getXY(e); doScratch(p.x, p.y); checkDone(); });
    sc.addEventListener('mouseup',   function () { drawing = false; checkDone(); });
    sc.addEventListener('mouseleave',function () { drawing = false; });

    // Touch
    sc.addEventListener('touchstart', function (e) { e.preventDefault(); drawing = true; var p = getXY(e); doScratch(p.x, p.y); }, { passive: false });
    sc.addEventListener('touchmove',  function (e) { e.preventDefault(); if (!drawing) return; var p = getXY(e); doScratch(p.x, p.y); checkDone(); }, { passive: false });
    sc.addEventListener('touchend',   function () { drawing = false; checkDone(); });
  });

})();
