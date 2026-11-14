/* Wake-word lab: simulated recognizer noise -> edit-distance confidence -> threshold decision; live ROC-style trade-off. */
(()=>{const $=s=>document.querySelector(s);
const lev=(a,b)=>{const m=a.length,n=b.length,d=Array.from({length:m+1},(_,i)=>[i,...Array(n).fill(0)]);for(let j=1;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]==b[j-1]?0:1));return d[m][n]};
const conf=(h,w)=>{h=h.toLowerCase().trim();w=w.toLowerCase().trim();return Math.max(0,1-lev(h,w)/Math.max(h.length,w.length,1))};
const rng=s=>()=>{s=(s+0x6d2b79f5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
const AL="abcdefghijklmnopqrstuvwxyz ";
const noisy=(s,p,r)=>{let o="";for(const c of s){const x=r();if(x<p*.4)o+=AL[r()*27|0];else if(x<p*.7){}else if(x<p)o+=c+c;else o+=c}return o};
const GEN=["play some music","what time is it","turn on the lights","set a timer","open the window","good morning"];
function negs(w){const o=[];for(let i=0;i<w.length&&o.length<6;i+=Math.max(1,Math.floor(w.length/6))){const c=w[i];if(c!=" ")o.push(w.slice(0,i)+(c=="a"?"e":"a")+w.slice(i+1))}return o.concat(GEN)}
let hist=[],det=0,miss=0;const ww=$("#ww"),ut=$("#ut"),nz=$("#nz"),th=$("#thr");
function curve(){const w=ww.value||"hey kavin",p=nz.value/100,N=200,pos=[],neg=[],ng=negs(w);let r=rng(7);for(let i=0;i<N;i++){pos.push(conf(noisy(w,p,r),w));neg.push(conf(noisy(ng[i%ng.length],p,r),w))}
 const rows=[];for(let t=50;t<=99;t++){const c=t/100;rows.push([t,pos.filter(x=>x>=c).length/N,neg.filter(x=>x>=c).length/N])}
 const W=620,H=210,P=34,X=v=>P+(v-50)/49*(W-2*P),Y=v=>H-P-v*(H-2*P),ln=k=>rows.map(r=>X(r[0]).toFixed(1)+","+Y(r[k]).toFixed(1)).join(" "),cur=rows[th.value-50];
 $("#roc").innerHTML=`<svg viewBox="0 0 ${W} ${H}">${[0,.5,1].map(v=>`<line x1="${P}" x2="${W-P}" y1="${Y(v)}" y2="${Y(v)}" stroke="rgba(233,233,228,.15)"/><text x="${P-8}" y="${Y(v)+3}" text-anchor="end">${v}</text>`).join("")}<text x="${P}" y="${H-10}">threshold 0.50</text><text x="${W-P}" y="${H-10}" text-anchor="end">0.99</text><polyline points="${ln(1)}" fill="none" stroke="#d4ff3a" stroke-width="3"/><polyline points="${ln(2)}" fill="none" stroke="#ff7a59" stroke-width="3" stroke-dasharray="6 5"/><line x1="${X(th.value)}" x2="${X(th.value)}" y1="${P-10}" y2="${H-P}" stroke="#e9e9e4" stroke-width="1.5"/><text x="${W-P}" y="16" text-anchor="end" style="fill:#d4ff3a">— wake word accepted</text><text x="${W-P-170}" y="16" text-anchor="end" style="fill:#ff7a59">-- false accepts</text></svg>`;
 $("#tpr").textContent=Math.round(cur[1]*100)+"%";$("#fpr").textContent=Math.round(cur[2]*100)+"%"}
function say(){const w=ww.value||"hey kavin",u=ut.value||w,r=rng(Date.now()%1e9),heard=noisy(u,nz.value/100,r),c=conf(heard,w),ok=c>=th.value/100;
 $("#hd").textContent=heard?`"${heard}"`:"(nothing)";$("#cf").textContent=c.toFixed(2);$("#cb").style.width=c*100+"%";$("#led").classList.toggle("on",ok);$("#vd").textContent=ok?"Wake word detected":"Ignored";$("#vd").className="m "+(ok?"up":"dn");
 if(ok)det++;else miss++;hist.push([c,ok]);hist=hist.slice(-30);$("#dc").textContent=det;$("#mc").textContent=miss;$("#hs").innerHTML=hist.map(h=>`<s class="${h[1]?"g":""}" style="height:${Math.max(4,h[0]*100)}%"></s>`).join("")}
function mark(){$("#tm").style.left=th.value+"%";$("#thv").textContent=(th.value/100).toFixed(2);$("#nzv").textContent=nz.value+"% character noise"}
[ww,nz,th].forEach(e=>e.addEventListener("input",()=>{mark();curve();[nz,th].forEach(x=>x.style.setProperty("--v",(x.value-x.min)/(x.max-x.min)*100+"%"))}));
$("#say").addEventListener("click",say);ut.addEventListener("keydown",e=>{if(e.key=="Enter")say()});$("#sp").addEventListener("click",()=>{for(let i=0;i<12;i++)say()});
mark();curve();[nz,th].forEach(x=>x.style.setProperty("--v",(x.value-x.min)/(x.max-x.min)*100+"%"));say();window.__voice={conf,lev};
})();
