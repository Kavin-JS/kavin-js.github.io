(function(){
'use strict';

/* ── 1. GREEN CONFETTI CURSOR ────────────────────────────── */
var cc=document.getElementById('cc');
if(cc){
  var ctx=cc.getContext('2d'),W,H;
  function rsz(){W=cc.width=window.innerWidth;H=cc.height=window.innerHeight;}
  rsz();window.addEventListener('resize',rsz,{passive:true});
  var G=['#4ade80','#4ade80','#4ade80','#22c55e','#22c55e','#86efac','#16a34a'];
  var pts=[],mx=-999,my=-999,pmx=-999,pmy=-999,last=0;
  var noHov=window.matchMedia('(hover:none)').matches;
  if(!noHov){
    document.body.classList.add('js-cursor');
    document.addEventListener('mousemove',function(e){
      pmx=mx;pmy=my;mx=e.clientX;my=e.clientY;
      var dx=mx-pmx,dy=my-pmy,spd=Math.sqrt(dx*dx+dy*dy);
      if(spd<1.5)return;
      var now=performance.now();if(now-last<14)return;last=now;
      for(var i=0,n=Math.min(1+Math.floor(spd*.16),5);i<n;i++)sp(mx,my,1);
    },{passive:true});
    document.addEventListener('mousedown',function(){for(var i=0;i<28;i++)sp(mx,my,1.6);});
  }
  function sp(x,y,m){
    var a=Math.random()*Math.PI*2,s=(1.5+Math.random()*3.5)*m;
    pts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-Math.random()*1.5,
      len:3+Math.random()*6,w:1.2+Math.random()*1.4,rot:a,rv:(Math.random()-.5)*.12,
      col:G[Math.floor(Math.random()*G.length)],al:.9+Math.random()*.1,
      dc:.022+Math.random()*.018,gv:.08+Math.random()*.05,dr:.94});
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=pts.length-1;i>=0;i--){
      var p=pts[i];
      p.vx*=p.dr;p.vy=p.vy*p.dr+p.gv;p.x+=p.vx;p.y+=p.vy;p.rot+=p.rv;p.al-=p.dc;
      if(p.al<=0){pts.splice(i,1);continue;}
      ctx.save();ctx.globalAlpha=p.al;ctx.translate(p.x,p.y);ctx.rotate(p.rot);
      ctx.strokeStyle=p.col;ctx.lineWidth=p.w;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(-p.len/2,0);ctx.lineTo(p.len/2,0);ctx.stroke();
      ctx.restore();
    }
    if(!noHov&&mx>-900){
      ctx.save();ctx.globalAlpha=1;ctx.beginPath();ctx.arc(mx,my,3.5,0,Math.PI*2);
      ctx.fillStyle='#fff';ctx.fill();ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── 2. LIVE CHENNAI CLOCK ───────────────────────────────── */
var clk=document.getElementById('nav-clock');
if(clk){
  function tick(){
    var now=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
    var h=now.getHours(),m=now.getMinutes(),s=now.getSeconds();
    clk.textContent=(h<10?'0':'')+h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s+' IST';
  }
  tick();setInterval(tick,1000);
}

/* ── 3. NAVBAR ───────────────────────────────────────────── */
var nav=document.getElementById('nav');
if(nav){
  function chk(){nav.classList.toggle('sc',window.scrollY>24);}
  window.addEventListener('scroll',chk,{passive:true});chk();
}

/* ── 4. HAMBURGER ────────────────────────────────────────── */
var hbg=document.getElementById('hbg'),nul=document.getElementById('navul');
if(hbg&&nul){
  hbg.addEventListener('click',function(){
    var op=nul.classList.toggle('op');hbg.classList.toggle('op',op);
    document.body.style.overflow=op?'hidden':'';
  });
  nul.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){nul.classList.remove('op');hbg.classList.remove('op');document.body.style.overflow='';});
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){nul.classList.remove('op');hbg.classList.remove('op');document.body.style.overflow='';}
  });
}

/* ── 5. SCROLL REVEAL ────────────────────────────────────── */
var rvEls=document.querySelectorAll('.rv');
rvEls.forEach(function(el){el.classList.add('animated');});
var io=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
},{threshold:.07,rootMargin:'0px 0px -20px 0px'});
rvEls.forEach(function(el){io.observe(el);});

/* ── 6. COUNT-UP NUMBERS ─────────────────────────────────── */
function countUp(el){
  var target=parseInt(el.getAttribute('data-count'),10);
  if(!target)return;
  var start=0,dur=1200,step=16;
  var inc=target/(dur/step);
  var t=setInterval(function(){
    start+=inc;if(start>=target){start=target;clearInterval(t);}
    el.textContent=Math.floor(start)+(el.getAttribute('data-count')?'+':'');
  },step);
  el.textContent='0';
}
var counted=false;
var cio=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting&&!counted){
      counted=true;
      document.querySelectorAll('[data-count]').forEach(countUp);
      cio.disconnect();
    }
  });
},{threshold:.2});
var firstCount=document.querySelector('[data-count]');
if(firstCount)cio.observe(firstCount);

/* ── 7. ALGO BARS ────────────────────────────────────────── */
var bars=document.querySelectorAll('.ab');
if(bars.length){
  function rb(){bars.forEach(function(b){b.style.setProperty('--h',(Math.random()*74+16)+'%');});}
  rb();setInterval(rb,1700);
}

/* ── 8. ACTIVE NAV ───────────────────────────────────────── */
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
  secs.forEach(function(s){nio.observe(s);});
}

/* ── 9. BUILDING CARD SPOTLIGHT ──────────────────────────── */
if(!window.matchMedia('(hover:none)').matches){
  document.querySelectorAll('.bc').forEach(function(c){
    c.addEventListener('mousemove',function(e){
      var r=c.getBoundingClientRect();
      c.style.setProperty('--sx',(e.clientX-r.left)+'px');
      c.style.setProperty('--sy',(e.clientY-r.top)+'px');
    });
  });
}

/* ── 10. MAGNETIC BUTTONS ────────────────────────────────── */
if(!window.matchMedia('(hover:none)').matches){
  document.querySelectorAll('.btn').forEach(function(btn){
    btn.addEventListener('mousemove',function(e){
      var r=btn.getBoundingClientRect();
      var x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
      btn.style.transform='translate('+(x*.18)+'px,'+(y*.18)+'px)';
    });
    btn.addEventListener('mouseleave',function(){btn.style.transform='';});
  });
}

/* ── 11. SKILL PILL RIPPLE ───────────────────────────────── */
var sty=document.createElement('style');
sty.textContent='@keyframes rOut{to{transform:scale(18);opacity:0}}';
document.head.appendChild(sty);
document.querySelectorAll('.sg-pills span').forEach(function(tag){
  tag.addEventListener('click',function(e){
    var r=tag.getBoundingClientRect();
    var rip=document.createElement('span');
    rip.style.cssText='position:absolute;border-radius:50%;background:rgba(74,222,128,.22);width:4px;height:4px;left:'+(e.clientX-r.left-2)+'px;top:'+(e.clientY-r.top-2)+'px;transform:scale(0);animation:rOut .5s ease forwards;pointer-events:none';
    tag.style.position='relative';tag.appendChild(rip);
    setTimeout(function(){rip.remove();},500);
  });
});

/* ── 12. PROJECT ROW HOVER LINE ──────────────────────────── */
document.querySelectorAll('.pl-item').forEach(function(item){
  item.addEventListener('mouseenter',function(){
    item.style.paddingLeft='2.5rem';
  });
  item.addEventListener('mouseleave',function(){
    item.style.paddingLeft='';
  });
});

})();
