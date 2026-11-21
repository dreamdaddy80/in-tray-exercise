/* v3 · 4단계 화면 (설계 02-2 ④ · 02-3 D·F · 02-4 E·F·G·J · 02-5 D·E, 원고 03-1 · 03-3 · 03-5)
   리더 프로필 카드와 관계도, 계기판(발언량 · 모듈 업무량과 스트레스), 배분 조정, 세 개의 설명(1편 직접 + 2편 고르기),
   인생극장, 가상 360, 90일 액션 플랜, v3 결산. */
(function(){
const LK=["rd","src","mfg","prc","mkt"];
/* v3 패치 0: 4단계 전용 CSS 자동 주입 (index.html 버전과 무관하게 레이아웃 보장) */
/* index.html에 v3 스타일이 이미 있으면 주입하지 않는다 (덮어쓰기 방지) */
if(typeof document!=="undefined"&&!document.getElementById("v3ui-style")&&![...document.querySelectorAll("style")].some(x=>x.textContent.includes(".pcards"))){
 const st=document.createElement("style");st.id="v3ui-style";
 st.textContent=`
 .pcards{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px;margin:10px 0}
 .pcard{display:grid;grid-template-columns:44px minmax(0,1fr);gap:10px;text-align:left;padding:12px;border-radius:var(--r-md);background:var(--panel);box-shadow:0 1px 0 var(--line);align-items:start}
 .pcard:hover{box-shadow:0 0 0 1.5px var(--ink)}.pcard svg{width:44px;height:44px}.pcard small{display:block;font-size:12.5px;color:var(--muted);margin-top:2px}
 .phead{display:flex;gap:12px;align-items:center}.phead svg{width:52px;height:52px}
 .prow{display:grid;grid-template-columns:120px minmax(0,1fr);gap:8px;padding:8px 0;border-top:1px solid var(--line);font-size:14px}
 .mmap{width:100%;max-width:170px;display:block;margin:8px auto 2px}
 .stl{font-size:11px;color:var(--muted);margin-top:2px;line-height:1.3}
 .mods{display:grid;gap:6px;margin-top:6px}.mod{display:grid;grid-template-columns:42px minmax(0,1fr) 26px;gap:6px;align-items:center;font-size:12px}
 .mbar{display:grid;gap:2px;background:var(--sunk);padding:3px;border-radius:6px}.mbar i{display:block;height:5px;border-radius:999px;background:var(--lav)}
 .mbar i.s{background:var(--mint-bar)}.mbar i.s.warm{background:var(--s4)}.mbar i.s.hot{background:var(--bad)}
 .mbtn{grid-column:1/-1;display:flex;gap:4px;justify-content:flex-end}.mbtn button{font-size:11px;padding:2px 8px;border-radius:999px;background:var(--chip)}
 .modpanel{background:var(--sunk);border-radius:var(--r-md);padding:12px 14px;display:grid;gap:6px;margin-bottom:8px}
 .mrow{display:grid;grid-template-columns:52px auto minmax(60px,1fr) auto minmax(60px,1fr) auto;gap:8px;align-items:center;font-size:12.5px}
 .b3{position:relative;height:18px;background:var(--chip);border-radius:999px;overflow:hidden;display:flex;align-items:center}
 .b3 i{display:block;height:100%;border-radius:999px}.b3 .num{position:absolute;right:8px;font-size:11.5px;font-weight:600;color:var(--ink)}
 .cine{background:var(--sunk);border-radius:var(--r-md);padding:14px 16px;margin:10px 0;display:grid;gap:8px}
 .cine table{width:100%;border-collapse:collapse;font-size:13.5px}.cine th,.cine td{padding:6px 8px;border-top:1px solid var(--line);text-align:left}
 .tcard{background:var(--accent-soft);border-radius:var(--r-md);padding:14px 16px;margin:10px 0;display:grid;gap:4px}
 .r360{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;margin:10px 0}
 .c360{background:var(--sunk);border-radius:var(--r-md);padding:12px 14px;display:grid;gap:6px}
 .ax3{display:grid;gap:5px;padding:10px 0;border-top:1px solid var(--line)}
 .unsent{display:grid;gap:8px;margin:10px 0}.unsent .voice{background:var(--sunk);padding:12px 14px;border-radius:var(--r-md)}
 .ring{background:var(--time-soft);border-radius:var(--r-md);padding:18px;display:grid;gap:10px}
 .rubric-box{background:var(--sunk);border-radius:var(--r-sm);padding:10px 12px;margin-top:6px;display:grid;gap:6px;font-size:13.5px}
 `;
 document.head.appendChild(st);
}

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sceneT=()=>{const s=CONTENT[G.idx]||{};if(s.type==="inbox")return "받은편지함";if(s.type==="gate")return "라운드 시작";const TN={evalc:"연말 평가",bills:"청구서",appeal:"이의제기",write:"평가 결과 공지",write3:"세 개의 설명",monthEnd:"분기 마감",roundEnd:"라운드 성적표",realloc:"배분 조정",alloc:"여력 배분",returns:"되돌아온 일",pulse:"팀 설문"};if(!val(s.title)&&TN[s.type])return TN[s.type];if(s.type==="kpipick")return "KPI 합의";return noNum(val(s.title)||s.tag||s.id||"");};

/* ===================== 리더 프로필 (03-1) ===================== */
const PROFILE={
 rd:{trait:"새 AI 도구라면 누구보다 먼저 써 보는 실험가",comm:"메신저로 빠르게. 말보다 데모 화면을 먼저 보여준다",rel:"정다은과 동맹 · 문지원과 갈등",val:"시도할 자유. 실패도 기록으로 남는 것",hate:"이유 없이 \"안 됩니다\"로 끝나는 승인 절차",below:"\"같이 일하면 배우는 게 많아요. 근데 실험 정리는 늘 저희 몫이에요.\" (차 선임)",worry:["연휴에 돌려 본 외부 AI 분석 결과를 빨리 팀에 퍼뜨리고 싶다","여력 배분에서 AI 전환 몫이 줄면 차 선임이 떠날 것 같다","올해 실험이 평가에서 \"실패 건수\"로만 보일까 봐"]},
 src:{trait:"무엇이든 한 번 더 확인하는, 규정과 안정의 관리자",comm:"문서와 근거. 회의 전에 미리 의논해 주는 것을 좋아한다",rel:"강태식과 동맹 · 서하준과 갈등",val:"절차가 지켜지는 것. 팀원들의 고용 안정",hate:"갑작스러운 변경, 규정 밖 예외를 \"이번만\"이라고 하는 것",below:"\"리더님은 저희를 지켜 주세요. 근데 AI 얘기만 나오면 대화가 끝나요.\" (윤 책임)",worry:["보안 점검표에 외부 AI 사용 현황이 새로 들어갔는데, R&D가 걱정된다","윤 책임이 AI 때문에 자기 일이 없어질까 불안해한다. 감사 준비에도 윤 책임이 필요하다","위기 때 절차를 건너뛰자는 목소리가 커질까 봐"]},
 mfg:{trait:"불을 끄는 해결사. 입사 2년 선배이자 이번 팀장 자리의 유력 후보였다",comm:"대면, 짧고 직설적으로. 회의에서 공개적으로 지적받는 것을 싫어한다",rel:"문지원과 동맹 · 이수진과 갈등",val:"현장의 자율. 선배로서의 체면",hate:"현장을 모르는 지시, 여러 사람 앞에서의 지적",below:"\"리더님이 제일 많이 대기를 서세요. 그래서 힘들다는 말을 못 해요.\" (김 사원)",worry:["후배 팀장이 생산 모듈 숫자를 새로 짤까 봐","AI 배분에서 생산이 밀리면 야간 대기가 더 몰린다","이번 위기 대응이 팀장의 공으로만 남을까 봐. 내년에도 이 팀에 있을지"]},
 prc:{trait:"불이 나기 전에 막는 예방자. 어제까지 당신의 같은 모듈 동료",comm:"차분한 1:1. 숫자와 점검 기록으로 말한다",rel:"강태식과 갈등 · 정다은과 갈등 · 팀장과 특수 관계",val:"드러나지 않는 기여가 인정받는 것",hate:"팀장과 가깝다는 이유로 편애를 의심받는 일. 해결사만 칭찬받는 분위기",below:"\"점검을 꼼꼼하게 하라고 하시는데, 그게 평가에 들어가는지는 모르겠어요.\" (오 사원)",worry:["작년 평가표에 예방이 아예 없었다. 올해도 그럴까","불 끈 사람과 불 막은 사람, 누가 공을 갖는지 이번엔 정해질까","평가에서 옛 동료라 봐준다는 말이 나올까 봐 오히려 낮게 받을 것 같다"]},
 mkt:{trait:"헬씨푸드 임원들 앞에서 가장 빛나는 수주형 리더",comm:"결론 먼저. 발표 자료로 이야기한다",rel:"서하준과 동맹 · 이수진과 갈등",val:"수주와 고객의 인정. 결과로 보여주는 것",hate:"성과 귀속 문제를 여러 사람 앞에서 따지는 것",below:"\"제안서는 제가 쓰는데 발표는 늘 리더님이 하세요. 이름 한 줄이면 되는데.\" (한 선임)",worry:["내일 헬씨푸드 임원 보고. 제안서 수치가 맞는지","헬씨푸드가 AI 효율을 이유로 운영비를 깎자고 하면 추가 수주가 막힌다","올해 수주 성과가 평가에서 다른 기준에 묻힐까 봐"]}};
const KN=()=>(G.known=G.known||{});
const kn=k=>(KN()[k]=KN()[k]||{});
/* 해금 (02-3 D-1). 직접 대화한 기록에서 계산하고, 사건으로 열린 칸은 G.known에 남긴다 */
function isOpen(k,f){const o=kn(k),F=G.f,meet=(G.kpiMeet||[]).includes(k);
 const talked=meet||F["talk_"+k]||F["c_1-5_C"]||(k==="mfg"&&(F["c_1-4_B"]||F["c_4-3_A"]||F["c_5-4-1_A"]||F["c_R3-1a_A"]||F["c_11-4_1_A"]||F["c_11-4_2_A"]))||(k==="prc"&&F["c_5-4-1_A"]);
 if(f==="가치")return !!(o.가치||talked);
 if(f==="거슬림")return !!(o.거슬림||talked);
 if(f==="걱정")return !!(o["걱정"+(G.round||1)]||G.trust[k]>=65);
 if(f==="아래")return !!(o.아래||(k==="mfg"&&(F.r_M09||F.night_seen||F["c_6-3_1_A"]||F["c_6-3_2_A"]))||(k==="mkt"&&F["c_4-4_A"])||(k==="prc"&&F.r_M13)||(k==="rd"&&F.cha_restless)||(k==="src"&&F.yoon_double&&F.yoon_hurt));
 return true;}
function knowPct(){let n=0,t=0;LK.forEach(k=>["가치","거슬림","걱정","아래"].forEach(f=>{t++;if(isOpen(k,f))n++;}));return [n,t];}
window.knowPct=knowPct;
/* 결정 기록을 보고 그 라운드의 "지금 걱정"을 연다 */
const WORRY_BY={"M26":"mfg","M37":"prc","4-3":"mfg","5-4-1":"mfg prc","R3-1a":"mfg","11-4_1":"mfg","11-4_2":"mfg","M39":"mfg"};
{const _rec=record;record=function(scene,choice,extra){
  const r=_rec(scene,choice,extra);const c=String(choice||"");
  if(WORRY_BY[scene]&&!/보류|시간 초과/.test(c)&&!(scene==="4-3"&&c!=="A")&&!(scene==="5-4-1"&&c!=="A")&&!(scene==="R3-1a"&&c!=="A")&&!(/^11-4/.test(scene)&&c!=="A")&&!(/^M/.test(scene)&&/위임/.test(c)))WORRY_BY[scene].split(" ").forEach(k=>{kn(k)["걱정"+(G.round||1)]=1;});
  if(/^위임:/.test(c)){const k=LK.find(x=>c.includes(LD[x].n));if(k)modAdd(k,3);}
  return r;};}
/* 신뢰가 움직인 사건을 남긴다 (최근 반응 · 상태 줄 · 거슬림 해금) */
{const _st=setTrust;setTrust=function(k,d,live){_st(k,d,live);if(!d||!G)return;const t=sceneT();G.react=G.react||{};const a=(G.react[k]=G.react[k]||[]);const last=a[a.length-1];
  if(last&&last.t===t)last.d+=d;else a.push({t,d});if(a.length>6)a.shift();
  if(d<=-5&&!kn(k).거슬림){kn(k).거슬림=1;kn(k).why=t;}};}
function statusLine(k){const a=(G.react||{})[k]||[];for(let i=a.length-1;i>=0;i--){if(Math.abs(a[i].d)>=3)return `요즘: ${a[i].t}${a[i].d>0?" 뒤로 마음이 열림":"에 서운해함"}`;}return "";}
function openProfile(k){
 const m=$("modal"),p=PROFILE[k],lock="<span class=\"note\">아직 모릅니다 · 1:1 대화로 알 수 있습니다</span>";
 const belowOpen=isOpen(k,"아래");
 const canPulse=!belowOpen&&G&&typeof G.time==="number"&&G.time>=0.5;
 const belowLock=`<span class="note">아직 모릅니다 · </span><button class="link" ${canPulse?"":"disabled"} data-a="__pskip">⏳0.5 소모해 모듈 주니어 한 줄 청취하기</button>`;
 const row=(l,v,open,customLock)=>`<div class="prow"><span class="label">${l}</span><div>${open?v:(customLock||lock)}</div></div>`;
 const r=(G.react||{})[k]||[];
 H.__pclose=()=>{m.hidden=true;};
 H.__pskip=()=>{if(!G||G.time<0.5)return;G.time=Math.round((G.time-0.5)*10)/10;G.tu.all+=0.5;G.tu.meet+=0.5;kn(k).아래=1;const jk={rd:"cha",src:"yoon",mfg:"kim",prc:"oh",mkt:"han"}[k];if(jk)G.f["know_"+jk]=true;record("스킵레벨청취",LD[k].m);drawBar();openProfile(k);toast(LD[k].m+" 주니어의 현장 목소리를 들었습니다.");};
 m.innerHTML=`<div class="sheet"><div class="phead">${face(k,G.trust[k])}<div><h2 style="font-size:19px">${LD[k].n} · ${LD[k].m}</h2><span class="note">신뢰 ${G.trust[k]}</span></div></div>
 ${row("한 줄 성향",p.trait,1)}${row("소통 방식",p.comm,1)}${row("관계",p.rel,1)}
 ${row("중요하게 여기는 것",p.val,isOpen(k,"가치"))}${row("거슬려 하는 것",p.hate+(kn(k).why?` <span class="note">· ${kn(k).why} 때 알게 됨</span>`:""),isOpen(k,"거슬림"))}
 ${row("지금 걱정",p.worry[(G.round||1)-1],isOpen(k,"걱정"))}${row("아래에서 본 모습",p.below,belowOpen,belowLock)}
 <div class="prow"><span class="label">최근 반응</span><div>${r.length?r.slice(-3).reverse().map(x=>`${x.t} <b class="num" style="color:${x.d>0?"var(--good)":"var(--bad)"}">${x.d>0?"+":""}${x.d}</b>`).join("<br>"):'<span class="note">아직 없습니다</span>'}</div></div>
 <div class="btns"><button class="btn" data-a="__pclose">닫기</button></div></div>`;
 m.hidden=false;}
window.openProfile=openProfile;
window.profileCards=()=>`<div class="pcards">${LK.map(k=>`<button class="pcard" onclick="openProfile('${k}')">${face(k,G.trust[k])}<span><b>${LD[k].n} · ${LD[k].m}</b><small>${PROFILE[k].trait}</small><small>${PROFILE[k].comm}</small><small class="note">${PROFILE[k].rel}</small></span></button>`).join("")}</div>`;

/* 관계도 미니맵: 동맹 실선, 갈등 점선. 나빠지면 빨간색 */
function miniMap(){const P={rd:[50,8],mkt:[92,40],prc:[76,90],mfg:[24,90],src:[8,40]};
 const L=[["rd","mkt",1],["mfg","src",1],["mfg","prc",0],["prc","mkt",0],["rd","src",0]];
 const bad=(a,b,ally)=>ally?(G.f.ally_broken&&a==="mfg")||Math.min(G.trust[a],G.trust[b])<35:Math.abs(G.trust[a]-G.trust[b])>=25||Math.min(G.trust[a],G.trust[b])<40;
 return `<svg viewBox="0 0 100 100" class="mmap" role="img" aria-label="리더 관계도">${L.map(([a,b,al])=>`<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${bad(a,b,al)?"var(--bad)":"var(--muted)"}" stroke-width="${al?2:1.4}" ${al?"":'stroke-dasharray="3 3"'}/>`).join("")}${LK.map(k=>`<g onclick="openProfile('${k}')" style="cursor:pointer"><circle cx="${P[k][0]}" cy="${P[k][1]}" r="8" fill="var(--h${LD[k].h})"/><text x="${P[k][0]}" y="${P[k][1]+3}" text-anchor="middle" font-size="7" fill="#fff">${LD[k].n[0]}</text></g>`).join("")}</svg><div class="note" style="font-size:11px">실선 동맹 · 점선 갈등 · 빨간 선은 금이 간 관계</div>`;}

/* ===================== 계기판 (02-2 ④, 02-3 F) ===================== */
const MBASE={rd:{w:55,s:40},src:{w:50,s:45},mfg:{w:70,s:60},prc:{w:45,s:35},mkt:{w:60,s:50}};
const CELLMAP={RUN:["mfg","prc"],AI:["rd","src"],GROW:["mkt","rd"],SEC:["prc","src"]};
const MD=()=>{if(!G.mod){G.mod={add:{},s:{}};LK.forEach(k=>{G.mod.add[k]=0;G.mod.s[k]=MBASE[k].s;});}return G.mod;};
function modAdd(k,v){MD().add[k]=(MD().add[k]||0)+v;}
window.modAdd=modAdd;
function workload(k,cells){const c=cells||G.cellsDraft||G.cells;let w=MBASE[k].w+(MD().add[k]||0);if(c)for(const x in CELLMAP)if(CELLMAP[x].includes(k))w-=4*(c[x]||0);return clamp(Math.round(w),0,100);}
window.workload=workload;
function voice(g){g=g||G;const coef=g.style==="push"?.85:g.style==="care"?1.15:1;return Math.max(0,Math.round(g.safe*.8*coef)+((g.burnout||0)>=3?-5:0));}
window.voice=voice;
/* 효과에서 업무량이 움직이는 경우를 잡는다 */
{const _ap=applyFx;applyFx=function(str,ctx){const s=typeof str==="string"?str:"";const over0=G.over,f0={yd:G.f.yoon_double,ns:G.f.night_seen,ol:G.f.overload_risk};
  const r=_ap(str,ctx);
  if(G.over>over0){modAdd("mfg",6*(G.over-over0));modAdd("prc",6*(G.over-over0));}
  if(/칸:GROW-/.test(s)){modAdd("mkt",8);modAdd("rd",8);}
  if(!f0.yd&&G.f.yoon_double)modAdd("src",8);if(!f0.ns&&G.f.night_seen)modAdd("mfg",10);if(!f0.ol&&G.f.overload_risk){modAdd("mfg",5);modAdd("prc",5);}
  return r;};}
/* 장면이 넘어갈 때: 스트레스가 쌓이고, 발언량이 크게 줄면 알린다 */
{const _next=next;next=function(){
  if(G&&!G.review){const s=CONTENT[G.idx]||{};
   if((s.round||s.month)&&G.cells){const M=MD();LK.forEach(k=>{const w=workload(k);if(w>=70)M.s[k]=clamp(M.s[k]+5,0,100);else if(w<=50)M.s[k]=clamp(M.s[k]-3,0,100);
     const key=k+(G.round||1);G.str80=G.str80||{};if(M.s[k]>=80&&!G.str80[key]){G.str80[key]=1;applyFx(k+"-3 B7+5");}});}
   if(CINE_POST[s.id]){const m=s.id==="4-2"&&G.cells?simAlloc(G.cells):metricsNow();if(m)G.post=Object.assign(G.post||{},{[CINE_POST[s.id]]:m});}
   const v=voice(),p=G.voiceLast;if(p&&v<=p*.8){toast(`지난주 대비 팀 발언량 ${Math.round((v-p)/p*100)}% · 게시판: "${vary("vboard",VBOARD)}"`);}G.voiceLast=v;}
  return _next();};}
const VBOARD=["말해 봐야 바뀌는 게 없더라.","요즘 회의에서 다들 고개만 끄덕여요.","그냥 시키는 대로 하는 게 편해요.","질문하면 일만 늘어나요."];

/* 사이드바 (02-3 D-2, F-1) */
const MITIG_AT=["4-2","R3-0"];
function mitigate(k,kind){const M=MD(),r=G.round||1;G.mitig=G.mitig||{};if((G.mitig[r]||0)>=3)return;G.mitig[r]=(G.mitig[r]||0)+1;
 const hi=M.s[k]>=80;let live={};
 if(kind==="ext"){M.s[k]=clamp(M.s[k]-15,0,100);modAdd(k,-10);live=applyFx("재무-2");}
 else{M.s[k]=clamp(M.s[k]-10,0,100);live=applyFx(k==="mkt"||k==="rd"?"헬씨푸드만족-2":"성과-1");}
 if(hi)applySig("③L",1,(CONTENT[G.idx]||{}).id,"완화:"+LD[k].n);
 record("완화",LD[k].n+":"+(kind==="ext"?"외부 지원":"마감 조정"));beep(500,.05);drawSide(live);}
window.v3mitigate=mitigate;
drawSide=function(live){
 const p=$("people"),s=CONTENT[G.idx];
 p.hidden=!!(s&&s.bare);$("shell").style.gridTemplateColumns=p.hidden?"minmax(0,1fr)":"";if(p.hidden)return;
 const dl=k=>{const d=live&&live[k];return d?`<span class="delta ${d>0?"up":"down"}">${d>0?"+":""}${d}</span>`:"";};
 const M=MD(),can=s&&MITIG_AT.includes(s.id)&&((G.mitig||{})[G.round||1]||0)<3;
 const v=voice();const vp=G.voiceLast;const vd=vp?Math.round((v-vp)/Math.max(1,vp)*100):0;
 p.innerHTML=`<div><div class="label">모듈 리더 <span class="note" style="font-weight:400">· 얼굴을 누르면 프로필</span></div><div class="leaders">${LK.map(k=>`<button class="ld" style="text-align:left" onclick="openProfile('${k}')">${face(k,G.trust[k])}<div><b>${LD[k].n} <span class="num" style="font-weight:400;color:var(--muted)">${G.trust[k]}</span></b><small>${LD[k].m}</small><div class="tb"><i style="width:${G.trust[k]}%"></i></div>${statusLine(k)?`<div class="stl">${statusLine(k)}</div>`:""}</div>${dl(k)}</button>`).join("")}</div>${miniMap()}</div>
 <div><div class="label">계기판</div><div class="cards">${SCORES.map(k=>`<div class="card"><span>${SL(k)}</span><b>${G.score[k]}</b></div>`).join("")}<div class="card"><span style="white-space:nowrap;letter-spacing:-.03em">헬씨푸드 만족</span><b>${G.fsat}</b><em>기대 ${G.fexp??50}</em></div><div class="card"><span>팀 발언량</span><b>${v}</b><em>${vp&&vd?`<span style="color:${vd>0?"var(--good)":"var(--bad)"}">지난 장면 ${vd>0?"+":""}${vd}%</span>`:"주간 건수"}</em></div></div></div>
 <div><div class="label">모듈 업무량 · 스트레스</div><div class="mods">${LK.map(k=>{const w=workload(k),st=M.s[k];return `<div class="mod"><span>${LD[k].m}</span><div class="mbar" title="업무량 ${w} · 스트레스 ${st}"><i class="w" style="width:${w}%"></i><i class="s ${st>=80?"hot":st>=60?"warm":""}" style="width:${st}%"></i></div><b class="num">${st}</b>${can?`<span class="mbtn"><button onclick="v3mitigate('${k}','ext')" title="단기 외부 지원: 스트레스 −15, 재무 −2">지원</button><button onclick="v3mitigate('${k}','due')" title="마감 조정: 스트레스 −10, 헬씨푸드 만족 또는 고객 −">조정</button></span>`:""}</div>`;}).join("")}</div><div class="note" style="font-size:11px">위 막대 업무량 · 아래 막대 스트레스${can?` · 완화 ${3-((G.mitig||{})[G.round||1]||0)}번 남음`:""}</div></div>`;
};

/* 여력 칸 설명 (2026-11-21). 02-2 ③ "칸의 뜻"과 "배분이 뒤 결정을 좌우" 표, 실제 코드의 효과 방향만 쓴다. 크기와 시점은 숨긴다 */
const CELL_INFO={
 RUN:{n:"RUN 기존 운영",what:"지금 돌아가는 헬씨푸드 운영과 야간 대기를 지키는 인력",mods:"생산 · 가공",hi:"강태식(생산)과 문지원(조달)이 반깁니다. 야간 운영에 여유가 생깁니다.",lo:"강태식과 문지원의 신뢰가 크게 떨어집니다. 야간 대기가 몇 사람에게 쏠리고, 새벽에 장애가 나면 당번이 혼자 남습니다."},
 AI:{n:"AI 전환",what:"AI 도구 도입, 교육, 자동화에 쓰는 인력",mods:"R&D · 조달",hi:"서하준(R&D)이 반깁니다. AI 활용 성과가 쌓여 연말 평가의 근거가 됩니다.",lo:"서하준의 신뢰가 크게 떨어집니다. AI 전환이 R&D 혼자 밀어붙이는 일로 남습니다."},
 GROW:{n:"GROW 추가 제안",what:"헬씨푸드에 새 과제를 제안하고, 더 요구받은 일을 받아 매출을 만드는 인력",mods:"마케팅 · R&D",hi:"정다은(마케팅)이 반깁니다. 헬씨푸드에 새 일을 더 받아 줄 때 수익으로 이어질 여지가 생깁니다.",lo:"정다은의 신뢰가 떨어집니다. 헬씨푸드가 일을 더 요구할 때 받아 줄 칸이 없어, 받으면 곧바로 초과 부하가 됩니다."},
 SEC:{n:"SEC 예방·보안",what:"점검, 개선, 보안 교육처럼 사고를 미리 막는 인력",mods:"가공 · 조달",hi:"이수진(가공)과 문지원이 반깁니다. 사고가 나도 피해가 줄고, 새벽 장애 때 예방 인력이 원인 기록을 바로 뽑습니다.",lo:"이수진의 신뢰가 떨어집니다. 사고가 나면 피해가 커집니다."}};
window.CELL_INFO=CELL_INFO;
window.cellRowInfo=function(k,n){const I=CELL_INFO[k];if(!I)return k;const st=n>=3?["넉넉","var(--good)"]:n<=1?["부족","var(--bad)"]:["보통","var(--muted)"];
 const ln=(on,mark,lab,txt)=>`<div style="font-size:12.5px;line-height:1.45;margin-top:3px;color:${on?"var(--ink)":"var(--muted)"};opacity:${on?1:.7}">${mark} <strong style="font-weight:600">${lab}</strong> ${txt}</div>`;
 return `<div style="min-width:0;text-align:left"><div style="font-size:14.5px;color:var(--ink)"><strong style="font-weight:700">${I.n}</strong> <small style="display:inline-block;font-size:11.5px;border:1px solid currentColor;border-radius:999px;padding:0 7px;margin-left:4px;color:${st[1]};vertical-align:1px">${st[0]} · ${n}칸</small></div>
  <div style="font-size:13px;color:var(--muted);margin-top:2px;line-height:1.45">${I.what}. 칸을 놓으면 <strong style="font-weight:600;color:var(--ink)">${I.mods}</strong> 업무량이 줄어듭니다.</div>
  ${ln(n>=3,"▲","3칸 이상이면",I.hi)}${ln(n<=1,"▼","1칸 이하이면",I.lo)}</div>`;};
window.cellGuideHtml=function(r3){const L=r3?[
 "9월까지의 배분에 <b>2칸이 새로 생겼습니다</b>. 새 2칸을 놓고, 기존 칸은 <b>2칸까지</b> 다른 곳으로 옮길 수 있습니다.",
 "칸마다 <b>2칸이 보통</b>, <b>3칸 이상은 넉넉</b>, <b>1칸 이하는 부족</b>입니다. 넉넉하거나 부족해진 칸은 확정하는 순간 그 칸을 바라는 리더의 반응과 4분기 장면이 달라집니다.",
 "칸을 하나 놓을 때마다 그 칸을 맡는 두 모듈의 <b>업무량</b>이 줄어듭니다(아래 막대). 업무량이 70 이상인 모듈은 장면마다 스트레스가 쌓이고, 스트레스가 80을 넘으면 그 리더의 신뢰가 깎입니다.",
 "4월에 배분을 공지했다면, 칸을 옮긴 뒤 다시 알릴지 묻습니다(규칙 ③)."]:[
 "<b>팀 여력 10칸</b>은 AI 전환으로 반복 업무가 줄면서 팀원들에게 생긴 여유 시간입니다. 사람이 늘어난 것이 아니라, 같은 30명이 덜어 낸 일만큼 생긴 손입니다. 이번 결정은 그 여유를 어디에 쓸지 정하는 일입니다.",
 "칸마다 <b>2칸이 보통</b>입니다. <b>3칸 이상은 넉넉</b>, <b>1칸 이하는 부족</b>으로 보고, 확정하는 순간 그 칸을 바라는 리더의 반응과 뒤에 오는 장면이 달라집니다. 효과의 크기와 시점은 미리 알려 주지 않습니다.",
 "칸을 하나 놓을 때마다 그 칸을 맡는 두 모듈의 <b>업무량</b>이 줄어듭니다(아래 막대). 업무량이 70 이상인 모듈은 장면마다 스트레스가 쌓이고, 스트레스가 80을 넘으면 그 리더의 신뢰가 깎입니다.",
 "8월에 본사가 인력을 빼 가면 어느 칸에서 줄일지 다시 정하고, 10월(Round 3 시작)에는 2칸이 새로 생겨 다시 조정합니다."];
 return `<details class="ref"${r3?"":" open"}><summary>칸을 어떻게 읽나요?</summary><ul style="margin:6px 0 0;padding-left:18px;font-size:13.5px;line-height:1.55">${L.map(x=>`<li>${x}</li>`).join("")}</ul></details>`;};
/* 배분 화면 안에도 모듈 막대를 띄운다 (칸을 옮기면 바로 움직인다) */
function modPanel(){const M=MD(),can=((G.mitig||{})[G.round||1]||0)<3;return `<div class="modpanel"><div class="label">모듈 업무량 · 스트레스 <span class="note" style="font-weight:400">칸을 옮기면 바로 움직입니다${can?` · 완화 ${3-((G.mitig||{})[G.round||1]||0)}번 남음`:""}</span></div>${LK.map(k=>{const w=workload(k),st=M.s[k];return `<div class="mrow"><span>${LD[k].m}</span><span class="note">업무량</span><div class="b3"><i style="width:${w}%;background:${w>=70?"var(--bad)":"var(--lav)"}"></i><span class="num">${w}</span></div><span class="note">스트레스</span><div class="b3"><i style="width:${st}%;background:${st>=80?"var(--bad)":st>=60?"var(--s4)":"var(--mint-bar)"}"></i><span class="num">${st}</span></div>${can?`<span class="mbtn"><button onclick="v3mitigate('${k}','ext');v3modRefresh()" title="스트레스 −15 · 업무량 −10 · 재무 −2">외부 지원</button><button onclick="v3mitigate('${k}','due');v3modRefresh()" title="스트레스 −10 · 헬씨푸드 만족 또는 고객 −">마감 조정</button></span>`:""}</div>`;}).join("")}</div>`;}
window.v3modRefresh=()=>{const e=document.querySelector('#view .modpanel');if(e)e.outerHTML=modPanel();};
{const _sh=shell;shell=function(html,live,clock){const s=CONTENT[G.idx]||{};if(MITIG_AT.includes(s.id)&&typeof html==="string"&&html.includes('<div class="table">'))html=html.replace('<div class="table">',modPanel()+'<div class="table">');return _sh(html,live,clock);};}
/* ===================== R3-0 배분 조정 (03-4) ===================== */
SCENES.realloc=function(s){
 const orig={...(G.cells||{RUN:2,AI:2,GROW:2,SEC:2})},T=Object.values(orig).reduce((a,b)=>a+b,0)+2,c={...orig};
 const moved=()=>Object.keys(orig).reduce((a,k)=>a+Math.max(0,orig[k]-c[k]),0),tot=()=>Object.values(c).reduce((a,b)=>a+b,0);
 const N={RUN:"RUN 기존 운영",AI:"AI 전환",GROW:"GROW 추가 제안",SEC:"SEC 예방·보안"};
 const draw=()=>{paint("");G.cellsDraft={...c};const ok=tot()===T&&moved()<=2;
  shell(`<div class="pane"><div class="eyebrow">Round 3 · 배분 조정</div><h2>새로 생긴 2칸을 놓고, 필요하면 2칸까지 옮기세요</h2><p class="note">칸을 옮기면 아래 모듈 막대가 바로 움직입니다. 스트레스가 높은 모듈에는 [외부 지원] · [마감 조정]을 쓸 수 있습니다 (라운드당 3번).</p>
  ${cellGuideHtml(true)}<div class="table">${Object.keys(c).map(k=>`<div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px"><div style="min-width:0">${cellRowInfo(k,c[k])}<div class="note" style="font-size:12px;margin-top:3px">9월까지 ${orig[k]}칸</div></div><span class="btns" style="align-items:center;flex:0 0 auto;flex-wrap:nowrap"><button class="btn" ${A(()=>{if(c[k]>0&&(c[k]>orig[k]||moved()<2)){c[k]--;draw();}})}>−</button><b>${c[k]}</b><button class="btn" ${A(()=>{if(tot()<T){c[k]++;draw();}})}>+</button></span></div>`).join("")}</div>
  <div class="foot"><span class="note num">${tot()}/${T}칸 · 옮긴 칸 ${moved()}/2</span><button class="btn main" ${ok?"":"disabled"} ${A(fin)}>확정</button></div></div>`);};
 const fin=()=>{const changed=Object.keys(orig).some(k=>moved()>0);G.cells={...c};delete G.cellsDraft;record("R3-0",JSON.stringify(c));
  if(changed&&G.f.alloc_notice){paint("");shell(`<div class="pane"><div class="eyebrow">규칙 ③</div><h2>바뀐 배분을 알릴까요?</h2><p class="note">공지한 배분을 바꿨습니다. 공개한 기준을 바꾸면 다시 알려야 합니다.</p><div class="opts"><button class="opt" ${G.time<1?"disabled":""} ${A(()=>{G.time-=1;G.tu.all+=1;applyFx("안전+1");applySig("④L",1,"R3-0","재공지");next();})}><span class="k">A</span><span>바뀐 칸과 이유를 간단히 알린다${glHtml({gl:["모두가 바뀐 배분을 앎","시간이 듦"]})}</span><span class="cost">⏳1</span></button><button class="opt" ${A(()=>{G.f.rule3_cells=true;applyFx("안전-2 B10+20");applySig("④P",1,"R3-0","재공지 없음");next();})}><span class="k">B</span><span>따로 알리지 않는다${glHtml({gl:["시간을 아낌","말과 행동이 다르다는 말이 나올 수 있음"]})}</span><span class="cost">0</span></button></div></div>`);}
  else next();};
 draw();};

/* ===================== R2-7 세 개의 설명 (03-3) ===================== */
const SENT={
 measure:{f:[["운영비는 동결하되, 귀사 납품 데이터로 실측한 절감만 내년 단가에 반영하겠습니다. 측정 방식은 이달 말까지 유 과장님과 정하겠습니다.",3],["운영비는 동결하고, 실측으로 확인된 절감은 내년 단가에 반영하겠습니다. 귀사와 함께 확인하겠습니다.",2],["하반기 운영비는 현 수준을 유지하기로 했습니다. 앞으로도 최선을 다하겠습니다.",1]],
  b:[["근거 없는 인하를 막고 실측 기준으로 바꿨습니다. 헬씨푸드 불만 위험은 있어, 다음 달 실측 1차 결과로 다시 보고드리겠습니다.",3],["운영비를 지키고 실측 기준으로 바꿨습니다. 헬씨푸드 반응은 지켜봐야 합니다.",2],["헬씨푸드와 하반기 계약 방향을 정리했습니다. 세부 사항은 따로 보고드리겠습니다.",1]],
  t:[["운영비는 지켰고, 절감은 실측한 만큼만 인정받기로 했습니다. 기록 부담이 늘지 않게 측정 항목은 다음 주까지 모듈별로 정하겠습니다.",3],["운영비는 지켰고, 절감은 실측한 만큼만 인정받기로 했습니다. 측정은 모듈과 함께 정하겠습니다.",2],["하반기 계약이 정해졌습니다. 모두 수고 많으셨습니다.",1]]},
 cut:{f:[["귀사 요청대로 운영비를 5% 낮추고, 신규 과제 우선 협상권을 계약에 넣었습니다. 첫 과제 후보는 다음 달 미팅에서 제안드리겠습니다.",3],["운영비를 5% 낮추고 신규 과제 우선 협상권을 넣었습니다. 귀사와의 관계를 길게 보겠습니다.",2],["하반기 운영비를 조정했습니다. 앞으로도 잘 부탁드립니다.",1]],
  b:[["5% 인하로 이익은 줄지만 우선 협상권으로 추가 매출 기회를 확보했습니다. 인하분 보전 계획은 이번 달 안에 올리겠습니다.",3],["5% 인하 대신 우선 협상권을 받았습니다. 추가 매출로 메울 계획입니다.",2],["헬씨푸드와 하반기 계약을 마무리했습니다. 결과를 공유드립니다.",1]],
  t:[["운영비를 5% 낮추는 대신 새 과제를 먼저 협상할 권리를 받았습니다. 비용을 사람으로 메우지 않도록 다음 배분 때 기준을 먼저 알리겠습니다.",3],["운영비를 5% 낮추는 대신 새 과제 우선 협상권을 받았습니다. 인력 걱정은 이해합니다.",2],["하반기 계약이 정해졌습니다. 다들 고생 많으셨습니다.",1]]},
 more:{f:[["운영비는 그대로 두고 귀사 수요예측 등 신규 과제 2건을 하반기에 더하겠습니다. 첫 결과물은 9월 둘째 주에 보여드리겠습니다.",3],["운영비는 그대로 두고 신규 과제 2건을 더하겠습니다. 귀사 일정에 맞추겠습니다.",2],["하반기에 더 많은 가치를 드리기로 했습니다. 기대해 주십시오.",1]],
  b:[["운영비를 지키고 신규 2건으로 매출을 늘렸습니다. 인력이 빠듯해 9월 야간 계획은 다음 주까지 따로 보고드리겠습니다.",3],["운영비를 지키고 신규 2건을 더했습니다. 인력은 빠듯합니다.",2],["헬씨푸드와 하반기 계약을 정리했습니다. 잘 진행하겠습니다.",1]],
  t:[["운영비를 지키는 대신 신규 과제 2건을 받았습니다. 일이 늘어나는 만큼 무엇을 내려놓을지 이번 주 리더 회의에서 정해 알리겠습니다.",3],["운영비를 지키는 대신 신규 과제 2건을 받았습니다. 일이 늘어나는 것 압니다.",2],["하반기 계약이 정해졌습니다. 함께 잘 해 봅시다.",1]]}};
if(SPEC["6-2"])SPEC["6-2"].targets.forEach(t=>{if(t.n==="사업부장")t.n="본부장";});
SCENES.write3=function(s){
 const spec=SPEC["6-2"],ct=G.f.ct_cut?"cut":G.f.ct_more?"more":"measure",T=spec.targets,list=principleList().concat(gradeList());
 let why=null,direct=null,text="",pick={};G.ord3=G.ord3||{};
 const d1=()=>{paint("");shell(`<div class="pane"><div class="eyebrow">세 개의 설명</div><h2>하반기 계약을 세 사람에게</h2><div class="prose"><p>헬씨푸드 협상에서 정한 계약을 헬씨푸드 임원, 본부장, 팀 전체에게 알립니다. <b>한 사람에게는 직접 쓰고</b>, 나머지 둘에게는 준비된 문장 중에서 고릅니다.</p></div>${condLines(spec)}<p><b>이 결정의 근거를 고르세요.</b></p>${list.length?`<div class="opts">${list.map((w,i)=>`<button class="opt" style="grid-template-columns:24px minmax(0,1fr)" aria-pressed="${why===w}" ${A(()=>{why=w;d1();})}><span class="k">${i+1}</span><span>${w}</span></button>`).join("")}</div>`:'<div class="happen">공개한 기준이 없습니다. "팀장 판단"으로 기록됩니다.</div>'}
  <p><b>누구에게 직접 쓸까요?</b></p><div class="btns">${T.map(t=>`<button class="btn ${direct===t.k?"main":""}" ${A(()=>{direct=t.k;d1();})}>${val(t.n)}</button>`).join("")}</div>
  <div class="foot"><span></span><button class="btn main" ${(why||!list.length)&&direct?"":"disabled"} ${A(d2)}>다음</button></div></div>`);};
 const d2=()=>{paint("");const t=T.find(x=>x.k===direct);
  shell(`<div class="pane"><div class="eyebrow">직접 쓰기 · ${val(t.n)} · ${t.form}</div><h2>"${val(t.q)}"</h2><p class="note">3~5문장. 기준, 상대의 궁금증, 다음 행동(날짜나 기한)이 들어가면 좋습니다.</p><textarea id="w3" style="min-height:140px">${text}</textarea>
  ${T.filter(x=>x.k!==direct).map(x=>{const o=(G.ord3[x.k]=G.ord3[x.k]||[0,1,2].sort(()=>Math.random()-.5));return `<p style="margin-top:14px"><b>${val(x.n)}</b> · <span class="note">${x.form} · "${val(x.q)}"</span></p><div class="opts">${o.map((i,j)=>{const sn=SENT[ct][x.k][i];return `<button class="opt" style="grid-template-columns:24px minmax(0,1fr)" aria-pressed="${pick[x.k]===i}" ${A(()=>{text=$("w3").value;pick[x.k]=i;d2();})}><span class="k">${"ABC"[j]}</span><span>${sn[0]}</span></button>`;}).join("")}</div>`;}).join("")}
  <div class="foot"><button class="btn" ${A(()=>{text=$("w3").value;d1();})}>← 근거</button><button class="btn main" id="w3go" ${A(fin)}>보낸다</button></div></div>`);
  const up=()=>{const ok=readable($("w3").value,20).ok&&T.filter(x=>x.k!==direct).every(x=>pick[x.k]!=null);$("w3go").disabled=!ok;};$("w3").oninput=e=>{text=e.target.value;up();};up();};
 const count=(t,txt)=>{let n=0;if((why&&txt.includes(why))||/실측|절감|비용|위험|효과|기준/.test(txt))n++;if((val(t.ans)||[]).concat(t.words||[]).some(w=>txt.includes(w)))n++;if(/\d+\s*(월|일|주)|까지|다음\s*(주|달|회의|미팅)|이번\s*주|이달/.test(txt))n++;return n;};
 const fin=()=>{text=$("w3").value.trim();const live={};let sum=0;const out=[];
  if(why){const fit=(val(spec.fit)||[]).includes(why);G.cons.push({scene:"6-2",choice:ct,why,fit});}
  T.forEach(t=>{const n=t.k===direct?count(t,text):SENT[ct][t.k][pick[t.k]][1];sum+=n;const rp=t.reply[n>=3?0:n===2?1:2];applyFx(rp[1],{live});out.push([val(t.n),t.k===direct?"직접 씀":"고른 문장",rp[0]]);});
  if(sum>=6)applySig("④L",1,"6-2","세 개의 설명");
  G.written.three={근거:why||"팀장 판단",직접:{대상:val(T.find(x=>x.k===direct).n),글:text},고른문장:Object.fromEntries(T.filter(x=>x.k!==direct).map(x=>[val(x.n),SENT[ct][x.k][pick[x.k]][0]]))};
  record("6-2",direct+":"+Object.values(pick).join(""));
  paint("");shell(`<div class="pane"><div class="eyebrow">일어난 일</div><h2>세 사람이 받았습니다</h2>${out.map(o=>`<div class="happen"><span class="label">${o[0]} · ${o[1]}</span>${o[2]}</div>`).join("")}<p class="note">직접 쓴 글은 사람 채점으로 넘어갑니다.</p><div class="foot"><span></span><button class="btn main" ${A(next)}>다음</button></div></div>`,live);};
 d1();};

/* ===================== 인생극장 (02-5 D) ===================== */
const CINE_POST={"3-1":"R1","4-2":"R2","R3-1b":"R3"};
function metricsNow(g){g=g||G;return{성과:g.score.성과,재무:g.score.재무,사람:g.score.사람,안정:g.score.안정,헬씨푸드:g.fsat,발언량:voice(g),trust:{...g.trust},cells:g.cells?{...g.cells}:null,maxW:Math.max(...LK.map(k=>workload(k,g.cells))),avgT:Math.round(LK.reduce((a,k)=>a+g.trust[k],0)/5)};}
window.v3TopupToken=function(){
 G.token=(G.token||0)+40;G.f.token_drain=true;applyFx("재무-2");
 record("토큰증액","+40(재무-2)");toast("긴급 토큰 +40 증액 (재무 −2 반영)");render();
};
{const _sc=SC_CHOICE;SC_CHOICE=function(s,opt){
 if((s.id==="3-1-2"||s.id==="R3-1b")&&!(G.snap||{})[s.id]){const c=JSON.parse(JSON.stringify(G));delete c.snap;delete c.post;(G.snap=G.snap||{})[s.id]=JSON.stringify(c);}
 if(G.token==null){G.token=G.tokenCap||40;G.tokenCap=G.tokenCap||40;}
 const tok0=G.token;
 const r=_sc(s,opt);
 const opts=val(s.options)||[];
 if(opts.some(o=>o.tok&&(G.token||0)<o.tok)){
  const v=$("view");if(v&&!v.querySelector(".tok-topup")){
   const d=document.createElement("div");d.className="tok-topup";d.style.paddingLeft="32px";
   d.innerHTML=`<button class="link" onclick="v3TopupToken()">💳 토큰 한도 긴급 증액 (+40 · 이번 라운드 재무 −2)</button>`;
   const ol=v.querySelector(".opts");if(ol)ol.appendChild(d);
  }
 }
 return r;
};}
/* 토큰 소모량 실시간 추적 (G.roundTok) */
{const _rec2=record;record=function(scene,choice,extra){
 const s=CONTENT.find(x=>x.id===scene||(x.cases||[]).some(c=>c.id===scene));
 if(s){const opts=val(s.options)||(s.cases&&s.cases.flatMap(c=>c.options))||[];const o=opts.find(x=>x.k===choice);
  if(o&&o.tok){const r=G.round||1;G.roundTok=G.roundTok||{1:0,2:0,3:0};G.roundTok[r]=(G.roundTok[r]||0)+o.tok;}}
 return _rec2(scene,choice,extra);
};}
{const _al=SCENES.alloc;SCENES.alloc=function(s){if(!(G.snap||{})["4-2"]){const c=JSON.parse(JSON.stringify(G));delete c.snap;delete c.post;(G.snap=G.snap||{})["4-2"]=JSON.stringify(c);}return _al(s);};}
function sim(id,fn){const snap=(G.snap||{})[id];if(!snap)return null;const keep=G,h=H,hn=hN;let m=null;try{G=fillDefaults(JSON.parse(snap));G.sound=false;const t0=document.getElementById("toast").hidden;fn();m=metricsNow();}catch(e){console.warn("인생극장 계산",e);}G=keep;H=h;hN=hn;return m;}
function simOption(id,o){return sim(id,()=>{applyFx(val(o.fx)||"");(o.tw||[]).forEach(t=>{const p=(typeof t.p==="function"?t.p(G):t.p)/100;if(p>0)applyFx(val(t.fx)||"",{pos:p,neg:p});});});}
const ARCH={"운영 안정형":{RUN:4,AI:2,GROW:2,SEC:2},"전환 가속형":{RUN:2,AI:4,GROW:2,SEC:2},"성장형":{RUN:2,AI:2,GROW:4,SEC:2},"예방형":{RUN:2,AI:2,GROW:2,SEC:4}};
const ARCH_SAY={"운영 안정형":[["mfg","이번엔 야간이 버텼어."],["rd","R&D는 올해도 기다리래요."]],"전환 가속형":[["rd","자동화가 두 개 붙었어요."],["yoon","제 일은 언제 없어지나요?"]],"성장형":[["mkt","신규 두 건, 다 따 왔어요."],["kim","야간 또 혼자예요."]],"예방형":[["prc","8개월째 무사고예요."],["mkt","헬씨푸드가 새 제안은 언제 오냐고 해요."]]};
function applyAllocProjectedFx(c){
 /* 배분의 한 분기 뒤 기대 효과 (02-5 D-2 투영표). 매출성 효과는 재무로 (BSC). 내 선택과 대안에 같은 표를 쓴다 */
 const hi={RUN:"mfg+2 src+1 안정+2",AI:"rd+2 재무+2",GROW:"mkt+2 재무+3",SEC:"prc+2 src+1 안정+3"},
       lo={RUN:"mfg-4 src-2 안정-3",AI:"rd-4 재무-1",GROW:"mkt-3 재무-2",SEC:"prc-3 안정-3"};
 Object.keys(c).forEach(k=>{if(c[k]>=3)applyFx(hi[k]);else if(c[k]<=1)applyFx(lo[k]);});
}
function simAlloc(c){return sim("4-2",()=>{applyAllocProjectedFx(c);G.cells={...c};});}
const CINE={
 R1:{scene:"3-1-2",label:"KPI 기준을 어디까지 알렸나",keys:["구성원","발언량","이수진 신뢰","강태식 신뢰","기준 인지(추정)"],
  mine:()=>G.f["c_3-1-2_A"]?"A":G.f["c_3-1-2_B"]?"B":G.f["c_3-1-2_C"]?"C":null,alt:{A:"C",B:"A",C:"A"},opts:()=>CONTENT.find(x=>x.id==="3-1").levels,
  names:{A:"전체 공개",B:"항목만 공개",C:"리더에게만"},pubv:{A:65,B:55,C:42},
  say:{A:[["prc","예방 기록이 처음으로 기준표에 들어갔네요."],["board","점검 몇 번이면 몇 점이에요? 다들 계산 중."]],B:[["oh","항목은 봤는데 비중은 리더님마다 말이 달라요."]],C:[["src","저희 모듈은 제가 알아서 설명하겠습니다."],["board","다른 모듈은 기준이 다르다던데?"]]}},
 R2:{scene:"4-2",label:"팀 여력 10칸을 어떻게 나눴나",keys:["모듈 업무량 최고","리더 신뢰 평균","고객","재무","서비스 안정"]},
 R3:{scene:"R3-1b",label:"새벽 3시, 3번 라인",keys:["서비스 안정","헬씨푸드 만족","발언량","강태식 신뢰","고객"],
  mine:()=>G.f["c_R3-1b_A"]?"A":G.f["c_R3-1b_B"]?"B":G.f["c_R3-1b_C"]?"C":null,alt:{A:"B",B:"A",C:"A"},opts:()=>CONTENT.find(x=>x.id==="R3-1b").options,
  names:{A:"정지 + 절차",B:"부분 가동",C:"우회 승인"},
  say:{A:[["src","절차대로 세웠으니 할 말은 있습니다."],["oh","센서 값 이상, 지난주에도 봤습니다. 말씀드렸어야 했는데…"]],B:[["mfg","현장은 이게 현실이에요."],["prc","그 구간 옆 라인도 같은 센서를 써요."]],C:[["mfg","납기는 지켰다."],["src","그 우회, 승인 기록이 없습니다."]]}}};
function pick5(r,m,base){if(!m||!base)return null;const d=(a,b)=>a-b;
 if(r==="R1"){return[d(m.사람,base.사람),d(m.발언량,base.발언량),d(m.trust.prc,base.trust.prc),d(m.trust.mfg,base.trust.mfg)];}
 if(r==="R2"){return[m.maxW-base.maxW,m.avgT-base.avgT,d(m.성과,base.성과),d(m.재무,base.재무),d(m.안정,base.안정)];}
 return[d(m.안정,base.안정),d(m.헬씨푸드,base.헬씨푸드),d(m.발언량,base.발언량),d(m.trust.mfg,base.trust.mfg),d(m.성과,base.성과)];}
function cinema(r){
 const C=CINE[r],snap=(G.snap||{})[C.scene],post=(G.post||{})[r];if(!snap||!post)return null;
 let base;{const keep=G;G=fillDefaults(JSON.parse(snap));base=metricsNow();G=keep;}
 let mineN,altN,altM,mine5,alt5,say=[];
 if(r==="R2"){const cells=post.cells||G.cells||{};const dist=(a,b)=>Object.keys(a).reduce((s,k)=>s+Math.abs((a[k]||0)-(b[k]||0)),0);const name=Object.keys(ARCH).sort((a,b)=>dist(ARCH[b],cells)-dist(ARCH[a],cells))[0];
  mineN="내 배분 "+["RUN","AI","GROW","SEC"].map(k=>k+" "+(cells[k]||0)).join(" · ");altN=name+" "+["RUN","AI","GROW","SEC"].map(k=>k+" "+ARCH[name][k]).join(" · ");altM=simAlloc(ARCH[name]);say=ARCH_SAY[name];}
 else{const mk=C.mine();if(!mk)return null;const ak=C.alt[mk];const o=(C.opts()||[]).find(x=>x.k===ak);if(!o)return null;altM=simOption(C.scene,o);mineN=mk+". "+C.names[mk];altN=ak+". "+C.names[ak];say=C.say[ak]||[];}
 mine5=pick5(r,post,base);alt5=pick5(r,altM,base);if(!mine5||!alt5)return null;
 if(r==="R1"){const mk=C.mine(),ak=C.alt[mk];mine5.push(C.pubv[mk]);alt5.push(C.pubv[ak]);}
 const better=(i,a,b)=>r==="R2"&&i===0?a<b:a>b;
 let mw=0,aw=0;C.keys.forEach((k,i)=>{if(better(i,mine5[i],alt5[i]))mw++;else if(better(i,alt5[i],mine5[i]))aw++;});
 const gap=Math.abs(mine5.slice(0,3).reduce((a,b)=>a+b,0)-alt5.slice(0,3).reduce((a,b)=>a+b,0));
 return{r,label:C.label,keys:C.keys,mineN,altN,mine5,alt5,mw,aw,gap,say};}
function cinemaHtml(r){const c=cinema(r);if(!c)return "";const sg=v=>r==="R1"&&false?v:(v>0?"+":"")+v;
 const cell=(i,v,o)=>{const b=(r==="R2"&&i===0)?v<o:v>o;return `<td class="num" style="${b?"color:var(--good);font-weight:600":""}">${c.keys[i]==="기준 인지(추정)"?v:sg(v)}</td>`;};
 return `<div class="cine"><div class="eyebrow">그래, 결심했어 · ${c.label}</div><table><tr><th></th><th>내 선택${r==="R2"?" (추정)":""}<br><small>${c.mineN}</small></th><th>다른 선택이었다면 (추정)<br><small>${c.altN}</small></th></tr>${c.keys.map((k,i)=>`<tr><td>${k}${r==="R2"&&i===0?' <span class="note">(낮을수록 좋음)</span>':""}</td>${cell(i,c.mine5[i],c.alt5[i])}${cell(i,c.alt5[i],c.mine5[i])}</tr>`).join("")}</table>${c.say.length?`<p class="note" style="margin-top:8px"><b>다른 선택을 했다면 들었을 말</b></p>`:""}${c.say.map(x=>`<p class="note" style="margin-top:4px">${x[0]==="board"?"익명 게시판":name(x[0])}: "${x[1]}"</p>`).join("")}<p class="note">결정 직전 상태에서 다른 선택지의 즉시 효과와 확률 결과의 기대값만 다시 계산했습니다. 어느 쪽이 정답인지 판정하지 않습니다.</p></div>`;}
window.cinemaHtml=cinemaHtml;window.cinema=cinema;

/* 라운드 결과 이론 카드 (02-5 E) */
const TCARD=[["voice","조직 침묵 (Morrison & Milliken)","조용함은 평화가 아니라 신호일 수 있다","이번 라운드에 팀이 말하지 않게 된 계기는 무엇이었을까?"],["stress","직무 요구-자원 (Bakker & Demerouti)","요구가 자원을 넘으면 소진이 쌓인다","어느 모듈의 요구를 줄이거나 자원을 늘릴 수 있었나?"],["trust","리더십의 양면 (Bass)","추진력은 성과를 당기지만 관계를 깎고, 배려만으로는 방향이 서지 않는다","이 속도와 이 배려가 꼭 그만큼 필요했나?"],["chain","서비스 수익 체인 (Heskett)","사람의 변화가 늦게 고객과 숫자에 닿는다","체인의 어느 고리에서 시작됐나?"],["cons","절차 공정성 (Leventhal)","같은 기준을 꾸준히 쓰는 것이 공정이다","기준을 바꿀 때 무엇을 했어야 했나?"],["info","정보 공정성 (Colquitt)","근거를 설명받았다는 느낌이 공정을 만든다","기준을 누구에게, 어떻게 알렸나?"]];
window.theoryCard=function(r){const st=(G.rs||{})[r]||{};if(!st.score)return "";
 const dv=voice()-voice(Object.assign({},G,{safe:st.safe}));const ms=Math.max(...LK.map(k=>MD().s[k]));const dt=Math.round(LK.reduce((a,k)=>a+G.trust[k]-(st.trust[k]||50),0)/5);
 const dc=Math.abs(G.score.재무-st.score.재무)+Math.abs(G.fsat-st.fsat);const bad=(G.cons||[]).filter(x=>!x.fit).length;
 const cand=[["voice",dv<0?-dv*1.5:0],["stress",ms>=70?ms-60:0],["trust",Math.abs(dt)*2],["chain",dc*.7],["cons",bad*6+(G.f.rule3_cells?10:0)],["info",r===1?8:3]].sort((a,b)=>b[1]-a[1]);
 const t=TCARD.find(x=>x[0]===cand[0][0]);return `<div class="tcard"><span class="label">이 결과를 설명하는 이론</span><b>${t[1]}</b><p>${t[2]}</p><p class="note">생각해 볼 질문: ${t[3]}</p></div>`;};

/* ===================== 가상 360 (02-4 F, 03-5 E4) ===================== */
const BANK={mid:{1:"맡기실 때도 있고 직접 하실 때도 있었어요. 기준은 잘 모르겠어요.",2:"기준은 들었어요. 실제로 그대로 보셨는지는 연말에 알겠죠.",3:"나누긴 나누셨는데, 왜 그렇게인지는 반쯤 알아요.",4:"중요한 건 말해 주셨어요. 작은 건 소문으로 들었고요."},
 rd:{1:["제가 시작한 걸 팀장님이 마무리하셨죠. 다음엔 저한테 끝까지 맡겨 주세요.","실험을 끝까지 저한테 맡겨 주셨어요. 실패한 것까지요."],2:["실험은 평가표에서 늘 \"건수\"였어요.","실패 기록도 기여로 봐 주신 건 처음이에요."],3:["AI 몫은 늘 마지막에 남는 칸이었어요.","토큰을 효과 기준으로 나눠서, 저희도 숫자로 말하게 됐어요."],4:["{결정}, 저는 결과만 받았어요.","안 되는 이유를 매번 말해 주셔서 덜 억울했어요."]},
 src:{1:["절차는 제가 지켰는데, 결정은 늘 위에서 내려왔어요.","감사 준비를 통째로 맡겨 주셔서 조달이 일하는 팀으로 보였어요."],2:["사고 안 난 해는 한 일이 없는 해였어요.","무사고도 기준에 넣어 주셨죠. 그게 컸어요."],3:["윤 책임은 올해도 두 사람 몫을 했어요.","사람을 빼 갈 때 순서를 미리 정해 두셔서 덜 흔들렸어요."],4:["{결정}, 회의 전에 한 번만 말해 주셨으면 했어요.","바뀔 때마다 다시 알려 주셨어요. 그거면 됩니다."]},
 mfg:{1:["내 모듈 일을 네가 자꾸 직접 했지. 그게 제일 서운했다.","새벽에 지휘를 나한테 맡긴 거, 그건 고맙다."],2:["끈 사람은 운이 좋았고, 막은 사람은 안 보였다는 말, 올해도 들었어.","복구도 예방도 같이 보더라. 처음엔 불편했는데 맞는 말이었어."],3:["야간은 올해도 버티기였다.","RUN 칸 지켜 준 거, 현장은 다 알아."],4:["{결정}, 회의에서 처음 들었다.","불편한 얘기를 먼저 와서 해 줬지. 그게 선배 대접이더라."]},
 prc:{1:["제 모듈 일을 팀장님이 제일 잘 아시니까, 늘 직접 하셨죠.","예전 일인데도 저한테 맡기셨어요. 그게 신뢰로 들렸어요."],2:["예방은 올해도 기준표에 없었어요.","예방이 처음으로 기준표에 들어갔어요."],3:["점검 인력은 늘 먼저 빠졌어요.","예방 칸이 끝까지 남아 있었어요."],4:["{결정}, 저는 다른 사람한테서 들었어요.","옛 동료라고 봐주지도, 피하지도 않으셨어요. 이유를 말해 주셨으니까요."]},
 mkt:{1:["제안서 숫자까지 팀장님이 고치셨죠. 빠르긴 했어요.","고객 앞은 저한테 맡겨 주셨어요. 그 덕에 컸어요."],2:["수주는 숫자 하나로 끝났어요. 누가 썼는지는 아무도 안 봤죠.","기여 기록이 귀찮았는데, 팀이 덜 시끄러워졌어요."],3:["일을 따 오면 따 올수록 다른 모듈 눈치를 봤어요.","받기 전에 무엇을 내려놓을지 먼저 정해 주셨어요."],4:["{결정}, 고객한테 보낸 메일이 팀 공지랑 같았어요.","고객한테는 고객 말로, 팀한테는 팀 말로 하셨죠."]},
 team:{1:["팀장님이 다 해 주셔서, 저희는 배울 기회가 없었어요.","처음 맡아 본 일이 생겼어요. 무서웠는데 해 봤어요."],2:["올해도 왜 이 등급인지 몰라요.","연초에 본 기준대로 연말에 받았어요."],3:["아낀 시간은 새 일로 바로 채워졌어요.","이번엔 뭘 안 하기로 했는지 알려 주셨어요."],4:["말해 봐야 바뀌는 게 없더라고요.","물어보면 답이 왔어요. 늦어도 왔어요."]},
 boss:{1:["팀장이 아직 엔지니어야. 본인이 들어가서 고치더군.","본인이 안 들어가도 팀이 돌아가더군."],2:["이의제기가 또 올라왔더군.","이의 건 처리 근거가 깔끔했네."],3:["일은 많이 받았는데 손익은 모르겠어.","토큰 쓴 만큼 숫자가 나왔어."],4:["보고를 받으면 내가 다시 물어봐야 했어.","보고 한 장으로 다음 질문이 필요 없었어."]},
 fco:{1:["문제가 생기면 결국 팀장님만 찾게 되더군요.","누구에게 물어도 답이 나오는 팀입니다."],2:["그 팀 담당자가 자주 바뀌는 것 같습니다.","담당자 이름을 계속 기억하게 됩니다."],3:["약속한 일정이 계속 밀렸습니다.","안 되는 건 안 된다고, 일찍 말해 주더군요."],4:["숫자는 받았는데 설명은 못 받았습니다.","불리한 숫자도 먼저 말해 주는 곳이었습니다."]}};
function axOf(filter){const a={1:{L:0,P:0},2:{L:0,P:0},3:{L:0,P:0},4:{L:0,P:0}};G.sig.filter(x=>!x.forced&&(!filter||filter(x))).forEach(x=>{a[x.a][x.s]+=x.w;});const o={};for(const k in a){const t=a[k].L+a[k].P;o[k]={v:t?a[k].L/t:null,n:t};}return o;}
function relOf(id){const s=CONTENT.find(x=>x.id===id||(x.cases||[]).some(c=>c.id===id));if(s&&s.rel)return s.rel;const m=typeof mailOf==="function"?mailOf(id):null;return m&&m.m&&m.m.rel;}
const to5=v=>clamp(Math.round(v*10)/10,1,5);const p100to5=v=>1+4*clamp(v,0,100)/100;
function lastDecName(k){const d=(G.decisions||[]).slice().reverse().find(x=>relOf(x.scene)===k&&CONTENT.find(c=>c.id===x.scene));return d?noNum(val(CONTENT.find(c=>c.id===d.scene).title)):"그 결정";}
window.rate360=function(){
 const all=axOf();const R=[];
 LK.forEach(k=>{const mine=axOf(x=>relOf(x.scene)===k);const adj=G.trust[k]>=66?.5:G.trust[k]<=35?-.5:0;
  const tr=clamp((G.trust[k]-50)/30,-1,1);R.push({who:k,label:"리더 "+"ABCDE"[LK.indexOf(k)],real:LD[k].n,s:[1,2,3,4].map(a=>{const src=mine[a].n>=2?mine[a]:all[a];return to5((src.v==null?3:1+4*src.v)*.6+(3+2*tr)*.4+adj*.5);})});});
 const pl=(G.pulse||[]).filter(Boolean).slice(-1)[0]||[50,50,50];const dl=G.ds?G.ds.f+G.ds.p:0;
 R.push({who:"team",label:"팀원 대표",s:[to5(all[1].v==null?3:1+4*all[1].v),to5(p100to5(pl[0])),to5(p100to5(pl[1])),to5(p100to5(voice()*1.25))]});
 R.push({who:"boss",label:"본부장",s:[to5(all[1].v==null?3:1+4*all[1].v),to5(5-(G.appeals||[]).length*1.2-((G.bills||[]).includes("B3")?1:0)),to5(p100to5((G.score.성과+G.score.재무)/2)),to5(p100to5(50+((G.toldAll||{}).full||0)*6-((G.toldAll||{}).none||0)*6))]});
 R.push({who:"fco",label:"헬씨푸드 임원",s:[to5(G.f.inc_direct?2:G.f.inc_proc?4:3),to5(p100to5(G.fsat)),to5(p100to5(G.fsat+(G.f.claim_delay?-15:0))),to5(G.f.f_corrected||G.f.claim_verify?4.2:G.f.f_140?2:3)]});
 R.forEach(x=>{x.c=x.s.map((v,i)=>{const lv=v<=2.4?0:v>=3.6?1:null;const b=BANK[x.who];let t=lv==null?BANK.mid[i+1]:b[i+1][lv];return t.replace("{결정}",LD[x.who]?lastDecName(x.who):"그 결정");});
  x.pick=x.s.map((v,i)=>[Math.abs(v-3),i]).sort((a,b)=>b[0]-a[0])[0][1];});
 if(G.f.safety_breach){const f=R.find(x=>x.who==="fco");f.extra="그날 새벽 일은, 저희 공장장이 아직 이야기합니다.";}
 const other=[1,2,3,4].map(a=>Math.round((R.reduce((s,x)=>s+x.s[a-1],0)/R.length-1)/4*100));
 return{R,other};};

/* ===================== v3 결산 (03-5) ===================== */
const DECN={"12-3":"연말 평가","4-2":"여력 배분","4-2공지":"배분 공지","R3-0":"배분 조정","6-2":"세 개의 설명","3-1":"KPI 기준","R1-pick":"KPI 면담 대상","완화":"부하 완화"};
function decName(id){if(DECN[id])return DECN[id];const sc=CONTENT.find(x=>x.id===id||(x.cases||[]).some(c=>c.id===id));if(sc&&val(sc.title))return noNum(val(sc.title));const m=typeof mailOf==="function"?mailOf(id):null;return m&&m.m&&m.m.sub?m.m.sub:id;}
const AXN4={1:"① 일 맡기기",2:"② 평가하기",3:"③ 자원 나누기",4:"④ 설명하기"};
const PLAN={1:{start:["이번 주 내가 직접 하려던 일 하나를 기대 결과·기한·권한·이유와 함께 맡긴다","되돌아온 일에 답 대신 질문 두 개로 돌려준다","장애 때 지휘자를 먼저 지정한다"],stop:["팀원의 결과물을 내가 고쳐서 내보내기","익숙한 시스템 장애에 직접 접속하기","\"내가 하는 게 빠르다\"로 결정하기"],kpi:["내가 직접 처리한 업무 비율","되돌아온 위임 건수","장애 시 지휘자 지정 여부"]},
 2:{start:["다음 KPI 합의 전에 드러나지 않는 기여 항목 하나를 기준에 넣어 공개한다","매주 금요일 구성원별 관찰 기록을 한 줄씩 남긴다","이의 면담에서 기록과 기준을 짚어 설명한다"],stop:["연말에 기억으로 등급 정하기","KPI 순서대로 줄 세우기","공로를 보고한 사람에게만 돌리기"],kpi:["펄스 \"평가 기준을 알고 있다\" 응답률","관찰 기록 건수","이의제기 건수"]},
 3:{start:["새 일을 받기 전에 무엇을 내려놓을지 팀과 먼저 정한다","다음 배분 공지에 효과·비용·위험 기준을 적는다","업무량이 가장 높은 모듈에 완화 조치를 먼저 쓴다"],stop:["아낀 시간을 말없이 새 일로 채우기","고객 요청을 범위 확인 없이 받기","많이 쓰는 곳에 토큰을 더 주기"],kpi:["초과근무 시간","모듈별 업무량 편차","AI 투자 대비 성과"]},
 4:{start:["다음 결정 뒤 24시간 안에 당사자에게 기준과 근거를 직접 말한다","같은 결정을 고객·상사·팀에게 다른 말로 쓴다","기준을 바꾸면 바꾼 날 다시 알린다"],stop:["결과가 좋으면 설명 생략하기","리더를 통해서만 말 전하기","결론만 메일로 통보하기"],kpi:["결정 후 설명한 비율","팀 회의 발언 · 제안 건수","아차 보고 건수"]}};
const V3TITLE=()=>{const L=G.styleLog||[];const all=s=>L.length>=3&&L.every(x=>x.style===s);const gr=v=>v>=65?"A":v>=50?"B":"C";
 if(all("push")&&G.score.성과>=65&&G.score.사람<50)return["숫자를 끌어올린 사령관","숫자는 올랐습니다. 회의실은 조용해졌습니다."];
 if(all("care")&&G.score.사람>=65&&G.score.성과<50)return["모두가 좋아하는 팀장","팀은 편했습니다. 고객은 기다렸습니다."];return null;};
/* ===================== 패치 8: 서술형 3요소 루브릭 예비 판정 · 자율 학습 해설 · 기기 이동 복원 코드 ===================== */
function evalRubric3(txt){
 txt=String(txt||"").trim();if(!txt)return null;
 const c1=/기준|원칙|규칙|공정|효과|비용|위험|실측|데이터|안전|합의|우선순위|성과|재무|고객|안정/.test(txt);
 const c2=/모듈|리더|팀원|구성원|부담|일정|야간|귀사|고객|임원|본부|현장|입장|걱정|노력|기여/.test(txt);
 const c3=/\d+\s*(월|일|주|분기|시간|%)|까지|다음\s*(주|달|분기|회의|미팅)|이번\s*(주|달)|내일|즉시|정리해|공유하|보고드리/.test(txt);
 const n=(c1?1:0)+(c2?1:0)+(c3?1:0);
 return {n,c1,c2,c3,badge:`${n}/3 충족 (①기준·원칙 ${c1?"○":"✕"} · ②상대 맥락 ${c2?"○":"✕"} · ③다음 행동·기한 ${c3?"○":"✕"})`};
}
/* 결과 코드용: 이번 라운드 서술형 답안의 3요소 충족 수 목록 (진행자 집계에서 평균을 본다) */
window.v3RubricN=function(r){const W=G.written||{},out=[];const p=t=>{const x=evalRubric3(t);if(x)out.push(x.n);};
 if(r===1&&Array.isArray(W.tasks)&&W.tasks.length)p(W.tasks.map(x=>x.근거||"").join(" "));
 if(r===2){if(W.notice&&W.notice.글)p(W.notice.글);if(W.three&&W.three.직접&&W.three.직접.글)p(W.three.직접.글);}
 if(r===3&&W["12-6"]){const w=W["12-6"];p(typeof w==="string"?w:(w.team||w.글||JSON.stringify(w)));}
 return out.length?out:undefined;};
window.v3RubricHtml=function(r){
 const items=[];
 if(r===1&&G.written&&Array.isArray(G.written.tasks)&&G.written.tasks.length){
  const allTxt=G.written.tasks.map(x=>x.근거||"").join(" ");
  const rb=evalRubric3(allTxt);if(rb)items.push(["R1-2 핵심 과제 근거 (3문장)",rb.badge]);
 }
 if(r===2&&G.written){
  if(G.written.notice&&G.written.notice.글){const rb=evalRubric3(G.written.notice.글);if(rb)items.push(["R2-2 여력 배분 공지문",rb.badge]);}
  if(G.written.three&&G.written.three.직접&&G.written.three.직접.글){const rb=evalRubric3(G.written.three.직접.글);if(rb)items.push(["R2-7 세 개의 설명 ("+G.written.three.직접.대상+" 직접 작성)",rb.badge]);}
 }
 if(r===3&&G.written&&G.written["12-6"]){
  const w=G.written["12-6"];const txt=typeof w==="string"?w:(w.team||w.글||JSON.stringify(w));
  const rb=evalRubric3(txt);if(rb)items.push(["R3-6 연말 평가 결과 팀 공지",rb.badge]);
 }
 if(!items.length)return `<p class="note">이번 라운드에 작성한 서술형 답안이 없습니다.</p>`;
 return `<div class="rubric-box"><span class="label">서술형 답안 미리 보기 · 최종 점수는 강사가 채점</span><p class="note" style="margin:4px 0 6px">이번 라운드에 직접 쓴 글을 세 가지 요소로 자동 점검했습니다. ① 기준·원칙을 밝혔나 ② 상대의 맥락을 반영했나 ③ 다음 행동과 기한을 적었나. ○ 있음 · ✕ 없음.</p>${items.map(x=>`<div><b>${x[0]}</b>: <span class="num">${x[1]}</span></div>`).join("")}</div>`;
};
const SELF_COMMENTARY={
 1:"[Round 1 자율 학습 해설] 1라운드의 핵심은 '실무자 습관(직접 처리) 내려놓기'와 '연말 평가의 잣대가 될 기준을 미리 공개하기(규칙 ①)'입니다. R1-4에서 드러나지 않는 기여(예방·온보딩)를 기준에 넣고 전체 공개(A)했는지, R1-5에서 만나지 못한 리더가 자기 마음대로 KPI를 적어 온 균열을 확인해 보세요.",
 2:"[Round 2 자율 학습 해설] 2라운드의 핵심은 '세 자원(⏳·💳·👥)의 교환비'와 '대상별 다른 언어(세 개의 설명)'입니다. R2-2에서 모든 모듈을 만족시키려다 핵심 칸이 얇아지면 R2-5 차출에서 와블러가 터집니다. 또한 같은 계약 결과라도 고객(일정·품질), 본부장(손익·리스크), 팀원(업무량·배분 기준)에게 설명하는 초점이 달라야 수용성이 높아집니다.",
 3:"[Round 3 자율 학습 해설] 3라운드의 핵심은 '새벽 위기에서의 심리적 안전·절차 준수'와 '기억이 아닌 관찰 기록 기반 평가'입니다. R3-1에서 납기 압박 때문에 안전 인터록 우회(C)를 택하면 단기 고객 만족은 올라도 기준 미달(Red Line 위반)이 됩니다. 연말 평가와 이의제기에서 연초 공개한 기준과 일관된 근거를 제시했는지 가상 360 피드백으로 대조해 보세요."
};
window.v3SelfStudyHtml=function(r){
 return `<div class="happen" style="margin-top:8px"><span class="label">💡 자율 학습 코멘터리</span>${SELF_COMMENTARY[r]||""}</div>`;
};
window.v3MakeSaveCode=function(){
 try{const c=JSON.parse(JSON.stringify(G));delete c.snap;const b=btoa(unescape(encodeURIComponent(JSON.stringify(c))));return "IT3-SAVE-"+b;}catch(e){return "";}
};
window.v3LoadSaveCode=function(str){
 try{const m=String(str||"").trim().match(/^IT3-SAVE-(.+)$/);if(!m)return false;
  const obj=JSON.parse(decodeURIComponent(escape(atob(m[1]))));if(!obj||typeof obj!=="object")return false;
  G=fillDefaults(obj);save();return true;}catch(e){return false;}
};
SCENES.v3final=function(s){
 let page=0;const plan=G.plan||(G.plan={});
 const act=axOf(),self=G.diag||{};const r360=rate360();
 const worst=()=>{let b=null;[1,2,3,4].forEach(a=>{const v=act[a].v;if(v!=null&&(b==null||v<act[b].v))b=a;});return b||1;};
 if(!plan.ax)plan.ax=worst();
 const brs=[];if(G.f.sec_breach)brs.push("R1: 정보보안팀에 알리기 전에 우리가 먼저 범위를 파악하기로 했습니다.");if(G.f.sec_hidden)brs.push("R2: 한 선임의 외부 AI 입력을 보고받고 조치하지 않았습니다.");if(G.f.safety_breach)brs.push("R3: 안전 인터록 우회를 승인 없이 허락했습니다."+(G.f.near_miss?" 그 자리에서 아차 사고가 났습니다.":""));
 const pages=[
  ()=>{const tt=V3TITLE()||((G.unsent||[]).length>=3?["조용한 팀의 팀장","올해 팀은 조용했습니다."]:null)||(typeof titleOf==="function"?(()=>{const t=titleOf();return[t,(typeof TITLE_L!=="undefined"&&TITLE_L[t])||""];})():["",""]);const rt=typeof resultType==="function"?resultType():null;
   return `<div class="eyebrow">결산 1/6 · 도장과 칭호</div><h2>${brs.length?"기준 미달":"기준 통과"}</h2><div class="prose">${brs.length?`<p>다른 점수와 관계없이, 아래의 선택은 넘어서는 안 되는 선을 넘었습니다.</p>${brs.map(b=>`<p>· ${b}</p>`).join("")}`:"<p>올해 장애 절차, 보안, 현장 안전 기준을 벗어난 선택이 없었습니다.</p>"}
   <p style="margin-top:12px"><b>칭호 · ${tt[0]}</b><br>${tt[1]}</p>${rt?`<p><b>결과 유형 · ${rt[0]}</b> ${rt[1]}</p>`:""}<p class="note">선임 다짐: "${G.pledge||""}"</p></div>
   <div class="kv">${SCORES.map(k=>`<div><span>${SL(k)}</span><b>${G.score[k]}</b></div>`).join("")}<div><span>헬씨푸드 만족</span><b>${G.fsat}</b></div><div><span>팀 발언량</span><b>${voice()}</b></div><div><span>연간 토큰 효율</span><b>${(()=>{const tot=Object.values(G.roundTok||{}).reduce((a,b)=>a+b,0);return tot>0?((G.score.성과+G.score.안정)/2/(tot/15)).toFixed(1):"미사용";})()}</b> <span class="note">(총 💳${Object.values(G.roundTok||{}).reduce((a,b)=>a+b,0)})</span></div></div>
   ${typeof trendChart==="function"?(()=>{const t=trendChart();if(t&&t.bind)setTimeout(t.bind,0);return t&&t.html||t||"";})():""}<p class="note">스타일: ${(G.styleLog||[]).map(x=>"R"+x.r+" "+STYLE[x.style||"bal"].n).join(" → ")}</p>`;},
  ()=>{const u=G.unsent||[];return `<div class="eyebrow">결산 2/6 · 보내지 않은 메시지</div><h2>올해 당신의 받은편지함에 도착하지 않은 메시지가 ${u.length}건 있었습니다</h2><div class="unsent">${u.map(x=>`<p class="voice">${x}</p>`).join("")||'<p>올해는 말하려던 것이 모두 도착했습니다. 시끄러웠던 받은편지함을 기억하시나요.</p>'}</div><p class="note">1년 동안 숨겨 둔 값: 팀의 심리적 안전 ${G.safe}. 발언량은 이 값의 겉모습이었습니다.</p>${typeof safeSpark==="function"?safeSpark():""}`;},
  ()=>{const cs=["R1","R2","R3"].map(r=>cinema(r)).filter(Boolean);const big=cs.slice().sort((a,b)=>b.gap-a.gap)[0];
   return `<div class="eyebrow">결산 3/6 · 인생극장</div><h2>그래, 결심했어</h2><p class="note">세 번의 갈림길에서 고른 길과 고르지 않은 길입니다. 오른쪽은 추정입니다.</p>${["R1","R2","R3"].map(r=>{const c=cinema(r);return c?`<div style="${big&&big.r===r?"outline:2px solid var(--accent);border-radius:16px":""}">${cinemaHtml(r)}<p class="note">내 선택이 나았던 지표 ${c.mw} · 대안이 나았던 지표 ${c.aw}</p></div>`:"";}).join("")}${big?`<div class="happen"><span class="label">가장 큰 갈림길 · ${big.label}</span>이 결정을 다시 한다면, 무엇을 먼저 확인하겠습니까?</div>`:""}`;},
  ()=>`<div class="eyebrow">결산 4/6 · 가상 360 피드백</div><h2>간극은 실패의 증거가 아니라 성찰의 재료입니다</h2>
   <div class="r360">${r360.R.map(x=>`<div class="c360"><b>${x.label}</b><span class="num">${x.s.map((v,i)=>"①②③④"[i]+" "+v.toFixed(1)).join(" · ")}</span><p class="voice" style="font-size:14.5px">"${x.c[x.pick]}"</p>${x.extra?`<p class="voice" style="font-size:14.5px">"${x.extra}"</p>`:""}</div>`).join("")}</div>
   <p style="margin-top:12px"><b>네 축 · 스스로 본 나 / 남이 본 나 / 실제로 한 행동</b></p>${[1,2,3,4].map(a=>{const sv=self[a]??null,ov=r360.other[a-1],av=act[a].v==null?null:Math.round(act[a].v*100);const bar=(v,c)=>`<div class="b3"><i style="width:${v??0}%;background:${c}"></i><span class="num">${v??"—"}</span></div>`;
    const note=av==null?"기록이 적어 판단하지 않습니다.":ov<av-15?"하신 일은 기록에 있습니다. 상대에게는 그만큼 전해지지 않았습니다.":ov>av+15?"사람들은 기록보다 후하게 보았습니다. 관계가 채워 준 몫이 있습니다.":"남이 본 모습과 기록이 비슷합니다.";
    return `<div class="ax3"><b>${AXN4[a]}</b>${bar(sv,"var(--s1)")}${bar(ov,"var(--s3)")}${bar(av,"var(--s4)")}<p class="note">${typeof axisBox==="function"&&sv!=null&&av!=null?axisBox(sv,av)+" ":""}${note}</p></div>`;}).join("")}<p class="note"><span style="color:var(--s1)">■</span> 스스로 본 나 · <span style="color:var(--s3)">■</span> 남이 본 나(360) · <span style="color:var(--s4)">■</span> 실제로 한 행동</p>`,
  ()=>{const ps=Object.values(G.prom||{});const [kn1,kt]=knowPct();return `<div class="eyebrow">결산 5/6 · 약속 · 청구서 · 사람들</div><h2>1년의 흔적</h2>
   <p><b>약속 장부</b></p>${ps.length?ps.map(p=>`<p>${p.text} <span class="note">· ${p.to} · ${p.status}</span></p>`).join(""):'<p class="note">맺은 약속이 없습니다.</p>'}
   <p style="margin-top:10px"><b>도착한 청구서</b></p>${(G.bills||[]).length?G.bills.map(b=>`<p>${BILL[b]?BILL[b].t:b} <span class="note">· ${(G.billWhy||{})[b]==="wow"?"가장 기운 축의 청구서":"원인 있는 청구서"}</span></p>`).join(""):'<p class="note">청구서가 한 장도 오지 않았습니다.</p>'}
   <p style="margin-top:10px"><b>리더를 아는 정도</b> ${kn1}/${kt}칸</p>${typeof relationMap==="function"?relationMap():miniMap()}`;},
  ()=>{const P=PLAN[plan.ax];return `<div class="eyebrow">결산 6/6 · 90일 액션 플랜</div><h2>내일 아침 당신의 팀으로 돌아갑니다</h2><p>게임 속 1년에서 가져갈 것을 하나만 고르세요.</p>
   <p><b>집중할 축</b></p><div class="btns">${[1,2,3,4].map(a=>`<button class="btn ${plan.ax===a?"main":""}" ${A(()=>{grab();plan.ax=a;plan.start=plan.stop=plan.kpi="";draw();})}>${AXN4[a]}${act[a].v!=null?" "+Math.round(act[a].v*100):""}</button>`).join("")}</div>
   ${(()=>{const gap=G.sig.filter(x=>x.a===plan.ax&&x.s==="P"&&!x.forced).slice(-1)[0];const c=r360.R.map(x=>x.c[plan.ax-1]).find((t,i)=>r360.R[i].s[plan.ax-1]<=2.4);return `<div class="happen"><span class="label">근거가 된 장면</span>${gap?`균열 증거: ${decName(gap.scene)} (${gap.choice})`:"이 축의 균열 증거는 없었습니다."}${c?`<br>360: "${c}"`:""}</div>`;})()}
   <label class="label" for="pst">처음 할 행동 (Start) · 예시를 누르거나 직접 쓰세요</label><div class="btns">${P.start.map(x=>`<button class="btn" ${A(()=>{grab();plan.start=x;draw();})}>${x}</button>`).join("")}</div><textarea id="pst">${plan.start||""}</textarea>
   <label class="label" for="psp">그만둘 행동 (Stop)</label><div class="btns">${P.stop.map(x=>`<button class="btn" ${A(()=>{grab();plan.stop=x;draw();})}>${x}</button>`).join("")}</div><textarea id="psp">${plan.stop||""}</textarea>
   <label class="label">90일 뒤 확인할 지표</label><div class="btns">${P.kpi.map(x=>`<button class="btn ${plan.kpi===x?"main":""}" ${A(()=>{grab();plan.kpi=x;draw();})}>${x}</button>`).join("")}</div>
   <label class="label" for="pwho">함께 확인할 사람 (직책만)</label><input id="pwho" value="${(plan.who||"").replace(/"/g,"")}" placeholder="예: 선배 팀장, HRBP" style="font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);width:100%">
   <p class="note" style="margin-top:8px">30일 뒤 동료 코칭 · 90일 뒤 행동 진단 재측정 · 다음 평가 시즌 전 리마인드</p>
   <h3 class="sch">최종 결과 코드</h3>${window.rcExplain?rcExplain(3):""}<div class="btns" style="margin-top:8px"><button class="btn" ${A(()=>{grab();dl();})}>채점용 응답 묶음 내려받기</button><button class="btn" ${A(()=>{grab();try{navigator.clipboard.writeText(window.v3ResultCode(3));toast("최종 결과 코드를 복사했습니다.");}catch(e){}})}>최종 결과 코드 복사</button></div><div class="codebox">${window.v3ResultCode?window.v3ResultCode(3):""}</div>`;}];
 const grab=()=>{const a=$("pst"),b=$("psp"),c=$("pwho");if(a)plan.start=a.value;if(b)plan.stop=b.value;if(c)plan.who=c.value;save();};
 const dl=()=>{let base={};try{base=JSON.parse(exportBundle());}catch(e){}const o=Object.assign(base,{v3:{별칭:G.nick||"",세개의설명:G.written.three||null,평가공지:(G.written||{})["12-6"]||null,액션플랜:{축:AXN4[plan.ax],Start:plan.start,Stop:plan.stop,지표:plan.kpi,함께:plan.who}}});
  const blob=new Blob([JSON.stringify(o,null,1)],{type:"application/json"});const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download=`intray_v3_${(G.nick||"응답").replace(/[^\w가-힣]/g,"")}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),500);};
 const draw=()=>{paint("");shell(`<div class="pane">${pages[page]()}<div class="foot">${page?`<button class="btn" ${A(()=>{grab();page--;draw();window.scrollTo(0,0);})}>← 이전</button>`:"<span></span>"}${page<pages.length-1?`<button class="btn main" ${A(()=>{grab();page++;draw();window.scrollTo(0,0);})}>다음</button>`:`<button class="btn main" ${A(()=>{grab();next();})}>더 보기: 상세 결산</button>`}</div></div>`);};
 draw();};

