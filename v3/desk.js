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
 const APPS={mail:"메일",chat:"메신저",meet:"화상 회의",hr:"인사시스템",dash:"팀 대시보드",err:"생산 모니터링 시스템",sec:"보안 센터",news:"사내 속보",lounge:"익명 라운지",note:"업무 노트"};
 const BY_ID={"1-3":"note","1-5":"meet","1-4":"chat","3-1":"hr","R1-pick":"chat","3-4":"meet","3-5":"meet","3-6":"meet","3-8":"sec","3-9":"dash","9-7":"dash",
  "4-2":"hr","4-3":"meet","4-4":"lounge","4-5":"meet","5-4":"meet","6-1":"meet","6-1p":"hr","6-2":"mail","6-3":"chat","6-4a":"news",
  "8-1a":"news","8-1b":"meet","8-1c":"hr","R3-0":"hr","R3-1a":"err","R3-1b":"err","9-4":"news","11-4":"chat",
  "12-3a":"hr","12-3":"hr","12-4":"hr","12-6":"mail","S2":"lounge"};
 window.appOf=function(s){
  if(!s)return "note";const id=String(s.id||"");
  if(s.type==="inbox"||s.mail)return "mail";
  if(/^(ROUND|V3END|FINALE)/.test(id))return "dash";
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
  if(!t){t=document.createElement("div");t.id="dktitle";t.innerHTML='<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><b class="app"></b><span class="sub"></span><button type="button" class="team" aria-expanded="false">팀 보기</button>';win.insertBefore(t,sh);
   t.querySelector(".team").addEventListener("click",()=>toggleTeam());}
  return t;
 }
 function toggleTeam(force){const p=document.getElementById("people");if(!p)return;const o=force==null?!p.classList.contains("dk-open"):!!force;p.classList.toggle("dk-open",o);
  const b=document.querySelector("#dktitle .team");if(b){b.setAttribute("aria-expanded",o?"true":"false");b.textContent=o?"팀 닫기":"팀 보기";}}
 window.toggleTeam=toggleTeam;
 function paintFrame(){
  const t=ensureFrame();if(!t)return;
  const s=CONTENT[G.idx]||{};const app=appOf(s);
  root.dataset.app=on()?app:"";
  t.hidden=!on()||!!s.bare;
  t.querySelector(".app").textContent=APPS[app]||"";
  const sub=[val(s.when)||(G.month?G.month+"월":""),strip(val(s.title)||"")].filter(Boolean).join(" · ");
  t.querySelector(".sub").textContent=sub;
 }
 function val(x){try{return typeof x==="function"?x(G):x;}catch(e){return "";}}
 function strip(x){return String(x||"").replace(/<[^>]+>/g,"");}

 /* ---------- 메뉴바: 시간·토큰·시계는 밖에, 나머지 도구는 메뉴 안으로 ---------- */
 const _db=drawBar;
 drawBar=function(clock){
  const r=_db.apply(this,arguments);
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
  try{if(on()){const sh=document.getElementById("shell");if(sh)sh.style.gridTemplateColumns="minmax(0,1fr)";
   if(live&&typeof LD!=="undefined"){const ch=Object.keys(LD).filter(k=>live[k]).map(k=>`${LD[k].n} ${live[k]>0?"+":""}${live[k]}`);if(ch.length)deskNote("리더 신뢰",ch.join(" · "));}}}catch(e){}
  return r;
 };
 let noteT=null;
 function deskNote(head,text){let n=document.getElementById("dknote");if(!n){n=document.createElement("div");n.id="dknote";n.setAttribute("role","status");document.body.appendChild(n);}
  n.innerHTML=`<b>${head}</b><span>${text}</span>`;n.hidden=false;n.classList.remove("go");void n.offsetWidth;n.classList.add("go");clearTimeout(noteT);noteT=setTimeout(()=>{n.hidden=true;},3200);}
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
  if(!cnt.chat||!cnt.mail){m.dataset.kind=cnt.chat?"chat":"mail";return;}
  let bar=list.querySelector(".dk-tabs");
  if(!bar){bar=document.createElement("div");bar.className="dk-tabs";bar.setAttribute("role","tablist");const h=list.querySelector(".listhead");(h?h.nextSibling:list.firstChild)&&list.insertBefore(bar,h?h.nextSibling:list.firstChild);}
  bar.innerHTML=["mail","chat"].map(k=>`<button type="button" role="tab" data-k="${k}" aria-selected="${tab===k}">${k==="mail"?"메일":"메신저"}${un[k]?` <span class="n">${un[k]}</span>`:""}</button>`).join("");
  bar.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{tab=b.dataset.k;apply();}));
  function apply(){items.forEach(it=>{it.hidden=kind(it)!==tab&&!it.classList.contains("on");});bar.querySelectorAll("button").forEach(b=>b.setAttribute("aria-selected",b.dataset.k===tab?"true":"false"));}
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
 function decorate(){
  const s=CONTENT[G.idx]||{};if(s.bare)return;const app=appOf(s);
  const pane=document.querySelector("#view .pane");
  if(app==="meet"&&pane)meetStrip(pane,s);
  if(app==="hr"&&pane)hrBand(pane,s);
  if(app==="dash")dashTabs();
  if(app==="err"&&pane)errPane(pane,s);
  if(app==="sec"&&pane)secPane(pane,s);
  if(app==="news"&&pane)newsPane(pane,s);
  if(app==="lounge"&&pane)loungePane(pane,s);
 }
 window.deskDecorate=decorate;

 /* ---------- 그릴 때마다 ---------- */
 const _sh=shell;
 shell=function(){const r=_sh.apply(this,arguments);try{if(on()){splitInbox();decorate();}paintFrame();}catch(e){}return r;};

 /* ---------- 첫 화면: 화면 방식 고르기 ---------- */
 const _r=render;
 render=function(){const r=_r.apply(this,arguments);
  try{const th=document.querySelector(".lp-theme");if(th&&!document.querySelector(".lp-ui")){
   th.insertAdjacentHTML("afterend",`<div class="lp-theme lp-ui" role="group" aria-label="화면 방식"><span>화면 방식</span>${UI_MODES.map(([k,n])=>`<button type="button" data-k="${k}" aria-pressed="${root.dataset.ui===k}" onclick="setUI('${k}')">${n}</button>`).join("")}</div>`);}
   paintFrame();
   const s=CONTENT[G.idx]||{};if(s.bare)toggleTeam(false);
  }catch(e){}
  return r;};
})();
