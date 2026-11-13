/* WebGL halftone portrait: ink dots by default; the cursor melts them into full colour with a rippling lens. */
(()=>{const box=document.querySelector(".ph2");if(!box)return;const img=box.querySelector("img"),cv=box.querySelector("canvas");
const RM=matchMedia("(prefers-reduced-motion:reduce)").matches,touch=matchMedia("(hover:none)").matches;
const gl=cv.getContext("webgl2",{alpha:false,antialias:false});if(!gl)return;
const VS=`#version 300 es
out vec2 vUv;void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));vUv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
const FS=`#version 300 es
precision highp float;in vec2 vUv;out vec4 o;uniform sampler2D uI;uniform vec2 uM,uR;uniform float uK,uT,uA,uFull;uniform vec3 uBg,uInk;
void main(){vec2 uv=vUv;vec2 p=(uv-uM)*vec2(uA,1.);float d=length(p);
float rip=sin(d*46.-uT*5.)*exp(-d*6.)*uK*.011;vec2 uvd=uv+normalize(p+1e-5)*rip;vec3 c=texture(uI,uvd).rgb;
vec3 cr=vec3(texture(uI,uvd+normalize(p+1e-5)*.004*uK).r,c.g,texture(uI,uvd-normalize(p+1e-5)*.004*uK).b);
float l=dot(c,vec3(.299,.587,.114));float cell=uR.x/88.;vec2 g=uv*uR/cell;vec2 f=fract(g+vec2(.0,.5*mod(floor(g.x),2.)))-.5;
float rad=sqrt(clamp(1.-l*1.08,0.,1.))*.66;float dt=smoothstep(rad,rad-.14,length(f));vec3 ht=mix(uBg,uInk,dt);
float rev=max(smoothstep(.27,.1,d)*uK,uFull);vec3 col=mix(ht,cr,rev);col+=smoothstep(.27,.2,d)*smoothstep(.1,.2,d)*uK*.06;o=vec4(col,1.);}`;
const sh=(p,t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(x);gl.attachShader(p,x)};
let pr;try{pr=gl.createProgram();sh(pr,gl.VERTEX_SHADER,VS);sh(pr,gl.FRAGMENT_SHADER,FS);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw 0}catch(e){return}
const U={};["uI","uM","uR","uK","uT","uA","uFull","uBg","uInk"].forEach(n=>U[n]=gl.getUniformLocation(pr,n));
const tex=gl.createTexture();let ready=false;
function load(){gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);[gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR));[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE));ready=true;box.classList.add("gl")}
img.complete&&img.naturalWidth?load():img.addEventListener("load",load,{once:true});
let mx=.5,my=.5,tx=.5,ty=.5,k=0,kt=0,vis=false,bg=[.9,.9,.89],ink=[.04,.04,.04],fr=0;
function col(){const cs=getComputedStyle(document.documentElement),p=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16)/255);bg=p(cs.getPropertyValue("--paper").trim()||"#e9e9e4");ink=p(cs.getPropertyValue("--ink").trim()||"#0b0b0b")}
function size(){const d=Math.min(devicePixelRatio||1,2);cv.width=Math.round(box.clientWidth*d);cv.height=Math.round(box.clientHeight*d)}
size();addEventListener("resize",size);new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(box);
box.addEventListener("pointermove",e=>{const r=box.getBoundingClientRect();tx=(e.clientX-r.left)/r.width;ty=1-(e.clientY-r.top)/r.height;kt=1});
box.addEventListener("pointerleave",()=>{kt=touch?1:0});
(function loop(now){requestAnimationFrame(loop);if(!vis||!ready)return;const t=now/1000;
 if(fr++%30==0)col();if(touch&&!RM){tx=.5+.28*Math.sin(t*.7);ty=.5+.22*Math.cos(t*.5);kt=1}
 mx+=(tx-mx)*.12;my+=(ty-my)*.12;k+=(kt-k)*.07;
 gl.viewport(0,0,cv.width,cv.height);gl.useProgram(pr);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(U.uI,0);
 gl.uniform2f(U.uM,mx,my);gl.uniform2f(U.uR,cv.width,cv.height);gl.uniform1f(U.uK,k);gl.uniform1f(U.uT,t);gl.uniform1f(U.uA,cv.width/cv.height);gl.uniform1f(U.uFull,RM?1:0);gl.uniform3fv(U.uBg,bg);gl.uniform3fv(U.uInk,ink);gl.drawArrays(gl.TRIANGLES,0,3)})(0);
})();
