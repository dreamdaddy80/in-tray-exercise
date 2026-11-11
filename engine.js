/* F사 운영팀 첫 해 · 엔진. 원고 내용은 c00.js, c01.js ... 에 있다. */
const LD={rd:{n:"서하준",m:"R&D",h:1},src:{n:"문지원",m:"조달",h:2},mfg:{n:"강태식",m:"생산",h:3},prc:{n:"이수진",m:"가공",h:4},mkt:{n:"정다은",m:"마케팅",h:5}};
const PP={kim:{n:"김 사원",m:"생산",lead:"mfg",h:1},yoon:{n:"윤 책임",m:"조달",lead:"src",h:3},oh:{n:"오 사원",m:"가공",lead:"prc",h:5},han:{n:"한 선임",m:"마케팅",lead:"mkt",h:2},cha:{n:"차 선임",m:"R&D",lead:"rd",h:4},bae:{n:"배 책임",m:"생산",lead:"mfg",h:3},anon:{n:"○ 사원",m:"",lead:"mfg",h:2}};
const ALLY={rd:"mkt",mkt:"rd",mfg:"src",src:"mfg"};
const FOE={mfg:["prc"],prc:["mfg","mkt"],mkt:["prc"],rd:["src"],src:["rd"]};
const SCORES=["성과","재무","사람","안정"];
const QUARTER_TIME=[16,17,20,20];
const SAVE_KEY="ftm_game_v2";
const AX={"①":1,"②":2,"③":3,"④":4};
const HAIR={
 1:c=>`<path d="M12 22c0-10 6-15 13-15s12 6 12 15c-3-5-7-7-12-7-5 1-10 3-13 7z" fill="${c}"/>`,
 2:c=>`<path d="M11 40V20C11 11 17 6 24 6s13 5 13 14v20h-5V21c-3-3-5-6-7-8-3 4-7 7-9 8v19z" fill="${c}"/>`,
 3:c=>`<path d="M13 20c-1-8 5-13 11-13s12 4 11 13c-2-3-3-5-4-5H17c-1 0-2 2-4 5z" fill="${c}"/>`,
 4:c=>`<path d="M12 28c-2-13 5-21 12-21s14 8 12 21c-1-6-3-10-6-13-5 2-11 3-14 3-2 3-3 6-4 10z" fill="${c}"/>`,
 5:c=>`<path d="M12 22C12 11 18 6 25 6c6 0 12 5 11 15-5-1-10-4-12-8-1 4-6 8-12 9z" fill="${c}"/>`};
const name=k=>(LD[k]||PP[k]).n;
const ENDKEY={"10-3":"yoon","10-6":"oh","11-3":"han","11-4":"mfg","11-5":"kim","11-7":"cha"};
const PROM_MEMBER={P2:"kim",P4:"bae",P5:"cha",P6:"oh",P7:"han"};
const cell=(g,k)=>g.cells?g.cells[k]:0;
const promIs=(g,id,s)=>g.prom[id]&&g.prom[id].status===s;
const storyN=(g,k,s)=>(g.story[k]||[]).filter(x=>x===s).length;
const isGone=k=>({yoon:G.f.yoon_end_left,oh:G.f.oh_end_left,han:G.f.han_left,cha:G.f.cha_left||G.f.cha_end_gone})[k];

function face(k,t){
 const mood=t==null?0:t>=66?1:t<=35?-1:0;
 const m=mood>0?"M18 31q6 6 12 0":mood<0?"M18 34q6-6 12 0":"M19 32h10";
 const b=mood<0?'<path d="M15 19l6 2M33 19l-6 2" stroke="var(--face-line)" stroke-width="1.6" stroke-linecap="round"/>':"";
 const p=LD[k]||PP[k];
 const col=LD[k]?`var(--h${p.h})`:"var(--muted)";
 return `<svg viewBox="0 0 48 48" role="img" aria-label="${p.n}"><circle cx="24" cy="24" r="24" fill="var(--tile)"/><circle cx="24" cy="25" r="14" fill="var(--skin)"/>${HAIR[p.h](col)}<circle cx="19" cy="24" r="1.7" fill="var(--face-line)"/><circle cx="29" cy="24" r="1.7" fill="var(--face-line)"/>${b}<path d="${m}" stroke="var(--face-line)" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>`;
}

/* ---------- 상태 ---------- */
function newGame(){return{
 idx:0,month:0,quarter:0,time:QUARTER_TIME[0],ot:0,burnout:0,
 trust:{rd:50,src:50,mfg:50,prc:50,mkt:50},score:{성과:50,재무:50,사람:50,안정:50},fsat:50,fexp:50,fexpLog:[],safe:50,
 f:{},sig:[],rumors:0,big:0,over:0,bill:{},prom:{},rets:[],decisions:[],ach:[],written:{},diag:null,pledge:"",prio:[],story:{},seen:0,sound:true,
 tu:{exp:0,meet:0,all:0},tokSpent:[0,0,0,0],nextQ:0,
 token:null,tokenCap:null,cells:null,ends:{},unsent:[],toldAll:{full:0,none:0},wrote:{},concl:0,grades:{},nextMult:undefined,chain:[],
 token_:0,pub:[],cons:[],told:{full:0,none:0,total:0},ent:{},delegWin:0,shared:0,pulse:[],fatigue:0,broken:0,goal2:null,quality:null,bills:[]};}
let G=newGame();
const CONTENT=[];
const addContent=list=>CONTENT.push(...list);
const has=f=>!!G.f[f];
const val=(v,...a)=>typeof v==="function"?v(G,...a):v;

function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(G));}catch(e){}}
function load(){try{const s=localStorage.getItem(SAVE_KEY);return s?JSON.parse(s):null;}catch(e){return null;}}
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}

