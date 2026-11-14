/* TransportSense lab: a typed parse -> validate -> compute -> aggregate pipeline (Either-style errors), with live emissions. */
(()=>{const $=s=>document.querySelector(s);
const F={car:.17,bus:.105,rail:.041,flight:.246,bike:0,walk:0},COL={car:"#ff7a59",bus:"#7fb2e5",rail:"#d4ff3a",flight:"#c7a6ff",bike:"#9ad9a0",walk:"#9ad9a0"};
let raw=[["car","12","1"],["car","15","1"],["car","9","1"],["bus","8","1"],["rail","40","1"],["bike","3","1"]];
function parse(r){const[m,k,p]=r;if(!(m in F))return{L:`UnknownMode "${m}"`};const km=Number(k);if(k===""||Number.isNaN(km))return{L:`NotANumber "${k}"`};if(km<0)return{L:`NegativeDistance ${km}`};const pax=Number(p);if(!Number.isInteger(pax)||pax<1)return{L:`InvalidPassengers ${p}`};return{R:{mode:m,km,pax}}}
const kg=t=>t.km*F[t.mode]/(t.mode=="car"?t.pax:1);
function render(){const P=raw.map(parse),ok=P.filter(x=>x.R).map(x=>x.R),by={};ok.forEach(t=>by[t.mode]=(by[t.mode]||0)+kg(t));const tot=Object.values(by).reduce((a,b)=>a+b,0),swap=$("#sw").checked;
 const tot2=ok.reduce((s,t)=>s+(t.mode=="car"?t.km*F.rail:kg(t)),0);
 $("#tt").innerHTML=raw.map((r,i)=>`<div class="hit${P[i].L?" leak":""}"><h4>${r[0]||"?"} · ${r[1]} km · ${r[2]} pax</h4><span class="m">${P[i].L?"Left "+P[i].L:"Right ✓ "+kg(P[i].R).toFixed(2)+" kg"}</span></div>`).join("");
 const mx=Math.max(.001,...Object.values(by));$("#bars").innerHTML=Object.keys(F).map(m=>`<div><span>${m}</span><s style="width:${(by[m]||0)/mx*100}%;background:${COL[m]}"></s><span>${(by[m]||0).toFixed(1)} kg</span></div>`).join("");
 $("#tot").textContent=tot.toFixed(1);$("#ntr").textContent=ok.length+" / "+raw.length;$("#sav").textContent=swap?(tot?Math.round((1-tot2/tot)*100):0)+"%":"–";
 $("#hs2").innerHTML=`report :: <b style="color:#d4ff3a">Report</b>\nreport = Report\n  { valid  = ${ok.length}\n  , errors = ${raw.length-ok.length}\n  , total  = ${tot.toFixed(2)} <span style="color:#9a9d95">-- kg CO2e</span>\n  , byMode = ${JSON.stringify(Object.fromEntries(Object.entries(by).map(([k,v])=>[k,+v.toFixed(2)])))} }`}
$("#add").addEventListener("click",()=>{raw.push([$("#md").value,$("#km").value,$("#px").value]);render()});
$("#bad").addEventListener("click",()=>{raw.push(["teleport","5","1"],["car","-3","1"],["rail","abc","1"],["car","10","0"]);render()});
$("#clr").addEventListener("click",()=>{raw=[];render()});$("#sw").addEventListener("input",render);render();window.__ts={parse,kg};
})();
