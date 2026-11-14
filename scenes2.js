/* 특수 장면: 배분, 세 개의 설명, 반기 회고, 청구서, 연말 평가, 이의제기 */
const BTN=(fn,t,cls)=>`<button class="btn ${cls||""}" ${A(fn)}>${t}</button>`;
const AXN={1:"① 일 맡기기",2:"② 평가하기",3:"③ 자원 나누기",4:"④ 설명하기"};
/* 시간이 모자라 강제된 선택(forced)의 신호는 습관 계산에서 뺀다 */
function axScore(a,filter){const x=G.sig.filter((s,i)=>s.a===a&&!s.forced&&(!filter||filter(s,i)));const L=x.filter(s=>s.s==="L").reduce((p,s)=>p+s.w,0),P=x.filter(s=>s.s==="P").reduce((p,s)=>p+s.w,0);return{n:L+P,v:L+P?Math.round(L/(L+P)*100):null,L,P};}
function evid(a,side){const seen=[];G.sig.filter(s=>s.a===a&&s.s===side&&!s.forced).forEach(s=>{const n=label(s.scene,s.choice);if(!seen.includes(n))seen.push(n);});return seen.slice(0,3);}

/* 4-2 여력·토큰 배분과 공지문 (원고 03-4) */
function SC_ALLOC(s){
 const c={RUN:3,AI:3,GROW:2,SEC:2};const L0={RUN:"RUN 기존 운영",AI:"AI 전환",GROW:"GROW 추가 제안",SEC:"SEC 예방·보안"};
 let hold=0;const total=()=>c.RUN+c.AI+c.GROW+c.SEC+hold;
 const d1=()=>{paint("");
  shell(`<div class="pane"><div class="eyebrow">4월 · 여력 배분</div><h2>팀 여력 10칸 나누기</h2><div class="prose"><p>AI 전환으로 생긴 여력을 처음으로 나눕니다.</p></div>
  <details class="ref"><summary>참고 카드</summary><p style="margin-top:6px"><b>March(1991), 탐색과 활용</b><br>지금 하던 일을 더 잘하는 것과 새로운 일을 시도하는 것은 같은 사람, 같은 시간을 두고 다툽니다. 무엇을 하기로 했는지만큼, 무엇을 하지 않기로 했는지가 중요합니다.<br><b>생각해 볼 질문:</b> 이번 분기에 하지 않기로 한 일은 무엇입니까?</p></details>
  <div class="cond"><span>선임 때 고른 우선순위: ${G.prio.join(", ")}</span>${has("f_pilot")?"<span>F사 시범 과제로 GROW 1칸이 이미 잡혀 있습니다.</span>":""}${has("saw_gap")?"<span>재무팀 집계: 실제 확인된 절감은 주 38시간.</span>":""}${has("token_audit")?"<span>1분기 토큰 사용은 R&D와 마케팅이 전체의 81%.</span>":""}${has("night_wait")?"<span>2월에 야간 대기를 4월로 미뤘습니다.</span>":""}</div>
  <div class="table">${Object.keys(c).map(k=>`<div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px"><span style="font-size:14.5px;color:var(--ink)">${L0[k]}</span><span class="btns" style="align-items:center">${BTN(()=>{if(c[k]>0){c[k]--;d1();}},"−")}<b>${c[k]}</b>${BTN(()=>{if(total()<10){c[k]++;d1();}},"+")}</span></div>`).join("")}<div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px"><span style="font-size:14.5px;color:var(--ink)">보류 <span class="note">지금은 나누지 않고 남겨 둡니다. 6월 재배분 때 나눌 수 있습니다.</span></span><span class="btns" style="align-items:center">${BTN(()=>{if(hold>0){hold--;d1();}},"−")}<b>${hold}</b>${BTN(()=>{if(total()<10&&hold<4){hold++;d1();}},"+")}</span></div></div>
  <div class="foot"><span class="note num">${total()}/10칸${hold?` · 보류 ${hold}칸`:""}</span><button class="btn main" ${total()===10?"":"disabled"} ${A(done1)}>배분 확정</button></div></div>`);
 };
 const done1=()=>{
  const live={};const hi={RUN:"mfg+2 src+1",AI:"rd+2",GROW:"mkt+2",SEC:"prc+2 src+1"},lo={RUN:"mfg-4 src-2",AI:"rd-4",GROW:"mkt-3",SEC:"prc-3"};
  Object.keys(c).forEach(k=>{if(c[k]>=3)applyFx(hi[k],{live});else if(c[k]<=1)applyFx(lo[k],{live});});
  G.hold=hold;if(hold){applySig("③L",1,"4-2","확인된 만큼만 나눔");applyFx("재무+1 rd-1 mkt-1",{live});}
  G.cells={...c};if(has("f_pilot"))G.cells.GROW=Math.max(0,G.cells.GROW-1);
  if(has("night_wait")&&c.RUN<3)applyFx("안전-3");
  if(c.GROW>=5)applySig("③P",1,"4-2","GROW 5칸 이상");
  record("4-2",JSON.stringify(c));drawSide(live);
  d2();
 };
 let cap=G.tokenCap||100;
 const d2=()=>{paint("");
  shell(`<div class="pane"><div class="eyebrow">4월 · 토큰</div><h2>분기 토큰 한도</h2><div class="prose"><p>2월 초안은 분기 ${G.tokenCap||100}입니다. 한도가 높을수록 재무 성적표가 분기마다 깎입니다.</p></div>
  <div class="btns">${[60,100,140].map(v=>BTN(()=>{cap=v;d2();},(v===60?"짜게 ":v===100?"보통 ":"넉넉하게 ")+v,cap===v?"main":"")).join("")}</div>
  ${cap!==(G.tokenCap||100)?'<p class="note">재무팀 박 책임: "바뀐 한도로 다시 승인 올리겠습니다."</p>':""}
  <div class="foot"><span></span>${BTN(()=>{G.token=cap;G.tokenCap=cap;["token_low","token_mid","token_high"].forEach(f=>delete G.f[f]);G.f[cap===60?"token_low":cap===100?"token_mid":"token_high"]=true;
   SC_CHOICE({id:"4-2b",tag:"토큰 배분",when:"4월",title:"토큰을 어떻게 나눌까요?",options:[
    {k:"A",t:"1분기에 쓴 양대로 나눠 준다. 지금 쓰는 곳이 가장 필요한 곳이다.",done:"쓴 양대로 나눴습니다.",fx:"rd+2 mkt+1 src-2 prc-1",sig:"③P",tw:[{p:40,t:"많이 쓴 곳이 더 많이 쓰고 있습니다.",fx:"`token_drain`"}]},
    {k:"B",t:"모듈별로 기대 효과를 받아, 토큰당 효과가 큰 곳부터 먼저 배정한다.",cost:1,done:"토큰당 효과 순으로 배정했습니다.",fx:"재무+2 rd-1",sig:"③L",tw:[{p:35,t:"기대 효과를 부풀려 낸 모듈이 있습니다.",fx:"`token_game`"}]},
    {k:"C",t:"다섯 모듈에 똑같이 나누고, 남은 분은 분기 말에 모아서 다시 나눈다.",done:"똑같이 나눴습니다.",fx:"src+2 mfg+1 rd-4 mkt-2",tw:[{p:30,t:"조달이 남은 몫으로 작은 자동화를 시작했습니다.",fx:"성과+2 이야기:yoon+ `small_auto`"}]},
   ]},{done:d3});},"다음","main")}</div></div>`);
 };
 let nwarn="";const crit=[];let txt="";const CR=["효과","비용","장애·보안 위험","작년 실적","리더 요청량","팀장 재량"];
 const d3=()=>{paint("");
  shell(`<div class="pane"><div class="eyebrow">구성원 공지문</div><h2>왜 이렇게 나눴는지 쓰세요</h2><p><b>공지에 담을 배분 기준을 고르세요.</b></p><div class="btns">${CR.map(x=>BTN(()=>{txt=$("nt").value;const i=crit.indexOf(x);if(i>=0)crit.splice(i,1);else crit.push(x);d3();},x,crit.includes(x)?"main":"")).join("")}</div>
  <label class="label" for="nt">공지문 3~5문장 · 왜 이렇게 나눴는지, 무엇을 하지 않기로 했는지</label><textarea id="nt" style="min-height:130px">${txt}</textarea>
  <p><b>어떻게 보낼까요?</b></p><div class="opts">
  <button class="opt" ${G.time<2?"disabled":""} ${A(()=>{txt=$("nt").value;const rd=readable(txt,20);if(!rd.ok){nwarn="공지문: "+rd.why;d3();return;}nwarn="";send("full");})}><span class="k">·</span><span>쓴 공지문을 팀 전체에 보낸다</span><span class="cost">⏳2</span>${G.time<2?`<span class="why">${lackText(2-G.time)}</span>`:""}</button>${G.time<2?borrowLink(2-G.time,()=>{txt=$("nt").value;d3();}):""}
  <button class="opt" ${G.time<1?"disabled":""} ${A(()=>send("num"))}><span class="k">·</span><span>배분 숫자만 알린다</span><span class="cost">⏳1</span>${G.time<1?`<span class="why">${lackText(1-G.time)}</span>`:""}</button>${G.time<1?borrowLink(1-G.time,()=>{txt=$("nt").value;d3();}):""}
  <button class="opt" ${A(()=>send("none"))}><span class="k">·</span><span>보내지 않는다</span><span class="cost">0</span></button></div>${nwarn?`<div class="happen"><span class="label">보내기 전에</span>${nwarn}</div>`:""}</div>`);
 };
 /* 줄일 칸의 순서를 실제로 고른다. 8월 본사 차출 때 이 순서대로 줄인다 */
 const CELLN={RUN:"운영(RUN)",AI:"AI 전환(AI)",GROW:"추가 제안(GROW)",SEC:"예방·보안(SEC)"};
 const dOrder=ord=>{paint("");
  shell(`<div class="pane"><div class="eyebrow">4월 · 재검토 조건</div><h2>여력이 줄면 어느 칸부터 줄일까요?</h2><p class="note">먼저 줄일 칸부터 차례로 누르세요. 8월에 실제로 여력이 줄면 이 순서를 씁니다.</p>
  <div class="opts">${Object.keys(CELLN).map(k=>{const i=ord.indexOf(k);return `<button class="opt" style="grid-template-columns:24px minmax(0,1fr)" aria-pressed="${i>=0}" ${A(()=>{const o=ord.slice();if(i>=0)o.splice(i,1);else o.push(k);dOrder(o);})}><span class="k">${i>=0?i+1:""}</span><span>${CELLN[k]} · 지금 ${G.cells[k]}칸</span></button>`;}).join("")}</div>
  <div class="foot"><span class="note num">${ord.length}/4</span><span class="btns"><button class="btn main" ${ord.length===4?"":"disabled"} ${A(()=>{G.time-=.5;G.tu.all+=.5;G.cutOrder=ord.slice();applyFx("`planb_alloc`");record("4-2순서",ord.join(">"));next();})}>이 순서로 적어 둔다</button>${BTN(next,"정하지 않는다")}</span></div></div>`);};
 const send=m=>{
  txt=$("nt").value;const three=["효과","비용","장애·보안 위험"].every(x=>crit.includes(x));
  G.written.notice={기준:[...crit],글:m==="none"?"미공지":txt,방식:m};G.goal3={three,sent:m==="full"};
  const live={};let line="",forcedA=false;
  if(m==="full"){G.time-=2;G.tu.all+=2;G.tu.exp+=2;applyFx("안전+2 `alloc_notice`"+(three?" 사람+1":""),{live});applySig("④L",1,"4-2","공지");if(three)applySig("③L",1,"4-2","세 기준");
   if(Math.random()<.25){const min=Object.keys(c).sort((a,b)=>c[a]-c[b])[0],who={RUN:"mfg",AI:"rd",GROW:"mkt",SEC:"prc"}[min];applyFx(who+"-2",{live});line=`${name(who)}: "왜 ${({RUN:"운영(RUN)",AI:"AI 전환(AI)",GROW:"추가 제안(GROW)",SEC:"예방·보안(SEC)"})[min]} 칸은 ${c[min]}칸뿐이에요?"`;}}
  else if(m==="num"){G.time-=1;G.tu.all+=1;G.f.alloc_num=true;applyFx("B5+15");}
  else if(G.time<1){G.f.alloc_none=true;(G.forcedF=G.forcedF||{}).alloc_none="4-2";G.forcedTell=(G.forcedTell||0)+1;applyFx("안전-2",{live});applySig("③P ④P",1,"4-2","미공지",true);forcedA=true;}
  else{G.f.alloc_none=true;applyFx("안전-2 B5+30 소문규칙",{live,rel:"rd"});applySig("③P ④P",1,"4-2","미공지");}
  record("4-2공지",m,forcedA?{forced:true,locked:["알리기:full","알리기:num"],lockedTell:true}:null);
  {const tb=G.f["c_4-2b_A"]?["작년 실적","리더 요청량"]:G.f["c_4-2b_B"]?["효과","비용"]:G.f["c_4-2b_C"]?["팀장 재량"]:[];const tn=G.f["c_4-2b_A"]?"1분기에 쓴 양대로":G.f["c_4-2b_B"]?"토큰당 효과 순으로":"모듈마다 똑같이";
   if(m!=="none"&&crit.length&&tb.length&&!tb.some(x=>crit.includes(x))){G.f.notice_gap=true;G.cons.push({scene:"4-2",choice:"공지",why:crit.join("·"),fit:false});line=(line?line+"</p><p>":"")+`공지에는 "${crit.join(", ")}"(으)로 나눴다고 썼습니다. 토큰은 ${tn} 나눴습니다. 두 내용이 함께 팀에 남았습니다.`;}}
  paint("");
  shell(`<div class="pane"><div class="eyebrow">일어난 일</div><h2>배분을 마쳤습니다</h2><div class="prose"><p>${m==="full"?"공지문을 팀 전체에 보냈습니다.":m==="num"?"배분 숫자를 알렸습니다.":"따로 알리지 않았습니다."}</p>${line?`<p>${line}</p>`:""}</div>
  <div class="ask"><p>팀 여력이 갑자기 줄면 어느 칸부터 줄일지, 순서를 미리 정해 둘까요?</p><div class="btns"><button class="btn" ${G.time<.5?"disabled":""} ${A(()=>dOrder([]))}>순서를 정한다 ⏳0.5</button>${BTN(next,"정하지 않는다")}</div></div></div>`,live);
 };
 d1();
}

/* 세 개의 설명 (원고 03-6 6-2, 03-9 9-6, 03-12 12-6) */
const KW={crit:["실측","절감","비용","위험","효과","기준","원칙","근거"],why:/때문|이유는|위해|에 따라|규정|절차대로/};
/* 자동 참고 채점: 낱말을 늘어놓은 글에 속지 않게 문장 형식부터 본다 */
const WR_PAST=/[았었였했됐냈웠렸졌쳤겼갔왔]습니다|[았었였했됐]어요|[았었였했]다(?=[\s.!?]|$)|말씀드린|드렸|공개한|했던|한 대로|지난/g;
const WR_TIME=/\d+월\s*\d+일까지|\d+월\s*\d+일|\d+월 말까지|\d+월까지|\d+월|\d+일까지|\d+일|[가-힣0-9]+까지|기한|다음 주|다음 달|다음 회의|다음 분기|내년|이번 주|이번 달|매주|매월|매달|분기마다|오늘|내일/;
const WR_ASK=/(적어|기록해|알려|말해|올려|남겨|신청해|확인해|제출해)\s*주(세요|시기|십시오)/;
function wrSentences(x){return String(x).split(/(?<=[.!?。…])\s+|\n+/).map(v=>v.trim()).filter(Boolean);}
/* 문장 수, 서술어로 끝난 문장 비율, 같은 낱말 반복, 평균 문장 길이 */
function wrForm(x){const ss=wrSentences(x),pred=ss.filter(v=>/(다|요|죠|까|오)["'”’)\]]*[.!?。…]*$/.test(v)).length;
 const tk=x.match(/[가-힣A-Za-z0-9%]{2,}/g)||[],fq={};tk.forEach(w=>fq[w]=(fq[w]||0)+1);const top=Object.entries(fq).sort((a,b)=>b[1]-a[1])[0]||["",0];
 const triple=/([가-힣A-Za-z0-9]{2,})(\s+\1){2}/.test(x.replace(/[.,!?]/g," ").replace(/\s+/g," "));const avg=ss.length?tk.length/ss.length:0;
 const bad=[];if(pred<3)bad.push(`3~5문장이 필요한데 서술어로 끝난 문장이 ${pred}개입니다`);else if(pred/ss.length<.6)bad.push("서술어로 끝나지 않은 줄이 많습니다");
 if(triple||(top[1]>=4&&top[1]/tk.length>=.2))bad.push(`같은 낱말 "${top[0]}"${jo(top[0],"을","를")} 되풀이했습니다`);if(ss.length&&avg<3)bad.push("문장이 너무 짧습니다");
 return{n:ss.length,pred,avg,bad,long:pred>5};}
/* 다음 단계: 과거 표현 뒤에 남은 부분에 때를 나타내는 말이나 요청이 있을 때만 인정한다 */
function wrNext(x){for(const v of wrSentences(x)){let rest=v,m;WR_PAST.lastIndex=0;while((m=WR_PAST.exec(v)))rest=v.slice(m.index+m[0].length);const t=rest.match(WR_TIME)||rest.match(WR_ASK);if(t)return t[0];}return null;}
/* AI 초안과 겹치는 문장의 비율 */
function wrDraftOverlap(x,d){const ss=wrSentences(x),ds=wrSentences(d);if(!ss.length||!ds.length)return 0;const hit=ss.filter(v=>ds.some(w=>jacc(v,w)>=.8)).length;return Math.max(hit/ss.length,jacc(x,d)>=.7?1:0);}
function wrScore(x,t,why,d,noOv){const m=[],hitw=[];let n=0;
 const cw=[...KW.crit,...(why?[why]:[]),...principleList()].find(w=>x.includes(w))||(x.match(KW.why)||[])[0];if(cw){n++;hitw.push(`기준 "${cw}"`);}else m.push("무엇을 기준으로 정했는지");
 const qw=(val(t.ans)||[]).find(w=>x.includes(w));if(qw){n++;hitw.push(`질문에 답한 말 "${qw}"`);}else m.push(`이 사람의 질문("${val(t.q)}")에 대한 답`);
 const nx=wrNext(x);if(nx){n++;hitw.push(`다음 단계 "${nx}"`);}else m.push("앞으로 언제 무엇을 하는지");
 const form=wrForm(x),ov=wrDraftOverlap(x,d),flags=[];
 if(form.bad.length){n=0;flags.push("문장으로 쓰지 않았습니다 ("+form.bad.join(", ")+"). 0점으로 기록합니다");}
 else{if(ov>=.6&&!noOv){n=Math.max(0,n-1);flags.push("초안을 거의 그대로 보냈습니다 (1점 감점)");}if(form.long)flags.push("3~5문장보다 깁니다");}
 return{n,hitw,m,flags,ov:Math.round(ov*100),form};}
function jacc(a,b){const g=t=>{const s=new Set();t=t.replace(/\s/g,"");for(let i=0;i<t.length-1;i++)s.add(t.slice(i,i+2));return s;};const x=g(a),y=g(b);if(!x.size||!y.size)return 0;let n=0;x.forEach(v=>{if(y.has(v))n++;});return n/(x.size+y.size-n);}
function SC_WRITE(s){
 let why=null,draftUsed=false;const texts={};s.targets.forEach(t=>texts[t.k]="");
 const list=principleList().concat(gradeList());
 const d1=()=>{paint("");
  shell(`<div class="pane"><div class="eyebrow">세 개의 설명</div><h2>${val(s.title)}</h2><div class="prose">${para(s.intro||[])}</div><p><b>이 결정의 근거를 고르세요.</b></p>${list.length?`<div class="opts">${list.map((w,i)=>`<button class="opt" style="grid-template-columns:24px minmax(0,1fr)" aria-pressed="${why===w}" ${A(()=>{why=w;d1();})}><span class="k">${i+1}</span><span>${w}</span></button>`).join("")}</div>`:'<div class="happen">공개한 기준이 없습니다. "팀장 판단"으로 기록됩니다.</div>'}<div class="foot"><span></span><button class="btn main" ${list.length&&!why?"disabled":""} ${A(()=>{if(why){const f=fitSet(val(s.fit)||[]);const fit=f.any||f.grade.includes(why)||f.prin.includes(why);G.cons.push({scene:s.id,choice:"글",why,fit});}d2();})}>쓰기 시작</button></div></div>`);
 };
 /* AI 초안은 받는 사람마다 다르고, 그럴듯하지만 고쳐야 할 곳이 하나씩 섞여 있다 */
 const dOf=t=>{const ds=val(s.drafts);return (ds&&ds[t.k]&&ds[t.k].t)||val(s.draft);};
 const trapLeft=t=>{const ds=val(s.drafts);const tr=ds&&ds[t.k]&&ds[t.k].trap;return !!(tr&&tr.test(texts[t.k]));};
 const grab=()=>s.targets.forEach(t=>{const e=$("w"+t.k);if(e)texts[t.k]=e.value;});
 const d2=()=>{paint("");
  const cl=(s.conds||[]).filter(c=>c.c(G)).map(c=>`<span>${c.t}</span>`).join("");
  const can=(G.token||0)>=5&&!draftUsed;
  shell(`<div class="pane"><div class="eyebrow">세 개의 설명</div><h2>세 사람에게 각각 3~5문장으로 쓰세요</h2><p class="note">⏳은 들지 않습니다. 보낸 뒤에는 고칠 수 없습니다.</p>${cl?`<div class="cond">${cl}</div>`:""}
  ${s.targets.map(t=>`<div class="task"><b>${val(t.n)}</b><span class="voice" style="font-size:15px">${val(t.q)}</span><label class="label" for="w${t.k}">${t.form}</label><textarea id="w${t.k}" style="min-height:110px">${texts[t.k]}</textarea></div>`).join("")}
  <div class="foot"><button class="btn" ${can?"":"disabled"} ${A(()=>{grab();draftUsed=true;G.token-=5;G.tokSpent[G.quarter]=(G.tokSpent[G.quarter]||0)+5;G.f.ai_draft=true;s.targets.forEach(t=>texts[t.k]=dOf(t));d2();})}>승인 도구로 초안 받기 💳5</button><button class="btn main" ${A(send)}>세 편 보내기</button></div>${warn?`<div class="happen"><span class="label">보내기 전에</span>${warn}</div>`:""}</div>`);
 };
 let warn="";
 const send=()=>{grab();
  const badT=s.targets.filter(t=>texts[t.k].trim()&&!readable(texts[t.k],12).ok);if(badT.length){warn=badT.map(t=>`${val(t.n)}에게 쓴 글: ${readable(texts[t.k],12).why}`).join("<br>");d2();return;}warn="";
  const d=val(s.draft),res={},live={},flag={},over={};let sum=0,missing=0,miss={};
  s.targets.forEach(t=>{const x=texts[t.k].trim();if(!x){missing++;res[t.k]=-1;return;}
   const r=wrScore(x,t,why,dOf(t),draftUsed&&!!val(s.drafts));if(draftUsed&&val(s.drafts)&&!r.form.bad.length){if(trapLeft(t)){r.n=Math.max(0,r.n-1);r.flags.push("AI 초안의 틀린 내용이 그대로 남았습니다: "+val(s.drafts)[t.k].why+" (1점 감점)");}else if(r.ov>=60)r.flags.push("AI 초안에서 틀린 곳을 고쳐 보냈습니다");}miss[t.k]=r.m;flag[t.k]=r.flags;over[val(t.n)]=r.ov;(G.wroteHit=G.wroteHit||{})[s.id+t.k]=r.hitw;res[t.k]=r.n;sum+=r.n;});
  const v=s.targets.filter(t=>texts[t.k].trim());let copy=false;for(let i=0;i<v.length;i++)for(let j=i+1;j<v.length;j++)if(jacc(texts[v[i].k],texts[v[j].k])>=.7)copy=true;
  G.written[s.id]={근거:why,글:{...texts},자동참고:res,초안미수정:s.targets.filter(t=>texts[t.k].trim()===dOf(t)).map(t=>val(t.n)),초안받음:draftUsed,초안오류남음:draftUsed?s.targets.filter(t=>trapLeft(t)).map(t=>val(t.n)):[],초안겹침:over,형식:Object.fromEntries(s.targets.filter(t=>(flag[t.k]||[]).length).map(t=>[val(t.n),flag[t.k]]))};
  if(!missing&&sum>=6)applySig("④L",1,s.id,"세 편");if(missing){applySig("④P",1,s.id,"미공지");applyFx("안전-2 소문규칙",{live,rel:"rd"});}
  G.wrote[s.id]=sum;(G.wrotePieces=G.wrotePieces||{})[s.id]=Object.values(res);
  const lines=[];
  s.targets.forEach(t=>{const n=res[t.k];if(n<0){lines.push(`${val(t.n)}: 미공지로 기록했습니다.`);return;}const i=n>=3?0:n===2?1:2;lines.push(`${val(t.n)}${/^[^"“:]{1,12}: /.test(t.reply[i][0])?" · ":": "}${t.reply[i][0]}`);{const h=(G.wroteHit||{})[s.id+t.k]||[];lines.push(`<span class="note">└ 자동 참고 채점 ${n}/3${h.length?" · 찾은 것: "+h.join(", "):""}${miss[t.k]&&miss[t.k].length?" · 없던 것: "+miss[t.k].join(", "):""}${(flag[t.k]||[]).length?" · "+flag[t.k].join(" · "):""}. 낱말을 찾는 참고 점수이며, 최종 평가는 사람이 합니다.</span>`);}applyFx(t.reply[i][1],{live});});
  if(draftUsed){const tg=s.targets.filter(t=>texts[t.k].trim());(G.draftLog=G.draftLog||{})[s.id]={n:tg.length,left:tg.filter(t=>trapLeft(t)).length};}
  if(s.bad6&&texts.f.includes("140시간")&&draftUsed)applyFx("B6+10");
  if(copy){G.f.copy_voice=true;applyFx("F사만족-2 안전-2",{live});lines.push("유 과장: \""+vary("copyF",["사내 공지가 잘못 온 줄 알았습니다.","저희한테 온 메일이 맞나요? 팀 공지 같아서요.","받는 사람 이름만 바꾸신 것 같습니다."])+"\"");lines.push("게시판: \""+vary("copyT",["고객한테 보낸 메일이네.","위에 낸 보고서를 그대로 붙였네요.","이 글, 우리한테 쓴 게 아닌데요."])+"\"");}
  let leak=false;const bk=s.targets.find(t=>t.k==="b"),tk=s.targets.find(t=>t.k==="t");
  if(s.id==="6-2"&&Math.random()<.25&&texts.b.trim()){leak=true;G.written[s.id].유출="사업부장 글이 팀 메신저에 돌았음";}
  if(s.after)s.after(G,texts,live,lines);
  record(s.id,"제출");paint("");
  const esc=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;");
  shell(`<div class="pane"><div class="eyebrow">일어난 일</div><h2>보냈습니다</h2><div class="prose">${lines.map(l=>`<p>${l}</p>`).join("")}</div>${leak?`<p>사업부장에게 보낸 글이 캡처되어 팀 메신저에 돌고 있습니다.</p><div class="grid2"><div class="task"><b>${val(bk.n)}에게</b><span class="voice" style="font-size:15px">${esc(texts.b)}</span></div><div class="task"><b>${val(tk.n)}에게</b><span class="voice" style="font-size:15px">${esc(texts.t)||"(보내지 않음)"}</span></div></div>`:""}<div class="foot"><span></span>${BTN(next,"다음","main")}</div></div>`,live);
 };
 d1();
}

/* 반기 회고 (원고 03-6 R-1~R-7) */
function SC_REVIEW(s){
 let page=1;
 const add={RUN:0,AI:0,GROW:0,SEC:0};let moves=0;let focus=null;
 const nextBtn=(t,fn)=>`<div class="foot"><span></span>${BTN(fn||(()=>{page++;draw();}),t||"다음","main")}</div>`;
 const draw=()=>{paint("");window.scrollTo(0,0);
  if(page===0)shell(`<div class="pane"><div class="eyebrow">📘 온보딩 노트③</div>${noteInline(2)}${nextBtn()}</div>`);
  else if(page===1){const h=G.hist||[];shell(`<div class="pane"><div class="eyebrow">반기 회고</div><h2>중간 성적표</h2><p class="note">시작 → 3월 말 → 6월 말</p><div class="table">${SCORES.map(k=>`<div class="card" style="display:flex;justify-content:space-between;gap:8px"><span style="font-size:14px;color:var(--ink)">${k}${G.prio.includes(k)?" · 우선순위":""}</span><span class="num">50 → ${h[0]?h[0][k]:"-"} → <b style="font-size:16px">${h[1]?h[1][k]:G.score[k]}</b></span></div>`).join("")}<div class="card" style="display:flex;justify-content:space-between"><span style="font-size:14px;color:var(--ink)">F사 만족</span><span class="num">50 → ${h[0]?h[0].F사:"-"} → <b>${h[1]?h[1].F사:G.fsat}</b></span></div></div>${G.pulse.length?`<p class="note">펄스 세 문항 · 1분기 ${(G.pulse[0]||[]).join(" / ")} · 2분기 ${(G.pulse[1]||[]).join(" / ")}</p>`:""}${(G.chain||[]).map(chainLine).filter(Boolean).map(t=>`<p class="note">${t}</p>`).join("")}${nextBtn()}</div>`);}
  else if(page===2)shell(`<div class="pane"><div class="eyebrow">반기 회고</div><h2>스스로 본 나와 상반기 기록</h2><div class="table">${[1,2,3,4].map(a=>{const r=axScore(a);return `<div class="task"><b>${AXN[a]}</b>${r.n<8?'<p class="note">기록이 적어 판단하지 않습니다.</p>':`<p class="num">스스로는 리더 쪽 ${G.diag?G.diag[a]:"-"}% · 상반기 실제 행동은 리더 쪽 ${r.v}%</p><p class="note">일치: ${evid(a,"L").join(", ")||"없음"}</p><p class="note">균열: ${evid(a,"P").join(", ")||"없음"}</p>`}</div>`}).join("")}</div>${nextBtn()}</div>`);
  else if(page===3){const keyOf=r=>r[0].split(" ")[0];const hot=r=>{const k=keyOf(r);const ks=k.startsWith("M21")?["M21","M22","M23"]:[k];return G.sig.some(x=>ks.some(y=>x.scene===y||x.scene.startsWith(y)))||(G.bills||[]).some(b=>(BILL_CAUSE[b]||[]).some(c=>Array.isArray(c)&&ks.includes(c[2])&&(typeof c[0]==="function"?c[0](G):G.f[c[0]])));};
   const first=REVIEW1.filter(hot).slice(0,8),rest=REVIEW1.filter(r=>!first.includes(r));
   shell(`<div class="pane"><div class="eyebrow">반기 회고</div><h2>상반기 결정 복기</h2><p class="note">처음으로 결정별 해설을 보여 드립니다. 정답이 아니라, 그 결정이 무엇과 무엇을 바꿨는지입니다.</p><div class="prose" style="font-size:15px">${first.map(r=>`<p><b>${stripId(r[0])}</b> ${r[1]}</p>`).join("")}</div>${rest.length?`<details class="ref"><summary>전체 보기</summary><div class="prose" style="font-size:15px;margin-top:8px">${rest.map(r=>`<p><b>${stripId(r[0])}</b> ${r[1]}</p>`).join("")}</div></details>`:""}${nextBtn()}</div>`);}
  else if(page===4){const ok=()=>["a","b","c"].every(k=>readable(($("ag"+k)||{}).value,8).ok)&&["a","b","c"].every(k=>$("ag"+k).value.trim().length>=20)&&$("agp").value;
   shell(`<div class="pane"><div class="eyebrow">반기 회고</div><h2>다시 한다면</h2><label class="label" for="agp">복기한 결정 하나를 고르세요</label><select id="agp"><option value="">고르세요</option>${REVIEW1.map(r=>`<option value="${r[0]}">${stripId(r[0])}</option>`).join("")}</select>
   ${[["a","그때 내가 맞다고 믿은 것"],["b","지금 다시 보니 달라 보이는 것"],["c","하반기에 실제로 바꿀 행동 하나"]].map(([k,t])=>`<label class="label" for="ag${k}">${t} (20자 이상)</label><textarea id="ag${k}"></textarea>`).join("")}
   <div class="foot"><span></span><button class="btn main" id="ago" disabled ${A(()=>{G.written.again={결정:$("agp").value,믿음:$("aga").value,달라짐:$("agb").value,행동:$("agc").value};page++;draw();})}>다음</button></div></div>`);
   const up=()=>{$("ago").disabled=!ok();};["a","b","c"].forEach(k=>$("ag"+k).oninput=up);$("agp").onchange=up;}
  else if(page===5){const sum=add.RUN+add.AI+add.GROW+add.SEC;const free=2+(G.hold||0)+moves-sum;
   shell(`<div class="pane"><div class="eyebrow">반기 회고</div><h2>하반기 전략</h2><p><b>성적표 우선순위</b> <span class="note">바꾸면 결산에 "6월에 우선순위를 바꿈"으로 표시됩니다.</span></p><div class="btns">${SCORES.map(k=>BTN(()=>{const i=G.prio.indexOf(k);if(i>=0){if(G.prio.length>1){G.prio.splice(i,1);G.f.prio_changed=true;}}else if(G.prio.length<2){G.prio.push(k);G.f.prio_changed=true;}draw();},k,G.prio.includes(k)?"main":"")).join("")}</div>
   <p><b>여력 다시 나누기</b> <span class="note">2칸이 새로 생겼고, 기존에서 최대 2칸을 옮길 수 있습니다.${G.hold?` 4월에 보류한 ${G.hold}칸도 지금 나눕니다.`:""}</span></p>
   <div class="cond">${has("c_4-3_C")?'<span>강태식: "6월 재배분 때 듣겠다고 하셨죠."</span>':""}${has("ct_more")?"<span>6월 계약의 GROW 2칸이 이미 쓰이고 있습니다.</span>":""}${has("q2_prevent")||has("pm_root")?"<span>점검표 축소 작업이 SEC 칸을 쓰고 있습니다.</span>":""}${G.over?`<span>지난 분기에 초과 부하가 ${G.over}회 있었습니다.</span>`:""}</div>
   <div class="table">${Object.keys(add).map(k=>`<div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px"><span style="font-size:14.5px;color:var(--ink)">${k}</span><span class="btns" style="align-items:center">${BTN(()=>{if(G.cells[k]+add[k]>0){if(add[k]<=0&&moves>=2)return;if(add[k]<=0)moves++;add[k]--;draw();}},"−")}<b>${G.cells[k]+add[k]}</b>${BTN(()=>{if(free>0){if(add[k]<0)moves--;add[k]++;draw();}},"+")}</span></div>`).join("")}</div>
   <div class="foot"><span class="note num">남은 칸 ${free} · 이동 ${moves}/2</span><button class="btn main" ${free===0?"":"disabled"} ${A(()=>{const live={};const hi={RUN:"mfg+2 src+1",AI:"rd+2",GROW:"mkt+2",SEC:"prc+2 src+1"},lo={RUN:"mfg-4 src-2",AI:"rd-4",GROW:"mkt-3",SEC:"prc-3"};
     Object.keys(add).forEach(k=>{G.cells[k]+=add[k];if(add[k]){if(G.cells[k]>=3)applyFx(hi[k],{live});else if(G.cells[k]<=1)applyFx(lo[k],{live});}});
     if(G.cells.GROW>=5)applySig("③P",1,"R-6","GROW 5칸 이상");if(moves>=2)applyFx("큰변화1");record("R-6",JSON.stringify(G.cells));G.hold=0;
     if(has("c_4-3_C")){if(add.RUN>0)applyFx("mfg+3",{live});else applyFx("mfg-3 안전-1",{live});}
     drawSide(live);page=moves?6:7;draw();})}>확정</button></div></div>`);}
  else if(page===6)shell(`<div class="pane"><div class="eyebrow">반기 회고</div><h2>바뀐 배분을 어떻게 알릴까요?</h2><p class="note">⏳은 3분기 몫에서 씁니다.</p><div class="opts"><button class="opt" ${A(()=>{G.time-=1;G.tu.all+=1;G.tu.exp+=1;applyFx("안전+1 `alloc_renotice`");applySig("④L",1,"R-6","재공지");page=7;draw();})}><span class="k">·</span><span>옮긴 칸과 이유를 알린다</span><span class="cost">⏳1</span></button><button class="opt" ${A(()=>{applyFx("안전-2 소문규칙",{rel:"rd"});applySig("④P",1,"R-6","숫자만");page=7;draw();})}><span class="k">·</span><span>숫자만 고쳐 둔다</span><span class="cost">0</span></button></div></div>`);
  else if(page===7)shell(`<div class="pane"><div class="eyebrow">반기 회고</div><h2>하반기에 바꿀 습관</h2><div class="opts">${[1,2,3,4].map(a=>`<button class="opt" style="grid-template-columns:24px minmax(0,1fr)" aria-pressed="${focus===a}" ${A(()=>{focus=a;draw();})}><span class="k">${a}</span><span>${AXN[a]}</span></button>`).join("")}</div><div class="foot"><span></span><button class="btn main" ${focus?"":"disabled"} ${A(()=>{G.h2_focus=focus;G.f.h2_focus=true;G.h2At=G.sig.length;page++;draw();})}>정했습니다</button></div></div>`);
  else shell(`<div class="pane"><div class="eyebrow">저장</div><h2>상반기 기록을 저장했습니다</h2><div class="prose"><p>7월부터 이어서 진행할 수 있습니다.</p><p class="note">바꿀 습관: ${AXN[G.h2_focus]}</p><p class="note">다시 한다면: ${G.written.again?G.written.again.행동:""}</p></div>${nextBtn("7월로",()=>next())}</div>`);
 };
 draw();
}
const REVIEW1=[["M13 스크립트","직접 고치면 오늘의 장애가 끝납니다. 대신 다음번에 누가 고칠지가 정해집니다."],["1-2 김 사원","휴가 한 건은 팀장이 풀 수 있습니다. 대기표가 왜 그런지는 휴가로 풀리지 않습니다."],["2-2 윤 책임","익명 글은 글쓴이를 찾는 순간 다른 글이 됩니다. 답을 할 때는 답할 수 있는 범위도 함께 정해집니다."],["2-5 야간 대기","쏠림을 팀장이 고치면 빠르고, 리더가 고치면 그 리더의 일로 남습니다. 어느 쪽이든 누군가의 체면이 듭니다."],["3-1 KPI 합의서","여기서 고른 기준만 앞으로 근거가 됩니다. 넓게 공개할수록 묻는 사람이 늘고, 줄일수록 나중에 설명할 말이 줄어듭니다."],["3-7 배 책임","답하지 못할 질문에 기한을 주면 시간은 벌지만 장부에 약속이 남습니다."],["M21~M23 절감 숫자","140과 38은 같은 표에 있었습니다. 어느 쪽이 밖으로 나갔는지가 6월 협상의 출발점을 바꿨습니다."],["4-2 배분 공지","무엇을 하기로 했는지보다 무엇을 하지 않기로 했는지가 팀원의 일을 정합니다."],["4-4 한 선임","공로 문제를 사람에게 풀면 그 사람은 위로받고, 규칙으로 풀면 다음 사람이 덕을 봅니다. 둘 다 잃는 쪽이 있습니다."],["5-1 공용 인력","점검표에 사람을 주지 않은 것이 틀렸다고 말할 수는 없습니다. 그때는 어떤 정보로 결정했는지를 되짚어 보세요."],["5-2 사후 분석","금요일까지 보고가 필요했고, 왜 건너뛰었는지도 알아야 했습니다. 두 질문은 같은 답을 주지 않습니다."],["6-1 F사 계약","숫자가 믿을 만한지와 관계가 유지되는지를 맞바꿨습니다. 결과는 9월 이후에 드러납니다."],["6-4 평가 지침","내가 바꾼 기준이 아니어도, 구성원에게는 팀장이 알려 준 시점이 곧 바뀐 시점입니다."]];

/* 청구서 (원고 03-6·03-9·03-11, 규칙 02-3 D) */
const BILL={
 B1:{ax:1,t:"가공 모듈의 무력감",who:"prc",say:"일이 오면 팀장님이 먼저 보시더라고요. 그 모듈 제가 맡고 있는 거 맞죠? 제가 왜 여기 있죠.",pre:"이수진의 일정 요청. 제목: 제 역할 관련 30분",cause:"가공 모듈의 일을 팀장이 직접 처리한 기록이 쌓였습니다.",fx:"prc-8 성과-2",wow:"이수진이 사원증을 책상에 올려놓는다. \"1월 스크립트부터 어제 일까지 적어 왔어요. 일곱 건이에요. 이 모듈, 팀장님이 하시죠.\""},
 B2:{ax:1,t:"낯선 모듈의 장애",pre:"알림과 전화가 동시에 온다.",body:"담당자가 빠진 사이 조달 결재 시스템에서 장애입니다. 지난번 팀장님이 승인하신 설정이 원인으로 보입니다. 아는 사람이 지금 없습니다.",cause:"낯선 모듈의 일을 직접 처리한 기록이 있습니다.",fx:"안정-4 src-3 F사만족-2",wow:"문지원이 설정 변경 이력을 띄운다. 맨 위 승인자에 당신의 이름이 있다. \"제가 없을 때 이걸 왜 만지셨어요.\""},
 B3:{ax:2,t:"\"기준이 뭐예요?\"",pre:"인사팀에 온 문의 목록이 전달된다. 같은 질문이 스물세 줄이다.",body:"이 팀 등급 기준을 어디서 볼 수 있나요?",cause:"기준을 충분히 알리지 않았거나, 바꾸고 다시 알리지 않았습니다.",fx:"사람-4 안전-4",wow:"배 책임이 3월 합의서와 현재 양식을 나란히 출력해 온다. \"어느 쪽이 진짜입니까.\""},
 B4:{ax:2,t:"보이지 않는 기여의 이탈",pre:"인사시스템 알림: 가공 모듈 예방 담당 1명이 타 팀 이동을 신청했습니다.",body:"사유: 사고가 없으면 할 일이 없는 사람으로 보여서요.",cause:"드러나지 않는 기여가 기준이나 공로에서 빠졌습니다.",fx:"prc-6 안정-4 사람-3",wow:"이수진이 신청서를 들고 온다. \"8개월 무사고를 만든 사람이에요. 이 사람 이름, 보고서에 한 번도 안 나왔어요.\""},
 B5:{ax:3,t:"\"AI를 쓰면 일만 늘어난다\"",pre:"익명 게시판 · 댓글 44",body:"1월 할 일 목록과 6월 할 일 목록을 나란히 놓아 봤습니다. 줄어든 건 없고 AI 검수가 늘었습니다. 아낀 시간은 어디 갔나요.",cause:"줄어든 일을 알리지 않은 채 새 일을 받았습니다.",fx:"사람-5 안전-3",wow:"윤 책임이 타운홀에서 일어나 1월과 9월의 할 일 목록을 띄운다. \"아낀 시간은 어디 갔습니까.\""},
 B6:{ax:3,t:"F사 운영비 인하 요구",pre:"임원의 메일",body:"AI로 효율이 올랐다면서요. 내년 운영비는 8% 인하를 전제로 하겠습니다.",cause:"줄어든 일의 숫자가 먼저 밖으로 나갔고, 계약에 다시 살펴볼 조건이 없었습니다.",fx:"재무-6 F사만족-2",wow:"임원이 지금까지 받은 팀의 자료를 시간순으로 펼친다. 줄마다 당신의 메일이다."},
 B7:{ax:3,t:"초과 부하 번아웃",pre:"인사시스템",body:()=>G.f.cha_left?"퇴직 처리 2건 접수.":"장기 병가 1건 접수.",cause:()=>`초과 부하가 ${G.over}회 쌓였고, 한 분기에 큰 변화가 몰렸습니다.`,fx:"사람-6 안전-3 안정-2",wow:()=>G.f.cha_left?"대기표와 퇴직 기록을 겹친 표가 화면을 채운다. 서하준: \"5월에 말씀드렸잖아요.\"":"대기표와 근태 기록을 겹친 표가 화면을 채운다. 강태식: \"내가 2월에 뭐라고 했는지 기억해?\""},
 B8:{ax:4,t:"설명 없는 결정의 대가",pre:"펄스 서베이 자유 응답란. 같은 문장이 열 줄 반복된다.",body:"왜 그렇게 정했는지 모르겠어요.",cause:()=>`설명하지 않은 결정이 ${G.toldAll.none+G.told.none}건 있었습니다.`,fx:"사람-4 안전-4",wow:"자유 응답란을 이수진이 그대로 출력해 회의 테이블에 놓는다. 같은 문장이 열 줄이다."},
 B9:{ax:4,t:"왜곡된 소문이 사실이 되다",pre:"익명 게시판 · 조회 수 412",body:"정리하자면 이렇습니다. 다들 아시죠?",cause:()=>`설명하지 않은 결정 뒤에 소문이 ${G.rumors}건 쌓였습니다.`,fx:"안전-5",wow:"문지원이 그 글을 사실로 알고 보고서에 인용해 왔다. \"맞는 내용 아닌가요?\""},
 B10:{ax:4,t:"말과 행동이 다르다",pre:"타운홀 질의응답. 익명 질문이 화면에 뜬다.",body:"3월에 말한 기준과 지금 쓰는 기준이 다릅니다. 언제 바뀌었습니까.",cause:"알리지 않고 바꾼 일, 결론만 통보한 일이 있었습니다.",fx:"안전-5 사람-3",wow:""},
 B11:{ax:0,t:"깨진 약속들",pre:"약속 장부가 저절로 열린다. 게시판 글.",body:()=>"여기, 올해 하신 말씀입니다. "+Object.values(G.prom).filter(p=>p.status==="파기").map(p=>"「"+p.text+"」").join(" "),cause:()=>`올해 어긴 약속이 ${G.broken}건입니다.`,fx:"안전-6 사람-4",wow:""},
};
const BILL_CAUSE={
 B1:[["d_M13","M13 스크립트 직접 처리","M13",1],["fam_direct","M11 직접 복구","M11",1],["oh_depends","5-3 이후 오 사원이 팀장에게 먼저 물음","5-3",5],["c_7-3_A","7-3 배포 옆자리","7-3",7]],
 B2:[["unfam_direct","M08 낯선 로그 직접 확인","M08",1],["src_direct","7-4 조달 결재 직접","7-4",7],["inc_direct","9-1 원격 직접 지휘","9-1",9]],
 B3:[["pub_items","3-1 항목만 공개","3-1",3],["pub_leaders","3-1 리더들과만 맞춤","3-1",3],["renotice_part","6-4 리더에게만 설명","6-4",6],["rule_silent","6-4 다시 알리지 않음","6-4",6]],
 B4:[["mfg_soft","3-4 예방 없는 생산 KPI","3-4",3],["award_fix","5-4 생산 모듈로 추천","5-4",5],["report_mkt","7-5 정다은 모듈 이름만","7-5",7],["han_left","8-6 한 선임 이동","8-6",8],["credit_fix","9-2 복구자만 포상","9-2",9]],
 B5:[["alloc_num","4-2 배분 숫자만 알림","4-2",4],["alloc_none","4-2 공지 안 보냄","4-2",4],["r2_more","4-5 신규 과제 추가","4-5",4],["small_win","5-6 소규모 수주","5-6",5],["ct_more","6-1 신규 2건","6-1",6],["prop_full","7-2 전 범위 수락","7-2",7],["auto_wide","8-5 전면 자동화","8-5",8]],
 B6:[["f_140","M21~M23 140시간이 밖으로 나감","M22",4],["ct_cut","6-1 5% 인하","6-1",6],["ct_more","6-1 신규 2건","6-1",6],[g=>!g.f.planb_contract,"6-1 재검토 조건 없음","6-1",6],["ai_draft","6-2 AI 초안","6-2",6]],
 B7:[["kim_fragile","6-3 \"괜찮습니다\"로 끝남","6-3",6],["prop_full","7-2 전 범위 수락","7-2",7],["mfg_acting","7-4 강태식 겸임","7-4",7],["cha_left","8-3 차 선임 결심","8-3",8]],
 B8:[()=>G.sig.filter(x=>x.choice==="안 알림"&&!x.forced).map(x=>[nm(x.scene)+" 결정을 알리지 않음",x.scene])],
 B9:[()=>G.sig.filter(x=>x.choice==="안 알림"&&!x.forced).map(x=>[nm(x.scene)+" 결정을 알리지 않음",x.scene])],
 B10:[["rule_silent","6-4 다시 알리지 않음","6-4",6],["p3_spin","8-1 차출이라고 구분","8-1",8]],
 B11:[()=>Object.values(G.prom).filter(p=>p.status==="파기").map(p=>["지키지 못한 약속: "+p.text,p.due])],
};
const MON=sc=>{const m=String(sc).match(/^(\d+)-/);if(m)return +m[1];const mm=String(sc).match(/^M(\d+)/);if(mm)return +mm[1]<=17?1:+mm[1]<=30?4:7;const d=String(sc).match(/^(\d+)월/);return d?+d[1]:null;};
function billCauses(b){const out=[];(BILL_CAUSE[b]||[]).forEach(c=>{if(typeof c==="function"){c(G).forEach(x=>out.push({t:x[0],m:MON(x[1])}));return;}const ok=typeof c[0]==="function"?c[0](G):(G.f[c[0]]&&!(G.forcedF||{})[c[0]]);if(ok)out.push({t:nm(c[2])+" — "+stripId(c[1]),m:c[3]});});if((b==="B5"||b==="B7")&&G.over>0)out.push({t:`초과 부하가 ${G.over}번 쌓였습니다`,m:null});if(b==="B7"&&G.fatigue>0)out.push({t:`큰 변화가 ${G.fatigue}번 이어졌습니다`,m:null});const seen={};return out.filter(x=>{const k=x.t;if(seen[k])return false;seen[k]=1;return true;});}
/* 청구서와 이어지지만 시간이 모자라 고를 수 없었던 결정. 원인으로 세지 않고 따로 보여 준다 */
function billForced(b,at){const out=[];(BILL_CAUSE[b]||[]).forEach(c=>{if(typeof c==="function"||typeof c[0]==="function")return;if(G.f[c[0]]&&(G.forcedF||{})[c[0]]&&(!at||c[3]<=at))out.push(nm(c[2])+" — "+stripId(c[1]));});
 if(b==="B8"||b==="B9")G.sig.filter(x=>x.choice==="안 알림"&&x.forced).forEach(x=>{const m=MON(x.scene);if(!at||!m||m<=at)out.push(nm(x.scene)+" 결정을 알리지 못함");});
 return out.filter((x,i,a)=>a.indexOf(x)===i);}
function forcedNote(b,at){const fs=billForced(b,at);return fs.length?`<p class="note"><b>시간이 없어 고르지 못한 결정 ${fs.length}건</b> (원인으로 세지 않았습니다)<br>${fs.join("<br>")}</p>`:"";}
function causeHtml(b,at){const cs=billCauses(b).filter(c=>!c.m||c.m<=at);const why=(G.billWhy||{})[b];const fn=forcedNote(b,at);
 if(cs.length)return `<p><b>기록에 남은 관련 결정</b></p>${cs.map(c=>`<p class="note">${/^\d+월/.test(c.t)||!c.m?"":c.m+"월 "}${c.t}${c.m?` → ${at-c.m}개월 뒤 청구서`:""}</p>`).join("")}<p class="note">이 결정들이 확률을 올렸습니다. 청구서는 확률로 오므로, 하나가 곧바로 원인이라고 단정할 수는 없습니다.</p>${fn}`;
 if(why==="wow")return `<p><b>왜 왔나:</b> 특정한 결정 하나가 아니라, 올해 기록에서 가장 약하게 나온 습관(${AXN[BILL[b].ax]})에서 왔습니다.</p>${fn}`;
 return `<p><b>왜 왔나:</b> 기록에서 이 청구서와 이어지는 결정을 찾지 못했습니다. 팀 바깥의 사정이나 운으로 왔을 수 있습니다.</p>${fn}`;}
function billP(id){const g0=G,ff=g0.forcedF||{},fl={};Object.keys(g0.f).forEach(k=>{if(!ff[k]||["alloc_notice","pub_prevent","f_corrected","planb_contract"].includes(k))fl[k]=g0.f[k];});
 /* 시간이 모자라 강제된 선택에서 생긴 플래그는 청구서 확률에 넣지 않는다 */
 const g=Object.assign(Object.create(g0),{f:fl});const b=(g.bill[id]||0),c=g.cells||{};let p=0;const dirR=()=>{const d=g.decisions.filter(x=>x.choice==="직접"&&/^M\d/.test(x.scene)).length,all=g.decisions.filter(x=>/^M\d/.test(x.scene)).length;return all&&d/all>=.5;};
 if(id==="B1")p=5+b+(g.f.d_M13?15:0)+(g.f.fam_direct?20:0)+(g.f.oh_depends?15:0)+(dirR()?20:0)+(g.trust.prc<=40?10:0);
 if(id==="B2")p=5+b+(g.f.unfam_direct?20:0)+((c.SEC||0)<=1?15:0);
 if(id==="B3")p=5+b+(g.f.pub_leaders?30:0)+(g.f.pub_items?10:0)+(g.f.renotice_part?15:0)+(g.f.rule_silent?20:0)+(g.f.alloc_notice?0:10);
 if(id==="B4")p=5+b+(g.f.award_fix?15:0)+(g.f.han_left?20:0)+(g.f.pub_prevent?0:15);
 if(id==="B5")p=5+b+((c.GROW||0)>=5?20:0)+g.over*10+(g.f.prop_full?15:0)+(g.f.auto_wide?15:0);
 if(id==="B6")p=5+b+(g.f.f_140&&!g.f.f_corrected?10:0)+g.over*5;
 if(id==="B7")p=5+b+g.over*10+(g.fatigue*10)+(g.f.kim_fragile?20:0)+(g.f.cha_left?20:0);
 if(id==="B8")p=(g.toldAll.none+g.told.none)*8+g.rumors*5-(g.toldAll.full+g.told.full)*3;
 if(id==="B9")p=g.rumors<3?0:20+g.rumors*10;
 if(id==="B10")p=5+b+g.concl*8+(g.toldAll.none+g.told.none)*3;
 if(id==="B11")p=g.broken<2?0:30+g.broken*15;
 return Math.max(0,Math.min(90,p));
}
const scaleFx=(fx,m)=>fx.replace(/-(\d+)/g,(_,n)=>"-"+Math.round(+n*m));
function SC_BILLS(s){
 G.billP=G.billP||{};s.pool.forEach(b=>{G.billP[b]=billP(b);});
 const pool=s.pool.filter(b=>!G.bills.includes(b)).map(b=>({b,p:billP(b)})).sort((x,y)=>y.p-x.p);
 const arrive=[];pool.forEach(x=>{if(arrive.length<s.max&&Math.random()*100<x.p)arrive.push({b:x.b,wow:false});});
 if(s.wow){const ax=[1,2,3,4].map(a=>({a,r:axScore(a)})).filter(x=>x.r.v!=null&&x.r.v<50).sort((p,q)=>p.r.v-q.r.v)[0];
  if(ax&&!G.bills.concat(arrive.map(x=>x.b)).some(b=>BILL[b].ax===ax.a)){const ids=Object.keys(BILL).filter(b=>BILL[b].ax===ax.a).sort((a,b)=>billP(b)-billP(a));arrive.push({b:ids[0],wow:true});G.wowGot=ids[0];}}
 pool.forEach(x=>{if(!arrive.some(a=>a.b===x.b))luckBill(x.b,x.p);});
 if(!arrive.length){next();return;}
 const step=i=>{if(i>=arrive.length){next();return;}
  const {b,wow}=arrive[i],c=BILL[b];G.bills.push(b);(G.billAt=G.billAt||{})[b]=G.month;(G.billWhy=G.billWhy||{})[b]=wow?"wow":billCauses(b).length?"cause":"chance";
  let fx=c.fx;if(b==="B9")fx+=" "+lowLeader(G)+"-3";
  const live=applyFx(wow?scaleFx(fx,1.5):fx);
  paint("");beep(160,.25,"sawtooth");
  shell(`<div class="pane"><div class="eyebrow">📮 ${G.month}월의 청구서</div><h2>${c.t}</h2><div class="prose"><p class="note">${c.pre}</p>${c.say?sayHtml(c.who,c.say):`<p class="voice">${val(c.body)}</p>`}${wow&&val(c.wow)?`<p class="voice"><b>${val(c.wow)}</b></p>`:""}${causeHtml(b,G.month)}</div><div class="foot"><span></span>${BTN(()=>step(i+1),"다음","main")}</div></div>`,live);
 };
 step(0);
}

/* 연말 평가 (원고 03-12 12-3) */
const EVAL=[
 {k:"rd",kpi:"달성",r:[["AI 시범 결과 분기 보고",null,["AI 활용 효과"]],["3월 승인 안 된 서비스 사용",null,["보안 준수"]],["데모 8주 완수","q2_demo",["AI 활용 효과","추가 과제 매출 기여"]],["오탐 조치 책임","fp_keep",["AI 활용 효과","장애 예방 활동"]],["3주 제안 완성","prop_ai",["추가 과제 매출 기여"]],["팀원 실험 코칭","talks_rd",["동료 지원과 온보딩"]],["작년 과제 취소 사정",null,[],1]]},
 {k:"src",kpi:"달성",r:[["3월 승인 안 된 도구 정황 제보",null,["보안 준수"]],["감사 대응",null,["보안 준수"]],["2분기 감사 준비","audit_prep",["보안 준수"]],["검수 구간 운영","fp_gate",["장애 예방 활동","보안 준수"]],["전환 설계 위임","yoon_owner",["동료 지원과 온보딩"]],["7월 입원","case_src",[],1]]},
 {k:"mfg",kpi:"달성",r:[["5월 장애 복구 3시간 40분",null,["장애 복구 기여"]],["9월 현장 지휘","inc_proc",["장애 복구 기여"]],["내년 야간 설계","tae_end_ally",["동료 지원과 온보딩","장애 예방 활동"]],["점검 기록 공유","credit_both",["장애 예방 활동"]],["야간에 가장 오래 있었음",null,[],1],["팀장 후보였음",null,[],1],["이력서 소문","mfg_exit",[],1]]},
 {k:"prc",kpi:"달성",r:[["재발 없는 8개월 (5월 전까지)",null,["장애 예방 활동"]],["8월 점검 4회",null,["장애 예방 활동"]],["점검표 전제 제기","pm_root",["장애 예방 활동"]],["항목 축소","q2_prevent",["장애 예방 활동"]],["복귀 계획","oh_plan",["동료 지원과 온보딩"]],["표본 확인","check_sampled",["장애 예방 활동","보안 준수"]],["예전 동료였음",null,[],1],[()=>G.f.check_truth?"완료율 100% (사실과 다름)":"완료율 100%",null,[],1]]},
 {k:"mkt",kpi:"초과",r:[["제안 실적",null,["추가 과제 매출 기여"]],["F사 응대",null,["고객 칭찬"]],["10월 수주","win_any",["추가 과제 매출 기여"]],["모듈 기여 기재","report_both",["동료 지원과 온보딩"]],["발표 양보","han_stage",["동료 지원과 온보딩"]],["데모 대응","q2_demo",["추가 과제 매출 기여","고객 칭찬"]],["임원이 좋아함",null,g=>g.f.pub_praise?["고객 칭찬"]:[],g=>!g.f.pub_praise],["표지 관행",null,[],1]]},
 {k:"kim",kpi:"달성",r:[["5월 복구 참여",null,["장애 복구 기여"]],["경고 처리 규칙 초안","kim_manual",["장애 예방 활동","AI 활용 효과"]],["야간 규칙 작성","kim_end_author",["장애 예방 활동","동료 지원과 온보딩"]],["동료 인수인계","talks_kim2",["동료 지원과 온보딩"]],["야간 대기 11회",null,[],1],["7월 병가","kim_sick",[],1],["근태 밖 접속","night_seen",[],1]]},
 {k:"yoon",kpi:"달성",r:[["발주 검토표 유지",null,["보안 준수"]],["오분류 3건 발견","yoon_validator",["AI 활용 효과","장애 예방 활동"]],["2주 대행","yoon_acting",["동료 지원과 온보딩"]],["사내 교육","yoon_teacher",["동료 지원과 온보딩"]],["검수 규칙","auto_staged",["AI 활용 효과","장애 예방 활동"]],["익명 게시판 글",null,[],1],["교육 미이수 사유","yoon_forced",[],1],["희망퇴직 상담","yoon_end_heard",[],1]]},
 {k:"oh",kpi:g=>g.f.oh_back||g.f.oh_fix?"달성":"미달",r:[["11개 배포 담당 (5월)",null,["장애 복구 기여"]],["5월 완료 표시 누락",null,["보안 준수"]],["E-417 근본 수정","oh_fix",["장애 예방 활동"]],["온보딩","oh_end_mentor",["동료 지원과 온보딩"]],["점검표 축소안","oh_buddy",["장애 예방 활동"]],["배포 복귀","oh_back",["장애 복구 기여"]],["7월 내부 제보","check_truth",[],1],["이동 신청","oh_end_record",[],1]]},
 {k:"han",kpi:"달성",r:[["제안서 본문 작성",null,["추가 과제 매출 기여"]],["PT 발표","han_present",["추가 과제 매출 기여","고객 칭찬"]],["표지 기재","case_doer",["추가 과제 매출 기여"]],["11월 보고","han_end_stage",["추가 과제 매출 기여"]],["기여 41건","han_rec41",["추가 과제 매출 기여","동료 지원과 온보딩"]],["41시간",null,[],1],["게시판 글",null,[],1],["7월 자진 신고","sec_reported",[],1]]},
 {k:"cha",kpi:"초과",r:[["실험 건수 최다",null,["AI 활용 효과"]],["제안 설계","cha_design",["추가 과제 매출 기여"]],["설계 총괄","cha_end_lead",["추가 과제 매출 기여"]],["인수 지표","kpi_rd_handoff",["AI 활용 효과"]],["외부 제안을 받음",null,[],1],["보상 조정","cha_stay_pay",[],1]]},
 {k:"bae",kpi:"달성 (전 항목)",r:[["KPI 전 항목 달성",null,["리더 종합 판단","장애 복구 기여"]],["인수인계","bae_move",["동료 지원과 온보딩"]],["합의서 항목별 실적","bae_criteria",["장애 복구 기여","보안 준수"]],["후배 지도","talks_bae2",["동료 지원과 온보딩"]],["작년 등급",null,[],1],["이동 희망",null,[],1],["7월 실명 의견","dissent_heard",[],1]]},
];
function SC_EVAL(s){
 const people=EVAL.filter(e=>!isGone(e.k));const left=EVAL.length-people.length;
 const quota=Object.assign({},GRADE_GUIDE,{B:Math.max(0,GRADE_GUIDE.B-left)});
 const st={};people.forEach(e=>st[e.k]={g:null,picks:{}});let i=0,used=false,warned=false;
 G.f.win_any=G.f.win_mkt||G.f.win_check||G.f.win_credit;G.f.case_src=G.cases&&G.cases["7-4"]===0;G.f.talks_kim2=(G.f.talks_kim||0)>=2;G.f.talks_bae2=(G.f.talks_bae||0)>=2;G.f.han_rec41=G.f.han_talked||G.f.han_end_record;
 const INPUT=["야간에 가장 오래 있었음","야간 대기 11회","41시간"];
 const NOREC={yoon:["yoon_validator","yoon_teacher","auto_staged","yoon_acting"],han:["han_present","case_doer","han_end_stage","han_rec41"]};
 const recs=e=>e.r.filter(r=>!r[1]||(G.f[r[1]]&&(r[1]!=="talks_rd"||G.f[r[1]]>=2)))
  .filter(r=>!(r[1]==="win_any"&&G.f.win_norecord))
  .filter(r=>!(NOREC[e.k]&&NOREC[e.k].includes(r[1])&&G.f[e.k+"_norecord"]))
  .map(r=>{const name0=val(r[0]),fits=val(r[2]),bad=typeof r[3]==="function"?r[3](G):r[3];if(INPUT.includes(name0)&&G.f.rule_kept&&G.pub.includes("책임감 있는 근무"))return[name0,r[1],["책임감 있는 근무"],0];return[name0,r[1],fits,bad];});
 const cnt=g=>Object.values(st).filter(x=>x.g===g).length;
 const save=()=>{const e=people[i];recs(e).forEach((r,n)=>{const el=$("ln"+n);if(el&&st[e.k].picks[n]!==undefined)st[e.k].picks[n]=el.value;});};
 const KPIORD={"초과":0,"달성 (전 항목)":1,"달성":2,"미달":3};
 const draw=()=>{paint("");const e=people[i],c=st[e.k],rs=recs(e);
  const allG=Object.values(st).every(x=>x.g);const ok=allG&&["S","A","B","C"].every(g=>cnt(g)===quota[g]);
  /* 확정 버튼이 꺼져 있는 이유 */
  const whyOff=[];{const un=Object.values(st).filter(x=>!x.g).length;if(un)whyOff.push(`등급을 정하지 않은 사람이 ${un}명 있습니다`);["S","A","B","C"].forEach(g=>{const d=cnt(g)-quota[g];if(d>0)whyOff.push(`${g}${jo(g,"이","가")} ${d}명 많습니다`);else if(d<0&&!un)whyOff.push(`${g}${jo(g,"이","가")} ${-d}명 모자랍니다`);});}
  /* 기록 한 줄의 안내: 공개하지 않은 기준에만 맞는 기록, 연결이 맞지 않는 기록을 그 자리에서 알린다 */
  const q=w=>`'${w}'`;
  const recNote=(r,v)=>{const fits=r[3]?[]:(r[2]||[]),pubFit=fits.filter(x=>G.pub.includes(x));const lst=fits.map(x=>x+(G.pub.includes(x)?"":"(올해 공개하지 않음)")).join(", ");
   if(v){if(has("pub_leaders"))return "기준을 구성원에게 공개한 적이 없어, 연결해도 근거로 인정되지 않습니다.";if(fits.includes(v))return "이어지는 연결입니다.";
    return `이 기록은 ${q(v)}${jo(v,"과","와")} 이어지지 않습니다. ${fits.length?"맞는 기준: "+lst:"이 기록에 맞는 공개 기준은 없습니다."}`;}
   if(fits.length&&!pubFit.length)return `맞는 기준 ${fits.map(q).join(", ")}${jo(fits[fits.length-1],"은","는")} 3월에 공개하지 않은 기준이라 쓸 수 없습니다.`;return "";};
  shell(`<div class="pane"><div class="eyebrow">연말 평가 · ${i+1}/${people.length}</div><h2>${name(e.k)}</h2>
  <details class="ref"><summary>참고 카드</summary><p style="margin-top:6px"><b>Folger, Konovsky &amp; Cropanzano(1992), 정당한 평가 절차</b><br>평가가 정당하다고 받아들여지려면 세 가지가 필요합니다. 기준을 미리 알려 주었는가, 당사자의 이야기를 들을 기회가 있었는가, 실제 기록과 증거로 판단했는가.<br><b>생각해 볼 질문:</b> 이 등급의 근거는 당사자가 미리 알 수 있었던 것입니까?</p></details>
  ${has("rule_kept")?'<p class="note">올해 우리 팀은 인사팀 지침 적용 유예 팀입니다.</p>':""}
  <p class="note">배분 가이드: S ${quota.S} · A ${quota.A} · B ${quota.B} · C ${quota.C} · 현재 S ${cnt("S")} A ${cnt("A")} B ${cnt("B")} C ${cnt("C")}</p>
  <p>KPI: <b>${val(e.kpi)}</b></p>
  ${has("pub_leaders")?'<p class="note">구성원에게 공개한 적 없는 기준입니다.</p>':""}
  <div class="btns">${["S","A","B","C"].map(g=>BTN(()=>{save();c.g=g;draw();},g,c.g===g?"main":"")).join("")}</div>
  <p><b>연중 관찰 기록</b> <span class="note">2개 이상 고르고, 공개한 기준에 연결하세요.</span></p>
  ${rs.length<2?'<p class="note">기록 부족</p>':""}
  <div class="opts">${rs.map((r,n2)=>{const on=c.picks[n2]!==undefined;return `<div class="task" style="padding:8px 12px"><label class="chk"><input type="checkbox" id="rc${n2}" ${on?"checked":""}><span>${r[0]}</span></label>${on?`<select id="ln${n2}"><option value="">기준 연결</option>${G.pub.map(p=>`<option ${c.picks[n2]===p?"selected":""}>${p}</option>`).join("")}</select>`:""}${(()=>{const t=recNote(r,on?c.picks[n2]:"");return t?`<span class="note" style="display:block;margin-top:4px">${t}</span>`:"";})()}</div>`}).join("")}</div>
  <div class="foot"><span class="btns">${i>0?BTN(()=>{save();i--;draw();},"이전"):""}${i<people.length-1?BTN(()=>{save();i++;draw();},"다음 사람"):""}${BTN(()=>{save();used=true;const ord=[...people].sort((a,b)=>KPIORD[val(a.kpi)]-KPIORD[val(b.kpi)]);let idx=0;["S","A","B","C"].forEach(g=>{for(let k=0;k<quota[g];k++){if(ord[idx])st[ord[idx].k].g=g;idx++;}});draw();},"KPI 순서로 채우기")}</span><button class="btn main" ${ok?"":"disabled"} ${A(()=>{save();const miss=people.filter(e=>!evidOK(e));if(miss.length&&!warned){warned=true;draw();return;}finish();})}>${warned?"근거 없이 확정":"평가 확정"}</button></div>${!ok&&whyOff.length?`<p class="note">평가 확정을 누를 수 없는 이유: ${whyOff.join(" · ")}.</p>`:""}${warned?`<div class="happen"><span class="label">확정 전에</span>근거가 연결되지 않은 사람이 ${people.filter(e=>!evidOK(e)).length}명입니다: ${people.filter(e=>!evidOK(e)).map(e=>name(e.k)).join(", ")}. 이대로 확정하면 이 사람들은 등급의 이유를 물을 수 있고, 답할 기록이 없습니다.</div>`:""}</div>`);
  rs.forEach((r,n2)=>{$("rc"+n2).onchange=ev=>{save();if(ev.target.checked)c.picks[n2]="";else delete c.picks[n2];draw();};const ln=$("ln"+n2);if(ln)ln.onchange=()=>{const y=window.scrollY;save();draw();window.scrollTo(0,y);};});
 };
 function evidOK(e){const c=st[e.k],rs=recs(e);let n=0;Object.entries(c.picks).forEach(([k,v])=>{const r=rs[+k];if(r&&!r[3]&&v&&r[2].includes(v))n++;});return n>=2&&!has("pub_leaders");}
 const finish=()=>{const live={};let good=0;const bad=[];
  people.forEach(e=>{const c=st[e.k],rs=recs(e);let n=0,badHit=[];
   Object.entries(c.picks).forEach(([k,v])=>{const r=rs[+k];if(!r)return;if(r[3]){badHit.push(r[0]);return;}if(v&&r[2].includes(v))n++;});
   const fit=n>=2&&!has("pub_leaders");c.fit=fit;if(fit)good++;
   badHit.forEach(t=>{bad.push(name(e.k)+": "+t);if(Math.random()<.25){applyFx("안전-3 "+(LD[e.k]?e.k:PP[e.k].lead)+"-2",{live});}});
   if(LD[e.k]){const d={S:6,A:3,B:0,C:-8}[c.g];const v=c.g==="C"&&fit?-4:d;if(v)applyFx(e.k+(v>0?"+":"")+v,{live});}else if(c.g==="C"&&!fit)applyFx("안전-2");
   G.grades[e.k]={등급:c.g,근거충족:fit};
   G.grades[e.k].근거=rs.map((r,x)=>c.picks[x]!==undefined?r[0]+"→"+c.picks[x]:null).filter(Boolean);
  });
  G.badEvid=bad;G.evalGood=good;G.evalN=people.length;G.goal6a=good===people.length;
  /* 3월 기준 선택 때문에 증빙이 막힌 사람: 쓸 수 있는 기록은 2개 이상인데, 공개한 기준과 이어지는 기록이 2개가 안 되는 경우 */
  G.evalBlocked=people.map(e=>{const rs=recs(e).filter(r=>!r[3]&&(r[2]||[]).length);const usable=rs.filter(r=>r[2].some(x=>G.pub.includes(x))).length;
   if(rs.length<2||(usable>=2&&!has("pub_leaders")))return null;const need=[];rs.filter(r=>!r[2].some(x=>G.pub.includes(x))).forEach(r=>r[2].forEach(x=>{if(!need.includes(x))need.push(x);}));
   return{k:e.k,need:has("pub_leaders")?[]:need};}).filter(Boolean);
  if(good>=8)applySig("②L",1,"12-3","근거 충족");if(good<5)applySig("②P",1,"12-3","근거 부족");if(used){applySig("②P",1,"12-3","KPI 순서로 채우기");G.f.kpi_fill=true;}
  {const rk={S:0,A:1,B:2,C:3};const ord=[...people].sort((a,b)=>KPIORD[val(a.kpi)]-KPIORD[val(b.kpi)]);let same=true;for(let x=1;x<ord.length;x++){if(rk[st[ord[x].k].g]<rk[st[ord[x-1].k].g])same=false;}if(same&&good<5){applySig("②P",1,"12-3","KPI 순서대로");G.f.kpi_order=true;}}
  record("12-3",JSON.stringify(G.grades));
  paint("");shell(`<div class="pane"><div class="eyebrow">일어난 일</div><h2>평가를 확정했습니다</h2><div class="prose"><p>인사시스템에 등급을 제출했습니다.</p></div><div class="foot"><span></span>${BTN(next,"다음","main")}</div></div>`,live);
 };
 draw();
}

/* 이의 면담의 첫 대사: 그 사람의 1년을 따라 달라진다 */
function appealLine(k,g){const f=G.f,gr=(g&&g.등급)||"";const L={
 rd:()=>f.cha_left?"설계자를 보내고도 과제를 끝냈습니다. 그게 이 등급입니까.":"실험 건수도 데모도 채웠습니다. 무엇이 모자랐는지 듣고 싶습니다.",
 src:()=>f.case_src?"입원한 2주가 등급에 들어간 겁니까. 그게 아니라면 무엇입니까.":"감사 대응을 제가 다 했습니다. 그 기록은 어디에 들어갔습니까.",
 mfg:()=>f.inc_proc||f.inc_direct?"9월 새벽에 라인을 살린 사람들입니다. 이 등급의 이유를 듣고 싶습니다.":"야간을 제일 많이 선 모듈입니다. 무엇을 보고 정하셨습니까.",
 prc:()=>f.pub_prevent?"예방이 기준이라고 하셨죠. 8개월 무사고가 이 등급입니까.":"사고를 막은 일은 어디에 적혔습니까. 이유를 듣고 싶어요.",
 mkt:()=>f.win_mkt||f.win_credit||f.win_check?"올해 가장 큰 수주를 했습니다. 그런데 왜 이 등급이죠?":"고객 앞에 선 건 저였습니다. 무엇이 빠졌는지 알고 싶어요.",
 kim:()=>f.kim_sick?"아팠던 게 등급에 들어간 건가요. 그게 아니면 뭔지 알고 싶어요.":"야간을 제일 많이 섰는데요. 그건 기록이 아닌가요.",
 yoon:()=>f.yoon_validator||f.auto_staged?"검수 규칙을 쓴 사람입니다. 그 일은 등급에 없는 겁니까.":"8년 치 검토표를 넘겼습니다. 넘기고 나니 이 등급이네요.",
 oh:()=>f.oh_fix||f.oh_back?"5월 뒤로 다시 배포를 맡았습니다. 그래도 5월로 정해진 건가요.":"5월 일 때문인가요. 그렇다면 그렇다고 듣고 싶어요.",
 han:()=>f.han_present||f.case_doer?"발표도 했고 표지에 이름도 있었습니다. 그런데 왜 이 등급인가요.":"제안서 본문을 제가 썼습니다. 그게 어디에 적혀 있나요.",
 cha:()=>f.cha_design||f.cha_end_lead?"설계를 맡아 끝냈습니다. 이유를 듣고 싶습니다.":"실험 건수는 제가 제일 많습니다. 무엇을 보신 건가요.",
 anon:()=>"다들 이의를 낸다기에 저도 냅니다. 제 등급은 무엇으로 정해졌습니까."};
 return (L[k]?L[k]():"제가 왜 이 등급인지 듣고 싶습니다.")+(gr==="C"?" C라는 글자를 보고 한참 앉아 있었습니다.":"");}
/* 이의제기와 배 책임 결말 (원고 03-12 12-4) */
function SC_APPEAL(s){
 const exp={"초과":"A","달성 (전 항목)":"A"};const rank={S:0,A:1,B:2,C:3};
 let cands=EVAL.filter(e=>G.grades[e.k]&&e.k!=="bae").filter(e=>{const g=G.grades[e.k],x=exp[val(e.kpi)];if(x&&rank[g.등급]>rank[x])return Math.random()<(g.근거충족?.3:.9);if(!g.근거충족&&rank[g.등급]>=2)return Math.random()<.6;return false;});
 if(G.f.appeal_extra)cands.push({k:"anon",kpi:"달성"});
 const silent=[];if(G.safe<40&&cands.length){const keep=Math.floor(cands.length/2);cands.slice(keep).forEach(e=>{const m=name(e.k)+"은 이의제기서를 쓰다가 저장하지 않았습니다.";silent.push(m);G.unsent.push(m);});cands=cands.slice(0,keep);}
 cands=cands.slice(0,5);G.baeAppeal=!!(G.grades.bae&&!G.grades.bae.근거충족);G.appeals=cands.map(e=>e.k).concat(G.baeAppeal?["bae"]:[]);G.appealOK=true;G.appeal0=G.appeals.length?null:(silent.length||(G.evalGood||0)<(G.evalN||0)?"침묵":"근거");
 const finishBae=()=>{const g=G.grades.bae;
  if(!g){next();return;}
  const opts=[{k:"A",t:"등급 카드를 펴고, 고른 기록과 합의서 항목을 하나씩 짚어 가면서 말해 준다.",dis:()=>g.근거충족?"":"제시할 기록이 부족합니다."},{k:"B",t:"같은 등급의 다른 동료와 견주어, 올해 상대적으로 어디쯤 있었는지 말해 준다."},{k:"C",t:"올해는 등급을 그대로 두되, 내년에 먼저 챙기겠다고 하고 사정을 들어 준다."}];
  SC_CHOICE({id:"12-4bae",tag:"배 책임",when:"12월",title:"작년에 들었던 말과 올해의 말",say:[["bae",(rank[g.등급]<=1?"등급은 봤습니다. 이유를 듣고 싶어서요. ":"")+"KPI 다 채웠습니다. 작년처럼 물어볼 일이 또 있는지 듣고 싶습니다."]],conds:[{c:x=>x.f["c_3-7_C"],t:"3월에 이 사람의 질문 대신 가공 이동 이야기를 먼저 했다. 그날 표정은 풀렸다."},{c:x=>x.f.bae_criteria,t:"3월에 이 사람과 합의서를 놓고 이야기했다."},{c:x=>x.f.bae_past,t:"작년 B의 이유를 찾아보겠다고 했다."},{c:x=>promIs(x,"P4","파기"),t:"9월의 답을 주지 못했다."},{c:x=>x.f.bae_move,t:"다음 달부터 가공 모듈이다."}],options:opts.map(o=>({...o,fx:o.k==="A"?"안전+2":o.k==="B"?"안전-3 mfg-2":"안전-1 사람+1",sig:o.k==="A"?"②L":o.k==="B"?"②P":"④P",done:o.k==="A"?"합의서를 펴고 기록과 항목을 하나씩 짚었습니다.":o.k==="B"?"동료들과 견주어 설명했습니다.":"내년에 먼저 챙기겠다고 했습니다.",onDone:()=>{G.ends.bae=!g.근거충족?"배 책임은 2년 연속 이의를 냈습니다. \"올해도 이유는 없었습니다.\"":o.k==="A"?"배 책임은 올해 이의를 내지 않았습니다. 처음으로 이유를 들었다고 적었습니다.":"배 책임은 설명을 들었습니다. 합의서는 펴지지 않았습니다.";if(o.k!=="A")G.appealOK=false;}}))},{done:()=>next()});
 };
 const step=i=>{
  if(i>=cands.length){finishBae();return;}
  const e=cands[i],k=e.k,g=G.grades[k];
  SC_CHOICE({id:"12-4"+k,tag:"이의제기",when:"12월",title:name(k)+"의 이의제기",meet:true,say:[[k,appealLine(k,g)]],options:[
   {k:"A",cost:1,t:"등급 카드를 펴고, 고른 기록과 합의서 항목을 하나씩 짚어 가면서 말해 준다.",dis:()=>g&&g.근거충족?"":"제시할 기록이 부족합니다.",done:"기록과 합의서 항목을 하나씩 짚었습니다.",fx:"안전+2",sig:"②L",tw:[{p:30,t:vary("apA",["\"그 기준이면 그렇네요. 그래도 아쉬워요.\"","\"항목마다 짚어 주시니 할 말은 없네요.\"","\"기록이 그렇다면 받아들이겠습니다.\"","\"내년에는 그 항목부터 챙기겠습니다.\"","\"설명은 이해했습니다. 마음은 조금 걸리네요.\""])},{p:20,t:vary("apA2",["\"기록에 없는 일이 있습니다.\" 사실을 하나 더 가져왔습니다.","빠진 기록이 있다며 메일 두 통을 보여 줬습니다.","\"이 건은 적히지 않았더라고요.\" 작업 이력을 가져왔습니다.","동료가 써 준 확인 메모를 내밀었습니다.","\"그날 일은 여기 있습니다.\" 회의록을 펼쳤습니다."]),fx:"사람+1"}]},
   {k:"B",cost:1,t:"같은 등급의 다른 동료와 견주어, 올해 상대적으로 어디쯤 있었는지 말해 준다.",done:"동료들과 견주어 설명했습니다.",fx:"안전-3 "+(LD[k]?k:PP[k].lead)+"-2",sig:"②P",onDone:()=>{G.appealOK=false;},tw:[{p:50,t:vary("apB",["\"다른 사람보다 못했다는 말이네요\"가 돌았습니다.","\"누구랑 견줬는지 다들 궁금해합니다\"라는 글이 올라왔습니다.","면담에서 나온 다른 사람 이름이 다음 날 게시판에 적혔습니다.","\"등수를 불러 주더라\"는 말이 점심 자리에 돌았습니다.","\"결국 줄 세우기였네요\"가 메신저에 돌았습니다."]),fx:"소문1"},{p:20,t:vary("apB2",["납득하고 돌아갔습니다.","\"어디쯤인지는 알겠습니다\" 하고 일어났습니다.","고개를 끄덕이고 나갔습니다.","더 묻지 않았습니다.","\"기준은 알았습니다\"라고 했습니다."]),fx:"안전+1"}]},
   {k:"C",cost:1,t:"올해는 등급을 그대로 두되, 내년에 먼저 챙기겠다고 하고 사정을 들어 준다.",done:"내년에 먼저 챙기겠다고 했습니다.",fx:"안전-1 사람+1",sig:"④P",onDone:(G2,hit)=>{G.appealOK=false;if(hit&&hit.pr)addPromise({id:"P9"+k,text:name(k)+"의 내년 평가를 먼저 챙김",to:name(k),due:"내년"});},tw:[{p:40,pr:1,t:vary("apC",["\"내년이요?\" 내년 약속이 장부에 남았습니다.","\"그 말, 적어 두겠습니다.\" 내년 약속이 장부에 남았습니다.","\"내년 이맘때 다시 여쭙겠습니다.\" 약속이 장부에 남았습니다.","\"먼저 챙기신다는 말 기억하겠습니다.\" 장부에 한 줄이 늘었습니다.","\"그럼 내년에 뵙죠.\" 약속이 장부에 남았습니다."])},{p:30,t:vary("apC2",["들어 주는 것으로 풀렸습니다.","한참 이야기하고 나서 표정이 풀렸습니다.","끝까지 들어 준 것이 답이 됐습니다.","말을 다 하고 나니 됐다고 했습니다.","\"들어 주셔서 감사합니다\" 하고 나갔습니다."]),fx:"안전+2"}]},
   {k:"D",t:"면담 시간을 내지 못해 서면 답변으로 처리한다.",done:"서면으로 답했습니다.",fx:"안전-2",sig:"④P",onDone:()=>{G.appealOK=false;}},
  ]},{done:()=>step(i+1)});
 };
 if(!cands.length){paint("");shell(`<div class="pane"><div class="eyebrow">12월</div><h2>${G.baeAppeal?"배 책임 외에는 이의제기가 없었습니다.":"올해 이의제기는 0건입니다."}</h2>${!G.baeAppeal&&(G.evalGood||0)<(G.evalN||0)?`<p class="note">근거를 갖추지 못한 등급이 ${(G.evalN||0)-(G.evalGood||0)}건 있었습니다. 묻지 않은 것과 물을 것이 없었던 것은 다릅니다.</p>`:""}<div class="foot"><span></span>${BTN(()=>finishBae(),"다음","main")}</div></div>`);return;}
 step(0);
}

/* 질문에서 핵심 낱말의 앞 두 글자를 뽑아, 질문마다 다른 채점 낱말을 만든다 */
function qStems(q){const stop=["어디","다음","저희","우리","제가","그럼","이번","혹시","정말","그냥","팀장","어떻게","무엇","뭘","왜","누가","언제","있나","하나","되나","인가"];
 return String(q||"").split(/[^가-힣A-Za-z0-9%]+/).filter(w=>w.length>=2).map(w=>w.replace(/(은|는|이|가|을|를|에|에서|으로|로|와|과|도|요|나요|까요|ㄴ가요|인가요|습니까|입니까|세요)$/,"")).filter(w=>w.length>=2&&!stop.some(x=>w.startsWith(x))).map(w=>w.slice(0,2));}
