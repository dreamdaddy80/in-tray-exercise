/* ===== 업무 PC 화면 층 (2026-11-25) =====
   게임 규칙·점수·결과 코드는 건드리지 않는다. 그려진 화면을 "업무 PC" 모양으로 감싸기만 한다.
   - html[data-ui="desk"]일 때만 동작. 첫 화면의 "화면 방식"에서 기존 화면(classic)으로 돌릴 수 있다.
   - 장면 → 앱 매핑(확정 2026-11-25): 업무 메시지=메일·메신저, 리더 회의=화상 회의, 배분·평가=인사시스템,
     성적표=팀 대시보드, 장애=에러 창, 보안 사고=보안 경고, 조직·외부 변화=속보, 구성원 불만=익명 라운지 */
(function(){
 const KEY="ftm_ui";
 let ui="desk";try{ui=localStorage.getItem(KEY)||"desk";}catch(e){}
 if(ui!=="classic")ui="desk";
 const root=document.documentElement;root.dataset.ui=ui;
 {const l=document.createElement("link");l.rel="stylesheet";l.href="desk.css";document.head.appendChild(l);}
 window.UI_MODES=[["desk","업무 PC"],["classic","기본 화면"]];
 window.setUI=function(k){ui=k==="classic"?"classic":"desk";try{localStorage.setItem(KEY,ui);}catch(e){}root.dataset.ui=ui;
  document.querySelectorAll(".lp-ui button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.k===ui?"true":"false"));
  try{render();}catch(e){}};
 const on=()=>root.dataset.ui==="desk";

 /* ---------- 장면 → 앱 ---------- */
 const APPS={onboard:"신임 리더 온보딩",call:"전화",mail:"메일",chat:"메신저",meet:"화상 회의",hr:"인사시스템",dash:"팀 대시보드",err:"생산 모니터링 시스템",sec:"보안 센터",news:"사내 속보",lounge:"익명 라운지",note:"업무 노트"};
 const BY_ID={"1-3":"note","1-5":"meet","1-4":"chat","3-1":"hr","R1-pick":"chat","3-4":"meet","3-5":"meet","3-6":"meet","3-8":"sec","3-9":"dash","9-7":"dash",
  "4-2":"hr","4-3":"meet","4-4":"lounge","4-5":"meet","5-4":"meet","6-1":"meet","6-1p":"hr","6-2":"mail","6-3":"chat","6-4a":"news",
  "8-1a":"news","8-1b":"meet","8-1c":"hr","R3-0":"hr","R3-1a":"err","R3-1b":"err","9-4":"call","11-4":"chat",
  "12-3a":"hr","12-3":"hr","12-4":"hr","12-6":"mail","S2":"lounge"};
 window.appOf=function(s){
  if(!s)return "note";const id=String(s.id||"");
  if(s.type==="inbox"||s.mail)return "mail";
  if(/^(ROUND|V3END|FINALE)/.test(id))return "dash";
  if(/^P\d/.test(id))return "onboard";
  if(BY_ID[id])return BY_ID[id];
  if(/^12-/.test(id))return "hr";
  if(/^R2-|^R3-/.test(id))return "hr";
  if(s.type==="write")return "mail";
  if(s.type==="kpi"||s.type==="alloc"||s.type==="realloc"||s.type==="evalc")return "hr";
  return "note";
 };
 window.APP_NAMES=APPS;

 /* ---------- 창 제목 줄 ---------- */
 function ensureFrame(){
  const sh=document.getElementById("shell");if(!sh)return null;
  const win=sh.parentElement;if(win&&!win.id)win.id="dkwin";
  let t=document.getElementById("dktitle");
  if(!t){t=document.createElement("div");t.id="dktitle";t.innerHTML='<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><b class="app"></b><span class="sub"></span><button type="button" class="team" aria-expanded="false" aria-controls="people">리더 신뢰·업무량</button>';win.insertBefore(t,sh);
   t.querySelector(".team").addEventListener("click",()=>toggleTeam());}
  return t;
 }
 let teamOpener=null;
 function toggleTeam(force){const p=document.getElementById("people");if(!p)return;const was=p.classList.contains("dk-open");const o=force==null?!was:!!force;if(o===was&&force!=null)return;
  p.classList.toggle("dk-open",o);
  const b=document.querySelector("#dktitle .team");if(b)b.setAttribute("aria-expanded",o?"true":"false");
  document.querySelectorAll('#dkdock button[data-k="team"]').forEach(x=>x.classList.toggle("open",o));
  if(o){const nb=document.getElementById("dknote");if(nb)nb.hidden=true;teamOpener=document.activeElement;teamHead();setTimeout(()=>{const c=p.querySelector(".dk-pclose");if(c)c.focus();},30);}
  else if(was){try{if(teamOpener&&document.contains(teamOpener))teamOpener.focus();}catch(e){}teamOpener=null;}}
 window.toggleTeam=toggleTeam;
 /* 운영자 검토 막대(#rv)가 있으면 표시해 두고, 독 위로 올리고 창 높이를 줄인다(CSS) */
 {const mark=()=>{root.dataset.rv=document.getElementById("rv")?"1":"";};new MutationObserver(mark).observe(document.body,{childList:true});mark();}
 /* 펼침 메뉴(메뉴·운영자 메뉴): 바깥을 누르거나 Esc를 누르면 닫는다 */
 document.addEventListener("pointerdown",e=>{document.querySelectorAll("details.dk-menu[open],details.opmenu[open]").forEach(d=>{if(!d.contains(e.target))d.removeAttribute("open");});});
 document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;document.querySelectorAll("details.dk-menu[open],details.opmenu[open]").forEach(d=>{d.removeAttribute("open");const sm=d.querySelector("summary");if(sm)sm.focus();});});
 /* 서랍 머리: 제목과 닫기 버튼 (drawSide가 다시 그릴 때마다 붙인다) */
 function teamHead(){const p=document.getElementById("people");if(!p||!on()||p.querySelector(":scope > .dk-ph"))return;
  p.setAttribute("role","region");p.setAttribute("aria-label","리더 신뢰·업무량");
  p.insertAdjacentHTML("afterbegin",'<div class="dk-ph"><span><b>리더 신뢰·업무량</b><small>리더 5명의 신뢰와 모듈별 업무량·스트레스</small></span><button type="button" class="dk-pclose">닫기</button></div>');
  p.querySelector(".dk-pclose").addEventListener("click",()=>toggleTeam(false));}
 document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;const p=document.getElementById("people");
  if(p&&p.classList.contains("dk-open")){const lx=document.getElementById("lexw");if(lx&&!lx.hidden)return;if(document.getElementById("dkal"))return;const md=document.getElementById("modal");if(md&&!md.hidden)return;toggleTeam(false);}});
 document.addEventListener("pointerdown",e=>{const p=document.getElementById("people");if(!p||!p.classList.contains("dk-open"))return;
  if(p.contains(e.target)||e.target.closest('#dktitle .team,#dkdock button[data-k="team"],.dkm-ctl .ppl,#modal,#lexw'))return;toggleTeam(false);});
 function paintFrame(){
  const t=ensureFrame();if(!t)return;
  const s=CONTENT[G.idx]||{};const app=appOf(s);
  root.dataset.app=on()?app:"";
  t.hidden=!on()||s.id==="P0";
  root.dataset.bare=s.bare&&s.id!=="P0"?"1":"";
  t.querySelector(".app").textContent=APPS[app]||"";
  const sub=[val(s.when)||(G.month?G.month+"월":""),strip(val(s.title)||"")].filter(Boolean).join(" · ");
  t.querySelector(".sub").textContent=sub;
  try{osPaint(s,app);}catch(e){}
 }
 function val(x){try{return typeof x==="function"?x(G):x;}catch(e){return "";}}
 function strip(x){return String(x||"").replace(/<[^>]+>/g,"");}

 /* ---------- 메뉴바: 시간·토큰·시계는 밖에, 나머지 도구는 메뉴 안으로 ---------- */
 const _db=drawBar;
 drawBar=function(clock){
  const r=_db.apply(this,arguments);
  try{document.querySelectorAll("#res > .r").forEach(r=>{if(r.dataset.s)return;const t=(r.firstChild&&r.firstChild.nodeType===3?r.firstChild.textContent:"").trim();if(/팀장 시간/.test(t))r.dataset.s="시간";else if(/토큰/.test(t))r.dataset.s="토큰";});}catch(e){}
  try{paintFrame();
   if(on()){const res=document.getElementById("res");if(res&&!res.querySelector(".dk-menu")){
    const tools=[...res.querySelectorAll('.tool:not([data-a="__undo"]), .rcap')];
    if(tools.length){const d=document.createElement("details");d.className="dk-menu";d.innerHTML='<summary>메뉴</summary><div class="dk-pop"></div>';
     const pop=d.querySelector(".dk-pop");tools.forEach(b=>pop.appendChild(b));res.appendChild(d);
     pop.addEventListener("click",()=>{d.open=false;});}}}
  }catch(e){}
  return r;
 };

 /* ---------- 팀 패널: 접어 두고, 신뢰 변화는 알림으로 ---------- */
 const _ds=drawSide;
 drawSide=function(live){
  const r=_ds.apply(this,arguments);
  try{if(on()){const sh=document.getElementById("shell");if(sh)sh.style.gridTemplateColumns="minmax(0,1fr)";teamHead();
   if(live&&typeof LD!=="undefined"){const ch=Object.keys(LD).filter(k=>live[k]).map(k=>`${LD[k].n} ${live[k]>0?"+":""}${live[k]}`);if(ch.length)deskNote("리더 신뢰",ch.join(" · "));}}}catch(e){}
  return r;
 };
 let noteT=null;
 function deskNote(head,text){{const pp=document.getElementById("people");if(pp&&pp.classList.contains("dk-open"))return;}let n=document.getElementById("dknote");if(!n){n=document.createElement("div");n.id="dknote";n.setAttribute("role","status");document.body.appendChild(n);}
  n.innerHTML=`<span class="ai" style="--c:#5b6770">${typeof ICO!=="undefined"?ICO.users:""}</span><span class="tx"><span class="hd"><b>리더 신뢰·업무량</b><small>지금</small></span><b class="tt">${head}</b><span>${text}</span></span>`;n.hidden=false;n.classList.remove("go");void n.offsetWidth;n.classList.add("go");clearTimeout(noteT);noteT=setTimeout(()=>{n.hidden=true;},3200);}
 window.deskNote=deskNote;

 /* ---------- 받은편지함: 메일과 메신저로 나눠 보기 ---------- */
 let tab=null;
 function splitInbox(){
  const m=document.querySelector("#view .mail");if(!m||!on())return;
  const list=m.querySelector(".list");if(!list)return;
  const items=[...list.querySelectorAll(".item")];
  const kind=it=>{const t=it.querySelector(".tag");return t&&t.classList.contains("DM")?"chat":"mail";};
  const cnt={mail:0,chat:0},un={mail:0,chat:0};
  items.forEach(it=>{const k=kind(it);cnt[k]++;if(!it.classList.contains("done"))un[k]++;});
  const sel=list.querySelector(".item.on");
  if(sel)tab=kind(sel);else if(!tab||!cnt[tab])tab=un.mail?"mail":"chat";
  let bar=null;
  const setTab=k=>{tab=k;apply();mailFolders(cnt,un,tab,setTab);};
  if(mailFolders(cnt,un,tab,setTab)){apply();m.dataset.kind=sel?kind(sel):tab;return;}
  if(!cnt.chat||!cnt.mail){m.dataset.kind=cnt.chat?"chat":"mail";return;}
  bar=list.querySelector(".dk-tabs");
  if(!bar){bar=document.createElement("div");bar.className="dk-tabs";bar.setAttribute("role","tablist");const h=list.querySelector(".listhead");(h?h.nextSibling:list.firstChild)&&list.insertBefore(bar,h?h.nextSibling:list.firstChild);}
  bar.innerHTML=["mail","chat"].map(k=>`<button type="button" role="tab" data-k="${k}" aria-selected="${tab===k}">${k==="mail"?"메일":"메신저"}${un[k]?` <span class="n">${un[k]}</span>`:""}</button>`).join("");
  bar.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{tab=b.dataset.k;apply();}));
  function apply(){items.forEach(it=>{it.hidden=kind(it)!==tab&&!it.classList.contains("on");});if(bar)bar.querySelectorAll("button").forEach(b=>b.setAttribute("aria-selected",b.dataset.k===tab?"true":"false"));}
  apply();
  m.dataset.kind=sel?kind(sel):tab;
 }

 /* ---------- 2단계: 앱별 꾸밈 (회의 · 메신저 · 인사시스템 · 대시보드) ---------- */
 const NAMES=()=>typeof LD!=="undefined"?Object.keys(LD).map(k=>[k,LD[k].n,LD[k].m]):[];
 function meetStrip(pane,s){
  if(pane.querySelector(".dk-meet"))return;
  const txt=[...pane.querySelectorAll(".say b, .voice, .prose")].map(e=>e.textContent).join(" ").slice(0,1600);
  const sayers=new Set([...pane.querySelectorAll(".say b")].map(b=>b.textContent.trim()));
  const tiles=NAMES().map(([k,n,m])=>{const talk=sayers.has(n)||(!sayers.size&&s.rel===k);const here=talk||txt.includes(n);
   return `<div class="dk-tile ${talk?"talk":""} ${here?"":"away"}"><span class="av">${n.slice(0,1)}</span><span class="nm">${n}<small>${m}</small></span>${talk?'<em>말하는 중</em>':""}</div>`;}).join("");
  pane.insertAdjacentHTML("afterbegin",`<div class="dk-meet" aria-hidden="true">${tiles}<div class="dk-tile me"><span class="av">나</span><span class="nm">팀장<small>나</small></span></div></div>`);
 }
 const HR_STEPS=[[/팀 여력 10칸|여력을? .*나누|10칸 나누기/,0],[/토큰 한도|토큰을 어떻게/,1],[/왜 이렇게 나눴는지|공지|배분을 마쳤습니다/,2]];
 function hrBand(pane,s){
  if(pane.querySelector(".dk-hr"))return;
  const h2=(pane.querySelector("h2")||{}).textContent||"";let steps="";
  if(s.id==="4-2"){let k=-1;HR_STEPS.forEach(([re,i])=>{if(k<0&&re.test(h2))k=i;});
   steps=`<ol class="dk-steps">${["여력 10칸 나누기","토큰 한도·배분","팀 공지 후 결재"].map((t,i)=>`<li class="${i===k?"on":i<k?"done":""}">${i+1}. ${t}</li>`).join("")}</ol>`;}
  const doc=/^12-/.test(s.id)?"연말 평가 · 헬씨푸드 운영팀":s.id==="3-1"?"평가 기준 · KPI 합의":/^R3-0|^8-1c|^6-1p/.test(s.id)?"결재 문서 · 여력 재배분":"결재 문서";
  pane.insertAdjacentHTML("afterbegin",`<div class="dk-hr"><b>퓨쳐테크 인사시스템</b><span>${doc}</span></div>${steps}`);
 }
 function dashTabs(){
  const bar=document.querySelector("#view .sctabs");if(!bar||bar.dataset.dk)return;bar.dataset.dk="1";
  const bs=[...bar.querySelectorAll(".sctab")];if(bs.length<7)return;
  const keep={0:"요약",1:"결정 돌아보기",5:"다음 라운드"};
  const more=document.createElement("details");more.className="dk-more";
  const cur=bs.findIndex(b=>b.getAttribute("aria-selected")==="true");
  more.innerHTML=`<summary>${[2,3,4,6].includes(cur)?"자세히 · "+bs[cur].textContent.replace(/^[①-⑤]\s*/,""):"자세히"}</summary><div class="dk-pop"></div>`;
  const pop=more.querySelector(".dk-pop");
  bs.forEach((b,i)=>{if(keep[i]!=null){b.textContent=keep[i];}else{b.textContent=b.textContent.replace(/^[①-⑤]\s*/,"");pop.appendChild(b);}});
  if([2,3,4,6].includes(cur))more.classList.add("on");
  bar.appendChild(more);
 }
 /* ---------- 3단계: 돌발 화면 (장애=에러 창 · 보안=위협 경고 · 조직·외부=속보) + 익명 라운지 ---------- */
 const ERR_LOG={"R3-1a":["[03:02:41] LINE-03 INTERLOCK sensor_value=OPEN record=CLOSED","[03:02:41] 오류 코드 E-417 · 상태 불일치","[03:03:10] 자동 복구 시도 1/3 … 실패","[03:04:00] 1등급 장애 절차 시작 · 지휘자 지정 대기"],
  "R3-1b":["[03:20:12] LINE-03 SEGMENT-2 인터록 이상 지속","[03:20:12] 같은 센서 모델: SEGMENT-1, SEGMENT-3","[03:20:30] 처리 결정 대기 · 납기 내일 아침"]};
 let joltFor=null;
 function errPane(pane,s){
  if(pane.querySelector(".dk-err"))return;
  const log=(ERR_LOG[s.id]||[]).map(x=>`<div>${x}</div>`).join("");
  pane.insertAdjacentHTML("afterbegin",`<div class="dk-err"><span class="ic" aria-hidden="true">!</span><div><b>치명적 오류 · 1등급 장애</b><span>생산 모니터링 시스템 · 해외 공장</span></div></div>${log?`<div class="dk-log">${log}<span class="cur">_</span></div>`:""}`);
  if(joltFor!==s.id){joltFor=s.id;const w=document.getElementById("dkwin");if(w){w.classList.remove("dk-jolt");void w.offsetWidth;w.classList.add("dk-jolt");}}
 }
 function secPane(pane,s){
  if(pane.querySelector(".dk-sec"))return;
  pane.insertAdjacentHTML("afterbegin",`<div class="dk-sec"><span class="ic" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"></path><path d="M12 8v5M12 16v.01"></path></svg></span><div><b>보안 위협 감지</b><span>퓨쳐테크 보안 센터 · 고객 데이터 외부 전송</span></div></div>`);
 }
 function newsPane(pane,s){
  if(pane.querySelector(".dk-news"))return;
  const h2=pane.querySelector("h2");const done=!!pane.querySelector(".happen .label")&&!pane.querySelector(".opts");
  const quotes=[...pane.querySelectorAll(".say")].map(e=>{const b=e.querySelector("b"),v=e.querySelector(".voice");return b&&v?`${b.textContent} "${v.textContent.replace(/^"|"$/g,"")}"`:"";}).filter(Boolean);
  pane.insertAdjacentHTML("afterbegin",`<div class="dk-news"><span class="live"><i></i>LIVE</span><span class="ch">퓨쳐테크 사내 속보</span><span class="tm">${val(s.when)||""}</span></div>`);
  if(h2&&!h2.querySelector(".dk-lbl"))h2.insertAdjacentHTML("afterbegin",`<span class="dk-lbl">${done?"속보 업데이트":"속보"}</span>`);
  if(quotes.length&&!pane.querySelector(".dk-ticker"))pane.insertAdjacentHTML("beforeend",`<div class="dk-ticker" aria-hidden="true"><b>속보</b><div><span>${quotes.join("  ·  ")}</span><span>${quotes.join("  ·  ")}</span></div></div>`);
 }
 function loungePane(pane,s){
  if(pane.querySelector(".dk-lounge"))return;
  pane.insertAdjacentHTML("afterbegin",`<div class="dk-lounge"><b>익명 라운지</b><span class="cert">퓨쳐테크 인증</span><span class="tabs"><b>우리 회사</b> 팀 이야기 · 업계 · 회사생활</span></div>`);
 }
 /* ---------- 4단계: 앱 구조로 재배치 (메일 3단 · 화상 회의 · 메신저) ----------
    장면이 그린 본문·대사·선택 버튼 노드를 앱의 자리로 "옮긴다". 버튼은 그대로라 클릭·점수는 같다. */
 const esc=t=>String(t||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 function nameMap(){const m={};if(typeof LD!=="undefined")for(const k in LD)m[LD[k].n]=k;if(typeof PP!=="undefined")for(const k in PP)m[PP[k].n]=k;return m;}
 function who(k){return (typeof LD!=="undefined"&&LD[k])||(typeof PP!=="undefined"&&PP[k])||null;}
 function faceOf(k){try{return face(k,G.trust&&G.trust[k]);}catch(e){return "";}}
 function keyByName(n){n=String(n||"").trim();const m=nameMap();if(m[n])return m[n];const hit=Object.keys(m).find(x=>n.startsWith(x)||x.startsWith(n.replace(/\s*\(.*$/,"")));return hit?m[hit]:null;}
 function speakerOf(pane,s){
  if(s.rel&&who(s.rel))return s.rel;
  const b=pane.querySelector(".say b");if(b){const k=keyByName(b.textContent);if(k)return k;}
  for(const c of pane.querySelectorAll(".cond span")){const m=c.textContent.match(/^\s*([^:"“]{2,8})\s*:/);if(m){const k=keyByName(m[1]);if(k)return k;}}
  const eb=(pane.querySelector(".eyebrow")||{}).textContent||"";const m=eb.match(/^([^·]+)·/);if(m){const k=keyByName(m[1]);if(k)return k;}
  return null;
 }
 const picked={};
 window.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#view .foot .btn.main");if(!b||!on())return;
  const o=document.querySelector("#view .opt[aria-pressed=true]");if(!o)return;const s=CONTENT[G.idx]||{};
  const t=o.querySelector(".k + span");picked[s.id]=t?[...t.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join("").trim():"";},true);

 /* ---------- 아이콘 (업무 PC 2차, 2026-11-26) ---------- */
 const I=d=>`<svg class="ic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
 const ICO={
  mail:I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  chat:I('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>'),
  video:I('<rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="m15.5 10 6-3.5v11l-6-3.5"/>'),
  videooff:I('<path d="M10.5 6H13.5a2 2 0 0 1 2 2v3.5M15.5 15.5V16a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h.5M15.5 10l6-3.5v11l-4-2.3M3 3l18 18"/>'),
  hr:I('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 17c.8-2 2-3 3.5-3s2.7 1 3.5 3M14 9h4M14 13h4"/>'),
  chart:I('<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>'),
  book:I('<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17Z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>'),
  users:I('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.3-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.6c2.6.2 4.4 2 5 5.4"/>'),
  search:I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  mic:I('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
  micoff:I('<path d="M15 9.3V6a3 3 0 0 0-5.7-1.3M9 9v2a3 3 0 0 0 5 2.2M5 11a7 7 0 0 0 11.6 5.3M19 11a7 7 0 0 1-.6 2.8M12 18v3M3 3l18 18"/>'),
  smile:I('<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>'),
  cc:I('<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M10.5 10.2a2.4 2.4 0 1 0 0 3.6M17 10.2a2.4 2.4 0 1 0 0 3.6"/>'),
  phone:I('<path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a2 2 0 0 1-2.2 2A17 17 0 0 1 3 6.2 2 2 0 0 1 5 4Z"/>'),
  hang:I('<path d="M3 14.8c5-4.9 13-4.9 18 0l-2 2.7-3.8-1.5v-2.9a11 11 0 0 0-6.4 0V16l-3.8 1.5Z"/>'),
  clip:I('<path d="m21 11.5-8.6 8.6a5 5 0 0 1-7.1-7.1l8.6-8.6a3.4 3.4 0 0 1 4.8 4.8L10 17.9a1.7 1.7 0 0 1-2.4-2.4l8-8"/>'),
  send:I('<path d="M21 3 10 14M21 3l-6.5 18-4.5-7-7-4.5Z"/>'),
  wifi:I('<path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0M12 19h.01"/>'),
  bat:'<svg class="ic" viewBox="0 0 28 14" width="24" height="12" aria-hidden="true"><rect x=".75" y=".75" width="23" height="12.5" rx="3.2" fill="none" stroke="currentColor" stroke-width="1.3" opacity=".55"/><rect x="2.6" y="2.6" width="15.5" height="8.8" rx="1.8" fill="currentColor"/><path d="M25.6 4.8v4.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity=".55"/></svg>',
  bell:I('<path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Z"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
  reply:I('<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 6 6v4"/>'),
  replyall:I('<path d="M7 14 2 9l5-5"/><path d="M12 14 7 9l5-5"/><path d="M7 9h8a6 6 0 0 1 6 6v4"/>'),
  forward:I('<path d="m15 14 5-5-5-5"/><path d="M20 9H10a6 6 0 0 0-6 6v4"/>'),
  archive:I('<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9M10 13h4"/>'),
  trash:I('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
  more:I('<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'),
  shield:I('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M12 8v5M12 16h.01"/>'),
  alert:I('<path d="M12 3 2 20h20Z"/><path d="M12 10v4M12 17h.01"/>'),
  note:I('<path d="M5 3h10l4 4v14H5Z"/><path d="M15 3v4h4M8 12h8M8 16h6"/>'),
  edit:I('<path d="M4 20h4L19 9l-4-4L4 16Z"/><path d="m13.5 6.5 4 4"/>'),
  home:I('<path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10"/>'),
  doc:I('<path d="M6 3h9l4 4v14H6Z"/><path d="M14 3v5h5"/>'),
  tv:I('<rect x="2.5" y="5" width="19" height="13" rx="2"/><path d="M8 21h8M8 2l4 3 4-3"/>'),
  grid:I('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
  chev:I('<path d="m9 6 6 6-6 6"/>'),
  lounge:I('<path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9h8M8 12h5"/>')
 };
 window.DK_ICO=ICO;
 const t0s={};const t0=k=>t0s[k]||(t0s[k]=Date.now());
 const mmss=ms=>{const s=Math.max(0,Math.floor(ms/1000));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?String(h).padStart(2,"0")+":":"")+String(m).padStart(2,"0")+":"+String(x).padStart(2,"0");};
 setInterval(()=>{document.querySelectorAll("[data-t0]").forEach(e=>{e.textContent=mmss(Date.now()+(+e.dataset.off||0)-(+e.dataset.t0));});},1000);
 const ROOM={rd:["#3b4d63","#1b2531","#9fc3e8"],src:["#5a4a3a","#2a211a","#e8c99f"],mfg:["#3d4a3c","#1c231b","#b9d6a0"],prc:["#4f3f58","#241c2b","#d7b6ea"],mkt:["#5e3b3b","#2b1a1a","#f2b3a6"],kim:["#3c4f52","#1a2526","#a7dbe0"]};
 const roomBg=k=>{const r=ROOM[k]||["#3e4448","#1e2225","#c9d1d6"];return `--r1:${r[0]};--r2:${r[1]};--r3:${r[2]}`;};
 const camFace=k=>{let f=faceOf(k);f=f.replace(/ clip-path="url\(#[^)]+\)"/g,"");return f;};
 const timeOf=s=>{const w=String(val(s.when)||"");const m=w.match(/(새벽|아침|오전|오후|저녁|밤)\s*(\d{1,2})시\s*(\d{1,2})?분?/);if(m){return `${/새벽|아침|오전/.test(m[1])?"오전":"오후"} ${m[2]}:${String(m[3]||"00").padStart(2,"0")}`;}return "";};

 /* ---------- 화상 회의 (2차) ---------- */
 function meetApp(pane,s){
  if(pane.dataset.dk)return;pane.dataset.dk="meet";
  const old=pane.querySelector(".dk-meet");if(old)old.remove();
  const sp=speakerOf(pane,s);const P=who(sp);
  const title=strip(val(s.title)||(pane.querySelector("h2")||{}).textContent||"리더 회의");
  const lead=typeof LD!=="undefined"?Object.keys(LD):[];
  const st0=t0("meet:"+s.id);
  const plate=(k,talk)=>{const p=who(k);return `<span class="plate">${talk?ICO.mic+'<i class="lv"><b></b><b></b><b></b></i>':ICO.micoff}${esc(p.n)} <small>${esc(p.m)}</small></span>`;};
  const tile=(k,talk)=>`<div class="cam${talk?" talk":""}" style="${roomBg(k)}"><div class="cv">${camFace(k)}</div>${plate(k,talk)}</div>`;
  const me=`<div class="cam me" style="--r1:#24302b;--r2:#121815;--r3:#8fb8a5"><div class="cv"><span class="me-av">나</span></div><span class="plate"><span class="mi">${ICO.mic}</span>나 (팀장)</span><span class="react" aria-hidden="true"></span></div>`;
  const stage=document.createElement("section");stage.className="dkm-stage";
  stage.innerHTML=`<div class="dkm-top"><span class="rec"><i></i>REC <b data-t0="${st0}">00:00</b></span><b class="ttl">${esc(title)}</b><span class="cnt">${ICO.users} 6</span><span class="lay">${ICO.grid} ${P?"발표자 보기":"갤러리 보기"}</span></div>`+
   (P?`<div class="dkm-main">${tile(sp,1)}<div class="dkm-cap"><span class="cc">자막</span></div></div><div class="dkm-strip">${lead.filter(k=>k!==sp).map(k=>tile(k,0)).join("")}${me}</div>`
     :`<div class="dkm-gal">${lead.map(k=>tile(k,0)).join("")}${me}</div><div class="dkm-cap gal"><span class="cc">자막</span></div>`)+
   `<div class="dkm-ctl" role="toolbar" aria-label="회의 도구">
     <button type="button" class="c mic" aria-label="음소거" aria-pressed="false">${ICO.mic}<span>음소거</span></button>
     <button type="button" class="c camb" aria-label="비디오 중지" aria-pressed="false">${ICO.video}<span>비디오 중지</span></button>
     <span class="sep"></span>
     <button type="button" class="c rx" aria-label="반응">${ICO.smile}<span>반응</span></button>
     <button type="button" class="c ccb" aria-label="자막" aria-pressed="true">${ICO.cc}<span>자막</span></button>
     <button type="button" class="c ppl" aria-label="참석자">${ICO.users}<span>참석자</span></button>
     <span class="sep"></span>
     <button type="button" class="c leave" aria-label="나가기">${ICO.hang}<span>나가기</span></button></div>`;
  const cap=stage.querySelector(".dkm-cap");
  const qs=[...pane.querySelectorAll(":scope > .say, :scope > .cond")];
  if(qs.length&&!pane.querySelector(".opts")&&/일어난 일/.test((pane.querySelector(".eyebrow")||{}).textContent||""))qs.length=0;
  qs.forEach(q=>cap.appendChild(q));if(!qs.length)cap.remove();
  const meT=stage.querySelector(".cam.me");
  stage.querySelector(".mic").addEventListener("click",e=>{const b=e.currentTarget;const on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on);b.innerHTML=(on?ICO.micoff:ICO.mic)+`<span>${on?"음소거 해제":"음소거"}</span>`;meT.querySelector(".mi").innerHTML=on?ICO.micoff:ICO.mic;});
  stage.querySelector(".camb").addEventListener("click",e=>{const b=e.currentTarget;const on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on);b.innerHTML=(on?ICO.videooff:ICO.video)+`<span>${on?"비디오 시작":"비디오 중지"}</span>`;meT.classList.toggle("off",on);});
  stage.querySelector(".rx").addEventListener("click",()=>{const r=meT.querySelector(".react");r.textContent="👍";r.classList.remove("go");void r.offsetWidth;r.classList.add("go");});
  stage.querySelector(".ccb").addEventListener("click",e=>{const b=e.currentTarget;const on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on);stage.classList.toggle("nocc",!on);});
  stage.querySelector(".ppl").addEventListener("click",()=>toggleTeam(true));
  stage.querySelector(".leave").addEventListener("click",()=>{try{toast("결정을 마치면 회의가 끝납니다. 오른쪽 '회의 안건'에서 답을 정하세요.");}catch(e){}});
  const side=document.createElement("aside");side.className="dkm-side";
  side.innerHTML=`<div class="dkm-sh" role="presentation"><span class="tab on">회의 안건</span><span class="tab">참석자 6</span><span class="when">${esc(val(s.when)||(G.month?G.month+"월":""))}</span></div><div class="dkm-body"></div><div class="dkm-foot"></div>`;
  const body=side.querySelector(".dkm-body"),foot=side.querySelector(".dkm-foot");
  const opts=pane.querySelector(":scope > .opts"),ft=pane.querySelector(":scope > .foot");
  [...pane.childNodes].forEach(n=>{if(n!==opts&&n!==ft)body.appendChild(n);});
  if(opts){const hasQ=[...body.querySelectorAll("p > b")].some(b=>/\?$/.test(b.textContent.trim()));
   if(!hasQ)body.insertAdjacentHTML("beforeend",`<p class="dkm-q">회의 자리에서 어떻게 답할까요?</p>`);body.appendChild(opts);}
  if(ft)foot.appendChild(ft);else foot.remove();
  const wrap=document.createElement("div");wrap.className="dkm";wrap.append(stage,side);pane.appendChild(wrap);
 }

 /* ---------- 메신저 (2차) ---------- */
 function chatApp(pane,s){
  if(pane.dataset.dk)return;pane.dataset.dk="chat";
  const k=speakerOf(pane,s);const P=who(k)||{n:"대화",m:""};
  const opts=pane.querySelector(":scope > .opts"),ft=pane.querySelector(":scope > .foot");
  const says=[...pane.querySelectorAll(":scope > .say, :scope > .cond")];
  const first=(pane.querySelector(".say .voice")||{}).textContent||"";
  const tm=timeOf(s);
  const lead=typeof LD!=="undefined"?Object.keys(LD).filter(x=>x!==k):[];
  const room=(x,on,prev,n)=>{const p=who(x);return `<div class="dkc-r ${on?"on":""}">${faceOf(x)}<span class="rn"><b>${esc(p.n)}</b><small>${esc(prev||p.m+" 모듈")}</small></span><span class="rt">${on?esc(tm||"지금"):""}${n?`<i>${n}</i>`:""}</span></div>`;};
  const app=document.createElement("div");app.className="dkc";
  app.innerHTML=`<nav class="dkc-rail" aria-hidden="true"><span class="on">${ICO.chat}</span><span>${ICO.users}</span><span>${ICO.bell}</span><span class="b">${ICO.more}</span></nav>
   <aside class="dkc-rooms"><div class="dkc-rh"><b>채팅</b><span class="ics" aria-hidden="true">${ICO.edit}</span></div><div class="srch" aria-hidden="true">${ICO.search}<span>이름, 채팅방 검색</span></div>
    <div class="dkc-list">${k?room(k,1,first.slice(0,30)+(first.length>30?"…":""),opts?1:0):""}${lead.map(x=>room(x,0)).join("")}</div></aside>
   <section class="dkc-room"><header>${k?faceOf(k):""}<span><b>${esc(P.n)}</b><small>${esc(P.m)}${P.m?" 모듈 · ":""}1:1 대화</small></span><span class="hi" aria-hidden="true">${ICO.phone}${ICO.video}${ICO.search}${ICO.more}</span></header><div class="dkc-log"></div><div class="dkc-cmp"></div></section>`;
  const log=app.querySelector(".dkc-log"),cmp=app.querySelector(".dkc-cmp");
  const eb=pane.querySelector(":scope > .eyebrow");if(eb){eb.classList.add("dkc-day");log.appendChild(eb);}
  const narr=document.createElement("div");narr.className="dkc-narr";
  [...pane.childNodes].forEach(n=>{if(n===opts||n===ft||says.includes(n))return;narr.appendChild(n);});
  if(narr.textContent.trim())log.appendChild(narr);
  says.forEach(q=>{q.classList.add("dkc-b");if(tm)q.insertAdjacentHTML("beforeend",`<span class="tm">${esc(tm)}</span>`);log.appendChild(q);});
  if(!opts&&picked[s.id])narr.insertAdjacentHTML("beforebegin",`<div class="dkc-me"><span class="rd">읽음</span><span class="bb">${esc(picked[s.id])}</span></div>`);
  if(opts){
   const pr=opts.querySelector(".opt[aria-pressed=true] .k + span");
   const pt=pr?[...pr.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join("").trim():"";
   cmp.insertAdjacentHTML("beforeend",`<p class="dkc-lab">추천 답장 · 하나를 고르면 입력창에 들어갑니다</p>`);cmp.appendChild(opts);
   cmp.insertAdjacentHTML("beforeend",`<div class="dkc-in"><span class="cl" aria-hidden="true">${ICO.clip}</span><div class="ta${pt?"":" ph"}">${pt?esc(pt):"추천 답장을 고르세요"}</div><span class="sendslot"></span></div>`);
  }
  if(ft){const b=ft.querySelector(".btn.main");if(b&&opts&&b.textContent.trim()==="결정"){b.innerHTML=`${ICO.send}<span>전송</span>`;b.classList.add("dk-send");}
   const slot=cmp.querySelector(".sendslot");
   if(slot&&opts){const note=ft.querySelector(".note");if(note){note.classList.add("dkc-hint");cmp.appendChild(note);}slot.replaceWith(ft);}else cmp.appendChild(ft);}
  if(!cmp.childNodes.length)cmp.remove();
  pane.appendChild(app);
 }

 function mailApp(){
  const m=document.querySelector("#view .mail");if(!m||m.dataset.dk)return;m.dataset.dk="mail";
  const nav=document.createElement("nav");nav.className="dkf";nav.setAttribute("aria-label","메일함");m.insertBefore(nav,m.firstChild);
  const nm=nameMap();
  m.querySelectorAll(".item").forEach(it=>{const top=it.querySelector(".top");if(!top||it.querySelector(".dkav"))return;
   const tag=top.querySelector(".tag");const sender=[...top.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join("").trim();
   const nm=sender.replace(/^[^\p{L}\p{N}]+/u,"").trim();const k=keyByName(nm.replace(/\s*\(.*$/,""));const alert=tag&&tag.classList.contains("ALERT");const call=tag&&tag.classList.contains("CALL");
   const first=Array.from(nm)[0]||"?";
   it.insertAdjacentHTML("afterbegin",`<span class="dkav ${alert?"al":""}${call?" call":""}">${k&&!call?faceOf(k):call?(typeof ICO!=="undefined"?ICO.phone:"☎"):`<i>${alert?"!":esc(first)}</i>`}</span>`);
   if(!it.classList.contains("read")&&!it.classList.contains("done"))it.classList.add("dk-unread");});
  const rh=m.querySelector(".rhead");
  if(rh&&!rh.querySelector(".dkav")){const on=m.querySelector(".item.on");const av=on&&on.querySelector(".dkav");
   if(av){rh.insertAdjacentHTML("afterbegin",av.outerHTML);rh.insertAdjacentHTML("beforeend",`<p class="to">받는 사람: 팀장</p>`);rh.classList.add("withav");}}
 }
 function mailFolders(cnt,un,tab,setTab){
  const nav=document.querySelector("#view .mail .dkf");if(!nav)return false;
  const pend=(G.pending&&G.pending.length)||0;const head=document.querySelector("#view .listhead .num");
  nav.innerHTML=`<div class="dkf-h">메일함</div>`+[["mail","받은편지함"],["chat","메신저"]].map(([k,n])=>`<button type="button" data-k="${k}" aria-pressed="${tab===k}"${cnt[k]?"":" disabled"}><span>${n}</span>${un[k]?`<b>${un[k]}</b>`:`<i>${cnt[k]||0}</i>`}</button>`).join("")+
   `<div class="dkf-x"><span>미결</span><i>${pend}</i></div><div class="dkf-x"><span>보낸편지함</span></div><div class="dkf-foot">오늘 처리 ${head?esc(head.textContent.replace(/\s*처리/,"")):""}</div>`;
  nav.querySelectorAll("button[data-k]").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.k)));
  return true;
 }
 /* ---------- 인사시스템 (2차): 그룹웨어 화면 ---------- */
 const ENT={kpi:["목표·KPI",["KPI 합의서","등급 기여 기준","합의 현황","재검토 조건"]],res:["자원·결재",["여력 배분","토큰 한도","결재함","공지 이력"]],eval:["평가",["평가 대상자","직접 평가","이의제기","결과 공지"]]};
 const ENT_BY={"3-1":["kpi",1,"등급 기여 기준 등록"],"4-2":["res",0,"2분기 여력 배분 결재"],"6-1p":["res",2,"계약 재협상 기준 등록"],"8-1c":["res",3,"인력 차출 후 재배분 공지"],"R3-0":["res",0,"4분기 여력 재배분 결재"],
  "12-3a":["eval",0,"연말 평가 · 구성원 등급 확정"],"12-3":["eval",1,"연말 평가 · 직접 평가"],"12-4":["eval",2,"평가 이의제기 처리"]};
 function hrApp(pane,s){
  if(pane.dataset.dk)return;pane.dataset.dk="hr";
  const m=ENT_BY[s.id]||(/^12-/.test(s.id)?["eval",3,"연말 평가"]:["res",2,"결재 문서"]);const [g,items]=ENT[m[0]];
  const no=`HR-2026-${String(G.month||1).padStart(2,"0")}${String(Math.abs([...String(s.id)].reduce((a,c)=>a*31+c.charCodeAt(0),7))%900+100)}`;
  const ent=document.createElement("div");ent.className="ent";
  ent.innerHTML=`<header class="ent-gnb"><span class="ent-logo"><b>FUTURETECH</b><span>HR Portal</span></span><nav aria-hidden="true">${["홈","목표·KPI","자원·결재","평가","조직도"].map(x=>`<span class="${x===g?"on":""}">${x}</span>`).join("")}</nav><span class="ent-user">${ICO.bell}<span>헬씨푸드 운영팀 · <b>팀장</b></span></span></header>
   <div class="ent-body"><aside class="ent-lnb" aria-hidden="true"><b>${g}</b><ul>${items.map((x,i)=>`<li class="${i===m[1]?"on":""}">${x}</li>`).join("")}</ul><p class="ent-help">처리 기한이 지난 문서는 결재함에서 빨간색으로 표시됩니다.</p></aside>
   <main class="ent-main"><div class="ent-crumb">${ICO.home}<span>홈</span>${ICO.chev}<span>${g}</span>${ICO.chev}<b>${items[m[1]]}</b></div>
    <div class="ent-title"><h1>${m[2]}</h1><span class="docno">문서번호 ${no}</span></div>
    <table class="ent-appr" aria-label="결재선"><tr><th rowspan="2">결재선</th><td>기안</td><td>검토</td><td>승인</td></tr><tr><td><b>팀장</b><span class="st now">작성 중</span></td><td><b>인사팀</b><span class="st">대기</span></td><td><b>담당 임원</b><span class="st">대기</span></td></tr></table>
    <div class="ent-form"></div></main></div>`;
  const form=ent.querySelector(".ent-form");[...pane.childNodes].forEach(n=>form.appendChild(n));
  const hb=form.querySelector(".dk-hr");if(hb)hb.remove();
  pane.appendChild(ent);
 }
 /* ---------- 팀 대시보드 (2차): 성적표 ---------- */
 function dashApp(){
  const pane=document.querySelector("#view .pane");if(pane&&pane.dataset.dk==="dash")return true;const tabs=pane&&pane.querySelector(":scope > .sctabs");if(!tabs)return false;pane.dataset.dk="dash";
  const eb=(pane.querySelector(":scope > .eyebrow")||{}).textContent||"";
  const bi=document.createElement("div");bi.className="bi";
  bi.innerHTML=`<aside class="bi-nav"><div class="bi-brand">${ICO.chart}<b>팀 인사이트</b></div><p class="bi-sub">${esc(eb)}</p><div class="bi-tabs"></div><p class="bi-foot">헬씨푸드 운영팀 · 30명</p></aside><main class="bi-main"></main>`;
  const main=bi.querySelector(".bi-main");[...pane.childNodes].forEach(n=>{if(n!==tabs)main.appendChild(n);});
  bi.querySelector(".bi-tabs").appendChild(tabs);pane.appendChild(bi);
  return true;
 }
 /* ---------- 메일 도구 모음 ---------- */
 function mailBar(){
  const m=document.querySelector("#view .mail[data-dk]");if(!m||m.querySelector(".dkmail-tb"))return;
  m.insertAdjacentHTML("afterbegin",`<div class="dkmail-tb" aria-hidden="true"><span class="new">${ICO.edit}새 메일</span><span>${ICO.reply}답장</span><span>${ICO.replyall}전체 답장</span><span>${ICO.forward}전달</span><span class="sep"></span><span>${ICO.archive}보관</span><span>${ICO.trash}삭제</span><span class="srch">${ICO.search}메일 검색</span></div>`);
 }

 /* ---------- 돌발: 먼저 덮치는 경보, 그다음 긴급 대응 화면 ---------- */
 const ALARM={"R3-1a":"err","3-8":"sec","9-4":"call","8-1a":"news","6-4a":"news"};
 const URGENT={"R3-1a":["err","inc:R3"],"R3-1b":["err","inc:R3"],"3-8":["sec","inc:3-8"],"9-4":["call","inc:9-4"]};
 let alarmAt=null;
 function siren(type){try{if(!G.sound)return;const seq=type==="call"?[[700,.28],[0,.12],[700,.28],[0,.6],[700,.28],[0,.12],[700,.28]]:type==="news"?[[660,.12],[880,.18]]:[[880,.16],[620,.16],[880,.16],[620,.16],[880,.16],[620,.16]];let t=0;seq.forEach(([f,d])=>{if(f)setTimeout(()=>beep(f,d,type==="call"?"sine":"square"),t*1000);t+=d+.04;});}catch(e){}}
 function alarm(s){
  const type=ALARM[s.id];if(!type||alarmAt===G.idx||G.review)return;alarmAt=G.idx;
  document.querySelectorAll("#dkal").forEach(x=>x.remove());
  const k=(URGENT[s.id]||[])[1];const tt=k?t0(k):Date.now();
  const d=document.createElement("div");d.id="dkal";d.className="al-"+type;d.setAttribute("role","alertdialog");d.setAttribute("aria-modal","true");d.setAttribute("aria-labelledby","dkal-t");
  const P=(s.intro||[]).map(val).filter(Boolean);
  let box="";
  if(type==="err")box=`<div class="al-box"><div class="al-head"><span class="al-ic">!</span><div><b id="dkal-t">치명적 오류 · 1등급 장애</b><span>생산 모니터링 시스템 · 헬씨푸드 해외 공장</span></div><span class="al-t">경과 <b data-t0="${tt}">00:00</b></span></div>
    <div class="al-log">${(ERR_LOG["R3-1a"]||[]).map((x,i)=>`<div style="animation-delay:${.35+i*.55}s">${esc(x)}</div>`).join("")}</div>
    <p class="al-msg">안전 인터록 센서 값이 시스템 기록과 맞지 않습니다. 1등급 장애 절차에 따라 지금 지휘자를 정해야 합니다.</p><button type="button" class="al-go">상황 확인</button></div>`;
  if(type==="sec")box=`<div class="al-box"><div class="al-radar" aria-hidden="true"><i></i></div><b id="dkal-t" class="al-big">위협 탐지</b><p class="al-sub">퓨쳐테크 보안 센터 · 데이터 유출 의심</p>
    <dl class="al-dl"><dt>탐지 내용</dt><dd>승인되지 않은 외부 AI 서비스로 파일 전송</dd><dt>대상</dt><dd>헬씨푸드 고객 데이터</dd><dt>전송 시점</dt><dd>48시간 전</dd><dt>보고 기한</dt><dd class="red">헬씨푸드 24시간 · 당국 72시간</dd></dl><button type="button" class="al-go">대응 시작</button></div>`;
  if(type==="call")box=`<div class="al-box"><div class="al-caller" aria-hidden="true"><span class="ring"></span><span class="ring r2"></span><span class="av">헬</span></div><b id="dkal-t" class="al-big">헬씨푸드 임원</b><p class="al-sub">휴대전화 · 전화가 오고 있습니다</p><p class="al-when">${esc(val(s.when)||"")}</p><button type="button" class="al-go">${ICO.phone}<span>받기</span></button></div>`;
  if(type==="news")box=`<div class="al-box"><div class="al-tv"><span class="al-live"><i></i>LIVE</span><span class="al-ch">퓨쳐테크 사내 방송</span></div><div class="al-slab"><span class="al-tag">속보</span><b id="dkal-t">${esc(strip(val(s.title)||""))}</b></div><p class="al-sub">${esc(strip(P[0]||P[1]||"")).slice(0,90)}</p><button type="button" class="al-go">자세히 보기</button></div>`;
  d.innerHTML=`<div class="al-flash" aria-hidden="true"></div>${box}`;
  document.body.appendChild(d);
  const go=d.querySelector(".al-go");const done=()=>{d.classList.add("out");setTimeout(()=>d.remove(),220);try{document.querySelector("#view h2, #view .dkm-q, #view .opts")?.focus?.();}catch(e){}};
  go.addEventListener("click",done);d.addEventListener("keydown",e=>{if(e.key==="Escape"||e.key==="Enter"){e.preventDefault();done();}});
  setTimeout(()=>go.focus(),60);siren(type);
 }
 function urgentPaint(s){
  const u=URGENT[s.id];root.dataset.urgent=on()&&u?u[0]:"";
  let pill=document.getElementById("dkurg");
  if(!u||!on()){if(pill)pill.remove();const p2=document.getElementById("dkurg2");if(p2)p2.remove();return;}
  const label={err:"1등급 장애 대응 중",sec:"보안 사고 대응 중",call:"통화 중"}[u[0]];
  if(!pill){pill=document.createElement("span");pill.id="dkurg";const st=document.getElementById("dkst");if(st)st.prepend(pill);}
  pill.innerHTML=`<i></i>${label} <b data-t0="${t0(u[1])}">${mmss(Date.now()-t0(u[1]))}</b>`;
  let p2=document.getElementById("dkurg2");const tt=document.getElementById("dktitle");
  if(!p2&&tt){p2=document.createElement("span");p2.id="dkurg2";const tb=tt.querySelector(".team");tt.insertBefore(p2,tb);}
  if(p2){p2.innerHTML=`<i></i><b data-t0="${t0(u[1])}">${mmss(Date.now()-t0(u[1]))}</b>`;p2.setAttribute("aria-label",label);p2.title=label;}
 }
 function callPane(pane,s){
  if(pane.querySelector(".dk-call"))return;
  pane.insertAdjacentHTML("afterbegin",`<div class="dk-call"><span class="av">헬</span><div class="nm"><b>헬씨푸드 임원</b><span>통화 중 · <b data-t0="${t0("inc:9-4")}">00:00</b></span></div><div class="ctl" aria-hidden="true"><span>${ICO.micoff}<small>음소거</small></span><span>${ICO.grid}<small>키패드</small></span><span>${ICO.users}<small>통화 추가</small></span><span class="end">${ICO.hang}<small>통화 종료</small></span></div></div>`);
 }

 /* ---------- 운영체제: 메뉴바 · 독 ---------- */
 const DOCK=[["mail","메일","#2f6fec",ICO.mail],["chat","메신저","#f5c400",ICO.chat],["meet","화상 회의","#0e9f8e",ICO.video],["hr","인사시스템","#1f3a68",ICO.hr],["dash","팀 대시보드","#2b2f36",ICO.chart]];
 const EXTRA={err:["생산 모니터링","#d7261e",ICO.alert],sec:["보안 센터","#b3261e",ICO.shield],news:["사내 방송","#0b1220",ICO.tv],call:["전화","#1f9d55",ICO.phone],lounge:["익명 라운지","#ff5a4e",ICO.lounge],note:["업무 노트","#e9b949",ICO.note],onboard:["신임 리더 온보딩","#00473C",ICO.home]};
 const appTip={mail:"메일은 받은편지함 시간에 열립니다.",chat:"메신저는 대화가 오면 열립니다.",meet:"화상 회의는 회의 시간에 열립니다.",hr:"인사시스템은 배분·평가 때 열립니다.",dash:"팀 대시보드는 라운드가 끝나면 열립니다."};
 function osPaint(s,app){
  const bar=document.querySelector(".bar .wrap");if(!bar)return;
  let mb=document.getElementById("dkmb");
  if(!mb){mb=document.createElement("div");mb.id="dkmb";mb.setAttribute("aria-hidden","true");bar.prepend(mb);}
  mb.innerHTML=`<span class="logo">F</span><b>${esc(APPS[app]||"업무 노트")}</b>${["파일","편집","보기","창","도움말"].map(x=>`<span>${x}</span>`).join("")}`;
  let st=document.getElementById("dkst");
  if(!st){st=document.createElement("div");st.id="dkst";bar.appendChild(st);}
  if(!st.querySelector(".sys"))st.insertAdjacentHTML("beforeend",`<span class="sys" aria-hidden="true">${ICO.wifi}${ICO.bat}<span class="dt"></span></span>`);
  st.querySelector(".dt").textContent=String(val(s.when)||(G.month?G.month+"월":"")).replace(/\s*·.*$/,"");
  let dk=document.getElementById("dkdock");
  if(!dk){dk=document.createElement("nav");dk.id="dkdock";dk.setAttribute("aria-label","앱");document.body.appendChild(dk);
   dk.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const k=b.dataset.k;
    if(k==="team")return toggleTeam();if(k==="lex"){try{openLex();}catch(x){}return;}
    if(b.classList.contains("on"))return;try{toast(appTip[k]||"이 앱은 관련 장면에서 열립니다.");}catch(x){}});}
  const badge={};
  const mm=document.querySelector("#view .mail");if(mm){badge.mail=mm.querySelectorAll(".item:not(.done) .tag:not(.DM)").length;badge.chat=mm.querySelectorAll(".item:not(.done) .tag.DM").length;}
  const ex=EXTRA[app];
  const btn=(k,n,c,ic,on,bd)=>`<button type="button" data-k="${k}" class="${on?"on":""}" style="--c:${c}" aria-label="${n}${bd?` · 새 항목 ${bd}`:""}"${on?' aria-current="true"':""}><span class="ai">${ic}</span>${bd?`<i class="bd">${bd}</i>`:""}<span class="tip">${n}</span></button>`;
  dk.innerHTML=DOCK.map(([k,n,c,ic])=>btn(k,n,c,ic,app===k,badge[k])).join("")+(ex?`<span class="sep"></span>${btn(app,ex[0],ex[1],ex[2],1)}`:"")+
   `<span class="sep"></span>${btn("team","리더 신뢰·업무량","#5b6770",ICO.users,0)}${btn("lex","리더십 사전","#00473C",ICO.book,0)}`;
  dk.hidden=!on()||s.id==="P0"||root.dataset.dklock==="1";
  const tb=dk.querySelector('button[data-k="team"]');if(tb)tb.hidden=!!s.bare;
 }

 function decorate(){
  const s=CONTENT[G.idx]||{};if(s.bare){root.dataset.urgent="";return;}const app=appOf(s);
  const pane=document.querySelector("#view .pane");
  if(app==="meet"&&pane)meetApp(pane,s);
  if(app==="chat"&&pane)chatApp(pane,s);
  if(app==="mail"){mailApp();mailBar();}
  if(app==="hr"&&pane)hrApp(pane,s);
  const dashOK=app==="dash"&&dashApp();if(app==="dash"&&!dashOK)dashTabs();
  root.dataset.dkfix=(app==="meet"&&pane&&pane.dataset.dk)||(app==="chat"&&pane&&pane.dataset.dk)||(app==="mail"&&document.querySelector("#view .mail"))||(app==="hr"&&pane&&pane.dataset.dk==="hr")||dashOK?app:"";
  if(app==="err"&&pane)errPane(pane,s);
  if(app==="sec"&&pane)secPane(pane,s);
  if(app==="news"&&pane)newsPane(pane,s);
  if(app==="call"&&pane)callPane(pane,s);
  if(app==="lounge"&&pane)loungePane(pane,s);
  {const ex=document.getElementById("dkal");if(ex&&alarmAt!==G.idx)ex.remove();}
  urgentPaint(s);alarm(s);
 }
 window.deskDecorate=decorate;

 /* ---------- 첫 화면: 업무 PC 잠금 화면 ----------
    선택지는 "출근하기"(+이어서 하기) 하나. 과정 안내는 창으로 따로 열고, 화면 테마는 밝게/어둡게 한 개 버튼,
    화면 방식(업무 PC/기본 화면)은 운영자 메뉴로 옮긴다. */
 function isDark(){return root.dataset.skin==="night";}
 function lockScreen(){
  const lp=document.querySelector("#view .lp");if(!lp||lp.dataset.dk)return;lp.dataset.dk="lock";
  root.dataset.dklock="1";
  const hero=lp.querySelector(".lp-hero");const btns=hero&&hero.querySelector(".btns");
  const op=document.querySelector("#view .opmenu");
  const main=btns&&btns.querySelector(".btn.main");const resume=btns&&btns.querySelector(".btn:not(.main)");
  if(main&&!resume)main.textContent="출근하기";
  const L=document.createElement("div");L.className="dkl";
  L.innerHTML=`<div class="dkl-top"><b>퓨쳐테크 워크스페이스</b><span class="sp"></span><button type="button" class="dkl-theme"></button></div>
   <div class="dkl-mid"><p class="dkl-date">1월 첫 주 · 월요일</p><p class="dkl-clock">08:40</p>
    <div class="dkl-card"><span class="dkl-av" aria-hidden="true">나</span><b>신임 팀장</b><span class="dkl-team">퓨쳐테크 헬씨푸드 운영팀 · 30명</span>
     <p class="dkl-lead">어제까지 옆자리 동료였던 사람들이 오늘부터 당신을 팀장이라고 부릅니다. 받은편지함에 여덟 통이 와 있습니다.</p>
     <div class="btns dkl-btns"></div><button type="button" class="dkl-guide-btn">과정 안내 보기</button></div></div>
   <p class="dkl-foot">3라운드 · 1년 · 라운드마다 약 20분 · 정답 없음 · 입력한 내용은 인사 평가와 연결되지 않습니다</p>`;
  const bx=L.querySelector(".dkl-btns");
  if(resume){resume.classList.add("main");if(main)main.classList.remove("main");bx.appendChild(resume);if(main)bx.appendChild(main);}else if(main)bx.appendChild(main);
  if(op){L.querySelector(".sp").replaceWith(op);}
  const tb=L.querySelector(".dkl-theme");const paintT=()=>{tb.textContent=isDark()?"밝은 화면":"어두운 화면";tb.setAttribute("aria-label",isDark()?"밝은 화면으로 바꾸기":"어두운 화면으로 바꾸기");};paintT();
  tb.addEventListener("click",()=>{try{setTheme(isDark()?"food":"night");}catch(e){}paintT();});
  /* 과정 안내 창 */
  const gw=document.createElement("div");gw.className="dkl-gw";gw.hidden=true;gw.setAttribute("role","dialog");gw.setAttribute("aria-modal","true");gw.setAttribute("aria-label","과정 안내");
  gw.innerHTML=`<div class="dkl-win"><div class="dkl-wt"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><b>과정 안내</b><button type="button" class="x">닫기</button></div><div class="dkl-wb"></div></div>`;
  const wb=gw.querySelector(".dkl-wb");
  [...lp.childNodes].forEach(n=>{if(n!==hero)wb.appendChild(n);});
  if(hero){hero.querySelectorAll(".lp-theme").forEach(x=>x.remove());hero.hidden=true;wb.prepend(hero);}
  wb.querySelectorAll(".lp-end .btns").forEach(x=>x.remove());
  const close=()=>{gw.hidden=true;L.querySelector(".dkl-guide-btn").focus();};
  gw.querySelector(".x").addEventListener("click",close);
  gw.addEventListener("click",e=>{if(e.target===gw)close();});
  gw.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
  L.querySelector(".dkl-guide-btn").addEventListener("click",()=>{gw.hidden=false;wb.scrollTop=0;gw.querySelector(".x").focus();});
  lp.append(L,gw);
 }
 function uiMenuItem(){
  const pop=document.querySelector("#view .opmenu .oppop");if(!pop||pop.querySelector(".dk-uiitem"))return;
  const desk=on();
  pop.insertAdjacentHTML("beforeend",`<button class="opitem dk-uiitem" role="menuitem" type="button" onclick="setUI('${desk?"classic":"desk"}')">${desk?"기본 화면으로 보기 (업무 PC 끄기)":"업무 PC 화면으로 보기"}</button>`);
 }

 /* ---------- 그릴 때마다 ---------- */
 const _sh=shell;let lastIdx=null;
 function resetScroll(){if(lastIdx===G.idx)return;lastIdx=G.idx;requestAnimationFrame(()=>{const v=document.getElementById("view");if(v)v.scrollTop=0;document.querySelectorAll("#view .dkm-body,#view .dkc-log,#view .ent-main,#view .bi-main,#view .list,#view .reader").forEach(e=>{e.scrollTop=0;});});}
 shell=function(){const r=_sh.apply(this,arguments);try{resetScroll();root.dataset.dklock="";uiMenuItem();if(on()){lockScreen();mailApp();splitInbox();decorate();}else root.dataset.dkfix="";paintFrame();}catch(e){}return r;};

 /* ---------- 첫 화면: 화면 방식 고르기 ---------- */
 const _r=render;
 render=function(){const r=_r.apply(this,arguments);
  try{uiMenuItem();
   paintFrame();
   const s=CONTENT[G.idx]||{};if(s.bare)toggleTeam(false);
  }catch(e){}
  return r;};
})();
