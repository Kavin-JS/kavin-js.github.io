/* Live embedding map for "Ask my portfolio": classical MDS of the chunk vectors; the query lands where its top matches live. */
(()=>{const cv=document.querySelector("#map");if(!cv)return;
addEventListener("load",()=>{if(typeof DOC==="undefined")return;
 const ctx=cv.getContext("2d"),n=DOC.length,RM=matchMedia("(prefers-reduced-motion:reduce)").matches;let W,H,P=[],q=null,qx=.5,qy=1.1,tx=.5,ty=.5,top=[],miss=false,hv=-1,vis=false,mouse=null;
 (function layout(){const D=[];for(let i=0;i<n;i++){D[i]=[];for(let j=0;j<n;j++){const d=1-cos(DOC[i].tri,DOC[j].tri);D[i][j]=d*d}}
  const rm=D.map(r=>r.reduce((a,b)=>a+b,0)/n),gm=rm.reduce((a,b)=>a+b,0)/n;let B=D.map((r,i)=>r.map((v,j)=>-.5*(v-rm[i]-rm[j]+gm)));const ev=[];
  for(let k=0;k<2;k++){let v=Array.from({length:n},(_,i)=>Math.sin(i*1.7+k*2.3+1));for(let it=0;it<120;it++){const w=B.map(r=>r.reduce((a,x,j)=>a+x*v[j],0)),nn=Math.hypot(...w)||1;v=w.map(x=>x/nn)}
   const lam=B.map(r=>r.reduce((a,x,j)=>a+x*v[j],0)).reduce((a,x,i)=>a+x*v[i],0);ev.push(v.map(x=>x*Math.sqrt(Math.max(lam,1e-9))));B=B.map((r,i)=>r.map((x,j)=>x-lam*v[i]*v[j]))}
  const nz=a=>{const lo=Math.min(...a),hi=Math.max(...a);return a.map(x=>.09+.82*(x-lo)/((hi-lo)||1))};
  const xs=nz(ev[0]),ys=nz(ev[1]);P=xs.map((x,i)=>({x,y:ys[i],i}));
  for(let it=0;it<120;it++)for(let a=0;a<n;a++)for(let b=a+1;b<n;b++){const dx=P[b].x-P[a].x,dy=(P[b].y-P[a].y)*.6,d=Math.hypot(dx,dy)||.001;if(d<.075){const f=(.075-d)/2/d;P[a].x-=dx*f;P[b].x+=dx*f;P[a].y-=dy*f/.6;P[b].y+=dy*f/.6}}
  P.forEach(p=>{p.x=Math.min(.95,Math.max(.05,p.x));p.y=Math.min(.92,Math.max(.1,p.y));p.ph=Math.random()*6.28})})();
 function size(){const d=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)}size();addEventListener("resize",size);
 new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);
 cv.addEventListener("pointermove",e=>{const r=cv.getBoundingClientRect();mouse=[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]});cv.addEventListener("pointerleave",()=>mouse=null);
 window.askMap={reset(){q=null;top=[];miss=false;qx=.5;qy=1.15},show(R,s){q=s;miss=R.miss;top=R.miss?[]:R.top.slice(0,3);const pick=R.top.slice(0,3);let w=0,x=0,y=0;pick.forEach(t=>{const k=Math.pow(t.score,3)+.001;w+=k;x+=P[t.i].x*k;y+=P[t.i].y*k});tx=R.miss?.93:x/w;ty=R.miss?.14:y/w;if(RM){qx=tx;qy=ty}else{qx=.5;qy=1.12}}};
 const col={about:0,contact:0,skills:1,work:2,lead:3};
 (function loop(now){requestAnimationFrame(loop);if(!vis)return;const t=now/1000,cs=getComputedStyle(document.documentElement),ink=cs.getPropertyValue("--ink").trim()||"#0b0b0b",paper=cs.getPropertyValue("--paper").trim()||"#e9e9e4",mut=cs.getPropertyValue("--mut").trim()||"#666";
  ctx.clearRect(0,0,W,H);qx+=(tx-qx)*.05;qy+=(ty-qy)*.05;
  const px=p=>p.x*W+Math.cos(t*.6+p.ph)*3,py=p=>p.y*H+Math.sin(t*.5+p.ph)*3,hit=top.map(t=>t.i);hv=-1;
  if(mouse){let bd=18/W;P.forEach((p,i)=>{const d=Math.hypot((p.x-mouse[0])*W,(p.y-mouse[1])*H);if(d<18&&d<bd*W){bd=d/W;hv=i}})}
  if(q&&!miss){ctx.strokeStyle=ink;ctx.lineWidth=1.4;ctx.setLineDash([5,5]);top.forEach(tp=>{ctx.beginPath();ctx.moveTo(qx*W,qy*H);ctx.lineTo(px(P[tp.i]),py(P[tp.i]));ctx.stroke()});ctx.setLineDash([])}
  P.forEach((p,i)=>{const g=DOC[i].d[0],on=hit.includes(i),r=on?9+ (top.find(x=>x.i===i)?.score||0)*8:6.5,x=px(p),y=py(p);ctx.globalAlpha=q&&!on?.35:1;
   ctx.beginPath();ctx.arc(x,y,r,0,7);const c=col[g];ctx.fillStyle=on||c==2?"#d4ff3a":c==0?ink:c==3?mut:paper;ctx.fill();ctx.lineWidth=on?2:1.5;ctx.strokeStyle=ink;if(c!=0||on)ctx.stroke();ctx.globalAlpha=1;
   if(on||hv===i){ctx.font="500 11px 'JetBrains Mono',monospace";ctx.fillStyle=ink;ctx.textAlign=x>W*.7?"right":"left";ctx.fillText(DOC[i].d[1].toUpperCase(),x+(x>W*.7?-r-8:r+8),y+4)}});
  if(q){const x=qx*W,y=qy*H;ctx.beginPath();ctx.arc(x,y,13+Math.sin(t*4)*2,0,7);ctx.fillStyle=miss?mut:"#d4ff3a";ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=ink;ctx.stroke();ctx.beginPath();ctx.arc(x,y,3.5,0,7);ctx.fillStyle=ink;ctx.fill();
   ctx.font="600 12px 'JetBrains Mono',monospace";ctx.fillStyle=ink;ctx.textAlign=x>W*.6?"right":"left";ctx.fillText((miss?"? ":"")+q.slice(0,34),x+(x>W*.6?-22:22),y-12)}})(0)})})();
