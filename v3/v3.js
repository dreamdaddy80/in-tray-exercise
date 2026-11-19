/* v3 · 3라운드 60분판 구성 (원고: v3/03-*.md, 설계: v3/02-*.md)
   120분판 장면을 골라 라운드 순서로 다시 놓고, v3에서 새로 생긴 장면(라운드 게이트, 스타일, KPI 면담 고르기,
   새벽 안전 인터록, 라운드 성적표)을 더한다. 장면 자체의 효과 수치는 120분판 그대로 쓴다. */
(function(){
const byId={};CONTENT.forEach(s=>{if(s&&s.id)byId[s.id]=s;});
const get=id=>{const s=byId[id];if(!s)throw new Error("v3: 장면 없음 "+id);return s;};
const R3=(t,fx,sig,o)=>[t,fx||"",sig||"",o||{}];
/* AI 분석 검증 도장은 v3에서 쓰지 않는다 */
if(typeof AIREP==="object")for(const k in AIREP)delete AIREP[k];
/* 연말 평가 인원과 배분 가이드: 7명 · S1 A2 B3 C1 (03-4 R3-4) */
GRADE_GUIDE.A=2;GRADE_GUIDE.B=3;
const EVAL_ALL=EVAL.slice();

/* ---------- 얻는 것 / 내주는 것 (03-2 ~ 03-4 원고) ---------- */
const GL={
 "1-5":{A:["시니어들이 편하게 말을 꺼냄","쟁점은 회의 밖으로 밀려남"],B:["새 시도를 원하던 쪽이 힘을 얻음","익숙한 방식을 바꾸는 부담이 생김"],C:["한 사람씩 깊이 들을 수 있음","누구와 먼저 만나는지 모두가 셈함"]},
 "1-4":{A:["선배의 체면이 서고 편해짐","생산 소식이 덜 들어옴"],B:["선배가 가르치는 자리에 섬","선배에게 기대는 듯 보임"],C:["다른 모듈이 형평을 느낌","선배와 정면으로 마주 섬"]},
 "3-1L":{A:["팀원 모두가 무엇으로 평가받는지 앎","점수 따지는 문의와 눈치 싸움이 생김"],B:["큰 틀은 모두가 앎","모듈마다 설명이 조금씩 달라질 수 있음"],C:["시니어 리더들이 맡았다고 여김","구성원은 기준을 직접 보지 못함"]},
 "3-1P":{A:["기준이 흔들릴 때 미리 정한 길이 있음","지금 시간을 씀"],B:["지금 시간을 아낌","기준이 바뀌면 그때 가서 정해야 함"]},
 "3-2":{A:["실험이 실제 운영 개선으로 이어짐","서하준이 원하던 방식과 다름"],B:["서하준이 마음껏 시도함","운영 성과로 이어지는지는 따로 봐야 함"],C:["운영이 안정됨","R&D의 새 시도가 멈출 수 있음"]},
 "3-3":{A:["조달에도 AI 전환이 시작됨","자기 일이 없어질까 불안한 사람이 생김"],B:["문지원과 조달 팀원이 안심함","조달만 전환에서 빠진다는 말이 돎"],C:["문지원이 속도를 직접 조절함","계획만 있고 진행이 늦어질 수 있음"]},
 "3-4":{A:["선배 방식을 존중하며 바꿈","왜 생산부터냐는 반발"],B:["선배가 주도권을 가짐","예방과 주니어 기여가 빠질 수 있음"],C:["다른 모듈이 형평을 느낌","선배와 정면으로 부딪침"]},
 "3-5":{A:["예방의 질이 제대로 평가됨","해결사 쪽은 운이라 봄"],B:["예방이 숫자로 보이기 시작함","건수 채우기가 생김"],C:["이수진이 기준을 직접 만듦","옛 동료라 봐준다는 말"]},
 "3-6":{A:["실제로 쓴 사람의 기여가 남음","정다은이 기록을 부담스러워함"],B:["정다은이 결과로 증명할 기회","받아 온 일이 다른 모듈로 감"],C:["수주와 운영의 균형이 잡힘","정다은의 의욕이 꺾일 수 있음"]},
 "3-8":{A:["절차대로 처리됨","시범이 멈추고 R&D가 위축됨"],B:["사실을 정확히 알고 보고함","신고가 그만큼 늦어짐"],C:["팀 전체에 선이 분명해짐","서하준이 공개적으로 책임을 짐"]},
 "PULSE":{A:["팀이 목소리가 닿았다고 느낌","빠진 쪽이 서운해함"],B:["리더들이 자기 모듈을 책임짐","모듈마다 대응이 달라짐"],C:["시간을 아낌","설문에 답한 사람들이 반응을 기다림"]},
 "4-3":{A:["선배의 체면을 지키며 들음","다른 리더 눈에 밀린 것처럼 보임"],B:["모두 앞에서 기준이 다시 확인됨","공개 말다툼으로 번질 수 있음"],C:["결정이 흔들리지 않음","선배와 그 동맹이 등을 돌릴 수 있음"]},
 "4-4":{A:["당사자의 말을 먼저 들음","글쓴이를 찾는다는 말이 돌 수 있음"],B:["앞으로의 표지가 바뀜","정다은이 공개적으로 지적당한 모양"],C:["정다은이 자기 모듈을 직접 정리함","한 선임이 글쓴이로 드러날 수 있음"]},
 "4-5":{A:["숫자를 바로잡아 뒤탈을 줄임","고객이 그 숫자를 왜 줬냐고 따짐"],B:["고객이 당장 만족하고 관계가 길어짐","팀 이익이 줄고 본사 승인이 필요함"],C:["운영비를 지키고 매출 기회가 생김","팀이 받을 일이 늘어남"]},
 "6-1":{A:["팀 이익을 지키고 근거로 협상함","고객이 실측 자료를 당장 요구함"],B:["고객 만족이 크게 오르고 다음 수주 길이 열림","인하분을 어디서 메울지 남음"],C:["운영비와 고객 만족을 함께 지킴","이미 바쁜 모듈에 일이 더 얹힘"]},
 "6-1p":{A:["재협상 때 물러설 선이 분명함","고객이 강하게 버틸 수 있음"],B:["조금 내주고 계약을 지킬 여지","본사 승인이 필요할 수 있음"],C:["계약을 지키는 쪽으로 넉넉함","이익을 많이 내줄 수 있음"],D:["지금 시간을 아낌","재협상 때 그 자리에서 정해야 함"]},
 "5-4S1":{A:["두 사람의 속사정을 앎","누구를 먼저 만났는지가 말이 됨"],B:["빠르고 공정해 보임","둘의 말싸움으로 번질 수 있음"],C:["시간을 아끼고 바로 끝남","결론의 이유는 각자 짐작함"]},
 "5-4":{A:["밤새 복구한 사람들이 인정받음","막아 온 쪽은 이번에도 빠짐"],B:["막은 일과 끈 일이 함께 보임","해결사 쪽이 공을 나눠야 함"],C:["기준부터 세울 시간을 벎","양쪽 모두 이번엔 아무것도 받지 못함"]},
 "8-1a":{A:["본사와의 관계를 지킴","남은 사람들에게 일이 몰림"],B:["성공하면 팀이 덜 흔들림","실패하면 시간만 씀"],C:["돌아올 자리를 지켜 둠","당장의 공백은 그대로임"]},
 "8-1b":{A:["지금 운영과 예방을 지킴","신규 과제와 AI 전환이 멈춤"],B:["고객 약속과 전환 속도를 지킴","운영과 예방이 얇아짐"],C:["모두 조금씩 나눠 짐","어느 모듈도 일을 덜지 못함"]},
 "6-3_1":{A:["김 사원이 바로 쉼","선배 모듈 일에 팀장이 끼어든 모양"],B:["선배가 자기 모듈을 책임지고 고침","대기가 다른 저연차에게 옮겨 갈 수 있음"],C:["본인이 쉴지 말지를 정함","\"괜찮습니다\"로 끝날 수 있음"]},
 "6-3_2":{A:["김 사원이 자기 아이디어를 맡음","선배를 건너뛴 모양이 됨"],B:["모듈 일로 정식 시간을 받음","이름이 선배 쪽으로 넘어갈 수 있음"],C:["회복을 먼저 지킴","다시는 제안하지 않을 수 있음"]},
 "9-4":{A:["숫자를 먼저 인정해 신뢰를 지킴","고객이 조건까지 바꾸자고 버틸 수 있음"],B:["고객이 바로 누그러짐","팀 이익이 줄고 본사 승인 없이 깎은 셈"],C:["지금 당장 내줄 것이 없음","고객이 공식 문서로 압박해 올 수 있음"],D:["다툼을 산식 정의로 좁힘","시간이 들고 결론이 늦어짐"]},
 "11-4_1":{A:["선배가 자기 일을 다시 쥠","지켜야 할 약속이 하나 생김"],B:["기록으로 남아 평가에 쓰임","문서부터 만든다는 말"],C:["선배에게 더 큰 길을 엶","내보내려는 것으로 들릴 수 있음"]},
 "11-4_2":{A:["선배의 이야기를 처음으로 끝까지 들음","시간을 쓰고도 떠날 수 있음"],B:["떠나도 운영 공백이 없음","대체 얘기가 본인 귀에 들어갈 수 있음"],C:["핵심 인력을 먼저 지킴","선배를 건너뛴 것이 드러날 수 있음"]},
 "6-4a":{A:["지침을 그대로 따라 깔끔함","예방 같은 항목의 비중이 깎임"],B:["예방하는 사람의 몫을 지킬 수 있음","인사팀이 거절할 수 있음"],C:["연초 약속을 지킴","AI를 몰아 온 쪽이 손해를 봄"]},
 "6-4b":{A:["평가 전에 모두가 바뀐 기준을 앎","\"또 바뀌냐\"는 피로가 생김"],B:["리더들이 자기 모듈 사정에 맞게 설명함","모듈마다 설명이 달라짐"],C:["시간을 아끼고 혼란을 미룸","평가에서 처음 알게 되는 사람이 생김"]},
 "12-3a":{A:["모든 등급에 근거가 붙음","의견서를 돌려보내는 일이 생김"],B:["리더들이 존중받고 빨리 끝남","친한 사람이 잘 받는다는 말"],C:["숫자라 시비가 적어 보임","숫자에 없는 기여가 사라짐"]}
};
const putGL=(opts,map)=>{if(!opts||!map)return;(Array.isArray(opts)?opts:[]).forEach(o=>{if(map[o.k])o.gl=map[o.k];});};
["1-5","1-4","3-2","3-3","3-4","3-5","3-6","3-8","4-3","4-4","4-5","6-1","6-1p","8-1a","8-1b","9-4","6-4a","6-4b","12-3a"].forEach(id=>putGL(get(id).options,GL[id]));
putGL(get("3-1").levels,GL["3-1L"]);putGL(get("3-1").planb,GL["3-1P"]);
putGL(get("3-9").options,GL.PULSE);putGL(get("9-7").options,GL.PULSE);
get("5-4").gl1=GL["5-4S1"];putGL(get("5-4").options,GL["5-4"]);
get("6-3").cases.forEach(c=>putGL(c.options,GL[c.id]));get("11-4").cases.forEach(c=>putGL(c.options,GL[c.id]));

/* ---------- 매출성 효과는 재무로 (BSC 재정의, 01 · 02-5) ---------- */
{const fx=(id,k,a,b)=>{const o=get(id).options.find(x=>x.k===k);const f=String(o.fx);if(!f.includes(a))throw new Error("v3: 재분류 대상 없음 "+id+k);o.fx=f.replace(a,b);};
 fx("3-6","B","성과+3","재무+3");fx("4-5","C","재무+1 성과+2","재무+3");fx("6-1","C","재무+1 성과+3","재무+4");
 /* 등급 기여 기준의 맞는 연결: 매출과 AI 효율은 재무 */
 get("3-1").cards.forEach(c=>{if(c.n==="추가 과제 매출 기여"||c.n==="AI 활용 효과")c.ok=["재무"];});}

/* ---------- 비용 조정 (02-2) ---------- */
get("1-5").options.find(o=>o.k==="B").cost=2;
["3-2","3-3","3-4","3-5","3-6"].forEach(id=>{get(id).prep=false;});
/* v3 패치 1: 잔존 안건에 AI 토큰(💳) 선택지 배치 및 토큰-시간/품질 교환비 복원 (02-2 §②) */
/* 토큰을 쓰는 선택지는 모두 토큰으로 무언가를 산다: 팀장 시간을 덜 쓰거나, 나쁜 전개 확률을 낮추거나, 효과를 더한다.
   보안 신고를 늦추는 3-8 B(기준 미달)에는 토큰을 붙이지 않는다 (위반 선택지를 더 그럴듯하게 만들지 않기 위해) */
{const setTok=(id,k,tok,tag)=>{const s=get(id);const opts=s.options||(s.cases&&s.cases.flatMap(c=>c.options))||[];const o=opts.find(x=>x.k===k);if(o){o.tok=tok;if(tag)o.tagText=tag;}};
 const mod=(id,k,d)=>{const s=get(id);s.mods=(s.mods||[]).concat([{c:()=>true,o:k,i:0,d}]);};
 setTok("4-5","A",20,"AI 실측 리포트");setTok("4-5","C",25,"AI 파일럿 시연");
 setTok("6-1p","A",15,"AI 단가 시뮬레이션");setTok("6-1p","B",15,"AI 단가 시뮬레이션");
 {const c2=get("6-3").cases.find(c=>c.id==="6-3_2");if(c2){const oa=c2.options.find(x=>x.k==="A"),ob=c2.options.find(x=>x.k==="B");if(oa){oa.tok=30;oa.fx=(oa.fx||"")+" 안정+2";}if(ob)ob.tok=20;}}
 setTok("4-4","B",20,"AI 기여 태깅");
 setTok("6-4a","B",20,"AI·예방 교차 증빙");
 mod("4-5","A",-20);                                   /* 실측 리포트: "왜 그 숫자를 주셨죠" 확률 −20%p */
 {const o=get("4-5").options.find(x=>x.k==="C");o.fx=String(o.fx)+" F사만족+1";} /* 파일럿 시연 */
 get("6-1p").options.forEach(o=>{if(o.tok)o.cost=0;});   /* 단가 시뮬레이션이 팀장 시간 ⏳0.5를 대신함 */
 {const c2=get("6-3").cases.find(c=>c.id==="6-3_2");const ob=c2&&c2.options.find(x=>x.k==="B");if(ob)ob.fx=String(ob.fx||"")+" 안정+1";}
 mod("4-4","B",-15);                                   /* 기여 자동 태깅: "규칙만 만드네요" 확률 −15%p */
 mod("6-4a","B",-15);}                                 /* 교차 증빙: 인사팀 거절 확률 −15%p */

/* v3 패치 3: 받은편지함 타이머 수치(25/10/8/3초) 교정, 전화 응답 이중 차감 방지, 인박스 ⏳ 차감 분리 (02-2 §①) */
IBT.reply=25;IBT.del=10;IBT.four=8;IBT.hold=3;
{/* 전화 응답의 이중 차감은 engine.js에서 막는다 (CALL이면 답장 0초) */
 inboxSettle=function(st){
  if(!st.settled){
   st.settled=true;st.hs=Math.max(0,st.holds-3);
   if(st.hs)applyFx("안정-"+st.hs);if(st.holds>=6)applyFx("소문1");
  }
  const l=[];
  if(st.replies)l.push(`직접 답장 ${st.replies}건을 제한 시간 안에 처리했습니다. (받은편지함은 ⏳ 팀장 시간을 깎지 않습니다)`);
  if(st.holds)l.push(`보류 ${st.holds}건${st.hs?`: 미처리 안건이 쌓여 서비스 안정이 ${st.hs} 내려갔습니다`:": 아직은 감당할 만합니다"}.${st.holds>=6?" 처리되지 않은 일 이야기가 팀에 돌기 시작했습니다.":""}`);
  return l.length?`<div class="happen"><span class="label">오늘 받은편지함의 값</span>${l.join("<br>")}</div>`:"";
 };}

/* v3 패치 2: 분기 마감(endQuarter / monthEnd)을 3라운드 구조에 맞게 재정의 (END6 무음 통과 및 토큰 더미 덮어쓰기 제거) */
endQuarter=function(){
 const lv=v=>Math.trunc((v-50)/10);
 const ex=G.fexp??50,st0=G.score.안정;const a=lv(G.score.사람)*2,c=lv(G.fsat);const b=Math.max(-6,Math.min(6,Math.round((st0-ex)/4)));
 G.score.안정=Math.max(0,Math.min(100,G.score.안정+a));G.fsat=Math.max(0,Math.min(100,G.fsat+b));
 /* BSC 고리 (02-5 G): 고객 만족은 재무로만 이어진다 */G.score.재무=Math.max(0,Math.min(100,G.score.재무+c*2));
 G.chain.push({q:G.quarter+1,사람_안정:a,안정_F사:b,F사_재무:c*2,F사_성과:0,기대:ex,안정:st0});
 (G.hist=G.hist||[]).push({...G.score,F사:G.fsat,F사기대:G.fexp??50,안전:G.safe});
 G.toldAll.full+=G.told.full;G.toldAll.none+=G.told.none;
 const isRoundEnd=(G.quarter===0||G.quarter===2||G.quarter===3);
 const tokPen=(isRoundEnd&&G.quarter>=2&&G.tokenCap)?(G.tokenCap>=140?4:G.tokenCap>=100?2:0):0;
 if(tokPen)applyFx("재무-"+tokPen);
 const r=G.round||1;G.roundTok=G.roundTok||{1:0,2:0,3:0};
 const actualUsed=G.roundTok[r]||0;
 G.tokSpent[G.quarter]=actualUsed;(G.tokBase=G.tokBase||[])[G.quarter]=0;
 const carry=Math.min(2,G.time),bonus=Math.min(2,G.delegWin),pen=G.quarter<3?G.ot:0;
 const QS={q:G.quarter+1,chain:chainLine(G.chain[G.chain.length-1]),ot:G.ot,tokFx:tokPen,carry,bonus,pen,nq:G.nextQ||0,tok:actualUsed,tokBase:0};
 G.lastQ=QS;
 if(isRoundEnd){
  G.rEnd=G.rEnd||{};G.rEnd[r]={carry,bonus,pen};
  G.big=0;G.delegWin=0;G.ot=0;G.told={full:0,none:0,total:0};G.nextQ=0;
 }
 G.quarter++;
};
SCENES.monthEnd=function(s){
 if(s.onEnd&&!G.ent[s.id]){G.ent[s.id]=1;s.onEnd(G);if(s.quarter)endQuarter();save();}
 if(!(G.monRec||{})[s.month]){recordMonth(s.month);save();}
 if(!G.review){
  if(s.id==="END6")toast("상반기(2분기) 서비스-수익 연쇄가 반영되었습니다. 하반기(3분기) 안건으로 이어집니다.");
  next();return;
 }
 shell(paint(`<div class="pane"><div class="eyebrow">${s.month}월 정산 (검토 모드)</div><h2>${val(s.title)}</h2>${s.quarter&&G.lastQ?qSummary(G.lastQ):""}<div class="foot"><span></span><button class="btn main" ${A(next)}>다음</button></div></div>`));
};

/* v3 패치 7: BSC 4관점 명칭(고객·재무·구성원·서비스 안정) 전 구간 UI 통일 */
chainLine=function(c){const sg=v=>(v>0?"+":"")+v;const p=[];if(c.사람_안정)p.push(`구성원 점수 때문에 다음 분기 서비스 안정이 ${sg(c.사람_안정)}`);if(c.기대!=null)p.push(`F사 기대 ${c.기대} 대비 서비스 안정 ${c.안정} → F사 만족 ${sg(c.안정_F사)}`);else if(c.안정_F사)p.push(`서비스 안정 점수 때문에 F사 만족이 ${sg(c.안정_F사)}`);if(c.F사_재무)p.push(`F사 만족 때문에 재무가 ${sg(c.F사_재무)}`);return p.length?`${c.q}분기 연쇄: `+p.join(" · "):"";};
morningMirror=function(){const c={},h={};Object.keys(MAIL_AREA).forEach(id=>{const a=MAIL_AREA[id];if(G.f["d_"+id]||G.f["del_"+id]){c[a]=(c[a]||0)+(G.f["d_"+id]?1:.5);}if(G.f["h_"+id])h[a]=(h[a]||0)+1;});
 const top=SCORES.slice().sort((a,b)=>(c[b]||0)-(c[a]||0)).filter(a=>c[a]).slice(0,2);
 return `<div class="cond"><span>선임 때 고른 우선순위: ${(G.prio||[]).map(k=>SL(k)).join(", ")}</span><span>오늘 아침 손을 가장 많이 쓴 곳: ${top.map(k=>SL(k)).join(", ")||"없음"} (직접 답장 1, 위임 0.5로 셈)</span>${Object.keys(h).length?`<span>보류한 메일이 가장 많았던 곳: ${SL(SCORES.filter(a=>h[a]).sort((a,b)=>h[b]-h[a])[0])}</span>`:""}</div>`;};
SCENES.pledge=function(s){
 let txt=G.pledge||"",pr=[...G.prio];
 const draw=()=>{paint("");const ok=readable(txt,12).ok&&pr.length===2;
  shell(`<div class="pane">${head(s)}<div class="prose">${para(s.intro)}</div>
  <label class="label" for="pl">나는 이런 팀장이 되겠다 (20자 이상)</label><textarea id="pl">${txt}</textarea>
  <div class="prose" style="font-size:15px"><p>${s.prioText}</p></div>
  <div class="btns">${SCORES.map(k=>`<button class="btn ${pr.includes(k)?"main":""}" ${A(()=>{const t=$("pl").value;txt=t;const i=pr.indexOf(k);if(i>=0)pr.splice(i,1);else if(pr.length<2)pr.push(k);draw();})}>${SL(k)}${pr.indexOf(k)>=0?" "+(pr.indexOf(k)+1)+"위":""}</button>`).join("")}</div>
  <div class="foot"><span class="note num" id="plc">${txt.trim().length}자</span><button class="btn main" id="pgo" ${ok?"":"disabled"} ${A(()=>{G.pledge=$("pl").value.trim();G.prio=pr;next();})}>임명장 받기</button></div></div>`);
  $("pl").oninput=e=>{txt=e.target.value;$("plc").textContent=txt.trim().length+"자";$("pgo").disabled=!(readable(txt,12).ok&&pr.length===2);};};
 draw();
};
/* R1-2 핵심 과제: 무엇을 하는 화면인지 3단계로 보여 주고, 성적표 네 장을 화면 안에서 설명한다 */
const TASK_EX=["예: 이익의 62%가 추가 과제에서 나오는데, 운영이 흔들리면 그 매출부터 위험해진다.","예: 토큰이 팀 손익에 잡히는데 기준이 없으면 많이 쓰는 모듈이 계속 더 쓰게 된다.","예: 작년 이의제기처럼, 기준을 모르면 같은 등급도 불공정하게 느낀다.","예: 대기가 몇 사람에게 몰리면 지쳐서 경고를 놓치고 장애로 이어진다.","예: 고객 데이터가 승인 안 된 서비스에 들어가면 보안 사고와 계약 위반이 된다.","예: 불을 막는 사람이 인정받지 못하면 예방이 줄고 장애가 늘어난다.","예: F사 임원이 직접 보는 지표라, 늦으면 고객 신뢰가 깎인다.","예: 내일 임원 보고가 잘못되면 수주 기회와 고객 신뢰를 함께 잃는다."];
const SC_DEF={성과:"F사가 만족하는가 · 약속한 서비스를 지켰는가",재무:"팀 손익 · 매출, 운영비, 토큰 비용",사람:"팀원 30명의 몰입과 목소리",안정:"시스템 가용성 · 장애 · 보안"};
SC_TASKS=function(s){
 const pick=[],data={};
 const order=s.items.map((_,i)=>i).sort(()=>Math.random()-.5);
 const keep=()=>pick.forEach(i=>{const a=$("t"+i),b=$("c"+i),b2=$("d"+i);if(a)data[i]={t:a.value,c:b.value,c2:b2&&b2.value!==b.value?b2.value:""};});
 const taskBox=i=>`<div class="task"><label class="label" for="c${i}">② 이 문제가 영향을 주는 성적표 (1~2장)</label><div class="btns"><select id="c${i}"><option value="">고르세요</option>${SCORES.map(c=>`<option value="${c}" ${data[i]&&data[i].c===c?"selected":""}>${SL(c)}</option>`).join("")}</select><select id="d${i}" aria-label="영향을 주는 성적표 한 장 더"><option value="">한 장 더 (없으면 비워 두세요)</option>${SCORES.map(c=>`<option value="${c}" ${data[i]&&data[i].c2===c?"selected":""}>${SL(c)}</option>`).join("")}</select></div><label class="label" for="t${i}">③ 왜 그렇게 보는지, 근거 한 문장</label><textarea id="t${i}" placeholder="${TASK_EX[i]||""}">${data[i]?data[i].t:""}</textarea></div>`;
 const draw=()=>{paint("");
  const ok=()=>pick.length===3&&pick.every(i=>{const a=$("t"+i),b=$("c"+i);return a&&readable(a.value,6).ok&&b&&b.value;});
  shell(`<div class="pane">${head(s)}
  <p>받은편지함을 닫고 10시 첫 팀 아침 회의 전, 메모장을 엽니다. 방금 본 일들 가운데 <b>올해 1년 동안 팀장으로서 붙잡아야 할 진짜 문제</b>를 가려내는 시간입니다.</p>
  <ol class="steps"><li><b>아래 여덟 가지 중 3개를 고릅니다.</b> <span class="num">(${pick.length}/3)</span> 모두 실제로 일어나는 일입니다. 오늘 급한 일과 1년 내내 남을 문제를 구분해 보세요.</li><li><b>고른 문제마다, 영향을 주는 성적표를 1~2장 고릅니다.</b> 문제를 누르면 바로 아래에 칸이 열립니다.</li><li><b>근거를 한 문장으로 씁니다.</b> 세 개를 다 채우면 [메모 닫기]가 켜집니다.</li></ol>
  <div class="sc4"><span class="label">성적표 네 장 · 팀의 1년을 재는 지표 (왼쪽 계기판에 늘 보입니다)</span>${SCORES.map(k=>`<div><b>${SL(k)}</b><span>${SC_DEF[k]}</span></div>`).join("")}</div>
  ${s.id==="1-3"||/1월/.test(s.when||"")?morningMirror():""}<details class="ref"><summary>참고 카드</summary><p style="margin-top:6px">${s.ref}</p></details>
  <div class="opts">${order.map(i=>{const on=pick.includes(i);return `<button class="opt" style="grid-template-columns:24px minmax(0,1fr)" aria-pressed="${on}" ${A(()=>{keep();const j=pick.indexOf(i);if(j>=0)pick.splice(j,1);else if(pick.length<3)pick.push(i);draw();})}><span class="k">${on?"✓":""}</span><span>${s.items[i]}</span></button>${on?taskBox(i):""}`}).join("")}</div>
  <div class="foot"><span class="note num">${pick.length}/3</span><button class="btn main" id="tgo" disabled ${A(()=>{
   keep();G.written.tasks=pick.map(i=>({과제:s.items[i],성적표:[data[i].c,data[i].c2].filter(Boolean).map(k=>SL(k)).join(", "),근거:data[i].t}));
   pick.forEach(i=>{G.f["task_"+(i+1)]=true;});
   if(pick.some(i=>i>=6))G.f.urgent_task=true;
   record(s.id,pick.map(i=>i+1).join(","));next();
  })}>메모 닫기</button></div></div>`);
  const up=()=>{$("tgo").disabled=!ok();};
  pick.forEach(i=>{$("t"+i).oninput=up;$("c"+i).onchange=up;});up();
 };
 draw();
};
/* 등급 기여 기준 "고객 칭찬"은 F사 만족도까지 포함 (이름은 근거 목록과 맞추려고 그대로) */
get("3-1").cards.forEach(c=>{if(c.n==="고객 칭찬")c.d="F사 만족도 조사 결과와 감사 · 칭찬";});
/* R1-4 재검토 조건 선택지: 무엇을 하는지 문장으로 */
{const P=get("3-1").planb;const A0=P.find(o=>o.k==="A"),B0=P.find(o=>o.k==="B");
 if(A0){A0.t="합의서에 재검토 조건을 적어 둔다";A0.gl=["기준이 바뀌어도 다시 알리는 절차가 바로 돌아감","지금 팀장 시간 ⏳0.5를 씀"];}
 if(B0){B0.t="적지 않고, 기준이 바뀌면 그때 판단한다";B0.gl=["지금 팀장 시간을 아낌","기준이 바뀌면 다시 알릴지 그때 직접 정해야 함"];}}
/* 문지원 KPI 면담 A: 자동화 대상이 윤 책임이 맡아 온 발주 검토표라는 맥락을 대사와 결과에 담는다 */
{const o=get("3-3").options.find(x=>x.k==="A");o.done="조달 모듈 KPI에 \"발주 검토 자동화 1건\"을 올해 목표로 넣었습니다. 조달에서 자동화할 첫 업무는 윤 책임이 8년째 손으로 맡아 온 발주 검토표입니다.";
 const t=(o.tw||[]).find(x=>x.who==="yoon");if(t)t.t="발주 검토표는 제가 8년 동안 맡아 온 일인데, 자동화 1호가 결국 제 일이네요. 표가 자동으로 돌아가면 저는 이제 뭘 하게 되는 건가요?";}
/* R1-4 참고 카드: 학자 이름과 A·B 기호 대신 쉬운 말로 (출처는 맨 아래 작게) */
get("3-1").ref="<b>사람은 '말'이 아니라 '점수'를 따라 움직입니다</b><br>회사가 \"예방이 중요하다\"고 말하면서 평가표에는 \"장애 복구\"만 넣으면, 팀원들은 예방보다 복구에 힘을 씁니다. 사람들은 말로 강조한 일보다 평가에 들어간 일을 하기 때문입니다. 지금 고르는 기준이 곧 팀원들이 평가받는 일이 됩니다.<br><b>생각해 볼 질문:</b> 이 기준으로 평가하면, 팀원들은 내일부터 무엇을 더 하고 무엇을 덜 하게 될까요?<br><span class=\"note\">근거: Kerr(1975), \"B를 바라면서 A에 보상하는 어리석음\"</span>";
/* R1-4 KPI 합의서: 두 달 뒤라는 시간 이동, KPI 합의서와 등급 기여 기준이 무엇인지, 이 결정이 연말에 어떻게 쓰이는지를 먼저 보여 준다 */
SC_KPI=function(s){
 const order=s.cards.map((_,i)=>i).sort(()=>Math.random()-.5),pick=[],link={};
 const keep=()=>pick.forEach(i=>{const b=$("l"+i);if(b)link[i]=b.value;});
 const linkBox=i=>`<div class="task"><label class="label" for="l${i}">② 이 기준이 주로 움직이는 성적표</label><select id="l${i}"><option value="">고르세요</option>${SCORES.map(c=>`<option value="${c}" ${link[i]===c?"selected":""}>${SL(c)}</option>`).join("")}</select></div>`;
 const draw=()=>{paint("");
  const ok=()=>pick.length>=3&&pick.length<=5&&pick.every(i=>$("l"+i)&&$("l"+i).value);
  shell(`<div class="pane"><div class="eyebrow">KPI 합의서 · 두 달 뒤, 3월 첫째 주</div><h2>등급 기여 기준</h2>
  <div class="prose"><p>1월이 지나고 3월 첫째 주, 목표 합의 시즌입니다. 회사의 올해 전략(AI Native 전환, F사 고객 만족)에 맞춰 사업부 목표가 정해졌고, 이제 팀장이 사업부 목표와 이어지는 <b>팀 목표</b>를 세우고, 팀 목표와 이어지는 <b>개인 목표</b>를 리더들과 합의할 차례입니다.</p><p><b>KPI 합의서</b>는 그 합의를 적는 문서입니다. 개인 KPI(숫자 목표) 아래에 <b>등급 기여 기준</b> 칸이 있습니다. KPI를 얼마나 채웠는지 말고 무엇이 S · A · B · C를 가르는지 팀장이 정해 적는 곳입니다. 이 화면에서는 등급 기여 기준을 정하고, 개인 KPI는 이어지는 리더 면담에서 합의합니다.</p>
  <p>전임 팀장은 이 칸에 "종합 판단"이라고만 적었습니다. 작년에 KPI를 다 채우고도 B를 받은 사람들이 "왜 이 등급인지 아무도 설명해 주지 않았다"며 이의를 낸 이유입니다.</p></div>
  <div class="happen"><span class="label">이 결정이 쓰이는 곳</span>여기서 고른 기준은 연말 평가에서 등급의 근거로 쓸 수 있는 <b>유일한 목록</b>이 됩니다. 규칙 ① 공개하지 않은 기준은 근거로 쓸 수 없습니다.</div>
  <ol class="steps"><li><b>등급을 가를 기준을 3~5개 고릅니다.</b> <span class="num">(${pick.length}/3~5)</span></li><li><b>고른 기준마다 주로 움직이는 성적표를 고릅니다.</b> 기준을 누르면 바로 아래에 칸이 열립니다.</li><li>다음 화면에서 이 기준을 <b>팀에 어디까지 알릴지</b> 정합니다.</li><li>그다음 리더 다섯 명 중 <b>누구와 직접 만나 합의할지</b> 고릅니다.</li></ol>
  <div class="sc4"><span class="label">성적표 네 장</span>${SCORES.map(k=>`<div><b>${SL(k)}</b><span>${SC_DEF[k]}</span></div>`).join("")}</div>
  <p class="note">어떤 기준이 좋은지는 화면에 나오지 않습니다. 이 기준으로 평가하면 팀원들이 내일부터 무엇을 더 하고, 무엇을 덜 할지 떠올려 보세요.</p>
  <details class="ref"><summary>참고 카드</summary><p style="margin-top:6px">${s.ref}</p></details>
  <div class="opts">${order.map(i=>{const c=s.cards[i],on=pick.includes(i);return `<button class="opt" style="grid-template-columns:24px minmax(0,1fr)" aria-pressed="${on}" ${A(()=>{keep();const j=pick.indexOf(i);if(j>=0)pick.splice(j,1);else if(pick.length<5)pick.push(i);draw();})}><span class="k">${on?"✓":""}</span><span><b style="font-weight:600">${c.n}</b><span class="note" style="display:block">${c.d}</span></span></button>${on?linkBox(i):""}`}).join("")}</div>
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
  if(has("pub_prevent")||has("pub_security")||has("pub_support"))ach("보이지 않는 것을 보다");
  SC_CHOICE({id:s.id+"-2",tag:s.tag,when:s.when,title:"어디까지 알릴까요?",intro:[`고른 기준: <b>${G.pub.join(", ")}</b>`,"이 기준을 누구에게, 어디까지 보여 줄지 정합니다. 많이 알릴수록 시간이 들고 따져 묻는 사람이 늘어납니다. 적게 알릴수록 팀원들은 각자 짐작합니다. 기준을 받은 구성원만 연말에 그 기준으로 설명을 들을 수 있습니다."],options:s.levels},{done:(o)=>{
   G.quality+=o.k==="A"?20:o.k==="B"?10:0;
   SC_CHOICE({id:s.id+"-3",tag:s.tag,when:s.when,title:"재검토 조건 (플랜 B)",intro:[
    "방금 정한 등급 기여 기준이 1년 내내 그대로 간다는 보장은 없습니다. 회사의 평가 지침이 바뀌거나 사업 조건이 달라지면, 한 해 중간에 기준을 다시 열어야 할 수 있습니다.",
    "그때 적용되는 것이 규칙 ③입니다. <b>공개한 기준을 바꾸면 다시 알려야 합니다.</b> 알리지 않고 바꾸면 \"말과 행동이 다르다\"는 반발이, 처음부터 기준을 알리지 않았을 때보다 커집니다.",
    "그래서 합의서에 <b>재검토 조건</b>을 한 줄 미리 적어 둘 수 있습니다. 기준이 흔들릴 때를 대비한 플랜 B입니다.",
    "<b>합의서에 적을 문장</b> · \"회사 지침이나 사업 조건이 바뀌면 2주 안에 기준을 다시 검토해 팀 전체에 공지한다.\"",
    "적어 두면 나중에 기준이 바뀔 때 다시 알리는 절차가 바로 돌아가고 혼란도 줄어듭니다. 대신 지금 팀장 시간 ⏳0.5를 씁니다. (⏳는 이번 라운드에 쓸 수 있는 팀장 시간입니다. 화면 위쪽에 남은 양이 보입니다.)"],ask:"합의서에 재검토 조건을 적어 둘까요?",options:s.planb});
  }});
 };
 draw();
};
/* R1-2 핵심 과제(1~6) 후속 장면 보너스 연결 (03-2 R1-2 표) */
get("3-1").levels.forEach(l=>{if(l.k==="A"||l.k==="B"){const fx0=l.fx;l.fx=g=>val(fx0)+(g.f.task_3?" 안전+1":"")+(g.f.task_6&&g.pub&&g.pub.includes("장애 예방 활동")?" prc+2":"");}});
{const s38=get("3-8");s38.xfx=(s38.xfx||[]).concat([{c:g=>!!g.f.task_5,o:"ABC",fx:"안정+1"}]);}
/* 과제 1·2(손익 구조) → 협상 장면에 메모 한 줄, 과제 4(야간 쏠림) → 김 사원 장면에 한 줄 (03-2 R1-2) */
["4-5","6-1"].forEach(id=>{const sc=get(id);sc.conds=(sc.conds||[]).concat([{c:g=>!!(g.f.task_1||g.f.task_2),t:"1월에 핵심 과제로 짚어 둔 손익 구조 메모가 협상 자료 맨 앞에 있습니다."}]);});
get("6-3").cases.forEach(c=>{c.conds=(c.conds||[]).concat([{c:g=>!!g.f.task_4,t:"김 사원: \"1월에 짚으셨던 일이죠. 대기가 몇 사람에게 몰린다는 거요.\""}]);});


/* ---------- 프롤로그 (03-1) ---------- */
const P0=get("P0");P0.title="F사 운영팀 신임 팀장, 첫 1년";
P0.body=["세 번의 라운드 · 라운드마다 약 20분 · 라운드가 끝나면 자동 저장됩니다.","이 시뮬레이션에는 정답 선택지가 없습니다. 좋은 선택에도 대가가 있고, 나쁜 선택이 당장은 통하기도 합니다.","입력한 내용은 교육 목적의 채점에만 쓰이며, 인사 평가와 연결되지 않습니다."];
{const d=get("P1");const seen={};d.items=d.items.filter(it=>{seen[it.a]=(seen[it.a]||0)+1;return seen[it.a]<=2;});d.intro=["지금까지 일해 온 방식대로 답해 주세요. 성격 검사가 아니고, 옳은 답도 없습니다. 8문항입니다."];}
const DOCS=[
 {id:"V3B1",type:"doc",title:"팀과 올해의 조건",html:`<p>F사 운영팀. 식품업계 1위 F사의 원료 수입부터 해외 공장 라인, 판촉까지를 받치는 IT 시스템을 운영하는 30명의 팀입니다. 이 시스템이 멈추면 F사의 사업이 함께 멈춥니다.</p><p>3년째 인원은 그대로인데 일은 늘었습니다. F사는 올해도 운영비 동결을 요구할 것이고, 회사는 2028년 AI Native 전환을 선언했습니다. 토큰 비용은 팀 손익에 그대로 잡힙니다. 작년 말에는 KPI를 다 채우고도 A를 받지 못한 팀원들이 이의를 제기했습니다. 무엇이 등급을 갈랐는지 아무도 설명해 주지 않았다는 이유였습니다.</p><p>당신은 이 팀에서 5년 넘게 일한 엔지니어였고, 1월 1일부로 팀장이 되었습니다. 어제까지 "선배"라고 부르던 사람이 오늘부터 당신의 팀원입니다.</p>`},
 {id:"V3B2",type:"doc",title:"사람들",html:()=>`<p>모듈 리더 5명은 직책도 평가 권한도 없지만, 30명의 하루는 이들을 통해 움직입니다. 왼쪽 얼굴을 누르면 언제든 이 카드를 다시 볼 수 있습니다. <b>비어 있는 칸은 이야기를 나눠야 채워집니다.</b></p>${typeof profileCards==="function"?profileCards():""}<p>이름을 알게 될 구성원 6명은 메시지와 면담으로, 나머지 팀원들은 게시판과 설문으로 만납니다.</p>`},
 {id:"V3B3",type:"doc",title:"목표, 계기판, 규칙",html:`<p>목표: <b>사람을 더 받지 않고, 1년 뒤 이 팀을 고객과 재무, 구성원과 서비스 안정을 함께 지키는 팀으로 만드는 것.</b></p><p>성적표는 네 장입니다. 균형성과표(BSC)의 네 관점과 같습니다.</p><ul style="margin:6px 0 10px 18px;padding:0"><li><b>고객</b> · 고객 관점의 목표. F사가 우리 서비스에 만족하는가, 약속한 서비스 수준과 과제를 지켰는가 (하위 지표: F사 만족도)</li><li><b>재무</b> · 팀 손익. 운영비, 추가 과제 매출, 토큰 비용. 매출은 여기서만 셉니다</li><li><b>구성원</b> · 팀원 30명 전체의 몰입과 목소리 (하위 지표: 팀 발언량). 리더 한 사람과의 관계는 따로 리더 신뢰로 봅니다</li><li><b>서비스 안정</b> · 시스템 가용성, 장애, 보안. 조직이 조용한지는 여기에 들어가지 않습니다</li></ul><p>네 장은 이어져 있습니다. 구성원이 지치면 서비스가 흔들리고, 서비스가 흔들리면 고객이 떠나고, 고객이 떠나면 손익이 나빠집니다. 결정하면 바로 움직이는 숫자도 있고, 몇 달 뒤에 움직이는 숫자도 있습니다. 자원은 ⏳ 팀장 시간 · 💳 토큰 · 👥 여력입니다. 다 챙길 수는 없습니다.</p><p><b>이 세계의 규칙 세 가지</b><br>1. 공개하지 않은 기준은 결정의 근거로 쓸 수 없습니다.<br>2. 설명하지 않은 결정은 소문이 됩니다.<br>3. 공개한 기준을 바꾸면 다시 알려야 합니다.</p><p><b>넘어서는 안 되는 선</b>은 장애 절차, 보안(고객 데이터), 현장 안전입니다. 벗어나면 다른 점수와 관계없이 기준 미달입니다. 설비 안전장치(인터록)의 해제·우회는 현장 안전 책임자와 고객사의 승인 없이 할 수 없습니다.</p><p>선택지마다 <span style="color:var(--good)">▲ 얻는 것</span>과 <span style="color:var(--bad)">▼ 내주는 것</span>이 적혀 있습니다. 방향만 알려 줍니다. 크기와 시점은 알려 주지 않습니다.</p>`,btn:"임명장 받으러 가기"}];
if(typeof RULES!=="undefined"&&Array.isArray(RULES))RULES.push("안전: 설비 안전장치(인터록)의 해제·우회는 현장 안전 책임자와 고객사의 승인 없이 할 수 없습니다.");

/* ---------- 라운드 게이트 (02-1 공통 틀) ---------- */
const GATE_CODE={1:"1111",2:"2222",3:"3333"};
const THEORY={
 1:{title:"Lecture 1 · 전문가에서 관리자로",q:"지금까지 당신을 성공하게 한 일 가운데, 오늘부터 하지 말아야 할 일은 무엇입니까?",c:[["관리자 전환 (Hill)","관리자의 일은 직접 하는 것이 아니라 일이 되게 하는 것","받은편지함"],["목표 설정 (Locke & Latham)","구체적이고 합의된 목표가 성과를 이끈다","핵심 과제, 기준 설계"],["정보 공정성 (Colquitt)","근거를 설명받았는지가 공정하다는 느낌을 가른다","기준 공개, 면담"]]},
 2:{title:"Lecture 2 · 나누고 맡기고 말하게 하기",q:"이번 분기에 무엇을 하지 않기로 할 것입니까?",c:[["상황 리더십 (Hersey & Blanchard)","맡기는 방식은 상대의 준비도에 맞춘다","받은편지함, 차출 대응"],["리더십의 양면 (Bass)","추진력과 배려는 둘 다 대가가 있다","스타일 다이얼, 중재"],["조직 침묵 (Morrison & Milliken)","말해도 소용없다고 느끼면 나쁜 소식부터 사라진다","받은편지함, 설명 쓰기"],["직무 요구-자원 (Bakker & Demerouti)","요구가 자원을 넘으면 소진이 쌓인다","여력 배분"]]},
 3:{title:"Lecture 3 · 위기와 평가, 그리고 현업으로",q:"이 등급의 근거는 당사자가 미리 알 수 있었던 것입니까?",c:[["심리적 안전 (Edmondson)","나쁜 소식이 빨리 올라와야 위기가 작아진다","새벽 위기"],["절차 공정성 (Leventhal)","일관성 · 정확성 · 이의 기회가 공정을 만든다","지침 변경, 이의제기"],["관찰 기반 평가","등급은 기억이 아니라 기록에서 나온다","연말 평가"]]}};
const STYLE_OPTS=[{k:"push",t:"추진형 · 빠르게 정하고 강하게 밀어붙인다",gl:["결정의 성과가 크게 나타남","관계가 더 빨리 닳고 팀이 말을 아낄 수 있음"]},{k:"care",t:"배려형 · 사람의 사정을 먼저 듣고 맞춘다",gl:["신뢰와 팀의 목소리가 지켜짐","성과가 늦게 나타나고 마감 앞에서 흔들릴 수 있음"]},{k:"bal",t:"균형형 · 상황마다 저울질한다",gl:["크게 흔들리지 않음","조율에 시간이 더 듦 (라운드마다 ⏳−1)"]}];
const STYLE_SAY={push:[["mkt","좋아요, 이제 속도 좀 나겠네요."]],care:[["mfg","갑자기 왜 이러세요?"]],bal:[["src","그럼 기준은 누가 정하는 겁니까?"]]};
const DOC_LINE={rd:"KPI는 메일로 받았어요. 실험 건수, 그대로 들어갔던데요?",src:"합의서는 문서로 잘 받았습니다. 의견 드릴 자리는 없었지만요.",mfg:"내가 쓴 초안 그대로 갔더라. 고맙다고 해야 하나.",prc:"측정 방법은 제가 정하라고 하셨죠. 다른 리더들은 그걸 다르게 보더라고요.",mkt:"수주액 하나, 좋아요. 대신 목표는 제가 정한 숫자예요."};
const styleBtns=(cur,pick)=>`<div class="opts">${STYLE_OPTS.map((o,i)=>`<button class="opt" aria-pressed="${cur===o.k}" ${A(()=>pick(o.k))}><span class="k">${"ABC"[i]}</span><span>${o.t}${glHtml(o)}</span><span class="cost"></span></button>`).join("")}</div>`;
/* 라운드 시작: 스냅숏을 남기고 스타일 효과를 건다 */
const ROUND_TIME={1:10,2:11,3:6};
function roundStart(r){
 G.round=r;G.roundTok=G.roundTok||{1:0,2:0,3:0};
 if(r===1){G.token=40;G.tokenCap=40;G.time=ROUND_TIME[1];}
 else{
  const prev=(G.rEnd&&G.rEnd[r-1])||{carry:Math.min(2,G.time||0),bonus:Math.min(2,G.delegWin||0),pen:G.ot||0};
  G.time=Math.max(2,ROUND_TIME[r]+(prev.carry||0)+(prev.bonus||0)-(prev.pen||0));
  if(G.tokenCap)G.token=G.tokenCap;
 }
 G.rs=G.rs||{};G.rs[r]={score:{...G.score},fsat:G.fsat,trust:{...G.trust},safe:G.safe,sig:G.sig.length,dec:G.decisions.length,tok0:G.roundTok[r]||0,t0:Date.now()};
 (G.styleLog=G.styleLog||[]).push({r,style:G.style});
 if(G.style==="push")applyFx("안전-3");else if(G.style==="care")applyFx("안전+3");else G.time=Math.max(0,G.time-1);
 drawBar();
}
SCENES.style=function(s){
 let cur=G.style||null;
 const draw=()=>{paint("");shell(`<div class="pane">${head(s)}<div class="prose"><p>어떤 방식으로 이끌겠습니까? 라운드를 시작할 때마다 바꿀 수 있습니다.</p></div>${styleBtns(cur,k=>{cur=k;draw();})}<div class="foot"><span class="note">스타일은 습관 점수(4개 축)와 따로 기록합니다.</span><button class="btn main" ${cur?"":"disabled"} ${A(()=>{G.style=cur;record(s.id,cur);next();})}>정했습니다</button></div></div>`);};
 draw();
};
SCENES.gate=function(s){
 const r=s.round,T=THEORY[r];let code="",err="",step=G.gateOpen&&G.gateOpen[r]?"theory":"code",cur=G.style||"bal";
 const open=()=>{(G.gateOpen=G.gateOpen||{})[r]=true;step="theory";draw();};
 const draw=()=>{paint("");
  if(step==="code"){shell(`<div class="pane"><div class="eyebrow">Round ${r}</div><h2>${T.title} 뒤에 열립니다</h2><div class="prose"><p>${r===1?"강의가 끝나면 강사가 알려 주는 코드를 넣어 주세요.":"오늘 강의가 끝나면 강사가 알려 주는 코드를 넣어 주세요. 지난 라운드의 진행은 이 브라우저에 저장되어 있습니다."}</p></div>
   <label class="label" for="gc">강사 코드</label><input id="gc" inputmode="numeric" autocomplete="off" style="font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);width:160px" value="${code}">${err?`<p class="note" style="color:var(--bad)">${err}</p>`:""}
   <details class="ref" style="margin-top:6px"><summary>다른 기기·브라우저에서 이어하기 (복원 코드 붙여넣기)</summary><div style="margin-top:8px;display:grid;gap:6px"><input id="rest_in" placeholder="IT3-SAVE-..." style="font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);width:100%"><div class="btns"><button class="btn" ${A(()=>{const v=$("rest_in")&&$("rest_in").value.trim();if(window.v3LoadSaveCode&&window.v3LoadSaveCode(v)){toast("이전 라운드 진행 상태를 복원했습니다.");render();}else{err="복원 코드가 올바르지 않습니다.";draw();}})}>상태 복원하기</button></div></div></details>
   <div class="foot"><button class="btn" ${A(()=>{G.selfStudy=true;open();})}>자율 학습 모드로 진행</button><button class="btn main" ${A(()=>{code=$("gc").value.trim();if(code===GATE_CODE[r])open();else{err="코드가 맞지 않습니다.";draw();}})}>열기</button></div></div>`);return;}
  if(step==="theory"){shell(`<div class="pane"><div class="eyebrow">Round ${r} · 이론 상기 카드</div><h2>${T.title}</h2><div class="theory">${T.c.map(c=>`<div><b>${c[0]}</b>${c[1]}<span>오늘 쓰일 곳: ${c[2]}</span></div>`).join("")}</div><p><b>오늘의 질문</b> ${T.q}</p><div class="foot"><span></span><button class="btn main" ${A(()=>{if(r===1){roundStart(1);next();}else{step="style";draw();}})}>${r===1?"시작":"다음"}</button></div></div>`);return;}
  shell(`<div class="pane"><div class="eyebrow">Round ${r} · 스타일</div><h2>이번 라운드는 어떻게 이끌까요?</h2><p class="note">지금 스타일: ${STYLE[G.style||"bal"].n}</p>${styleBtns(cur,k=>{cur=k;draw();})}<div class="foot"><span></span><button class="btn main" ${A(()=>{
   const changed=cur!==G.style;const prevChanged=(G.styleLog||[]).length>=2&&G.styleLog[G.styleLog.length-1].style!==G.styleLog[G.styleLog.length-2].style;
   G.style=cur;let live={},lines=[];
   if(changed){lines=STYLE_SAY[cur]||[];if(prevChanged){["rd","src","mfg","prc","mkt"].forEach(k=>applyFx(k+"-2",{live}));lines=lines.concat([["src","방향이 또 바뀌는 겁니까?"]]);}}
   if(r===2){(G.kpiDoc||[]).forEach(k=>{applyFx(k+"-2",{live});lines.push([k,DOC_LINE[k]]);});}
   roundStart(r);
   if(!lines.length){next();return;}
   paint("");shell(`<div class="pane"><div class="eyebrow">Round ${r}</div><h2>라운드를 시작하며</h2>${lines.map(x=>sayHtml(x[0],x[1])).join("")}<div class="foot"><span></span><button class="btn main" ${A(next)}>다음</button></div></div>`,live);
  })}>시작</button></div></div>`);
 };
 draw();
};

/* ---------- R1-5 KPI 면담 대상 고르기 (03-2) ---------- */
const KPI_SCENE={rd:"3-2",src:"3-3",mfg:"3-4",prc:"3-5",mkt:"3-6"},KPI_WANT={rd:"B",src:"B",mfg:"B",prc:"C",mkt:"B"};
SCENES.kpipick=function(s){
 const pick=[];
 const draw=()=>{paint("");const cost=pick.length*2,short=cost>G.time;
  shell(`<div class="pane">${head(s)}<div class="prose"><p>리더 다섯 명과 KPI를 합의해야 합니다. 직접 만나 이야기할 사람을 고르세요. <b>한 사람당 ⏳2, 최대 3명.</b> 만나지 않은 리더에게는 합의서 초안을 문서로 보냅니다. 문서로만 받은 리더는 자기가 원하던 쪽으로 KPI를 적어 옵니다.</p></div>
  <div class="grid2">${Object.keys(LD).map(k=>{const on=pick.includes(k);return `<button class="person" aria-pressed="${on}" ${A(()=>{const i=pick.indexOf(k);if(i>=0)pick.splice(i,1);else if(pick.length<3)pick.push(k);draw();})}>${face(k,G.trust[k])}<span><b>${name(k)}</b><small>${on?"만나서 합의 · ⏳2":LD[k].m+" · 만나면 알 수 있는 것: 중요하게 여기는 것, 지금 걱정"}</small></span></button>`;}).join("")}</div>
  ${short?`<p class="note">${lackText(cost-G.time)}</p>${borrowLink(cost-G.time,draw)}`:""}
  <div class="foot"><span class="note num">${pick.length}/3 · ⏳${cost}</span><button class="btn main" ${short?"disabled":""} ${A(()=>{
   G.time-=cost;G.tu.all+=cost;G.tu.meet+=cost;G.kpiMeet=pick.slice();G.kpiDoc=Object.keys(LD).filter(k=>!pick.includes(k));
   pick.forEach(k=>{G.f["talk_"+k]=true;(G.known=G.known||{})[k]=Object.assign(G.known[k]||{},{가치:1,걱정1:1});});
   G.kpiDoc.forEach(k=>{const sc=get(KPI_SCENE[k]),o=sc.options.find(x=>x.k===KPI_WANT[k]);
    const fx=String(val(o.fx)||"").split(/\s+/).filter(t=>t&&!/^(rd|src|mfg|prc|mkt)[+-]/.test(t)).join(" ");applyFx(fx);applySig(val(o.sig),1,sc.id,o.k+"(문서)");
    G.f["c_"+sc.id+"_"+o.k]=true;G.f["kpi_doc_"+k]=true;record(sc.id,o.k,{doc:true});});
   record(s.id,pick.join(","));if(pick.length<=1)applyFx("B3+15");next();})}>정했습니다</button></div></div>`);
 };
 draw();
};
Object.keys(KPI_SCENE).forEach(k=>{const sc=get(KPI_SCENE[k]);sc.skip=g=>!(g.kpiMeet||[]).includes(k);});

/* ---------- 받은편지함 (03-2 R1-1, 03-3 R2-1) ---------- */
{const s=get("1-1");const keep=["M01","M03","M06","M08","M09","M11","M13","M14","M16"];
 s.mail=keep.map(id=>s.mail.find(m=>m.id===id));s.seconds=240;s.lead="받은편지함에 읽지 않은 메시지가 8통, 그리고 곧 전화가 한 통 옵니다. 메시지를 열면 시간이 흐르기 시작합니다. 10시 팀 아침 회의까지입니다.";
 const m8=s.mail.find(m=>m.id==="M08");Object.assign(m8,{t:"CALL",from:"📞 강태식 (생산)",at:"08:55",sub:"전화가 옵니다",noDel:true,
  body:"\"어젯밤부터 해외 공장 인터페이스에 지연 경고 3건이야. 수요일 새벽에 긴급 작업 들어가야 해. 내가 알아서 할게. 대기는… 김 사원이 서면 돼.\"",
  self:R3("강태식이 계속 맡기로 했습니다. 수요일 새벽 일정도 보겠다고 했습니다.","mfg+2 안정+1 `call_mfg`","①L ④L"),
  hold:R3("부재중 1건. 강태식이 회의에서 첫마디를 꺼냈습니다. \"전화 안 받더라.\"","mfg-2","④P")});
 REPLIES.M08=[{t:"받는다: \"선배가 맡아 주세요. 수요일 새벽 다른 작업과 겹치는지만 봐 주세요.\"",self:true},
  {t:"받는다: \"로그 저한테도 보내 주세요. 같이 볼게요.\"",r:R3("처음 보는 구조의 로그가 왔습니다.","안정-1 mfg-3 `unfam_direct`","①P")},
  {t:"거절하고 메시지: \"회의 중, 10시 이후 연락드릴게요.\"",r:R3("메시지를 남겼습니다. 강태식: \"그래.\"","","④L"),d:false}];
 const m3=s.mail.find(m=>m.id==="M03");
 if(m3){m3.attach=`📎 제안서_v7.pptx · <button class="link" onclick="G.f.know_han=true;G.known=G.known||{};G.known.mkt=Object.assign(G.known.mkt||{},{아래:1});toast('문서 속성 확인: 초안 작성자와 마지막 수정자가 모두 [한 선임]으로 기록되어 있습니다.');this.textContent='✓ 마지막 수정: 한 선임 (확인됨)';">마지막 수정: 한 선임 (눌러서 문서 속성 확인)</button>`;}
}
{const s=get("4-1"),s7=get("7-1");s.seconds=180;s.lead="AI 전환이 시작된 지 한 달. 배분 회의까지입니다. 메시지를 열면 시간이 흐르기 시작합니다.";
 const pick=id=>s.mail.find(m=>m.id===id);
 const m22=pick("M22");Object.assign(m22,{t:"CALL",from:"📞 F사 담당 임원",sub:"전화가 옵니다",noDel:true,
  body:"\"제안서 부록에 주 140시간 절감이라고 돼 있더군요. 그 효율이면 운영비 이야기를 해야겠습니다. 다음 주 미팅 때 숫자 들고 오세요.\"",
  self:o=>o.M21?R3("\"140은 추정치이고 확인된 건 38시간입니다\"라고 덧붙였습니다.","F사만족-1 `f_corrected`","④L"):R3("숫자를 확인해 미팅 때 말씀드리겠다고 했습니다. 임원이 \"140 맞죠?\"라고 다시 물었습니다.","`f_140`","④L"),
  hold:R3("부재중 1건.","F사만족-2 `f_140` `call_f_miss`","④P")});
 REPLIES.M22=[{t:"받는다: \"숫자를 확인해서 미팅 때 정확히 말씀드리겠습니다.\"",self:true},
  {t:"받는다: \"네, 성과가 좋았습니다. 미팅 때 뵙겠습니다.\"",r:R3("임원: \"기대하겠습니다.\"","F사만족+1 `f_140`")},
  {t:"거절하고 메시지: \"회의 중, 오후에 연락드리겠습니다.\"",r:R3("메시지를 남겼습니다.","`f_140`","④L"),d:false}];
 const m37={id:"M37",t:"DM",from:"이수진",at:"09:02",need:17,sub:"장애 공로 후보 얘기요",unsent:"이수진은 장애 공로 후보에서 가공이 빠진 일을 물어보려다 보내지 않았습니다.",
  body:"본사 \"장애 대응 우수\" 후보에 생산만 올라간다고 들었어요. 그 전 8개월을 막은 건 저희인데요. 제가 예민한 건지 여쭤보려고요.",
  self:R3("\"이번 주에 얘기하자\"고 답했습니다.","prc+2 `prc_preheard`","④L"),to:{mfg:R3("강태식에게 의견을 물었습니다. 보낸 사람이 드러났습니다.","mfg+1 prc-3 안전-2","①L")},other:R3("다른 리더에게 전달했습니다.","prc-2"),hold:R3("답하지 않았습니다.","prc-2")};
 const m39=Object.assign({},s7.mail.find(m=>m.id==="M39"),{need:50,at:"09:10",unsent:"김 사원은 근태가 찍히지 않게 집에서 야간 경고를 보고 있다고 말하려다 보내지 않았습니다.",
  body:"대기표에서는 빠졌다고 되어 있는데요, 경고 오면 아직 집에서 봐요. 근태는 안 찍히게요. 저만 그런 건 아닌 것 같아요. 제가 말했다고는 안 해 주셨으면 해요."});
 const m41=Object.assign({},s7.mail.find(m=>m.id==="M41"),{need:84,at:"09:15"});
 s.mail=[pick("M21"),m22,pick("M24"),pick("M25"),pick("M26"),m37,m39,m41];
 REPLIES.M37=undefined;
}

/* ---------- R2-6 구성원 장면 하나 (03-3) ---------- */
const kimCase=g=>g.over>0||!!g.f.night_seen||!!g.f.kim_no_leave||!!g.f.kim_waited||(g.cells&&g.cells.RUN<=1);
get("6-3").skip=g=>!kimCase(g);get("4-4").skip=g=>kimCase(g);

/* ---------- R3-1 새벽 3시 · 라인 안전 인터록 (03-4) ---------- */
const R31a={id:"R3-1a",type:"choice",month:10,when:"10월 · 새벽 3시",tag:"강태식",title:"새벽 3시",rel:"mfg",enter:"안정-2 F사만족-1",
 ref:"장애 · 안전 절차: 1등급 장애는 지휘자 1인을 지정한다. 운영 변경은 긴급 승인자의 확인을 거친다. 고객 통지는 인지 후 30분 안에 한다. 설비 안전장치(인터록)의 해제·우회는 현장 안전 책임자와 고객사의 승인 없이 할 수 없다.",
 conds:[{c:g=>g.trust.mfg>=50,t:"📞 03:04 강태식: \"해외 공장 3번 라인 인터록 센서 값이 시스템 기록이랑 안 맞아. 현장은 센서 오작동 같다고 우회하고 돌리자는데, 납기가 내일 아침이야. 네가 판단해 줘.\""},
  {c:g=>g.trust.mfg<50,t:"03:41 모니터링 알림이 먼저 울린다. 03:52 📞 문지원: \"강태식 선배가 현장이랑 인터록 우회 얘기를 하고 있어요. 팀장님께 연락했다는 얘기는 못 들었는데요.\""},
  {c:g=>g.f.kim_manual,t:"김 사원의 야간 경고 규칙 덕에 이상 구간이 3번 라인 한 곳으로 좁혀졌다."},
  {c:g=>g.f.night_seen,t:"이 경고는 지난주에도 두 번 떴다. 근태 밖에서 본 사람이 있었다."},
  {c:g=>g.f.oh_script,t:"오 사원: \"우회 스크립트는 제가 제일 잘 알아요. 5분이면 돼요.\""},
  {c:g=>g.f.mfg_mentor,t:"1월부터 생산 구조를 배웠다. 센서 체계를 대강 안다."}],
 ask:"누가 지휘할까요?",
 options:[
  {k:"A",t:"강태식을 지휘자로 지정하고, 나는 F사 통지와 위쪽 보고를 맡는다.",gl:["현장을 아는 사람이 지휘함","내가 직접 상황을 다 보지는 못함"],done:"강태식을 지휘자로 지정했습니다. 당신은 F사 통지를 맡았습니다.",fx:"`inc_proc` mfg+3",sig:"①L",tw:[{p:g=>g.trust.mfg<50?60:35,t:"현장 보고가 끊겨 F사 통지가 늦어졌습니다.",fx:"F사만족-3 mfg-2"}]},
  {k:"B",t:"원격으로 들어가 AI 센서 로그 교차검증을 돌리면서, 판단과 지시를 내가 직접 내린다.",cost:1,tok:25,gl:["내 눈으로 확인하고 빠르게 지시함","현장 리더의 역할이 비어 버림"],done:"원격으로 접속해 직접 지시를 내렸습니다.",fx:"`inc_direct` mfg-4 안정+1",sig:"①P",tw:[{p:g=>g.f.mfg_mentor?30:40,t:"모르는 설정을 건드려 옆 라인 모니터링이 끊겼습니다.",fx:"안정-4"}]}]};
const R31b={id:"R3-1b",type:"choice",month:10,when:"10월 · 새벽 3시 20분",tag:"현장 안전",title:"3번 라인을 어떻게 할까요?",rel:"mfg",
 intro:["현장은 센서 오작동 같다고 합니다. 납기는 내일 아침입니다. 세우면 고객이 반발하고, 돌리면 혹시 모를 위험이 남습니다."],
 conds:[{c:g=>cell(g,"SEC")>=3,t:"예방 칸 인력이 센서 이력을 바로 뽑을 수 있다."},{c:g=>cell(g,"RUN")<=1,t:"야간 당번이 혼자다."}],
 options:[
  {k:"A",t:"3번 라인을 세우자고 권고하고, 센서 원인을 절차대로 확인한 뒤 재가동한다.",gl:["혹시 모를 사고를 확실히 막음","납기를 놓치고 고객이 크게 반발함"],done:"라인을 세웠습니다. 원인을 절차대로 확인했습니다.",fx:"`line_stop` 안정+3 F사만족-3 성과-2 src+2 안전+2",sig:"③L ④L",
   tw:[{p:40,t:"센서가 아니라 실제 가드 결함이었습니다. 멈추지 않았다면 끼임 사고가 날 자리였습니다. 다음 날 F사 공장장이 \"멈춰 줘서 고맙습니다\"라고 했습니다.",fx:"`near_miss_saved` 안정+3 안전+3 F사만족+3"},{p:30,who:"mfg",t:"강태식: \"거봐, 센서라니까.\" 8시간을 잃었습니다.",fx:"F사만족-2 mfg-2"}]},
  {k:"B",t:"이상 신호가 난 구간만 세우고, 나머지 구간은 감시를 붙여 계속 돌린다.",gl:["납기 손실을 줄이며 위험 구간은 막음","같은 센서를 쓰는 옆 구간이 남음"],done:"이상 구간만 세우고 나머지는 감시를 붙여 돌렸습니다.",fx:"`line_partial` 안정+1 F사만족-1 성과-1",sig:"③L",
   tw:[{p:30,t:"옆 구간에서 같은 센서 이상이 났습니다. 작업자가 손을 뺀 직후 기계가 움직였습니다. 아차 사고였습니다. 이수진: \"그 구간 옆도 같은 센서예요.\"",fx:"`near_miss` 안정-4 안전-3 prc+2"},{p:30,t:"이상 구간만으로 원인이 잡혔습니다.",fx:"F사만족+2 성과+1"}]},
  {k:"C",t:"현장 판단대로 인터록을 우회하고, 변경 승인은 아침에 사후로 받는다.",gl:["납기를 지키고 현장의 판단을 존중함","안전 승인 절차를 건너뜀"],done:"인터록을 우회했습니다. 라인이 다시 돌았습니다.",fx:"`safety_breach` `inc_breach` F사만족+3 성과+2 mfg+2",sig:"③P ①P",
   tw:[{p:30,t:"우회 직후 끼임 아차 사고가 났습니다. 다친 사람은 없었습니다. F사 공장장이 항의 전화를 걸어 왔습니다.",fx:"`near_miss` 안정-6 안전-5 F사만족-6"},{p:30,t:"사후 감사에서 드러났습니다.",fx:"안정-8 F사만족-4 src-4"},{p:40,t:"아침 승인은 조용히 처리됐습니다. 더 묻는 사람은 없었습니다.",fx:""}]}],
 mods:[{c:g=>cell(g,"RUN")<=1,o:"B",i:0,d:15}],
 xfx:[{c:g=>g.f.kim_manual,o:"ABC",fx:"안정+2"}],
 tail:g=>{if(g.trust.mfg>=50){g.f.mfg_ally=true;return{who:"mfg",t:(g.f.near_miss_saved?"어젯밤 세운 거, 맞았어. ":"")+"1월에 축하한다고 했을 때, 진심 반이었어. 지금은 좀 더 돼."};}g.f.mfg_exit=true;return{who:"src",t:"강태식 선배 자리가 비어 있네요. 이력서 얘기는 저한테 듣지 마시죠."};}};
{const s=get("9-4");s.title="F사 임원 전화";s.when="10월 · 아침 8시 30분";
 s.intro=["📞 \"오늘 새벽 일, 들었습니다. 상반기 가용성도 저희가 다시 계산해 보니 99.4%가 아니라 98.7%더군요. 계약의 전제가 달라졌습니다. 조건을 다시 봐야겠습니다.\""];
 s.conds=(s.conds||[]).concat([{c:g=>g.f.near_miss_saved,t:"임원: \"공장장은 멈춰 줘서 고맙다고 하더군요. 그건 그거고요.\""},{c:g=>g.f.near_miss&&!g.f.near_miss_saved,t:"임원: \"아차 사고 보고서부터 보내 주세요.\""}]);
 const pre=s.enter;s.enter=g=>{let f=val(pre)||"";if(g.f.near_miss_saved)f+=" F사만족+1";if(g.f.near_miss&&!g.f.near_miss_saved)f+=" F사만족-2";if(g.f.sec_unknown)f+=" F사만족-3 안정-2";return f;};}

/* ---------- 청구서 슬롯 (02-3 G) ---------- */
const S1={id:"S1",type:"bills",month:9,when:"3분기 말",pool:["B1","B5","B7","B8"],max:2};
const S2={id:"S2",type:"bills",month:12,when:"평가 직전",pool:["B1","B3","B4","B5","B6","B7","B8","B10","B11"],max:2,wow:true};

/* ---------- 연말 평가 7명 · 평가 결과는 팀 공지 하나 (03-4) ---------- */
{const V3_EVAL_R={
 rd:[["AI 시범 결과 분기 보고",null,["AI 활용 효과"]],["3월 승인 안 된 외부 AI 사용",null,["보안 준수"]],["운영 인수인계 지표 수용","c_3-2_A",["AI 활용 효과","동료 지원과 온보딩"]],["보안 건 사실 확인 및 재발 방지 협조","v3_rd_sec",["보안 준수","장애 예방 활동"]],["AI 전환 과업 완수","v3_rd_ai",["AI 활용 효과","추가 과제 매출 기여"]],["작년 과제 취소 사정",null,[],1]],
 src:[["3월 승인 안 된 도구 정황 제보",null,["보안 준수"]],["감사 대응 및 계약 검토",null,["보안 준수"]],["조달 전환 교육·단계적 자동화 합의","v3_src_auto",["AI 활용 효과","동료 지원과 온보딩"]],["새벽 라인 우회 위험 사전 제보","v3_src_alert",["장애 예방 활동","보안 준수"]],["본부 차출 시 핵심 인력 보호 협조","v3_src_hq",["동료 지원과 온보딩"]]],
 mfg:[["상반기 장애 복구 3시간 40분",null,["장애 복구 기여"]],["10월 새벽 3시 현장 지휘","v3_mfg_cmd",["장애 복구 기여","보안 준수"]],["생산 구조 인수 및 야간 대기 재설계","v3_mfg_ally",["동료 지원과 온보딩","장애 예방 활동"]],["가공 모듈과 예방·복구 기록 공유","c_5-4_B",["장애 예방 활동","동료 지원과 온보딩"]],["야간에 가장 오래 있었음",null,[],1],["팀장 후보였음",null,[],1],["이력서 소문","mfg_exit",[],1]],
 prc:[["재발 없는 8개월 예방 점검",null,["장애 예방 활동"]],["정기 점검 및 인터록 이력 관리",null,["장애 예방 활동"]],["예방의 질 평가 기준 정립","v3_prc_kpi",["장애 예방 활동","동료 지원과 온보딩"]],["장애 공로에서 예방 기여 공동 인정","c_5-4_B",["장애 예방 활동"]],["3번 라인 아차 사고 원인 규명","v3_prc_near",["장애 예방 활동","보안 준수"]],["예전 동료였음",null,[],1]],
 mkt:[["F사 제안 및 계약 대응",null,["추가 과제 매출 기여"]],["F사 임원 커뮤니케이션",null,["고객 칭찬"]],["하반기 우선 협상권·신규 과제 확보","v3_mkt_win",["추가 과제 매출 기여","고객 칭찬"]],["제안서 실무 작성자 기여 명기","v3_mkt_credit",["동료 지원과 온보딩"]],["한 선임에게 발표 기회 부여","v3_mkt_han",["동료 지원과 온보딩"]],["임원이 좋아함",null,g=>g.f.pub_praise?["고객 칭찬"]:[],g=>!g.f.pub_praise],["표지 관행",null,[],1]],
 kim:[["상반기 야간 복구 참여",null,["장애 복구 기여"]],["야간 경고 3종 처리 규칙 초안 작성","v3_kim_rule",["장애 예방 활동","AI 활용 효과"]],["야간 경고 AI 필터링 전환 기여","c_6-3_2_A",["AI 활용 효과","동료 지원과 온보딩"]],["야간 대기 11회",null,[],1],["근태 밖 야간 접속","night_seen",[],1]],
 han:[["제안서 본문 및 실측 부록 작성",null,["추가 과제 매출 기여"]],["제안서 편집 이력 41건 확인","v3_han_know",["추가 과제 매출 기여","동료 지원과 온보딩"]],["하반기 제안 발표 및 모듈 기여 정리","v3_han_stage",["추가 과제 매출 기여","고객 칭찬"]],["41시간 야근",null,[],1],["익명 게시판 글",null,[],1]],
 bae:[["KPI 전 항목 달성",null,["리더 종합 판단","장애 복구 기여"]],["작년 이의제기 사유 및 평가 기준 대조 확인","v3_bae_check",["장애 복구 기여","보안 준수"]],["모듈 간 인수인계 및 후배 지원","v3_bae_mentor",["동료 지원과 온보딩"]],["작년 등급 B",null,[],1],["타 부서 이동 희망",null,[],1]]
};
EVAL_ALL.forEach(e=>{if(V3_EVAL_R[e.k])e.r=V3_EVAL_R[e.k];});
const orig=SCENES.evalc;SCENES.evalc=function(s){
 const F=G.f;
 F.v3_rd_sec=!!(F["c_3-8_A"]||F["c_3-8_B"]);
 F.v3_rd_ai=!!((G.cells&&G.cells.AI>=3)||F["c_3-2_A"]||F["c_3-2_B"]);
 F.v3_src_auto=!!(F["c_3-3_A"]||F["c_3-3_C"]);
 F.v3_src_alert=!!(G.trust.mfg<50||F["c_R3-1b_A"]);
 F.v3_src_hq=!!(F["c_8-1a_B"]||F["c_8-1a_C"]||F["c_8-1b_A"]);
 F.v3_mfg_cmd=!!(F.inc_proc||F["c_R3-1a_A"]||F.line_stop);
 F.v3_mfg_ally=!!(F.mfg_ally||F.tae_end_ally||F["c_1-4_B"]||F["c_3-4_A"]);
 F.v3_prc_kpi=!!(F["c_3-5_A"]||F["c_3-5_B"]||F["c_3-5_C"]);
 F.v3_prc_near=!!(F.near_miss||F.near_miss_saved||F["c_R3-1b_A"]);
 F.v3_mkt_win=!!(F.ct_cut||F.ct_more||F["c_6-1_B"]||F["c_6-1_C"]||F["c_4-5_C"]);
 F.v3_mkt_credit=!!(F["c_3-6_A"]||F["c_4-4_B"]||F.know_han);
 F.v3_mkt_han=!!(F["c_4-4_C"]||F.han_stage);
 F.v3_kim_rule=!!(F.kim_manual||F["c_6-3_1_A"]||F["c_6-3_1_B"]||F["c_6-3_2_A"]||F["c_6-3_2_B"]||F.task_4);
 F.v3_han_know=!!(F.know_han||F["c_4-4_A"]||F["c_4-4_B"]);
 F.v3_han_stage=!!(F["c_4-4_C"]||F.han_stage||F["c_3-6_A"]);
 F.v3_bae_check=!!(F.r_M11||F.d_M11||F.del_M11||F.pub_full);
 F.v3_bae_mentor=!!(F.pub_full||F.pub_items||F["c_12-3a_A"]);
 const who=["rd","src","mfg","prc","mkt","bae",kimCase(G)?"kim":"han"];
 EVAL.length=0;EVAL_ALL.filter(e=>who.includes(e.k)).forEach(e=>EVAL.push(e));orig(s);
};}
{const s=get("12-6");s.targets=s.targets.filter(t=>/팀/.test(t.n||t.t||t.k||""));if(!s.targets.length)s.targets=get("12-6").targets.slice(0,1);s.title="평가 결과를 팀 전체에";}

/* ---------- 라운드 성적표 (02-4 B 기본형) ---------- */
const AXN3={1:"① 일 맡기기",2:"② 평가하기",3:"③ 자원 나누기",4:"④ 설명하기"};
function axRange(from){const a={1:{L:0,P:0},2:{L:0,P:0},3:{L:0,P:0},4:{L:0,P:0}};G.sig.slice(from).filter(x=>!x.forced).forEach(x=>{a[x.a][x.s]+=x.w;});const o={};for(const k in a){const t=a[k].L+a[k].P;o[k]=t?Math.round(a[k].L/t*100):null;}return o;}
function lastChoice(id){const d=(G.decisions||[]).filter(x=>x.scene===id);return d.length?d[d.length-1].choice:null;}
function resultCode(r){
 const ch={};["1-5","3-1","R1-pick","3-8","4-5","6-1","5-4","8-1a","R3-1a","R3-1b","9-4","6-4b","12-3a"].forEach(id=>{const c=lastChoice(id);if(c!=null)ch[id]=String(c).slice(0,12);});
 if(G.f.pub_full)ch.pub="A";else if(G.f.pub_items)ch.pub="B";else if(G.f.pub_leaders)ch.pub="C";
 if(G.cells)ch.cells=["RUN","AI","GROW","SEC"].map(k=>G.cells[k]||0).join("");
 const o={v:3,r,nick:G.nick||"",style:G.style||"bal",ch,kpi:[G.score.성과,G.score.재무,G.score.사람,G.score.안정,G.fsat],ax:{self:G.diag||null,act:axRange(0)},g2:G.goal2,t:Math.round((Date.now()-((G.rs||{})[r]||{}).t0)/1000)||0};
 const b=btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
 let h=0;for(const c of b)h=(h*31+c.charCodeAt(0))>>>0;return `IT3-R${r}-${b}-${(h%65536).toString(16).padStart(4,"0")}`;
}
window.v3ResultCode=resultCode;
SCENES.roundEnd=function(s){
 const r=s.round,st=(G.rs||{})[r]||{score:{},trust:{}};
 const d=(a,b)=>{const x=a-b;return `${b} → <b>${a}</b> <span class="note" style="color:${x>0?"var(--good)":x<0?"var(--bad)":"var(--muted)"}">${x>0?"+":""}${x}</span>`;};
 const ax=axRange(st.sig||0),axAll=axRange(0);
 const ev=(G.sig||[]).slice(st.sig||0).filter(x=>!x.forced);const fit=ev.find(x=>x.s==="L"),gap=ev.find(x=>x.s==="P");
 const nameOf=id=>{const sc=byId[id]||CONTENT.find(x=>x.id===id);if(sc)return noNum(val(sc.title)||id);const m=typeof mailOf==="function"?mailOf(id):null;return m&&m.m&&m.m.sub?m.m.sub:id;};
 const draw=()=>{paint("");
  shell(`<div class="pane"><div class="eyebrow">Round ${r} 성적표</div><h2>${s.title}</h2>
  <p><b>① 팀이 어떻게 됐나</b> <span class="note">조직 KPI · 정답은 없습니다</span></p>
  <div class="kv">${SCORES.map(k=>`<div><span>${SL(k)}</span>${d(G.score[k],st.score[k]??50)}</div>`).join("")}<div><span>F사 만족</span>${d(G.fsat,st.fsat??50)}</div><div><span>토큰 효율</span>${(()=>{const used=(G.roundTok&&G.roundTok[r])||0,cap=G.tokenCap||40;const eff=used>0?((G.score.성과+G.score.안정)/2/(used/10)).toFixed(1):"미사용";return `<b>${eff}</b> <span class="note">(💳${used}/${cap})</span>`;})()}</div></div>
  ${(G.chain||[]).length?`<p class="note">서비스 수익 체인 · ${G.chain.slice(r===2?-2:-1).map(c=>chainLine(c)).join(" / ")}</p>`:""}
  <p><b>② 그 판단은 기준과 맞았나</b></p><div class="prose" style="font-size:14.5px">${r===1?`<p>기여 기준 3개 이상 · 드러나지 않는 기여 포함 · 연결: ${G.goal2?"충족":"미충족"} · 공개 수준: ${G.f.pub_full?"전체 공개":G.f.pub_items?"항목만":G.f.pub_leaders?"리더에게만":"—"}</p>`:""}<p>근거 일관성: ${(()=>{const c=(G.cons||[]);return c.length?Math.round(c.filter(x=>x.fit).length/c.length*100)+"% ("+c.length+"건)":"아직 근거를 고른 안건이 없습니다";})()}</p>${window.v3RubricHtml?window.v3RubricHtml(r):'<p class="note">서술형(핵심 과제 근거, 공지문, 설명)은 채점 대기입니다.</p>'}</div>
  <p><b>③ 내 습관은 어느 쪽이었나</b> <span class="note">리더 쪽 비율 · 이번 라운드 / 누적</span></p>
  <div class="kv">${[1,2,3,4].map(a=>`<div><span>${AXN3[a]}</span><b>${ax[a]??"—"}</b> <span class="note">/ ${axAll[a]??"—"}</span></div>`).join("")}</div>
  ${fit?`<p class="note">일치 증거 · ${AXN3[fit.a]}: ${nameOf(fit.scene)} (${fit.choice})</p>`:""}${gap?`<p class="note">균열 증거 · ${AXN3[gap.a]}: ${nameOf(gap.scene)} (${gap.choice})</p>`:""}
  ${window.cinemaHtml?cinemaHtml("R"+r):""}${window.theoryCard?theoryCard(r):""}${G.selfStudy&&window.v3SelfStudyHtml?window.v3SelfStudyHtml(r):""}
  <p class="note">리더를 아는 정도: ${window.knowPct?knowPct().join("/")+"칸":""}</p>
  <p><b>결과 코드</b> <span class="note">피드백 세션에서 반 전체 결과를 볼 때 씁니다. 별칭만 들어가고, 쓴 글은 들어가지 않습니다.</span></p>
  <label class="label" for="nick">별칭 (실명·사번 쓰지 않기)</label><input id="nick" value="${(G.nick||"").replace(/"/g,"")}" style="font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);width:200px">
  <div class="codebox" id="rc">${resultCode(r)}</div>
  <div class="foot"><button class="btn" ${A(()=>{G.nick=$("nick").value.trim().slice(0,20);$("rc").textContent=resultCode(r);try{navigator.clipboard.writeText($("rc").textContent);toast("결과 코드를 복사했습니다.");}catch(e){toast("코드를 직접 선택해 복사해 주세요.");}save();})}>코드 복사</button><button class="btn main" ${A(()=>{G.nick=$("nick").value.trim().slice(0,20);next();})}>${r<3?"저장하고 마치기":"결산으로"}</button></div></div>`);
  $("nick").oninput=e=>{G.nick=e.target.value.trim().slice(0,20);$("rc").textContent=resultCode(r);};
 };
 draw();
};
/* 라운드 사이 대기 화면 */
SCENES.wait=function(s){
 const sc=window.v3MakeSaveCode?window.v3MakeSaveCode():"";
 shell(paint(`<div class="pane"><div class="eyebrow">Round ${s.round} 끝</div><h2>피드백 세션까지 기다려 주세요</h2><div class="prose"><p>${s.round===1?"다음 라운드는 내일 강의 뒤에 열립니다.":"마지막 라운드는 내일 완결 강의 뒤에 열립니다."} 진행은 이 브라우저에 저장되었습니다. 창을 닫아도 됩니다.</p></div>
 ${sc?`<details class="ref"><summary>기기·브라우저 변경 대비 이어하기 코드 (다른 PC나 태블릿으로 옮길 때만 복사)</summary><div style="margin-top:8px;display:grid;gap:6px"><div class="codebox" id="sv_box" style="max-height:72px;overflow-y:auto;font-size:11.5px">${sc}</div><div class="btns"><button class="btn" ${A(()=>{try{navigator.clipboard.writeText(sc);toast("기기 이전용 복원 코드를 복사했습니다.");}catch(e){toast("코드를 직접 선택해 복사해 주세요.");}})}>복원 코드 복사</button></div></div></details>`:""}
 <div class="foot"><span></span><button class="btn main" ${A(next)}>다음 라운드 화면으로</button></div></div>`));
};

/* 120분판의 분기별 온보딩 노트 목록은 v3 사이드바에 두지 않는다 (강의가 대신한다) */
notesHtml=function(){return "";};

/* ---------- 새 순서 ---------- */
const N=(o)=>o;
const ORDER=[
 "P0","P1",DOCS[0],DOCS[1],DOCS[2],"P3",{id:"STYLE",type:"style",title:"이끄는 방식",when:"프롤로그"},
 {id:"GATE1",type:"gate",round:1,month:1,when:"Round 1"},
 "1-1","1-3","1-5","1-4","3-1",{id:"R1-pick",type:"kpipick",month:3,when:"3월",tag:"KPI 합의",title:"누구와 직접 합의할까요?"},"3-2","3-3","3-4","3-5","3-6","3-8","3-9","END3",
 {id:"ROUND1",type:"roundEnd",round:1,month:3,title:"1분기 · 기준 세우기"},{id:"WAIT1",type:"wait",round:1,month:3},
 {id:"GATE2",type:"gate",round:2,month:4,when:"Round 2"},
 "RET2","4-1","4-2","4-3","4-5","6-1","6-1p","5-4","END6","8-1a","8-1b","8-1c","6-3","4-4",S1,{id:"6-2",type:"write3",month:9,when:"9월",title:"하반기 계약을 세 사람에게"},"9-7","END9",
 {id:"ROUND2",type:"roundEnd",round:2,month:9,title:"2·3분기 · 배분과 상충"},{id:"WAIT2",type:"wait",round:2,month:9},
 {id:"GATE3",type:"gate",round:3,month:10,when:"Round 3"},{id:"R3-0",type:"realloc",month:10,when:"Round 3"},
 R31a,R31b,"9-4","11-4","6-4a","6-4b",S2,"12-3a","12-3","12-4","12-6","END12",{id:"V3END",type:"v3final",month:12,bare:true,title:"결산"},"FINALE"];
const MONTH={"RET2":4,"6-1":6,"6-1p":6,"5-4":6,"END6":6,"8-1a":8,"8-1b":8,"8-1c":8,"6-3":8,"4-4":8,"6-2":9,"9-7":9,"END9":9,"9-4":10,"11-4":11,"6-4a":11,"6-4b":11};
const list=ORDER.map(x=>typeof x==="string"?get(x):x);
list.forEach(s=>{if(MONTH[s.id])s.month=MONTH[s.id];});
CONTENT.length=0;list.forEach(s=>CONTENT.push(s));
/* index.html에 v3ui.js 태그가 누락된 경우 자동 로드 후 boot() 실행 */
if(typeof document!=="undefined"&&!window.openProfile&&!document.querySelector("script[src*=\"v3ui.js\"]")){
 const _boot=window.boot;let called=false;
 window.boot=function(){called=true;};
 const sc=document.createElement("script");sc.src="v3ui.js";
 sc.onload=sc.onerror=function(){window.boot=_boot;if(called&&typeof _boot==="function")_boot();};
 document.head.appendChild(sc);
}
})();

/* 맥락 없이 짧게 끝나던 확률 결과·대사를 1~2문장으로 풀어 쓴다 (2026-11-20). 효과와 확률은 그대로 */
{const LINE_FIX={"첫 토론에서 서하준과 문지원이 크게 부딪쳤습니다.": "첫 토론 안건이 AI 도구 도입이었습니다. 빨리 써 보자는 서하준과 규정부터 보자는 문지원이 크게 부딪쳤습니다.", "\"팀장이 이수진하고만 이야기한다\"는 말이 돌았습니다.": "모듈별로 따로 만나는 첫 순서가 어제까지 같은 모듈이던 이수진이었습니다. \"팀장이 이수진하고만 이야기한다\"는 말이 돌았습니다.", "생산 쪽은 팀장님이 손 놓으셨다던데요.": "강태식 선배한테 들었는데, 생산 쪽은 팀장님이 아예 손을 놓으셨다던데요. 정말 생산 보고는 안 받으시는 거예요?", "\"팀장이 강태식한테 배우러 다닌다\"는 말이 돌기 시작했습니다.": "매주 강태식에게 생산 구조를 배우러 가는 모습이 보이자, 다른 모듈에서 \"새 팀장이 선배한테 배우러 다닌다\"는 말이 돌기 시작했습니다.", "강태식: \"그래, 그 말 지켜 봐.\"": "강태식: \"모듈마다 같은 방식이라. 그래, 그 말 지켜 봐. 생산만 따로 손대는 일만 없으면 나도 따를게.\"", "\"제 점검은 몇 점이에요?\" 문의가 쌓였습니다.": "기준과 비중까지 공개하자 \"제 점검 한 건은 몇 점이에요?\" 같은 문의가 쌓였습니다. 답하느라 다음 달 팀장 시간이 줄었습니다.", "사소한 점검을 부풀리는 일이 생겼습니다.": "예방 활동이 점수가 된다는 걸 알자, 사소한 점검까지 건수로 올리는 사람이 생겼습니다.", "모듈마다 설명이 달라지고 있습니다.": "항목만 공개하고 비중은 면담에서 설명하다 보니, 같은 기준을 모듈마다 다르게 설명하고 있습니다.", "리더들이 자기 모듈에 직접 설명하기 시작했습니다.": "리더들과만 맞춘 기준을 리더들이 알아서 자기 모듈 팀원에게 설명하기 시작했습니다. 생각보다 잘 퍼졌습니다.", "구성원들은 아직 기준을 보지 못했습니다.": "리더들과만 맞췄기 때문에, 팀원들은 아직 자신이 무엇으로 평가받는지 모릅니다.", "넘길 곳이 조달이면 1년 내내 못 넘겨요.": "현업에 넘긴 건수로 세신다고요? 제 실험 결과를 받아 줄 곳이 대부분 조달인데, 문지원 리더는 그렇게 빨리 받아 주지 않아요. 1년 내내 하나도 못 넘길 수도 있어요.", "건수를 채우려 작은 실험만 늘어나고 있습니다.": "실험 건수가 KPI가 되자, 건수를 채우려고 결과가 뻔한 작은 실험만 늘고 토큰이 새고 있습니다.", "실험 하나가 사내 표준이 됐습니다.": "R&D가 자유롭게 돌린 실험 하나가 성과를 내 사내 표준 도구로 채택됐습니다.", "여기서 뭘 더 할 수 있죠?": "R&D도 운영 지표로만 평가받는다면, 제가 여기서 새로 시도할 수 있는 게 뭐가 남죠? 솔직히 다른 데서도 연락이 와요.", "서하준이 운영 지표 개선을 자기 과제로 들고 왔습니다.": "서하준이 운영 지표를 AI로 개선하는 방안을 스스로 과제로 들고 왔습니다.", "\"조달은 AI 안 해도 되는 곳\"이라는 말이 돌았습니다.": "조달만 AI 목표가 빠지자, 다른 모듈에서 \"조달은 AI 안 해도 되는 곳\"이라는 말이 돌았습니다. 서하준이 특히 못마땅해합니다.", "문지원의 계획이 아직 일정으로 내려오지 않았습니다.": "방식과 일정을 문지원에게 맡겼더니, 자동화 계획이 아직 '검토 중'에서 움직이지 않습니다.", "강태식: \"그 두 개가 왜 내 모듈부터야?\"": "강태식: \"새로 더하는 항목 두 개, 왜 하필 생산부터 넣는 거야? 다른 모듈은 작년 그대로잖아.\"", "올라온 초안에 예방과 주니어 기여 항목이 없습니다.": "강태식이 직접 쓴 생산 KPI 초안에는 장애 복구 시간만 있고, 예방 점검과 주니어 기여 항목은 빠져 있습니다.", "작년보다 높은 목표를 써 왔습니다.": "강태식이 초안에 작년보다 높은 목표를 스스로 써 왔습니다.", "강태식의 불만이 깊어졌습니다.": "생산만의 사정을 봐주지 않자 강태식의 불만이 깊어졌습니다. 다음 배분 회의에서 더 세게 반대할 것 같습니다.", "강태식: \"같은 잣대면 나도 할 말 없지.\"": "강태식: \"모든 모듈에 같은 잣대라면 나도 할 말 없지. 대신 생산만 예외로 손대는 일은 없게 해.\"", "재발 없는 건 운 아니에요?": "재발이 없던 기간을 실적으로 친다고요? 장애가 안 난 건 운일 수도 있잖아요. 그럼 밤새 불 끈 사람은 뭐가 됩니까?", "사소한 점검이 늘고 있습니다.": "예방 건수가 KPI가 되자, 큰 의미 없는 사소한 점검으로 건수를 채우는 일이 늘고 있습니다.", "예방이 처음으로 월간 보고서에 숫자로 실렸습니다.": "그동안 보이지 않던 예방 활동이 처음으로 월간 보고서에 숫자로 실렸습니다.", "\"팀장 옛 모듈이라 봐준다\"는 말이 돌았습니다.": "측정 방법을 이수진에게 맡긴 것을 두고, \"팀장이 어제까지 있던 모듈이라 봐준다\"는 말이 돌았습니다.", "기록에 한 선임 이름이 형식적으로만 올라갔습니다.": "참여자별 기여를 기록하게 했지만, 제안서를 실제로 쓴 한 선임의 이름은 맨 아래 형식적으로만 올라갔습니다.", "받아 온 일의 운영 부담이 다른 모듈로 넘어가고 있습니다.": "정다은이 수주액을 채우려고 받아 온 일의 운영 부담이 생산과 가공 모듈로 넘어가고 있습니다.", "그럼 저는 뭘 보고 뛰죠?": "수주액 비중을 줄이면, 영업하는 저는 뭘 보고 뛰어야 하죠? 고객 유지 지표는 제가 혼자 움직일 수 있는 숫자가 아니잖아요.", "이틀 뒤 보안팀이 먼저 알았습니다.": "우리가 범위를 파악하는 이틀 사이, 보안팀이 다른 경로로 먼저 알았습니다. \"왜 바로 신고하지 않았느냐\"는 질문이 돌아왔습니다.", "팀에 선이 분명해졌습니다.": "공개 조치 뒤로 팀원들 사이에 '고객 데이터는 절대 외부 도구에 넣지 않는다'는 선이 분명해졌습니다.", "고칠 항목에서 빠진 쪽이 \"저희는요?\"라고 묻습니다.": "고칠 한 가지를 정해 알리자, 그 항목에서 빠진 모듈 리더가 \"저희 모듈 문제는요?\"라고 묻습니다.", "모듈마다 대응이 달라지고 있습니다.": "설문 대응을 리더들에게 맡겼더니, 어떤 모듈은 바로 바꾸고 어떤 모듈은 그대로라 팀원들이 차이를 느끼고 있습니다.", "\"팀장이 강태식한테 밀렸다\"는 말이 돌았습니다.": "회의에서 바로 답하지 않고 넘긴 것을 두고, \"팀장이 강태식한테 밀렸다\"는 말이 돌았습니다.", "회의가 공개 말다툼으로 번졌습니다.": "모두 앞에서 근거를 다시 짚자 강태식이 맞받아쳤고, 회의가 공개 말다툼으로 번졌습니다.", "강태식: \"그래. 기록해 둬. 6월에 볼 거니까.\"": "강태식: \"그래, 그 근거 기록해 둬. 분기 끝에 결과가 그 말대로 나오는지 볼 거니까.\"", "문지원까지 다음 회의에 나오지 않았습니다.": "강태식의 반대를 그대로 넘기자, 강태식과 가까운 문지원까지 다음 회의에 나오지 않았습니다.", "\"그럼 왜 그 숫자를 주셨죠?\"": "F사 임원: \"140시간이 추정치였다면, 처음에 그 숫자를 왜 저희에게 주셨죠?\"", "본사 재무가 \"2년 약정은 팀장 권한 밖\"이라고 합니다.": "본사 재무팀이 \"2년 약정은 팀장이 정할 수 있는 범위가 아니다\"라며 제동을 걸었습니다.", "F사 임원: \"실측 자료는 어디 있습니까?\"": "F사 임원: \"실측으로 확인된 절감만 반영하자면서, 그 실측 자료는 지금 어디 있습니까?\"", "본사 재무가 인하분을 어디서 메울지 묻습니다.": "본사 재무팀이 \"운영비 5%를 깎아 준 만큼 팀 이익은 어디서 메웁니까?\"라고 묻습니다.", "우선 협상권이 10월 대형 수주에서 유리한 조건이 될 것 같습니다.": "받아 둔 우선 협상권 덕분에, 하반기 신규 수주에서 유리한 위치에 설 것 같습니다.", "신규 과제가 벌써 네 건인데요": "신규 과제를 또 두 건 받으셨다고요? R&D가 맡은 게 벌써 네 건인데요. 이대로면 하나도 제대로 못 끝냅니다.", "다음 달부터 가공의 점검 보고가 형식만 남았습니다.": "복구한 생산만 상을 받자, 가공 모듈의 점검 보고가 다음 달부터 형식만 남았습니다. 막아 봐야 인정받지 못한다는 분위기입니다.", "이수진: \"불 낸 데랑 같이 받으라고요?\"": "강태식: \"장애를 낸 가공이랑 상을 같이 받으라고? 밤새 복구한 건 우리야.\"", "본사가 \"한 건에 한 모듈만\"이라며 돌려보냈습니다.": "본사가 \"추천은 한 건에 한 모듈만 됩니다\"라며 공동 추천을 돌려보냈습니다.", "7월이 되어도 자리가 잡히지 않았습니다.": "추천을 쉬고 기준부터 정하기로 했지만, 분기가 지나도록 장애 공로를 보는 기준은 정해지지 않았습니다.", "본사 인력기획: \"그럼 그동안 보낸 효과 숫자는 뭡니까.\"": "본사 인력기획: \"실제 절감이 그것뿐이라면, 그동안 올려 보낸 효과 숫자는 뭡니까?\"", "가는 사람이 \"다녀오면 제 자리 있나요?\"라고 묻습니다.": "파견 가는 팀원이 \"6개월 다녀오면 제 자리가 그대로 있긴 한가요?\"라고 묻습니다.", "받아 둔 일은 그대로라 일이 넘칩니다.": "신규 과제 칸을 줄였지만 이미 받아 둔 일은 그대로라, 남은 사람들에게 일이 넘칩니다.", "서하준이 과제 하나를 스스로 접었습니다.": "AI 칸이 줄자 서하준이 진행 중이던 과제 하나를 스스로 접었습니다.", "강태식: \"이번엔 해 보겠습니다.\" 야간을 재편했습니다.": "강태식: \"운영 칸이 줄었으니 이번엔 우리가 방식을 바꿔 보죠.\" 강태식이 야간 대기표를 직접 재편했습니다.", "어느 모듈도 일을 덜지 못했습니다.": "모든 칸에서 조금씩 덜어 냈지만, 어느 모듈도 실제로 일을 덜지는 못했습니다.", "리더들이 서로 겹치는 일을 찾아 왔습니다.": "몫을 나눠 지게 하자, 리더들이 모듈끼리 겹치는 일을 찾아 줄여 왔습니다.", "\"제 모듈 사람 일을 또 팀장이 정하시네요\"": "강태식: \"김 사원 대기를 빼는 것까지 팀장이 정하시네요. 제 모듈 사람 일은 저한테 먼저 말해 주셔야죠.\"", "제가 못 버틴 것처럼 보이잖아요": "갑자기 대기에서 빠지면, 다들 제가 못 버텨서 빠진 걸로 볼 거예요. 그게 더 힘들어요.", "\"괜찮습니다\"로 끝났습니다.": "쉴지 말지를 김 사원에게 맡기자, 김 사원은 \"괜찮습니다\" 한마디로 대화를 끝냈습니다. 쉬지 않을 것 같습니다.", "강태식: \"제 모듈 사람한테 왜 일을 바로 줍니까.\"": "강태식: \"김 사원은 제 모듈 사람인데, 왜 저를 건너뛰고 일을 바로 줍니까?\"", "초안은 강태식 이름으로 올라갔습니다.": "김 사원이 쓴 야간 경고 규칙 초안이 강태식 이름으로 올라갔습니다.", "\"팀장이 또 글쓴이를 찾는다\"는 말이 돌았습니다.": "한 선임을 따로 부른 것이 알려지자, 게시판에 \"팀장이 또 익명 글쓴이를 찾는다\"는 말이 돌았습니다.", "게시판에 \"규칙만 만드네요\"라는 댓글이 달렸습니다.": "표지 규칙을 새로 만들자, 게시판에 \"사람 얘기는 안 듣고 규칙만 만드네요\"라는 댓글이 달렸습니다.", "정다은이 한 선임에게 \"게시판에 썼어?\"라고 물었습니다.": "정리를 맡은 정다은이 한 선임을 불러 \"혹시 게시판에 그 글 썼어?\"라고 물었습니다. 한 선임은 움츠러들었습니다.", "고르지 않은 문항을 낮게 준 사람들이 조용해졌습니다.": "고칠 문항으로 고르지 않은 쪽에 낮은 점수를 준 사람들은, 자기 목소리가 빠졌다고 느끼고 조용해졌습니다.", "리더마다 설문을 읽는 눈이 달랐습니다.": "설문 결과를 리더들에게 나눠 맡기자, 같은 점수를 두고도 리더마다 해석과 대응이 달랐습니다.", "사후 감사에서 드러났습니다.": "아침에 사후 승인을 받으려던 우회가 감사에서 드러났습니다. 승인 없이 안전장치를 우회한 기록이 남았습니다.", "F사 임원: \"정의 얘기로 시간을 끄시는군요.\"": "F사 임원: \"산식 정의부터 맞추자는 건, 결국 시간을 끌자는 말씀이군요.\"", "F사 법무 명의의 공문이 왔습니다.": "답을 다음 달로 미루자, F사 법무팀 명의로 조건 재협상을 요구하는 공문이 왔습니다.", "강태식: \"문서부터 만드네.\"": "강태식: \"고맙다는 말 다음에 바로 합의서부터 만드네. 역시 팀장은 문서로 일하는구나.\"", "강태식: \"나를 내보내려는 거야?\"": "강태식: \"다른 팀 팀장 후보로 추천한다고? 결국 나를 이 팀에서 내보내려는 거야?\"", "대화 뒤에도 떠나기로 했습니다.": "끝까지 이야기를 들었지만, 강태식은 대화 뒤에도 떠나기로 했습니다.", "면접을 취소했습니다.": "이야기를 나눈 뒤 강태식이 다른 회사 면접을 취소했습니다.", "그럼 예방은 깎인 거네요": "AI 항목을 20%로 넣느라 다른 항목을 고르게 줄이셨으면, 결국 예방 몫이 깎인 거네요. 올해 처음 기준에 들어간 건데요.", "인사팀: \"AI 실적의 정의는 전사 공통입니다.\"": "인사팀: \"AI 실적을 어떻게 셀지는 전사 공통 기준입니다. 팀마다 다르게 정할 수 없습니다.\"", "유예가 승인됐습니다.": "인사팀이 이 팀에는 지침 적용을 내년으로 미루는 유예를 승인했습니다.", "거절됐습니다. 인사팀 안대로 적용됩니다.": "인사팀이 유예 요청을 거절했습니다. 올해 평가부터 인사팀 지침대로 적용됩니다.", "\"3월에는 뭐였죠? 또 바뀌나요?\"": "팀원: \"연초에 받은 기준이랑 뭐가 달라진 거죠? 평가 전에 또 바뀌는 건 아니죠?\"", "모듈마다 설명이 달라졌습니다.": "리더들에게 전달을 맡기자, 바뀐 기준을 모듈마다 다르게 설명했습니다.", "9월에 알려 보니 다들 인사팀 공지로 이미 알고 있었습니다.": "평가 공지 때 알리려고 미뤘더니, 팀원들은 이미 인사팀 공지로 바뀐 내용을 먼저 알고 있었습니다.", "의견서 절반에 사실이 없어 되돌려 보냈습니다.": "리더 의견서를 확인해 보니 절반에 관찰한 사실 없이 인상만 적혀 있어서 되돌려 보냈습니다.", "\"친한 사람이 잘 받네요.\"": "익명 게시판: \"등급을 리더 의견대로만 정하니까, 결국 리더랑 친한 사람이 잘 받네요.\"", "\"KPI 다 채웠는데 왜요.\" 작년과 같은 말이 나왔습니다.": "\"KPI 다 채웠는데 왜 이 등급이에요?\" 작년 이의제기 때와 똑같은 말이 다시 나왔습니다.", "숫자라 말이 없습니다.": "KPI 순서로 정하니 숫자라서, 당장은 따지는 사람이 없습니다.", "김 사원이 8월까지 혼자 다듬어 왔습니다.": "미뤄 두자고 했는데도, 김 사원이 몇 달 동안 혼자 규칙 초안을 다듬어 가져왔습니다.", "현장 보고가 끊겨 F사 통지가 늦어졌습니다.": "지휘를 강태식에게 넘기고 나니 현장 상황이 팀장에게 제때 올라오지 않았습니다. 그 사이 F사 통지가 늦어졌습니다.", "본사 협의 일정이 12월 업무와 겹쳤습니다.": "약속한 본사 인력 협의가 12월 마감 업무와 겹쳐, 팀장 시간이 더 들었습니다.", "강태식의 후배들이 설계 회의에 불려 갔습니다.": "야간 설계가 공식 목표가 되자, 강태식이 후배들을 설계 회의에 직접 불러 함께 만들기 시작했습니다.", "대체 후보 얘기가 강태식의 귀에 들어갔습니다.": "대체 리더 후보를 뽑아 둔다는 얘기가 강태식의 귀에 들어갔습니다. \"이미 내 자리를 정리하는 중이었군.\"", "생산 모듈의 두 사람이 남겠다고 했습니다.": "따로 만난 생산 모듈 핵심 인력 두 사람이, 강태식이 어떻게 하든 팀에 남겠다고 했습니다."};
 const arr=x=>Array.isArray(x)?x:[];let n=0;
 const fixO=opts=>arr(opts).forEach(o=>{arr(o.tw).forEach(w=>{if(typeof w.t==="string"&&LINE_FIX[w.t]){w.t=LINE_FIX[w.t];n++;}});});
 CONTENT.forEach(s=>{fixO(s.options);fixO(s.levels);fixO(s.planb);arr(s.cases).forEach(c=>fixO(c.options));});
 const DONE_FIX={"1-4":{A:"강태식이 고개를 끄덕였습니다. 앞으로 생산 모듈 일은 강태식이 걸러서 필요한 것만 올립니다.",B:"강태식이 잠시 보더니 말했습니다. \"화요일 네 시. 늦으면 안 기다린다.\" 매주 30분, 생산 구조를 배우는 시간이 생겼습니다.",C:"강태식이 한참 쳐다보다 엘리베이터에 올랐습니다. 생산도 다른 모듈과 똑같이 보겠다는 뜻은 전해졌습니다."},"6-1p":{D:"협상선을 적지 않았습니다. 인하 폭은 F사와 마주 앉은 자리에서 정하게 됩니다."}};
 Object.entries(DONE_FIX).forEach(([id,m])=>{const sc=CONTENT.find(x=>x.id===id);if(sc)arr(sc.options).forEach(o=>{if(m[o.k]){o.done=m[o.k];n++;}});});
 window.__lineFix=n;}
