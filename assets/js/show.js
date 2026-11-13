/* Scroll-driven ray-marched 3D showcase: one SDF scene that morphs between three project shapes (WebGL2, no libraries). */
(()=>{const sec=document.querySelector("#show");if(!sec)return;
const cv=sec.querySelector("canvas"),rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
const gl=cv.getContext("webgl2",{antialias:false,alpha:false,powerPreference:"high-performance"});if(!gl){sec.classList.add("nogl");return}
const VS=`#version 300 es
void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));gl_Position=vec4(p*2.-1.,0.,1.);}`;
const FS=`#version 300 es
precision highp float;out vec4 o;uniform vec2 uR,uM;uniform float uT,uP;uniform vec3 uBg,uLime;vec3 W;
float sm(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
mat2 R(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float box(vec3 p,vec3 b,float r){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
float tor(vec3 p,vec2 t){return length(vec2(length(p.xz)-t.x,p.y))-t.y;}
float frm(vec3 p,vec3 b,float e){p=abs(p)-b;vec3 q=abs(p+e)-e;return min(min(length(max(vec3(p.x,q.y,q.z),0.))+min(max(p.x,max(q.y,q.z)),0.),length(max(vec3(q.x,p.y,q.z),0.))+min(max(q.x,max(p.y,q.z)),0.)),length(max(vec3(q.x,q.y,p.z),0.))+min(max(q.x,max(q.y,p.z)),0.));}
float s0(vec3 p){float d=length(p)-.6;for(int i=0;i<5;i++){float fi=float(i),f=fi*1.2566+uT*(.5+.12*fi),rr=1.05+.1*sin(uT*.7+fi);vec3 c=vec3(cos(f)*rr,sin(f*1.7+fi)*.55,sin(f)*rr);d=sm(d,length(p-c)-.26,.4);}
vec3 q=p;q.xy*=R(.5);q.xz*=R(uT*.25);return min(d,tor(q,vec2(1.55,.045)));}
float s1(vec3 p){float d=1e5;for(int i=0;i<4;i++){float fi=float(i);vec3 c=vec3(mod(fi,2.)*1.3-.65,0.,floor(fi/2.)*1.3-.65);vec3 q=p-c;q.xz*=R(uT*.35+fi*1.1);q.xy*=R(.3*sin(uT*.5+fi));d=min(d,box(q,vec3(.4),.1));}
return min(d,frm(p,vec3(1.3,1.0,1.3),.035));}
float s2(vec3 p){vec3 q=p;q.xz*=R(uT*.3);vec3 a=q;a.xz*=R(a.y*1.1);float d1=tor(a,vec2(.95,.3));vec3 b=vec3(q.x-.95,q.z,q.y);float d2=tor(b,vec2(.95,.24));return min(d1,d2);}
float map(vec3 p){float d=0.;if(W.x>.002)d+=W.x*s0(p);if(W.y>.002)d+=W.y*s1(p*1.45)/1.45;if(W.z>.002)d+=W.z*s2(p*1.3)/1.3;return d;}
vec3 nor(vec3 p){vec2 e=vec2(.0015,-.0015);return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));}
vec3 env(vec3 r){float y=r.y*.5+.5;vec3 c=mix(vec3(.025,.03,.035),vec3(.9,.92,.95),smoothstep(.1,.95,y));
c+=pow(max(dot(r,normalize(vec3(-.4,.8,.5))),0.),28.)*1.5;c+=uLime*pow(max(dot(r,normalize(vec3(.9,-.1,-.35))),0.),7.)*1.3;c+=vec3(.35,.5,1.)*pow(max(dot(r,normalize(vec3(-.85,-.2,.2))),0.),9.)*.4;return c;}
vec3 shade(vec3 p,vec3 n,vec3 rd){vec3 r=reflect(rd,n);float fr=pow(1.-max(dot(n,-rd),0.),3.);vec3 c=env(r)*(.78+.5*fr);float ao=0.;for(int i=1;i<4;i++){float h=.12*float(i);ao+=(h-map(p+n*h))/pow(2.,float(i));}
c*=1.-clamp(ao*1.5,0.,.8);return c+uLime*fr*.45;}
vec3 bg(vec2 uv){vec3 b=uBg*(1.-.5*length(uv*vec2(.8,1.)));b+=uLime*.05*exp(-dot(uv,uv)*3.);b*=1.-.55*exp(-(uv.x*uv.x*2.5+(uv.y+.46)*(uv.y+.46)*38.));return b;}
void main(){vec2 uv0=(gl_FragCoord.xy-.5*uR)/uR.y;vec2 uv=uv0-(uR.x>uR.y?vec2(.17,0.):vec2(0.,.17));W=vec3(clamp(1.-abs(uP),0.,1.),clamp(1.-abs(uP-1.),0.,1.),clamp(1.-abs(uP-2.),0.,1.));
float yaw=uM.x*.7+uT*.12,pit=uM.y*.35;vec3 ro=vec3(0.,0.,5.3);ro.yz*=R(pit);ro.xz*=R(yaw);vec3 f=normalize(-ro),r=normalize(cross(vec3(0.,1.,0.),f)),u=cross(f,r);float fl=1.7*clamp(uR.x/uR.y/.95,.42,1.);vec3 rd=normalize(f*fl+uv.x*r+uv.y*u);
float t=0.,dm=1e5,tm=0.;bool hit=false;for(int i=0;i<80;i++){float d=map(ro+rd*t);if(d<dm){dm=d;tm=t;}if(d<.0015){hit=true;break;}t+=d*.82;if(t>10.)break;}
vec3 col=bg(uv0);float px=tm/(fl*uR.y)*1.6;
if(hit||dm<px){float tt=hit?t:tm;vec3 p=ro+rd*tt,n=nor(p);float cov=hit?1.:1.-smoothstep(0.,px,dm);col=mix(col,shade(p,n,rd),cov);}
col=pow(col,vec3(.96));col+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)*.012;o=vec4(col,1.);}`;
const sh=(p,t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(x);gl.attachShader(p,x)};
const pr=gl.createProgram();try{sh(pr,gl.VERTEX_SHADER,VS);sh(pr,gl.FRAGMENT_SHADER,FS);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw gl.getProgramInfoLog(pr)}catch(e){console.warn("show shader",e);sec.classList.add("nogl");return}
gl.useProgram(pr);const U={};["uR","uM","uT","uP","uBg","uLime"].forEach(n=>U[n]=gl.getUniformLocation(pr,n));gl.uniform3f(U.uBg,.043,.043,.043);gl.uniform3f(U.uLime,.83,1,.23);
const caps=[...sec.querySelectorAll(".cap")],dots=[...sec.querySelectorAll(".sd i")],shn=sec.querySelector("#shn");let vis=false,p=0,mx=0,my=0,tx=0,ty=0,act=-1;
const QP=+new URLSearchParams(location.search).get("sc"),MAXQ=QP||(innerWidth<700?.6:.75);let Q=MAXQ,ema=16,lt=0;function size(){const s=Math.min(devicePixelRatio||1,1.5)*Q;cv.width=Math.max(8,Math.round(cv.clientWidth*s));cv.height=Math.max(8,Math.round(cv.clientHeight*s))}size();addEventListener("resize",size);
new IntersectionObserver(e=>vis=e[0].isIntersecting,{rootMargin:"100px"}).observe(sec);
addEventListener("pointermove",e=>{tx=e.clientX/innerWidth*2-1;ty=1-e.clientY/innerHeight*2},{passive:true});
(function loop(now){requestAnimationFrame(loop);if(!vis){lt=0;return}if(lt){const d=now-lt;ema+=(Math.min(d,200)-ema)*.08;if(!QP){if(ema>36&&Q>.32){Q=Math.max(.32,Q*.88);ema=24;size()}else if(ema<19&&Q<MAXQ){Q=Math.min(MAXQ,Q*1.06);size()}}}lt=now;const r=sec.getBoundingClientRect(),tot=Math.max(1,sec.offsetHeight-innerHeight),tt=Math.max(0,Math.min(1,-r.top/tot)),pt=tt*2;
 p+=(pt-p)*(rm?1:.075);mx+=(tx-mx)*.06;my+=(ty-my)*.06;const a=Math.round(p);if(a!==act){act=a;caps.forEach((c,i)=>c.classList.toggle("on",i==a));dots.forEach((d,i)=>d.classList.toggle("on",i==a));shn.textContent="0"+(a+1)}
 sec.style.setProperty("--sp",tt);gl.viewport(0,0,cv.width,cv.height);gl.uniform2f(U.uR,cv.width,cv.height);gl.uniform2f(U.uM,mx,my);gl.uniform1f(U.uT,rm?0:now/1000);gl.uniform1f(U.uP,p);gl.drawArrays(gl.TRIANGLES,0,3)})(0);
})();