/* ===================== 첫 페이지: 과정 개요 (03-1 P0 · 01 기획요약) ===================== */
SCENES.title=function(s){
 const old=load(),has0=old&&old.idx>0,rd=old&&old.round?`Round ${old.round}`:"프롤로그";
 const start=()=>{const go=()=>{G=newGame();clearSave();next();beep(520,.1);};if(has0)confirmBox("처음부터 시작할까요?",`저장된 진행(${rd})이 지워집니다. 되돌릴 수 없습니다.`,"처음부터 시작",go,true);else go();};
 const cont=()=>{G=old;render();};
 const TRAIT={rd:"새 AI 도구라면 누구보다 먼저 써 보는 실험가",src:"무엇이든 한 번 더 확인하는 규정과 안정의 관리자",mfg:"불을 끄는 해결사. 팀장 자리를 놓친 2년 선배",prc:"불이 나기 전에 막는 예방자. 어제까지의 동료",mkt:"헬씨푸드 임원들 앞에서 가장 빛나는 수주형 리더"};
 const btns=`<div class="btns"><button class="btn main" ${A(start)}>처음부터 시작</button>${has0?`<button class="btn" ${A(cont)}>이어서 하기 (${rd})</button>`:""}</div>`;
 shell(paint(`<div class="lp">
 <section class="lp-hero">
  <div class="eyebrow">퓨쳐테크 신임 팀장 In-Tray 시뮬레이션 · v3</div>
  <h1>헬씨푸드 운영팀 신임 팀장, 첫 1년</h1>
  <p class="lp-lead"><b>월요일 아침 8시 40분.</b> 받은편지함에 여덟 통이 와 있고, 곧 전화가 한 통 울립니다. 어제까지 옆자리에서 함께 일하던 동료들이 오늘부터 당신을 팀장이라고 부릅니다.</p>
  <div class="lp-chips"><span>3라운드 · 1년</span><span>라운드마다 약 20분</span><span>2박 3일 과정, 하루 한 라운드</span><span>정답 없음</span></div>
  ${btns}
  <p class="note">라운드가 끝나면 이 브라우저에 자동 저장됩니다. 입력한 내용은 교육 목적의 채점에만 쓰이며, 인사 평가와 연결되지 않습니다.</p>
 </section>

 <section class="lp-sec"><h2>상황</h2><div class="lp-3">
  <div><b>팀</b><p>퓨쳐테크 헬씨푸드 운영팀 30명. IT 서비스 기업 퓨쳐테크에서 고객사 헬씨푸드(식품업계 1위)의 원료 수입부터 해외 공장 라인까지를 받치는 IT 시스템을 운영합니다. 시스템이 멈추면 헬씨푸드의 사업이 멈춥니다.</p></div>
  <div><b>올해의 압박</b><p>인원은 3년째 그대로인데 일은 늘었습니다. 헬씨푸드는 운영비 동결을 요구하고, 퓨쳐테크는 AI Native 전환을 선언했습니다. 작년 말에는 "왜 이 등급인지 아무도 설명해 주지 않았다"는 이의제기가 나왔습니다.</p></div>
  <div><b>당신</b><p>이 팀에서 5년 넘게 일한 엔지니어였고, 1월 1일부로 팀장이 되었습니다. 시스템은 누구보다 잘 압니다. 일을 맡겨 본 적도, 등급을 매겨 본 적도 없습니다.</p></div>
 </div></section>

 <section class="lp-sec"><h2>세 번의 라운드</h2><p class="note">라운드 앞에는 강의가, 뒤에는 피드백이 있습니다. 하루에 한 라운드씩, 강사의 안내에 맞춰 시작합니다.</p><div class="lp-3">
  <div class="lp-round"><span class="lp-tag">Round 1 · 1분기</span><b>기준 세우기</b><p>받은편지함과 전화, 핵심 과제 정의, 첫 리더 회의, 등급 기준 설계와 KPI 면담.</p><span class="note">강의 1 · 전문가에서 관리자로</span></div>
  <div class="lp-round"><span class="lp-tag">Round 2 · 2·3분기</span><b>배분과 상충</b><p>AI로 생긴 여력과 토큰 나누기, 헬씨푸드 운영비 협상, 공로 중재, 본사 차출, 같은 결정을 세 사람에게 설명하기.</p><span class="note">강의 2 · 나누고 맡기고 말하게 하기</span></div>
  <div class="lp-round"><span class="lp-tag">Round 3 · 4분기</span><b>위기와 평가</b><p>새벽 3시 공장 라인의 안전 신호, 평가 지침 변경, 7명의 연말 평가와 이의제기. 그리고 1년 결산과 90일 액션 플랜.</p><span class="note">강의 3 · 위기와 평가, 그리고 현업으로</span></div>
 </div></section>

 <section class="lp-sec"><h2>함께 일할 모듈 리더 다섯 명</h2><p class="note">직책도 평가 권한도 없지만, 30명의 하루는 이들을 통해 움직입니다. 성향은 게임 중 언제든 프로필 카드로 볼 수 있고, 더 깊은 이야기는 직접 대화해야 열립니다.</p>
  <div class="lp-people">${["rd","src","mfg","prc","mkt"].map(k=>`<div>${face(k,50)}<span><b>${LD[k].n}</b> <small>${LD[k].m}</small><em>${TRAIT[k]}</em></span></div>`).join("")}</div>
 </section>

 <section class="lp-sec lp-2">
  <div><h2>네 장의 성적표</h2><ul class="lp-list">
   <li><b>고객</b> 헬씨푸드의 만족도, 약속한 서비스를 지켰는가</li><li><b>재무</b> 팀 손익 (매출은 여기서만)</li>
   <li><b>구성원</b> 팀원 30명의 몰입과 목소리</li><li><b>서비스 안정</b> 시스템 가용성 · 장애 · 보안</li></ul>
   <p class="note">네 장은 이어져 있습니다. 구성원이 지치면 서비스가 흔들리고, 고객이 떠나고, 손익이 나빠집니다. 네 장을 모두 만점으로 만드는 길은 없습니다.</p></div>
  <div><h2>이 세계의 규칙</h2><ol class="lp-list">
   <li>공개하지 않은 기준은 결정의 근거로 쓸 수 없습니다.</li><li>설명하지 않은 결정은 소문이 됩니다.</li><li>공개한 기준을 바꾸면 다시 알려야 합니다.</li></ol>
   <p class="note"><b>넘어서는 안 되는 선</b> 장애 절차, 보안(고객 데이터), 현장 안전. 벗어나면 다른 점수와 관계없이 기준 미달입니다.</p></div>
 </section>

 <section class="lp-sec"><h2>무엇을 돌아보게 되나</h2><div class="lp-4">
  <div><b>① 일 맡기기</b><span>직접 처리할까, 기대 결과·기한·권한·이유를 밝혀 맡길까</span></div>
  <div><b>② 평가하기</b><span>숫자로만 볼까, 드러나지 않는 기여까지 기준으로 공개할까</span></div>
  <div><b>③ 자원 나누기</b><span>아낀 시간을 새 일로 채울까, 기준을 세워 나눌까</span></div>
  <div><b>④ 설명하기</b><span>결과로 보여 줄까, 결정 뒤 근거를 대상에 맞게 설명할까</span></div></div>
  <p class="note">시작할 때 8문항으로 지금의 습관을 적어 두고, 결산에서 "스스로 본 나 · 남이 본 나 · 실제로 한 행동"을 나란히 봅니다.</p>
 </section>

 <section class="lp-sec lp-end">${btns}<p class="note">좋은 선택에도 대가가 있고, 나쁜 선택이 당장은 통하기도 합니다. 어떤 결과는 몇 달 뒤에 옵니다.</p></section>
 </div>
 <details class="opmenu"><summary>운영자 검토용</summary><div class="oppop" role="menu"><p class="note">게임을 끝까지 하지 않아도 장면을 자유롭게 넘겨 볼 수 있습니다. 검토 중 진행은 저장하지 않습니다.</p><button class="opitem" role="menuitem" ${A(()=>startReview("P1"))}>프롤로그부터 검토</button><button class="opitem" role="menuitem" ${A(()=>startReview("1-1"))}>Round 1부터 검토</button></div></details>`));
};
})();

