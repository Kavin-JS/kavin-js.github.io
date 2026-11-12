/* Skills ball pit: a hand-written 2D rigid-body engine (circle collisions, gravity, walls, drag & throw). */
(()=>{const pit=document.querySelector("#pit"),sk=document.querySelector(".sk");if(!pit||!sk)return;
const data=[];sk.querySelectorAll(":scope>div").forEach((g,gi)=>g.querySelectorAll("li").forEach(l=>data.push([l.textContent,gi])));
let W=pit.clientWidth,H=pit.clientHeight,run=false,drag=null,started=0,t0=0,last=0,dv=[0,0];
const B=data.map(([t,g],i)=>{const r=Math.max(34,24+t.length*3.3),e=document.createElement("div");e.className="ball g"+g;e.textContent=t;e.style.cssText=`width:${2*r}px;height:${2*r}px`;pit.append(e);return{e,r,m:r*r,x:r,y:-400,vx:0,vy:0,on:0,t:i*70}});
addEventListener("resize",()=>{W=pit.clientWidth;H=pit.clientHeight;B.forEach(b=>b.x=Math.min(Math.max(b.x,b.r),W-b.r))});
new IntersectionObserver(e=>{run=e[0].isIntersecting;if(run&&!started){started=1;t0=performance.now();B.forEach(b=>{b.x=b.r+Math.random()*(W-2*b.r);b.y=-b.r-Math.random()*300;b.vx=(Math.random()-.5)*200})}},{threshold:.2}).observe(pit);
pit.addEventListener("pointerdown",e=>{const r=pit.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;for(let i=B.length-1;i>=0;i--){const b=B[i];if(Math.hypot(x-b.x,y-b.y)<b.r){drag=b;b.dx=b.x-x;b.dy=b.y-y;b.vx=b.vy=0;dv=[0,0];pit.setPointerCapture(e.pointerId);pit.classList.add("gr");break}}});
pit.addEventListener("pointermove",e=>{if(!drag)return;const r=pit.getBoundingClientRect(),nx=Math.min(Math.max(e.clientX-r.left+drag.dx,drag.r),W-drag.r),ny=Math.min(Math.max(e.clientY-r.top+drag.dy,drag.r),H-drag.r);dv=[dv[0]*.5+(nx-drag.x)*30,dv[1]*.5+(ny-drag.y)*30];drag.x=nx;drag.y=ny});
const rel=()=>{if(drag){drag.vx=dv[0];drag.vy=dv[1];drag=null;pit.classList.remove("gr")}};pit.addEventListener("pointerup",rel);pit.addEventListener("pointercancel",rel);
(function tick(now){requestAnimationFrame(tick);if(!run){last=now;return}const dt=Math.min((now-last)/1000,.033);last=now;
 for(let s=0;s<3;s++){const h=dt/3;
  for(const b of B){if(!b.on){if(now-t0>b.t)b.on=1;else continue}if(b===drag)continue;b.vy+=1900*h;b.x+=b.vx*h;b.y+=b.vy*h;b.vx*=.9995;
   if(b.y>H-b.r){b.y=H-b.r;b.vy=Math.abs(b.vy)<40?0:-b.vy*.34;b.vx*=.985}if(b.x<b.r){b.x=b.r;b.vx*=-.4}if(b.x>W-b.r){b.x=W-b.r;b.vx*=-.4}}
  for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++){const a=B[i],c=B[j];if(!a.on||!c.on)continue;const dx=c.x-a.x,dy=c.y-a.y,d=Math.hypot(dx,dy),md=a.r+c.r;if(d<md&&d>0){const nx=dx/d,ny=dy/d,ov=md-d,ia=a===drag?0:1/a.m,ic=c===drag?0:1/c.m,sm=ia+ic||1;a.x-=nx*ov*ia/sm;a.y-=ny*ov*ia/sm;c.x+=nx*ov*ic/sm;c.y+=ny*ov*ic/sm;const vn=(c.vx-a.vx)*nx+(c.vy-a.vy)*ny;if(vn<0){const j2=-1.25*vn/sm;a.vx-=j2*ia*nx;a.vy-=j2*ia*ny;c.vx+=j2*ic*nx;c.vy+=j2*ic*ny}}}}
 for(const b of B)b.e.style.transform=`translate(${b.x-b.r}px,${b.y-b.r}px)`})(0);
})();
