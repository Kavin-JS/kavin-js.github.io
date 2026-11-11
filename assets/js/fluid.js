/* GPU Navier–Stokes fluid (WebGL2) driving a liquid-lens typographic hero.
   Pipeline per frame: curl → vorticity confinement → divergence → pressure (Jacobi x20) → gradient subtract → advect velocity → advect dye → refract text. */
(()=>{
const hero=document.querySelector(".hero"),cv0=document.querySelector("#pc");
if(!hero||!cv0||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
const T=document.createElement("canvas").getContext("webgl2");
if(!T||!(T.getExtension("EXT_color_buffer_float")||T.getExtension("EXT_color_buffer_half_float")))return;
let cv=cv0,gl;
try{init()}catch(e){console.warn("fluid fallback",e);const n=cv0.cloneNode();cv0.replaceWith(n);return}
function init(){
gl=cv.getContext("webgl2",{alpha:false,antialias:false,depth:false,stencil:false});
gl.getExtension("EXT_color_buffer_float");gl.getExtension("EXT_color_buffer_half_float");
const VS=`#version 300 es
precision highp float;out vec2 vUv,vL,vR,vT,vB;uniform vec2 texelSize;
void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));vUv=p;vL=p-vec2(texelSize.x,0.);vR=p+vec2(texelSize.x,0.);vT=p+vec2(0.,texelSize.y);vB=p-vec2(0.,texelSize.y);gl_Position=vec4(p*2.-1.,0.,1.);}`;
const H=`#version 300 es
precision highp float;precision highp sampler2D;in vec2 vUv,vL,vR,vT,vB;out vec4 o;
`;
const P={};
const sh=(p,t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(x);gl.attachShader(p,x)};
const prog=(n,fs)=>{const p=gl.createProgram();sh(p,gl.VERTEX_SHADER,VS);sh(p,gl.FRAGMENT_SHADER,H+fs);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw gl.getProgramInfoLog(p);const u={};for(let i=0,c=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);i<c;i++){const nm=gl.getActiveUniform(p,i).name;u[nm]=gl.getUniformLocation(p,nm)}P[n]={p,u}};
const use=n=>{gl.useProgram(P[n].p);return P[n].u};
prog("adv",`uniform sampler2D uV,uS;uniform vec2 texelSize;uniform float dt,diss;void main(){vec2 c=vUv-dt*texture(uV,vUv).xy*texelSize;o=texture(uS,c)/(1.+diss*dt);}`);
prog("div",`uniform sampler2D uV;void main(){float L=texture(uV,vL).x,R=texture(uV,vR).x,T=texture(uV,vT).y,B=texture(uV,vB).y;vec2 C=texture(uV,vUv).xy;if(vL.x<0.)L=-C.x;if(vR.x>1.)R=-C.x;if(vT.y>1.)T=-C.y;if(vB.y<0.)B=-C.y;o=vec4(.5*(R-L+T-B),0.,0.,1.);}`);
prog("curl",`uniform sampler2D uV;void main(){float L=texture(uV,vL).y,R=texture(uV,vR).y,T=texture(uV,vT).x,B=texture(uV,vB).x;o=vec4(.5*(R-L-T+B),0.,0.,1.);}`);
prog("vort",`uniform sampler2D uV,uC;uniform float curl,dt;void main(){float L=texture(uC,vL).x,R=texture(uC,vR).x,T=texture(uC,vT).x,B=texture(uC,vB).x,C=texture(uC,vUv).x;vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));f/=length(f)+.0001;f*=curl*C;f.y*=-1.;vec2 v=texture(uV,vUv).xy+f*dt;o=vec4(clamp(v,-1000.,1000.),0.,1.);}`);
prog("pres",`uniform sampler2D uP,uD;void main(){float L=texture(uP,vL).x,R=texture(uP,vR).x,T=texture(uP,vT).x,B=texture(uP,vB).x;o=vec4((L+R+B+T-texture(uD,vUv).x)*.25,0.,0.,1.);}`);
prog("grad",`uniform sampler2D uP,uV;void main(){float L=texture(uP,vL).x,R=texture(uP,vR).x,T=texture(uP,vT).x,B=texture(uP,vB).x;vec2 v=texture(uV,vUv).xy-vec2(R-L,T-B);o=vec4(v,0.,1.);}`);
prog("clear",`uniform sampler2D uT;uniform float val;void main(){o=texture(uT,vUv)*val;}`);
prog("splat",`uniform sampler2D uT;uniform float asp,rad;uniform vec2 pt;uniform vec3 col;void main(){vec2 p=vUv-pt;p.x*=asp;o=vec4(texture(uT,vUv).xyz+exp(-dot(p,p)/rad)*col,1.);}`);
prog("show",`uniform sampler2D uTx,uVel,uDye;uniform vec2 uTexel;uniform vec3 uBg,uLime;
void main(){vec2 uv=vUv;vec2 v=texture(uVel,uv).xy;float d=texture(uDye,uv).x;
float dx=texture(uDye,uv+vec2(uTexel.x,0.)).x-texture(uDye,uv-vec2(uTexel.x,0.)).x;float dy=texture(uDye,uv+vec2(0.,uTexel.y)).x-texture(uDye,uv-vec2(0.,uTexel.y)).x;
vec2 g=vec2(dx,dy)*.5;vec2 off=-v*.00016-g*.55;float l=length(off);off*=min(1.,.035/(l+1e-5));
vec4 a=texture(uTx,uv+off),b=texture(uTx,uv+off*1.2),c=texture(uTx,uv+off*1.42);
vec3 col=vec3(a.r+uBg.r*(1.-a.a),b.g+uBg.g*(1.-b.a),c.b+uBg.b*(1.-c.a));
float m=smoothstep(.05,.7,d);vec3 n=normalize(vec3(-g*22.,1.));vec3 L=normalize(vec3(-.45,.55,.7));
float dif=dot(n,L)*.5+.5,spec=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),40.);
vec3 liq=uLime*(.55+.6*dif)+spec*.9;col=mix(col,liq,m*.34)+spec*m*.35;o=vec4(col,1.);}`);
const fbo=(w,h,f=gl.LINEAR)=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,f);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,f);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,w,h,0,gl.RGBA,gl.HALF_FLOAT,null);const b=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,b);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw"fbo";gl.viewport(0,0,w,h);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);return{t,b,w,h,tx:[1/w,1/h]}};
const dbl=(w,h)=>{const o={r:fbo(w,h),w:fbo(w,h),sw(){const x=o.r;o.r=o.w;o.w=x}};return o};
const tex=(f,i,loc)=>{gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,f.t);gl.uniform1i(loc,i)};
const blit=f=>{gl.bindFramebuffer(gl.FRAMEBUFFER,f?f.b:null);gl.viewport(0,0,f?f.w:cv.width,f?f.h:cv.height);gl.drawArrays(gl.TRIANGLES,0,3)};
let V,Pr,Dv,Cu,D,W,Hh,TT={t:gl.createTexture()},bg=[.91,.91,.89],dark=false;
const tc=document.createElement("canvas"),tx=tc.getContext("2d");
function drawText(){const cs=getComputedStyle(hero),ink=cs.getPropertyValue("--ink").trim()||"#0b0b0b",paper=cs.getPropertyValue("--paper").trim()||"#e9e9e4";dark=document.documentElement.dataset.th=="dark";bg=[1,3,5].map(i=>parseInt(paper.substr(i,2),16)/255);
 const dpr=cv.width/W;tc.width=cv.width;tc.height=cv.height;tx.setTransform(dpr,0,0,dpr,0,0);tx.clearRect(0,0,W,Hh);
 const pad=Math.max(20,W*.034),nm=hero.querySelector(".name");tx.font="800 100px Inter";tx.letterSpacing="-7px";
 const wk=tx.measureText("Kavin ").width,wj=tx.measureText("JS").width,fs=Math.min(100*(W-2*pad)/(wk+wj+20),Hh*.52),f=fs/100,pj=.1*fs,wK=wk*f,wJ=wj*f,sx=(W-(wK+wJ+2*pj))/2,cy=Math.min(Hh*.46,nm.offsetTop+nm.offsetHeight*.52);
 tx.font="800 "+fs+"px Inter";tx.letterSpacing=(-.07*fs)+"px";tx.textBaseline="middle";tx.fillStyle=ink;tx.fillText("Kavin",sx,cy);
 tx.fillStyle=dark?"#d4ff3a":"#0b0b0b";tx.beginPath();tx.roundRect(sx+wK,cy-fs*.43,wJ+2*pj,fs*.86,fs*.1);tx.fill();tx.fillStyle=dark?"#0b0b0b":"#d4ff3a";tx.fillText("JS",sx+wK+pj,cy);
 gl.bindTexture(gl.TEXTURE_2D,TT.t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,tc);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
 [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR));[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE))}