/* 성적표 근거: 결정마다 계기판·헬씨푸드 만족·리더 신뢰·모듈 업무량이 얼마나 움직였는지 기록한다 (2026-11-20). 다른 효과 감싸기보다 바깥에 둔다 */
{const _af=applyFx;applyFx=function(str,ctx){if(!G||!G.score)return _af(str,ctx);const b={...G.score,F:G.fsat},bt={...G.trust},bw=G.mod?{...G.mod.add}:{};const out=_af(str,ctx);const d={},tr={},wl={};let any=0;
 ["성과","재무","사람","안정"].forEach(k=>{const x=G.score[k]-b[k];if(x){d[k]=x;any=1;}});const xf=G.fsat-b.F;if(xf){d.F=xf;any=1;}
 Object.keys(LD).forEach(k=>{const x=G.trust[k]-bt[k];if(x){tr[k]=x;any=1;}});if(G.mod)Object.keys(LD).forEach(k=>{const x=(G.mod.add[k]||0)-(bw[k]||0);if(x){wl[k]=x;any=1;}});
 if(any){const sc=CONTENT[G.idx]||{};const t=sc.type==="inbox"?"받은편지함 처리":sc.type==="roundEnd"||sc.type==="monthEnd"?"분기 말 연쇄 · 자동 정산":(window.SC_NICK&&SC_NICK[sc.id])||noNum(String(val(sc.title)||sc.tag||sc.id||"기타"));(G.fxLog=G.fxLog||[]).push({id:sc.id||"",t,d,tr,wl});if(G.fxLog.length>500)G.fxLog.splice(0,G.fxLog.length-500);}
 return out;};}

/* 톤앤매너 v4 (2026-11-21): 다른 스타일이 모두 붙은 뒤 맨 마지막에 테마를 붙인다 */
(function(){if(document.getElementById("theme-v4"))return;const l=document.createElement("link");l.id="theme-v4";l.rel="stylesheet";l.href="theme.css";document.head.appendChild(l);})();
