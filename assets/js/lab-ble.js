/* BLE presence lab: log-distance RSSI with noise, median smoothing, least-squares trilateration, rule checks. */
(()=>{const $=s=>document.querySelector(s),cv=$("#rm"),c=cv.getContext("2d");
const NODES=[[.4,.4],[7.6,.4],[4,5.6]],RW=8,RH=6,P0=-45,NEST=2.4,X0=-1.2,Y0=-1,WW=10.4,WH=8;let dev=[4,3],sig=3,nenv=2.4,win=[[],[],[]],ests=[],est=null,dr=false;
const gauss=()=>{let a=0;for(let i=0;i<6;i++)a+=Math.random();return(a-3)*1.41};
const med=a=>{const s=a.slice().sort((x,y)=>x-y);return s[s.length>>1]};
function sample(){const r=NODES.map(n=>{const d=Math.max(.3,Math.hypot(dev[0]-n[0],dev[1]-n[1]));return P0-10*nenv*Math.log10(d)+gauss()*sig});r.forEach((v,i)=>{win[i].push(v);win[i]=win[i].slice(-10)});
 const e=tri(r);ests.push(e&&inside(e));ests=ests.slice(-10);est=tri(win.map(med))}
function tri(r){const d=r.map(v=>Math.pow(10,(P0-v)/(10*NEST))),[a,b,cc]=NODES,A=[[2*(b[0]-a[0]),2*(b[1]-a[1])],[2*(cc[0]-a[0]),2*(cc[1]-a[1])]],B=[d[0]**2-d[1]**2+b[0]**2-a[0]**2+b[1]**2-a[1]**2,d[0]**2-d[2]**2+cc[0]**2-a[0]**2+cc[1]**2-a[1]**2],det=A[0][0]*A[1][1]-A[0][1]*A[1][0];if(Math.abs(det)<1e-6)return null;return[(B[0]*A[1][1]-B[1]*A[0][1])/det,(A[0][0]*B[1]-A[1][0]*B[0])/det,d]}
const inside=e=>e&&e[0]>=-.3&&e[0]<=RW+.3&&e[1]>=-.3&&e[1]<=RH+.3;
function size(){const w=cv.clientWidth;cv.width=w*2;cv.height=w*2*WH/WW}
const sx=x=>(x-X0)/WW*cv.width,sy=y=>(y-Y0)/WH*cv.height,wx=px=>px/cv.width*WW+X0,wy=py=>py/cv.height*WH+Y0;
function draw(){c.clearRect(0,0,cv.width,cv.height);c.strokeStyle="rgba(233,233,228,.07)";c.lineWidth=1;for(let x=0;x<=RW;x++){c.beginPath();c.moveTo(sx(x),sy(0));c.lineTo(sx(x),sy(RH));c.stroke()}for(let y=0;y<=RH;y++){c.beginPath();c.moveTo(sx(0),sy(y));c.lineTo(sx(RW),sy(y));c.stroke()}
 c.strokeStyle="#e9e9e4";c.lineWidth=4;c.beginPath();c.moveTo(sx(0),sy(1.8));c.lineTo(sx(0),sy(0));c.lineTo(sx(RW),sy(0));c.lineTo(sx(RW),sy(RH));c.lineTo(sx(0),sy(RH));c.lineTo(sx(0),sy(3.4));c.stroke();c.fillStyle="#9a9d95";c.font=`${cv.width/60}px "JetBrains Mono"`;c.fillText("DOOR",sx(-1.05),sy(2.65));c.fillText("CLASSROOM 8 × 6 m",sx(.2),sy(RH+.55));
 const S=win.map(med);if(est){NODES.forEach((n,i)=>{const d=est[2][i];c.strokeStyle="rgba(212,255,58,.22)";c.lineWidth=2;c.beginPath();c.arc(sx(n[0]),sy(n[1]),d/WW*cv.width,0,7);c.stroke()})}
 NODES.forEach((n,i)=>{c.fillStyle="#d4ff3a";c.fillRect(sx(n[0])-10,sy(n[1])-10,20,20);c.fillStyle="#0b0b0b";c.font=`bold ${cv.width/55}px "JetBrains Mono"`;c.fillText("ABC"[i],sx(n[0])-6,sy(n[1])+6)});
 if(est){c.strokeStyle="#d4ff3a";c.lineWidth=3;const ex=sx(est[0]),ey=sy(est[1]);c.beginPath();c.moveTo(ex-12,ey-12);c.lineTo(ex+12,ey+12);c.moveTo(ex+12,ey-12);c.lineTo(ex-12,ey+12);c.stroke();c.setLineDash([6,6]);c.strokeStyle="rgba(233,233,228,.5)";c.beginPath();c.moveTo(ex,ey);c.lineTo(sx(dev[0]),sy(dev[1]));c.stroke();c.setLineDash([])}
 c.fillStyle="#e9e9e4";c.beginPath();c.arc(sx(dev[0]),sy(dev[1]),cv.width/38,0,7);c.fill();c.fillStyle="#0b0b0b";c.font=`bold ${cv.width/60}px "JetBrains Mono"`;c.fillText("BLE",sx(dev[0])-cv.width/58,sy(dev[1])+cv.width/160)}
function ui(){const S=win.map(med);$("#rs3").innerHTML=S.map((v,i)=>`<div><span>Node ${"ABC"[i]}</span><s style="width:${Math.max(3,Math.min(100,(v+95)/50*100))}%"></s><span>${v?v.toFixed(0):"–"} dBm</span></div>`).join("");
 const strong=S.filter(v=>v>=-72).length>=2,ins=inside(est),cons=ests.filter(Boolean).length>=8,ok=strong&&ins&&cons,err=est?Math.hypot(est[0]-dev[0],est[1]-dev[1]):0;
 const row=(b,t)=>`<div class="hit${b?"":" leak"}"><h4>${t}</h4><span class="m">${b?"✓ pass":"✗ fail"}</span></div>`;
 $("#rl3").innerHTML=row(strong,"At least 2 nodes hear the device (≥ −72 dBm)")+row(!!ins,"Estimated position is inside the room")+row(cons,"Consistent: 8 of the last 10 readings inside");
 $("#vd3").textContent=ok?"PRESENT":"NOT PRESENT";$("#vd3").className="alert "+(ok?"ok":"bad");$("#er").textContent=est?err.toFixed(1)+" m":"–"}
cv.addEventListener("pointerdown",e=>{dr=true;cv.setPointerCapture(e.pointerId);mv(e)});cv.addEventListener("pointermove",e=>{if(dr)mv(e)});cv.addEventListener("pointerup",()=>dr=false);cv.addEventListener("pointercancel",()=>dr=false);
function mv(e){const r=cv.getBoundingClientRect(),k=cv.width/r.width;dev=[Math.max(X0+.3,Math.min(X0+WW-.3,wx((e.clientX-r.left)*k))),Math.max(Y0+.3,Math.min(Y0+WH-.3,wy((e.clientY-r.top)*k)))]}
$("#sg").addEventListener("input",e=>{sig=+e.target.value;$("#sgv").textContent=sig+" dB";e.target.style.setProperty("--v",sig/8*100+"%")});$("#ne").addEventListener("input",e=>{nenv=+e.target.value;$("#nev").textContent=nenv.toFixed(1);e.target.style.setProperty("--v",(nenv-2)/1.5*100+"%")});
$("#sg").style.setProperty("--v","37%");$("#ne").style.setProperty("--v","27%");
size();addEventListener("resize",size);setInterval(()=>{sample();ui()},250);(function f(){requestAnimationFrame(f);draw()})();
window.__ble={set:(x,y)=>dev=[x,y]};
})();
