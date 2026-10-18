(() => {
"use strict";
const $ = s => document.querySelector(s);
const KEY = "fundzy_v2_tracker";
let tracker = read(KEY, []);
let activeProgram = null;
let toastTimer = null;
function read(k, fallback) { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(tracker)); } catch { toast("Browser storage is unavailable or full."); } }
function esc(s="") { return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function validUrl(s) { try { return ["https:","http:"].includes(new URL(s).protocol); } catch { return false; } }
function toast(s) { const t=$("#toast"); t.textContent=s; t.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),3000); }
function dateDays(s) { if(!s)return null; const a=new Date();a.setHours(0,0,0,0);const b=new Date(s+"T00:00:00");return isNaN(b)?null:Math.round((b-a)/86400000); }
function dateText(s) { return s ? new Date(s+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "Check official portal for date"; }
function allPrograms() { return window.FUNDMENT_PROGRAMS || []; }
function matches() {
 const q=$("#searchInput").value.trim().toLowerCase(), level=$("#levelFilter").value, state=$("#stateFilter").value, cat=$("#categoryFilter").value, win=$("#windowFilter").value;
 return allPrograms().filter(p => (!q || [p.name,p.department,p.description,p.kind,...p.eligibility].join(" ").toLowerCase().includes(q))
 && (!level || p.levels.includes(level)) && (!state || p.states.includes(state) || p.states.includes("National / All India") || (["Assam","Arunachal Pradesh","Manipur","Meghalaya","Mizoram","Nagaland","Sikkim","Tripura"].includes(state) && p.states.includes("North Eastern Region")))
 && (!cat || p.kind===cat) && (!win || p.window===win));
}
function renderPrograms() {
 const list=matches(); $("#resultCount").textContent=`${list.length} programme guide${list.length===1?"":"s"}`;
 $("#programGrid").innerHTML=list.length ? list.map(p=>{
  const tracked=tracker.some(a=>a.programId===p.id);
  const d=dateDays(p.deadline);
  const status=p.window==="open" ? `<span class="pill green">Listing shows deadline ${esc(dateText(p.deadline))}</span>` : `<span class="pill amber">Check live notice</span>`;
  return `<article class="program-card"><div class="card-head"><span class="program-icon" aria-hidden="true">🎓</span><span class="kind">${esc(p.kind)}</span></div><p class="department">${esc(p.department)}</p><h3>${esc(p.name)}</h3><p class="description">${esc(p.description)}</p><div class="pills">${p.levels.map(x=>`<span>${esc(x)}</span>`).join("")}</div><div class="window">${status}${p.deadline && d!==null && d>=0 && d<=14 ? `<b class="urgent"> · ${d===0?"Deadline today":d+" days left"}</b>`:""}</div><div class="card-actions"><button class="btn primary details" data-id="${esc(p.id)}">View requirements ↗</button><button class="btn light track" data-id="${esc(p.id)}" ${tracked?"disabled":""}>${tracked?"✓ Tracked":"+ Track"}</button></div><div class="source-caption">Source snapshot: ${esc(p.sourceDate || "Verify current notice")}</div></article>`;
 }).join("") : `<div class="empty"><h3>No programmes match</h3><p>Try a different keyword or reset filters.</p></div>`;
 document.querySelectorAll(".details").forEach(b=>b.addEventListener("click",()=>openDetails(b.dataset.id)));
 document.querySelectorAll(".track").forEach(b=>b.addEventListener("click",()=>addProgram(b.dataset.id)));
}
function openDetails(id) {
 const p=allPrograms().find(x=>x.id===id); if(!p)return; activeProgram=p;
 $("#detailName").textContent=p.name; $("#detailProvider").textContent=p.department;
 const docs=p.docs || window.COMMON_DOCS || [];
 const deadline=p.deadline ? `${dateText(p.deadline)} (dated official listing snapshot)` : "Not listed here — check the official portal";
 $("#detailBody").innerHTML=`<div class="detail-alert"><b>Before you rely on this guide</b><p>${esc(p.note || "Read the current official guidelines.")} Checklist items below are preparation prompts, not a definitive document list.</p></div>
 <div class="detail-grid"><section><h3>Programme overview</h3><p>${esc(p.description)}</p><div class="detail-row"><b>Category</b><span>${esc(p.kind)}</span></div><div class="detail-row"><b>Study levels</b><span>${p.levels.map(esc).join(", ")}</span></div><div class="detail-row"><b>Coverage</b><span>${p.states.map(esc).join(", ")}</span></div><div class="detail-row"><b>Deadline snapshot</b><span>${esc(deadline)}</span></div><div class="detail-row"><b>Source checked</b><span>${esc(p.sourceDate || "Not confirmed")}</span></div></section>
 <section><h3>Eligibility pointers</h3><ul>${p.eligibility.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><h3 class="docs-title">Documents to prepare</h3><p class="muted small">This scheme-specific checklist is a preparation guide. Tick each item once you have checked it.</p><ul class="detail-docs">${docs.map((x,i)=>`<li><label><input type="checkbox" data-detail-doc="${i}"> ${esc(x)}</label></li>`).join("")}</ul></section></div>
 <section class="copy-prep"><h3>Photocopies and scanned copies: what to keep ready</h3><p>Depending on the scheme, you may need copies or scans of:</p><ul><li>Previous marksheets and certificates</li><li>Current admission proof, bonafide certificate and fee receipt</li><li>Income and domicile certificates, if required</li><li>Caste/category, disability or other special-status certificate, if applicable</li><li>Photo and signature in the portal's required format</li><li>Identity/OTR proof and bank/DBT proof only when the official portal requests them</li></ul><div class="copy-tip"><b>Practical tip:</b> Keep originals safe for verification and prepare 1–2 photocopies of each applicable document. Save scans as clear PDFs/JPGs and follow the portal's exact file-size and format rules. Do not submit every document automatically—follow the current scheme notice.</div></section>
 <div class="source-box"><b>Official source: ${esc(p.source || "Official portal")}</b><p>Last checked: ${esc(p.sourceDate || "Not recorded")}. Re-open the official source to verify current requirements, application window and notices.</p><a href="${esc(validUrl(p.sourceUrl)?p.sourceUrl:p.url)}" target="_blank" rel="noopener noreferrer">Open official scheme details ↗</a></div>`;
 $("#detailTrack").textContent=tracker.some(a=>a.programId===id)?"✓ Already in tracker":"＋ Add to tracker";
 $("#detailTrack").disabled=tracker.some(a=>a.programId===id);
 $("#detailOfficial").href=p.url;
 $("#detailOfficial").textContent="Official application / source ↗";
 $("#detailDialog").showModal();
}
function defaultDocs(p) { return (p.docs || window.COMMON_DOCS || []).map((label,i)=>({id:"d"+i,label,done:false})); }
function addProgram(id) {
 const p=allPrograms().find(x=>x.id===id); if(!p)return;
 if(tracker.some(a=>a.programId===id)){toast("Already in your tracker.");return;}
 tracker.unshift({id:crypto.randomUUID?.()||String(Date.now()),programId:p.id,name:p.name,url:p.url,level:p.levels[0],deadline:p.deadline||"",status:"Interested",notes:"",docs:defaultDocs(p)});
 save();renderPrograms();renderTracker();$("#detailTrack").disabled=true;$("#detailTrack").textContent="✓ Already in tracker";toast("Added. Verify requirements and dates on the official portal.");
}
function renderTracker() {
 $("#trackedCount").textContent=tracker.length;
 $("#readyCount").textContent=tracker.filter(a=>["Ready to apply","Submitted","Approved"].includes(a.status)).length;
 $("#deadlineCount").textContent=tracker.filter(a=>{const d=dateDays(a.deadline);return d!==null&&d>=0&&d<=30&&!["Approved","Not selected","Closed / withdrawn"].includes(a.status)}).length;
 $("#emptyTracker").hidden=tracker.length>0;
 $("#trackerList").innerHTML=tracker.map(a=>{
  a.docs=Array.isArray(a.docs)?a.docs:[];
  const done=a.docs.filter(d=>d.done).length,pct=a.docs.length?Math.round(done/a.docs.length*100):0,d=dateDays(a.deadline);
  let due=a.deadline?dateText(a.deadline):"No verified deadline saved";
  if(d!==null&&d<0)due="Past deadline · "+dateText(a.deadline); else if(d!==null&&d<=7)due=d===0?"Deadline today":`Deadline in ${d} day(s)`;
  return `<article class="tracked-card" data-id="${esc(a.id)}"><div class="tracked-head"><div class="tracked-icon" aria-hidden="true">🎓</div><div class="tracked-info"><div class="tracked-title"><h3>${esc(a.name)}</h3><span class="status">${esc(a.status)}</span></div><p>${esc(a.level||"Study level not set")} · ${esc(due)}</p><div class="progress"><span style="width:${pct}%"></span></div><small>${done} / ${a.docs.length} preparation items · ${pct}%</small></div><button class="icon edit" title="Edit">✎</button><button class="icon delete" title="Delete">×</button></div><div class="check-heading"><b>Documents & preparation checklist</b><span>Confirm each item in official guidelines</span></div><div class="check-grid">${a.docs.map(doc=>`<label class="${doc.done?"checked":""}"><input type="checkbox" data-doc="${esc(doc.id)}" ${doc.done?"checked":""}><span>${esc(doc.label)}</span></label>`).join("")}</div><div class="tracked-bottom"><label>Status<select class="status-select">${["Interested","Preparing documents","Ready to apply","Submitted","Under review","Approved","Not selected","Closed / withdrawn"].map(s=>`<option ${a.status===s?"selected":""}>${s}</option>`).join("")}</select></label><div class="tracked-links">${validUrl(a.url)?`<a href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">Official portal ↗</a>`:""}<button class="text edit">Edit details</button></div></div>${a.notes?`<p class="notes"><b>Note:</b> ${esc(a.notes)}</p>`:""}</article>`;
 }).join("");
 document.querySelectorAll(".tracked-card").forEach(card=>{
  const a=tracker.find(x=>x.id===card.dataset.id);
  card.querySelectorAll("[data-doc]").forEach(input=>input.addEventListener("change",()=>{const d=a.docs.find(x=>x.id===input.dataset.doc);if(d)d.done=input.checked;save();renderTracker()}));
  card.querySelector(".status-select").addEventListener("change",e=>{a.status=e.target.value;save();renderTracker();toast("Status updated.")});
  card.querySelectorAll(".edit").forEach(b=>b.addEventListener("click",()=>openAppDialog(a)));
  card.querySelector(".delete").addEventListener("click",()=>{if(confirm(`Remove "${a.name}" from your tracker?`)){tracker=tracker.filter(x=>x.id!==a.id);save();renderTracker();renderPrograms();toast("Removed from tracker.")}});
 });
}
const appDialog=$("#appDialog");
function openAppDialog(a=null) {
 $("#appForm").reset();$("#appId").value=a?.id||"";$("#appDialogTitle").textContent=a?"Edit application":"Add custom application";
 $("#appName").value=a?.name||"";$("#appUrl").value=a?.url||"";$("#appLevel").value=a?.level||"Undergraduate";$("#appDeadline").value=a?.deadline||"";$("#appStatus").value=a?.status||"Interested";$("#appNotes").value=a?.notes||"";appDialog.showModal();
}
$("#appForm").addEventListener("submit",e=>{e.preventDefault();const id=$("#appId").value,name=$("#appName").value.trim(),url=$("#appUrl").value.trim();if(url&&!validUrl(url)){toast("Enter a valid http(s) URL.");return;}const fields={name,url,level:$("#appLevel").value,deadline:$("#appDeadline").value,status:$("#appStatus").value,notes:$("#appNotes").value.trim()};if(id){const a=tracker.find(x=>x.id===id);if(a)Object.assign(a,fields)}else tracker.unshift({id:crypto.randomUUID?.()||String(Date.now()),...fields,programId:null,docs:(window.COMMON_DOCS||[]).map((label,i)=>({id:"d"+i,label,done:false}))});save();appDialog.close();renderTracker();renderPrograms();toast("Saved. Add only a deadline verified on the official source.");});
$("#addManual").onclick=()=>openAppDialog();$("#firstAdd").onclick=()=>openAppDialog();$("#closeApp").onclick=()=>appDialog.close();$("#cancelApp").onclick=()=>appDialog.close();
$("#closeDetail").onclick=()=>$("#detailDialog").close();
$("#detailTrack").onclick=()=>{if(activeProgram)addProgram(activeProgram.id)};
$("#searchInput").addEventListener("input",renderPrograms);["levelFilter","stateFilter","categoryFilter","windowFilter"].forEach(id=>$("#"+id).addEventListener("change",renderPrograms));
$("#resetBtn").onclick=()=>{$("#searchInput").value="";["levelFilter","stateFilter","categoryFilter","windowFilter"].forEach(id=>$("#"+id).value="");renderPrograms();};
// Mobile navigation: accessible toggle, closes after navigation or outside click.
const menuBtn = $("#menuBtn"), mainNav = $("#mainNav");
function closeMenu(){ mainNav.classList.remove("open"); menuBtn.setAttribute("aria-expanded","false"); menuBtn.setAttribute("aria-label","Open navigation"); menuBtn.textContent="☰"; }
menuBtn.addEventListener("click",()=>{
 const open = mainNav.classList.toggle("open");
 menuBtn.setAttribute("aria-expanded",String(open));
 menuBtn.setAttribute("aria-label",open?"Close navigation":"Open navigation");
 menuBtn.textContent=open?"×":"☰";
});
mainNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
document.addEventListener("click",e=>{ if(!mainNav.contains(e.target)&&!menuBtn.contains(e.target)) closeMenu(); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeMenu(); });

// Light/dark theme; remember the choice in this browser.
const themeToggle=$("#themeToggle");
function applyTheme(theme){
 document.documentElement.dataset.theme=theme;
 const dark=theme==="dark";
 themeToggle.querySelector(".theme-icon").textContent=dark?"☀":"☾";
 themeToggle.querySelector(".theme-label").textContent=dark?"Light":"Dark";
 themeToggle.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");
 const meta=document.querySelector('meta[name="theme-color"]'); if(meta) meta.content=dark?"#201d2b":"#f7f5ef";
}
let savedTheme="light"; try{savedTheme=localStorage.getItem("fundzy_theme")||"light";}catch{}
applyTheme(savedTheme);
themeToggle.addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";applyTheme(next);try{localStorage.setItem("fundzy_theme",next);}catch{}});

renderPrograms();renderTracker();
})();
