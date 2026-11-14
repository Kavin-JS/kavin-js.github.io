/* AIKA lab: tenant isolation simulator + real PBKDF2 cost demo (WebCrypto). */
(()=>{const $=s=>document.querySelector(s);
const DOCS=[["acme","Pricing strategy","Q3 pricing strategy: raise the enterprise tier by eight percent and sunset the legacy plan."],["acme","Onboarding checklist","Customer onboarding checklist for new Acme accounts, including SSO setup and data import."],["acme","Incident postmortem","Incident postmortem for the database failover on March fourth, with remediation owners."],["acme","Hiring plan","Hiring plan for next quarter: two backend engineers and one product designer."],["globex","Acquisition memo","Confidential memo listing potential acquisition targets for the Globex merger."],["globex","Salary bands","Salary bands and compensation review for 2026, restricted to the leadership team."],["globex","Voice roadmap","Product roadmap for the voice assistant launch planned for the fourth quarter."],["globex","Security audit","Security audit findings and remediation owners for the platform team."]];
const tri=s=>{s=" "+s.toLowerCase().replace(/[^a-z0-9 ]/g," ")+" ";const m={};for(let i=0;i<s.length-2;i++){const g=s.slice(i,i+3);m[g]=(m[g]||0)+1}return m};
const cos=(a,b)=>{let d=0,x=0,y=0;for(const k in a){x+=a[k]*a[k];if(b[k])d+=a[k]*b[k]}for(const k in b)y+=b[k]*b[k];return d/(Math.sqrt(x*y)||1)};
const W=s=>new Set((s.toLowerCase().match(/[a-z]{3,}/g)||[]));
DOCS.forEach(d=>{d.v=tri(d[1]+" "+d[2]);d.w=W(d[1]+" "+d[2])});
let tenant="acme",filt=true;const q2=$("#q2"),T={acme:"Acme",globex:"Globex"};
function search(){const q=q2.value||q2.placeholder,qv=tri(q),qw=[...W(q)];
 const pool=filt?DOCS.filter(d=>d[0]==tenant):DOCS,sc=pool.map(d=>({d,s:cos(qv,d.v)*.6+qw.filter(w=>d.w.has(w)).length/Math.max(qw.length,1)*.4})).sort((a,b)=>b.s-a.s).slice(0,4);
 const leaks=sc.filter(x=>x.d[0]!=tenant).length;
 $("#sql").innerHTML=`<b>SELECT</b> id, title, body, 1 - (embedding &lt;=&gt; $1) <b>AS</b> score\n<b>FROM</b> documents\n${filt?`<b>WHERE</b> tenant_id = '${tenant}'`:`<u>-- tenant filter removed (simulated bug)</u>`}\n<b>ORDER BY</b> embedding &lt;=&gt; $1\n<b>LIMIT</b> 4;`;
 $("#trace").innerHTML=`<span class="m">auth</span> token ✓ → <span class="m">resolve</span> tenant_id = <b style="color:var(--lime)">${tenant}</b> → <span class="m">repository.search</span>(tenant_id, query) → <span class="m">pgvector</span>`;
 $("#r2").innerHTML=sc.map(x=>{const lk=x.d[0]!=tenant;return`<div class="hit${lk?" leak":""}"><h4>${x.d[1]}</h4><span class="m">${lk?"LEAK · "+T[x.d[0]]+" · ":""}${Math.round(Math.min(1,x.s)*100)}%</span><p>${x.d[2]}</p></div>`}).join("");
 $("#al2").className="alert "+(leaks?"bad":"ok");$("#al2").textContent=leaks?`⚠ Cross-tenant leak: ${leaks} row${leaks>1?"s":""} from another tenant returned to ${T[tenant]}. This is why isolation must be enforced in the data layer, not in the UI.`:`✓ Isolated: only ${T[tenant]} rows are ever visible to this query.`}
document.querySelectorAll("#tn button").forEach(b=>b.addEventListener("click",()=>{tenant=b.dataset.t;document.querySelectorAll("#tn button").forEach(x=>x.setAttribute("aria-pressed",x===b));search()}));
document.querySelectorAll("#fl button").forEach(b=>b.addEventListener("click",()=>{filt=b.dataset.f=="1";document.querySelectorAll("#fl button").forEach(x=>x.setAttribute("aria-pressed",x===b));search()}));
q2.addEventListener("input",search);document.querySelectorAll("#qs2 button").forEach(b=>b.addEventListener("click",()=>{q2.value=b.textContent;search()}));search();
/* ---- real password hashing cost (PBKDF2-SHA256 via WebCrypto) ---- */
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join(""),hist={};let salt=crypto.getRandomValues(new Uint8Array(16)),tm;
async function hash(){const pw=$("#pw").value||"correct horse battery staple",it=+$("#it").value,k=await crypto.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveBits"]),t0=performance.now(),bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt,iterations:it},k,256),ms=performance.now()-t0;
 hist[it]=ms;$("#salt").textContent=hex(salt);$("#hash").textContent=hex(bits);$("#ms").textContent=ms.toFixed(1)+" ms";const mx=Math.max(...Object.values(hist));
 $("#hist").innerHTML=Object.keys(hist).map(Number).sort((a,b)=>a-b).map(i=>`<div><span>${i.toLocaleString()}×</span><s style="width:${Math.max(2,hist[i]/mx*100)}%"></s><span>${hist[i].toFixed(0)} ms</span></div>`).join("")}
const go=()=>{clearTimeout(tm);tm=setTimeout(hash,140)};$("#pw").addEventListener("input",go);$("#it").addEventListener("change",hash);$("#rs").addEventListener("click",()=>{salt=crypto.getRandomValues(new Uint8Array(16));hash()});hash();
})();