/* ---------- 효과 문법: "성과+3 prc-4 `fam_direct` 안전+2 소문1 큰변화1 초과부하1 B1+15 F사만족+2 이야기:oh+" ---------- */
function setTrust(k,d,live){if(!d)return;G.trust[k]=Math.max(0,Math.min(100,G.trust[k]+d));live[k]=(live[k]||0)+d;}
function applyFx(str,ctx={}){
 const live=ctx.live||{};
 if(!str)return live;
 const re=/`([^`]+)`|([^\s·]+)/g;let m;
 while((m=re.exec(str))){
  if(m[1]){if(m[1][0]==="~")delete G.f[m[1].slice(1)];else{const nw=!G.f[m[1]];G.f[m[1]]=true;if(nw&&FEXP[m[1]]){const d=FEXP[m[1]][0];G.fexp=Math.max(0,Math.min(100,(G.fexp??50)+d));(G.fexpLog=G.fexpLog||[]).push({m:G.month,d,t:FEXP[m[1]][1]});live.F사기대=(live.F사기대||0)+d;}}continue;}
  const t=m[2].replace(/−/g,"-");let x;
  const sc=v=>{if(v>0&&ctx.pos)v=Math.round(v*ctx.pos);if(v<0&&ctx.neg)v=Math.round(v*ctx.neg);return v;};
  if((x=t.match(/^⏳([+-]\d+)$/)))G.time=Math.max(0,G.time+ +x[1]);
  else if((x=t.match(/^다음분기⏳([+-]\d+)$/)))G.nextQ=(G.nextQ||0)+ +x[1];
  else if((x=t.match(/^토큰=(\d+)$/))){G.token=+x[1];G.tokenCap=+x[1];}
  else if((x=t.match(/^토큰([+-]\d+)$/)))G.token=Math.max(0,(G.token||0)+ +x[1]);
  else if((x=t.match(/^(rd|src|mfg|prc|mkt)([+-]\d+)$/))){
   const k=x[1];let v=sc(+x[2]);
   if(v<0&&ctx.mult)v=Math.round(v*ctx.mult);
   if(v<0&&ctx.addNeg)v-=ctx.addNeg;
   if(v>0&&k==="rd"&&G.f.cha_left&&G.month>=10)v=Math.ceil(v/2);
   setTrust(k,v,live);
   if(ALLY[k]&&!(G.f.ally_broken&&(k==="mfg"||k==="src")))setTrust(ALLY[k],Math.trunc(v/2),live);
   if(v>0&&FOE[k])FOE[k].forEach(p=>setTrust(p,-Math.round(v*.3*(ctx.foe2?2:1)),live));
  }else if((x=t.match(/^(성과|재무|사람|안정)([+-]\d+)$/))){let v=sc(+x[2]);if(v>0&&x[1]==="성과"&&G.f.cha_left&&G.month>=10&&ctx.rel==="rd")v=Math.ceil(v/2);G.score[x[1]]=Math.max(0,Math.min(100,G.score[x[1]]+v));}
  else if((x=t.match(/^F사만족([+-]\d+)$/)))G.fsat=Math.max(0,Math.min(100,G.fsat+sc(+x[1])));
  else if((x=t.match(/^안전([+-]\d+)$/)))G.safe=Math.max(0,Math.min(100,G.safe+sc(+x[1])));
  else if(t==="소문규칙"){if(Math.random()<.4){G.rumors++;G.safe=Math.max(0,G.safe-2);if(ctx.rel)setTrust(ctx.rel,-3,live);}}
  else if((x=t.match(/^칸:(RUN|AI|GROW|SEC)-(\d+)$/))){const n=+x[2];if(!G.cells){G.over++;}else{if(G.cells[x[1]]<n)G.over++;G.cells[x[1]]=Math.max(0,G.cells[x[1]]-n);}}
  else if((x=t.match(/^재무피해-(\d+)$/))){let d=+x[1]+(G.cells&&G.cells.SEC>=3?-1:0)+(G.cells&&G.cells.SEC<=1?1:0);d=Math.max(0,d);if(G.f.planb_contract)d=Math.ceil(d/2);G.score.재무=Math.max(0,G.score.재무-d);}
  else if((x=t.match(/^소문(\d+)$/))){G.rumors+=+x[1];G.safe=Math.max(0,G.safe-2* +x[1]);if(ctx.rel)setTrust(ctx.rel,-3* +x[1],live);}
  else if((x=t.match(/^큰변화(\d+)$/)))G.big+=+x[1];
  else if((x=t.match(/^초과부하(\d+)$/)))G.over+=+x[1];
  else if((x=t.match(/^(B\d+)([+-]\d+)$/)))G.bill[x[1]]=(G.bill[x[1]]||0)+ +x[2];
  else if((x=t.match(/^이야기:(\w+)([+-])$/)))(G.story[x[1]]=G.story[x[1]]||[]).push(x[2]);
  else console.warn("알 수 없는 효과",t);
 }
 return live;
}
function applySig(s,w,scene,choice){
 if(!s)return;
 const n=/×2/.test(s)?2:1;
 (s.match(/[①②③④][LP]/g)||[]).forEach(x=>{for(let i=0;i<n;i++)G.sig.push({a:AX[x[0]],s:x[1],w,scene,choice});});
}
function addPromise(p){G.prom[p.id]={...p,status:"진행 중"};toast("약속 장부에 기록했습니다.");}
function ach(n){if(G.ach.includes(n))return;G.ach.push(n);toast("업적: "+n);beep(880,.08);}
function record(scene,choice){G.decisions.push({scene,choice,month:G.month});}

/* ---------- 소리 ---------- */
let AC=null;
function beep(f,d,type){if(!G.sound)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type||"sine";o.frequency.value=f;g.gain.value=.04;g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.connect(g).connect(AC.destination);o.start();o.stop(AC.currentTime+d);}catch(e){}}

/* ---------- 화면 공통 ---------- */
const $=id=>document.getElementById(id);
const VIEW=()=>$("view");
let H={},hN=0,CLOCK=null,toastT=null;
function A(fn){const k="h"+(hN++);H[k]=fn;return `data-a="${k}"`;}
function paint(html){if(html===""){H={};hN=0;}return html;}
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b||b.disabled)return;const fn=H[b.dataset.a];if(fn){beep(420,.03,"triangle");fn(e);}});
function toast(t){const el=$("toast");el.textContent=t;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>el.hidden=true,2600);}

function drawSide(live){
 const p=$("people"),s=CONTENT[G.idx];
 p.hidden=!!(s&&s.bare);
 $("shell").style.gridTemplateColumns=p.hidden?"minmax(0,1fr)":"";
 if(p.hidden)return;
 p.innerHTML=`<div><div class="label">모듈 리더</div><div class="leaders">${Object.keys(LD).map(k=>{const d=live&&live[k];
  return `<div class="ld">${face(k,G.trust[k])}<div><b>${LD[k].n} <span class="num" style="font-weight:400;color:var(--muted)">${G.trust[k]}</span></b><small>${LD[k].m}</small><div class="tb"><i style="width:${G.trust[k]}%"></i></div></div>${d?`<span class="delta ${d>0?"up":"down"}">${d>0?"+":""}${d}</span>`:""}</div>`}).join("")}</div></div>
 <div><div class="label">성적표</div><div class="cards">${(()=>{const l=(G.mon||[]).slice(-1)[0];return l?`<div class="card"><span>보고된 이슈·아차</span><b>${l.rep}</b><em>${l.m}월</em></div>`:"";})()}${SCORES.map(k=>`<div class="card"><span>${k}</span><b>${G.score[k]}</b>${k==="성과"?`<em>F사 만족 ${G.fsat}${live&&live.F사기대?"":""}</em><em title="F사가 기대하는 수준. 분기 말에 안정 점수와 비교합니다.">F사 기대 ${G.fexp??50}${live&&live.F사기대?` <span class="delta ${live.F사기대>0?"down":"up"}" style="position:static">${live.F사기대>0?"+":""}${live.F사기대}</span>`:""}</em>`:""}</div>`).join("")}</div></div>`;
}
function drawBar(clock){
 const s=CONTENT[G.idx]||{};
 $("bar").hidden=!!s.bare;
 if(s.bare)return;
 $("when").textContent=val(s.when)||(G.month?G.month+"월":"");
 $("months").innerHTML=Array.from({length:12},(_,i)=>`<i class="${i+1<G.month?"past":i+1===G.month?"now":""}"></i>`).join("");
 const c=clock==null?"":`<div class="clock ${clock<=30?"hot":""}" aria-label="남은 시간">${Math.floor(clock/60)}:${String(clock%60).padStart(2,"0")}</div>`;
 const n=Object.keys(G.prom).length;
 H.__led=openLedger;H.__snd=()=>{G.sound=!G.sound;drawBar(clock);};
 $("res").innerHTML=`<div class="r ${G.ot?"over":""}">팀장 시간 <b>${G.time}</b>${G.ot?` 야근 ${G.ot}`:""}</div><div class="r">토큰 <b>${G.token==null?"—":G.token}</b></div><div class="r">여력 <b>${G.cells?"배분됨":"4월"}</b></div>${c}<button class="tool" data-a="__led">장부 ${n}</button><button class="tool" data-a="__snd">소리 ${G.sound?"켜짐":"꺼짐"}</button>`;
}
function openLedger(){
 const m=$("modal");const ps=Object.values(G.prom);
 const close=()=>{m.hidden=true;};
 const k1="led_close";H[k1]=close;
 m.innerHTML=`<div class="sheet"><h2 style="font-size:19px">약속 장부</h2><div class="ledger">${ps.length?ps.map(p=>`<div>${p.text}<small>상대: ${p.to} · 기한: ${p.due} · ${p.status}</small></div>`).join(""):'<p class="note">아직 약속한 것이 없습니다.</p>'}</div>
 <h2 style="font-size:19px">규정 요약</h2><div class="prose" style="font-size:14.5px">${RULES.map(r=>`<p>${r}</p>`).join("")}</div>
 <div class="btns"><button class="btn" data-a="${k1}">닫기</button></div></div>`;
 m.hidden=false;
}
function shell(html,live,clock){VIEW().innerHTML=html;drawSide(live);drawBar(clock);}
function next(){
 clearInterval(CLOCK);CLOCK=null;G.idx++;
 const s=CONTENT[G.idx];
 if(s){if(s.month&&s.month!==G.month)G.month=s.month;}
 save();render();window.scrollTo(0,0);
}
function render(){
 const s=CONTENT[G.idx];
 if(!s){G.idx=CONTENT.length-1;return;}
 if(s.month)G.month=s.month;
 if(s.skip&&s.skip(G)){next();return;}
 paint("");
 SCENES[s.type](s);
}
const sayHtml=(who,t)=>`<div class="say">${face(who,LD[who]?G.trust[who]:null)}<div><b>${name(who)}</b><p class="voice">${t}</p></div></div>`;
const head=(s)=>`<div class="eyebrow">${[s.tag,val(s.when)].filter(Boolean).join(" · ")}</div><h2>${val(s.title)}</h2>`;
const para=a=>a.map(x=>val(x)).filter(Boolean).map(x=>`<p>${x}</p>`).join("");
function condLines(s){const l=(s.conds||[]).filter(c=>c.c(G)).map(c=>val(c.t));return l.length?`<div class="cond">${l.map(x=>`<span>${x}</span>`).join("")}</div>`:"";}

/* ---------- 장면 ---------- */
const SCENES={
 title(s){
  const old=load();
  shell(paint(`<div class="title-card"><div class="eyebrow">신임 팀장 In-Tray 시뮬레이션</div><h1>${s.title}</h1><div class="prose">${para(s.body)}</div>
  ${old&&old.h2_focus&&old.idx>0?`<div class="happen"><span class="label">지난번에 고른 바꿀 습관</span>${["","① 일 맡기기","② 평가하기","③ 자원 나누기","④ 설명하기"][old.h2_focus]}<br><span class="label">다시 한다면</span>${old.written&&old.written.again?old.written.again.행동:""}</div>`:""}
  <div class="btns"><button class="btn main" ${A(()=>{G=newGame();clearSave();next();beep(520,.1);})}>처음부터 시작</button>${old&&old.idx>0?`<button class="btn" ${A(()=>{G=old;render();})}>이어서 하기${old.month?` (${old.month}월)`:""}</button>`:""}</div>
  <button class="tool" style="justify-self:start" ${A(()=>{G=newGame();G.idx=CONTENT.findIndex(x=>x.id==="1-1")-1;G.pledge="(검토용 건너뛰기)";G.prio=["성과","사람"];next();})}>프롤로그 건너뛰기 (검토용)</button></div>`));
 },
 doc(s){
  shell(paint(`<div class="pane">${head(s)}<div class="prose">${val(s.html)}</div><div class="foot"><span class="note">${s.page||""}</span><button class="btn main" ${A(next)}>${s.btn||"다음"}</button></div></div>`));
 },
 note(s){
  shell(paint(`<div class="pane"><div class="eyebrow">📘 ${s.tag}</div><h2>${s.title}</h2><div class="prose">${para(s.body)}<p><b>${s.q}</b></p></div><div class="foot"><span></span><button class="btn main" ${A(next)}>${s.btn||"다음"}</button></div></div>`));
 },
 diag(s){
  const a={};G.diagSide=G.diagSide||s.items.map(()=>Math.random()<.5);const sw=G.diagSide;
  const lab=["가에 가깝다","조금 가 쪽","조금 나 쪽","나에 가깝다"];
  const draw=()=>{paint("");const done=Object.keys(a).length===s.items.length;
   shell(`<div class="pane">${head(s)}<div class="prose">${para(s.intro)}</div><div>${s.items.map((it,i)=>{const L=sw[i]?it.y:it.x,R=sw[i]?it.x:it.y;return `<div class="likert"><div><b style="font-weight:600">${i+1}.</b> ${it.sc}<span style="display:block;margin-top:6px;color:var(--ink);font-size:14.5px"><b>가</b> ${L}</span><span style="display:block;color:var(--ink);font-size:14.5px"><b>나</b> ${R}</span></div><div class="scale">${lab.map((o,v)=>`<button aria-pressed="${a[i]===v}" ${A(()=>{a[i]=v;draw();})}>${o}</button>`).join("")}</div></div>`}).join("")}</div>
   <div class="foot"><span class="note num">${Object.keys(a).length}/${s.items.length}</span><button class="btn main" ${done?"":"disabled"} ${A(()=>{
    const ax={1:[],2:[],3:[],4:[]};s.items.forEach((it,i)=>{const toR=a[i];/* 0=가 쪽 강, 3=나 쪽 강 */const lead=sw[i]?3-toR:toR;ax[it.a].push(lead);});
    G.diag={};for(const k in ax)G.diag[k]=Math.round(ax[k].reduce((x,y)=>x+y,0)/(ax[k].length*3)*100);next();})}>완료</button></div></div>`);};
  draw();
 },
 pledge(s){
  let txt=G.pledge||"",pr=[...G.prio];
  const draw=()=>{paint("");const ok=readable(txt,12).ok&&pr.length===2;
   shell(`<div class="pane">${head(s)}<div class="prose">${para(s.intro)}</div>
   <label class="label" for="pl">나는 이런 팀장이 되겠다 (20자 이상)</label><textarea id="pl">${txt}</textarea>
   <div class="prose" style="font-size:15px"><p>${s.prioText}</p></div>
   <div class="btns">${SCORES.map(k=>`<button class="btn ${pr.includes(k)?"main":""}" ${A(()=>{const t=$("pl").value;txt=t;const i=pr.indexOf(k);if(i>=0)pr.splice(i,1);else if(pr.length<2)pr.push(k);draw();})}>${k}${pr.indexOf(k)>=0?" "+(pr.indexOf(k)+1)+"위":""}</button>`).join("")}</div>
   <div class="foot"><span class="note num" id="plc">${txt.trim().length}자</span><button class="btn main" id="pgo" ${ok?"":"disabled"} ${A(()=>{G.pledge=$("pl").value.trim();G.prio=pr;next();})}>임명장 받기</button></div></div>`);
   $("pl").oninput=e=>{txt=e.target.value;$("plc").textContent=txt.trim().length+"자";$("pgo").disabled=!(readable(txt,12).ok&&pr.length===2);};};
  draw();
 },
 inbox(s){SC_INBOX(s);},
 choice(s){SC_CHOICE(s);},
 tasks(s){SC_TASKS(s);},
 interview(s){SC_INTERVIEW(s);},
 med(s){SC_MED(s);},
 returns(s){SC_RETURNS(s);},
 kpi(s){SC_KPI(s);},
 pulse(s){SC_PULSE(s);},
 branch(s){const i=s.pick(G);G.cases=G.cases||{};G.cases[s.id]=i;const c=s.cases[i];if(!c){next();return;}if(c.note){shell(paint(`<div class="pane"><div class="eyebrow">일어난 일</div><h2>${c.title}</h2><div class="prose">${para(c.intro||[])}</div><div class="foot"><span></span><button class="btn main" ${A(()=>{if(c.onDone)c.onDone(G);next();})}>다음</button></div></div>`));return;}SC_CHOICE(c);},
 alloc(s){SC_ALLOC(s);},write(s){SC_WRITE(s);},review(s){SC_REVIEW(s);},bills(s){SC_BILLS(s);},evalc(s){SC_EVAL(s);},appeal(s){SC_APPEAL(s);},finale(s){SC_FINALE(s);},
 monthEnd(s){
  if(s.onEnd&&!G.ent[s.id]){G.ent[s.id]=1;s.onEnd(G);if(s.quarter)endQuarter();save();}
  if(!(G.monRec||{})[s.month]){recordMonth(s.month);save();}
  const mr=(G.mon||[]).find(x=>x.m===s.month),mp=(G.mon||[]).find(x=>x.m===s.month-1);
  shell(paint(`<div class="pane"><div class="eyebrow">${s.month}월</div><h2>${val(s.title)}</h2>${mr?`<div class="card" style="display:flex;justify-content:space-between;gap:12px;margin:8px 0"><span style="font-size:14px;color:var(--ink)">이번 달 보고된 이슈·아차 사례</span><b class="num">${mr.rep}건${mp?` <span class="note">(지난달 ${mp.rep}건)</span>`:""}</b></div>`:""}${s.quarter&&G.lastQ?qSummary(G.lastQ):""}${agendaHtml(s.month)}<p class="note">💾 ${s.month}월까지 저장했습니다. 지금 창을 닫아도 다음에 첫 화면의 "이어 하기"로 ${s.month+1<=12?s.month+1+"월부터":"결산부터"} 계속할 수 있습니다.</p><div class="foot"><span></span><button class="btn main" ${A(next)}>${s.btn||"다음 달로"}</button></div></div>`));
 },
 buildEnd(s){
  const sigs={1:{L:0,P:0},2:{L:0,P:0},3:{L:0,P:0},4:{L:0,P:0}};G.sig.forEach(x=>sigs[x.a][x.s]+=x.w);
  const dev={안전:G.safe,소문:G.rumors,변화피로:G.fatigue,초과부하:G.over,번아웃:G.burnout,축별신호:sigs,청구서가중:G.bill,되돌아올일:G.rets,공개기준:G.pub,목표2:G.goal2,기준의질:G.quality,일관성:G.cons,펄스:G.pulse,수익체인:G.chain,플래그:Object.keys(G.f),자가진단:G.diag};
  shell(paint(`<div class="pane"><div class="eyebrow">구현 진행 중</div><h2>${s.title}</h2><div class="prose"><p>${s.body}</p></div>
  <details class="ref"><summary>검토용: 숨은 값 보기</summary><pre class="dev">${JSON.stringify(dev,null,1)}</pre></details>
  <details class="ref"><summary>검토용: 사람 채점에 들어갈 서술 보기</summary><pre class="dev">${JSON.stringify({다짐:G.pledge,우선순위:G.prio,핵심과제:G.written.tasks,KPI기준:G.written.kpi},null,1)}</pre></details>
  <div class="foot"><span class="note">업적 ${G.ach.join(", ")||"없음"}</span><button class="btn" ${A(()=>{clearSave();G=newGame();render();window.scrollTo(0,0);})}>처음으로</button></div></div>`));
 }
};

/* 받은편지함 */
function SC_INBOX(s){
 const mailAll=s.mail;
 s=Object.assign({},s,{mail:mailAll.filter(m=>m.need==null||G.safe>=m.need)});
 mailAll.forEach(m=>{if(s.mail.includes(m))G.f["got_"+m.id]=true;else if(m.unsent&&!G.unsent.includes(m.unsent))G.unsent.push(m.unsent);});
 if(s.onStart)s.onStart(G,s);
 const st=CONTENT[G.idx]._st={sel:null,opened:{},done:{},mode:null,to:null,four:false,left:val(s.seconds),over:false,direct:0,replies:0,holds:0,ord:{},settled:false};
 G.seen=0;
 const startClock=()=>{if(CLOCK||st.over)return;CLOCK=setInterval(()=>{st.left--;if(st.left<=0){st.left=0;expire();}drawBar(st.left);},1000);};
 const expire=()=>{clearInterval(CLOCK);CLOCK=null;st.over=true;beep(240,.3,"square");if(typeof aiInboxExpire==="function")aiInboxExpire(s,st);
  s.mail.forEach(m=>{if(!st.done[m.id]){const r=resolveRow(m.hold);st.done[m.id]=r[0];applyFx(r[1],{rel:m.rel});G.f["h_"+m.id]=true;st.holds++;record(m.id,"시간 초과(보류)");}});
  draw();};
 const resolveRow=r=>typeof r==="function"?r(st.opened):r;
 const finish=(m,row,kind,to)=>{
  const r=resolveRow(row),[text,fx,sig,o]=r;
  st.done[m.id]=text;const live=applyFx(fx,{rel:m.rel});
  applySig(sig,.5,m.id,kind==="직접"?(o&&o.rk)||(/①P/.test(sig||"")?"직접":/①L/.test(sig||"")?"코칭":"답장"):kind);record(m.id,(kind==="직접"?((o&&o.rk)||(/①P/.test(sig||"")?"직접":/①L/.test(sig||"")?"코칭":"답장")):kind)+(to?":"+name(to):""));
  const rk=kind==="직접"?((o&&o.rk)||(/①P/.test(sig||"")?"직접":/①L/.test(sig||"")?"코칭":"답장")):kind;if(kind==="직접"){G.f["r_"+m.id]=true;if(rk==="직접"&&!(o&&o.nod))G.f["d_"+m.id]=true;}else G.f[(kind==="보류"?"h_":"del_")+m.id]=true;if(kind==="직접")st.replies++;if(kind==="보류")st.holds++;
  if(rk==="직접")st.direct++;
  if(kind==="위임"){let p=10+((o&&o.ret)||0);if(st.four)p=Math.max(0,p-15);G.rets.push({id:m.id,p,to,four:st.four});G.ds=G.ds||{f:0,p:0,bf:0,bp:0};if(st.four)G.ds.f++;else G.ds.p++;}
  if(o&&o.pr)addPromise(o.pr);
  st.mode=null;st.to=null;st.four=false;
  ach("첫 출근");beep(620,.05);
  draw(live);
 };
 const draw=live=>{
  paint("");
  const m=s.mail.find(x=>x.id===st.sel),nd=Object.keys(st.done).length,all=nd===s.mail.length;
  const items=s.mail.map(x=>{const d=st.done[x.id];
   return `<button class="item ${x.id===st.sel?"on":""} ${st.opened[x.id]?"read":""} ${d?"done":""}" ${A(()=>{st.sel=x.id;st.opened[x.id]=true;G.f["opened_"+x.id]=true;st.mode=null;st.to=null;st.four=false;startClock();draw();})}><span class="top"><span class="tag ${x.t}">${x.t}</span>${x.from}<span class="num" style="margin-left:auto">${x.at}</span></span><span class="sub">${x.sub}</span>${d?`<span class="what">${d}</span>`:""}</button>`}).join("");
  let r;
  if(!m){
   if(st.over||all){const bill=inboxSettle(st);r=`<div class="rhead"><h2>${st.over?"10시입니다. 스탠드업이 시작됐습니다.":s.quiet&&s.quiet(G)?"10시 전에 받은편지함이 비었습니다.":"10시 전에 모두 처리했습니다."}</h2><p>${st.over?"처리하지 못한 메시지는 보류로 남았습니다.":""}</p>${bill}</div><div class="btns"><button class="btn main" ${A(()=>{if(!st.direct)ach("손을 떼는 법");next();})}>스탠드업으로</button></div>`;}
   else r=`<div class="rhead"><h2>${s.title}</h2><p>${s.lead}</p></div>`;
  }else{
   const d=st.done[m.id],person=m.t==="DM";
   r=`<button class="back" ${A(()=>{st.sel=null;draw();})}>← 목록</button><div class="rhead"><h2>${m.sub}</h2><p>${m.from} · <span class="num">${m.at}</span></p></div><div class="body"><p class="${person?"voice":""}">${m.body}</p>${m.attach?`<p class="attach">${m.attach}</p>`:""}</div>`;
   if(d){r+=`<div class="happen"><span class="label">일어난 일</span>${d}</div>`;
    if(st.over||all)r+=`${inboxSettle(st)}<div class="btns"><button class="btn main" ${A(()=>{if(!st.direct)ach("손을 떼는 법");next();})}>스탠드업으로</button></div>`;}
   else if(!st.over&&typeof AIREP!=="undefined"&&AIREP[m.id]&&!(st.vdone||{})[m.id]){r+=aiInbox(m,st,()=>draw());}
   else if(!st.over){
    r+=`<div class="ask">`;
    if(st.mode==="del"){
     r+=`<div class="label">누구에게 맡길까요?</div><div class="pick">${Object.keys(LD).map(k=>`<button aria-pressed="${st.to===k}" ${A(()=>{st.to=k;draw();})}>${face(k,G.trust[k])}${LD[k].n}</button>`).join("")}</div>
     <label class="chk"><input type="checkbox" id="four" ${st.four?"checked":""}><span>기대 결과·기한·권한·이유를 함께 전달한다<small>메시지를 쓰는 데 ${IBT.four}초가 더 듭니다.</small></span></label>
     <div class="btns"><button class="btn main" ${st.to&&st.left>IBT.del+(st.four?IBT.four:0)?"":"disabled"} ${A(()=>{spend(st,IBT.del+(st.four?IBT.four:0));finish(m,(m.to&&m.to[st.to])||m.other,"위임",st.to);})}>맡기기 · ${IBT.del+(st.four?IBT.four:0)}초</button><button class="btn" ${A(()=>{st.mode=null;st.to=null;draw();})}>취소</button></div>`;
    }else if(st.mode==="reply"){const reps=replyOpts(m,st);
     r+=`<div class="label">어떻게 답할까요? <span class="note">답장 하나에 ${IBT.reply}초</span></div><div class="opts">${reps.map((x,i)=>`<button class="opt" ${A(()=>{spend(st,IBT.reply);const row=x.self?m.self:x.r;const rr=typeof row==="function"?row(st.opened):row;finish(m,[rr[0],rr[1],rr[2],{...(rr[3]||{}),nod:x.d===false,rk:x.rk}],"직접");})}><span class="k">${"ABCD"[i]}</span><span>${x.t}</span></button>`).join("")}</div><div class="btns"><button class="btn" ${A(()=>{st.mode=null;draw();})}>취소</button></div>`;}
    else{const low=k=>st.left<=IBT[k];
     r+=`<div class="btns"><button class="btn" ${low("reply")?"disabled":""} ${A(()=>{if(REPLIES[m.id]){st.mode="reply";draw();}else{spend(st,IBT.reply);finish(m,m.self,"직접");}})}>직접 답장 · ${IBT.reply}초</button>${m.noDel?"":`<button class="btn" ${low("del")?"disabled":""} ${A(()=>{st.mode="del";draw();})}>위임 · ${IBT.del}초~</button>`}<button class="btn" ${A(()=>finish(m,m.hold,"보류"))}>보류</button></div><p class="note">보류한 메시지는 오늘 아무도 처리하지 않습니다. 보류가 3건을 넘으면 밀린 일이 팀장 시간과 안정에서 빠집니다.${low("reply")?" 남은 시간이 직접 답장에 모자랍니다.":""}</p>`;}
    r+=`</div>`;
   }
  }
  shell(`<div class="mail ${m?"open":""}"><div class="list"><div class="listhead"><span>받은편지함</span><span class="num">${nd}/${s.mail.length} 처리</span></div>${items}</div><div class="reader">${r}</div></div>`,live,st.left);
  const f=$("four");if(f)f.onchange=e=>{st.four=e.target.checked;};
 };
 draw();
}

/* 선택 장면: 결정 → (근거 → 알리기) → 일어난 일 */
function partialLinkF(o,L,c,on,pick){return c>1&&G.time>=1?`<div style="padding-left:32px"><button class="link" aria-pressed="${on}" ${A(pick)}>${L}안을 줄여서 하기: 남은 ⏳${Math.max(1,G.time)}${jo(Math.max(1,G.time),"을","를")} 쓰고, 계획의 일부만 합니다. 좋은 효과는 절반입니다${on?" (선택됨)":""}</button></div>`:"";}
function borrowLink(lack,redraw){return G.ot+lack<=3?`<div style="padding-left:32px"><button class="link" ${A(()=>{G.ot+=lack;G.time+=lack;G.burnout+=lack;beep(200,.12,"sawtooth");redraw();})}>야근 ${lack}${jo(lack,"을","를")} 빌려서 고를 수 있게 하기</button></div>`:"";}
const TELL=[{id:"full",t:"기준과 근거를 설명한다",c:2},{id:"short",t:"결과만 간단히 알린다",c:1},{id:"none",t:"따로 알리지 않는다",c:0}];
function SC_CHOICE(s,opt={}){
 if(s.enter&&!G.ent[s.id]){G.ent[s.id]=1;applyFx(val(s.enter),{rel:s.rel});}
 const mult=opt.mult||G.nextMult||undefined;
 const KEY=isKey(s);let sel=null,why=null,tell=null,partial=false,consNote="",step=s.prep&&!G.ent[s.id+":p"]?"prep":"opt";
 const opts=val(s.options),O=()=>opts.find(o=>o.k===sel);
 G.ord=G.ord||{};if(!G.ord[s.id]||G.ord[s.id].length!==opts.length||!opts.every(o=>G.ord[s.id].includes(o.k))){const ks=opts.map(o=>o.k);for(let i=ks.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ks[i],ks[j]]=[ks[j],ks[i]];}G.ord[s.id]=ks;}
 const shown=G.ord[s.id].map(k=>opts.find(o=>o.k===k));
 const partialLink=(o,L,c)=>partialLinkF(o,L,c,sel===o.k&&partial,()=>{sel=o.k;partial=true;draw();});
 if(s.pre)s.pre(G);
 const top=()=>`${head(s)}${s.top?val(s.top):""}<div class="prose">${para(s.intro||[])}</div>${(val(s.say)||[]).map(x=>sayHtml(x[0],val(x[1]))).join("")}${condLines(s)}${s.ref?`<details class="ref"><summary>참고 카드</summary><p style="margin-top:6px">${s.ref}</p></details>`:""}`;
 const draw=()=>{paint("");
  if(step==="prep"){
   const pick=(share)=>{G.ent[s.id+":p"]=1;let live={};if(share){G.time-=1;G.tu.all+=1;G.tu.exp+=1;G.shared++;live=applyFx(s.rel+"+2");applySig("④L",1,s.id,"기준 먼저 공유");}step="opt";drawSide(live);draw();};
   const short=G.time<1;
   shell(`<div class="pane">${head(s)}<p><b>면담 전에 어떻게 할까요?</b></p><div class="opts"><button class="opt" ${short?"disabled":""} ${A(()=>pick(true))}><span class="k">·</span><span>기준 문서를 먼저 보내고 의견을 묻는다</span><span class="cost">⏳1</span></button>${short?borrowLink(1,draw):""}<button class="opt" ${A(()=>pick(false))}><span class="k">·</span><span>면담 자리에서 바로 이야기한다</span><span class="cost"></span></button></div></div>`);
  }else if(step==="opt"){
   shell(`<div class="pane">${top()}${s.ask?`<p><b>${s.ask}</b></p>`:""}
   <div class="opts">${shown.map((o,i)=>{const c=val(o.cost)||0,short=c>G.time,lack=c-G.time,tk=o.tok&&(G.token||0)<o.tok,dis=(o.dis&&o.dis(G))||(tk?`토큰이 모자랍니다. (${o.tok} 필요)`:"");const tag=[c?"⏳"+c:"",o.tok?"💳"+o.tok:"",o.tagText||""].filter(Boolean).join(" ");const L="ABCD"[i];
    if(KEY&&short&&!dis)return `<button class="opt" aria-pressed="${sel===o.k&&!partial}" ${A(()=>{sel=o.k;partial=false;draw();})}><span class="k">${L}</span><span>${o.t}</span><span class="cost">${tag}</span><span class="why">${keyBorrowText(lack)}</span></button>`;
    return `<button class="opt" aria-pressed="${sel===o.k&&!partial}" ${short||dis?"disabled":""} ${A(()=>{sel=o.k;partial=false;draw();})}><span class="k">${L}</span><span>${o.t}</span><span class="cost">${tag}</span>${dis?`<span class="why">${dis}</span>`:short?`<span class="why">이번 분기 팀장 시간이 ${lack} 모자라 고를 수 없습니다.${G.ot+lack>3?` 야근으로 빌릴 수 있는 한도(분기 3)도 ${G.ot>=3?"다 썼습니다":`${3-G.ot}만 남았습니다`}.`:""}</span>`:""}</button>${short&&!dis?borrowLink(lack,draw)+partialLink(o,L,c):""}`}).join("")}</div>
   <div class="foot"><span class="note">결정한 뒤에는 고칠 수 없습니다.</span><button class="btn main" ${sel?"":"disabled"} ${A(()=>{const c=s.common;if(!c){finish();return;}const nolist=false;if(nolist&&!c.noWhy){G.judge=(G.judge||0)+1;}step=c.noWhy||nolist?((c.noTell||O().noTell)?null:"tell"):"why";if(!step){finish();return;}draw();})}>결정</button></div></div>`);
  }else if(step==="why"){
   const GL=gradeList(),PL=principleList(),pk=Array.isArray(why)?why:[];
   const btn=(w,i,grp)=>`<button class="opt" style="grid-template-columns:24px minmax(0,1fr)" aria-pressed="${pk.includes(w)}" ${A(()=>{const a=Array.isArray(why)?[...why]:[];const j=a.indexOf(w);if(j>=0)a.splice(j,1);else{if(a.length>=2)a.shift();a.push(w);}why=a;draw();})}><span class="k">${i+1}</span><span>${w}</span></button>`;
   shell(`<div class="pane"><div class="eyebrow">근거</div><h2>이 결정의 근거는 무엇입니까?</h2><p class="note">공개된 기준 가운데 최대 2개를 고르세요. 공개하지 않은 기준은 근거로 쓸 수 없습니다.</p>
   <p><b>팀 운영 원칙</b> <span class="note">회사가 정한 원칙${G.written.notice&&G.written.notice.방식!=="none"?"과 4월 공지에 쓴 배분 기준":""}</span></p><div class="opts">${PL.map((w,i)=>btn(w,i,"운"))}</div>
   ${GL.length?`<p><b>등급 기준</b> <span class="note">3월에 공개한 평가 기준</span></p><div class="opts">${GL.map((w,i)=>btn(w,i,"등"))}</div>`:`<p class="note">${has("pub_leaders")?"등급 기준은 리더들과만 맞춰서 근거로 쓸 수 없습니다.":"공개한 등급 기준이 아직 없습니다."}</p>`}
   <div class="foot"><span class="note num">${pk.length}/2</span><button class="btn main" ${pk.length?"":"disabled"} ${A(()=>{const r=judgeWhy(s,sel,pk);G.cons.push({scene:s.id,choice:sel,why:pk.join(" · "),fit:r.fit,half:has("rule_silent")&&pk.includes("AI 활용 효과")});consNote=r.note;if(has("rule_silent")&&pk.includes("AI 활용 효과")&&s.rel)applyFx(s.rel+"-1");if(s.common.noTell||O().noTell){finish();}else{step="tell";draw();}})}>다음</button></div></div>`);
  }else if(step==="tell"){
   const left=G.time-(partial?Math.max(0,Math.min(val(O().cost)||0,G.time)):(val(O().cost)||0));
   shell(`<div class="pane"><div class="eyebrow">알리기</div><h2>누구에게 어떻게 알릴까요?</h2>${s.tellNote?`<p class="note">${s.tellNote}</p>`:""}<div class="opts">${TELL.map(t=>{const lack=t.c-Math.max(0,left),short=!KEY&&t.c>0&&t.c>left;return `<button class="opt" aria-pressed="${tell===t.id}" ${short?"disabled":""} ${A(()=>{tell=t.id;draw();})}><span class="k">·</span><span>${t.t}</span><span class="cost">${t.c?"⏳"+t.c:"0"}</span>${KEY&&t.c>0&&t.c>left?`<span class="why">${keyBorrowText(lack)}</span>`:""}${short?`<span class="why">이번 분기 팀장 시간이 ${lack} 모자랍니다.${G.ot+lack>3?` 야근으로 빌릴 수 있는 한도(분기 3)도 남지 않았습니다.${t.id==="full"&&left>=1?" 결과만 알리는 쪽은 ⏳1로 가능합니다.":""}`:""}</span>`:""}</button>${short?borrowLink(lack,draw):""}`}).join("")}</div>
   <div class="foot"><span></span><button class="btn main" ${tell?"":"disabled"} ${A(finish)}>확정</button></div></div>`);
  }
 };
 const finish=()=>{
  const o=O();let oc=partial?Math.max(1,Math.min(val(o.cost)||0,G.time)):(val(o.cost)||0);if(KEY&&!partial&&oc>G.time){keyBorrow(oc-Math.max(0,G.time));oc=Math.max(0,G.time);}if(oc){G.time-=oc;G.tu.all+=oc;if(s.meet)G.tu.meet+=oc;}if(o.tok){G.token=Math.max(0,G.token-o.tok);G.tokSpent[G.quarter]=(G.tokSpent[G.quarter]||0)+o.tok;}
  G.nextMult=undefined;
  const ex=s.ctxFn?s.ctxFn(G):{};
  let pos=partial?.5:1,neg=1;(s.boost||[]).forEach(b=>{if(b.o.includes(o.k)&&b.c(G))pos*=b.m;});(s.harm||[]).forEach(b=>{if(b.o.includes(o.k)&&b.c(G))neg*=b.m;});
  const live=applyFx(val(o.fx),{rel:s.rel,mult,...ex,pos:pos!==1?pos:undefined});applySig(val(o.sig),1,s.id,o.k);record(s.id,o.k);
  const base=s.id.replace(/_\d$/,"").replace(/[abc]$/,"");G.f["c_"+base+"_"+o.k]=true;G.f["c_"+s.id+"_"+o.k]=true;
  (s.xfx||[]).forEach(x=>{const inO=x.o.includes(o.k);if(x.c(G)&&(x.neg?!inO:inO))applyFx(val(x.fx),{live,rel:s.rel,mult});});
  if(o.pr)addPromise(o.pr);
  if(o.settle&&o.settle[1]!=="?")settle(o.settle[0],o.settle[1]==="이행",PROM_MEMBER[o.settle[0]]);
  if(o.ending)G.ends[ENDKEY[base]||base]=o.ending;
  const r=Math.random()*100;let acc=0,hit=null;
  (o.tw||[]).forEach((t,i)=>{if(hit)return;let p=typeof t.p==="function"?t.p(G):t.p;(s.mods||[]).forEach(m=>{if(m.o.includes(o.k)&&(m.i||0)===i&&m.c(G))p+=m.d;});acc+=Math.max(0,p);if(r<acc)hit=t;});
  const hits2=(o.tw2||[]).filter(t=>Math.random()*100<val(t.p));luckLog(s,o,hit,hits2);hits2.forEach(t=>applyFx(val(t.fx),{live,rel:s.rel}));
  if(hit){applyFx(val(hit.fx),{live,rel:s.rel,mult,...ex,neg:neg!==1?neg:undefined});if(hit.ending)G.ends[ENDKEY[base]||base]=hit.ending;if(hit.settle)settle(hit.settle[0],hit.settle[1]==="이행",PROM_MEMBER[hit.settle[0]]);}
  G.nextMult=hit&&hit.nextMult!=null?hit.nextMult:o.nextMult;
  if(o.onDone)o.onDone(G,hit);
  let tellLine="";
  if(tell){const t=TELL.find(x=>x.id===tell);if(KEY&&t.c>G.time){keyBorrow(t.c-Math.max(0,G.time));G.tu.all+=t.c;G.time=Math.min(G.time,0)<0?G.time:0;}else{G.time-=t.c;G.tu.all+=t.c;}if(tell==="full")G.tu.exp+=t.c;G.told.total++;
   if(tell==="full"){G.told.full++;applyFx("안전+2");applySig("④L",1,s.id,"설명");if(Math.random()<.25){applyFx((s.rel||"mfg")+"-1",{live});tellLine=`${name(s.rel||"mfg")}: "이유는 알겠는데, 먼저 물어보실 수는 없었나요."`;}}
   if(tell==="none"){G.told.none++;applyFx("안전-2");applySig("④P",1,s.id,"안 알림");if(Math.random()<.4){applyFx("소문1",{live,rel:s.rel});tellLine="익명 게시판: \"왜 그렇게 정했는지 아는 분? 듣기로는 위에서 시켰다던데요.\"";}}}
  const tail=s.tail&&s.tail(G,o);if(tail&&tail.fx)applyFx(tail.fx,{live});
  const after=val(o.after);let afterDone=false;const go=()=>{(opt.done||next)(o,hit);};
  const says=(val(o.says)||[]);
  const drawR=()=>{paint("");
   shell(`<div class="pane"><div class="eyebrow">일어난 일</div><h2>${val(s.title)}</h2><div class="prose"><p>${partial?`범위를 줄여 계획의 일부만 했습니다. 계획: "${o.t}"`:(val(o.done)||o.t)}${o.recover?` (복구 ${val(o.recover)})`:""}</p>${hit&&!hit.who?`<p>${val(hit.t)} <span class="note">· 확률로 일어난 일</span></p>`:""}${hits2.map(t=>`<p>${val(t.t)} <span class="note">· 확률로 일어난 일</span></p>`).join("")}</div>${says.map(x=>sayHtml(x[0],x[1])).join("")}${hit&&hit.who?sayHtml(hit.who,val(hit.t)):""}${tail?sayHtml(tail.who,tail.t):""}${tellLine?`<div class="happen">${tellLine}</div>`:""}${consNote?`<p class="note">${consNote}</p>`:""}
   ${after&&!afterDone?`<div class="ask"><p class="voice">${after.t}</p><div class="btns">${after.opts.map(x=>`<button class="btn" ${A(()=>{afterDone=true;if(x.pr)addPromise(x.pr);if(x.fx)applyFx(val(x.fx),{live:{},rel:s.rel});record(s.id+"+",x.t);drawSide();drawR();})}>${x.t}</button>`).join("")}</div></div>`:`<div class="foot"><span></span><button class="btn main" ${A(go)}>다음</button></div>`}</div>`,live);
  };
  beep(560,.06);drawR();
 };
 draw();
}

/* 중재: 1단계 방식 → 2단계 결론 */
function SC_MED(s){
 const rel=s.rel,pr=s.pair||[rel,rel];
 const lateFx=s.lateFx||(pr[1]+"-2"),postFx=s.postFx||(pr[0]+"+2 "+pr[1]+"+2");
 const s1={id:s.id+"-1",meet:true,title:s.title,tag:s.tag,when:s.when,intro:s.intro,say:s.say,conds:s.conds,enter:s.enter,rel,ask:"어떻게 풀까요?",options:[
  {k:"A",t:s.a1||"각자 30분씩 따로 만나 사정을 듣고, 그다음에 정리한다.",cost:s.aCost?s.aCost(G):2,done:"두 사람을 따로 만났습니다.",fx:s.storyFx||"",sig:"④L",mult:.5,says:s.story,tw:[{p:s.noA&&s.noA(G)?0:30,t:"\"저쪽을 먼저 만나셨다면서요.\"",fx:lateFx}]},
  {k:"B",t:s.b1||"오늘 오후 둘을 한자리에 불러 쟁점을 놓고 바로 정리한다.",cost:1,done:"두 사람을 한자리에 불렀습니다.",mult:1,tw:[{p:35,t:"말싸움이 됐습니다.",mult:1.5},{p:25,t:"마주 앉아 스스로 절충안을 찾기 시작했습니다.",post:postFx}]},
  {k:"C",t:s.c1||"양쪽 메일을 다 읽었으니, 오늘 안에 내 결론을 메일로 보낸다.",done:"결론을 메일로 보냈습니다.",sig:"④P",mult:1.5,rumor:true,tw:[{p:25,t:"둘 다 \"그럼 그렇게 하죠\"로 끝났습니다.",mult:1,rumor:false}]},
 ]};
 SC_CHOICE(s1,{done:(o,hit)=>{
  const mult=hit&&hit.mult!=null?hit.mult:o.mult,rumor=hit&&hit.rumor===false?false:o.rumor,post=hit&&hit.post;
  const s2={id:s.id,title:s.title2,tag:s.tag,when:s.when,conds:s.conds2,enter:s.enter2,rel,options:s.options,common:s.common,mods:s.mods,xfx:s.xfx,boost:s.boost,harm:s.harm,ctxFn:s.ctxFn};
  const mx=s.multX?s.multX(G):1;
  if(o.k==="C")G.concl++;
  SC_CHOICE(s2,{mult:(mult||1)*mx,done:()=>{if(post)applyFx(post);if(rumor&&Math.random()<.4)applyFx("소문1",{rel});next();}});
 }});
}

/* 되돌아온 일 */
function SC_RETURNS(s){
 const q=[];
 G.rets.forEach(r=>{const c=s.catalog[r.id];if(!c)return;if(Math.random()*100<r.p+(has("ret_more")?15:0)){q.push({...r,c});G.ds=G.ds||{f:0,p:0,bf:0,bp:0};if(r.four)G.ds.bf++;else G.ds.bp++;}else G.delegWin++;});
 G.rets=[];const list=q.slice(0,2);
 if(!list.length){next();return;}
 const step=i=>{
  if(i>=list.length){next();return;}
  const r=list[i],to=r.to,fail=(r.c.fail||"")+(r.id==="M05"?" `token_nodata`":"");
  const sc={id:s.id+r.id,title:r.c.title,tag:"되돌아온 일",when:val(s.when),intro:(r.c.text?[r.c.text]:[]).concat([r.four?"이 일은 맡길 때 기대 결과·기한·권한·이유를 함께 전했습니다.":"이 일은 맡길 때 기대 결과·기한·권한·이유를 함께 전하지 않았습니다. 함께 전한 위임은 되돌아올 확률이 15%p 낮습니다."]),say:r.c.lines,rel:to,options:[
   {k:"A",t:"어디서 막혔는지 듣고, 기대 결과와 기한을 다시 맞춰서 맡긴다.",cost:1,done:"다시 맡겼습니다.",fx:g=>{g.delegWin++;g.coached=(g.coached||0)+1;if(g.coached>=3)ach("코치");return to+"+2";},sig:"①L",tw:[{p:20,t:"다시 맡겼지만 기한을 넘겼습니다.",fx:"성과-1 "+fail}]},
   {k:"B",t:"시간이 없으니 이번 건은 내가 가져와서 먼저 끝내 놓기로 한다.",cost:2,done:"내가 가져와서 끝냈습니다.",fx:"성과+1 "+to+"-2",sig:"①P",tw:[{p:25,t:"\"팀장님이 다 해 주시네요.\"",fx:"`ret_more`"}]},
   {k:"C",t:"기한을 다시 정해 주고, 방법은 알아서 찾아보라고 돌려보낸다.",done:"돌려보냈습니다.",tw:[{p:60,t:"품질이 떨어진 채로 끝났습니다.",fx:"성과-2 "+fail},{p:40,t:"담당자가 스스로 답을 찾았습니다.",fx:g=>{g.delegWin++;return to+"+1";}}]},
  ]};
  SC_CHOICE(sc,{done:()=>step(i+1)});
 };
 step(0);
}

/* KPI 합의서 */
function SC_KPI(s){
 const order=s.cards.map((_,i)=>i).sort(()=>Math.random()-.5),pick=[],link={};
 const keep=()=>pick.forEach(i=>{const b=$("l"+i);if(b)link[i]=b.value;});
 const draw=()=>{paint("");
  const ok=()=>pick.length>=3&&pick.length<=5&&pick.every(i=>$("l"+i)&&$("l"+i).value);
  shell(`<div class="pane">${head(s)}<div class="prose">${para(s.intro)}</div><details class="ref"><summary>참고 카드</summary><p style="margin-top:6px">${s.ref}</p></details>
  <p><b>KPI 외에 등급을 가르는 기준을 3~5개 고르세요.</b></p>
  <div class="opts">${order.map(i=>{const c=s.cards[i],on=pick.includes(i);return `<button class="opt" style="grid-template-columns:24px minmax(0,1fr)" aria-pressed="${on}" ${A(()=>{keep();const j=pick.indexOf(i);if(j>=0)pick.splice(j,1);else if(pick.length<5)pick.push(i);draw();})}><span class="k">${on?"✓":""}</span><span><b style="font-weight:600">${c.n}</b><span class="note" style="display:block">${c.d}</span></span></button>`}).join("")}</div>
  ${pick.map(i=>`<div class="task"><label class="label" for="l${i}">${s.cards[i].n} · 연결되는 성적표</label><select id="l${i}"><option value="">고르세요</option>${SCORES.map(c=>`<option ${link[i]===c?"selected":""}>${c}</option>`).join("")}</select></div>`).join("")}
  <div class="foot"><span class="note num">${pick.length}/3~5</span><button class="btn main" id="kgo" disabled ${A(finish)}>기준 확정</button></div></div>`);
  const up=()=>{$("kgo").disabled=!ok();};pick.forEach(i=>$("l"+i).onchange=up);up();
 };
 const finish=()=>{keep();
  const live={};let hidden=0,bad=0,right=0;G.pub=[];
  pick.forEach(i=>{const c=s.cards[i];applyFx(c.fx,{live});G.f[c.f]=true;G.pub.push(c.n);if(c.hide)hidden++;if(c.bad)bad++;if(c.ok.includes(link[i]))right++;});
  if(has("noticed_prc")&&!has("pub_prevent"))applyFx("prc-3",{live});
  const q=(hidden?30:0)+(bad?0:30)+Math.round(right/pick.length*20);
  G.written.kpi=pick.map(i=>({기준:s.cards[i].n,연결:link[i]}));
  G.goal2=pick.length>=3&&hidden>0&&right===pick.length;G.quality=q;
  record(s.id,G.pub.join(","));
  ach2();
 };
 const ach2=()=>{
  if(has("pub_prevent")||has("pub_security")||has("pub_support"))ach("보이지 않는 것을 보다");
  SC_CHOICE({id:s.id+"-2",tag:s.tag,when:s.when,title:"어디까지 알릴까요?",options:s.levels},{done:(o)=>{
   G.quality+=o.k==="A"?20:o.k==="B"?10:0;
   SC_CHOICE({id:s.id+"-3",tag:s.tag,when:s.when,title:"재검토 조건",intro:["이 합의서를 다시 열어 볼 조건을 미리 적어 둘까요? \"회사 지침이나 사업 조건이 바뀌면 2주 안에 다시 검토해 공지한다.\""],options:s.planb});
  }});
 };
 draw();
}

/* 펄스 서베이 */
function SC_PULSE(s){
 const q=val(s.qs).map(x=>Math.max(0,Math.min(100,Math.round(x))));
 G.pulseSeen=G.pulseSeen||[];const cm=s.comments.filter(c=>c.c(G)).map(c=>c.t).filter(t=>!G.pulseSeen.includes(t));
 const keep=Math.max(cm.length?1:0,Math.round(cm.length*Math.min(1,G.safe/100*1.5)));
 const shown=cm.slice(0,keep);shown.forEach(t=>G.pulseSeen.push(t));
 const L=["업무 배분과 평가 기준을 알고 있다","업무 배분이 공정하다","이 팀에서 계속 일하고 싶다"];
 const avg=(q[0]+q[1]+q[2])/3;G.pulseAvg=avg;G.pulse[G.quarter]=q;
 const sc={...s,top:()=>`<div class="table">${L.map((l,i)=>`<div class="card" style="display:flex;justify-content:space-between;gap:8px"><span style="font-size:14px;color:var(--ink)">${i+1}. ${l}</span><b>${q[i]}</b></div>`).join("")}</div>${G.quarter>=3?`<p class="note num">1번 문항 · 3월 ${(G.pulse[0]||[])[0]??"-"} → 6월 ${(G.pulse[1]||[])[0]??"-"} → 9월 ${(G.pulse[2]||[])[0]??"-"} → 12월 ${q[0]}</p>`:""}${shown.length?`<div class="cond">${shown.map(x=>`<span class="voice" style="font-size:15px">${x}</span>`).join("")}</div>`:'<p class="note">자유 응답은 없었습니다.</p>'}`};
 SC_CHOICE(sc);
}
function settle(id,ok,member){
 const p=G.prom[id];if(!p)return;
 p.status=ok?"이행":"파기";
 if(ok){applyFx("안전+3");return;}
 G.broken++;applyFx("안전-5");
 if(member)(G.story[member]=G.story[member]||[]).push("-");
}
function endQuarter(){
 const lv=v=>Math.trunc((v-50)/10);
 const ex=G.fexp??50,st0=G.score.안정;const a=lv(G.score.사람)*2,c=lv(G.fsat);const b=Math.max(-6,Math.min(6,Math.round((st0-ex)/4)));
 G.score.안정=Math.max(0,Math.min(100,G.score.안정+a));G.fsat=Math.max(0,Math.min(100,G.fsat+b));
 G.score.재무=Math.max(0,Math.min(100,G.score.재무+c*2));G.score.성과=Math.max(0,Math.min(100,G.score.성과+c));
 G.chain.push({q:G.quarter+1,사람_안정:a,안정_F사:b,F사_재무:c*2,F사_성과:c,기대:ex,안정:st0});const QS={q:G.quarter+1,chain:chainLine(G.chain[G.chain.length-1]),ot:G.ot,tokFx:G.tokenCap?(G.tokenCap>=140?2:G.tokenCap>=100?1:0):0};
 (G.hist=G.hist||[]).push({...G.score,F사:G.fsat,F사기대:G.fexp??50,안전:G.safe});
 const carry=Math.min(2,G.time),bonus=Math.min(2,G.delegWin),pen=G.ot?1:0;
 G.toldAll.full+=G.told.full;G.toldAll.none+=G.told.none;
 if(G.ot)applyFx("사람-"+G.ot);
 if(G.tokenCap)applyFx("재무-"+(G.tokenCap>=140?2:G.tokenCap>=100?1:0));
 if(G.tokenCap){const used=Math.round(G.tokenCap*(G.f.token_drain?.95:G.f.token_lean||G.f.token_audit?.6:.8));G.tokSpent[G.quarter]=(G.tokSpent[G.quarter]||0)+used;(G.tokBase=G.tokBase||[])[G.quarter]=used;}
 const nq=G.nextQ||0;G.nextQ=0;QS.carry=carry;QS.bonus=bonus;QS.pen=pen;QS.nq=nq;QS.tok=G.tokSpent[G.quarter];QS.tokBase=(G.tokBase||[])[G.quarter];G.lastQ=QS;
 G.big=0;G.delegWin=0;G.ot=0;G.told={full:0,none:0,total:0};G.quarter++;if(G.tokenCap)G.token=G.tokenCap;
 G.time=Math.max(0,(QUARTER_TIME[G.quarter]||12)+carry+bonus-pen+nq);
}

/* 핵심 과제 정의 */
function SC_TASKS(s){
 const pick=[],data={};
 const order=s.items.map((_,i)=>i).sort(()=>Math.random()-.5);
 const keep=()=>pick.forEach(i=>{const a=$("t"+i),b=$("c"+i);if(a)data[i]={t:a.value,c:b.value};});
 const draw=()=>{paint("");
  const ok=()=>pick.length===3&&pick.every(i=>{const a=$("t"+i),b=$("c"+i);return a&&readable(a.value,6).ok&&b&&b.value;});
  shell(`<div class="pane">${head(s)}<div class="prose">${para(s.intro)}</div>${s.id==="1-3"||/1월/.test(s.when||"")?morningMirror():""}<details class="ref"><summary>참고 카드</summary><p style="margin-top:6px">${s.ref}</p></details>
  <div class="opts">${order.map(i=>{const on=pick.includes(i);return `<button class="opt" style="grid-template-columns:24px minmax(0,1fr)" aria-pressed="${on}" ${A(()=>{keep();const j=pick.indexOf(i);if(j>=0)pick.splice(j,1);else if(pick.length<3)pick.push(i);draw();})}><span class="k">${on?"✓":""}</span><span>${s.items[i]}</span></button>`}).join("")}</div>
  ${pick.map(i=>`<div class="task"><b>${s.items[i]}</b><label class="label" for="c${i}">영향을 주는 성적표</label><select id="c${i}"><option value="">고르세요</option>${SCORES.map(c=>`<option ${data[i]&&data[i].c===c?"selected":""}>${c}</option>`).join("")}</select><label class="label" for="t${i}">근거 한 문장 (10자 이상)</label><textarea id="t${i}" placeholder="${val(s.hint,i)||""}">${data[i]?data[i].t:""}</textarea></div>`).join("")}
  <div class="foot"><span class="note num">${pick.length}/3</span><button class="btn main" id="tgo" disabled ${A(()=>{keep();G.written.tasks=pick.map(i=>({과제:s.items[i],성적표:data[i].c,근거:data[i].t}));if(pick.some(i=>i>=6))G.f.urgent_task=true;record(s.id,pick.map(i=>i+1).join(","));next();})}>메모 닫기</button></div></div>`);
  const up=()=>{$("tgo").disabled=!ok();};
  pick.forEach(i=>{$("t"+i).oninput=up;$("c"+i).onchange=up;});up();
 };
 draw();
}

/* 분기 면담 */
function SC_INTERVIEW(s){
 let mode=null;
 const go=(row,how,cost)=>{
  G.time-=cost;G.tu.all+=cost;G.tu.meet+=cost;let live={},caught=false;const lines=val(row.line,how);const lead=row.lead||(PP[row.k]&&PP[row.k].lead);
  if(how==="sneak"){live=applyFx("안전+1");applySig("④P",1,s.id,row.k+":몰래");if(Math.random()<.4){caught=true;applyFx(`${lead}-8 안전-4`,{live});}}
  else live=applyFx(how==="skip"?`안전+2 ${lead}-1`:val(row.fx));
  if(row.fxInfo)applyFx(val(row.fxInfo));
  const before=Object.keys(G.f).filter(k=>/^know_/.test(k));G.f["talk_"+row.k]=true;G.f["talks_"+row.k]=(G.f["talks_"+row.k]||0)+1;record(s.id,row.k+":"+how);const learned=Object.keys(G.f).filter(k=>/^know_/.test(k)&&!before.includes(k)&&KNOW[k]).map(k=>KNOW[k]);
  paint("");
  shell(`<div class="pane"><div class="eyebrow">일어난 일</div>${sayHtml(row.k,lines)}<div class="happen"><span class="label">알게 된 것</span>${learned.length?learned.join("<br>"):"새로 알게 된 사실은 없었습니다. 만난 것 자체가 기록에 남습니다."}</div>${caught?`<p>일주일 뒤, ${name(lead)}이 묻습니다. "제 사람 따로 만나셨다면서요."</p>`:""}<div class="foot"><span></span><button class="btn main" ${A(next)}>다음</button></div></div>`,live);
 };
 const draw=()=>{paint("");
  const short=c=>c>G.time;
  const mems=s.members.filter(r=>!isGone(r.k));
  shell(`<div class="pane">${head(s)}<div class="prose">${para(s.intro)}</div>
  <div class="label">모듈 리더 · 1:1 · ⏳2</div><div class="grid2">${s.leaders.map(r=>`<button class="person" ${short(2)?"disabled":""} ${A(()=>go(r,"1on1",2))}>${face(r.k,G.trust[r.k])}<span><b>${name(r.k)}</b><small>${LD[r.k].m}</small></span></button>`).join("")}</div>
  <div class="label">구성원 · 스킵 레벨</div>
  <div class="grid2">${mems.map(r=>`<button class="person" aria-pressed="${mode===r.k}" ${A(()=>{mode=r.k;draw();})}>${face(r.k)}<span><b>${name(r.k)}</b><small>${PP[r.k].m}</small></span></button>`).join("")}</div>
  ${mode?`<div class="ask"><p>${name(mode)}을 어떻게 만날까요?</p><div class="btns"><button class="btn" ${short(3)?"disabled":""} ${A(()=>go(s.members.find(x=>x.k===mode),"skip",3))}>${name(s.members.find(x=>x.k===mode).lead||PP[mode].lead)}에게 알리고 만난다 ⏳3</button><button class="btn" ${short(2)?"disabled":""} ${A(()=>go(s.members.find(x=>x.k===mode),"sneak",2))}>리더 모르게 만난다 ⏳2</button></div></div>`:""}
  <div class="foot"><span class="note">이번 달은 한 명을 만날 수 있습니다.</span><button class="btn" ${A(()=>{record(s.id,"건너뜀");next();})}>이번에는 만나지 않는다</button></div></div>`);
 };
 draw();
}

function boot(){
 const old=load();
 if(old&&old.sound!==undefined)G.sound=old.sound;
 render();
}

/* ===== 사람이 읽는 이름: 화면에 장면 ID가 나가지 않게 ===== */
function sceneOf(id){id=String(id);for(const s of CONTENT){if(s.id===id)return s;if(Array.isArray(s.cases))for(const c of s.cases)if(c.id===id)return c;}const base=id.replace(/(_\d+|[a-z]|-\d+)$/,"");return base!==id?sceneOf(base):null;}
function mailOf(id){for(const s of CONTENT)if(Array.isArray(s.mail)){const m=s.mail.find(x=>x.id===id);if(m)return{m,month:s.month};}return null;}
function cleanTitle(t){return String(val(t)||"").replace(/Wobbler[①②③]\s*/g,"").replace(/^리더 회의[①②③④]?\s*·\s*/,"").replace(/^[^·]*면담\s*·\s*/,"").replace(/\s*\(.*?\)\s*/g," ").replace(/[🚨⚖️📚👥🗣️]/gu,"").replace(/\s+/g," ").trim();}
function nm(id){id=String(id);{const mm=id.match(/^(.*)-1$/);const bs=mm&&sceneOf(mm[1]);if(bs&&bs.type==="med")id=mm[1];}const ml=mailOf(id.split("~")[0]);if(ml)return `${ml.month}월 「${ml.m.sub}」`;const R={"R-6":"6월 반기 회고 재배분","4-2":"4월 자원 배분"};if(R[id])return R[id];const s=sceneOf(id);const mo=MON?MON(id):null;return (mo?mo+"월 ":"")+(s?`「${cleanTitle(s.title)||cleanTitle(s.tag)||"결정"}」`:"결정");}
function choiceText(id,ch){const map={"직접":"직접 처리","코칭":"방향만 주고 맡김","답장":"답장","위임":"위임","보류":"보류","안 알림":"알리지 않음","설명":"이유까지 설명","기준 먼저 공유":"기준 먼저 공유"};if(map[ch])return map[ch];if(/^[a-z]+:/.test(ch)){const [k,how]=ch.split(":");return name(k)+" 면담 "+(how==="몰래"?"(몰래 알아봄)":how);}
 {const mm=String(id).match(/^(.*)-1$/);const bs=mm&&sceneOf(mm[1]);if(bs&&bs.type==="med"){const t={A:"두 사람을 따로 만나 사정을 들음",B:"둘을 한자리에 불러 정리",C:"메일로 결론만 통보"}[ch];if(t)return t;}}
 const s=sceneOf(id);const o=s&&Array.isArray(s.options)&&s.options.find(x=>x.k===ch);if(o){let t=String(val(o.t)).replace(/\s*⏳\d*/g,"");const cut=t.search(/[,.]/);if(cut>8&&cut<34)t=t.slice(0,cut);else if(t.length>34)t=t.slice(0,32)+"…";return t;}return ch;}
function label(id,ch){return nm(id)+" — "+choiceText(id,ch);}
function stripId(t){return String(t).replace(/^(M\d+(~M\d+)?|R-\d|\d+-\d+[a-z]?(_\d)?)\s+/,"");}
function chainLine(c){const sg=v=>(v>0?"+":"")+v;const p=[];if(c.사람_안정)p.push(`사람 점수 때문에 다음 분기 안정이 ${sg(c.사람_안정)}`);if(c.기대!=null)p.push(`F사 기대 ${c.기대} 대비 안정 ${c.안정} → F사 만족 ${sg(c.안정_F사)}`);else if(c.안정_F사)p.push(`안정 점수 때문에 F사 만족이 ${sg(c.안정_F사)}`);if(c.F사_재무)p.push(`F사 만족 때문에 재무가 ${sg(c.F사_재무)}`);return p.length?`${c.q}분기 연쇄: `+p.join(" · "):"";}

/* 받은편지함 시간 비용(초)과 마감 정산 */
const IBT={reply:35,del:12,four:12};
function spend(st,sec){st.left=Math.max(0,st.left-sec);}
function replyOpts(m,st){const reps=REPLIES[m.id]||[];if(!st.ord[m.id]){const o=reps.map((x,i)=>i);for(let i=o.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]];}st.ord[m.id]=o;}return st.ord[m.id].map(i=>reps[i]);}
function inboxSettle(st){
 if(!st.settled){st.settled=true;st.lt=Math.floor(st.replies/3);st.ht=st.holds>3?Math.ceil((st.holds-3)/2):0;st.hs=Math.max(0,st.holds-3);
  const take=n=>{const t=Math.max(0,Math.min(n,G.time));G.time-=t;G.tu.all+=t;return t;};st.lt=take(st.lt);st.ht=take(st.ht);if(st.hs)applyFx("안정-"+st.hs);if(st.holds>=6)applyFx("소문1");}
 const l=[];if(st.lt)l.push(`직접 답장 ${st.replies}건의 후속 처리에 팀장 시간 ⏳${st.lt}${jo(st.lt,"을","를")} 썼습니다.`);
 if(st.holds)l.push(`보류 ${st.holds}건${st.ht?`: 밀린 일을 처리하느라 팀장 시간 ⏳${st.ht}${jo(st.ht,"을","를")} 더 썼고, 안정이 ${st.hs} 내려갔습니다`:": 아직은 감당할 만합니다"}.${st.holds>=6?" 처리되지 않은 일 이야기가 팀에 돌기 시작했습니다.":""}`);
 return l.length?`<div class="happen"><span class="label">오늘 받은편지함의 값</span>${l.join("<br>")}</div>`:"";}

/* 서술 입력 검사: 자모만 치거나 같은 글자를 반복한 글은 받지 않는다 */
function readable(t,min){t=String(t||"").trim();const syl=(t.match(/[가-힣]/g)||[]).length,jamo=(t.match(/[ㄱ-ㅎㅏ-ㅣ]/g)||[]).length,words=t.split(/\s+/).filter(w=>/[가-힣A-Za-z0-9]{2,}/.test(w)).length;
 if(!t)return{ok:false,why:"비어 있습니다."};if(jamo>syl*.2)return{ok:false,why:"자음·모음만으로 된 글자는 읽을 수 없습니다."};if(/(.){4,}/.test(t.replace(/\s/g,"")))return{ok:false,why:"같은 글자가 반복됩니다."};
 const uniq=new Set(t.replace(/[^가-힣]/g,"")).size;if(syl<min||uniq<Math.min(min,8)||words<3)return{ok:false,why:`문장으로 읽히지 않습니다. 한글 ${min}자 이상, 낱말 세 개 이상으로 써 주세요.`};return{ok:true};}
/* 1월 핵심 과제 화면: 오늘 아침 시간을 쓴 곳과 선임 때 고른 우선순위를 나란히 */
const MAIL_AREA={M01:"성과",M02:"성과",M03:"성과",M04:"재무",M05:"재무",M06:"안정",M07:"안정",M08:"안정",M09:"사람",M10:"사람",M11:"안정",M12:"사람",M13:"안정",M14:"사람",M15:"사람",M16:"안정",M17:"사람"};
function morningMirror(){const c={},h={};Object.keys(MAIL_AREA).forEach(id=>{const a=MAIL_AREA[id];if(G.f["d_"+id]||G.f["del_"+id]){c[a]=(c[a]||0)+(G.f["d_"+id]?1:.5);}if(G.f["h_"+id])h[a]=(h[a]||0)+1;});
 const top=SCORES.slice().sort((a,b)=>(c[b]||0)-(c[a]||0)).filter(a=>c[a]).slice(0,2);
 return `<div class="cond"><span>선임 때 고른 우선순위: ${G.prio.join(", ")}</span><span>오늘 아침 손을 가장 많이 쓴 곳: ${top.join(", ")||"없음"} (직접 답장 1, 위임 0.5로 셈)</span>${Object.keys(h).length?`<span>보류한 메일이 가장 많았던 곳: ${SCORES.filter(a=>h[a]).sort((a,b)=>h[b]-h[a])[0]}</span>`:""}</div>`;}

/* 조사 고르기: 받침이 있으면 a, 없으면 b. mode "ro"면 ㄹ 받침도 b(로) */
function jo(w,a,b,mode){const t=String(w).replace(/["'”’)\]\s…]+$/,"");const c=t.slice(-1);let fin=0;
 if(/[가-힣]/.test(c))fin=(c.charCodeAt(0)-0xAC00)%28;else if(/[0-9]/.test(c))fin=[21,8,0,16,0,0,1,8,8,0][+c];else if(/[A-Za-z]/.test(c))fin=/[lmnr]/i.test(c)?8:0;
 if(!fin)return b;if(mode==="ro"&&fin===8)return b;return a;}

/* 핵심 장면: 분기 말에 몰린 판단이 시간 부족으로 잠기지 않게, 시간 대신 다른 대가를 치르고 고를 수 있다 */
const KEY_IDS=["6-4a","9-4","12-2","12-3a"];
function isKey(s){return s.type==="pulse"||KEY_IDS.includes(s.id)||/^12-4/.test(s.id)||!!s.key;}
function keyBorrowText(lack){return G.quarter>=3?`팀장 시간이 ${lack} 모자랍니다. 고르면 연말 야근으로 메웁니다 (초과 부하 +1).`:`팀장 시간이 ${lack} 모자랍니다. 고르면 다음 분기 시간에서 ⏳${lack}${jo(lack,"을","를")} 당겨 씁니다.`;}
function keyBorrow(n){if(n<=0)return;if(G.quarter>=3){applyFx("초과부하1");}else applyFx("다음분기⏳-"+n);G.keyBorrowed=(G.keyBorrowed||0)+n;}

/* 분기 안건 미리 보기: 남은 달의 안건과 들 수 있는 최대 팀장 시간 */
function agendaHtml(m){const qEnd=m%3===0;const from=m+1,to=qEnd?m+3:Math.ceil(m/3)*3;if(from>12)return "";
 const rows=[];CONTENT.forEach(sc=>{if(!sc.month||sc.month<from||sc.month>to||sc.bare)return;if(!["choice","med","pulse","interview","write","review","branch"].includes(sc.type))return;
  let opts=[];try{const c=sc.type==="branch"?(sc.cases||[])[0]:sc;opts=(c&&Array.isArray(c.options))?c.options:[];}catch(e){}
  let mx=0;opts.forEach(o=>{try{mx=Math.max(mx,+val(o.cost)||0);}catch(e){}});if(sc.type==="med")mx=Math.max(mx,2);if(sc.type==="interview")mx=3;if(sc.common&&!sc.common.noTell)mx+=2;
  const t=cleanTitle(sc.title)||cleanTitle(sc.tag)||(sc.type==="branch"?cleanTitle(((sc.cases||[])[0]||{}).tag):"")||"안건";rows.push(`${sc.month}월 ${t}${mx?` · 최대 ⏳${mx}`:""}${isKey(sc)?" · 시간이 모자라면 다른 대가로 진행":""}`);});
 if(!rows.length)return "";const q=Math.ceil(from/3);
 return `<details class="ref" open><summary>${qEnd?q+"분기 안건 미리 보기":"이번 분기 남은 안건"}</summary><p class="note" style="margin-top:6px">${rows.join("<br>")}</p>${qEnd?"":`<p class="note">지금 남은 팀장 시간 ⏳${Math.max(0,G.time)}</p>`}</details>`;}

/* 근거 체계: 운영 결정의 근거(팀 운영 원칙)와 사람 평가의 근거(등급 기준)를 나눈다 */
const PRINCIPLE_BASE=["장애 없는 운영","절차와 보안 준수","고객과의 약속"];
const G2P={"장애 예방 활동":["장애 없는 운영","장애·보안 위험"],"보안 준수":["절차와 보안 준수","장애·보안 위험"],"장애 복구 기여":["장애 없는 운영"],"AI 활용 효과":["효과"],"추가 과제 매출 기여":["효과","비용"],"고객 칭찬":["고객과의 약속"],"리더 종합 판단":["팀장 재량"],"동료 지원과 온보딩":[],"책임감 있는 근무":[]};
function gradeList(){return has("pub_leaders")?[]:(G.pub||[]);}
function principleList(){const n=G.written.notice;const add=n&&n.방식!=="none"?(n.기준||[]):[];return PRINCIPLE_BASE.concat(add.filter(x=>!PRINCIPLE_BASE.includes(x)));}
function fitSet(fitArr){const any=(fitArr||[]).some(x=>/^어느 공개/.test(x));const g=(fitArr||[]).filter(x=>!/^어느 공개/.test(x));const p=new Set();g.forEach(x=>(G2P[x]||[]).forEach(y=>p.add(y)));return{any,grade:g,prin:[...p]};}
function judgeWhy(s,sel,pk){const f=fitSet(s.common.fit&&s.common.fit[sel]);const ok=pk.filter(w=>f.any||f.grade.includes(w)||f.prin.includes(w));const fit=ok.length>0;
 const avail=gradeList().concat(principleList());const link=f.grade.concat(f.prin).filter((x,i,a)=>a.indexOf(x)===i&&avail.includes(x));
 const q=w=>`"${w}"`;const note=fit?`근거로 고른 ${ok.map(q).join(", ")}${jo(ok[ok.length-1],"과","와")} 맞는 결정으로 기록됐습니다.`+(ok.length<pk.length?` ${pk.filter(w=>!ok.includes(w)).map(q).join(", ")}${jo(pk.filter(w=>!ok.includes(w)).slice(-1)[0],"은","는")} 이 결정과 이어지지 않습니다.`:"")
  :`근거로 고른 ${pk.map(q).join(", ")}${jo(pk[pk.length-1],"으로","로","ro")}는 이 결정을 설명하기 어렵다고 기록됐습니다. `+(link.length?`이 결정과 이어지는 공개 기준: ${link.join(", ")}.`:f.any?"":`이 결정은 지금 공개된 어떤 기준과도 이어지지 않습니다.`);
 return{fit,note};}

/* 분기 정산 알림: 분기 말에 자동으로 움직인 값을 그 자리에서 보여 준다 */
function qSummary(q){const l=[];if(q.chain)l.push(q.chain.replace(/^\d분기 연쇄: /,"연쇄: "));if(q.ot)l.push(`야근으로 빌린 시간 ${q.ot} → 사람 −${q.ot}`);if(q.tokFx)l.push(`토큰 한도 비용 → 재무 −${q.tokFx}`);if(q.tok!=null)l.push(`이번 분기 토큰 집행 ${q.tok} (모듈 평소 사용 ${q.tokBase||0} + 안건에서 쓴 ${q.tok-(q.tokBase||0)})`);
 const t=[];if(q.carry)t.push(`남긴 시간 이월 +${q.carry}`);if(q.bonus)t.push(`되돌아오지 않은 위임 +${q.bonus}`);if(q.pen)t.push(`야근 −${q.pen}`);if(q.nq)t.push(`미리 당겨 쓴 시간 ${q.nq}`);if(t.length)l.push("다음 분기 팀장 시간: "+t.join(" · "));
 return l.length?`<div class="happen"><span class="label">${q.q}분기 정산</span>${l.join("<br>")}</div>`:"";}

/* 면담에서 알게 된 것 */
const KNOW={know_kim:"김 사원은 주 세 번 대기를 섭니다. 다른 사람은 주 한 번쯤입니다.",know_yoon:"발주 검토표의 예외 규칙은 윤 책임만 압니다.",know_oh:"오 사원은 E-417이 왜 나는지 아직 모릅니다.",know_han:"제안서 본문은 거의 한 선임이 씁니다. 표지에는 이름이 없습니다.",know_cha:"차 선임은 설계를 맡고 싶어 합니다.",know_bae:"배 책임의 작년 이의제기 회신은 \"종결\" 두 글자였습니다.",know_oh_risk:"오 사원이 바쁜 주에 점검 절차를 건너뛰고 있습니다.",know_metric:"9월에 지표를 두고 이야기가 나올 수 있습니다.",know_case:"우수 사례 이야기가 나올 수 있습니다.",know_token:"연간 토큰 정산이 다가옵니다. 지표부터 맞춰 두면 좋습니다.",know_rift:"평가 결과를 두고 강태식과 문지원 사이에 할 말이 생겼습니다.",know_mfg_mood:"리더들은 올해 강태식이 팀장이 될 줄 알았습니다.",know_line:"생산 라인이 요즘 불안합니다.",know_july:"F사가 7월에 큰 제안을 하나 줄 것 같습니다.",know_han2:"한 선임은 보고서에 고객이 묻는 것이 빠졌다고 봅니다.",know_eval_rd:"서하준은 평가 때 실험 건수를 어떻게 볼지 궁금해합니다.",know_eval_prc:"이수진은 예방 기록이 평가에 어디에 들어갈지 묻습니다.",know_dec:"연말에 무언가 터질 것 같다는 말이 있습니다.",know_cha3:"차 선임 일은 11월에 정해질 것 같습니다.",know_auto:"자동화 안건이 8월에 다시 올라옵니다.",know_hq:"8월에 본사가 인력 조사를 합니다."};
/* 진단 모드: 시드를 고정하면 같은 선택에 같은 결과가 나온다 */
(function(){const q=new URLSearchParams(location.search);const sd=q.get("seed");if(sd==null)return;const base=[...String(sd)].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261);let st=base;const orig=Math.random;
 const mul=()=>{st|=0;st=st+0x6D2B79F5|0;let t=Math.imul(st^st>>>15,1|st);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
 window.SEEDED=String(sd);Math.random=()=>{try{const sc=CONTENT[G.idx];const key=(sc?sc.id:"")+":"+G.decisions.length;if(key!==window.__sk){window.__sk=key;st=[...key].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,base);}}catch(e){return orig();}return mul();};})();

/* F사 기대: 약속을 키우면 오르고, 숫자를 바로잡거나 범위를 줄이면 내려간다. 분기 말 F사 만족 = (안정 − 기대) 차이 */
const FEXP={prop_full:[8,"7월 제안을 요청 범위 그대로 받음"],prop_ai:[3,"7월 제안을 AI 분석으로 3주 안에 약속"],r2_more:[5,"4월 신규 과제를 더 받음"],ct_more:[6,"6월 계약에 신규 과제 2건을 넣음"],small_win:[3,"5월 소규모 수주를 받음"],f_140:[5,"\"주 140시간 절감\"이 F사에 그대로 감"],scope_full:[8,"10월 본계약을 전 품목·1월 착수로 받음"],ai9_accepted:[2,"F사 AI 재산정 수치를 받아들임"],
 f_corrected:[-6,"140시간을 38시간(실측 중)으로 바로잡음"],prop_narrow:[-4,"7월 제안 범위를 한 품목으로 줄임"],scope_stage:[-4,"10월 본계약을 단계적으로 넓히기로 함"],ai9_fixed:[-3,"F사 재산정의 계획 정비 포함을 짚음"]};

/* 확률의 호의 장부: 위험한 선택 뒤에 나쁜 결과가 굴러오지 않은 경우 */
function twBad(t){if(t.mult&&t.mult>1.4)return true;let f="";try{f=String(val(t.fx)||"");}catch(e){}let sev=0;f.replace(/(성과|재무|사람|안정|F사만족|안전)[−-](\d+)/g,(_,k,n)=>{sev+=+n;});f.replace(/(rd|src|mfg|prc|mkt)[−-](\d+)/g,(_,k,n)=>{sev+=(+n)/2;});if(/소문|초과부하/.test(f))sev+=2;if(/`(sec_found|inc_found|sec_data_found|cha_end_gone|tae_end_left|token_drain|prop_gap|night_clash|run_thin|kim_fragile)`/.test(f))sev+=3;return sev>=3;}
function luckCat(s,t){const x=(cleanTitle(s.title)||"")+" "+(val(t.t)||"");return /장애|복구|배치|야간|라인|경고|E-417|오류|오분류|오탐|접속|권한|패치|절차/.test(x)?"장애":/보안|외부 AI|외부 서비스|외부로|신고|정보보안|개인 계정|유출/.test(x)?"보안":/떠나|사직|이직|병가|소진|위축|무서|지쳤/.test(x)?"사람":/F사|임원|유 과장|고객|계약|납기/.test(x)?"고객":"기타";}
function luckLog(s,o,hit,hits2){if(!o)return;const P=t=>{try{return +val(typeof t.p==="function"?t.p(G):t.p)||0;}catch(e){return 0;}};
 const add=t=>{const p=P(t);if(p<25||!twBad(t))return;(G.luck=G.luck||[]).push({m:G.month,scene:s.id,title:cleanTitle(s.title)||"",choice:String(val(o.t)||"").slice(0,40),t:String(val(t.t)||""),p,cat:luckCat(s,t)});};
 (o.tw||[]).forEach(t=>{if(t!==hit)add(t);});(o.tw2||[]).forEach(t=>{if(!hits2.includes(t))add(t);});}
function luckBill(b,p){if(p<30||(G.luck||[]).some(x=>x.scene==="bill"&&x.b===b))return;(G.luck=G.luck||[]).push({b,m:G.month,scene:"bill",title:"청구서",choice:"",t:`청구서 "${BILL[b].t}"`,p,cat:BILL[b].ax===1||/장애|안정|가공/.test(BILL[b].t)?"장애":"청구서"});}
function luckHtml(){const L=G.luck||[];if(!L.length)return `<p>올해는 위험한 선택 뒤에 운 좋게 피해 간 나쁜 결과가 없었습니다. 결과가 결정을 그대로 보여 준 해였습니다.</p>`;
 const cats={};L.forEach(x=>cats[x.cat]=(cats[x.cat]||0)+1);const inc=cats.장애||0;const top=[...L].sort((a,b)=>b.p-a.p);
 return `<p><b>피해 간 나쁜 결과 ${L.length}건${inc?`, 그중 장애 관련 ${inc}건`:""}.</b> 무사했던 달을 실력이라고 할 수 있습니까?</p>
 <p class="note">${Object.entries(cats).map(([k,v])=>`${k} ${v}건`).join(" · ")}</p>
 <div class="table">${top.slice(0,8).map(x=>`<div class="task"><b>${x.m}월 ${x.title} · 확률 ${x.p}%</b>${x.choice?`<span class="note">고른 안: ${x.choice}${x.choice.length>=40?"…":""}</span>`:""}<span class="note">일어나지 않은 일: ${x.t}</span></div>`).join("")}</div>
 ${top.length>8?`<details class="ref"><summary>나머지 ${top.length-8}건</summary><p class="note" style="margin-top:6px">${top.slice(8).map(x=>`${x.m}월 ${x.title} · ${x.p}% · ${x.t}`).join("<br>")}</p></details>`:""}
 <p class="note">결과가 좋았던 것과 결정이 좋았던 것은 다릅니다. 같은 선택을 다시 하면 이 일들은 일어날 수 있습니다.</p>`;}

/* 숨은 값의 월별 기록. 실제 아차 사례(숨은 값) 가운데 보고되는 몫은 심리적 안전에 달려 있다 */
function recordMonth(m){(G.monRec=G.monRec||{})[m]=1;const c=G.cells||{};
 const hidden=6+Math.min(6,G.over||0)+((c.RUN??3)<=1?2:0)+((c.SEC??2)<=1?2:0)+(G.burnout>=3?1:0)+Math.floor(Math.random()*3);
 const rate=Math.max(.05,Math.min(1,(G.safe-10)/70));const rep=Math.round(hidden*rate);
 (G.mon=G.mon||[]).push({m,safe:G.safe,over:G.over||0,burnout:G.burnout||0,rumors:G.rumors||0,hidden,rep,fsat:G.fsat,성과:G.score.성과,안정:G.score.안정});}