function setup(){const dpr=Math.min(devicePixelRatio||1,1.5);W=hero.clientWidth;Hh=hero.clientHeight;cv.width=Math.round(W*dpr);cv.height=Math.round(Hh*dpr);
 const a=Math.max(W/Hh,Hh/W),rs=r=>W>Hh?[Math.round(r*a),Math.round(r)]:[Math.round(r),Math.round(r*a)],[sw,sh]=rs(128),[dw,dh]=rs(720);
 V=dbl(sw,sh);Pr=dbl(sw,sh);Dv=fbo(sw,sh,gl.NEAREST);Cu=fbo(sw,sh,gl.NEAREST);D=dbl(dw,dh);drawText()}
function splat(x,y,dx,dy,amt){const u=use("splat"),a=W/Hh;gl.uniform1f(u.asp,a);gl.uniform2f(u.pt,x,y);gl.uniform1f(u.rad,.0016*(a>1?a:1));
 tex(V.r,0,u.uT);gl.uniform3f(u.col,dx,dy,0);blit(V.w);V.sw();tex(D.r,0,u.uT);gl.uniform3f(u.col,amt,amt,amt);blit(D.w);D.sw()}
function move(x,y,ox,oy,amt){let dx=x-ox,dy=y-oy;const a=W/Hh;if(a<1)dx*=a;else dy/=a;splat(x,y,dx*6000,dy*6000,amt??Math.min(.32,.06+Math.hypot(dx,dy)*7))}
function step(dt){let u=use("curl");gl.uniform2fv(u.texelSize,V.r.tx);tex(V.r,0,u.uV);blit(Cu);
 u=use("vort");gl.uniform2fv(u.texelSize,V.r.tx);tex(V.r,0,u.uV);tex(Cu,1,u.uC);gl.uniform1f(u.curl,20);gl.uniform1f(u.dt,dt);blit(V.w);V.sw();
 u=use("div");gl.uniform2fv(u.texelSize,V.r.tx);tex(V.r,0,u.uV);blit(Dv);
 u=use("clear");tex(Pr.r,0,u.uT);gl.uniform1f(u.val,.8);blit(Pr.w);Pr.sw();
 u=use("pres");gl.uniform2fv(u.texelSize,V.r.tx);tex(Dv,0,u.uD);for(let i=0;i<20;i++){tex(Pr.r,1,u.uP);blit(Pr.w);Pr.sw()}
 u=use("grad");gl.uniform2fv(u.texelSize,V.r.tx);tex(Pr.r,0,u.uP);tex(V.r,1,u.uV);blit(V.w);V.sw();
 u=use("adv");gl.uniform2fv(u.texelSize,V.r.tx);gl.uniform1f(u.dt,dt);tex(V.r,0,u.uV);tex(V.r,1,u.uS);gl.uniform1f(u.diss,1.0);blit(V.w);V.sw();
 tex(V.r,0,u.uV);tex(D.r,1,u.uS);gl.uniform1f(u.diss,2.4);blit(D.w);D.sw()}
