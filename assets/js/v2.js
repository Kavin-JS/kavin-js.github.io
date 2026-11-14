const D=[
["RagForge","Python · Hybrid retrieval","Featured","A production-grade RAG pipeline combining hybrid retrieval with cross-encoder reranking for improved answer relevance.",["Hybrid sparse and dense retrieval with cross-encoder reranking","Adaptive query routing and hierarchical summarization","Statistical evaluation framework for retrieval and answer quality"],["Python","Hybrid Retrieval","Cross-Encoder Reranking","Adaptive Routing"],"https://github.com/Kavin-JS/RagForge","View on GitHub"],
["AIKA","Next.js · FastAPI · pgvector","In development","A production-oriented, multi-tenant RAG knowledge platform built with real security and architectural hygiene. Complete through Identity and Tenancy (v0.2), validated in Docker at every milestone.",["Modular monolith with strict tenant isolation","Argon2id-hashed authentication","Instruction-aware document and query embeddings"],["Next.js","FastAPI","PostgreSQL / pgvector","Redis","Docker"],"https://github.com/Kavin-JS/AIKA","View on GitHub"],
["StyleMind AI","FastAPI · React · Vision · LLM","In development","The next build of ShonoWear: a styling platform with a PostgreSQL-backed virtual wardrobe, pretrained computer vision models and an LLM chat interface for outfit recommendations. Code is being finalized before it is published.",["Virtual wardrobe backed by PostgreSQL","Pretrained computer vision models","LLM chat interface for outfit recommendations"],["FastAPI","React","PostgreSQL","Computer Vision","LLM"],"https://github.com/Kavin-JS/Shonowear-Ver4.0","See the previous version"],
["Voice Wake-Word","Python · Vosk · Real-time audio","Shipped","Offline, real-time wake-word detection with a live dashboard for confidence tracking, detection statistics and a virtual LED indicator.",[],["Python","Vosk","SoundDevice"],"https://github.com/Kavin-JS/Voice-Wake-Word-System","View on GitHub"],
["Real-Time Recommender","Python · Deep learning","Shipped","Final-year project: a deep learning-based real-time recommender with heuristic ranking and an inference pipeline for personalized results.",[],["Python","Recommendation Systems"],"https://github.com/Kavin-JS/Real-Time-Recommendation-System","View on GitHub"],
["TransportSense","Haskell · Functional","Shipped","AI-powered transport emission analytics: a purely functional architecture with type-safe data pipelines.",[],["Haskell","Functional Programming","Data Analytics"],"https://github.com/Kavin-JS/TransportSense","View on GitHub"],
["BLE Classroom Presence","ESP32 · BLE · Embedded","Capstone","Multi-node classroom presence verification using ESP32 nodes, RSSI observations, Wi-Fi communication and rule-based checks.",[],["ESP32","BLE","Embedded Systems"],"https://github.com/Kavin-JS/BLE-Classroom-Presence","View on GitHub"],
["DSA Practice","Python · C · LeetCode","Ongoing","Arrays, strings, sorting, searching and dynamic programming in Python, with pointer-based data structures in C. 105 LeetCode problems solved.",[],["Python","C","DSA"],"https://github.com/Kavin-JS?tab=repositories","All repositories"]];
const $=s=>document.querySelector(s),W=$("#wl"),fp=$("#fp");
W.innerHTML=D.map((p,i)=>{const n=String(i+1).padStart(2,"0");return`<article class="pr"><button class="ph" aria-expanded="false" aria-controls="pb${i}" data-i="${i}"><span class="m">${n}</span><span class="pt">${p[0]}</span><span class="pm m">${p[2]}</span><span class="pl" aria-hidden="true">+</span></button><div class="pb" id="pb${i}"><div><div class="pi"><span></span><div><p>${p[3]}</p>${p[4].length?`<ul>${p[4].map(x=>`<li>${x}</li>`).join("")}</ul>`:""}</div><div>${(t=>t?`<div class="vz">${t.innerHTML}</div>`:"")(document.getElementById("tpl"+i))}<div class="tg">${p[5].map(x=>`<span>${x}</span>`).join("")}</div>${["ragforge","aika","stylemind"][i]?`<a class="lk" style="margin-right:8px" href="/work/${["ragforge","aika","stylemind"][i]}.html">Case study →</a>`:""}<a class="lk" href="${p[6]}" target="_blank" rel="noopener">${p[7]} ↗</a></div></div></div></div></article>`}).join("");
W.addEventListener("click",e=>{const b=e.target.closest(".ph");if(!b)return;const r=b.parentElement,o=!r.classList.contains("o");r.classList.toggle("o",o);b.setAttribute("aria-expanded",o)});
const fine=matchMedia("(hover:hover) and (pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion:reduce)").matches;
if(fine){let x=0,y=0,cx=0,cy=0,on=0;
 W.addEventListener("pointerover",e=>{const b=e.target.closest(".ph");if(!b)return;x=e.clientX+28;y=e.clientY-120;if(!on){cx=x;cy=y}const p=D[b.dataset.i];fp.innerHTML=`<b>${String(+b.dataset.i+1).padStart(2,"0")}</b><span class="m">${p[1]}</span>`;fp.classList.add("on");on=1});
 W.addEventListener("pointerleave",()=>{fp.classList.remove("on");on=0});
 W.addEventListener("pointermove",e=>{x=e.clientX+28;y=e.clientY-120});
 (function t(){cx+=(x-cx)*.14;cy+=(y-cy)*.14;fp.style.transform=`translate3d(${cx}px,${cy}px,0) scale(${on?1:.8}) rotate(${(x-cx)*.05-4}deg)`;requestAnimationFrame(t)})()}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll(".big").forEach(h=>{h.innerHTML=h.innerHTML.split(/<br\s*\/?>/).map(l=>`<span class="ln"><span>${l}</span></span>`).join("")});document.querySelectorAll(".rv,.big").forEach(n=>io.observe(n));
