(function(){
  // ── CURSOR — green confetti, cursor-only ──────────────────
  var cv=document.getElementById('cc');
  if(!cv)return;
  var ctx=cv.getContext('2d');
  var W=cv.width=window.innerWidth,H=cv.height=window.innerHeight;
  window.addEventListener('resize',function(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight},{passive:true});
  var G=['#4ade80','#4ade80','#4ade80','#22c55e','#22c55e','#86efac','#16a34a'];
  var pts=[],mx=-999,my=-999,pmx=-999,pmy=-999,last=0;
  var isTouch=window.matchMedia('(hover:none)').matches;
  if(!isTouch){
    document.body.classList.add('js-cursor');
    document.addEventListener('mousemove',function(e){
      pmx=mx;pmy=my;mx=e.clientX;my=e.clientY;
      var dx=mx-pmx,dy=my-pmy,spd=Math.sqrt(dx*dx+dy*dy);
      if(spd<1)return;
      var now=performance.now();
      if(now-last<16)return;
      last=now;
      var cnt=Math.min(1+Math.floor(spd*.18),5);
      for(var i=0;i<cnt;i++){
        var a=Math.random()*Math.PI*2,s=1.5+Math.random()*3.5;
        pts.push({x:mx,y:my,vx:Math.cos(a)*s,vy:Math.sin(a)*s-Math.random()*1.5,
          len:3+Math.random()*6,w:1.2+Math.random()*1.4,
          rot:a,rv:(Math.random()-.5)*.12,
          col:G[Math.floor(Math.random()*G.length)],
          a:.9+Math.random()*.1,dc:.022+Math.random()*.018,
          gv:.08+Math.random()*.05,drag:.94});
      }
    },{passive:true});
    document.addEventListener('mousedown',function(){
      for(var i=0;i<24;i++){
        var a=Math.random()*Math.PI*2,s=2+Math.random()*5;
        pts.push({x:mx,y:my,vx:Math.cos(a)*s,vy:Math.sin(a)*s-Math.random()*2,
          len:3+Math.random()*7,w:1.2+Math.random()*1.6,
          rot:a,rv:(Math.random()-.5)*.15,
          col:G[Math.floor(Math.random()*G.length)],
          a:.9+Math.random()*.1,dc:.018+Math.random()*.016,
          gv:.06+Math.random()*.06,drag:.93});
      }
    });
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=pts.length-1;i>=0;i--){
      var p=pts[i];
      p.vx*=p.drag;p.vy=p.vy*p.drag+p.gv;
      p.x+=p.vx;p.y+=p.vy;p.rot+=p.rv;p.a-=p.dc;
      if(p.a<=0){pts.splice(i,1);continue}
      ctx.save();ctx.globalAlpha=p.a;
      ctx.translate(p.x,p.y);ctx.rotate(p.rot);
      ctx.strokeStyle=p.col;ctx.lineWidth=p.w;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(-p.len/2,0);ctx.lineTo(p.len/2,0);ctx.stroke();
      ctx.restore();
    }
    if(!isTouch&&mx>-900){
      ctx.save();ctx.globalAlpha=1;
      ctx.beginPath();ctx.arc(mx,my,3,0,Math.PI*2);
      ctx.fillStyle='#fff';ctx.fill();ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();

  // ── NAVBAR ─────────────────────────────────────────────────
  var nav=document.getElementById('nav');
  function chkScroll(){nav.classList.toggle('sc',window.scrollY>24)}
  window.addEventListener('scroll',chkScroll,{passive:true});chkScroll();

  // ── HAMBURGER ──────────────────────────────────────────────
  var hbg=document.getElementById('hbg'),nul=document.getElementById('navul');
  if(hbg&&nul){
    hbg.addEventListener('click',function(){
      var op=nul.classList.toggle('op');
      hbg.classList.toggle('op',op);
      document.body.style.overflow=op?'hidden':'';
    });
    nul.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){nul.classList.remove('op');hbg.classList.remove('op');document.body.style.overflow='';});
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){nul.classList.remove('op');hbg.classList.remove('op');document.body.style.overflow='';}});
  }

  // ── REVEAL on scroll ───────────────────────────────────────
  var rvEls=document.querySelectorAll('.rv');
  rvEls.forEach(function(el){el.classList.add('animated')});
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
    });
  },{threshold:.08,rootMargin:'0px 0px -20px 0px'});
  rvEls.forEach(function(el){io.observe(el)});

  // ── ALGO BARS ──────────────────────────────────────────────
  var bars=document.querySelectorAll('.ab');
  if(bars.length){
    function randBars(){bars.forEach(function(b){b.style.setProperty('--h',(Math.random()*74+16)+'%')});}
    randBars();setInterval(randBars,1700);
  }

  // ── ACTIVE NAV ─────────────────────────────────────────────
  var secs=document.querySelectorAll('section[id]'),nls=document.querySelectorAll('.nav-ul a');
  if(secs.length&&nls.length){
    var nio=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting)return;
        nls.forEach(function(a){
          var act=a.getAttribute('href')==='#'+e.target.id;
          a.style.color=act?'#fff':'';a.style.fontWeight=act?'500':'';
        });
      });
    },{threshold:.45});
    secs.forEach(function(s){nio.observe(s)});
  }

  // ── CARD TILT ──────────────────────────────────────────────
  if(!window.matchMedia('(hover:none)').matches){
    document.querySelectorAll('.pjc').forEach(function(c){
      c.addEventListener('mousemove',function(e){
        var r=c.getBoundingClientRect();
        var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        c.style.transform='perspective(800px) rotateY('+(x*5)+'deg) rotateX('+(-y*4)+'deg) translateY(-5px)';
      });
      c.addEventListener('mouseleave',function(){c.style.transform='';});
    });
  }
})();
// ── SCRATCH-TO-REVEAL PHOTO ─────────────────────────────────
(function(){
  var wrap  = document.getElementById('scratch-wrap');
  var photo = document.getElementById('hphoto');
  var sc    = document.getElementById('sc');
  var hint  = document.getElementById('scratch-hint');
  var done  = document.getElementById('scratch-done');
  if(!wrap||!photo||!sc||!hint||!done) return;

  var ctx = sc.getContext('2d');
  var isDrawing = false;
  var revealed = 0;
  var total = 0;
  var finished = false;
  var BRUSH = 44; // scratch brush radius

  // Fill the scratch canvas with a dark overlay once photo loads
  function initCanvas(){
    sc.width  = wrap.offsetWidth;
    sc.height = wrap.offsetHeight;
    total = sc.width * sc.height;

    // Dark brushed-metal overlay with green tint
    ctx.fillStyle = '#050a0e';
    ctx.fillRect(0, 0, sc.width, sc.height);

    // Subtle noise texture overlay
    ctx.fillStyle = 'rgba(74,222,128,0.03)';
    for(var i = 0; i < sc.width; i += 4){
      for(var j = 0; j < sc.height; j += 4){
        if(Math.random() > 0.5) ctx.fillRect(i, j, 2, 2);
      }
    }

    // Hint text painted on the overlay
    ctx.fillStyle = 'rgba(74,222,128,0.08)';
    ctx.fillRect(0, 0, sc.width, sc.height);
  }

  photo.complete ? initCanvas() : photo.addEventListener('load', initCanvas);
  window.addEventListener('resize', function(){
    if(!finished) initCanvas();
  }, {passive:true});

  function getPos(e){
    var r = sc.getBoundingClientRect();
    if(e.touches){
      return {
        x: e.touches[0].clientX - r.left,
        y: e.touches[0].clientY - r.top
      };
    }
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function scratch(x, y){
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, BRUSH, 0, Math.PI * 2);
    ctx.fill();

    // Hide hint after first scratch
    hint.classList.add('hide');
  }

  function checkReveal(){
    if(finished) return;
    // Sample every 32px for performance
    var data = ctx.getImageData(0, 0, sc.width, sc.height).data;
    var transparent = 0;
    var sample = 0;
    for(var i = 3; i < data.length; i += 4 * 32){
      if(data[i] < 128) transparent++;
      sample++;
    }
    var pct = transparent / sample;
    if(pct > 0.55){
      finished = true;
      // Fade out remaining overlay
      sc.style.transition = 'opacity .8s ease';
      sc.style.opacity = '0';
      setTimeout(function(){ sc.style.display = 'none'; }, 800);
      done.classList.add('show');
    }
  }

  // Mouse events
  sc.addEventListener('mousedown', function(e){
    isDrawing = true;
    var p = getPos(e); scratch(p.x, p.y);
  });
  sc.addEventListener('mousemove', function(e){
    if(!isDrawing) return;
    var p = getPos(e); scratch(p.x, p.y);
    checkReveal();
  });
  sc.addEventListener('mouseup',   function(){ isDrawing = false; checkReveal(); });
  sc.addEventListener('mouseleave',function(){ isDrawing = false; });

  // Touch events
  sc.addEventListener('touchstart', function(e){
    e.preventDefault(); isDrawing = true;
    var p = getPos(e); scratch(p.x, p.y);
  }, {passive:false});
  sc.addEventListener('touchmove',  function(e){
    e.preventDefault(); if(!isDrawing) return;
    var p = getPos(e); scratch(p.x, p.y);
    checkReveal();
  }, {passive:false});
  sc.addEventListener('touchend',   function(){ isDrawing = false; checkReveal(); });
})();
