/* Architecture Explorer: every project as an interactive, ray-marched 3D component graph (WebGL2, no libraries).
   Node = [label,x,y,z,radius,type(0 sphere,1 box),kind,description,planned?]   Edge = [from,to,what happens along it] */
(()=>{const sec=document.querySelector("#show");if(!sec)return;
const $=s=>sec.querySelector(s),rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
const P=[
{t:"RagForge",k:"Featured",d:"A production-grade RAG pipeline: sparse and dense search fused, reranked and statistically evaluated.",g:["Python","RAG","Hybrid retrieval","Cross-encoder reranking","Adaptive routing"],u:"https://github.com/Kavin-JS/RagForge",cs:"/work/ragforge.html",
 n:[["Query",-1.9,0,0,.26,0,"Input","A user question enters the pipeline."],["Router",-.95,0,.2,.3,0,"Process","Adaptive query routing: picks the retrieval strategy that suits each query."],["BM25 · sparse",-.1,.85,-.3,.34,0,"Retriever","Keyword scoring. Strong on exact terms, identifiers and rare words."],["Dense · vectors",-.1,-.85,-.3,.34,1,"Retriever","Embedding search by vector similarity. Strong on paraphrases."],["Fusion",.75,0,0,.3,0,"Process","Merges the two ranked lists into one candidate ranking."],["Rerank",1.45,0,.2,.3,0,"Model","A cross-encoder re-reads query and passage together to sharpen the top results."],["Answer",2.1,0,0,.26,0,"Output","The final ranked evidence used to answer the question."],["Summaries",.35,1.3,.9,.24,1,"Index","Hierarchical summarization: layers of summaries over long corpora."],["Evaluation",1.5,-1.1,-.5,.26,0,"Measurement","A statistical framework that tests retrieval and answer quality."]],
 e:[[0,1,"The query arrives at the router."],[1,2,"Keyword-style queries go down the sparse path."],[1,3,"Open-ended questions go down the dense path."],[2,4,"Sparse results join the fusion step."],[3,4,"Dense results join the fusion step."],[4,5,"Fused candidates are reranked."],[5,6,"The top results become the answer."],[7,3,"Layered summaries are indexed for dense search."],[5,8,"Rankings are measured statistically."],[6,8,"So are the final answers."]]},
{t:"AIKA",k:"In development",d:"A multi-tenant RAG knowledge platform with strict tenant isolation. Complete through Identity and Tenancy (v0.2).",g:["RAG","Next.js","FastAPI","PostgreSQL","pgvector","Redis","Docker"],u:"https://github.com/Kavin-JS/AIKA",cs:"/work/aika.html",
 n:[["Next.js client",-1.9,0,0,.3,0,"Client","The web front end the tenant's users interact with."],["FastAPI · monolith",-.9,0,0,.36,0,"Service","One deployable with hard module boundaries (a modular monolith)."],["Identity",.05,1.0,.3,.28,0,"Module","Authentication with Argon2id password hashing. Shipped in v0.1."],["Tenancy",.05,.2,.3,.28,0,"Module","Strict tenant isolation: every request is scoped to one tenant. Shipped in v0.2."],["Documents",.05,-.6,.3,.24,0,"Module","Document ingestion and storage. Planned.",true],["Retrieval",.05,-1.3,.3,.24,0,"Module","Instruction-aware embeddings and search. Planned.",true],["PostgreSQL · pgvector",1.3,.3,-.3,.36,1,"Data store","Relational data plus vector search in one database."],["Redis",1.3,-.8,.3,.28,1,"Data store","In-memory store in the stack."]],
 e:[[0,1,"The client calls the API."],[1,2,"Sign-in is handled by the Identity module."],[1,3,"Every request is resolved to a tenant."],[1,4,"Document features sit behind the same API (planned)."],[1,5,"So does retrieval (planned)."],[2,6,"Accounts are stored in PostgreSQL."],[3,6,"Tenant data is isolated in the database layer."],[5,6,"Vector search runs on pgvector (planned)."],[3,7,"Redis sits alongside for fast in-memory state."]]},
{t:"StyleMind AI",k:"In development",d:"An AI personal stylist: a PostgreSQL wardrobe, pretrained vision models and an LLM chat for outfit recommendations.",g:["FastAPI","React","PostgreSQL","Computer vision","LLM"],u:"https://github.com/Kavin-JS/Shonowear-Ver4.0",cs:"/work/stylemind.html",
 n:[["React app",-1.9,0,0,.3,0,"Client","Wardrobe, uploads and the chat interface."],["FastAPI",-.8,0,0,.34,0,"Service","The API between the app, the database and the models."],["Vision models",.1,.95,.2,.32,0,"Model","Pretrained computer vision models that read garments from photos."],["PostgreSQL wardrobe",.1,-.9,.2,.34,1,"Data store","The virtual wardrobe: every item you own."],["LLM stylist",1.1,0,-.3,.34,0,"Model","A chat model that recommends outfits in plain language."],["Outfit ideas",2.0,0,0,.26,0,"Output","Recommendations built from clothes you actually have."]],
 e:[[0,1,"You upload a photo or ask for an outfit."],[1,2,"Photos go to the vision models."],[2,3,"Detected garments are saved to the wardrobe."],[1,3,"The API reads and writes the wardrobe."],[1,4,"Chat requests go to the LLM."],[3,4,"The wardrobe is given to the LLM as context."],[4,5,"The LLM proposes outfits."],[5,0,"Ideas come back to the app."]]},
{t:"Voice Wake-Word",k:"Shipped",d:"Offline, real-time wake-word detection with a live dashboard for confidence, detections and a virtual LED.",g:["Python","Vosk","SoundDevice"],u:"https://github.com/Kavin-JS/Voice-Wake-Word-System",
 n:[["Microphone",-1.9,0,0,.28,0,"Input","Live audio from the device."],["Audio stream",-1.0,0,0,.3,0,"Process","SoundDevice streams short audio blocks in real time."],["Vosk recognizer",-.1,0,0,.36,0,"Model","Offline speech recognition: no cloud, no network."],["Wake-word matcher",.9,0,.1,.32,0,"Process","Checks the transcript for the wake word and tracks confidence."],["Virtual LED",1.8,.8,0,.26,0,"Output","Lights up when the wake word is detected."],["Dashboard",1.8,-.8,0,.3,1,"Output","Live confidence, detection statistics and history."]],
 e:[[0,1,"Audio is captured continuously."],[1,2,"Blocks are fed to the recognizer."],[2,3,"Partial and final text is compared with the wake word."],[3,4,"A confident match turns the LED on."],[3,5,"Every detection and its confidence is logged."],[2,5,"Recognizer confidence streams to the dashboard."]]},
{t:"Real-Time Recommender",k:"Final-year project",d:"A deep learning recommender with heuristic ranking and an inference pipeline, built in Python.",g:["Python","Deep learning","Recommendation systems"],u:"https://github.com/Kavin-JS/Real-Time-Recommendation-System",
 n:[["Interactions",-1.9,0,0,.28,1,"Data","What users did: the signal the model learns from."],["Deep model",-.9,0,.1,.38,0,"Model","A neural network that learns user and item preferences."],["Candidate scores",.1,.5,0,.3,0,"Process","The model scores candidate items for a user."],["Heuristic ranking",1.0,.5,0,.32,0,"Process","Rules re-order the scored items for the final list."],["Inference pipeline",.1,-.9,.2,.34,0,"Service","Serves the model for real-time requests."],["Recommendations",1.9,0,0,.28,0,"Output","The ranked list shown to the user."]],
 e:[[0,1,"Interaction data trains the model."],[1,2,"The model scores candidates."],[2,3,"Scores are re-ranked with heuristics."],[3,5,"The ranked list is returned."],[4,1,"The pipeline serves the trained model."],[4,5,"In real time, per request."]]},
{t:"TransportSense",k:"Shipped",d:"Transport emission analytics written in pure Haskell: a functional architecture with type-safe data pipelines.",g:["Haskell","Functional programming","Data analytics"],u:"https://github.com/Kavin-JS/TransportSense",
 n:[["Transport data",-1.9,0,0,.28,1,"Data","Raw trip and vehicle records."],["Typed parsing",-.9,0,0,.32,0,"Process","The type system rejects malformed data at the boundary."],["Pure transforms",.1,.6,0,.34,0,"Process","Side-effect-free functions: easy to test and reason about."],["Emission analytics",1.1,.6,0,.34,0,"Process","Computes emissions from the cleaned data."],["Report",2.0,0,0,.28,0,"Output","Results ready to read."],["Type system",.1,-.9,.2,.3,1,"Guarantee","Haskell's types make invalid states unrepresentable."]],
 e:[[0,1,"Records enter through typed parsers."],[1,2,"Valid data flows into pure functions."],[2,3,"Analytics are computed."],[3,4,"A report is produced."],[5,1,"Types guard the parsing step."],[5,2,"And every transformation."]]},
{t:"BLE Classroom Presence",k:"Capstone",d:"Multi-node classroom presence verification with ESP32 nodes, BLE RSSI readings, Wi-Fi and rule-based checks.",g:["ESP32","BLE","Embedded systems"],u:"https://github.com/Kavin-JS/BLE-Classroom-Presence",
 n:[["BLE signal",-1.9,0,0,.26,0,"Device","A Bluetooth Low Energy signal from a device in the room."],["ESP32 node A",-.9,.9,.1,.3,0,"Device","Scans BLE and measures signal strength (RSSI)."],["ESP32 node B",-.9,0,.1,.3,0,"Device","A second vantage point on the same signal."],["ESP32 node C",-.9,-.9,.1,.3,0,"Device","A third, so position can be cross-checked."],["Wi-Fi link",.1,0,0,.28,1,"Network","Nodes report their readings over Wi-Fi."],["Collector",1.0,0,0,.34,0,"Service","Gathers readings from all nodes."],["Rule checks",1.9,.7,0,.3,0,"Process","Rule-based checks decide whether the readings look like real presence."],["Verdict",1.9,-.7,0,.26,0,"Output","Present or not present."]],
 e:[[0,1,"Node A measures the signal strength."],[0,2,"So does node B."],[0,3,"And node C."],[1,4,"Each node reports over Wi-Fi."],[2,4,"All of them."],[3,4,"Together."],[4,5,"Readings reach the collector."],[5,6,"Rules compare the nodes' readings."],[6,7,"A verdict is produced."]]},
{t:"DSA Practice",k:"Ongoing",d:"Data structures and algorithms in Python and C: 105 LeetCode problems solved and practised daily.",g:["Python","C","DSA"],u:"https://github.com/Kavin-JS?tab=repositories",
 n:[["DSA",0,0,0,.42,0,"Hub","Daily practice across the fundamentals."],["Arrays",-1.7,.5,.2,.28,1,"Topic","Indexing, two pointers, sliding windows."],["Strings",-1.2,1.15,-.1,.26,1,"Topic","Parsing, matching, manipulation."],["Sorting",-.3,1.5,.1,.26,1,"Topic","Comparison sorts and their trade-offs."],["Searching",1.0,1.3,.1,.26,1,"Topic","Binary search and its variants."],["Dynamic programming",1.7,.3,-.2,.3,1,"Topic","Overlapping subproblems and memoization."],["Pointers · C",1.2,-1.0,.2,.28,1,"Topic","Pointer-based structures written in C."],["LeetCode · 105",-1.0,-1.0,.2,.3,0,"Practice","105 problems solved."]],
 e:[[0,1,"Arrays: the foundation."],[0,2,"Strings."],[0,3,"Sorting."],[0,4,"Searching."],[0,5,"Dynamic programming."],[0,6,"Pointer-based structures in C."],[0,7,"All of it tested on LeetCode."]]}];
const NM=12,EM=16,SC=.7,N=P.length;
/* ---------- UI ---------- */
const ai=$("#ai"),nls=$("#nls"),tf=$("#tf");
ai.innerHTML=P.map((p,i)=>`<li><button type="button" data-i="${i}"><b>${String(i+1).padStart(2,"0")}</b>${p.t}</button></li>`).join("");
const cnt={};P.forEach(p=>p.g.forEach(g=>cnt[g]=(cnt[g]||0)+1));
tf.innerHTML='<span class="m">Filter</span>'+Object.keys(cnt).filter(k=>cnt[k]>=2).map(c=>`<button type="button" class="chip" data-t="${c}">${c}</button>`).join("");
const labels=Array.from({length:NM},()=>{const s=document.createElement("span");s.className="nl";nls.append(s);return s});
let cur=-1,sel=-1,hov=-1,filt="",step=0,playing=!rm,stepT=0,pulseT=0;
const cN=new Float32Array(NM*4),cT=new Float32Array(NM*4),tN=new Float32Array(NM*4),cEA=new Float32Array(EM*4),cEB=new Float32Array(EM*4),eAB=[];let nc=0,ec=0;
function load(i){cur=i;const p=P[i],SC=innerWidth<860?.5:.7;nc=p.n.length;ec=p.e.length;sel=-1;hov=-1;step=0;stepT=0;
 for(let k=0;k<NM;k++){const n=p.n[k];if(n){tN[k*4]=n[1]*SC;tN[k*4+1]=n[2]*SC;tN[k*4+2]=n[3]*SC;tN[k*4+3]=n[4]*SC*1.15;cT[k*4]=n[5];cT[k*4+2]=n[8]?1:0;if(cN[k*4+3]<.01){cN[k*4]=tN[k*4];cN[k*4+1]=tN[k*4+1];cN[k*4+2]=tN[k*4+2]}labels[k].textContent=n[0]+(n[8]?" (planned)":"");labels[k].classList.toggle("pl",!!n[8]);labels[k].style.display=""}else{tN[k*4+3]=0;labels[k].style.display="none"}}
 eAB.length=0;p.e.forEach(e=>eAB.push([e[0],e[1]]));
 ai.querySelectorAll("button").forEach((b,j)=>b.classList.toggle("on",j==i));
 $("#ak").textContent=`0${i+1} / 0${N} · ${p.k}`;$("#at").textContent=p.t;$("#ad").textContent=p.d;
 $("#ag").innerHTML=p.g.map(g=>`<span class="${g==filt?"hl":""}">${g}</span>`).join("");
 $("#ab").innerHTML=(p.cs?`<a class="lk" href="${p.cs}">Case study →</a>`:"")+`<a class="lk ghost" href="${p.u}" target="_blank" rel="noopener">GitHub ↗</a>`;
 info();stepUi()}
function info(){const ni=$("#ni"),k=hov>=0?hov:sel,p=P[cur];if(k<0||!p.n[k]){ni.classList.remove("on");return}const n=p.n[k];$("#nk").textContent=n[6]+(n[8]?" · planned":"");$("#nt").textContent=n[0];$("#nd").textContent=n[7];ni.classList.add("on")}
function stepUi(){const e=P[cur].e[step];$("#ts").textContent=e?e[2]:"";$("#tc").textContent=`Step ${step+1} / ${ec}`;$("#tpl").textContent=playing?"❚❚":"▶";$("#tpl").setAttribute("aria-label",playing?"Pause trace":"Play trace")}
function setStep(s){step=(s+ec)%ec;stepT=0;stepUi()}
$("#tp").onclick=()=>{playing=false;setStep(step-1)};$("#tn").onclick=()=>{playing=false;setStep(step+1)};$("#tpl").onclick=()=>{playing=!playing;stepUi()};
const total=()=>Math.max(1,sec.offsetHeight-innerHeight);
function goto(i){const i2=Math.max(0,Math.min(N-1,i));scrollTo({top:sec.offsetTop+(i2+.5)/N*total(),behavior:rm?"auto":"smooth"})}
ai.addEventListener("click",e=>{const b=e.target.closest("button");if(b)goto(+b.dataset.i)});
tf.addEventListener("click",e=>{const b=e.target.closest(".chip");if(!b)return;filt=filt==b.dataset.t?"":b.dataset.t;tf.querySelectorAll(".chip").forEach(c=>c.classList.toggle("on",c.dataset.t==filt));ai.querySelectorAll("button").forEach((x,j)=>x.classList.toggle("dim",!!filt&&!P[j].g.includes(filt)));$("#ag").innerHTML=P[cur].g.map(g=>`<span class="${g==filt?"hl":""}">${g}</span>`).join("")});
addEventListener("keydown",e=>{if(!vis||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key=="ArrowRight"||e.key=="ArrowDown"&&e.altKey){e.preventDefault();goto(cur+1)}else if(e.key=="ArrowLeft"){e.preventDefault();goto(cur-1)}else if(e.key==" "&&e.target===document.body){e.preventDefault();$("#tpl").click()}});
/* ---------- WebGL ---------- */
const cv=sec.querySelector("canvas");let gl=cv.getContext("webgl2",{antialias:false,alpha:false,powerPreference:"high-performance"}),vis=false,ok=!!gl;
const FS=`#version 300 es
precision highp float;out vec4 o;uniform vec2 uR,uY;uniform float uT,uD;uniform vec3 uBg,uLime;uniform vec4 uN[12],uNT[12],uEA[16],uEB[16];
float sm(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
mat2 R(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float box(vec3 p,vec3 b,float r){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
float cap(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-4),0.,1.);return length(pa-ba*h)-r;}
float map(vec3 p){float d=1e5;for(int i=0;i<12;i++){float r=uN[i].w;if(r<.01)continue;vec3 q=p-uN[i].xyz;float nd=uNT[i].x<.5?length(q)-r:box(q,vec3(r*.76),r*.28);d=sm(d,nd,.09);}
for(int i=0;i<16;i++){float r=uEA[i].w;if(r<.005)continue;d=sm(d,cap(p,uEA[i].xyz,uEB[i].xyz,r),.05);}return d;}
vec3 nor(vec3 p){vec2 e=vec2(.0015,-.0015);return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));}
vec3 env(vec3 r){float y=r.y*.5+.5;vec3 c=mix(vec3(.025,.03,.035),vec3(.9,.92,.95),smoothstep(.1,.95,y));c+=pow(max(dot(r,normalize(vec3(-.4,.8,.5))),0.),28.)*1.5;c+=uLime*pow(max(dot(r,normalize(vec3(.9,-.1,-.35))),0.),7.)*1.3;c+=vec3(.35,.5,1.)*pow(max(dot(r,normalize(vec3(-.85,-.2,.2))),0.),9.)*.4;return c;}
vec3 shade(vec3 p,vec3 n,vec3 rd){float hi=0.,pl=0.,best=1e5;
for(int i=0;i<12;i++){float r=uN[i].w;if(r<.01)continue;float nd=length(p-uN[i].xyz)-r;if(nd<best){best=nd;hi=uNT[i].y;pl=uNT[i].z;}}
for(int i=0;i<16;i++){float r=uEA[i].w;if(r<.005)continue;float ed=cap(p,uEA[i].xyz,uEB[i].xyz,r);if(ed<best){best=ed;hi=clamp((r-.035)/.025,0.,1.);pl=0.;}}
vec3 rr=reflect(rd,n);float fr=pow(1.-max(dot(n,-rd),0.),3.);vec3 c=env(rr)*(.78+.5*fr);float ao=0.;for(int i=1;i<4;i++){float h=.1*float(i);ao+=(h-map(p+n*h))/pow(2.,float(i));}
c*=1.-clamp(ao*1.5,0.,.8);c+=uLime*fr*.4;c=mix(c,c*vec3(.75,1.,.45)+uLime*(.25+.4*fr),hi);c*=mix(1.,.38,pl);return c;}
vec3 bg(vec2 uv){vec3 b=uBg*(1.-.5*length(uv*vec2(.8,1.)));b+=uLime*.04*exp(-dot(uv,uv)*3.);return b;}
void main(){vec2 uv0=(gl_FragCoord.xy-.5*uR)/uR.y;vec2 uv=uv0-(uR.x>uR.y?vec2(.27,0.):vec2(0.,.2));
vec3 ro=vec3(0.,0.,uD);ro.yz*=R(uY.y);ro.xz*=R(uY.x);vec3 f=normalize(-ro),r=normalize(cross(f,vec3(0.,1.,0.))),u=cross(r,f);float fl=1.7*clamp(uR.x/uR.y/.95,.42,1.);vec3 rd=normalize(f*fl+uv.x*r+uv.y*u);
float b=dot(ro,rd),h=b*b-(dot(ro,ro)-6.8),t=0.,te=0.,dm=1e5,tm=0.;bool hit=false;
if(h>0.){h=sqrt(h);t=max(-b-h,0.);te=-b+h;for(int i=0;i<72;i++){float d=map(ro+rd*t);if(d<dm){dm=d;tm=t;}if(d<.0015){hit=true;break;}t+=d*.85;if(t>te)break;}}
vec3 col=bg(uv0);float px=tm/(fl*uR.y)*1.6;
if(hit||dm<px){float tt=hit?t:tm;vec3 p=ro+rd*tt,n=nor(p);float cov=hit?1.:1.-smoothstep(0.,px,dm);col=mix(col,shade(p,n,rd),cov);}
float glw=0.;for(int i=0;i<16;i++){float w=uEB[i].w;if(w<0.||uEA[i].w<.005)continue;vec3 P=mix(uEA[i].xyz,uEB[i].xyz,w),v=P-ro;float tp=dot(v,rd);if(tp<=0.)continue;float dd=length(v-rd*tp);float vis=hit?step(tp,t+.12):1.;glw+=vis*exp(-dd*dd*260.);}
col+=uLime*glw*1.7;col=pow(col,vec3(.96));col+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)*.012;o=vec4(col,1.);}`;
let pr,U={};
if(ok){const sh=(p,t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(x);gl.attachShader(p,x)};
 try{pr=gl.createProgram();sh(pr,gl.VERTEX_SHADER,`#version 300 es
void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));gl_Position=vec4(p*2.-1.,0.,1.);}`);sh(pr,gl.FRAGMENT_SHADER,FS);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw gl.getProgramInfoLog(pr);
  gl.useProgram(pr);["uR","uY","uT","uD","uBg","uLime","uN[0]","uNT[0]","uEA[0]","uEB[0]"].forEach(n=>U[n]=gl.getUniformLocation(pr,n));gl.uniform3f(U.uBg,.043,.043,.043);gl.uniform3f(U.uLime,.83,1,.23)}catch(e){console.warn("explorer shader",e);ok=false}}
if(!ok){sec.classList.add("nogl")}
const QP=+new URLSearchParams(location.search).get("sc"),MAXQ=QP||(innerWidth<700?.6:.75);let Q=MAXQ,ema=16,lt=0;
function size(){const s=Math.min(devicePixelRatio||1,1.5)*Q;cv.width=Math.max(8,Math.round(cv.clientWidth*s));cv.height=Math.max(8,Math.round(cv.clientHeight*s))}size();addEventListener("resize",size);
new IntersectionObserver(e=>vis=e[0].isIntersecting,{rootMargin:"100px"}).observe(sec);
/* camera + projection (mirrors the shader) */
const D=5.3;let yawU=.25,pitU=.1,vy=0,vp=0,drag=null,moved=0,yaw=0,pit=0;
function camv(){let y=-Math.sin(pit)*D,z=Math.cos(pit)*D;const x=-Math.sin(yaw)*z;z=Math.cos(yaw)*z;const ro=[x,y,z],l=Math.hypot(...ro),f=ro.map(v=>-v/l),r0=[-f[2],0,f[0]],rl=Math.hypot(...r0),r=r0.map(v=>v/rl),u=[r[1]*f[2]-r[2]*f[1],r[2]*f[0]-r[0]*f[2],r[0]*f[1]-r[1]*f[0]];return{ro,f,r,u}}
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
function proj(c,x,y,z,rad){const v=[x-c.ro[0],y-c.ro[1],z-c.ro[2]],zz=dot(v,c.f),W=cv.clientWidth,H=cv.clientHeight,fl=1.7*Math.min(1,Math.max(.42,W/H/.95)),ux=dot(v,c.r)/zz*fl,uy=dot(v,c.u)/zz*fl,sx=W>H?.27:0,sy=W>H?0:.2;return{x:(ux+sx)*H+.5*W,y:H-((uy+sy)*H+.5*H),s:rad/zz*fl*H,z:zz}}
let pts=[];
function pick(mx,my){let b=-1,bd=1e9;pts.forEach((p,k)=>{if(!p)return;const d=Math.hypot(p.x-mx,p.y-my);if(d<Math.max(p.s,16)+10&&d<bd){bd=d;b=k}});return b}
cv.addEventListener("pointerdown",e=>{drag={x:e.clientX,y:e.clientY};moved=0;sec.classList.add("drag");cv.setPointerCapture(e.pointerId)});
cv.addEventListener("pointermove",e=>{const r=cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag={x:e.clientX,y:e.clientY};moved+=Math.abs(dx)+Math.abs(dy);vy=dx*.0055;vp=dy*.004;yawU+=vy;pitU=Math.max(-.9,Math.min(.9,pitU+vp))}else{const h=pick(mx,my);if(h!==hov){hov=h;info();cv.style.cursor=h>=0?"pointer":"grab"}}});
const end=e=>{if(!drag)return;sec.classList.remove("drag");if(moved<6){const r=cv.getBoundingClientRect(),h=pick(e.clientX-r.left,e.clientY-r.top);sel=h==sel?-1:h;info()}drag=null};cv.addEventListener("pointerup",end);cv.addEventListener("pointercancel",end);cv.addEventListener("pointerleave",()=>{if(!drag&&hov>=0){hov=-1;info()}});
const hiC=new Float32Array(NM);
load(0);
function loop(now){requestAnimationFrame(loop);if(!vis){lt=0;return}const dt=lt?Math.min((now-lt)/1000,.1):.016;
 if(lt&&ok&&!QP){ema+=(Math.min(now-lt,200)-ema)*.08;if(ema>36&&Q>.32){Q=Math.max(.32,Q*.88);ema=24;size()}else if(ema<19&&Q<MAXQ){Q=Math.min(MAXQ,Q*1.06);size()}}lt=now;
 const tt=Math.max(0,Math.min(.9999,-sec.getBoundingClientRect().top/total())),idx=Math.floor(tt*N);if(idx!==cur)load(idx);
 if(!drag){yawU+=vy;pitU+=vp;vy*=.93;vp*=.93}const t=now/1000;yaw=yawU+(rm?0:.22*Math.sin(t*.2));pit=pitU+(rm?0:.08*Math.sin(t*.16));
 if(playing){stepT+=dt;if(stepT>2.1)setStep(step+1)}const act=P[cur].e[step],pulse=(rm?.5:((now/1000)*.9)%1);
 for(let k=0;k<NM;k++){const o=k*4;for(let c=0;c<4;c++)cN[o+c]+=(tN[o+c]-cN[o+c])*.11;const want=(k==hov||k==sel)?1:(act&&(act[0]==k||act[1]==k)?.5:0);hiC[k]+=(want-hiC[k])*.15;cT[o+1]=hiC[k]}
 const nodeArr=new Float32Array(NM*4);for(let k=0;k<NM;k++){nodeArr[k*4]=cN[k*4];nodeArr[k*4+1]=cN[k*4+1];nodeArr[k*4+2]=cN[k*4+2];nodeArr[k*4+3]=cN[k*4+3]*(1+.14*hiC[k])}
 for(let i=0;i<EM;i++){const o=i*4,ab=eAB[i];if(ab){const a=ab[0]*4,b=ab[1]*4,hot=i==step?.06:.035;for(let c=0;c<3;c++){cEA[o+c]+=(cN[a+c]-cEA[o+c])*.3;cEB[o+c]+=(cN[b+c]-cEB[o+c])*.3}cEA[o+3]+=(hot-cEA[o+3])*.2;cEB[o+3]=i==step?pulse:-1}else{cEA[o+3]+=(0-cEA[o+3])*.25;cEB[o+3]=-1}}
 const c=camv();pts=[];for(let k=0;k<NM;k++){if(nodeArr[k*4+3]<.02||k>=nc){pts[k]=null;continue}const p=proj(c,nodeArr[k*4],nodeArr[k*4+1],nodeArr[k*4+2],nodeArr[k*4+3]);pts[k]=p;const l=labels[k];l.style.transform=`translate(${p.x}px,${p.y+Math.max(p.s,8)+7}px) translateX(-50%)`;l.classList.toggle("hot",k==hov||k==sel||(act&&(act[0]==k||act[1]==k)))}
 if(ok){gl.viewport(0,0,cv.width,cv.height);gl.uniform2f(U.uR,cv.width,cv.height);gl.uniform2f(U.uY,yaw,pit);gl.uniform1f(U.uT,t);gl.uniform1f(U.uD,D);gl.uniform4fv(U["uN[0]"],nodeArr);gl.uniform4fv(U["uNT[0]"],cT);gl.uniform4fv(U["uEA[0]"],cEA);gl.uniform4fv(U["uEB[0]"],cEB);gl.drawArrays(gl.TRIANGLES,0,3)}}
requestAnimationFrame(loop);
})();
