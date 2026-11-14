/* 2D architecture diagram for case-study pages, drawn from the shared ARCH_DATA. */
(()=>{document.querySelectorAll(".a2").forEach(box=>{const p=window.ARCH_DATA&&window.ARCH_DATA[+box.dataset.p];if(!p)return;
const W=920,H=470,X=n=>W/2+(n[1]+n[3]*.25)*(W*.4/2.05),Y=n=>H/2-(n[2]+n[3]*.1)*(H*.34/1.5);
const ed=p.e.map((e,i)=>{const a=p.n[e[0]],b=p.n[e[1]];return`<line class="ae" data-i="${i}" x1="${X(a)}" y1="${Y(a)}" x2="${X(b)}" y2="${Y(b)}"/>`}).join("");
const nd=p.n.map((n,i)=>{const r=Math.max(13,n[4]*46),x=X(n),y=Y(n);return`<g class="an${n[8]?" pl":""}" data-i="${i}" tabindex="0" role="button" aria-label="${n[0]}">${n[5]?`<rect x="${x-r*.85}" y="${y-r*.85}" width="${r*1.7}" height="${r*1.7}" rx="${r*.3}"/>`:`<circle cx="${x}" cy="${y}" r="${r}"/>`}<text x="${x}" y="${y+r+16}">${n[0]}${n[8]?" (planned)":""}</text></g>`}).join("");
box.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Architecture diagram of ${p.t}">${ed}${nd}</svg><div class="ainfo"><span class="m">Click a component</span><p>${p.d}</p></div><div class="astep"><button class="rb" type="button" aria-label="Previous step">‹</button><p></p><button class="rb" type="button" aria-label="Next step">›</button></div>`;
const info=box.querySelector(".ainfo"),sp=box.querySelector(".astep p"),eds=[...box.querySelectorAll(".ae")];let st=0,t;
const show=i=>{const n=p.n[i];info.innerHTML=`<span class="m">${n[6]}${n[8]?" · planned":""}</span><p><b>${n[0]}.</b> ${n[7]}</p>`;box.querySelectorAll(".an").forEach(g=>g.classList.toggle("on",+g.dataset.i==i))};
const step=s=>{st=(s+p.e.length)%p.e.length;eds.forEach((l,i)=>l.classList.toggle("on",i==st));sp.textContent=`${st+1}/${p.e.length} · ${p.e[st][2]}`};
box.querySelectorAll(".an").forEach(g=>{g.addEventListener("click",()=>show(+g.dataset.i));g.addEventListener("keydown",e=>{if(e.key=="Enter"||e.key==" "){e.preventDefault();show(+g.dataset.i)}})});
const b=box.querySelectorAll(".astep .rb");b[0].onclick=()=>{clearInterval(t);step(st-1)};b[1].onclick=()=>{clearInterval(t);step(st+1)};step(0);
if(!matchMedia("(prefers-reduced-motion:reduce)").matches)t=setInterval(()=>step(st+1),2200)})})();