function show(){const u=use("show");tex(TT,0,u.uTx);tex(V.r,1,u.uVel);tex(D.r,2,u.uDye);gl.uniform2fv(u.uTexel,D.r.tx);gl.uniform3f(u.uBg,bg[0],bg[1],bg[2]);gl.uniform3f(u.uLime,.83,1,.23);blit(null)}
setup();
let px=null,py=null,vis=true,last=performance.now(),fr=0,t0=-1,ip=null,ni=performance.now()+5200,idle=null;
document.addEventListener("rdy",()=>{t0=performance.now()},{once:true});
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(hero);
addEventListener("pointermove",e=>{const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=1-(e.clientY-r.top)/r.height;if(x<0||x>1||y<0||y>1){px=null;return}if(px!==null)move(x,y,px,py);px=x;py=y;ni=performance.now()+6000},{passive:true});
addEventListener("pointerdown",e=>{const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=1-(e.clientY-r.top)/r.height;if(y<0||y>1)return;for(let i=0;i<8;i++){const a=i/8*6.283;splat(x,y,Math.cos(a)*700,Math.sin(a)*700,.3)}});
let rt;addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(setup,200)});
(function loop(now){requestAnimationFrame(loop);if(!vis||document.hidden){last=now;return}
 const dt=Math.min((now-last)/1000,.0167);last=now;
 if(fr++%20==0&&(document.documentElement.dataset.th=="dark")!==dark)drawText();
 if(t0>0){const p=(now-t0)/2600;if(p<1){const x=.07+.86*p,y=.5+.17*Math.sin(p*11)*(1-p*.35);if(ip)move(x,y,ip[0],ip[1],.28);ip=[x,y]}else ip=null}
 if(t0>0&&now>ni&&!idle){idle={s:now,x:.15+Math.random()*.7,y:.3+Math.random()*.35,a:Math.random()*6.28,p:null}}
 if(idle){const p=(now-idle.s)/900;if(p<1){const x=idle.x+Math.cos(idle.a)*.22*p,y=idle.y+Math.sin(idle.a)*.16*p;if(idle.p)move(x,y,idle.p[0],idle.p[1],.22);idle.p=[x,y]}else{idle=null;ni=now+4500}}
 step(dt);show()})(performance.now());
hero.classList.add("pc");window.__fluid=true}
})();