const bar=$("#bar");addEventListener("scroll",()=>{bar.style.transform=`scaleX(${scrollY/(document.documentElement.scrollHeight-innerHeight)})`},{passive:true});
const ck=()=>{$("#ck").textContent=new Date().toLocaleTimeString("en-GB",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit"})+" IST"};ck();setInterval(ck,20000);

const B=document.body,ld=$("#ld"),rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
document.querySelectorAll(".name span:not(.js)>i").forEach(i=>{i.innerHTML=[...i.textContent].map(c=>`<b>${c}</b>`).join("")});
function go(){B.classList.add("rdy");document.dispatchEvent(new Event("rdy"));ld.classList.add("out");setTimeout(()=>ld.remove(),1100)}
if(rm)go();else{const c=$("#lc"),t0=performance.now();(function f(t){const p=Math.min((t-t0)/1300,1);c.textContent=String(Math.round(p*p*(3-2*p)*100)).padStart(3,"0");p<1?requestAnimationFrame(f):setTimeout(go,150)})(t0)}
if(!rm){
 const L=[...document.querySelectorAll(".name b")];
 addEventListener("pointermove",e=>{if(scrollY>innerHeight*.8)return;L.forEach(b=>{const r=b.getBoundingClientRect(),k=Math.max(0,1-Math.hypot(e.clientX-r.x-r.width/2,e.clientY-r.y-r.height/2)/(innerWidth*.2));b.style.color=`color-mix(in srgb,var(--ink) ${((1-k)*100).toFixed(0)}%,transparent)`;b.style.webkitTextStroke=`${(k*.012).toFixed(4)}em var(--ink)`})},{passive:true});
 const mt=$(".mt");let mx=0,lv=0,dir=-1,ps=scrollY;(function m(){const dy=scrollY-ps;ps=scrollY;lv+=(Math.abs(dy)-lv)*.1;if(dy)dir=dy>0?-1:1;mx+=dir*(.7+lv*.7);const w=mt.scrollWidth/2;if(mx<-w)mx+=w;if(mx>0)mx-=w;mt.style.transform=`translate3d(${mx}px,0,0)`;requestAnimationFrame(m)})();
 if(fine){const cu=$("#cu");let x=0,y=0,cx=0,cy=0,s=1,sc=1;addEventListener("pointermove",e=>{x=e.clientX;y=e.clientY;s=e.target.closest("a,button")?3.4:1;cu.style.opacity=1});(function t(){cx+=(x-cx)*.22;cy+=(y-cy)*.22;sc+=(s-sc)*.18;cu.style.transform=`translate3d(${cx-9}px,${cy-9}px,0) scale(${sc})`;requestAnimationFrame(t)})();
  document.querySelectorAll(".btn").forEach(b=>{b.addEventListener("pointermove",e=>{const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.x-r.width/2)*.25}px ${(e.clientY-r.y-r.height/2)*.35}px`});b.addEventListener("pointerleave",()=>b.style.translate="")})}}
new IntersectionObserver((es,o)=>es.forEach(e=>{if(!e.isIntersecting)return;o.unobserve(e.target);e.target.querySelectorAll("strong").forEach(s=>{const n=+s.dataset.n,d=+s.dataset.d||0,t0=performance.now();(function f(t){const p=Math.min((t-t0)/1400,1);s.textContent=(n*(1-Math.pow(1-p,3))).toFixed(d)+(p==1?s.dataset.s||"":"");p<1&&requestAnimationFrame(f)})(t0)})}),{threshold:.6}).observe($(".sts"));

$("#th").addEventListener("click",()=>{const d=document.documentElement,k=d.dataset.th=="dark"?"":"dark";d.dataset.th=k;try{localStorage.th=k}catch(e){}});
const hero=$(".hero"),nm=$(".name");
addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();hero.style.setProperty("--sx",e.clientX-r.left+"px");hero.style.setProperty("--sy",e.clientY-r.top+"px")},{passive:true});
if(!rm)addEventListener("scroll",()=>{const y=Math.min(scrollY,innerHeight),nm=hero.classList.contains("pc")?$("#pc"):$(".name");nm.style.translate=`0 ${y*.28}px`;nm.style.opacity=1-y/(innerHeight*.95)},{passive:true});
if(!rm)document.querySelectorAll("nav li a").forEach(a=>{const t=a.textContent;a.addEventListener("pointerenter",()=>{let n=0;clearInterval(a._i);a._i=setInterval(()=>{a.textContent=[...t].map((c,i)=>i<n?c:"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.random()*26|0]).join("");if(++n>t.length){clearInterval(a._i);a.textContent=t}},40)})});

/* ---------- Ask my portfolio: tiny hybrid retriever ---------- */
const K=[
["about","About","Kavin JS is a Computer Science undergraduate at Amrita Vishwa Vidyapeetham, Chennai (B.Tech CSE, class of 2028) who builds full-stack and AI-powered applications with FastAPI, React and RAG pipelines.","who bio introduction student engineer developer university college"],
["contact","Availability","Kavin is looking for a Software Development Engineer (SDE) internship and placements, open to remote or hybrid work. The best way to reach him is kavinjs.dev@gmail.com.","hire hiring job opportunity available intern internship placement contact email reach open"],
["skills","Languages","Languages: Python, Java, C++, C, Haskell, SQL and VHDL. His main languages are Python, Java and C++.","tech stack tech stack skills technologies programming language coding"],
["skills","Web and backend","Web and backend: React, FastAPI, REST APIs, JavaScript, HTML, CSS and Bootstrap.","tech stack tech stack skills frontend backend framework technologies web"],
["skills","AI and tooling","AI and tooling: RAG, LLM integration, computer vision, recommendation systems, OpenAI API, prompt engineering, Git and Linux.","tech stack tech stack skills machine learning ai tools technologies"],
["work","RagForge","RagForge is a production-grade RAG pipeline with hybrid sparse and dense retrieval, cross-encoder reranking, adaptive query routing, hierarchical summarization and a statistical evaluation framework.","rag rag retrieval augmented generation project built featured"],
["work","AIKA","AIKA is a multi-tenant RAG knowledge platform: a modular monolith with strict tenant isolation, Argon2id authentication and instruction-aware embeddings, on Next.js, FastAPI, PostgreSQL pgvector, Redis and Docker. Identity and Tenancy are complete (v0.2).","rag project built platform currently building"],
["work","StyleMind AI","StyleMind AI is an AI personal stylist: a PostgreSQL virtual wardrobe, pretrained computer vision models and an LLM chat interface for outfit recommendations, built with FastAPI and React.","project built fashion clothes outfit"],
["work","Voice Wake-Word System","Voice Wake-Word System: offline, real-time wake-word detection using Vosk, with a live dashboard for confidence and detection statistics.","project built audio speech"],
["work","Recommendation System","Real-Time Recommendation System: his final-year project, a deep learning recommender with heuristic ranking and an inference pipeline in Python.","project built machine learning recommender"],
["work","TransportSense","TransportSense: transport emission analytics written in pure Haskell with a functional architecture and type-safe data pipelines.","project built functional programming"],
["work","BLE Classroom Presence","BLE Classroom Presence: a capstone using ESP32 nodes, Bluetooth Low Energy and RSSI with Wi-Fi communication to verify classroom presence with rules.","project built embedded iot hardware"],
["lead","AMCFOSS","Kavin is PR Lead at AMCFOSS, Amrita's free and open source software club, since June 2026: sponsor outreach, partnerships, internship pipelines, onboarding and coordination of workshops, hackathons and contests.","leadership club experience role open source"],
["lead","Education","B.Tech in Computer Science and Engineering at Amrita Vishwa Vidyapeetham with a CGPA of 8.08 in the 4th semester, covering DSA, operating systems, DBMS, computer architecture, OOP, algorithms and networks. Class X and XII: 75% at Achariya Siksha Mandir, Pondicherry.","grades marks gpa cgpa school degree university college study"],
["skills","Certifications","Certifications: HackerRank SQL (Advanced, Intermediate, Basic) and Python (Basic); IBM Generative AI in Action; Infosys Springboard GPT-3 for Developers, AI Foundations and UNIX and Linux; Amrita DBMS; Cisco Networking Basics.","certificates courses learning"],
["skills","Problem solving","Kavin practises data structures and algorithms daily: 105 LeetCode problems solved, DSA repositories in Python and C, and 22 public repositories on GitHub.","leetcode dsa competitive coding practice github"],
["contact","Location and links","Kavin is based in Chennai, India. GitHub: Kavin-JS. LinkedIn: kavinjs. LeetCode: KavinJS.","where location city india social links github linkedin"]];
const SW=new Set("a an the is are was be of to in for and or on with what whats who how does do did he his him has have tell me about can you your it this that any kavin s".split(" "));
const stem=w=>w.length>3?w.replace(/(ing|ed|es|s)$/,""):w,raw=s=>(s.toLowerCase().match(/[a-z0-9+#]+/g)||[]).filter(w=>w.length>1&&!SW.has(w)),tok=s=>raw(s).map(stem);
const tri=s=>{s=" "+s.toLowerCase().replace(/[^a-z0-9 ]/g," ")+" ";const m={};for(let i=0;i<s.length-2;i++){const g=s.slice(i,i+3);m[g]=(m[g]||0)+1}return m};
const cos=(a,b)=>{let d=0,x=0,y=0;for(const k in a){x+=a[k]*a[k];if(b[k])d+=a[k]*b[k]}for(const k in b)y+=b[k]*b[k];return d/(Math.sqrt(x*y)||1)};
const DOC=K.map(d=>{const full=d[1]+" "+d[2]+" "+d[3],t=tok(full);return{d,t,set:new Set(t),tf:t.reduce((m,w)=>(m[w]=(m[w]||0)+1,m),{}),tri:tri(full)}});
const N=DOC.length,avg=DOC.reduce((s,x)=>s+x.t.length,0)/N,df={};DOC.forEach(x=>x.set.forEach(w=>df[w]=(df[w]||0)+1));
const rank=a=>{const o=a.map((v,i)=>i).sort((x,y)=>a[y]-a[x]),r=[];o.forEach((i,p)=>r[i]=p+1);return r};
function retrieve(s){const q=tok(s);
 const bm=DOC.map(x=>q.reduce((a,w)=>{const f=x.tf[w]||0;return f?a+Math.log(1+(N-df[w]+.5)/(df[w]+.5))*f*2.5/(f+1.5*(.25+.75*x.t.length/avg)):a},0));
 const qt=tri(raw(s).join(" ")),de=DOC.map(x=>cos(qt,x.tri)),rb=rank(bm),rd=rank(de);
 const rr=DOC.map((x,i)=>(bm[i]>0?1/(60+rb[i]):0)+(de[i]>.05?1/(60+rd[i]):0)),mx=Math.max(...rr)||1;
 const top=rr.map((v,i)=>i).sort((a,b)=>rr[b]-rr[a]).slice(0,5).map(i=>{const cov=q.length?q.filter(w=>DOC[i].set.has(w)).length/q.length:0;return{i,score:rr[i]/mx*.45+cov*.55,cov}}).sort((a,b)=>b.score-a.score);
 const best=(a,t)=>t[a.indexOf(Math.max(...a))];
 return{q,top,miss:!q.length||top[0].cov===0,bmTop:Math.max(...bm)>0?DOC[bm.indexOf(Math.max(...bm))].d[1]:"no match",deTop:DOC[de.indexOf(Math.max(...de))].d[1]}}
const sl=ms=>new Promise(r=>setTimeout(r,rm?0:ms)),QS=$("#q"),PL=[...document.querySelectorAll("#pipe li")];let run=0;
async function ask(s){s=s.trim();if(!s)return;window.askMap&&askMap.reset();const id=++run,A=$("#ans"),S=$("#src");A.textContent="";A.classList.remove("t");S.innerHTML="";PL.forEach(l=>{l.classList.remove("on");l.querySelector("span").textContent=""});
 const R=retrieve(s);window.askMap&&askMap.show(R,s);const dets=[R.q.length+" tokens · "+(R.q.slice(0,3).join(" · ")||"none"),"best: "+R.bmTop,"best: "+R.deTop,"RRF k=60 · "+N+" chunks","5 → "+(R.miss?0:Math.min(3,R.top.length))+" sources",R.miss?"no grounded answer":"grounded in "+Math.min(3,R.top.length)+" chunks"];
 for(let i=0;i<6;i++){await sl(380);if(id!==run)return;PL[i].classList.add("on");PL[i].querySelector("span").textContent=dets[i]}
 await sl(200);if(id!==run)return;
 const txt=R.miss?"That isn't in my portfolio yet. Try asking about projects, tech stack, internships or education, or email kavinjs.dev@gmail.com.":R.top.filter((p,n)=>n<3&&p.score>=R.top[0].score*.88).map(p=>DOC[p.i].d[2]).join(" ");
 const picks=R.miss?[]:R.top.slice(0,3);S.innerHTML=picks.map(p=>{const d=DOC[p.i].d;return`<a href="#${d[0]}"><span class="m">${Math.round(p.score*100)}% match</span><div class="bar"><i data-w="${Math.round(p.score*100)}"></i></div><h4>${d[1]} ↗</h4><p>${d[2].slice(0,110)}…</p></a>`}).join("");
 [...S.children].forEach((a,i)=>setTimeout(()=>{a.classList.add("in");a.querySelector("i").style.width=a.querySelector("i").dataset.w+"%"},rm?0:200+i*180));
 if(rm){A.textContent=txt;return}A.classList.add("t");for(let i=1;i<=txt.length;i++){if(id!==run)return;A.textContent=txt.slice(0,i);await sl(13)}A.classList.remove("t")}
$("#qf").addEventListener("submit",e=>{e.preventDefault();ask(QS.value||QS.placeholder)});
$("#chs").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;QS.value=b.textContent;ask(b.textContent)});
addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()=="k"){e.preventDefault();$("#ask").scrollIntoView({behavior:"smooth"});setTimeout(()=>QS.focus({preventScroll:true}),500)}});
/* ---------- Living hero: particle name ---------- */
(async()=>{const cv=$("#pc");if(!cv||rm||window.__fluid)return;const ctx=cv.getContext("2d");try{await document.fonts.load("800 100px Inter")}catch(e){}
 await new Promise(r=>B.classList.contains("rdy")?r():document.addEventListener("rdy",r,{once:true}));
 let P0=[],P1=[],W,H,box,mx=-999,my=-999,vis=true,dark=false,ink="#0b0b0b",fr=0,sz=3;
 function build(){const dpr=Math.min(devicePixelRatio||1,2);W=hero.clientWidth;H=hero.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const o=document.createElement("canvas"),x=o.getContext("2d"),pad=Math.max(20,W*.034);let fs=100;x.font="800 100px Inter";x.letterSpacing="-7px";
  const wk=x.measureText("Kavin ").width,wj=x.measureText("JS").width,t100=wk+wj+20;fs=Math.min(100*(W-2*pad)/t100,H*.52);
  const f=fs/100,pj=.1*fs,wK=wk*f,wJ=wj*f,sx=(W-(wK+wJ+2*pj))/2,cy=Math.min(H*.46,nm.offsetTop+nm.offsetHeight*.52),th=Math.round(fs*1.3);
  o.width=W;o.height=th;x.font="800 "+fs+"px Inter";x.letterSpacing=(-.07*fs)+"px";x.textBaseline="middle";x.fillStyle="#000";
  const step=Math.max(4,Math.round(W/250));sz=step*.62;P0=[];P1=[];
  const grab=(txt,tx,arr)=>{x.clearRect(0,0,W,th);x.fillText(txt,tx,th*.52);const d=x.getImageData(0,0,W,th).data;for(let yy=0;yy<th;yy+=step)for(let xx=0;xx<W;xx+=step)if(d[(yy*W+xx)*4+3]>128)arr.push({hx:xx,hy:cy-th/2+yy,x:Math.random()*W,y:Math.random()*H,vx:0,vy:0})};
  grab("Kavin",sx,P0);grab("JS",sx+wK+pj,P1);box=[sx+wK,cy-fs*.43,wJ+2*pj,fs*.86,fs*.1]}
 build();let rt;addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(build,200)});
 new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(hero);hero.classList.add("pc");
 addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
 hero.addEventListener("pointerdown",e=>{const r=hero.getBoundingClientRect(),bx=e.clientX-r.left,by=e.clientY-r.top;[...P0,...P1].forEach(p=>{const dx=p.x-bx,dy=p.y-by,d=Math.hypot(dx,dy);if(d<300){const k=(1-d/300)*26/(d||1);p.vx+=dx*k;p.vy+=dy*k}})});
 const R=130,step2=p=>{const dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;if(d2<R*R){const d=Math.sqrt(d2)||1,k=(1-d/R)*(1-d/R)*5;p.vx+=dx/d*k;p.vy+=dy/d*k}p.vx=(p.vx+(p.hx-p.x)*.055)*.86;p.vy=(p.vy+(p.hy-p.y)*.055)*.86;p.x+=p.vx;p.y+=p.vy};
 (function loop(){requestAnimationFrame(loop);if(!vis)return;if(fr++%20==0){dark=document.documentElement.dataset.th=="dark";ink=getComputedStyle(hero).getPropertyValue("--ink").trim()||"#0b0b0b"}
  ctx.clearRect(0,0,W,H);ctx.fillStyle=dark?"#d4ff3a":"#0b0b0b";ctx.beginPath();ctx.roundRect(box[0],box[1],box[2],box[3],box[4]);ctx.fill();
  ctx.fillStyle=ink;for(const p of P0){step2(p);ctx.fillRect(p.x,p.y,sz,sz)}
  ctx.fillStyle=dark?"#0b0b0b":"#d4ff3a";for(const p of P1){step2(p);ctx.fillRect(p.x,p.y,sz,sz)}})()})();

/* timeline progress, scroll-velocity skew, work spotlight */
const tl=document.querySelector(".tl2"),rows=[...document.querySelectorAll(".tl2 .rw")],wk=document.querySelector(".work");
if(tl){const f=()=>{const r=tl.getBoundingClientRect(),y=innerHeight*.62;tl.style.setProperty("--p",Math.max(0,Math.min(1,(y-r.top)/r.height)));rows.forEach(w=>w.classList.toggle("on",w.getBoundingClientRect().top<y))};addEventListener("scroll",f,{passive:true});f()}
if(!rm){let ps=scrollY,sk=0;(function s(){const d=scrollY-ps;ps=scrollY;sk+=(Math.max(-9,Math.min(9,d*.22))-sk)*.12;document.documentElement.style.setProperty("--sk",sk.toFixed(2)+"deg");requestAnimationFrame(s)})()}
if(wk)wk.addEventListener("pointermove",e=>{const r=wk.getBoundingClientRect();wk.style.setProperty("--wx",e.clientX-r.left+"px");wk.style.setProperty("--wy",e.clientY-r.top+"px")},{passive:true});

document.querySelectorAll(".ce li").forEach(l=>{const b=l.querySelector("b"),r=l.textContent.slice(b.textContent.length).replace(/^\s*·\s*/,"");l.innerHTML=`<b>${b.textContent}</b><span>${r}</span>`;
 l.addEventListener("pointermove",e=>{const r=l.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;l.style.setProperty("--cx",x*100+"%");l.style.setProperty("--cy",y*100+"%");if(!rm)l.style.transform=`rotateX(${(.5-y)*10}deg) rotateY(${(x-.5)*12}deg) translateZ(6px)`});l.addEventListener("pointerleave",()=>l.style.transform="")});
