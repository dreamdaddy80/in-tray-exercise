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
 trust:{rd:50,src:50,mfg:50,prc:50,mkt:50},score:{성과:50,재무:50,사람:50,안정:50},fsat:50,safe:50,
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
  if(m[1]){if(m[1][0]==="~")delete G.f[m[1].slice(1)];else G.f[m[1]]=true;continue;}
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
  return `<div class="ld">${face(k,G.trust[k])}<div><b>${LD[k].n}</b><small>${LD[k].m}</small><div class="tb"><i style="width:${G.trust[k]}%"></i></div></div>${d?`<span class="delta ${d>0?"up":"down"}">${d>0?"+":""}${d}</span>`:""}</div>`}).join("")}</div></div>
 <div><div class="label">성적표</div><div class="cards">${SCORES.map(k=>`<div class="card"><span>${k}</span><b>${G.score[k]}</b>${k==="성과"?`<em>F사 만족 ${G.fsat}</em>`:""}</div>`).join("")}</div></div>`;
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
function condLines(s){const l=(s.conds||[]).filter(c=>c.c(G)).map(c=>c.t);return l.length?`<div class="cond">${l.map(x=>`<span>${x}</span>`).join("")}</div>`:"";}

/* ---------- 장면 ---------- */
const SCENES={
 title(s){
  const old=load();
  shell(paint(`<div class="title-card"><div class="eyebrow">신임 팀장 In-Tray 시뮬레이션</div><h1>${s.title}</h1><div class="prose">${para(s.body)}</div>
  ${old&&old.h2_focus&&old.idx>0?`<div class="happen"><span class="label">지난번에 고른 바꿀 습관</span>${["","① 일 맡기기","② 평가하기","③ 자원 나누기","④ 설명하기"][old.h2_focus]}<br><span class="label">다시 한다면</span>${old.written&&old.written.again?old.written.again.행동:""}</div>`:""}
  <div class="btns"><button class="btn main" ${A(()=>{G=newGame();clearSave();next();beep(520,.1);})}>처음부터 시작</button>${old&&old.idx>0?`<button class="btn" ${A(()=>{G=old;render();})}>이어서 하기</button>`:""}</div>
  <button class="tool" style="justify-self:start" ${A(()=>{G=newGame();G.idx=CONTENT.findIndex(x=>x.id==="1-1")-1;G.pledge="(검토용 건너뛰기)";G.prio=["성과","사람"];next();})}>프롤로그 건너뛰기 (검토용)</button></div>`));
 },
 doc(s){
  shell(paint(`<div class="pane">${head(s)}<div class="prose">${val(s.html)}</div><div class="foot"><span class="note">${s.page||""}</span><button class="btn main" ${A(next)}>${s.btn||"다음"}</button></div></div>`));
 },
 note(s){
  shell(paint(`<div class="pane"><div class="eyebrow">📘 ${s.tag}</div><h2>${s.title}</h2><div class="prose">${para(s.body)}<p><b>${s.q}</b></p></div><div class="foot"><span></span><button class="btn main" ${A(next)}>${s.btn||"다음"}</button></div></div>`));
 },
 diag(s){
  const a={};
  const opts=["전혀 아니다","아니다","보통","그렇다","매우 그렇다"];
  const draw=()=>{paint("");const done=Object.keys(a).length===s.items.length;
   shell(`<div class="pane">${head(s)}<div class="prose">${para(s.intro)}</div><div>${s.items.map((it,i)=>`<div class="likert"><div>${it.t}</div><div class="scale">${opts.map((o,v)=>`<button aria-pressed="${a[i]===v+1}" ${A(()=>{a[i]=v+1;draw();})}>${o}</button>`).join("")}</div></div>`).join("")}</div>
   <div class="foot"><span class="note num">${Object.keys(a).length}/${s.items.length}</span><button class="btn main" ${done?"":"disabled"} ${A(()=>{
    const ax={1:[],2:[],3:[],4:[]};s.items.forEach((it,i)=>ax[it.a].push(it.r?6-a[i]:a[i]));
    G.diag={};for(const k in ax)G.diag[k]=Math.round((ax[k].reduce((x,y)=>x+y,0)/ax[k].length-1)/4*100);next();})}>완료</button></div></div>`);};
  draw();
 },
 pledge(s){
  let txt=G.pledge||"",pr=[...G.prio];
  const draw=()=>{paint("");const ok=txt.trim().length>=20&&pr.length===2;
   shell(`<div class="pane">${head(s)}<div class="prose">${para(s.intro)}</div>
   <label class="label" for="pl">나는 이런 팀장이 되겠다 (20자 이상)</label><textarea id="pl">${txt}</textarea>
   <div class="prose" style="font-size:15px"><p>${s.prioText}</p></div>
   <div class="btns">${SCORES.map(k=>`<button class="btn ${pr.includes(k)?"main":""}" ${A(()=>{const t=$("pl").value;txt=t;const i=pr.indexOf(k);if(i>=0)pr.splice(i,1);else if(pr.length<2)pr.push(k);draw();})}>${k}${pr.indexOf(k)>=0?" "+(pr.indexOf(k)+1)+"위":""}</button>`).join("")}</div>
   <div class="foot"><span class="note num" id="plc">${txt.trim().length}자</span><button class="btn main" id="pgo" ${ok?"":"disabled"} ${A(()=>{G.pledge=$("pl").value.trim();G.prio=pr;next();})}>임명장 받기</button></div></div>`);
   $("pl").oninput=e=>{txt=e.target.value;$("plc").textContent=txt.trim().length+"자";$("pgo").disabled=!(txt.trim().length>=20&&pr.length===2);};};
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
  shell(paint(`<div class="pane"><div class="eyebrow">${s.month}월</div><h2>${val(s.title)}</h2><div class="foot"><span></span><button class="btn main" ${A(next)}>${s.btn||"다음 달로"}</button></div></div>`));
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
 const st=CONTENT[G.idx]._st={sel:null,opened:{},done:{},mode:null,to:null,four:false,left:val(s.seconds),over:false,direct:0};
 G.seen=0;
 const startClock=()=>{if(CLOCK||st.over)return;CLOCK=setInterval(()=>{st.left--;if(st.left<=0){st.left=0;expire();}drawBar(st.left);},1000);};
 const expire=()=>{clearInterval(CLOCK);CLOCK=null;st.over=true;beep(240,.3,"square");
  s.mail.forEach(m=>{if(!st.done[m.id]){const r=resolveRow(m.hold);st.done[m.id]=r[0];applyFx(r[1],{rel:m.rel});G.f["h_"+m.id]=true;record(m.id,"시간 초과(보류)");}});
  draw();};
 const resolveRow=r=>typeof r==="function"?r(st.opened):r;
 const finish=(m,row,kind,to)=>{
  const r=resolveRow(row),[text,fx,sig,o]=r;
  st.done[m.id]=text;const live=applyFx(fx,{rel:m.rel});
  applySig(sig,.5,m.id,kind);record(m.id,kind+(to?":"+name(to):""));
  G.f[(kind==="직접"?"d_":kind==="보류"?"h_":"del_")+m.id]=true;
  if(kind==="직접"&&/①P/.test(sig||""))st.direct++;
  if(kind==="위임"){let p=10+((o&&o.ret)||0);if(st.four)p=Math.max(0,p-15);G.rets.push({id:m.id,p,to,four:st.four});}
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
   if(st.over||all){r=`<div class="rhead"><h2>${st.over?"10시입니다. 스탠드업이 시작됐습니다.":s.quiet&&s.quiet(G)?"10시 전에 받은편지함이 비었습니다.":"10시 전에 모두 처리했습니다."}</h2><p>${st.over?"처리하지 못한 메시지는 그대로 남았습니다.":""}</p></div><div class="btns"><button class="btn main" ${A(()=>{if(!st.direct)ach("손을 떼는 법");next();})}>스탠드업으로</button></div>`;}
   else r=`<div class="rhead"><h2>${s.title}</h2><p>${s.lead}</p></div>`;
  }else{
   const d=st.done[m.id],person=m.t==="DM";
   r=`<button class="back" ${A(()=>{st.sel=null;draw();})}>← 목록</button><div class="rhead"><h2>${m.sub}</h2><p>${m.from} · <span class="num">${m.at}</span></p></div><div class="body"><p class="${person?"voice":""}">${m.body}</p>${m.attach?`<p class="attach">${m.attach}</p>`:""}</div>`;
   if(d){r+=`<div class="happen"><span class="label">일어난 일</span>${d}</div>`;
    if(st.over||all)r+=`<div class="btns"><button class="btn main" ${A(()=>{if(!st.direct)ach("손을 떼는 법");next();})}>스탠드업으로</button></div>`;}
   else if(!st.over){
    r+=`<div class="ask">`;
    if(st.mode==="del"){
     r+=`<div class="label">누구에게 맡길까요?</div><div class="pick">${Object.keys(LD).map(k=>`<button aria-pressed="${st.to===k}" ${A(()=>{st.to=k;draw();})}>${face(k,G.trust[k])}${LD[k].n}</button>`).join("")}</div>
     <label class="chk"><input type="checkbox" id="four" ${st.four?"checked":""}><span>기대 결과·기한·권한·이유를 함께 전달한다<small>제한 시간에서 10초가 줄어듭니다.</small></span></label>
     <div class="btns"><button class="btn main" ${st.to?"":"disabled"} ${A(()=>{if(st.four)st.left=Math.max(1,st.left-10);finish(m,(m.to&&m.to[st.to])||m.other,"위임",st.to);})}>맡기기</button><button class="btn" ${A(()=>{st.mode=null;st.to=null;draw();})}>취소</button></div>`;
    }else r+=`<div class="btns"><button class="btn" ${A(()=>finish(m,m.self,"직접"))}>직접 처리</button>${m.noDel?"":`<button class="btn" ${A(()=>{st.mode="del";draw();})}>위임</button>`}<button class="btn" ${A(()=>finish(m,m.hold,"보류"))}>보류</button></div>`;
    r+=`</div>`;
   }
  }
  shell(`<div class="mail ${m?"open":""}"><div class="list"><div class="listhead"><span>받은편지함</span><span class="num">${nd}/${s.mail.length} 처리</span></div>${items}</div><div class="reader">${r}</div></div>`,live,st.left);
  const f=$("four");if(f)f.onchange=e=>{st.four=e.target.checked;};
 };
 draw();
}

/* 선택 장면: 결정 → (근거 → 알리기) → 일어난 일 */
function borrowLink(lack,redraw){return G.ot+lack<=3?`<div style="padding-left:32px"><button class="link" ${A(()=>{G.ot+=lack;G.time+=lack;G.burnout+=lack;beep(200,.12,"sawtooth");redraw();})}>야근 ${lack}을 빌려서 고를 수 있게 하기</button></div>`:"";}
const TELL=[{id:"full",t:"기준과 근거를 설명한다",c:2},{id:"short",t:"결과만 간단히 알린다",c:1},{id:"none",t:"따로 알리지 않는다",c:0}];
function SC_CHOICE(s,opt={}){
 if(s.enter&&!G.ent[s.id]){G.ent[s.id]=1;applyFx(val(s.enter),{rel:s.rel});}
 const mult=opt.mult||G.nextMult||undefined;
 let sel=null,why=null,tell=null,step=s.prep&&!G.ent[s.id+":p"]?"prep":"opt";
 const opts=val(s.options),O=()=>opts.find(o=>o.k===sel);
 if(s.pre)s.pre(G);
 const top=()=>`${head(s)}${s.top?val(s.top):""}<div class="prose">${para(s.intro||[])}</div>${(val(s.say)||[]).map(x=>sayHtml(x[0],val(x[1]))).join("")}${condLines(s)}${s.ref?`<details class="ref"><summary>참고 카드</summary><p style="margin-top:6px">${s.ref}</p></details>`:""}`;
 const draw=()=>{paint("");
  if(step==="prep"){
   const pick=(share)=>{G.ent[s.id+":p"]=1;let live={};if(share){G.time-=1;G.tu.all+=1;G.tu.exp+=1;G.shared++;live=applyFx(s.rel+"+2");applySig("④L",1,s.id,"기준 먼저 공유");}step="opt";drawSide(live);draw();};
   const short=G.time<1;
   shell(`<div class="pane">${head(s)}<p><b>면담 전에 어떻게 할까요?</b></p><div class="opts"><button class="opt" ${short?"disabled":""} ${A(()=>pick(true))}><span class="k">·</span><span>기준 문서를 먼저 보내고 의견을 묻는다</span><span class="cost">⏳1</span></button>${short?borrowLink(1,draw):""}<button class="opt" ${A(()=>pick(false))}><span class="k">·</span><span>면담 자리에서 바로 이야기한다</span><span class="cost"></span></button></div></div>`);
  }else if(step==="opt"){
   shell(`<div class="pane">${top()}${s.ask?`<p><b>${s.ask}</b></p>`:""}
   <div class="opts">${opts.map(o=>{const c=val(o.cost)||0,short=c>G.time,lack=c-G.time,tk=o.tok&&(G.token||0)<o.tok,dis=(o.dis&&o.dis(G))||(tk?`토큰이 모자랍니다. (${o.tok} 필요)`:"");const tag=[c?"⏳"+c:"",o.tok?"💳"+o.tok:"",o.tagText||""].filter(Boolean).join(" ");
    return `<button class="opt" aria-pressed="${sel===o.k}" ${short||dis?"disabled":""} ${A(()=>{sel=o.k;draw();})}><span class="k">${o.k}</span><span>${o.t}</span><span class="cost">${tag}</span>${dis?`<span class="why">${dis}</span>`:short?`<span class="why">팀장 시간이 ${lack} 모자랍니다.</span>`:""}</button>${short&&!dis?borrowLink(lack,draw):""}`}).join("")}</div>
   <div class="foot"><span class="note">결정한 뒤에는 고칠 수 없습니다.</span><button class="btn main" ${sel?"":"disabled"} ${A(()=>{const c=s.common;if(!c){finish();return;}step=c.noWhy?"tell":"why";draw();})}>결정</button></div></div>`);
  }else if(step==="why"){
   const list=has("pub_leaders")?[]:G.pub;
   shell(`<div class="pane"><div class="eyebrow">근거</div><h2>이 결정의 근거는 무엇입니까?</h2>${list.length?`<p class="note">공개한 기준만 나옵니다. 공개하지 않은 기준은 근거로 쓸 수 없습니다.</p><div class="opts">${list.map((w,i)=>`<button class="opt" style="grid-template-columns:24px minmax(0,1fr)" aria-pressed="${why===w}" ${A(()=>{why=w;draw();})}><span class="k">${i+1}</span><span>${w}</span></button>`).join("")}</div>`:`<div class="happen">${has("pub_leaders")?"공개한 기준이 없어 고를 수 없습니다.":"근거로 고를 수 있는 공개 기준이 아직 없습니다."} 이 결정은 "팀장 판단"으로 기록됩니다.</div>`}
   <div class="foot"><span></span><button class="btn main" ${list.length&&!why?"disabled":""} ${A(()=>{if(why){const fit=!!(s.common.fit&&((s.common.fit[sel]||[]).includes(why)||(s.common.fit[sel]||[]).some(x=>x.startsWith("어느 공개"))));G.cons.push({scene:s.id,choice:sel,why,fit:fit,half:has("rule_silent")&&["AI 활용 효과"].includes(why)});if(has("rule_silent")&&why==="AI 활용 효과"&&s.rel)applyFx(s.rel+"-1");}if(s.common.noTell||O().noTell){finish();}else{step="tell";draw();}})}>다음</button></div></div>`);
  }else if(step==="tell"){
   const left=G.time-(val(O().cost)||0);
   shell(`<div class="pane"><div class="eyebrow">알리기</div><h2>누구에게 어떻게 알릴까요?</h2>${s.tellNote?`<p class="note">${s.tellNote}</p>`:""}<div class="opts">${TELL.map(t=>{const short=t.c>left,lack=t.c-left;return `<button class="opt" aria-pressed="${tell===t.id}" ${short?"disabled":""} ${A(()=>{tell=t.id;draw();})}><span class="k">·</span><span>${t.t}</span><span class="cost">${t.c?"⏳"+t.c:"0"}</span>${short?`<span class="why">팀장 시간이 ${lack} 모자랍니다.</span>`:""}</button>${short?borrowLink(lack,draw):""}`}).join("")}</div>
   <div class="foot"><span></span><button class="btn main" ${tell?"":"disabled"} ${A(finish)}>확정</button></div></div>`);
  }
 };
 const finish=()=>{
  const o=O(),oc=val(o.cost)||0;if(oc){G.time-=oc;G.tu.all+=oc;if(s.meet)G.tu.meet+=oc;}if(o.tok){G.token=Math.max(0,G.token-o.tok);G.tokSpent[G.quarter]=(G.tokSpent[G.quarter]||0)+o.tok;}
  G.nextMult=undefined;
  const ex=s.ctxFn?s.ctxFn(G):{};
  let pos=1,neg=1;(s.boost||[]).forEach(b=>{if(b.o.includes(o.k)&&b.c(G))pos*=b.m;});(s.harm||[]).forEach(b=>{if(b.o.includes(o.k)&&b.c(G))neg*=b.m;});
  const live=applyFx(val(o.fx),{rel:s.rel,mult,...ex,pos:pos!==1?pos:undefined});applySig(val(o.sig),1,s.id,o.k);record(s.id,o.k);
  const base=s.id.replace(/_\d$/,"").replace(/[abc]$/,"");G.f["c_"+base+"_"+o.k]=true;G.f["c_"+s.id+"_"+o.k]=true;
  (s.xfx||[]).forEach(x=>{const inO=x.o.includes(o.k);if(x.c(G)&&(x.neg?!inO:inO))applyFx(val(x.fx),{live,rel:s.rel,mult});});
  if(o.pr)addPromise(o.pr);
  if(o.settle&&o.settle[1]!=="?")settle(o.settle[0],o.settle[1]==="이행",PROM_MEMBER[o.settle[0]]);
  if(o.ending)G.ends[ENDKEY[base]||base]=o.ending;
  const r=Math.random()*100;let acc=0,hit=null;
  (o.tw||[]).forEach((t,i)=>{if(hit)return;let p=typeof t.p==="function"?t.p(G):t.p;(s.mods||[]).forEach(m=>{if(m.o.includes(o.k)&&(m.i||0)===i&&m.c(G))p+=m.d;});acc+=Math.max(0,p);if(r<acc)hit=t;});
  const hits2=(o.tw2||[]).filter(t=>Math.random()*100<val(t.p));hits2.forEach(t=>applyFx(val(t.fx),{live,rel:s.rel}));
  if(hit){applyFx(val(hit.fx),{live,rel:s.rel,mult,...ex,neg:neg!==1?neg:undefined});if(hit.ending)G.ends[ENDKEY[base]||base]=hit.ending;if(hit.settle)settle(hit.settle[0],hit.settle[1]==="이행",PROM_MEMBER[hit.settle[0]]);}
  G.nextMult=hit&&hit.nextMult!=null?hit.nextMult:o.nextMult;
  if(o.onDone)o.onDone(G,hit);
  let tellLine="";
  if(tell){const t=TELL.find(x=>x.id===tell);G.time-=t.c;G.tu.all+=t.c;if(tell==="full")G.tu.exp+=t.c;G.told.total++;
   if(tell==="full"){G.told.full++;applyFx("안전+2");applySig("④L",1,s.id,"설명");if(Math.random()<.25){applyFx((s.rel||"mfg")+"-1",{live});tellLine=`${name(s.rel||"mfg")}: "이유는 알겠는데, 먼저 물어보실 수는 없었나요."`;}}
   if(tell==="none"){G.told.none++;applyFx("안전-2");applySig("④P",1,s.id,"안 알림");if(Math.random()<.4){applyFx("소문1",{live,rel:s.rel});tellLine="익명 게시판: \"왜 그렇게 정했는지 아는 분? 듣기로는 위에서 시켰다던데요.\"";}}}
  const tail=s.tail&&s.tail(G,o);if(tail&&tail.fx)applyFx(tail.fx,{live});
  const after=val(o.after);let afterDone=false;const go=()=>{(opt.done||next)(o,hit);};
  const says=(val(o.says)||[]);
  const drawR=()=>{paint("");
   shell(`<div class="pane"><div class="eyebrow">일어난 일</div><h2>${val(s.title)}</h2><div class="prose"><p>${val(o.done)||o.t}${o.recover?` (복구 ${val(o.recover)})`:""}</p>${hit&&!hit.who?`<p>${val(hit.t)}</p>`:""}${hits2.map(t=>`<p>${val(t.t)}</p>`).join("")}</div>${says.map(x=>sayHtml(x[0],x[1])).join("")}${hit&&hit.who?sayHtml(hit.who,val(hit.t)):""}${tail?sayHtml(tail.who,tail.t):""}${tellLine?`<div class="happen">${tellLine}</div>`:""}
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
 G.rets.forEach(r=>{const c=s.catalog[r.id];if(!c)return;if(Math.random()*100<r.p+(has("ret_more")?15:0))q.push({...r,c});else G.delegWin++;});
 G.rets=[];const list=q.slice(0,2);
 if(!list.length){next();return;}
 const step=i=>{
  if(i>=list.length){next();return;}
  const r=list[i],to=r.to,fail=(r.c.fail||"")+(r.id==="M05"?" `token_nodata`":"");
  const sc={id:s.id+r.id,title:r.c.title,tag:"되돌아온 일",when:val(s.when),intro:r.c.text?[r.c.text]:[],say:r.c.lines,rel:to,options:[
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
 const cm=s.comments.filter(c=>c.c(G)).map(c=>c.t);
 const keep=Math.max(cm.length?1:0,Math.round(cm.length*Math.min(1,G.safe/100*1.5)));
 const shown=cm.slice(0,keep);
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
 const a=lv(G.score.사람)*2,b=lv(G.score.안정)*2,c=lv(G.fsat);
 G.score.안정=Math.max(0,Math.min(100,G.score.안정+a));G.fsat=Math.max(0,Math.min(100,G.fsat+b));
 G.score.재무=Math.max(0,Math.min(100,G.score.재무+c*2));G.score.성과=Math.max(0,Math.min(100,G.score.성과+c));
 G.chain.push({q:G.quarter+1,사람_안정:a,안정_F사:b,F사_재무:c*2,F사_성과:c});
 (G.hist=G.hist||[]).push({...G.score,F사:G.fsat,안전:G.safe});
 const carry=Math.min(2,G.time),bonus=Math.min(2,G.delegWin),pen=G.ot?1:0;
 G.toldAll.full+=G.told.full;G.toldAll.none+=G.told.none;
 if(G.ot)applyFx("사람-"+G.ot);
 if(G.tokenCap)applyFx("재무-"+(G.tokenCap>=140?2:G.tokenCap>=100?1:0));
 if(G.tokenCap){const used=Math.round(G.tokenCap*(G.f.token_drain?.95:G.f.token_lean||G.f.token_audit?.6:.8));G.tokSpent[G.quarter]=(G.tokSpent[G.quarter]||0)+used;}
 const nq=G.nextQ||0;G.nextQ=0;
 G.big=0;G.delegWin=0;G.ot=0;G.told={full:0,none:0,total:0};G.quarter++;if(G.tokenCap)G.token=G.tokenCap;
 G.time=Math.max(0,(QUARTER_TIME[G.quarter]||12)+carry+bonus-pen+nq);
}

/* 핵심 과제 정의 */
function SC_TASKS(s){
 const pick=[],data={};
 const order=s.items.map((_,i)=>i).sort(()=>Math.random()-.5);
 const keep=()=>pick.forEach(i=>{const a=$("t"+i),b=$("c"+i);if(a)data[i]={t:a.value,c:b.value};});
 const draw=()=>{paint("");
  const ok=()=>pick.length===3&&pick.every(i=>{const a=$("t"+i),b=$("c"+i);return a&&a.value.trim().length>=10&&b&&b.value;});
  shell(`<div class="pane">${head(s)}<div class="prose">${para(s.intro)}</div><details class="ref"><summary>참고 카드</summary><p style="margin-top:6px">${s.ref}</p></details>
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
  G.f["talk_"+row.k]=true;G.f["talks_"+row.k]=(G.f["talks_"+row.k]||0)+1;record(s.id,row.k+":"+how);
  paint("");
  shell(`<div class="pane"><div class="eyebrow">일어난 일</div>${sayHtml(row.k,lines)}${caught?`<p>일주일 뒤, ${name(lead)}이 묻습니다. "제 사람 따로 만나셨다면서요."</p>`:""}<div class="foot"><span></span><button class="btn main" ${A(next)}>다음</button></div></div>`,live);
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
