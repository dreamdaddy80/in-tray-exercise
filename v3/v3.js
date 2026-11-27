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
 {const o=get("4-5").options.find(x=>x.k==="C");o.fx=String(o.fx)+" 헬씨푸드만족+1";} /* 파일럿 시연 */
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
   const ib0=window.ibSnap?ibSnap():null;
   if(st.hs)applyFx("안정-"+st.hs);if(st.holds>=6)applyFx("소문1");
   if(window.ibSettleLog)ibSettleLog(ib0,`보류 ${st.holds}건 정산: 3건을 넘은 ${st.hs}건만큼 서비스 안정이 내려갔습니다.${st.holds>=6?" 처리되지 않은 일 이야기가 팀에 돌기 시작했습니다.":""}`);
  }
  const l=[];
  {const L=(Array.isArray(G.inboxLog)?G.inboxLog:[]).filter(e=>e.i===G.idx&&e.id!=="_settle");
   if(L.length&&window.ibCountText)l.push(`오늘 처리: ${ibCountText(ibCount(L))}. (받은편지함은 ⏳ 팀장 시간을 깎지 않습니다)`);
   else if(st.replies)l.push(`메일에 직접 응답 ${st.replies}건을 제한 시간 안에 처리했습니다. (받은편지함은 ⏳ 팀장 시간을 깎지 않습니다)`);}
  if(st.holds)l.push(`보류 ${st.holds}건${st.hs?`: 미처리 안건이 쌓여 서비스 안정이 ${st.hs} 내려갔습니다`:": 아직은 감당할 만합니다"}.${st.holds>=6?" 처리되지 않은 일 이야기가 팀에 돌기 시작했습니다.":""}`);
  if(st.pend&&st.pend.length)l.push(`<b>미결 안건 ${st.pend.length}건</b>: ${st.pend.map(m=>`${m.from} · ${m.sub}`).join(", ")}. 시간 안에 정하지 못해 승인도 거절도 아닌 채 남았습니다. 보류와 같은 점수 영향이 있고, 성적표 요약에 다시 나옵니다.`);
  return l.length?`<div class="happen"><span class="label">오늘 받은편지함의 값</span>${l.join("<br>")}</div>`:"";
 };}

/* v3 패치 2: 분기 마감(endQuarter / monthEnd)을 3라운드 구조에 맞게 재정의 (END6 무음 통과 및 토큰 더미 덮어쓰기 제거) */
endQuarter=function(){
 const lv=v=>Math.trunc((v-50)/10);
 const ex=G.fexp??50,st0=G.score.안정;const a=lv(G.score.사람)*2,c=lv(G.fsat);const b=Math.max(-6,Math.min(6,Math.round((st0-ex)/4)));
 G.score.안정=Math.max(0,Math.min(100,G.score.안정+a));G.fsat=Math.max(0,Math.min(100,G.fsat+b));
 /* BSC 고리 (02-5 G): 고객 만족은 재무로만 이어진다 */G.score.재무=Math.max(0,Math.min(100,G.score.재무+c*2));
 G.chain.push({q:G.quarter+1,사람_안정:a,안정_헬씨푸드:b,헬씨푸드_재무:c*2,헬씨푸드_성과:0,기대:ex,안정:st0});
 (G.hist=G.hist||[]).push({...G.score,헬씨푸드:G.fsat,헬씨푸드기대:G.fexp??50,안전:G.safe});
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
chainLine=function(c){const sg=v=>(v>0?"+":"")+v;const p=[];if(c.사람_안정)p.push(`구성원 점수 때문에 다음 분기 서비스 안정이 ${sg(c.사람_안정)}`);if(c.기대!=null)p.push(`헬씨푸드 기대 ${c.기대} 대비 서비스 안정 ${c.안정} → 헬씨푸드 만족 ${sg(c.안정_헬씨푸드)}`);else if(c.안정_헬씨푸드)p.push(`서비스 안정 점수 때문에 헬씨푸드 만족이 ${sg(c.안정_헬씨푸드)}`);if(c.헬씨푸드_재무)p.push(`헬씨푸드 만족 때문에 재무가 ${sg(c.헬씨푸드_재무)}`);return p.length?`${c.q}분기 연쇄: `+p.join(" · "):"";};
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
const TASK_EX=["예: 이익의 62%가 추가 과제에서 나오는데, 운영이 흔들리면 그 매출부터 위험해진다.","예: 토큰이 팀 손익에 잡히는데 기준이 없으면 많이 쓰는 모듈이 계속 더 쓰게 된다.","예: 작년 이의제기처럼, 기준을 모르면 같은 등급도 불공정하게 느낀다.","예: 대기가 몇 사람에게 몰리면 지쳐서 경고를 놓치고 장애로 이어진다.","예: 고객 데이터가 승인 안 된 서비스에 들어가면 보안 사고와 계약 위반이 된다.","예: 불을 막는 사람이 인정받지 못하면 예방이 줄고 장애가 늘어난다.","예: 헬씨푸드 임원이 직접 보는 지표라, 늦으면 고객 신뢰가 깎인다.","예: 내일 임원 보고가 잘못되면 수주 기회와 고객 신뢰를 함께 잃는다."];
const SC_DEF={성과:"헬씨푸드가 만족하는가 · 약속한 서비스를 지켰는가",재무:"팀 손익 · 매출, 운영비, 토큰 비용",사람:"팀원 30명의 몰입과 목소리",안정:"시스템 가용성 · 장애 · 보안"};
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
   record(s.id,pick.map(i=>i+1).join(","));
   /* C-2 (2026-11-25): 고른 과제가 이후 어느 장면에 쓰이는지 한 줄씩. 맞고 틀림은 말하지 않는다 */
   const USE=["4월·6월 헬씨푸드 운영비 협상에서 '손익 구조 메모'로 협상 자료 맨 위에 놓입니다.","4월·6월 헬씨푸드 운영비 협상에서 '손익 구조 메모'로 협상 자료 맨 위에 놓입니다.","3월 KPI 합의서에서 등급 기여 기준을 정할 때 이어집니다.","8월 야간 대기 장면에서 김 사원이 이 메모를 기억합니다.","3월 외부 AI 사용 사고에 대응할 때 미리 짚어 둔 관리 체계로 이어집니다.","3월 등급 기여 기준에 예방 활동을 넣을 때 이어집니다.","이번 달 안에 끝나는 일입니다. 이후 장면에 따로 이어지지 않습니다.","이번 주 안에 끝나는 일입니다. 이후 장면에 따로 이어지지 않습니다."];
   paint("");shell(`<div class="pane">${head(s)}<h2>메모를 닫았습니다</h2><p class="note">고른 과제가 올해 어디에서 다시 나오는지입니다. 맞고 틀림을 매기는 것이 아닙니다.</p><div class="happen">${pick.map(i=>`<b>${s.items[i]}</b><br>→ ${USE[i]}`).join("<br><br>")}</div><div class="foot"><span></span><button class="btn main" ${A(next)}>10시 팀 아침 회의로</button></div></div>`);
  })}>메모 닫기</button></div></div>`);
  const up=()=>{$("tgo").disabled=!ok();};
  pick.forEach(i=>{$("t"+i).oninput=up;$("c"+i).onchange=up;});up();
 };
 draw();
};
/* 등급 기여 기준 "고객 칭찬"은 헬씨푸드 만족도까지 포함 (이름은 근거 목록과 맞추려고 그대로) */
get("3-1").cards.forEach(c=>{if(c.n==="고객 칭찬")c.d="헬씨푸드 만족도 조사 결과와 감사 · 칭찬";});
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
/* C-3 (2026-11-25): 확정 전에 "이 조합으로 12월에 누구의 기여를 설명하기 어려운가". 정답 표시가 아니라 성찰용 */
const KPI_GAP=[["장애 예방 활동",null,"가공(이수진)이 8개월 동안 장애를 막아 온 예방 점검"],["장애 복구 기여",null,"생산(강태식)이 새벽에 장애를 복구한 일"],["보안 준수",null,"조달(문지원)이 절차와 데이터 규정을 지킨 기록"],["동료 지원과 온보딩",null,"후배를 돕고 지식을 나눈 선배들의 시간"],["AI 활용 효과",null,"R&D(서하준)가 AI 도구로 줄인 작업"],[["추가 과제 매출 기여","고객 칭찬"],null,"마케팅(정다은)의 수주와 제안"]];
function kpiGap(s,pick){const names=pick.map(i=>s.cards[i].n);const miss=KPI_GAP.filter(([n])=>!(Array.isArray(n)?n.some(x=>names.includes(x)):names.includes(n))).map(x=>x[2]);
 const extra=[];if(names.includes("책임감 있는 근무"))extra.push("오래 남은 시간이 기준이 되면, 시간 안에 끝낸 사람의 기여는 덜 보입니다.");if(names.includes("리더 종합 판단"))extra.push("리더가 직접 보지 못한 구성원의 기여는 설명할 근거가 남지 않습니다.");
 if(!miss.length&&!extra.length)return "";
 return `<div class="happen"><span class="label">확정 전에 한 번 더</span>${miss.length?`이 조합으로는 12월에 <b>${miss.slice(0,3).join(", ")}</b>${miss.length>3?` 등 ${miss.length}가지를`:"을"} 등급의 근거로 설명하기 어렵습니다.`:""}${extra.length?(miss.length?"<br>":"")+extra.join(" "):""}<br><small>맞고 틀림이 아니라, 이 기준으로 누가 보이고 누가 덜 보이는지입니다.</small></div>`;}
SC_KPI=function(s){
 const order=s.cards.map((_,i)=>i).sort(()=>Math.random()-.5),pick=[],link={};
 const keep=()=>pick.forEach(i=>{const b=$("l"+i);if(b)link[i]=b.value;});
 const linkBox=i=>`<div class="task"><label class="label" for="l${i}">② 이 기준이 주로 움직이는 성적표</label><select id="l${i}"><option value="">고르세요</option>${SCORES.map(c=>`<option value="${c}" ${link[i]===c?"selected":""}>${SL(c)}</option>`).join("")}</select></div>`;
 const draw=()=>{paint("");
  const ok=()=>pick.length>=3&&pick.length<=5&&pick.every(i=>$("l"+i)&&$("l"+i).value);
  shell(`<div class="pane"><div class="eyebrow">KPI 합의서 · 두 달 뒤, 3월 첫째 주</div><h2>등급 기여 기준</h2>
  <div class="prose"><p>1월이 지나고 3월 첫째 주, 목표 합의 시즌입니다. 퓨쳐테크의 올해 전략(AI Native 전환, 헬씨푸드 고객 만족)에 맞춰 사업부 목표가 정해졌고, 이제 팀장이 사업부 목표와 이어지는 <b>팀 목표</b>를 세우고, 팀 목표와 이어지는 <b>개인 목표</b>를 리더들과 합의할 차례입니다.</p><p><b>KPI 합의서</b>는 그 합의를 적는 문서입니다. 개인 KPI(숫자 목표) 아래에 <b>등급 기여 기준</b> 칸이 있습니다. KPI를 얼마나 채웠는지 말고 무엇이 S · A · B · C를 가르는지 팀장이 정해 적는 곳입니다. 이 화면에서는 등급 기여 기준을 정하고, 개인 KPI는 이어지는 리더 면담에서 합의합니다.</p>
  <p>전임 팀장은 이 칸에 "종합 판단"이라고만 적었습니다. 작년에 KPI를 다 채우고도 B를 받은 사람들이 "왜 이 등급인지 아무도 설명해 주지 않았다"며 이의를 낸 이유입니다.</p></div>
  <div class="happen"><span class="label">이 결정이 쓰이는 곳</span>여기서 고른 기준은 연말 평가에서 등급의 근거로 쓸 수 있는 <b>유일한 목록</b>이 됩니다. 규칙 ① 공개하지 않은 기준은 근거로 쓸 수 없습니다.</div>
  <ol class="steps"><li><b>등급을 가를 기준을 3~5개 고릅니다.</b> <span class="num">(${pick.length}/3~5)</span></li><li><b>고른 기준마다 주로 움직이는 성적표를 고릅니다.</b> 기준을 누르면 바로 아래에 칸이 열립니다.</li><li>다음 화면에서 이 기준을 <b>팀에 어디까지 알릴지</b> 정합니다.</li><li>그다음 리더 다섯 명 중 <b>누구와 직접 만나 합의할지</b> 고릅니다.</li></ol>
  <div class="sc4"><span class="label">성적표 네 장</span>${SCORES.map(k=>`<div><b>${SL(k)}</b><span>${SC_DEF[k]}</span></div>`).join("")}</div>
  <p class="note">어떤 기준이 좋은지는 화면에 나오지 않습니다. 이 기준으로 평가하면 팀원들이 내일부터 무엇을 더 하고, 무엇을 덜 할지 떠올려 보세요.</p>
  <details class="ref"><summary>참고 카드</summary><p style="margin-top:6px">${s.ref}</p></details>
  <div class="opts">${order.map(i=>{const c=s.cards[i],on=pick.includes(i);return `<button class="opt" style="grid-template-columns:24px minmax(0,1fr)" aria-pressed="${on}" ${A(()=>{keep();const j=pick.indexOf(i);if(j>=0)pick.splice(j,1);else if(pick.length<5)pick.push(i);draw();})}><span class="k">${on?"✓":""}</span><span><b style="font-weight:600">${c.n}</b><span class="note" style="display:block">${c.d}</span></span></button>${on?linkBox(i):""}`}).join("")}</div>
  ${pick.length>=3?kpiGap(s,pick):""}
  <div class="foot"><span class="note num">${pick.length}/3~5</span><button class="btn main" id="kgo" disabled ${A(finish)}>기준 확정</button></div></div>`);
  const up=()=>{$("kgo").disabled=!ok();};pick.forEach(i=>$("l"+i).onchange=up);up();
 };
 const finish=()=>{keep();
  const live={};let hidden=0,bad=0,right=0;G.pub=[];
  pick.forEach(i=>{const c=s.cards[i];applyFx(c.fx,{live});G.f[c.f]=true;G.pub.push(c.n);if(c.hide)hidden++;if(c.bad)bad++;if(c.ok.includes(link[i]))right++;});
  if(has("noticed_prc")&&!has("pub_prevent"))applyFx("prc-3",{live});
  const q=(hidden?30:0)+(bad?0:30)+Math.round(right/pick.length*20);
  G.written.kpi=pick.map(i=>({기준:s.cards[i].n,연결:link[i]}));
  G.goal2=pick.length>=3&&hidden>0&&right===pick.length;G.quality=q;G.kpiChk={n:pick.length,hidden,right};
  record(s.id,G.pub.join(","));
  if(has("pub_prevent")||has("pub_security")||has("pub_support"))ach("보이지 않는 것을 보다");
  SC_CHOICE({id:s.id+"-2",tag:s.tag,when:s.when,title:"어디까지 알릴까요?",intro:[`고른 기준: <b>${G.pub.join(", ")}</b>`,"이 기준을 누구에게, 어디까지 보여 줄지 정합니다. 많이 알릴수록 시간이 들고 따져 묻는 사람이 늘어납니다. 적게 알릴수록 팀원들은 각자 짐작합니다. 기준을 받은 구성원만 연말에 그 기준으로 설명을 들을 수 있습니다."],options:s.levels},{done:(o)=>{
   G.quality+=o.k==="A"?20:o.k==="B"?10:0;
   SC_CHOICE({id:s.id+"-3",tag:s.tag,when:s.when,title:"재검토 조건 (플랜 B)",intro:[
    "방금 정한 등급 기여 기준이 1년 내내 그대로 간다는 보장은 없습니다. 퓨쳐테크의 평가 지침이 바뀌거나 사업 조건이 달라지면, 한 해 중간에 기준을 다시 열어야 할 수 있습니다.",
    "그때 적용되는 것이 규칙 ③입니다. <b>공개한 기준을 바꾸면 다시 알려야 합니다.</b> 알리지 않고 바꾸면 \"말과 행동이 다르다\"는 반발이, 처음부터 기준을 알리지 않았을 때보다 커집니다.",
    "그래서 합의서에 <b>재검토 조건</b>을 한 줄 미리 적어 둘 수 있습니다. 기준이 흔들릴 때를 대비한 플랜 B입니다.",
    "<b>합의서에 적을 문장</b> · \"퓨쳐테크 지침이나 사업 조건이 바뀌면 2주 안에 기준을 다시 검토해 팀 전체에 공지한다.\"",
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
const P0=get("P0");P0.title="헬씨푸드 운영팀 신임 팀장, 첫 1년";
P0.body=["세 번의 라운드 · 라운드마다 약 20분 · 라운드가 끝나면 자동 저장됩니다.","이 시뮬레이션에는 정답 선택지가 없습니다. 좋은 선택에도 대가가 있고, 나쁜 선택이 당장은 통하기도 합니다.","입력한 내용은 교육 목적의 채점에만 쓰이며, 인사 평가와 연결되지 않습니다."];
{const d=get("P1");const seen={};d.items=d.items.filter(it=>{seen[it.a]=(seen[it.a]||0)+1;return seen[it.a]<=2;});d.intro=["지금까지 일해 온 방식대로 답해 주세요. 성격 검사가 아니고, 옳은 답도 없습니다. 8문항입니다."];}
const DOCS=[
 {id:"V3B1",type:"doc",title:"팀과 올해의 조건",html:`<p>퓨쳐테크 헬씨푸드 운영팀. IT 서비스 기업 퓨쳐테크에서 고객사 헬씨푸드(식품업계 1위)의 원료 수입부터 해외 공장 라인, 판촉까지를 받치는 IT 시스템을 운영하는 30명의 팀입니다. 이 시스템이 멈추면 헬씨푸드의 사업이 함께 멈춥니다.</p><p>3년째 인원은 그대로인데 일은 늘었습니다. 헬씨푸드는 올해도 운영비 동결을 요구할 것이고, 퓨쳐테크는 2028년 AI Native 전환을 선언했습니다. 토큰 비용은 팀 손익에 그대로 잡힙니다. 작년 말에는 KPI를 다 채우고도 A를 받지 못한 팀원들이 이의를 제기했습니다. 무엇이 등급을 갈랐는지 아무도 설명해 주지 않았다는 이유였습니다.</p><p>당신은 이 팀에서 5년 넘게 일한 엔지니어였고, 1월 1일부로 팀장이 되었습니다. 어제까지 "선배"라고 부르던 사람이 오늘부터 당신의 팀원입니다.</p>`},
 {id:"V3B2",type:"doc",title:"사람들",html:()=>`<p>모듈 리더 5명은 직책도 평가 권한도 없지만, 30명의 하루는 이들을 통해 움직입니다. 왼쪽 얼굴을 누르면 언제든 이 카드를 다시 볼 수 있습니다. <b>비어 있는 칸은 이야기를 나눠야 채워집니다.</b></p>${typeof profileCards==="function"?profileCards():""}<p>이름을 알게 될 구성원 6명은 메시지와 면담으로, 나머지 팀원들은 게시판과 설문으로 만납니다.</p>`},
 {id:"V3B3",type:"doc",title:"목표, 계기판, 규칙",html:`<p>목표: <b>사람을 더 받지 않고, 1년 뒤 이 팀을 고객과 재무, 구성원과 서비스 안정을 함께 지키는 팀으로 만드는 것.</b></p><p>성적표는 네 장입니다. 균형성과표(BSC)의 네 관점과 같습니다.</p><ul style="margin:6px 0 10px 18px;padding:0"><li><b>고객</b> · 고객 관점의 목표. 헬씨푸드가 우리 서비스에 만족하는가, 약속한 서비스 수준과 과제를 지켰는가 (하위 지표: 헬씨푸드 만족도)</li><li><b>재무</b> · 팀 손익. 운영비, 추가 과제 매출, 토큰 비용. 매출은 여기서만 셉니다</li><li><b>구성원</b> · 팀원 30명 전체의 몰입과 목소리 (하위 지표: 팀 발언량). 리더 한 사람과의 관계는 따로 리더 신뢰로 봅니다</li><li><b>서비스 안정</b> · 시스템 가용성, 장애, 보안. 조직이 조용한지는 여기에 들어가지 않습니다</li></ul><p>네 장은 이어져 있습니다. 구성원이 지치면 서비스가 흔들리고, 서비스가 흔들리면 고객이 떠나고, 고객이 떠나면 손익이 나빠집니다. 결정하면 바로 움직이는 숫자도 있고, 몇 달 뒤에 움직이는 숫자도 있습니다. </p><p><b>세 가지 자원</b>은 위쪽 막대에 늘 보입니다. 다 챙길 수는 없습니다.</p><ul style="margin:6px 0 10px 18px;padding:0"><li><b>⏳ 팀장 시간</b> · 당신 한 사람의 시간. 설명, 면담, 직접 처리에 듭니다</li><li><b>💳 토큰</b> · AI 도구를 쓸 때 드는 비용. 팀 손익에 잡힙니다</li><li><b>👥 팀 여력</b> · AI 전환으로 반복 업무가 줄면서 팀원들에게 생긴 여유 시간. 사람이 늘어난 것이 아니라 같은 30명이 덜어 낸 일만큼 생긴 손입니다. 10칸으로 나타내고, 4월에 운영 · AI 전환 · 추가 제안 · 예방·보안에 나눕니다. 위쪽 막대의 '팀 여력'을 누르면 언제든 설명을 다시 볼 수 있습니다</li></ul><p><b>이 세계의 규칙 세 가지</b><br>1. 공개하지 않은 기준은 결정의 근거로 쓸 수 없습니다.<br>2. 설명하지 않은 결정은 소문이 됩니다.<br>3. 공개한 기준을 바꾸면 다시 알려야 합니다.</p><p><b>넘어서는 안 되는 선</b>은 장애 절차, 보안(고객 데이터), 현장 안전입니다. 벗어나면 다른 점수와 관계없이 기준 미달입니다. 설비 안전장치(인터록)의 해제·우회는 현장 안전 책임자와 고객사의 승인 없이 할 수 없습니다.</p><p>선택지마다 <span style="color:var(--good)">▲ 얻는 것</span>과 <span style="color:var(--bad)">▼ 내주는 것</span>이 적혀 있습니다. 방향만 알려 줍니다. 크기와 시점은 알려 주지 않습니다.</p>`,btn:"임명장 받으러 가기"}];
if(typeof RULES!=="undefined"&&Array.isArray(RULES))RULES.push("안전: 설비 안전장치(인터록)의 해제·우회는 현장 안전 책임자와 고객사의 승인 없이 할 수 없습니다.");

/* ---------- 라운드 게이트 (02-1 공통 틀) ---------- */
/* 라운드 시작 코드는 2026-11-21에 없앴다. 게이트는 이론 상기 카드 → 스타일 순서만 남는다 */
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
 G.rs=G.rs||{};G.rs[r]={score:{...G.score},fsat:G.fsat,trust:{...G.trust},safe:G.safe,sig:G.sig.length,dec:G.decisions.length,tok0:G.roundTok[r]||0,t0:Date.now(),fx0:(G.fxLog||[]).length,cons0:(G.cons||[]).length,ds0:{f:(G.ds||{}).f||0,p:(G.ds||{}).p||0},md:(window.workload?{s:{...((G.mod||{}).s||{})},w:Object.fromEntries(Object.keys(LD).map(k=>[k,workload(k)]))}:null),voice0:window.voice?voice():null};
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
  if(step==="code"){shell(`<div class="pane gate gate-r${r}"><div class="eyebrow">Round ${r}</div><h2>Round ${r} 시작</h2><div class="prose"><p>${r===1?"방금 들은 강의의 핵심을 이론 상기 카드로 한 번 더 보고 시작합니다.":"오늘 강의의 핵심을 이론 상기 카드로 한 번 더 보고 시작합니다. 지난 라운드의 진행은 이 브라우저에 저장되어 있습니다."}</p></div>${err?`<p class="note" style="color:var(--bad)">${err}</p>`:""}
   <details class="ref" style="margin-top:6px"><summary>다른 기기·브라우저에서 이어하기 (복원 코드 붙여넣기)</summary><div style="margin-top:8px;display:grid;gap:6px"><input id="rest_in" placeholder="IT3-SAVE-..." style="font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);width:100%"><div class="btns"><button class="btn" ${A(()=>{const v=$("rest_in")&&$("rest_in").value.trim();if(window.v3LoadSaveCode&&window.v3LoadSaveCode(v)){toast("이전 라운드 진행 상태를 복원했습니다.");render();}else{err="복원 코드가 올바르지 않습니다.";draw();}})}>상태 복원하기</button></div></div></details>
   <div class="foot"><button class="btn" title="강사 없이 혼자 할 때: 성적표에 피드백 세션을 대신하는 해설이 붙습니다" ${A(()=>{step="solo";draw();})}>혼자 진행 (해설 포함)</button><button class="btn main" ${A(()=>{G.timeMode=undefined;open();})}>시작하기</button></div></div>`);return;}
  if(step==="solo"){const TM=[["std","표준","받은편지함 제한 시간 그대로 진행합니다. 강의실 진행과 같습니다."],["plus","넉넉히 (+50%)","받은편지함 제한 시간을 1.5배로 늘립니다."],["free","제한 없음","시간이 끝나지 않습니다. 시간 초과로 보류되는 메시지가 없습니다."]];const cur=G.timeMode||"std";
   shell(`<div class="pane gate gate-r${r}"><div class="eyebrow">Round ${r} · 혼자 진행</div><h2>받은편지함 시간을 정하세요</h2><div class="prose"><p>혼자 진행하면 성적표에 피드백 세션을 대신하는 해설이 붙습니다. 처음이라 시간에 쫓기기 싫다면 받은편지함 시간을 늘릴 수 있습니다.</p></div><div class="opts">${TM.map((x,i)=>`<button class="opt" aria-pressed="${cur===x[0]}" ${A(()=>{G.timeMode=x[0];draw();})}><span class="k">${"ABC"[i]}</span><span><b>${x[1]}</b> · ${x[2]}</span></button>`).join("")}</div><p class="note">점수를 계산하는 방식은 같습니다. 다만 시간을 늘리거나 없애면 시간 초과 보류가 줄어 결과가 표준과 달라집니다. 결과 코드에 진행 방식이 함께 남고, 강사 집계에서는 따로 셉니다.</p><div class="foot"><button class="btn" ${A(()=>{step="code";draw();})}>← 돌아가기</button><button class="btn main" ${A(()=>{G.selfStudy=true;if(G.timeMode==="std")G.timeMode=undefined;open();})}>이대로 시작</button></div></div>`);return;}
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
 const pick=[];const bor0=G.borrowed||0; /* 3단계: 이 장면에서 야근으로 빌린 시간을 결정 기록에 함께 남긴다 */
 const draw=()=>{paint("");const cost=pick.length*2,short=cost>G.time;
  shell(`<div class="pane">${head(s)}<div class="prose"><p>리더 다섯 명과 KPI를 합의해야 합니다. 직접 만나 이야기할 사람을 고르세요. <b>한 사람당 ⏳2, 최대 3명.</b> 만나지 않은 리더에게는 합의서 초안을 문서로 보냅니다.</p><p class="note kpi-docnote">만나지 못한 리더는 자기 방식대로 KPI를 써 옵니다. 그 결과도 성적표에 남습니다.</p></div>
  <div class="grid2">${Object.keys(LD).map(k=>{const on=pick.includes(k);return `<button class="person" aria-pressed="${on}" ${A(()=>{const i=pick.indexOf(k);if(i>=0)pick.splice(i,1);else if(pick.length<3)pick.push(k);draw();})}>${face(k,G.trust[k])}<span><b>${name(k)}</b><small>${on?"만나서 합의 · ⏳2":LD[k].m+" · 만나면 알 수 있는 것: 중요하게 여기는 것, 지금 걱정"}</small></span></button>`;}).join("")}</div>
  ${short?`<p class="note">${lackText(cost-G.time)}</p>${borrowLink(cost-G.time,draw)}`:""}
  <div class="foot"><span class="note num">${pick.length}/3 · ⏳${cost}</span><button class="btn main" ${short?"disabled":""} ${A(()=>{
   G.time-=cost;G.tu.all+=cost;G.tu.meet+=cost;G.kpiMeet=pick.slice();G.kpiDoc=Object.keys(LD).filter(k=>!pick.includes(k));
   pick.forEach(k=>{G.f["talk_"+k]=true;(G.known=G.known||{})[k]=Object.assign(G.known[k]||{},{가치:1,걱정1:1});});
   G.kpiDoc.forEach(k=>{const sc=get(KPI_SCENE[k]),o=sc.options.find(x=>x.k===KPI_WANT[k]);
    const fx=String(val(o.fx)||"").split(/\s+/).filter(t=>t&&!/^(rd|src|mfg|prc|mkt)[+-]/.test(t)).join(" ");applyFx(fx);applySig(val(o.sig),1,sc.id,o.k+"(문서)");
    G.f["c_"+sc.id+"_"+o.k]=true;G.f["kpi_doc_"+k]=true;record(sc.id,o.k,{doc:true});});
   record(s.id,pick.join(","),{cost,bor:Math.max(0,(G.borrowed||0)-bor0)});if(pick.length<=1)applyFx("B3+15");next();})}>정했습니다</button></div></div>`);
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
 const m22=pick("M22");Object.assign(m22,{t:"CALL",from:"📞 헬씨푸드 담당 임원",sub:"전화가 옵니다",noDel:true,
  body:"\"제안서 부록에 주 140시간 절감이라고 돼 있더군요. 그 효율이면 운영비 이야기를 해야겠습니다. 다음 주 미팅 때 숫자 들고 오세요.\"",
  self:o=>o.M21?R3("\"140은 추정치이고 확인된 건 38시간입니다\"라고 덧붙였습니다.","헬씨푸드만족-1 `f_corrected`","④L"):R3("숫자를 확인해 미팅 때 말씀드리겠다고 했습니다. 임원이 \"140 맞죠?\"라고 다시 물었습니다.","`f_140`","④L"),
  hold:R3("부재중 1건.","헬씨푸드만족-2 `f_140` `call_f_miss`","④P")});
 REPLIES.M22=[{t:"받는다: \"숫자를 확인해서 미팅 때 정확히 말씀드리겠습니다.\"",self:true},
  {t:"받는다: \"네, 성과가 좋았습니다. 미팅 때 뵙겠습니다.\"",r:R3("임원: \"기대하겠습니다.\"","헬씨푸드만족+1 `f_140`")},
  {t:"거절하고 메시지: \"회의 중, 오후에 연락드리겠습니다.\"",r:R3("메시지를 남겼습니다.","`f_140`","④L"),d:false}];
 const m37={id:"M37b",t:"DM",from:"이수진",at:"09:02",need:17,sub:"장애 공로 후보 얘기요",unsent:"이수진은 장애 공로 후보에서 가공이 빠진 일을 물어보려다 보내지 않았습니다.",
  body:"본사 \"장애 대응 우수\" 후보에 생산만 올라간다고 들었어요. 그 전 8개월을 막은 건 저희인데요. 제가 예민한 건지 여쭤보려고요.",
  self:R3("\"이번 주에 따로 만나 자세히 듣자\"고 답했습니다.","prc+2 `prc_preheard`","④L"),to:{mfg:R3("강태식에게 의견을 물었습니다. 보낸 사람이 드러났습니다.","mfg+1 prc-3 안전-2","①L")},other:R3("다른 리더에게 전달했습니다.","prc-2"),hold:R3("답하지 않았습니다.","prc-2")};
 const m39=Object.assign({},s7.mail.find(m=>m.id==="M39"),{need:50,at:"08:27",unsent:"김 사원은 근태가 찍히지 않게 집에서 야간 경고를 보고 있다고 말하려다 보내지 않았습니다.",
  body:"대기표에서는 빠졌다고 되어 있는데요, 경고 오면 아직 집에서 봐요. 근태는 안 찍히게요. 저만 그런 건 아닌 것 같아요. 제가 말했다고는 안 해 주셨으면 해요."});
 const m41=Object.assign({},s7.mail.find(m=>m.id==="M41"),{need:84,at:"09:15"});
 s.mail=[pick("M21"),m22,pick("M24"),pick("M25"),m39,pick("M26"),m37,m41]; /* D-1: M39를 앞으로 (도착 조건은 그대로) */
 /* B-7: 장애 공로 메시지는 원래 M37(7월 실적 보고서 초안)과 id가 겹쳐 답장 선택지가 지워졌다. M37b로 분리하고 선택지 3개를 둔다 (2026-11-25 병준님 확정) */
 REPLIES.M37b=[{t:"\"이번 주에 따로 만나 자세히 듣자\"고 답한다.",self:true},
  {t:"추천은 아직 정해지지 않았으니, 8개월 예방 기록을 정리해 보내 달라고 한다.",r:R3("이수진: \"오늘 안에 정리해서 보낼게요.\" 5월 추천 때 쓸 근거가 생겼습니다.","prc+3 `prc_record`","②L")},
  {t:"공로 후보는 본사가 정하는 일이라 팀에서 할 수 있는 게 없다고 답한다.",r:R3("이수진: \"네, 알겠습니다.\" 더 묻지 않았습니다.","prc-3","④P")}];
}

/* ---------- R2-6 구성원 장면 하나 (03-3) ---------- */
const kimCase=g=>g.over>0||!!g.f.night_seen||!!g.f.kim_no_leave||!!g.f.kim_waited||(g.cells&&g.cells.RUN<=1);
get("6-3").skip=g=>!kimCase(g);get("4-4").skip=g=>kimCase(g);

/* ---------- R3-1 새벽 3시 · 라인 안전 인터록 (03-4) ---------- */
const R31a={id:"R3-1a",type:"choice",month:10,when:"10월 · 새벽 3시",tag:"강태식",title:"새벽 3시",rel:"mfg",enter:"안정-2 헬씨푸드만족-1",
 ref:"장애 · 안전 절차: 1등급 장애는 지휘자 1인을 지정한다. 운영 변경은 긴급 승인자의 확인을 거친다. 고객 통지는 인지 후 30분 안에 한다. 설비 안전장치(인터록)의 해제·우회는 현장 안전 책임자와 고객사의 승인 없이 할 수 없다.",
 conds:[{c:g=>g.trust.mfg>=50,t:"📞 03:04 강태식: \"해외 공장 3번 라인 인터록 센서 값이 시스템 기록이랑 안 맞아. 현장은 센서 오작동 같다고 우회하고 돌리자는데, 납기가 내일 아침이야. 네가 판단해 줘.\""},
  {c:g=>g.trust.mfg<50,t:"03:41 모니터링 알림이 먼저 울린다. 03:52 📞 문지원: \"강태식 선배가 현장이랑 인터록 우회 얘기를 하고 있어요. 팀장님께 연락했다는 얘기는 못 들었는데요.\""},
  {c:g=>g.f.kim_manual,t:"김 사원의 야간 경고 규칙 덕에 이상 구간이 3번 라인 한 곳으로 좁혀졌다."},
  {c:g=>g.f.night_seen,t:"이 경고는 지난주에도 두 번 떴다. 근태 밖에서 본 사람이 있었다."},
  {c:g=>g.f.oh_script,t:"오 사원: \"우회 스크립트는 제가 제일 잘 알아요. 5분이면 돼요.\""},
  {c:g=>g.f.mfg_mentor,t:"1월부터 생산 구조를 배웠다. 센서 체계를 대강 안다."}],
 ask:"누가 지휘할까요?",
 options:[
  {k:"A",t:"강태식을 지휘자로 지정하고, 나는 헬씨푸드 통지와 위쪽 보고를 맡는다.",gl:["현장을 아는 사람이 지휘함","내가 직접 상황을 다 보지는 못함"],done:"강태식을 지휘자로 지정했습니다. 당신은 헬씨푸드 통지를 맡았습니다.",fx:"`inc_proc` mfg+3",sig:"①L",tw:[{p:g=>g.trust.mfg<50?60:35,t:"현장 보고가 끊겨 헬씨푸드 통지가 늦어졌습니다.",fx:"헬씨푸드만족-3 mfg-2"}]},
  {k:"B",t:"원격으로 들어가 AI 센서 로그 교차검증을 돌리면서, 판단과 지시를 내가 직접 내린다.",cost:1,tok:25,gl:["내 눈으로 확인하고 빠르게 지시함","현장 리더의 역할이 비어 버림"],done:"원격으로 접속해 직접 지시를 내렸습니다.",fx:"`inc_direct` mfg-4 안정+1",sig:"①P",tw:[{p:g=>g.f.mfg_mentor?30:40,t:"모르는 설정을 건드려 옆 라인 모니터링이 끊겼습니다.",fx:"안정-4"}]}]};
const R31b={id:"R3-1b",type:"choice",month:10,when:"10월 · 새벽 3시 20분",tag:"현장 안전",title:"3번 라인을 어떻게 할까요?",rel:"mfg",
 intro:["현장은 센서 오작동 같다고 합니다. 납기는 내일 아침입니다. 세우면 고객이 반발하고, 돌리면 혹시 모를 위험이 남습니다."],
 conds:[{c:g=>cell(g,"SEC")>=3,t:"예방 칸 인력이 센서 이력을 바로 뽑을 수 있다."},{c:g=>cell(g,"RUN")<=1,t:"야간 당번이 혼자다."}],
 options:[
  {k:"A",t:"3번 라인을 세우자고 권고하고, 센서 원인을 절차대로 확인한 뒤 재가동한다.",gl:["혹시 모를 사고를 확실히 막음","납기를 놓치고 고객이 크게 반발함"],done:"라인을 세웠습니다. 원인을 절차대로 확인했습니다.",fx:"`line_stop` 안정+3 헬씨푸드만족-3 성과-2 src+2 안전+2",sig:"③L ④L",
   tw:[{p:40,t:"센서가 아니라 실제 가드 결함이었습니다. 멈추지 않았다면 끼임 사고가 날 자리였습니다. 다음 날 헬씨푸드 공장장이 \"멈춰 줘서 고맙습니다\"라고 했습니다.",fx:"`near_miss_saved` 안정+3 안전+3 헬씨푸드만족+3"},{p:30,who:"mfg",t:"강태식: \"거봐, 센서라니까.\" 8시간을 잃었습니다.",fx:"헬씨푸드만족-2 mfg-2"}]},
  {k:"B",t:"이상 신호가 난 구간만 세우고, 나머지 구간은 감시를 붙여 계속 돌린다.",gl:["납기 손실을 줄이며 위험 구간은 막음","같은 센서를 쓰는 옆 구간이 남음"],done:"이상 구간만 세우고 나머지는 감시를 붙여 돌렸습니다.",fx:"`line_partial` 안정+1 헬씨푸드만족-1 성과-1",sig:"③L",
   tw:[{p:30,t:"옆 구간에서 같은 센서 이상이 났습니다. 작업자가 손을 뺀 직후 기계가 움직였습니다. 아차 사고였습니다. 이수진: \"그 구간 옆도 같은 센서예요.\"",fx:"`near_miss` 안정-4 안전-3 prc+2"},{p:30,t:"이상 구간만으로 원인이 잡혔습니다.",fx:"헬씨푸드만족+2 성과+1"}]},
  {k:"C",t:"현장 판단대로 인터록을 우회하고, 변경 승인은 아침에 사후로 받는다.",gl:["납기를 지키고 현장의 판단을 존중함","안전 승인 절차를 건너뜀"],done:"인터록을 우회했습니다. 라인이 다시 돌았습니다.",fx:"`safety_breach` 헬씨푸드만족+3 성과+2 mfg+2",sig:"③P ①P",
   tw:[{p:30,t:"우회 직후 끼임 아차 사고가 났습니다. 다친 사람은 없었습니다. 헬씨푸드 공장장이 항의 전화를 걸어 왔습니다.",fx:"`near_miss` 안정-6 안전-5 헬씨푸드만족-6"},{p:30,t:"사후 감사에서 드러났습니다.",fx:"안정-8 헬씨푸드만족-4 src-4"},{p:40,t:"아침 승인은 조용히 처리됐습니다. 더 묻는 사람은 없었습니다.",fx:""}]}],
 mods:[{c:g=>cell(g,"RUN")<=1,o:"B",i:0,d:15}],
 xfx:[{c:g=>g.f.kim_manual,o:"ABC",fx:"안정+2"}],
 tail:g=>{if(g.trust.mfg>=50){g.f.mfg_ally=true;return{who:"mfg",t:(g.f.near_miss_saved?"어젯밤 세운 거, 맞았어. ":"")+"1월에 축하한다고 했을 때, 진심 반이었어. 지금은 좀 더 돼."};}g.f.mfg_exit=true;return{who:"src",t:"강태식 선배 자리가 비어 있네요. 이력서 얘기는 저한테 듣지 마시죠."};}};
{const s=get("9-4");s.title="헬씨푸드 임원 전화";s.when="10월 · 아침 8시 30분";
 s.intro=["📞 \"오늘 새벽 일, 들었습니다. 상반기 가용성도 저희가 다시 계산해 보니 99.4%가 아니라 98.7%더군요. 계약의 전제가 달라졌습니다. 조건을 다시 봐야겠습니다.\""];
 s.conds=(s.conds||[]).concat([{c:g=>g.f.near_miss_saved,t:"임원: \"공장장은 멈춰 줘서 고맙다고 하더군요. 그건 그거고요.\""},{c:g=>g.f.near_miss&&!g.f.near_miss_saved,t:"임원: \"아차 사고 보고서부터 보내 주세요.\""}]);
 const pre=s.enter;s.enter=g=>{let f=val(pre)||"";if(g.f.near_miss_saved)f+=" 헬씨푸드만족+1";if(g.f.near_miss&&!g.f.near_miss_saved)f+=" 헬씨푸드만족-2";if(g.f.sec_unknown)f+=" 헬씨푸드만족-3 안정-2";return f;};}

/* ---------- 청구서 슬롯 (02-3 G) ---------- */
const S1={id:"S1",type:"bills",month:9,when:"3분기 말",pool:["B1","B5","B7","B8"],max:2};
const S2={id:"S2",type:"bills",month:12,when:"평가 직전",pool:["B1","B3","B4","B5","B6","B7","B8","B10","B11"],max:2,wow:true};
/* 12월 · 떠나겠다는 사람들 (2026-11-26 병준님 확정: 팀 전체 30명을 숫자로 · 기준선을 넘으면 반드시 · 점수에도 작게 · 떠나는 날은 내년 1월이라 연말 평가 인원은 그대로)
   기준선
   - 12월 펄스 '이 팀에서 계속 일하고 싶다'(QS["12-1"] 셋째 값): 55 이상 0명 · 45~54 1명 · 35~44 2명 · 35 미만 3명 (팀 전체)
   - 모듈 리더 신뢰: 20 이하면 그 모듈에서 2명 · 21~30이면 1명
   - 12월 청구서 '보이지 않는 기여의 이탈'(B4)이 왔으면 가공 모듈 최소 1명 (청구서의 그 사람으로 셈)
   - 병가: 모듈 스트레스 80 이상(지금 또는 4분기에 넘긴 적) 모듈마다 1명 · 청구서 '초과 부하 번아웃'(B7)이 왔으면 1명
   - 떠남은 6명까지, 한 모듈 4명까지
   - 점수: 떠남 1명당 구성원 -1(최대 -4) · 떠남 2명당 서비스 안정 -1(최대 -2) · 병가 1명당 서비스 안정 -1(최대 -2)
   난수를 쓰지 않는다. 같은 상태면 같은 결과 */
const S3={id:"S3",type:"exodus",month:12,when:"평가 직전",title:"떠나겠다는 사람들"};
window.EXODUS_RULE={stay:[[55,0],[45,1],[35,2],[-1,3]],trust:[[20,2],[30,1]],stress:80,maxOut:6,maxMod:4};
window.exodusCalc=function(g){
 const LK=Object.keys(LD),R=EXODUS_RULE;let S=null;try{S=Math.round(QS["12-1"](Object.assign({},g))[2]);}catch(e){S=Math.round(g.score.사람*.6+g.safe*.4);}
 const mods={};LK.forEach(k=>mods[k]={out:0,sick:0});const rows=[];
 const stayN=(R.stay.find(([t])=>S>=t)||[0,0])[1];
 LK.forEach(k=>{const T=g.trust[k];const n=T<=R.trust[0][0]?R.trust[0][1]:T<=R.trust[1][0]?R.trust[1][1]:0;if(n){mods[k].out+=n;rows.push({kind:"trust",k,n,v:T,t:`${LD[k].m} 모듈 · ${LD[k].n} 리더 신뢰 ${T}`,lim:T<=R.trust[0][0]?"20 이하":"30 이하"});}});
 if((g.bills||[]).includes("B4")&&mods.prc.out<1){mods.prc.out=1;rows.push({kind:"b4",k:"prc",n:1,t:"가공 모듈 · 12월 청구서 '보이지 않는 기여의 이탈'",lim:"청구서"});}
 if(stayN){const order=LK.slice().sort((a,b)=>(g.trust[a]-g.trust[b])||(((g.mod&&g.mod.s)||{})[b]||0)-(((g.mod&&g.mod.s)||{})[a]||0));let left=stayN;let i=0;const hit={};
  while(left>0&&i<40){const k=order[i%order.length];if(mods[k].out<R.maxMod){mods[k].out++;hit[k]=(hit[k]||0)+1;left--;}i++;}
  rows.push({kind:"stay",n:stayN,v:S,t:`팀 전체 · '이 팀에서 계속 일하고 싶다' ${S}`,lim:S>=45?"55 미만":S>=35?"45 미만":"35 미만",to:hit});}
 const st=(g.mod&&g.mod.s)||{},s80=g.str80||{};
 LK.forEach(k=>{if((st[k]||0)>=R.stress||s80[k+"3"]){mods[k].sick++;rows.push({kind:"stress",k,n:1,v:st[k]||0,t:`${LD[k].m} 모듈 · 스트레스 ${st[k]||0}`,lim:"80 이상"});}});
 if((g.bills||[]).includes("B7")){const k=LK.slice().sort((a,b)=>(st[b]||0)-(st[a]||0))[0];mods[k].sick++;rows.push({kind:"b7",k,n:1,t:"청구서 '초과 부하 번아웃'",lim:"청구서"});}
 let n=LK.reduce((a,k)=>a+mods[k].out,0);if(n>R.maxOut){const raw=n;let over=n-R.maxOut;LK.slice().sort((a,b)=>mods[b].out-mods[a].out).forEach(k=>{while(over>0&&mods[k].out>1){mods[k].out--;over--;}});n=R.maxOut;rows.push({kind:"cap",n:raw,t:`기준선대로면 ${raw}명이지만, 한 해에 떠나는 사람은 ${R.maxOut}명까지로 셈했습니다`,lim:"상한"});}
 const sick=LK.reduce((a,k)=>a+mods[k].sick,0);
 const dP=Math.min(4,n),dS=Math.min(2,Math.floor(n/2))+Math.min(2,sick);
 const fx=[dP?"사람-"+dP:"",dS?"안정-"+dS:""].filter(Boolean).join(" ");
 return {n,sick,S,mods,rows,fx,dP,dS,trust:{...g.trust}};
};
SCENES.exodus=function(s){
 if(!G.exodus){const x=exodusCalc(G);G.exodus=x;if(x.fx)applyFx(x.fx+" `exodus_"+Math.min(9,x.n)+"`");}
 const x=G.exodus;if(!x.n&&!x.sick){next();return;}
 paint("");if(typeof beep==="function")beep(180,.2,"sine");
 const html=window.exodusHtml?exodusHtml(x,{scene:true}):`<p>${x.n}명이 떠납니다.</p>`;
 shell(`<div class="pane"><div class="eyebrow">12월 · 인사시스템 알림</div><h2>내년 1월, 팀을 떠나겠다는 사람이 ${x.n}명입니다${x.sick?` · 병가 ${x.sick}명`:""}</h2><div class="prose"><p>연말 평가를 앞두고 인사팀이 퇴직·전보 신청과 병가 현황을 보내왔습니다. 이름은 공개되지 않습니다. 떠나는 날은 내년 1월이라 이번 연말 평가 대상은 그대로입니다.</p></div>${html}<div class="foot"><span></span><button class="btn main" ${A(next)}>다음</button></div></div>`);
};

/* ---------- 연말 평가 7명 · 평가 결과는 팀 공지 하나 (03-4) ---------- */
{const V3_EVAL_R={
 rd:[["AI 시범 결과 분기 보고",null,["AI 활용 효과"]],["3월 승인 안 된 외부 AI 사용",null,["보안 준수"]],["운영 인수인계 지표 수용","c_3-2_A",["AI 활용 효과","동료 지원과 온보딩"]],["보안 건 사실 확인 및 재발 방지 협조","v3_rd_sec",["보안 준수","장애 예방 활동"]],["AI 전환 과업 완수","v3_rd_ai",["AI 활용 효과","추가 과제 매출 기여"]],["작년 과제 취소 사정",null,[],1]],
 src:[["3월 승인 안 된 도구 정황 제보",null,["보안 준수"]],["감사 대응 및 계약 검토",null,["보안 준수"]],["조달 전환 교육·단계적 자동화 합의","v3_src_auto",["AI 활용 효과","동료 지원과 온보딩"]],["새벽 라인 우회 위험 사전 제보","v3_src_alert",["장애 예방 활동","보안 준수"]],["본부 차출 시 핵심 인력 보호 협조","v3_src_hq",["동료 지원과 온보딩"]]],
 mfg:[["상반기 장애 복구 3시간 40분",null,["장애 복구 기여"]],["10월 새벽 3시 현장 지휘","v3_mfg_cmd",["장애 복구 기여","보안 준수"]],["생산 구조 인수 및 야간 대기 재설계","v3_mfg_ally",["동료 지원과 온보딩","장애 예방 활동"]],["가공 모듈과 예방·복구 기록 공유","c_5-4_B",["장애 예방 활동","동료 지원과 온보딩"]],["야간에 가장 오래 있었음",null,[],1],["팀장 후보였음",null,[],1],["이력서 소문","mfg_exit",[],1]],
 prc:[["재발 없는 8개월 예방 점검",null,["장애 예방 활동"]],["정기 점검 및 인터록 이력 관리",null,["장애 예방 활동"]],["예방의 질 평가 기준 정립","v3_prc_kpi",["장애 예방 활동","동료 지원과 온보딩"]],["장애 공로에서 예방 기여 공동 인정","c_5-4_B",["장애 예방 활동"]],["3번 라인 아차 사고 원인 규명","v3_prc_near",["장애 예방 활동","보안 준수"]],["예전 동료였음",null,[],1]],
 mkt:[["헬씨푸드 제안 및 계약 대응",null,["추가 과제 매출 기여"]],["헬씨푸드 임원 커뮤니케이션",null,["고객 칭찬"]],["하반기 우선 협상권·신규 과제 확보","v3_mkt_win",["추가 과제 매출 기여","고객 칭찬"]],["제안서 실무 작성자 기여 명기","v3_mkt_credit",["동료 지원과 온보딩"]],["한 선임에게 발표 기회 부여","v3_mkt_han",["동료 지원과 온보딩"]],["임원이 좋아함",null,g=>g.f.pub_praise?["고객 칭찬"]:[],g=>!g.f.pub_praise],["표지 관행",null,[],1]],
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
 const ch={};["M08","1-5","3-1","R1-pick","3-8","4-5","6-1","5-4","8-1a","R3-1a","R3-1b","9-4","6-4b","12-3a"].forEach(id=>{const c=lastChoice(id);if(c!=null)ch[id]=String(c).slice(0,12);});
 if(G.f.pub_full)ch.pub="A";else if(G.f.pub_items)ch.pub="B";else if(G.f.pub_leaders)ch.pub="C";
 if(G.cells)ch.cells=["RUN","AI","GROW","SEC"].map(k=>G.cells[k]||0).join("");
 const o={v:3,r,nick:G.nick||"",style:G.style||"bal",ch,kpi:[G.score.성과,G.score.재무,G.score.사람,G.score.안정,G.fsat],ax:{self:G.diag||null,act:axRange(0)},g2:G.goal2,ib:(()=>{const st=(G.rs||{})[r]||{},nx=(G.rs||{})[r+1];const ms=(G.decisions||[]).slice(st.dec||0,nx?nx.dec:undefined).filter(x=>/^M\d+/.test(x.scene)).map(x=>String(x.choice).split(":")[0]);const n=k=>ms.filter(x=>x===k).length;const ds=(nx&&nx.ds0)||G.ds||{},d0=st.ds0||{};return [n("직접")+n("답장"),n("위임"),Math.max(0,(ds.f||0)-(d0.f||0)),n("코칭"),n("보류")+n("시간 초과(보류)")+n("시간 초과(미결)")];})(),m39:r>=2?(G.f.got_M39?1:0):undefined,rb:window.v3RubricN?v3RubricN(r):undefined,rv:2,tk:[(G.roundTok&&G.roundTok[r])||0,G.tokenCap||40],ud:(G.undo&&G.undo.n&&G.undo.n[r])||0,vb:(window.violationsOf?violationsOf(r).length:0),timeMode:(G.timeMode&&G.timeMode!=="std")?G.timeMode:undefined,k0:(()=>{const s0=((G.rs||{})[r]||{}).score;return s0?[s0.성과??50,s0.안정??50]:undefined;})(),t:Math.round((Date.now()-((G.rs||{})[r]||{}).t0)/1000)||0};
 const b=btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
 let h=0;for(const c of b)h=(h*31+c.charCodeAt(0))>>>0;return `IT3-R${r}-${b}-${(h%65536).toString(16).padStart(4,"0")}`;
}
window.v3ResultCode=resultCode;
SCENES.roundEnd=function(s){
 const r=s.round,st=(G.rs||{})[r]||{score:{},trust:{}};
 const LKS=Object.keys(LD);
 const sg=x=>(x>0?"+":"")+x;
 const col=x=>x>0?"var(--good)":x<0?"var(--bad)":"var(--muted)";
 const dl=(a,b)=>`<span class="note" style="color:${col(a-b)}">${sg(a-b)}</span>`;
 const d=(a,b)=>`${b} → <b>${a}</b> ${dl(a,b)}`;
 const AR=x=>{let v=x;try{v=typeof x==="function"?x(G):x;}catch(e){v=null;}return Array.isArray(v)?v:[];};
 const strip=t=>{let v=t;try{v=typeof t==="function"?t(G):t;}catch(e){v="";}return String(v??"").replace(/<[^>]+>/g,"");};
 const ax=axRange(st.sig||0),axAll=axRange(0);
 const ev=(G.sig||[]).slice(st.sig||0).filter(x=>!x.forced);
 const nameOf=id=>{const sc=byId[id]||CONTENT.find(x=>x.id===id);if(sc)return (window.SC_NICK&&SC_NICK[id])||noNum(strip(sc.title)||sc.tag||id);const m=typeof mailOf==="function"?mailOf(id):null;return m&&m.m&&m.m.sub?"받은편지함 · "+(m.m.sub==="(제목 없음)"?(m.m.from||"")+" 메일 (제목 없음)":m.m.sub):((window.SC_NICK&&SC_NICK[id])||id);};
 const optsOf=sc=>{if(!sc)return [];return [...AR(sc.options),...AR(sc.levels),...AR(sc.planb),...AR(sc.cases).flatMap(c=>AR(c&&c.options))];};
 const chT=(id,c0)=>{const doc=/\(문서\)$/.test(String(c0)),c=String(c0).replace(/\(문서\)$/,"");const EX={"4-2b":{A:((G.roundTok||{})[1]||0)>0?"1분기에 쓴 양대로 토큰을 나눠 준다":"리더들이 요청한 양대로 토큰을 나눠 준다",B:"토큰당 기대 효과가 큰 모듈부터 배정한다",C:"다섯 모듈에 똑같이 나눈다"}};const o=optsOf(byId[id]||CONTENT.find(x=>x.id===id)).find(x=>x&&x.k===c);const t=EX[id]&&EX[id][c]?EX[id][c]:o?strip(o.t):String(c);return (t.length>46?t.slice(0,46)+"…":t)+(doc?" · 만나지 않은 결과(리더가 문서로 써 온 안, 습관 기록에는 포함)":"");};
 /* 이번 라운드의 효과 기록 */
 const log=(G.fxLog||[]).slice(st.fx0||0);
 const sumLog=f=>{const o={d:{},tr:{},wl:{}};log.filter(f).forEach(e=>{for(const k in e.d||{})o.d[k]=(o.d[k]||0)+e.d[k];for(const k in e.tr||{})o.tr[k]=(o.tr[k]||0)+e.tr[k];for(const k in e.wl||{})o.wl[k]=(o.wl[k]||0)+e.wl[k];});return o;};
 const KL={성과:"고객",재무:"재무",사람:"구성원",안정:"서비스 안정",F:"헬씨푸드 만족"};
 const chips=(o,opt)=>{opt=opt||{};const out=[];["성과","재무","사람","안정","F"].forEach(k=>{const v=(o.d||{})[k];if(v)out.push([KL[k],v,v>0]);});LKS.forEach(k=>{const v=(o.tr||{})[k];if(v)out.push([LD[k].n+" 신뢰",v,v>0]);});LKS.forEach(k=>{const v=(o.wl||{})[k];if(v)out.push([LD[k].m+" 업무량",v,v<0]);});
  if(!out.length)return `<span class="note">${opt.empty||"눈에 띄는 변화 없음"}</span>`;return out.map(x=>`<span class="chip" style="color:${x[2]?"var(--good)":"var(--bad)"};border-color:currentColor">${x[0]} ${sg(x[1])}</span>`).join("");};
 /* 선택지의 직접 효과(확률 사건 제외)를 효과 문자열에서 읽는다 */
 const parseFx=str=>{const o={d:{},tr:{},wl:{}};const s0=strip(str);const re=/`[^`]+`|[^\s·]+/g;let m;while((m=re.exec(s0))){const t=m[0].replace(/−/g,"-");let x;
   if((x=t.match(/^(성과|재무|사람|안정)([+-]\d+)$/)))o.d[x[1]]=(o.d[x[1]]||0)+ +x[2];
   else if((x=t.match(/^헬씨푸드만족([+-]\d+)$/)))o.d.F=(o.d.F||0)+ +x[1];
   else if((x=t.match(/^재무피해-(\d+)$/)))o.d.재무=(o.d.재무||0)- +x[1];
   else if((x=t.match(/^(rd|src|mfg|prc|mkt)([+-]\d+)$/)))o.tr[x[1]]=(o.tr[x[1]]||0)+ +x[2];}return o;};
 const lastDec=pred=>{const ds=(G.decisions||[]).slice(st.dec||0).filter(pred);return ds.length?ds[ds.length-1]:null;};
 /* 라운드 장면 범위 */
 const i0=CONTENT.findIndex(x=>x.id==="GATE"+r),i1=CONTENT.findIndex(x=>x.id==="ROUND"+r);
 const scenes=CONTENT.slice(i0<0?0:i0,i1<0?G.idx:i1);
 const C=window.COACH||{};
 /* 결정 카드 데이터 */
 const cards=[];
 scenes.forEach(sc=>{const id=sc.id;
  if(sc.type==="inbox")return;
  if(id==="3-1"){const dec=lastDec(x=>x.scene==="3-1-2");if(dec)cards.push({id:"3-1",sc,opts:AR(sc.levels),mine:dec.choice,act:sumLog(e=>e.id==="3-1")});const p=lastDec(x=>x.scene==="3-1-3");if(p)cards.push({id:"3-1-3",sc:{...sc,title:"재검토 조건"},opts:AR(sc.planb),mine:p.choice,act:{d:{},tr:{},wl:{}}});return;}
  if(id==="R1-pick"){const dec=lastDec(x=>x.scene==="R1-pick");if(dec){
   /* 3단계: '누구를 만나지 않기로 했는가'를 결정 카드로. 판정은 하지 않는다 */
   const met=G.kpiMeet||String(dec.choice||"").split(",").filter(k=>LD[k]),doc=G.kpiDoc||Object.keys(LD).filter(k=>!met.includes(k));
   const cost=dec.cost!=null?dec.cost:met.length*2,REC=["prc","mfg","mkt"],hit=met.filter(k=>REC.includes(k));
   const row=(l,v)=>`<div class="pk-row"><span class="pk-l">${l}</span><span>${v}</span></div>`;
   cards.push({id,sc:{...sc,title:"누구를 만나지 않기로 했는가"},opts:[],mine:null,pick:true,
    special:`<div class="pk-grid">${row("만난 리더",met.map(k=>LD[k].n).join(", ")||"없음")}${row("만나지 않은 리더",doc.map(k=>LD[k].n).join(", ")||"없음")}${row("쓴 시간",`⏳${cost}`)}${dec.bor!=null?row("야근으로 빌린 시간",dec.bor?`⏳${dec.bor}`:"없음"):""}${row("이견이 큰 세 사람(이수진·강태식·정다은) 중 만난 사람",`${hit.length}명${hit.length?` (${hit.map(k=>LD[k].n).join(", ")})`:""}`)}</div><p class="note">만나지 않은 리더 ${doc.length}명의 KPI는 아래 '만나지 않은 결과' 카드로 따로 보여 줍니다.</p>`,act:sumLog(e=>e.id==="R1-pick")});}return;}
  if(id==="1-3"){const dec=lastDec(x=>x.scene==="1-3");if(dec)cards.push({id,sc,opts:[],mine:null,special:`고른 과제: ${(((G.written||{}).tasks)||[]).map(x=>x.과제).join(" · ")||dec.choice}`,act:sumLog(e=>e.id==="1-3")});return;}
  if(id==="6-2"){const ds=(G.decisions||[]).slice(st.dec||0).filter(x=>x.scene==="6-2"||/^6-2/.test(x.scene));if(ds.length)cards.push({id,sc,opts:[],mine:null,special:"하반기 계약 결과를 세 사람(대상마다 다른 관심사)에게 설명하는 글을 고르고 썼습니다. 결과는 ③ 판단의 질 탭의 서술형 미리 보기에서 볼 수 있습니다.",act:sumLog(e=>e.id==="6-2")});return;}
  if(id==="4-2"){if(G.cells)cards.push({id,sc:{...sc,title:"여력 배분"},opts:[],mine:null,special:`내 배분: ${["RUN","AI","GROW","SEC"].map(k=>k+" "+(G.cells[k]||0)+"칸").join(" · ")}`,act:sumLog(e=>e.id==="4-2")});return;}
  const caseIds=AR(sc.cases).map(c=>c&&c.id).filter(Boolean);
  const dec=lastDec(x=>x.scene===id||caseIds.includes(x.scene));if(!dec)return;
  let opts=AR(sc.options);if(!opts.length&&sc.cases){const ci=(G.cases||{})[id];const c=AR(sc.cases)[ci];opts=c?AR(c.options):[];}
  const docOnly=!!dec.doc;
  cards.push({id,sc,opts,mine:dec.choice,doc:docOnly,act:docOnly?(()=>{const o=opts.find(x=>x.k===dec.choice);const p=o?parseFx(o.fx):{d:{},tr:{},wl:{}};p.tr={};return p;})():sumLog(e=>e.id===id)});
 });
 /* 받은편지함 요약 */
 const mails=(G.decisions||[]).slice(st.dec||0).filter(x=>/^M\d+/.test(x.scene));
 const mcount={};mails.forEach(x=>{const t=String(x.choice).split(":")[0];mcount[t]=(mcount[t]||0)+1;}); /* 새 섹션(ibSectionHtml)이 없을 때만 쓰는 예전 한 줄 요약 */
 const inboxAct=sumLog(e=>e.t==="받은편지함 처리");
 /* 판정 */
 cards.forEach(c=>{const co=C[c.id]||{};c.best=(co.bestCase&&co.bestCase[(G.cases||{})[c.id]])||co.best||[];c.match=c.mine!=null&&c.best.length&&!(c.opts.length&&c.opts.every(o=>c.best.includes(o.k)))?c.best.includes(c.mine):null;
  if(c.doc)c.match=null; /* 3단계: 만나지 않은 리더의 문서안은 내 결정이 아니므로 판정·집계에서 뺀다 */});
 const docN=cards.filter(c=>c.doc).length;
 const judged=cards.filter(c=>c.match!=null),matchN=judged.filter(c=>c.match).length;
 /* 점수와 원인 */
 const K5=[["성과","고객","헬씨푸드가 만족하는가, 약속한 서비스를 지켰는가"],["재무","재무","팀 손익: 매출, 운영비, 토큰 비용"],["사람","구성원","팀원 30명의 몰입과 목소리"],["안정","서비스 안정","시스템 가용성, 장애, 보안"],["F","헬씨푸드 만족","헬씨푸드가 우리 팀을 얼마나 만족스러워하는가"]];
 const now=k=>k==="F"?G.fsat:G.score[k],was=k=>k==="F"?(st.fsat??50):(st.score[k]??50);
 const causes=(k,total,field)=>{field=field||"d";const m={};log.forEach(e=>{const v=(e[field]||{})[k];if(v)m[e.t]=(m[e.t]||0)+v;});const rows=Object.entries(m).filter(x=>x[1]).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]));const rest=total-rows.reduce((a,x)=>a+x[1],0);if(rest)rows.push([field==="d"?"분기 말 연쇄 · 자동 정산":"동맹·갈등 관계로 번진 몫",rest]);return rows;};
 const ibJump=()=>A(()=>{tab=1;draw();setTimeout(()=>{const el=document.getElementById("ibsec");if(el){el.open=true;el.scrollIntoView({block:"start"});}},40);});
 const whyLab=(x,k,field)=>{const t=x[0].length>17?x[0].slice(0,17)+"…":x[0];if(x[0]!=="받은편지함 처리"||!window.ibTop)return t;const tp=ibTop(r,k,field==="tr"?"tr":"d",2);
  const tip=tp.length?`가장 크게 움직인 건: ${tp.map(y=>`${y.name} ${sg(y.v)}`).join(", ")}. 누르면 건별로 봅니다.`:"누르면 건별로 봅니다.";
  return `<a href="javascript:void 0" class="ibjump" title="${tip.replace(/"/g,"&quot;")}" ${ibJump()}>${t}</a>`;};
 const whyTop=(x,k,field)=>{if(x[0]!=="받은편지함 처리"||!window.ibTop)return "";const tp=ibTop(r,k,field==="tr"?"tr":"d",2);const sh=n=>n.length>13?n.slice(0,13).replace(/\s+\S*$/,"")+"…":n;return tp.length?`<span class="ibtop">${tp.map(y=>`${sh(y.name)} ${sg(y.v)}`).join(" · ")}</span>`:"";};
 const whyHtml=(k,total,field)=>{const rows=causes(k,total,field);if(!rows.length)return `<small class="why">이번 라운드에 이 값을 움직인 결정이 없었습니다.</small>`;return `<small class="why"><span style="color:var(--ink)">움직인 결정</span><br>${rows.slice(0,3).map(x=>`${whyLab(x,k,field)} <b style="color:${col(x[1])}">${sg(x[1])}</b>${whyTop(x,k,field)}`).join("<br>")}${rows.length>3?`<br>외 ${rows.length-3}건`:""}</small>`;};
 const deltas=K5.map(([k,l])=>({k,l,dv:now(k)-was(k)}));
 const up=[...deltas].sort((a,b)=>b.dv-a.dv)[0],dn=[...deltas].sort((a,b)=>a.dv-b.dv)[0];
 const trD=LKS.map(k=>({k,dv:G.trust[k]-(st.trust[k]??50)}));const trUp=[...trD].sort((a,b)=>b.dv-a.dv)[0],trDn=[...trD].sort((a,b)=>a.dv-b.dv)[0];
 const lowT=[...LKS].sort((a,b)=>G.trust[a]-G.trust[b])[0];
 const W=k=>window.workload?workload(k):null,S=k=>G.mod&&G.mod.s?G.mod.s[k]:null;
 const md0=st.md||null;
 const hiS=LKS.filter(k=>S(k)!=null&&S(k)>=70).sort((a,b)=>S(b)-S(a));
 const v0=st.voice0??(window.voice?voice(Object.assign({},G,{safe:st.safe??50})):null),v1=window.voice?voice():null;
 const used=(G.roundTok&&G.roundTok[r])||0,cap=G.tokenCap||40;const effO=tokEffOf(((G.score.성과-(st.score.성과??50))+(G.score.안정-(st.score.안정??50)))/2,used,10);const eff=effO.v; /* B-3③ */
 const consAll=G.cons||[],cons=consAll.slice(st.cons0||0),fitN=cons.filter(x=>x.fit).length;
 const kc=G.kpiChk;const kpiOk=kc?[kc.n>=3,kc.hidden>0,kc.right===kc.n].filter(Boolean).length:null;
 const AXL={1:["기대 결과·기한·권한·이유를 밝혀 맡기고, 막히면 질문으로 돕는다","맡길 수 있는 일도 직접 처리하고, 되돌아온 일을 다시 가져간다","내가 직접 하는 게 가장 빠르고 정확하다"],2:["드러나지 않는 기여까지 기준에 넣어 공개하고, 관찰한 기록으로 평가한다","KPI 숫자 순서대로 정하고, 기준은 공개하지 않는다","KPI 숫자가 곧 공정한 평가다"],3:["효과·비용·위험을 기준으로 나누고, 나누기 전에 먼저 알린다","들어오는 일을 다 받고, 아낀 시간은 말없이 새 일로 채운다","AI로 아낀 시간은 더 많은 일로 채우면 된다"],4:["결정 뒤 영향을 받는 사람에게 기준과 근거를 직접 설명한다","결론만 통보하거나 설명하지 않는다","실력과 결과로 증명하면 사람들이 따라온다"]};
 const axVals=[1,2,3,4].filter(a=>ax[a]!=null);
 const avgL=axVals.length?Math.round(axVals.reduce((p,a)=>p+ax[a],0)/axVals.length):null;
 const axCnt=(()=>{const n={1:0,2:0,3:0,4:0};G.sig.slice(st.sig||0).filter(x=>!x.forced).forEach(x=>{n[x.a]++;});return n;})(); /* B-9③ 축별 표본 수 */
 const best=axVals.length?axVals.reduce((p,a)=>ax[a]>ax[p]?a:p):null,worst=axVals.length?axVals.reduce((p,a)=>ax[a]<ax[p]?a:p):null;
 const self=G.diag||{};const gaps=[1,2,3,4].filter(a=>axAll[a]!=null&&self[a]!=null&&self[a]-axAll[a]>=15);
 const kp=window.knowPct?knowPct():null;
 const RT={1:["1분기 (1~3월)","팀장이 된 첫 분기입니다. 받은편지함을 처리하고, 올해의 핵심 과제를 정하고, 리더들과 KPI 기준을 합의하고, 첫 돌발 상황에 대응했습니다."],2:["2·3분기 (4~9월)","한정된 여력과 토큰을 나누고, 헬씨푸드 협상과 리더 사이의 갈등, 본사 차출 같은 상충하는 요구를 다뤘습니다."],3:["4분기 (10~12월)","새벽 장애와 고객 항의를 수습하고, 바뀐 평가 지침 아래에서 연말 평가를 마쳤습니다."]}[r]||["",""];
 /* 부족했던 점 · 잘한 점 · 주안점 */
 const weak=[],good=[],focus=[];
 if(worst!=null&&ax[worst]<50){const ex=ev.find(x=>x.a===worst&&x.s==="P"&&!/\(문서\)$/.test(String(x.choice)))||ev.find(x=>x.a===worst&&x.s==="P"); /* 6단계: 예시는 내가 고른 결정을 먼저 든다 */weak.push(`<b>${AXN3[worst]}</b>에서 실무자 시절의 습관대로 고른 결정이 더 많았습니다(리더 행동 ${ax[worst]}%).${ex?` 예: "${nameOf(ex.scene)}"에서 「${chT(ex.scene,ex.choice)}」.`:""}`);}
 judged.filter(c=>!c.match).slice(0,2).forEach(c=>{const o=c.opts.find(x=>x.k===c.mine);weak.push(`<b>${nameOf(c.id)}</b>: 「${c.mine}. ${o?strip(o.t).slice(0,40):""}」를 골랐습니다. 좋은 리더라면 ${c.best.join(" 또는 ")} 쪽을 먼저 검토했을 것입니다.${o&&o.gl&&o.gl[1]?` 이 선택의 대가: ${o.gl[1]}.`:""}`);});
 if(dn.dv<=-4){const c=causes(dn.k,dn.dv)[0];weak.push(`<b>${dn.l}</b>${jo(dn.l,"이","가")} ${sg(dn.dv)} 내려갔습니다.${c?` 가장 큰 원인은 「${c[0]}」입니다.`:""}`);}
 if(trDn.dv<=-5)weak.push(`<b>${LD[trDn.k].n}</b>(${LD[trDn.k].m})의 신뢰가 ${sg(trDn.dv)} 떨어졌습니다.${(()=>{const c=causes(trDn.k,trDn.dv,"tr")[0];return c?` 가장 큰 원인은 「${c[0]}」입니다.`:"";})()}`);
 if(hiS.length)weak.push(`<b>${hiS.map(k=>LD[k].m).join(", ")}</b> 모듈의 스트레스가 70을 넘었습니다(${hiS.map(k=>LD[k].m+" "+S(k)).join(", ")}). 80을 넘으면 리더 신뢰가 깎이고 소진 신호가 나옵니다.`);
 if(cons.length&&fitN<cons.length)weak.push(`근거를 고른 ${cons.length}건 중 ${cons.length-fitN}건이 합의한 기준과 맞지 않았습니다.`);
 if(v0!=null&&v1!=null&&v1<v0-5)weak.push(`팀 발언량이 ${v0}에서 ${v1}로 줄었습니다. 팀원들이 말을 아끼기 시작했다는 신호입니다.`);
 if(best!=null&&ax[best]>=60)good.push(`<b>${AXN3[best]}</b>에서 리더 행동이 ${ax[best]}%였습니다.`);
 judged.filter(c=>c.match).slice(0,2).forEach(c=>good.push(`<b>${nameOf(c.id)}</b>에서 좋은 리더의 선택과 같은 길을 골랐습니다.`));
 if(up.dv>=3){const c=causes(up.k,up.dv)[0];good.push(`<b>${up.l}</b>${jo(up.l,"을","를")} ${sg(up.dv)} 끌어올렸습니다.${c?` 원인: 「${c[0]}」.`:""}`);}
 if(trUp.dv>=5)good.push(`<b>${LD[trUp.k].n}</b>의 신뢰가 ${sg(trUp.dv)} 올랐습니다.`);
 const AF=window.AX_FOCUS||{};
 if(worst!=null&&ax[worst]<60&&AF[worst]&&AF[worst][r])focus.push(`<b>${AXN3[worst]}</b> · ${AF[worst][r]}`);
 const second=axVals.filter(a=>a!==worst).sort((a,b)=>ax[a]-ax[b])[0];
 if(second!=null&&ax[second]<50&&AF[second]&&AF[second][r])focus.push(`<b>${AXN3[second]}</b> · ${AF[second][r]}`);
 if(G.fexp!=null&&G.score.안정<G.fexp)focus.push(`<b>서비스 안정</b> · 지금 ${G.score.안정}로 헬씨푸드 기대 ${G.fexp}보다 낮습니다. 예방 칸과 절차 준수를 우선해 기대 이상으로 끌어올리세요. 그대로 두면 분기마다 헬씨푸드 만족과 재무가 깎입니다.`);
 if(G.trust[lowT]<45)focus.push(`<b>${LD[lowT].n}(${LD[lowT].m})</b> · 신뢰가 ${G.trust[lowT]}로 가장 낮습니다. 다음 라운드에서 이 리더가 걸린 결정은 먼저 1:1로 듣고, 프로필 카드에서 걱정과 거슬려하는 것을 확인하세요.`);
 if(hiS.length)focus.push(`<b>${LD[hiS[0]].m} 모듈 부담</b> · 스트레스 ${S(hiS[0])}입니다. 다음 배분에서 이 모듈의 칸을 늘리거나 부하 완화 조치를 먼저 쓰세요.`);
 if(!focus.length)focus.push("이번 라운드의 균형을 유지하세요. 다음 라운드는 더 무거운 상충이 기다립니다. 결정 전에 '누가 영향을 받는가, 그 사람에게 무엇을 설명할 것인가'를 먼저 확인하세요.");
 const TABS=["요약","① 결정 돌아보기","② 팀에 남은 것","③ 판단의 질","④ 습관","⑤ 다음 라운드 준비"]; /* 2026-11-26: 결과 코드 탭은 라운드 끝 화면의 보내기 카드로 옮김 */
 let tab=0;
 const sec=o=>`<div class="secbox"><div class="seclab">무엇을 보나</div><p>${o.what}</p>${o.how?`<div class="seclab">읽는 법</div><ul class="secul">${o.how.map(x=>`<li>${x}</li>`).join("")}</ul>`:""}</div>${o.body}${o.interp&&o.interp.length?`<div class="happen"><span class="label">내 결과 해석</span>${o.interp.map(x=>`· ${x}`).join("<br>")}</div>`:""}${o.q?`<div class="tcard"><span class="label">피드백 세션에서 생각해 볼 질문</span><p>${o.q}</p></div>`:""}`;
 const ok=b=>b?`<b style="color:var(--good)">✓</b>`:`<b style="color:var(--bad)">✕</b>`;
 const go=i=>A(()=>{tab=i;draw();window.scrollTo(0,0);});
 const prevFocus=r>1&&G.written&&G.written["focus"+(r-1)];
 const T=[];
 /* 요약 */
 T[0]=()=>`${(()=>{const L=window.violationsOf?violationsOf(r):[];return L.length?`<div class="happen alertbox"><span class="label">넘어서는 안 되는 선을 넘은 결정 ${L.length}건</span>${L.map(x=>`<div class="lg-item">· ${x.text}${x.rule?`<p class="lg-q"><span>${x.src||"규정"}</span>“${x.rule}”</p>`:""}</div>`).join("")}<small>장애 절차·보안·현장 안전은 다른 점수와 관계없이 지켜야 하는 선입니다. 이 결정은 결산에서 기준 미달로 판정됩니다.</small></div>`:"";})()}
  ${(()=>{/* 6단계: 요약 상단 세 카드 (가장 큰 원인, 가장 큰 후회, 다음 행동). 점수·판정은 바꾸지 않고 기존 기록에서 고른다 */
   const AXK=["성과","재무","사람","안정"];const mag=c=>{const d=(c.act&&c.act.d)||{};return AXK.reduce((a,k)=>a+Math.abs(d[k]||0),0);};
   const nm=c=>c.pick?"KPI 합의 · 누구를 만나지 않기로 했는가":(nameOf(c.id)||strip(c.sc.title));
   const cause=cards.filter(c=>c.act&&mag(c)>0).slice().sort((a,b)=>mag(b)-mag(a))[0]||null;
   const vk=(window.violationsOf?violationsOf(r):[]).map(v=>v.k);const ix=window.lineIndex?lineIndex().scene:{};
   const fxT=o=>{const f=o&&o.fx;return typeof f==="function"?String(f):String(f||"");};
   const vioC=cards.find(c=>!c.doc&&c.mine!=null&&(ix[c.id==="3-1"?"3-1-2":c.id]||[]).some(k=>vk.includes(k)&&fxT((c.opts||[]).find(o=>o.k===c.mine)).indexOf("`"+k+"`")>=0));
   const regret=vioC||cards.filter(c=>c.match===false).slice().sort((a,b)=>mag(b)-mag(a))[0]||null;
   const TH=window.LEX_TH||{};const imp=regret&&((TH[regret.id]||{}).imp||(C[regret.id]||{}).imp);
   const nextA=imp||focus[0]||"다음 라운드에 의식적으로 연습해 볼 습관 하나를 ⑤에서 정해 보세요.";
   return `<div class="sum3 sumtop">
    <button class="sumc" ${go(2)}><span class="seclab">가장 큰 원인</span><b>${cause?nm(cause):"계기판을 움직인 결정 없음"}</b><small>${cause?`이번 라운드에 계기판을 가장 크게 움직인 결정${cause.doc?" (만나지 않은 결과)":""}`:"점수 변화가 기록된 결정이 없습니다"}</small>${cause?`<span class="chips">${chips(cause.act)}</span>`:""}<em>② 팀에 남은 것 →</em></button>
    <button class="sumc" ${go(1)}><span class="seclab">가장 큰 후회</span><b>${regret?nm(regret):"다시 고를 결정 없음"}</b><small>${regret?(regret===vioC?"넘어서는 안 되는 선을 넘은 결정입니다":"좋은 리더와 다른 길을 고른 결정 가운데 계기판이 가장 크게 움직인 결정입니다")+(regret===cause?". 가장 큰 원인과 같은 결정입니다":""):"좋은 리더와 다른 길을 고른 결정이 없습니다"}</small><em>① 결정 돌아보기 →</em></button>
    <button class="sumc" ${go(5)}><span class="seclab">다음 행동</span><b class="sumact">${nextA}</b><small>${imp?"가장 큰 후회와 이어진 이론이 권하는 행동":"다음 라운드 첫 번째 주안점"}</small><em>⑤ 다음 라운드 준비 →</em></button>
   </div>`;})()}
  <div class="secbox"><div class="seclab">이번 라운드에서 가장 부족했던 점</div><p>${weak[0]||"눈에 띄게 부족한 점은 없었습니다."}</p><div class="seclab">다음 라운드 첫 번째 주안점</div><p>${focus[0]}</p><p><a href="javascript:void 0" class="link" ${go(5)}>⑤ 다음 라운드 준비에서 전체 보기 →</a></p></div>
  <div class="rd-flow" role="list" aria-label="읽는 순서"><span class="rd-lab">읽는 순서</span>${[[1,"①","결정을 좋은 리더와 비교"],[2,"②","팀에 남은 것"],[3,"③④","판단과 습관"],[5,"⑤","다음 라운드 주안점"]].map(([i,n,t])=>`<a href="javascript:void 0" role="listitem" class="rd-step" ${go(i)}><b>${n}</b>${t}</a>`).join('<i class="rd-arr" aria-hidden="true"></i>')}${G.selfStudy?"":'<i class="rd-arr" aria-hidden="true"></i><span class="rd-step end" role="listitem"><b>끝</b>강사에게 코드 보내기</span>'}</div>
  <details class="secbox sumrest"><summary>나머지 요약 펼치기 · 라운드 소개, 미결 안건, 점수 요약, 이론으로 본 라운드${G.undo&&G.undo.log&&G.undo.log.length?", 되돌린 기록":""}</summary>${(()=>{const P=(G.pending||[]).filter(x=>x.r===r);return P.length?`<div class="happen"><span class="label">미결 안건 ${P.length}건</span>${P.map(x=>`· ${x.month}월 ${x.from} · ${x.sub}`).join("<br>")}<br><small>받은편지함 시간이 끝날 때까지 정하지 못한 보안·장애 안건입니다. 거절로 기록하지 않았습니다. 실제 업무라면 누가 언제까지 정할지부터 정해야 하는 일입니다.</small></div>`:"";})()}${window.critGapHtml?critGapHtml(r):""}<div class="prose"><p><b>${RT[0]}</b>. ${RT[1]}</p><p>이 성적표는 점수를 매기는 표가 아니라 <b>배우는 시간</b>입니다. 내 결정이 리더들과 계기판, 모듈의 업무량과 스트레스에 무엇을 남겼는지 보고, 좋은 리더라면 어떻게 판단했을지 비교한 뒤, 다음 라운드에 무엇에 주의할지 정합니다.</p></div>
  ${(()=>{const L=((G.undo&&G.undo.log)||[]).filter(x=>x.r===r);const e=t=>String(t||"").replace(/</g,"&lt;");return L.length?`<div class="secbox"><div class="seclab">이번 라운드에 되돌린 횟수 ${L.length}회</div><p>${L.map(x=>(x.same?`${x.m?x.m+"월 · ":""}<b>${e(x.to)}</b> 장면을 처음부터 다시 함`:`${x.m?x.m+"월 · ":""}<b>${e(x.from)}</b>에서 <b>${e(x.to)}</b>(으)로 돌아감`)).join("<br>")}</p><div class="seclab">피드백 시간에 생각해 볼 질문</div><p>무엇을 보고 결정을 바꾸고 싶었나요? 실제 팀장이라면 그 정보를 결정하기 전에 어떻게 얻을 수 있었을까요?</p></div>`:"";})()}
  ${prevFocus?`<div class="secbox"><div class="seclab">지난 라운드에 내가 정한 주안점</div><p>${String(prevFocus).replace(/</g,"&lt;")}</p></div>`:""}
  ${window.voicePanel?voicePanel(r):""}
  <div class="sum3">
   <button class="sumc" ${go(1)}><span class="seclab">① 결정 돌아보기</span><b>${judged.length?`핵심 결정 ${judged.length}개 중 ${matchN}개`:"핵심 결정 없음"}</b><small>좋은 리더의 선택과 같은 길을 고른 수</small><em>결정별로 보기 →</em></button>
   <button class="sumc" ${go(2)}><span class="seclab">② 팀에 남은 것</span><b>${up.dv>0?`${up.l} ${sg(up.dv)}`:"오른 점수 없음"} · <span style="color:var(--bad)">${dn.dv<0?`${dn.l} ${sg(dn.dv)}`:"내린 점수 없음"}</span></b><small>가장 많이 오른 점수 · 내린 점수</small><b>${trDn.dv<0?`${LD[trDn.k].n} 신뢰 ${sg(trDn.dv)}`:"신뢰가 떨어진 리더 없음"}</b><small>신뢰가 가장 많이 떨어진 리더</small><em>계기판·리더·모듈 보기 →</em></button>
   <button class="sumc" ${go(4)}><span class="seclab">③ 판단 · ④ 습관</span><b>${avgL!=null?`리더 행동 ${avgL}%`:"아직 드러난 습관 없음"}</b><small>습관이 드러난 결정 중 리더 행동을 고른 비율</small>${worst!=null?(ax[worst]>=80?`<b style="color:var(--ink)">네 일 모두 높음 · 가장 낮은 일도 ${AXN3[worst]} ${ax[worst]}%</b>`:`<b style="color:${ax[worst]<50?"var(--bad)":"var(--ink)"}">가장 약한 일: ${AXN3[worst]} ${ax[worst]}%</b>${axCnt[worst]<=2?`<small>표본 ${axCnt[worst]}건이라 참고만 하세요</small>`:""}`):""}<em>습관 보기 →</em></button>
  </div>
  ${window.theorySummary?theorySummary(cards.filter(c=>!c.doc)):""}
  </details>`;
 /* ① 결정 돌아보기 */
 T[1]=()=>{
  const cardHtml=c=>{const co=C[c.id]||{};const sc=c.sc;const title=c.pick?"KPI 합의 · 누구를 만나지 않기로 했는가":nameOf(c.id)||strip(sc.title);
   /* B-9①: 플레이 때는 선택지 순서가 섞여 글자가 달랐다. 복기 화면에서는 글자 대신 선택지 문구로 가리킨다(기록·결과 코드의 글자는 그대로) */
   const SH=k=>{const o=c.opts.find(x=>x.k===k);if(!o)return k;const t=strip(o.t).replace(/["“”]/g,"").replace(/[.。]\s*$/,"").trim();return t.length>20?t.slice(0,20).replace(/\s+\S*$/,"")+"…":t;};
   const OQ=k=>`“${SH(k)}”`;const JS={는:["은","는"],은:["은","는"],가:["이","가"],이:["이","가"],를:["을","를"],을:["을","를"],와:["과","와"],과:["과","와"]};
   const LTX=t=>String(t||"").replace(/\(([A-D])~([A-D]) 중 하나\)/g,(m,a,b)=>`(앞의 ${b.charCodeAt(0)-a.charCodeAt(0)+1}개 선택지 중 하나)`).replace(/\(([A-D](?:\s*[·,]\s*[A-D])*)\)/g,(m,g)=>"("+g.split(/[·,]/).map(k=>OQ(k.trim())).join(", ")+")").replace(/(^|[\s(])([A-D])(는|은|가|이|를|을|처럼|의|도|만|와|과)(?=[\s,.)])/g,(m,p,k,j)=>{if(!c.opts.some(x=>x.k===k))return m;return p+OQ(k)+(JS[j]?jo(SH(k),JS[j][0],JS[j][1]):j);});
   const mineO=c.opts.find(x=>x.k===c.mine);
   if(c.doc){/* 3단계: 만나지 않은 결과 카드. 내 선택이 아니므로 판정·이론 비교 없이, 만났다면 있었던 선택지를 읽기 전용으로 */
    const who=Object.keys(KPI_SCENE).find(k=>KPI_SCENE[k]===c.id);
    return `<details class="dcard docres"><summary><span class="dt">${title}</span><span class="note">${strip(sc.when)||""}</span><span class="dm">만나지 않은 결과${mineO?` · ${SH(c.mine)}`:""}</span><span class="pill">만나지 않은 결과</span></summary>
    <div class="dbody">${co.sit?`<p><span class="seclab">상황</span><br>${co.sit}</p>`:""}
    <p class="happen"><span class="label">만나지 않은 결과</span>${who?LD[who].n:"이 리더"}와는 직접 만나지 않아, 리더가 원하던 안 ${OQ(c.mine)}${jo(SH(c.mine),"이","가")} 문서로 정해졌습니다. 내가 고른 선택이 아니라, '누구를 만나지 않기로 했는가'에서 나온 결과입니다.</p>
    <p><span class="seclab">만났다면 고를 수 있었던 선택지 (읽기 전용)</span></p>
    <div class="optcmp ro">${c.opts.map(o=>{const doc=o.k===c.mine,bl=c.best.includes(o.k);return `<div class="ocard${doc?" me":""}"><div class="ohead">${strip(o.t)}</div><div class="otags">${doc?`<span class="pill">문서로 정해진 안</span>`:""}${bl?`<span class="pill good">좋은 리더의 선택</span>`:""}</div>${o.gl&&o.gl.length?`<small class="note">▲ ${o.gl[0]||""}${o.gl[1]?` · ▼ ${o.gl[1]}`:""}</small>`:""}</div>`;}).join("")}</div>
    ${co.ld?`<div class="ldbox"><span class="seclab">만났다면, 좋은 리더라면</span><p>${LTX(co.ld)}</p></div>`:""}
    <p style="margin-top:10px"><span class="seclab">문서안으로 실제로 일어난 일 (신뢰 변화 없음)</span><br><span class="chips">${chips(c.act,{empty:"점수·업무량에 기록된 변화 없음"})}</span></p></div></details>`;}
   const badge=c.match==null?"":c.match?`<span class="pill good">좋은 리더의 선택과 같음</span>`:`<span class="pill bad">좋은 리더라면 ${c.best.map(OQ).join(" 또는 ")} 쪽</span>`;
   const optRows=c.opts.length?`<div class="optcmp">${c.opts.map(o=>{const me=o.k===c.mine,bl=c.best.includes(o.k),L=/[①②③④]L/.test(String(o.sig||"")),P=/[①②③④]P/.test(String(o.sig||""));const pf=parseFx(o.fx);
     return `<div class="ocard${me?" me":""}"><div class="ohead">${strip(o.t)}</div><div class="otags">${me?`<span class="pill mine">내 선택</span>`:""}${bl?`<span class="pill good">좋은 리더의 선택</span>`:""}${L?`<span class="pill">리더 행동</span>`:""}${P?`<span class="pill warn">실무자 습관</span>`:""}</div>${o.gl&&o.gl.length?`<small class="note">▲ ${o.gl[0]||""}${o.gl[1]?` · ▼ ${o.gl[1]}`:""}</small>`:""}<div class="chips">${chips(pf,{empty:"점수 변화 없음"})}</div></div>`;}).join("")}</div><p class="note" style="margin:2px 0 0">선택지 칩은 그 선택의 <b>직접 효과</b>입니다(확률로 일어나는 일과 동맹·갈등으로 번지는 몫 제외).</p>`:"";
   return `<details class="dcard" ${c.match===false||!judged.length?"open":""}><summary><span class="dt">${title}</span><span class="note">${strip(sc.when)||""}</span>${c.mine!=null?`<span class="dm">내 선택${mineO?` · ${strip(mineO.t).slice(0,26)}…`:""}</span>`:""}${badge}</summary>
    <div class="dbody">${co.sit?`<p><span class="seclab">상황</span><br>${co.sit}</p>`:""}${co.pt?`<p><span class="seclab">쟁점</span><br>${co.pt}</p>`:""}${c.special?(c.pick?c.special:`<p>${c.special}</p>`):""}
    ${window.theoryBox?theoryBox(c,co.ld?LTX(co.ld):""):(co.ld?`<div class="ldbox"><span class="seclab">좋은 리더라면</span><p>${LTX(co.ld)}</p></div>`:"")}
    <details class="dmore"><summary>선택지 비교와 실제로 일어난 일</summary>${optRows}
    <p style="margin-top:10px"><span class="seclab">실제로 일어난 일 (내 선택 + 확률로 일어난 일)</span><br><span class="chips">${chips(c.act,{empty:"점수·신뢰·업무량에 기록된 변화 없음"})}</span></p></details></div></details>`;};
  const ibNew=window.ibSectionHtml?ibSectionHtml(r,{chips,inboxAct,ld:(C.inbox||{}).ld||""}):"";
  const inbox=ibNew||mails.length?ibNew||`<details class="dcard"><summary><span class="dt">받은편지함</span><span class="dm">메일 ${mails.length}건 · ${Object.entries(mcount).map(([k,v])=>`${k} ${v}`).join(" · ")}</span></summary><div class="dbody"><p><span class="seclab">실제로 일어난 일</span><br><span class="chips">${chips(inboxAct)}</span></p><div class="ldbox"><span class="seclab">좋은 리더라면</span><p>${(C.inbox||{}).ld||""}</p></div></div></details>`:"";
  return sec({what:"이번 라운드에 내린 결정을 하나씩 다시 펼쳐, 각 선택지가 무엇을 얻고 잃는지, 내 선택이 실제로 리더 신뢰·계기판·업무량에 무엇을 남겼는지, 좋은 리더라면 어떻게 판단했을지 비교합니다.",
   how:["결정마다 <b>상황 → 쟁점 → 이론으로 점검하기(근거 이론 · 이론이 권하는 행동 · 내 행동 · 차이 · 다음에 해 볼 행동)</b> 순서입니다. 선택지 비교와 점수 변화는 맨 아래 '선택지 비교와 실제로 일어난 일'을 누르면 펼쳐집니다. 이론 이름을 누르면 리더십 사전이 열립니다. 제목을 누르면 펼치고 접습니다. 좋은 리더와 다른 길을 고른 결정은 처음부터 펼쳐 둡니다.","<b>좋은 리더의 선택</b>은 이 과정이 가르치는 리더 행동(맡기기·기준 공개·우선순위·설명)에 가장 가까운 선택지입니다. 정답이 하나라는 뜻은 아닙니다. 다른 길을 골랐다면 그 이유를 스스로 설명할 수 있는지가 중요합니다.","선택지에 붙은 <b>리더 행동 / 실무자 습관</b> 표시는 ④ 습관 탭의 기록 기준입니다. 리더 행동 표시가 둘 이상인 장면에서는, 이 상황에서 대가가 가장 적은 쪽을 좋은 리더의 선택으로 골랐습니다. 세 선택지가 모두 리더 행동인 장면은 맞고 틀림을 판정하지 않습니다.","칩의 초록은 좋아진 것, 빨강은 나빠진 것입니다. 업무량은 늘면 빨강입니다."],
   body:`${judged.length?`<div class="happen"><span class="label">한눈에</span>핵심 결정 ${judged.length}개 중 <b>${matchN}개</b>가 좋은 리더의 선택과 같았습니다.${judged.length-matchN?` 다른 길을 고른 ${judged.length-matchN}개를 먼저 펼쳐 보세요.`:""}${docN?`<br><small>핵심 결정은 내가 직접 고른 결정 가운데 좋은 리더의 선택이 정해진 것만 셉니다. 만나지 않은 리더의 문서안 ${docN}건은 내 선택이 아니므로 '만나지 않은 결과'로 따로 표시합니다.</small>`:""}${(()=>{const S=window.ibStats?ibStats(r):null;return S&&S.n?`<br><small>받은편지함 ${S.n}건은 이 집계와 따로, 아래 '받은편지함' 참고 결정에 모았습니다(같음 ${S.L} · 다름 ${S.P} · 판정 없음 ${S.N}).</small>`:"";})()}</div>`:""}<div class="dlist">${cards.map(cardHtml).join("")}${inbox}</div>
   ${window.cinemaHtml&&cinemaHtml("R"+r)?`<div class="label" style="margin-top:16px">인생극장 · 가장 큰 갈림길에서 고르지 않은 길</div>${window.wxCineHtml?wxCineHtml(cinema("R"+r),{compact:true,q:false}):cinemaHtml("R"+r)}`:""}`,
   interp:[],q:"좋은 리더와 다른 길을 고른 결정 하나를 골라 보세요. 그때 무엇을 지키려고 그 길을 골랐나요? 같은 것을 지키면서 리더 행동에 더 가까운 방법은 없었을까요?"});};
 /* ② 팀에 남은 것 */
 T[2]=()=>{const it=[];
  if(up.dv>0){const c=causes(up.k,up.dv)[0];it.push(`가장 많이 오른 점수는 <b>${up.l} ${sg(up.dv)}</b>입니다.${c?` 가장 큰 원인은 「${c[0]}」(${sg(c[1])})입니다.`:""}`);}
  if(dn.dv<0){const c=causes(dn.k,dn.dv)[0];it.push(`가장 많이 내린 점수는 <b>${dn.l} ${sg(dn.dv)}</b>입니다.${c?` 가장 큰 원인은 「${c[0]}」(${sg(c[1])})입니다.`:""}`);}
  if(trDn.dv<0)it.push(`신뢰가 가장 많이 떨어진 리더는 <b>${LD[trDn.k].n}</b>(${sg(trDn.dv)})입니다. 신뢰가 40 아래로 내려가면 그 리더가 걸린 결정에서 반발이 커지고, 동맹 관계인 리더에게도 번집니다.`);
  if(G.score.사람<(st.score.사람??50))it.push("구성원 점수가 내려갔습니다. 서비스 수익 체인에 따라 다음 분기 서비스 안정이 함께 내려갈 수 있습니다.");
  if(G.fexp!=null&&G.score.안정<G.fexp)it.push(`서비스 안정(${G.score.안정})이 헬씨푸드 기대(${G.fexp})보다 낮습니다. 이대로면 분기마다 헬씨푸드 만족이 깎이고 재무로 번집니다.`);
  if(hiS.length)it.push(`${hiS.map(k=>LD[k].m).join(", ")} 모듈의 스트레스가 70을 넘었습니다. 업무량이 70 이상이면 장면마다 스트레스가 5씩 쌓입니다.`);
  const chainBox=k=>`<div class="cbox"><small>${K5.find(x=>x[0]===k)[1]}</small><b>${now(k)}</b> ${dl(now(k),was(k))}</div>`;
  return sec({what:"결정들이 쌓여 팀에 남긴 결과를 세 층으로 봅니다. <b>계기판</b>(균형성과표 네 관점과 헬씨푸드 만족), <b>리더 다섯 명의 신뢰</b>, <b>모듈의 업무량과 스트레스</b>입니다.",
   how:["모든 값은 0~100이고 게임을 시작할 때 계기판과 신뢰는 50이었습니다. 화살표 왼쪽이 라운드 시작, 오른쪽이 지금입니다.","카드 아래 '움직인 결정'은 그 값을 가장 크게 바꾼 장면입니다. '분기 말 연쇄'는 분기가 끝날 때 게임이 자동으로 정산한 몫, '동맹·갈등 관계로 번진 몫'은 다른 리더에게 한 결정이 관계를 타고 번진 몫입니다.","업무량은 모듈이 감당하는 일의 양, 스트레스는 그 일이 쌓여 생긴 부담입니다. 업무량이 70 이상이면 스트레스가 쌓이고, 스트레스가 80을 넘으면 그 리더의 신뢰가 깎입니다.","한쪽을 올리면 다른 쪽이 내려가기 쉽습니다. 모든 값이 오르는 정답은 없습니다."],
   body:`<div class="label" style="margin-top:14px">계기판 · 네 관점이 이어지는 방식 (서비스 수익 체인)</div><div class="chain">${chainBox("사람")}<span>→</span>${chainBox("안정")}<span>→</span>${chainBox("F")}<span>→</span>${chainBox("재무")}</div><p class="note">구성원의 몰입이 한 분기 늦게 서비스 안정에, 서비스 안정이 헬씨푸드 만족에, 헬씨푸드 만족이 재무에 닿습니다. 고객 점수는 이 사슬과 별도로, 약속한 서비스를 지켰는지를 봅니다.</p>
   <div class="scgrid">${K5.map(([k,l,df])=>`<div class="sccard"><span>${l}</span><small class="def">${df}</small><div class="v">${d(now(k),was(k))}</div>${whyHtml(k,now(k)-was(k))}</div>`).join("")}<div class="sccard"><span>토큰 효율</span><small class="def">AI 토큰(💳)을 쓴 만큼 고객·서비스 안정 점수가 올랐는가. 이번 라운드에 오른 (고객+서비스 안정)÷2를 쓴 토큰÷10으로 나눈 값, 곧 토큰 10당 오른 점수입니다.</small><div class="v"><b>${eff??(used>0?"측정 안 함":"미사용")}</b> <span class="note">💳${used}/${cap}</span></div><small class="why">${eff!=null?"높을수록 토큰을 효율적으로 썼다는 뜻입니다.":used>0?effO.why+"이라 재지 않았습니다.":"이번 라운드에는 토큰을 쓰는 선택지를 고르지 않았습니다."}</small></div></div>
   ${(G.chain||[]).length?`<div class="secbox"><div class="seclab">분기 말 자동 정산 내역</div><p>${G.chain.slice(r===2?-2:-1).map(c=>chainLine(c)).filter(Boolean).join("<br>")||"이번 분기에는 연쇄로 움직인 값이 없었습니다."}</p></div>`:""}
   <div class="label" style="margin-top:16px">리더 다섯 명의 신뢰</div><div class="scgrid">${LKS.map(k=>`<div class="sccard"><span>${LD[k].n} <small class="note">${LD[k].m}</small></span><div class="v">${d(G.trust[k],st.trust[k]??50)}</div>${whyHtml(k,G.trust[k]-(st.trust[k]??50),"tr")}</div>`).join("")}</div>
   <div class="label" style="margin-top:16px">모듈의 업무량과 스트레스</div><div class="table">${LKS.map(k=>{const w=W(k),s1=S(k),w0=md0&&md0.w?md0.w[k]:null,s0=md0&&md0.s?md0.s[k]:null;return `<div class="card mrow2"><b class="hname">${LD[k].m} <small class="note">${LD[k].n}</small></b><span>업무량 ${w0!=null?`${w0} → `:""}<b style="color:${w>=70?"var(--bad)":"var(--ink)"}">${w??"—"}</b></span><span>스트레스 ${s0!=null?`${s0} → `:""}<b style="color:${s1>=80?"var(--bad)":s1>=70?"var(--time)":"var(--ink)"}">${s1??"—"}</b>${s1>=80?" · 소진 위험":s1>=70?" · 주의":""}</span></div>`;}).join("")}</div>
   ${v1!=null?`<p class="note" style="margin-top:8px">팀 발언량: ${v0!=null?`${v0} → `:""}<b>${v1}</b>. 회의와 게시판에서 팀원들이 의견을 내는 정도입니다. 줄어들면 문제가 말로 나오지 않고 숨는다는 신호입니다.</p>`:""}`,
   interp:it,q:"신뢰가 가장 많이 떨어진 리더, 스트레스가 가장 높은 모듈을 떠올려 보세요. 그 결과를 만든 결정에서, 그 사람이 무엇을 잃었는지 알고 있었나요?"});};
 /* ③ 판단의 질 */
 T[3]=()=>{const it=[];
  if(r===1&&kc){if(kc.right<kc.n)it.push(`KPI 기준 ${kc.n}개 중 ${kc.n-kc.right}개가 팀 목표와 맞게 연결되지 않았습니다. 팀원들은 팀 목표와 상관없는 일에 힘을 쓰게 됩니다.`);if(!kc.hidden)it.push("예방이나 주니어 지원 같은 드러나지 않는 기여가 기준에 없습니다. 기준에 없는 일은 점점 아무도 하지 않게 됩니다.");if(kpiOk===3)it.push("KPI 합의서의 세 조건을 모두 갖췄습니다.");}
  if(r===1&&G.f.pub_leaders)it.push("기준을 리더들에게만 알렸습니다. 팀원들은 자신이 무엇으로 평가받는지 아직 모릅니다. 팀 설문의 '업무 배분과 평가 기준을 알고 있다' 점수에도 영향을 줍니다.");
  if(cons.length){if(fitN<cons.length)it.push(`근거를 고른 ${cons.length}건 중 ${cons.length-fitN}건이 합의한 기준과 맞지 않았습니다. 결정마다 근거가 달라지면 팀원들은 "기준이 그때그때 바뀐다"고 느낍니다.`);else it.push(`근거를 고른 ${cons.length}건이 모두 합의한 기준과 맞았습니다.`);}
  const pubTxt=G.f.pub_full?["전체 공개","기준과 비중, 사례까지 팀 전원에게 공개했습니다. 팀원들이 무엇으로 평가받는지 알지만, \"제 일은 몇 점이에요?\" 같은 문의가 늘 수 있습니다."]:G.f.pub_items?["항목만 공개","기준 항목은 알렸고, 비중은 면담에서 따로 설명합니다. 설명하는 사람마다 말이 달라질 수 있습니다."]:G.f.pub_leaders?["리더에게만","리더들과만 기준을 맞췄습니다. 리더가 자기 모듈에 전하지 않으면 팀원들은 기준을 모릅니다."]:["정하지 않음",""];
  const KW=[["기여 기준을 3개 이상 골랐다",kc&&kc.n>=3,`${kc?kc.n:0}개`,"기준이 한두 개뿐이면 팀원들은 그 숫자만 좇습니다."],["드러나지 않는 기여를 넣었다",kc&&kc.hidden>0,kc&&kc.hidden?`${kc.hidden}개`:"없음","예방, 주니어 지원처럼 눈에 띄지 않는 일은 기준에 없으면 사라집니다."],["모든 기준을 팀 목표와 연결했다",kc&&kc.right===kc.n,kc?`${kc.right}/${kc.n}`:"—","팀 목표와 이어지지 않은 기준은 노력을 엉뚱한 곳으로 보냅니다."]];
  return sec({what:"결과와 별개로, 결정을 내린 <b>방식</b>이 스스로 세운 기준과 맞았는지 봅니다. 결과는 운과 다른 사람의 반응에도 좌우되지만, 판단의 질은 내가 다스릴 수 있는 부분입니다.",
   how:[r===1?"<b>KPI 합의서 점검</b>: 3월에 리더들과 합의한 기여 기준이 좋은 기준의 세 조건을 갖췄는지 봅니다.":null,"<b>일관성 점검</b>: 1월에 고른 핵심 과제 세 개와 이후 결정이 같은 방향이었는지 봅니다. 다른 방향이 틀렸다는 뜻은 아닙니다. 그렇게 고른 이유를 설명할 수 있는지를 봅니다.","<b>근거 일관성</b>: 몇몇 안건은 결정한 뒤 '이 결정의 근거'를 골랐습니다. 그 근거가 합의한 기준과 맞으면 일치(✓), 다르면 어긋남(✕)입니다.","<b>서술형 미리 보기</b>: 직접 쓴 글이 기준·원칙, 상대의 맥락, 다음 행동과 기한을 담았는지 자동으로 점검합니다. 최종 점수는 강사가 매깁니다."].filter(Boolean),
   body:`${r===1?`<div class="label" style="margin-top:14px">KPI 합의서 점검</div><div class="table">${KW.map(x=>`<div class="card" style="display:grid;grid-template-columns:auto 1fr auto;gap:4px 10px;align-items:start">${ok(x[1])}<span><b style="font-weight:600">${x[0]}</b><br><small class="note">왜 중요한가: ${x[3]}</small></span><span class="note num">${x[2]}</span></div>`).join("")}<div class="card"><b style="font-weight:600">공개 수준: ${pubTxt[0]}</b><br><small class="note">${pubTxt[1]}</small></div></div>`:""}
   <div class="label" style="margin-top:14px">근거 일관성 · ${cons.length?`이번 라운드 ${cons.length}건 중 ${fitN}건 일치`:"이번 라운드에 근거를 고른 안건 없음"}${consAll.length>cons.length?` <span class="note">(누적 ${consAll.length}건 중 ${consAll.filter(x=>x.fit).length}건)</span>`:""}</div>
   ${cons.length?`<div class="table">${cons.map(c=>`<div class="card" style="display:grid;grid-template-columns:auto 1fr;gap:4px 10px">${ok(c.fit)}<span><b style="font-weight:600">${nameOf(c.scene)}</b><br><small class="note">내가 고른 근거: ${c.why||"—"} · ${c.fit?"합의한 기준과 맞음":"합의한 기준과 다름"}</small></span></div>`).join("")}</div>`:`<p class="note">근거를 고르는 안건을 만나지 않았거나, 근거를 고르지 않았습니다.</p>`}
   ${window.consistHtml?consistHtml((G.decisions||[]).slice(st.dec||0),nameOf):""}
   <div style="margin-top:14px">${window.v3RubricHtml?window.v3RubricHtml(r):""}</div>`,
   interp:it,q:"기준과 어긋난 결정이 있었다면, 그때 바꿨어야 할 것은 결정이었나요, 기준이었나요? 기준을 바꿔야 했다면 누구에게 어떻게 알렸어야 했을까요?"});};
 /* ④ 습관 */
 T[4]=()=>{const it=[];
  if(best!=null)it.push(`리더 행동이 가장 많이 나온 일은 <b>${AXN3[best]}</b>(${ax[best]}%)입니다.`);
  if(worst!=null&&worst!==best&&ax[worst]<80)it.push(`실무자 습관이 가장 많이 남은 일은 <b>${AXN3[worst]}</b>(${ax[worst]}%)입니다.`);
  gaps.forEach(a=>it.push(`<b>${AXN3[a]}</b>: 게임 전 자가진단은 ${self[a]}점이었는데 실제 선택은 ${axAll[a]}%입니다. 스스로 생각한 것보다 실무자 시절의 습관대로 움직였습니다. <b>맹점 후보</b>입니다.`));
  if(!axVals.length)it.push("이번 라운드에는 습관이 드러나는 결정이 없었습니다.");
  const exs=s=>{const seen=new Set();return ev.filter(x=>x.s===s).filter(x=>{const k=x.scene+"|"+x.choice;if(seen.has(k))return false;seen.add(k);return true;}).slice(0,3);};
  const Lx=exs("L"),Px=exs("P");
  return sec({what:"결정마다 내가 <b>실무자 시절의 습관</b>대로 움직였는지, 팀장에게 필요한 <b>리더 행동</b>을 했는지를 네 가지 일(맡기기 · 평가하기 · 자원 나누기 · 설명하기)로 나눠 봅니다.",
   how:["이 게임의 주인공은 실력 있는 실무자로 인정받다가 팀장이 됐습니다. 실무자일 때 잘 통하던 방식이 팀장 자리에서는 오히려 팀을 막기도 합니다. 그래서 습관이 드러나는 선택지를 고를 때마다 둘 중 어느 쪽이었는지 기록했습니다.","<b>실무자 습관</b>: 실무자 시절에 통하던 공식대로 움직이는 것입니다. 내가 직접 하고, 숫자로 판단하고, 결과로 증명하려는 방식입니다. 아래 카드의 따옴표 속 문장이 그 공식입니다.","<b>리더 행동</b>: 팀장 자리에서 필요한 방식입니다. 사람에게 맡겨 해내게 하고, 기준과 근거를 공개하고, 영향을 받는 사람에게 설명합니다.","막대와 숫자는 <b>리더 행동을 고른 비율(%)</b>입니다. 초록이 리더 행동, 분홍이 실무자 습관의 몫입니다. 큰 숫자는 이번 라운드, '누적'은 게임 처음부터입니다. '—'는 그 일이 드러난 결정이 아직 없다는 뜻입니다.","'자가진단'은 게임을 시작하기 전에 스스로 답한 점수입니다(높을수록 리더 행동). 실제 비율이 자가진단보다 15 이상 낮으면 맹점 후보로 표시합니다.","실무자 습관이 늘 나쁜 것은 아닙니다. 새벽 장애처럼 급한 순간에는 직접 처리가 맞을 때도 있습니다. 문제는 팀장이 되어서도 습관처럼 그 방식만 쓰는 것입니다."],
   body:`<div class="table" style="margin-top:14px">${[1,2,3,4].map(a=>`<div class="card habit"><div class="hrow"><b class="hname">${AXN3[a]}</b><span class="num"><b style="font-size:18px">${ax[a]??"—"}</b>${ax[a]!=null?"%":""} <span class="note">· 누적 ${axAll[a]??"—"}${axAll[a]!=null?"%":""}${self[a]!=null?` · 자가진단 ${self[a]}점`:""}</span></span></div>
    <div class="hbar"${ax[a]==null?' style="background:var(--line)"':""}><i style="width:${ax[a]??0}%"></i></div>
    <div class="hlr"><small><b style="color:var(--good)">리더 행동</b><br>${AXL[a][0]}</small><small><b style="color:var(--bad)">실무자 습관</b> · 통하던 공식 "${AXL[a][2]}"<br>${AXL[a][1]}</small></div>${gaps.includes(a)?`<small style="color:var(--bad)">맹점 후보 · 자가진단보다 ${self[a]-axAll[a]} 낮음</small>`:""}</div>`).join("")}</div>
   ${Lx.length||Px.length?`<div class="label" style="margin-top:14px">이번 라운드의 실제 선택</div><div class="table">${Lx.map(x=>`<div class="card"><b style="color:var(--good)">리더 행동</b> · ${AXN3[x.a]}<br><small>"${nameOf(x.scene)}"에서 「${chT(x.scene,x.choice)}」</small></div>`).join("")}${Px.map(x=>`<div class="card"><b style="color:var(--bad)">실무자 습관</b> · ${AXN3[x.a]}<br><small>"${nameOf(x.scene)}"에서 「${chT(x.scene,x.choice)}」</small></div>`).join("")}</div>`:""}
   ${kp?`<p class="note" style="margin-top:10px">리더를 아는 정도: 프로필 카드 ${kp[1]}칸 중 ${kp[0]}칸을 열었습니다. 리더가 중요하게 여기는 것, 거슬려하는 것, 걱정을 많이 알수록 맡기고 설명하기가 쉬워집니다.</p>`:""}${window.theoryCard?theoryCard(r):""}${G.selfStudy&&window.v3SelfStudyHtml?window.v3SelfStudyHtml(r):""}`,
   interp:it,q:worst!=null&&ax[worst]<80?`${AXN3[worst]}에서 실무자 시절의 습관대로 고른 순간을 떠올려 보세요. 시간이 모자라서였나요, 맡기거나 설명하기가 불안해서였나요, 그 방식이 맞다고 믿어서였나요?`:"다음 라운드에서 의식적으로 연습해 볼 습관 하나를 고른다면 무엇인가요?"});};
 /* ⑤ 다음 라운드 준비 */
 T[5]=()=>{const fv=(G.written&&G.written["focus"+r])||"";
  return sec({what:"이번 라운드를 바탕으로, <b>부족했던 점</b>과 <b>잘한 점</b>을 정리하고 <b>다음 라운드에 무엇에 주안점을 두고 판단할지</b> 정합니다.",
   how:["아래 목록은 앞의 탭에서 본 결정·계기판·리더·모듈·습관 기록에서 자동으로 뽑았습니다.","주안점은 다음 라운드에 실제로 만날 장면과 이어 두었습니다. 그 장면이 오면 이 페이지를 떠올리세요.","마지막 칸에 내 말로 다짐을 한 줄 쓰면, 다음 라운드 성적표 요약에서 다시 보여 줍니다."],
   body:`<div class="cols2"><div class="secbox weakbox"><div class="seclab">이번 라운드에서 부족했던 점</div>${weak.length?`<ol class="secul">${weak.slice(0,5).map(x=>`<li>${x}</li>`).join("")}</ol>`:"<p>눈에 띄게 부족한 점은 없었습니다.</p>"}</div>
   <div class="secbox goodbox"><div class="seclab">잘한 점</div>${good.length?`<ol class="secul">${good.slice(0,4).map(x=>`<li>${x}</li>`).join("")}</ol>`:"<p>이번 라운드에는 크게 두드러진 강점이 보이지 않았습니다.</p>"}</div></div>
   <div class="secbox focusbox"><div class="seclab">다음 라운드 주안점</div><ol class="secul">${focus.slice(0,4).map(x=>`<li>${x}</li>`).join("")}</ol></div>
   ${(window.NEXT_PREVIEW||{})[r]?`<div class="secbox"><div class="seclab">다음 라운드에 기다리는 일</div><p>${NEXT_PREVIEW[r]}</p></div>`:""}
   <label class="label" for="focusw" style="margin-top:14px;display:block">나의 다음 라운드 다짐 (한두 문장)</label><textarea id="focusw" placeholder="예: 다음 배분에서는 업무량 70 이상인 모듈을 먼저 확인하고, 줄인 이유를 리더들에게 직접 설명하겠다.">${String(fv).replace(/</g,"&lt;")}</textarea>`,
   interp:[],q:"다음 라운드에서 같은 상황이 오면, 이번과 무엇을 다르게 하겠습니까? 그 행동을 팀원이 알아챈다면 어떤 모습일까요?"});};
 const keepFocus=()=>{const f=$("focusw");if(f){G.written=G.written||{};G.written["focus"+r]=f.value.trim().slice(0,400);}};
 const draw=()=>{paint("");
  const last=tab===TABS.length-1;
  shell(`<div class="pane"><div class="eyebrow">Round ${r} 성적표 · ${RT[0]}</div><h2>${s.title}</h2>
  <div class="sctabs" role="tablist">${TABS.map((t,i)=>`<button class="sctab" role="tab" aria-selected="${i===tab}" ${A(()=>{keepFocus();tab=i;draw();window.scrollTo(0,0);})}>${t}</button>`).join("")}</div>
  <h3 class="sch">${TABS[tab]}</h3>
  <div class="sccontent">${T[tab]()}</div>
  <div class="foot">${tab>0?`<button class="btn" ${A(()=>{keepFocus();tab--;draw();window.scrollTo(0,0);})}>← ${TABS[tab-1]}</button>`:"<span></span>"}${last?`<button class="btn main" ${A(()=>{keepFocus();save();next();})}>${r<3?(G.selfStudy?"라운드 마치기 →":"다음: 결과 보내기 →"):"결산으로"}</button>`:`<button class="btn main" ${A(()=>{keepFocus();tab++;draw();window.scrollTo(0,0);})}>다음: ${TABS[tab+1]} →</button>`}</div></div>`);
  const f=$("focusw");if(f)f.oninput=()=>keepFocus();
 };
 draw();
};
/* 라운드 사이 대기 화면 */
SCENES.wait=function(s){
 const sc=window.v3MakeSaveCode?window.v3MakeSaveCode():"";
 shell(paint(`<div class="pane"><div class="eyebrow">Round ${s.round} 끝</div><h2>Round ${s.round}${s.round===2?"를":"을"} 마쳤습니다</h2>
 ${G.selfStudy?"":(window.rcCard?rcCard(s.round):"")}
 <div class="prose"><p>${G.selfStudy?"준비되면 아래 '다음 라운드 화면으로'를 눌러 이어서 하세요.":s.round===1?"다음 라운드는 내일 강의 뒤에 진행합니다. 강사가 안내하면 아래 '다음 라운드 화면으로'를 누르세요.":"마지막 라운드는 내일 완결 강의 뒤에 진행합니다. 강사가 안내하면 아래 '다음 라운드 화면으로'를 누르세요."} 진행은 이 브라우저에 저장되었습니다. 창을 닫아도 됩니다.</p></div>
 ${sc?`<details class="rc-more rc-save"><summary>다른 PC·태블릿에서 이어하기 코드</summary><div style="margin-top:8px;display:grid;gap:6px"><div class="codebox" id="sv_box" style="max-height:72px;overflow-y:auto;font-size:11.5px">${sc}</div><div class="btns"><button class="btn" ${A(()=>{try{navigator.clipboard.writeText(sc);toast("기기 이전용 복원 코드를 복사했습니다.");}catch(e){toast("코드를 직접 선택해 복사해 주세요.");}})}>복원 코드 복사</button></div></div></details>`:""}
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
 R31a,R31b,"9-4","11-4","6-4a","6-4b",S2,S3,"12-3a","12-3","12-4","12-6","END12",{id:"V3END",type:"v3final",month:12,bare:true,title:"결산"},"FINALE"];
const MONTH={"RET2":4,"6-1":6,"6-1p":6,"5-4":6,"END6":6,"8-1a":8,"8-1b":8,"8-1c":8,"6-3":8,"4-4":8,"6-2":9,"9-7":9,"END9":9,"9-4":10,"11-4":11,"6-4a":11,"6-4b":11};
const list=ORDER.map(x=>typeof x==="string"?get(x):x);
list.forEach(s=>{if(MONTH[s.id])s.month=MONTH[s.id];});
CONTENT.length=0;list.forEach(s=>CONTENT.push(s));
/* index.html에 v3ui.js 태그가 누락된 경우에만 자동 로드 후 boot() 실행.
   판정은 boot() 호출 시점에 한다. v3.js가 읽히는 순간에는 뒤쪽 script 태그가 아직 DOM에 없어,
   그때 판정하면 v3ui.js가 두 번 실행되고 모든 감싸기(스트레스·지표 근거 등)가 이중으로 걸린다 (2026-11-21 수정) */
if(typeof document!=="undefined"){
 const _boot=window.boot;
 window.boot=function(){
  if(window.openProfile||typeof _boot!=="function")return _boot&&_boot.apply(this,arguments);
  const sc=document.createElement("script");sc.src="v3ui.js";
  sc.onload=sc.onerror=function(){_boot();};
  document.head.appendChild(sc);
 };
}
})();

/* 맥락 없이 짧게 끝나던 확률 결과·대사를 1~2문장으로 풀어 쓴다 (2026-11-20). 효과와 확률은 그대로 */
{const LINE_FIX={"첫 토론에서 서하준과 문지원이 크게 부딪쳤습니다.": "첫 토론 안건이 AI 도구 도입이었습니다. 빨리 써 보자는 서하준과 규정부터 보자는 문지원이 크게 부딪쳤습니다.", "\"팀장이 이수진하고만 이야기한다\"는 말이 돌았습니다.": "모듈별로 따로 만나는 첫 순서가 어제까지 같은 모듈이던 이수진이었습니다. \"팀장이 이수진하고만 이야기한다\"는 말이 돌았습니다.", "생산 쪽은 팀장님이 손 놓으셨다던데요.": "강태식 선배한테 들었는데, 생산 쪽은 팀장님이 아예 손을 놓으셨다던데요. 정말 생산 보고는 안 받으시는 거예요?", "\"팀장이 강태식한테 배우러 다닌다\"는 말이 돌기 시작했습니다.": "매주 강태식에게 생산 구조를 배우러 가는 모습이 보이자, 다른 모듈에서 \"새 팀장이 선배한테 배우러 다닌다\"는 말이 돌기 시작했습니다.", "강태식: \"그래, 그 말 지켜 봐.\"": "강태식: \"모듈마다 같은 방식이라. 그래, 그 말 지켜 봐. 생산만 따로 손대는 일만 없으면 나도 따를게.\"", "\"제 점검은 몇 점이에요?\" 문의가 쌓였습니다.": "기준과 비중까지 공개하자 \"제 점검 한 건은 몇 점이에요?\" 같은 문의가 쌓였습니다. 답하느라 다음 달 팀장 시간이 줄었습니다.", "사소한 점검을 부풀리는 일이 생겼습니다.": "예방 활동이 점수가 된다는 걸 알자, 사소한 점검까지 건수로 올리는 사람이 생겼습니다.", "모듈마다 설명이 달라지고 있습니다.": "항목만 공개하고 비중은 면담에서 설명하다 보니, 같은 기준을 모듈마다 다르게 설명하고 있습니다.", "리더들이 자기 모듈에 직접 설명하기 시작했습니다.": "리더들과만 맞춘 기준을 리더들이 알아서 자기 모듈 팀원에게 설명하기 시작했습니다. 생각보다 잘 퍼졌습니다.", "구성원들은 아직 기준을 보지 못했습니다.": "리더들과만 맞췄기 때문에, 팀원들은 아직 자신이 무엇으로 평가받는지 모릅니다.", "넘길 곳이 조달이면 1년 내내 못 넘겨요.": "현업에 넘긴 건수로 세신다고요? 제 실험 결과를 받아 줄 곳이 대부분 조달인데, 문지원 리더는 그렇게 빨리 받아 주지 않아요. 1년 내내 하나도 못 넘길 수도 있어요.", "건수를 채우려 작은 실험만 늘어나고 있습니다.": "실험 건수가 KPI가 되자, 건수를 채우려고 결과가 뻔한 작은 실험만 늘고 토큰이 새고 있습니다.", "실험 하나가 사내 표준이 됐습니다.": "R&D가 자유롭게 돌린 실험 하나가 성과를 내 사내 표준 도구로 채택됐습니다.", "여기서 뭘 더 할 수 있죠?": "R&D도 운영 지표로만 평가받는다면, 제가 여기서 새로 시도할 수 있는 게 뭐가 남죠? 솔직히 다른 데서도 연락이 와요.", "서하준이 운영 지표 개선을 자기 과제로 들고 왔습니다.": "서하준이 운영 지표를 AI로 개선하는 방안을 스스로 과제로 들고 왔습니다.", "\"조달은 AI 안 해도 되는 곳\"이라는 말이 돌았습니다.": "조달만 AI 목표가 빠지자, 다른 모듈에서 \"조달은 AI 안 해도 되는 곳\"이라는 말이 돌았습니다. 서하준이 특히 못마땅해합니다.", "문지원의 계획이 아직 일정으로 내려오지 않았습니다.": "방식과 일정을 문지원에게 맡겼더니, 자동화 계획이 아직 '검토 중'에서 움직이지 않습니다.", "강태식: \"그 두 개가 왜 내 모듈부터야?\"": "강태식: \"새로 더하는 항목 두 개, 왜 하필 생산부터 넣는 거야? 다른 모듈은 작년 그대로잖아.\"", "올라온 초안에 예방과 주니어 기여 항목이 없습니다.": "강태식이 직접 쓴 생산 KPI 초안에는 장애 복구 시간만 있고, 예방 점검과 주니어 기여 항목은 빠져 있습니다.", "작년보다 높은 목표를 써 왔습니다.": "강태식이 초안에 작년보다 높은 목표를 스스로 써 왔습니다.", "강태식의 불만이 깊어졌습니다.": "생산만의 사정을 봐주지 않자 강태식의 불만이 깊어졌습니다. 다음 배분 회의에서 더 세게 반대할 것 같습니다.", "강태식: \"같은 잣대면 나도 할 말 없지.\"": "강태식: \"모든 모듈에 같은 잣대라면 나도 할 말 없지. 대신 생산만 예외로 손대는 일은 없게 해.\"", "재발 없는 건 운 아니에요?": "재발이 없던 기간을 실적으로 친다고요? 장애가 안 난 건 운일 수도 있잖아요. 그럼 밤새 불 끈 사람은 뭐가 됩니까?", "사소한 점검이 늘고 있습니다.": "예방 건수가 KPI가 되자, 큰 의미 없는 사소한 점검으로 건수를 채우는 일이 늘고 있습니다.", "예방이 처음으로 월간 보고서에 숫자로 실렸습니다.": "그동안 보이지 않던 예방 활동이 처음으로 월간 보고서에 숫자로 실렸습니다.", "\"팀장 옛 모듈이라 봐준다\"는 말이 돌았습니다.": "측정 방법을 이수진에게 맡긴 것을 두고, \"팀장이 어제까지 있던 모듈이라 봐준다\"는 말이 돌았습니다.", "기록에 한 선임 이름이 형식적으로만 올라갔습니다.": "참여자별 기여를 기록하게 했지만, 제안서를 실제로 쓴 한 선임의 이름은 맨 아래 형식적으로만 올라갔습니다.", "받아 온 일의 운영 부담이 다른 모듈로 넘어가고 있습니다.": "정다은이 수주액을 채우려고 받아 온 일의 운영 부담이 생산과 가공 모듈로 넘어가고 있습니다.", "그럼 저는 뭘 보고 뛰죠?": "수주액 비중을 줄이면, 영업하는 저는 뭘 보고 뛰어야 하죠? 고객 유지 지표는 제가 혼자 움직일 수 있는 숫자가 아니잖아요.", "이틀 뒤 보안팀이 먼저 알았습니다.": "우리가 범위를 파악하는 이틀 사이, 보안팀이 다른 경로로 먼저 알았습니다. \"왜 바로 신고하지 않았느냐\"는 질문이 돌아왔습니다.", "팀에 선이 분명해졌습니다.": "공개 조치 뒤로 팀원들 사이에 '고객 데이터는 절대 외부 도구에 넣지 않는다'는 선이 분명해졌습니다.", "고칠 항목에서 빠진 쪽이 \"저희는요?\"라고 묻습니다.": "고칠 한 가지를 정해 알리자, 그 항목에서 빠진 모듈 리더가 \"저희 모듈 문제는요?\"라고 묻습니다.", "모듈마다 대응이 달라지고 있습니다.": "설문 대응을 리더들에게 맡겼더니, 어떤 모듈은 바로 바꾸고 어떤 모듈은 그대로라 팀원들이 차이를 느끼고 있습니다.", "\"팀장이 강태식한테 밀렸다\"는 말이 돌았습니다.": "회의에서 바로 답하지 않고 넘긴 것을 두고, \"팀장이 강태식한테 밀렸다\"는 말이 돌았습니다.", "회의가 공개 말다툼으로 번졌습니다.": "모두 앞에서 근거를 다시 짚자 강태식이 맞받아쳤고, 회의가 공개 말다툼으로 번졌습니다.", "강태식: \"그래. 기록해 둬. 6월에 볼 거니까.\"": "강태식: \"그래, 그 근거 기록해 둬. 분기 끝에 결과가 그 말대로 나오는지 볼 거니까.\"", "문지원까지 다음 회의에 나오지 않았습니다.": "강태식의 반대를 그대로 넘기자, 강태식과 가까운 문지원까지 다음 회의에 나오지 않았습니다.", "\"그럼 왜 그 숫자를 주셨죠?\"": "헬씨푸드 임원: \"140시간이 추정치였다면, 처음에 그 숫자를 왜 저희에게 주셨죠?\"", "본사 재무가 \"2년 약정은 팀장 권한 밖\"이라고 합니다.": "본사 재무팀이 \"2년 약정은 팀장이 정할 수 있는 범위가 아니다\"라며 제동을 걸었습니다.", "헬씨푸드 임원: \"실측 자료는 어디 있습니까?\"": "헬씨푸드 임원: \"실측으로 확인된 절감만 반영하자면서, 그 실측 자료는 지금 어디 있습니까?\"", "본사 재무가 인하분을 어디서 메울지 묻습니다.": "본사 재무팀이 \"운영비 5%를 깎아 준 만큼 팀 이익은 어디서 메웁니까?\"라고 묻습니다.", "우선 협상권이 10월 대형 수주에서 유리한 조건이 될 것 같습니다.": "받아 둔 우선 협상권 덕분에, 하반기 신규 수주에서 유리한 위치에 설 것 같습니다.", "신규 과제가 벌써 네 건인데요": "신규 과제를 또 두 건 받으셨다고요? R&D가 맡은 게 벌써 네 건인데요. 이대로면 하나도 제대로 못 끝냅니다.", "다음 달부터 가공의 점검 보고가 형식만 남았습니다.": "복구한 생산만 상을 받자, 가공 모듈의 점검 보고가 다음 달부터 형식만 남았습니다. 막아 봐야 인정받지 못한다는 분위기입니다.", "이수진: \"불 낸 데랑 같이 받으라고요?\"": "강태식: \"장애를 낸 가공이랑 상을 같이 받으라고? 밤새 복구한 건 우리야.\"", "본사가 \"한 건에 한 모듈만\"이라며 돌려보냈습니다.": "본사가 \"추천은 한 건에 한 모듈만 됩니다\"라며 공동 추천을 돌려보냈습니다.", "7월이 되어도 자리가 잡히지 않았습니다.": "추천을 쉬고 기준부터 정하기로 했지만, 분기가 지나도록 장애 공로를 보는 기준은 정해지지 않았습니다.", "본사 인력기획: \"그럼 그동안 보낸 효과 숫자는 뭡니까.\"": "본사 인력기획: \"실제 절감이 그것뿐이라면, 그동안 올려 보낸 효과 숫자는 뭡니까?\"", "가는 사람이 \"다녀오면 제 자리 있나요?\"라고 묻습니다.": "파견 가는 팀원이 \"6개월 다녀오면 제 자리가 그대로 있긴 한가요?\"라고 묻습니다.", "받아 둔 일은 그대로라 일이 넘칩니다.": "신규 과제 칸을 줄였지만 이미 받아 둔 일은 그대로라, 남은 사람들에게 일이 넘칩니다.", "서하준이 과제 하나를 스스로 접었습니다.": "AI 칸이 줄자 서하준이 진행 중이던 과제 하나를 스스로 접었습니다.", "강태식: \"이번엔 해 보겠습니다.\" 야간을 재편했습니다.": "강태식: \"운영 칸이 줄었으니 이번엔 우리가 방식을 바꿔 보죠.\" 강태식이 야간 대기표를 직접 재편했습니다.", "어느 모듈도 일을 덜지 못했습니다.": "모든 칸에서 조금씩 덜어 냈지만, 어느 모듈도 실제로 일을 덜지는 못했습니다.", "리더들이 서로 겹치는 일을 찾아 왔습니다.": "몫을 나눠 지게 하자, 리더들이 모듈끼리 겹치는 일을 찾아 줄여 왔습니다.", "\"제 모듈 사람 일을 또 팀장이 정하시네요\"": "강태식: \"김 사원 대기를 빼는 것까지 팀장이 정하시네요. 제 모듈 사람 일은 저한테 먼저 말해 주셔야죠.\"", "제가 못 버틴 것처럼 보이잖아요": "갑자기 대기에서 빠지면, 다들 제가 못 버텨서 빠진 걸로 볼 거예요. 그게 더 힘들어요.", "\"괜찮습니다\"로 끝났습니다.": "쉴지 말지를 김 사원에게 맡기자, 김 사원은 \"괜찮습니다\" 한마디로 대화를 끝냈습니다. 쉬지 않을 것 같습니다.", "강태식: \"제 모듈 사람한테 왜 일을 바로 줍니까.\"": "강태식: \"김 사원은 제 모듈 사람인데, 왜 저를 건너뛰고 일을 바로 줍니까?\"", "초안은 강태식 이름으로 올라갔습니다.": "김 사원이 쓴 야간 경고 규칙 초안이 강태식 이름으로 올라갔습니다.", "\"팀장이 또 글쓴이를 찾는다\"는 말이 돌았습니다.": "한 선임을 따로 부른 것이 알려지자, 게시판에 \"팀장이 또 익명 글쓴이를 찾는다\"는 말이 돌았습니다.", "게시판에 \"규칙만 만드네요\"라는 댓글이 달렸습니다.": "표지 규칙을 새로 만들자, 게시판에 \"사람 얘기는 안 듣고 규칙만 만드네요\"라는 댓글이 달렸습니다.", "정다은이 한 선임에게 \"게시판에 썼어?\"라고 물었습니다.": "정리를 맡은 정다은이 한 선임을 불러 \"혹시 게시판에 그 글 썼어?\"라고 물었습니다. 한 선임은 움츠러들었습니다.", "고르지 않은 문항을 낮게 준 사람들이 조용해졌습니다.": "고칠 문항으로 고르지 않은 쪽에 낮은 점수를 준 사람들은, 자기 목소리가 빠졌다고 느끼고 조용해졌습니다.", "리더마다 설문을 읽는 눈이 달랐습니다.": "설문 결과를 리더들에게 나눠 맡기자, 같은 점수를 두고도 리더마다 해석과 대응이 달랐습니다.", "사후 감사에서 드러났습니다.": "아침에 사후 승인을 받으려던 우회가 감사에서 드러났습니다. 승인 없이 안전장치를 우회한 기록이 남았습니다.", "헬씨푸드 임원: \"정의 얘기로 시간을 끄시는군요.\"": "헬씨푸드 임원: \"산식 정의부터 맞추자는 건, 결국 시간을 끌자는 말씀이군요.\"", "헬씨푸드 법무 명의의 공문이 왔습니다.": "답을 다음 달로 미루자, 헬씨푸드 법무팀 명의로 조건 재협상을 요구하는 공문이 왔습니다.", "강태식: \"문서부터 만드네.\"": "강태식: \"고맙다는 말 다음에 바로 합의서부터 만드네. 역시 팀장은 문서로 일하는구나.\"", "강태식: \"나를 내보내려는 거야?\"": "강태식: \"다른 팀 팀장 후보로 추천한다고? 결국 나를 이 팀에서 내보내려는 거야?\"", "대화 뒤에도 떠나기로 했습니다.": "끝까지 이야기를 들었지만, 강태식은 대화 뒤에도 떠나기로 했습니다.", "면접을 취소했습니다.": "이야기를 나눈 뒤 강태식이 다른 회사 면접을 취소했습니다.", "그럼 예방은 깎인 거네요": "AI 항목을 20%로 넣느라 다른 항목을 고르게 줄이셨으면, 결국 예방 몫이 깎인 거네요. 올해 처음 기준에 들어간 건데요.", "인사팀: \"AI 실적의 정의는 전사 공통입니다.\"": "인사팀: \"AI 실적을 어떻게 셀지는 전사 공통 기준입니다. 팀마다 다르게 정할 수 없습니다.\"", "유예가 승인됐습니다.": "인사팀이 이 팀에는 지침 적용을 내년으로 미루는 유예를 승인했습니다.", "거절됐습니다. 인사팀 안대로 적용됩니다.": "인사팀이 유예 요청을 거절했습니다. 올해 평가부터 인사팀 지침대로 적용됩니다.", "\"3월에는 뭐였죠? 또 바뀌나요?\"": "팀원: \"연초에 받은 기준이랑 뭐가 달라진 거죠? 평가 전에 또 바뀌는 건 아니죠?\"", "모듈마다 설명이 달라졌습니다.": "리더들에게 전달을 맡기자, 바뀐 기준을 모듈마다 다르게 설명했습니다.", "9월에 알려 보니 다들 인사팀 공지로 이미 알고 있었습니다.": "평가 공지 때 알리려고 미뤘더니, 팀원들은 이미 인사팀 공지로 바뀐 내용을 먼저 알고 있었습니다.", "의견서 절반에 사실이 없어 되돌려 보냈습니다.": "리더 의견서를 확인해 보니 절반에 관찰한 사실 없이 인상만 적혀 있어서 되돌려 보냈습니다.", "\"친한 사람이 잘 받네요.\"": "익명 게시판: \"등급을 리더 의견대로만 정하니까, 결국 리더랑 친한 사람이 잘 받네요.\"", "\"KPI 다 채웠는데 왜요.\" 작년과 같은 말이 나왔습니다.": "\"KPI 다 채웠는데 왜 이 등급이에요?\" 작년 이의제기 때와 똑같은 말이 다시 나왔습니다.", "숫자라 말이 없습니다.": "KPI 순서로 정하니 숫자라서, 당장은 따지는 사람이 없습니다.", "김 사원이 8월까지 혼자 다듬어 왔습니다.": "미뤄 두자고 했는데도, 김 사원이 몇 달 동안 혼자 규칙 초안을 다듬어 가져왔습니다.", "현장 보고가 끊겨 헬씨푸드 통지가 늦어졌습니다.": "지휘를 강태식에게 넘기고 나니 현장 상황이 팀장에게 제때 올라오지 않았습니다. 그 사이 헬씨푸드 통지가 늦어졌습니다.", "본사 협의 일정이 12월 업무와 겹쳤습니다.": "약속한 본사 인력 협의가 12월 마감 업무와 겹쳐, 팀장 시간이 더 들었습니다.", "강태식의 후배들이 설계 회의에 불려 갔습니다.": "야간 설계가 공식 목표가 되자, 강태식이 후배들을 설계 회의에 직접 불러 함께 만들기 시작했습니다.", "대체 후보 얘기가 강태식의 귀에 들어갔습니다.": "대체 리더 후보를 뽑아 둔다는 얘기가 강태식의 귀에 들어갔습니다. \"이미 내 자리를 정리하는 중이었군.\"", "생산 모듈의 두 사람이 남겠다고 했습니다.": "따로 만난 생산 모듈 핵심 인력 두 사람이, 강태식이 어떻게 하든 팀에 남겠다고 했습니다."};
 const arr=x=>Array.isArray(x)?x:[];let n=0;
 const fixO=opts=>arr(opts).forEach(o=>{arr(o.tw).forEach(w=>{if(typeof w.t==="string"&&LINE_FIX[w.t]){w.t=LINE_FIX[w.t];n++;}});});
 CONTENT.forEach(s=>{fixO(s.options);fixO(s.levels);fixO(s.planb);arr(s.cases).forEach(c=>fixO(c.options));});
 const DONE_FIX={"1-4":{A:"강태식이 고개를 끄덕였습니다. 앞으로 생산 모듈 일은 강태식이 걸러서 필요한 것만 올립니다.",B:"강태식이 잠시 보더니 말했습니다. \"화요일 네 시. 늦으면 안 기다린다.\" 매주 30분, 생산 구조를 배우는 시간이 생겼습니다.",C:"강태식이 한참 쳐다보다 엘리베이터에 올랐습니다. 생산도 다른 모듈과 똑같이 보겠다는 뜻은 전해졌습니다."},"6-1p":{D:"협상선을 적지 않았습니다. 인하 폭은 헬씨푸드와 마주 앉은 자리에서 정하게 됩니다."}};
 Object.entries(DONE_FIX).forEach(([id,m])=>{const sc=CONTENT.find(x=>x.id===id);if(sc)arr(sc.options).forEach(o=>{if(m[o.k]){o.done=m[o.k];n++;}});});
 window.__lineFix=n;}

/* 4-3 강태식의 공개 반대: 한 문장이던 반대 대사를 이유가 보이도록 풀어 씀 (2026-11-21). 조건과 효과는 그대로.
   근거: 프로필(지금 걱정 R2 "AI 배분에서 생산이 밀리면 야간 대기가 더 몰린다", 아래에서 본 모습), 02-2 생산 업무량 70 */
{const s=CONTENT.find(x=>x.id==="4-3");if(s){
 const KO={RUN:"운영",AI:"AI 전환",GROW:"추가 제안",SEC:"예방·보안"};
 const n=(g,k)=>g.cells?g.cells[k]??0:0;
 const plan=g=>g.cells?Object.keys(KO).map(k=>`${KO[k]} ${n(g,k)}칸`).join(" · "):"";
 s.intro=["4월 리더 회의. 방금 확정한 여력 배분안이 화면에 올라오자, 생산 리더 강태식이 볼펜을 내려놓는다. 팀장이 되기 전까지 선배로 모시던 사람이 다섯 리더 앞에서 처음으로 반대를 꺼낸다. 옆자리의 조달 리더 문지원은 고개를 끄덕인다.",
  g=>g.cells?`화면의 배분안: ${plan(g)}`:"",
  "강태식이 문제 삼는 것은 두 가지다. 운영(RUN) 칸이 실제로 밤에 설 사람으로 이어지는가, 그리고 생산의 일을 정하면서 생산 리더와 먼저 이야기했는가."];
 const REP=[
  [/이걸로 야간을 어떻게 돌립니까/,g=>`강태식: "운영이 ${n(g,"RUN")}칸이면 야간을 어떻게 돌립니까. 대기표에 이름만 많지, 실제로 밤에 설 수 있는 사람은 몇 안 됩니다. 지금도 그 몇 명이 돌아가며 새벽을 막고, 빈자리는 제가 메웁니다. ${(()=>{const o=["AI","GROW","SEC"].sort((x,y)=>n(g,y)-n(g,x))[0];return n(g,o)>n(g,"RUN")?`그런데 운영보다 ${KO[o]}에 더 많은 ${n(g,o)}칸을 붙였네요.`:"그런데 운영을 다른 칸보다 앞에 두지는 않았네요.";})()} 밤에 안 나오는 사람들이 정한 숫자로밖에 안 보입니다."`],
  [/AI에 줄 사람은 있고/,g=>`강태식: "운영에 ${n(g,"RUN")}칸 줬다고 하시죠. 그런데 AI 전환에는 그보다 많은 ${n(g,"AI")}칸이 갔습니다. 현장은 이 표를 우선순위로 읽어요. '생산은 버티고, 사람은 AI 쪽으로 간다'고요. 줬다는 말만 있고, 그 칸으로 밤에 설 사람이 실제로 늘어나는지는 어디에도 안 적혀 있습니다."`],
  [/숫자로는 운영에 줬다는 거죠/,g=>`강태식: "숫자로는 운영에 ${n(g,"RUN")}칸 줬다는 거죠. 그건 고맙습니다. 그런데 그 칸의 사람이 밤에 나오는지는 다른 얘기입니다. 칸은 낮 근무로 세지만 우리 일은 새벽에 터져요. 야간 대기를 누가 설지 정하지 않으면, 이 칸은 결국 서류에만 있는 숫자가 됩니다."`],
  [/지난번에도 묻지 않았잖아/,()=>`"지난번에도 저한테는 묻지 않으셨잖아요. 생산 일을 정하면서 생산 리더에게 먼저 묻지 않은 게 이번이 처음이 아닙니다."`],
  [/지난번에 말은 들었어/,()=>`"따로 하신 말씀은 들었어요. 그래도 생산 사람들이 이 회의 결과를 보고 있으니, 여기서 한 번은 말해 둬야겠습니다."`]];
 (s.conds||[]).forEach(c=>{const tx=String(typeof c.t==="function"?"":c.t);const r=REP.find(x=>x[0].test(tx));if(r)c.t=r[1];});
 /* v3에는 6월 재배분이 없다. 다음 조정은 10월(Round 3 시작)이다 */
 const fix6=x=>String(x).replace("6월 재배분 때","다음 배분 조정 때").replace("6월에 볼 거니까","다음 배분 때 볼 거니까");
 (s.options||[]).forEach(o=>{if(typeof o.t==="function"){const f=o.t;o.t=g=>fix6(f(g));}else if(typeof o.t==="string")o.t=fix6(o.t);(o.tw||[]).forEach(w=>{if(typeof w.t==="string")w.t=fix6(w.t);});});
}}
/* 전체 대사 점검 (2026-11-21): 맥락이 비어 있던 장면에 상황을 넣고, 120분판에서 옮겨 오며 어긋난 날짜·순서를 v3 흐름에 맞춘다.
   효과 · 확률 · 조건은 건드리지 않고 화면에 보이는 글만 바꾼다 */
{const all=[];CONTENT.forEach(x=>{all.push(x);if(Array.isArray(x.cases))x.cases.forEach(c=>all.push(c));});
 const F=id=>all.find(x=>x.id===id);
 const setOpt=(id,k,fn)=>{const s=F(id);if(!s)return;const os=Array.isArray(s.options)?s.options:[];const o=os.find(x=>x.k===k);if(o)fn(o);};
 const repCond=(id,re,txt)=>{const s=F(id);if(!s)return;(s.conds||[]).forEach(c=>{if(typeof c.t==="string"&&re.test(c.t))c.t=txt;});};
 const repIntro=(id,re,txt)=>{const s=F(id);if(!s||!Array.isArray(s.intro))return;s.intro=s.intro.map(x=>typeof x==="string"&&re.test(x)?txt:x);};
 /* 1. v3 순서에 맞는 시점 표시 (이전에는 8월 장면이 "4월", 11월 장면이 "6월"로 보였음) */
 const W={"RET2":"4월 시작","4-4":"8월","6-3_1":"8월","6-3_2":"8월","6-4a":"11월","6-4b":"11월"};
 Object.keys(W).forEach(id=>{const s=F(id);if(s)s.when=W[id];});
 /* 2. 제목 */
 [["4-5","헬씨푸드 운영비 협상"],["6-1","헬씨푸드 하반기 계약 협상"]].forEach(([id,ti])=>{const s=F(id);if(s)s.title=ti;});
 /* 3. 1월 · 엘리베이터 앞 */
 {const s=F("1-4");if(s)s.intro=["1월 둘째 주 금요일 저녁 7시. 퇴근하려는데 엘리베이터 앞에서 생산 리더 강태식과 마주쳤다. 입사 2년 선배이고, 이번 팀장 자리의 가장 유력한 후보였던 사람이다. 강태식이 먼저 말을 꺼낸다."];}
 /* 4. 3월 · KPI 합의서와 면담 */
 {const s=F("3-1");if(s&&Array.isArray(s.intro))s.intro=s.intro.concat(["작년 말 \"KPI를 다 채우고도 왜 B냐\"는 이의제기가 나온 것도 이 칸이 비어 있었기 때문이다. 여기서 정하는 기준이 올해 연말 평가의 잣대가 된다."]);}
 const KI={"3-2":"R&D 리더 서하준과의 KPI 면담. 서하준은 새 AI 도구라면 누구보다 먼저 써 보는 실험가다. R&D가 올해 무엇으로 평가받을지 정하는 자리다.",
  "3-3":"조달 리더 문지원과의 KPI 면담. 조달은 원물 발주와 감사, 보안 규정을 맡는다. 퓨쳐테크는 AI Native 전환을 선언했고, 모든 모듈에 AI 전환 목표를 기대하고 있다.",
  "3-4":"생산 리더 강태식과의 KPI 면담. 강태식이 써 온 생산 KPI는 장애 복구 시간이 중심이다. 팀장 자리를 두고 경쟁했던 선배의 모듈 숫자를, 후배 팀장이 처음으로 다시 짜는 자리다.",
  "3-5":"가공 리더 이수진과의 KPI 면담. 가공은 장애가 나기 전에 막는 예방 점검을 맡지만, 작년 평가표에는 예방 항목이 아예 없었다. 이수진은 어제까지 당신과 같은 모듈에서 일한 동료다.",
  "3-6":"마케팅 리더 정다은과의 KPI 면담. 정다은은 헬씨푸드 제안과 수주를 맡고, 1월 임원 보고의 제안서 발표도 정다은이 했다."};
 Object.keys(KI).forEach(id=>{const s=F(id);if(s)s.intro=[KI[id]].concat(Array.isArray(s.intro)?s.intro.filter(x=>x):[]);});
 setOpt("3-9","C",o=>{o.t="첫 분기라 아직 이르니 이번은 지켜보고, 다음 설문(9월) 결과와 묶어서 판단한다.";});
 /* 5. 4월 받은편지함 */
 {const s=F("4-1");if(s&&Array.isArray(s.mail))s.mail.forEach(m=>{
   if(m.id==="M26")m.body="4월 배분 회의 전에 한마디만 할게요. RUN(운영) 칸을 줄이면 생산 야간 대기는 못 돌립니다. 지금도 대기표에 이름만 많지, 실제로 밤에 서는 몇 명이 돌아가며 버티고 있어요. 생산 일을 정하는 거라면, 회의 자리에서 처음 듣는 일은 없게 해 주세요.";
   if(m.id==="M39")m.body="대기표상으로는 제 차례가 아닌 날에도, 야간 경고가 오면 집에서 열어 봐요. 근태가 찍히지 않게요. 저만 그런 건 아닌 것 같아요. 다들 다음 날 장애가 나면 어차피 우리가 하니까 미리 보는 거래요. 제가 말했다고는 안 해 주셨으면 해요.";
   if(m.id==="M41")m.body="지난달 제안서 마감 때, 헬씨푸드가 보낸 요구 문서를 제 개인 계정 외부 AI에 넣어 요약해 봤어요. 한 번이요. 지금은 안 써요. 3월 보안 사고 얘기를 듣고 나서야 문제라는 걸 알았어요. 이거 어디에 말해야 하나요?";});}
 /* 6. 4월 · 강태식의 공개 반대: v3에는 6월 재배분이 없다 */
 setOpt("4-3","C",o=>{o.done="안은 그대로 갑니다. 의견은 다음 배분 조정 때 받기로 했습니다.";});
 /* 7. 헬씨푸드 협상 */
 repIntro("4-5",/^헬씨푸드 회의실\. 임원이 부록을 펼쳐 놓는다\.$/,"4월, 헬씨푸드 회의실. 임원과 실무 담당 유 과장이 마주 앉았다. 임원이 1월에 받은 제안서의 부록을 펼쳐 놓는다. 부록의 '주 140시간 절감'은 각 모듈이 낸 추정을 합친 값이었다.");
 repIntro("6-1",/5월에 납품 수량이 틀어졌고/,"임원: \"5월 장애로 납품 집계가 늦어졌고, 그래도 효율은 올랐다고 하셨습니다. 하반기 운영비는 얼마나 내려갑니까?\"");
 /* 8. 5월 · 장애 공로 중재 */
 {const s=F("5-4");if(s&&Array.isArray(s.intro))s.intro=["5월, 가공 모듈에서 장애가 났다. 생산 모듈이 밤새 붙어 3시간 40분 만에 복구했다. 가공은 그 전 8개월 동안 같은 유형의 장애를 예방 점검으로 막아 왔다."].concat(s.intro);}
 /* 9. 8월 · 본사 차출 */
 {const s=F("8-1b");if(s&&Array.isArray(s.intro))s.intro=["본사 차출로 팀원이 빠지는 만큼 팀 여력도 줄어듭니다. 어느 칸의 사람이 빠지느냐에 따라 멈추는 일이 달라집니다."].concat(s.intro);}
 {const s=F("8-1c");if(s){const i0=s.intro;s.intro=[...(Array.isArray(i0)?i0:[]),"차출 결과를 팀원들에게 알릴 차례입니다. 누가 빠지고 어느 일이 줄어드는지, 팀원들은 아직 공문 제목만 봤습니다."];
  const f=s.options;const GL={A:["팀원들이 무엇이 왜 줄었는지 앎","칸이 줄어든 모듈의 반박이 나올 수 있음"],B:["빠르게 알려짐","왜 그 칸인지는 각자 짐작함"],C:["시간을 아낌","사정을 모르는 채 소문이 먼저 돎"]};
  const T={A:"차출 사유와 줄인 칸, 그렇게 정한 기준을 팀 전체에 설명한다",B:"빠지는 인원과 줄인 칸만 짧게 알린다. 길게 쓸수록 말이 붙는다",C:"본사 인사 사안이니 공지하지 않고, 모듈 리더가 필요한 만큼 전한다"}; /* C-1: 길이 맞춤 */
  s.options=g=>{const r=typeof f==="function"?f(g):f;(r||[]).forEach(o=>{if(o.t==="기준과 근거를 설명한다"||o.t===T.A){o.t=T.A;o.gl=o.gl||GL.A;(o.tw||[]).forEach(w=>{if(w.t==="반박이 붙었습니다.")w.t="설명을 올리자, 칸이 줄어든 모듈에서 \"왜 하필 우리 쪽이냐\"는 반박이 붙었습니다.";});}
   else if(o.t==="결과만 간단히 알린다"||o.t===T.B){o.t=T.B;o.gl=o.gl||GL.B;}else if(o.t==="따로 알리지 않는다"||o.t===T.C){o.t=T.C;o.gl=o.gl||GL.C;}});return r;};}}
 /* 10. 8월 · 구성원 장면 */
 {const s=F("6-3_1");if(s&&Array.isArray(s.intro))s.intro=["생산 모듈의 김 사원은 1월부터 야간 대기를 몰아서 서 왔다."].concat(s.intro);}
 repCond("6-3_1",/^1월에 가지 못한 금요일이 있다\.$/,"1월에 김 사원이 물었던 금요일 휴가는 결국 가지 못했다.");
 repIntro("4-4",/^사내 익명 게시판\.$/,"8월, 사내 익명 게시판에 글이 올라왔다. 마케팅 모듈의 헬씨푸드 제안서 이야기다.");
 repIntro("4-4",/^41시간 쓴 제안서, 표지에는 다른 이름$/,"제목: 41시간 쓴 제안서, 표지에는 다른 이름");
 repCond("4-4",/^지난달 한 선임에게 보낸 파일의 표지가 떠오른다\.$/,"1월에 검토했던 제안서 파일의 표지가 떠오른다.");
 repCond("4-4",/^면담에서 들은 말이 떠오른다\.$/,"1월 제안서 첨부 파일의 마지막 수정자가 한 선임이었던 것이 떠오른다.");
 /* 11. 10월 · 새벽 3시 */
 {const s=F("R3-1a");if(s)s.intro=["10월, 새벽 3시. 헬씨푸드 해외 공장 3번 라인에서 안전 인터록 센서 값이 시스템 기록과 맞지 않는다는 신호가 떴다. 인터록은 설비가 위험할 때 기계를 자동으로 멈추게 하는 안전장치다. 1등급 장애 절차에 따라, 먼저 지휘자 한 명을 정해야 한다."].concat(Array.isArray(s.intro)?s.intro.filter(x=>x):[]);}
 /* 12. 11월 · 강태식, 평가 지침 */
 repIntro("11-4_1",/^옥상\. 강태식이 내년 대기표 초안을 내민다\.$/,"11월, 점심시간. 강태식이 옥상으로 불렀다. 말없이 내년 야간 대기표 초안을 내민다.");
 setOpt("6-4b","C",o=>{o.t="12월 평가 공지 때 한 번에 알리기로 하고, 이번 달은 양식만 고쳐 놓는다.";});
 /* 13. 12월 · 연말 평가: v3의 직접 평가는 7명이다 (03-4 R3-4) */
 {const s=F("12-3a");if(s)s.intro=["12월. 인사시스템이 열렸습니다. 평가 대상은 팀원 30명 전원입니다. 이 가운데 7명(모듈 리더 5명과 구성원 2명)은 다음 화면에서 팀장이 직접 평가합니다.","나머지 23명은 모듈 리더들이 낸 의견서를 바탕으로 정합니다. 먼저 그 23명을 어떻게 확정할지 정하세요."];}
}
/* 3-8 돌발: 배경과 시간 압박이 보이도록 다시 씀 (2026-11-20). 효과는 그대로 */
{const s=CONTENT.find(x=>x.id==="3-8");if(s){
 s.title="고객 데이터가 외부 AI로 나갔다";
 s.intro=["목요일 오후 4시 40분. KPI 합의를 마무리하던 중에 조달 리더 문지원이 노트북을 들고 팀장 자리로 급히 옵니다.",
  "R&D 리더 서하준은 AI 도입을 가장 앞장서 밀어 온 사람입니다. 퓨쳐테크가 업무에 써도 된다고 승인한 AI 도구는 몇 개뿐이고, 이번 서비스는 그 목록에 없습니다. 서하준은 수요 예측 분석을 빨리 해 보려고, 퓨쳐테크가 승인하지 않은 외부 AI 서비스에 헬씨푸드 주문 데이터를 올렸습니다. 고객 정보는 가리고(마스킹) 올렸다고 생각했습니다."];
 s.say=[["src","팀장님, 잠깐만요. R&D 공유 폴더에 올라온 분석 화면 캡처인데, 헬씨푸드 주문번호랑 배송지가 그대로 보여요. 퓨쳐테크가 승인하지 않은 외부 AI 서비스 화면이고요."],
  ["rd","수요 예측을 돌려 보려고 제가 올렸습니다. 가린 줄 알았는데, 지금 확인해 보니 컬럼 몇 개가 빠져 있었어요. 올린 건 이틀 전입니다. …분석 결과는 정말 좋았는데요."]];
 const INTRO=s.intro,SAY=s.say;s.intro=[];s.say=[];
 s.top=()=>`<div class="prose">${para(INTRO)}</div>${SAY.map(x=>sayHtml(x[0],x[1])).join("")}<div class="happen alertbox"><span class="label">⏱ 왜 지금 정해야 하나</span>
· 데이터가 나간 지 <b>이미 이틀(48시간)</b>이 지났습니다.<br>
· 헬씨푸드와의 계약: 보안 사고는 알게 된 뒤 <b>24시간 안에</b> 헬씨푸드에 알려야 합니다.<br>
· 개인정보가 새어 나간 것이면, 퓨쳐테크는 <b>72시간 안에</b> 당국에 신고해야 합니다. 남은 시간은 하루 남짓입니다.<br>
· 지금 이 사실을 아는 사람은 팀장, 문지원, 서하준 셋뿐입니다. 퇴근 전에 정해야 합니다.</div><details class="ref" open><summary>규정집</summary><p style="margin-top:6px">고객 데이터가 외부로 나간 정황을 알게 되면, <b>그 즉시</b> 정보보안팀에 신고한다.</p></details>`;
 const C={"1월에 물어본 덕분에 어떤 로그인지 이미 알고 있다.":"1월에 서하준에게 외부 AI에 어떤 로그를 넣었는지 물어 두었고, 그 답이 메신저에 남아 있습니다.", /* 1단계: 어느 선택지 편도 들지 않게 사실만 (조건·효과는 그대로) */
  "1월 연휴부터 쓰고 있었다.":"알고 보니 R&D는 1월 연휴 때부터 이 서비스를 써 왔습니다. 1월에 AI 사용을 따로 확인하지 않아서 아무도 몰랐습니다.",
  "2월 시범 범위 밖에서 쓰고 있었다.":"알고 보니 2월에 정한 AI 시범 범위 밖에서 쓰고 있었습니다.",
  "서하준이 쓰던 규칙 초안대로 로그가 남아 있다.":"서하준이 1월에 쓰던 AI 사용 규칙 초안대로 사용 기록이 남아 있어, 무엇이 나갔는지 추적할 수 있습니다.",
  "정보보안팀: \"1월 점검표부터 늦으셨죠.\"":"정보보안팀이 이미 이 팀을 지켜보고 있습니다. \"1월 보안 점검표 제출도 늦으셨죠. 이번엔 늦으면 안 됩니다.\""};
 (s.conds||[]).forEach(c=>{if(typeof c.t==="string"&&C[c.t])c.t=C[c.t];});
 const oldTail=s.tail;s.tail=(g,o)=>{const r=oldTail&&oldTail(g,o);if(r&&r.who==="rd")r.t="팀장님이 AI 활용을 평가 기준에 넣겠다고 하셨잖아요. 그래서 서두른 건데, 이제 와서 제 잘못만 되는 건가요?";return r;};
 s.ask="퇴근 전까지 무엇부터 할까요?";
 const G2={A:["절차대로 바로 처리됨","조사로 AI 시범이 멈추고 R&D가 위축됨"],B:["무엇이 나갔는지 정확히 알고 보고함","신고 시한(24시간·72시간)을 넘길 수 있음"],C:["팀 전체에 선이 분명해짐","서하준이 모두 앞에서 책임을 짐"]};
 s.options.forEach(o=>{if(G2[o.k])o.gl=G2[o.k];});
 const B=s.options.find(o=>o.k==="B");if(B)B.t="바로 사용을 멈추게 하고, 무엇이 얼마나 나갔는지 우리가 먼저 파악한 다음 보안팀에 알린다.";
}}

/* 돌발 장면 경고 배너: 사이렌(사고·장애) · 전화벨(고객) · 경고 삼각형(지침 변경) (2026-11-20) */
{const ICON={
 siren:`<svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true"><g class="rays" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><line x1="20" y1="2" x2="20" y2="7"/><line x1="6.5" y1="8" x2="10" y2="11.5"/><line x1="33.5" y1="8" x2="30" y2="11.5"/><line x1="2" y1="20" x2="7" y2="20"/><line x1="38" y1="20" x2="33" y2="20"/></g><path d="M11 31v-8.5a9 9 0 0 1 18 0V31z" fill="currentColor"/><path d="M15.5 22.5a4.5 4.5 0 0 1 4.5-4.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/><rect x="8" y="31" width="24" height="5" rx="1.5" fill="currentColor" opacity=".75"/></svg>`,
 phone:`<svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true"><g class="rays" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M26 6a10 10 0 0 1 8 8"/><path d="M25 12a4.5 4.5 0 0 1 3.5 3.5"/></g><path class="aring" d="M13.5 5.5l4 6.5-3 3c1.8 3.8 4.7 6.7 8.5 8.5l3-3 6.5 4-1.8 5.3c-.4 1.2-1.6 2-2.9 1.9C15.5 34.8 5.2 24.5 4.3 12.2c-.1-1.3.7-2.5 1.9-2.9z" fill="currentColor"/></svg>`,
 notice:`<svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true"><path d="M20 4L37 34H3z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><rect x="18.3" y="14" width="3.4" height="11" rx="1.5" fill="#fff"/><circle cx="20" cy="29.5" r="2" fill="#fff"/></svg>`};
 const ALERTS={
  "3-8":{lv:"red",icon:"siren",tag:"긴급 · 보안 사고 의심",line:"헬씨푸드 고객 데이터가 승인되지 않은 외부 AI로 나갔습니다.",chips:["유출 후 48시간 경과","헬씨푸드 통보 24시간 안","당국 신고 72시간 안"]},
  "R3-1a":{lv:"red",icon:"siren",tag:"긴급 · 1등급 장애",line:"새벽 3시, 해외 공장 3번 라인 센서 이상. 지휘자를 정해야 합니다.",chips:["고객 통지 30분 안","납기 내일 아침"]},
  "R3-1b":{lv:"red",icon:"siren",tag:"긴급 · 현장 안전",line:"3번 라인을 세울지, 돌릴지 지금 정해야 합니다.",chips:["인터록 우회는 승인 필수","납기 내일 아침"]},
  "9-4":{lv:"orange",icon:"phone",tag:"돌발 · 고객 항의 전화",line:"헬씨푸드 임원이 계약 조건을 다시 보겠다고 합니다.",chips:["가용성 99.4% → 98.7%","계약 재협상 요구"]},
  "6-4a":{lv:"amber",icon:"notice",tag:"돌발 · 인사팀 공문",line:"하반기 평가부터 평가 지침이 바뀝니다. 3월에 합의한 기준을 다시 봐야 합니다.",chips:["AI 활용 효과 20% 이상","하반기 평가부터 적용"]},
  "6-4b":{lv:"amber",icon:"notice",tag:"돌발 · 인사팀 공문",line:"바뀐 평가 지침을 팀에 어떻게 알릴지 정해야 합니다.",chips:["하반기 평가부터 적용"]}};
 window.alertHtml=s=>{const a=s&&ALERTS[s.id];if(!a)return "";
  return `<div class="alertbar ${a.lv}" role="alert"><span class="siren">${ICON[a.icon]}</span><div class="atext"><b class="lv">${a.tag}</b><div class="aline">${a.line}</div>${a.chips&&a.chips.length?`<div class="chips">${a.chips.map(c=>`<span>${c}</span>`).join("")}</div>`:""}</div></div>`;};
 if(!document.getElementById("alert-css")){const st=document.createElement("style");st.id="alert-css";st.textContent=`
.alertbar{--ac:#c5221f;--abg:#fdecea;--atx:#7a1712;display:flex;gap:14px;align-items:center;background:var(--abg);border:1.5px solid var(--ac);border-radius:14px;padding:12px 16px;margin:0 0 16px;color:var(--atx);animation:alertPulse 1.6s ease-in-out infinite}
.alertbar.orange{--ac:#d35400;--abg:#fff1e6;--atx:#7a3300}
.alertbar.amber{--ac:#b7791f;--abg:#fff8e1;--atx:#6b4a00;animation:none}
.alertbar .siren{color:var(--ac);flex:0 0 auto;display:flex}
.alertbar .rays{animation:alertFlash .7s steps(2,jump-none) infinite}
.alertbar.orange .aring{transform-origin:20px 20px;animation:alertRing 1.2s ease-in-out infinite}
.alertbar .lv{display:inline-block;background:var(--ac);color:#fff;border-radius:6px;padding:2px 9px;font-size:13px;letter-spacing:.02em}
.alertbar .aline{margin-top:5px;font-weight:600;line-height:1.5}
.alertbar .chips{margin-top:4px}
.alertbar .chips span{display:inline-block;border:1px solid var(--ac);background:#fff;color:var(--atx);border-radius:999px;padding:1px 9px;margin:4px 6px 0 0;font-size:12.5px;font-weight:600}
.happen.alertbox{background:#fff5f4;border:1px solid #f1b6b1;border-left:5px solid #c5221f}
.happen.alertbox .label{color:#c5221f}
@keyframes alertPulse{0%,100%{box-shadow:0 0 0 0 rgba(197,34,31,.35)}50%{box-shadow:0 0 0 7px rgba(197,34,31,0)}}
@keyframes alertFlash{0%{opacity:1}100%{opacity:.15}}
@keyframes alertRing{0%,60%,100%{transform:rotate(0)}10%,30%,50%{transform:rotate(-12deg)}20%,40%{transform:rotate(12deg)}}
@media (prefers-reduced-motion:reduce){.alertbar,.alertbar .rays,.alertbar .aring{animation:none}}
@media (max-width:520px){.alertbar{padding:10px 12px;gap:10px}.alertbar svg{width:30px;height:30px}}`;document.head.appendChild(st);}
}

/* 인물 얼굴: 원피스풍 만화 초상 (2026-11-20). 굵은 외곽선, 웃으면 이를 드러낸 큰 웃음, 언짢으면 이를 악물고 핏대.
   신뢰 66 이상 웃음 · 35 이하 언짢음. 원작 캐릭터를 옮긴 것이 아니라 이 게임 인물들에 그림체만 입혔다 */
{const OL="#161210",OW=2.1;
 const HAIRS={
 spiky:{front:"M26 48C22 27 35 13 51 13C67 13 79 25 74 48L71 41L68 34L64 42L60 32L55 41L50 31L45 41L40 32L36 42L32 35L29 45Z M47 15L52 3L57 15Z",ln:"M44 20L41 30M57 19L60 29M50 16L50 25",hi:"M37 21Q50 15 63 20"},
 crew:{front:"M28 45C26 25 37 16 50 16C63 16 74 25 72 45L70 38L66.5 33L62.5 36L58.5 30.5L54.5 34.5L50 29.5L45.5 34.5L41.5 30.5L37.5 35.5L34 32.5L30.5 38.5Z M29.5 38L30.5 51L33.5 40Z M70.5 38L69.5 51L66.5 40Z",ln:"M40 22L38 28M50 19L50 26M60 22L62 28",hi:"M38 22Q50 18 62 22"},
 long:{back:"M24 44C22 24 36 13 50 13C64 13 78 24 76 44L78 96L62 96L63 66L37 66L38 96L22 96Z",front:"M27 47C25 26 37 14 50 14C64 14 76 26 73 47L70.5 39C66 33 60 29 53 27C50 34 42 38.5 31.5 41.5Z",lock:"M29.5 40C26.5 58 27.5 76 30.5 93L39 91C36 77 35 58 36 44Z M70.5 40C73.5 58 72.5 76 69.5 93L61 91C64 77 65 58 64 44Z",ln:"M44 20Q38 26 35 35M58 19Q64 26 67 36M33 60L34 84M67 60L66 84",hi:"M40 20Q50 16 60 19"},
 bob:{back:"M23 47C21 24 36 13 50 13C64 13 79 24 77 47L79 71C73 75 66 73 64 69L36 69C34 73 27 75 21 71Z",front:"M26 47C25 26 37 15 50 15C63 15 75 26 74 47L71.5 41L67.5 37.5L65 42.5L60 36.5L57 41.5L52 35.5L48 41.5L43 36.5L40 42.5L35 37.5L31.5 43.5Z",lock:"M28.5 40C27.5 52 28.5 63 31.5 69L36 67C34 58 34 50 35 42Z M71.5 40C72.5 52 71.5 63 68.5 69L64 67C66 58 66 50 65 42Z",ln:"M42 21L40 31M58 21L60 31M50 18L50 27",hi:"M38 21Q50 16 62 21"},
 pony:{back:"M61 21C81 15 92 35 88 58C86 71 79 79 72 82C77 67 78 48 70 34Z M25 47C23 25 37 14 50 14C64 14 77 25 75 47Z",front:"M27 48C25 26 37 14 50 14C64 14 76 26 73 47L70.5 37C66 31 60 27 55 26C52 33.5 44 38.5 34.5 40.5L30.5 47Z",lock:"M29.5 41C28.5 52 29.5 61 33 66L36 52Z",ln:"M45 19Q40 25 37 33M57 19Q61 24 63 30M78 40Q82 52 79 66",hi:"M39 20Q49 16 58 18"}};
 const JAW={
  round:"M29 45C29 30 38 23 50 23C62 23 71 30 71 45C71 58 64 70 50 72.5C36 70 29 58 29 45Z",
  sharp:"M30 44C30 30 38 24 50 24C62 24 70 30 70 44C70 56 63 67 55 72C52 74 48 74 45 72C37 67 30 56 30 44Z",
  square:"M28 43C28 29 37 23 50 23C63 23 72 29 72 43L72 56C72 65 66 72.5 57 74.5L43 74.5C34 72.5 28 65 28 56Z",
  long:"M31 42C31 29 39 23 50 23C61 23 69 29 69 42C69 57 64 70 55 74.5C52 76 48 76 45 74.5C36 70 31 57 31 42Z"};
 const P={
  rd:{st:"spiky",jaw:"round",h:"#27365c",hh:"#4f6db0",iris:"#2f6fd0",cl:"hoodie",c:"#2fa39a",c2:"#1f7a73",phones:1},
  src:{st:"long",jaw:"long",h:"#6e432b",hh:"#a2714f",iris:"#8a5426",cl:"blouse",c:"#f1e6cf",c2:"#ffffff",fem:1,glass:1},
  mfg:{st:"crew",jaw:"square",h:"#1d1d1d",hh:"#4d4d4d",iris:"#3b2b20",cl:"jacket",c:"#33495f",c2:"#e3e6ea",sharp:1,thick:1,stub:1},
  prc:{st:"bob",jaw:"sharp",h:"#7a3f8c",hh:"#b77ac6",iris:"#9246b0",cl:"cardigan",c:"#e0896e",c2:"#fff3e8",fem:1,pin:"#ffcb3d"},
  mkt:{st:"pony",jaw:"sharp",h:"#e0562a",hh:"#ff9466",iris:"#239a55",cl:"blazer",c:"#c9283a",c2:"#ffffff",fem:1,ear:"#ffcb3d",tie:"#ffcb3d"},
  kim:{st:"spiky",jaw:"round",h:"#3a2c1f",hh:"#73593f",iris:"#6b4626",cl:"jacket",c:"#6f8296",c2:"#eef1f4"},
  yoon:{st:"crew",jaw:"long",h:"#a3a3a3",hh:"#d6d6d6",iris:"#4f3f33",cl:"cardigan",c:"#5f7550",c2:"#f0ece2",glass:1,thick:1},
  oh:{st:"pony",jaw:"round",h:"#94481f",hh:"#c97b4f",iris:"#8a5426",cl:"blouse",c:"#f0c45a",c2:"#fff8e6",fem:1,tie:"#3f86b8"},
  han:{st:"long",jaw:"sharp",h:"#1c1c22",hh:"#565670",iris:"#4f3f74",cl:"blouse",c:"#6f56a0",c2:"#f4f0fa",fem:1},
  cha:{st:"bob",jaw:"round",h:"#5c3b26",hh:"#93684d",iris:"#4f8a2e",cl:"cardigan",c:"#3f8f6c",c2:"#eef5ef",fem:1},
  bae:{st:"crew",jaw:"square",h:"#4a3628",hh:"#80634f",iris:"#3b2b20",cl:"jacket",c:"#454e59",c2:"#dde1e6",thick:1,stub:1},
  anon:{st:"spiky",jaw:"round",h:"#9aa0a6",hh:"#c8cdd1",iris:"#6f777e",cl:"jacket",c:"#a3a9ae",c2:"#e8eaec"}};
 const SK="#f9d9bd",SKD="#e9b48e";let N=0;
 const stk=`stroke="${OL}" stroke-width="${OW}" stroke-linejoin="round"`;
 const eye=(cx,cy,sd,o,mood)=>{
  if(mood>0&&!o.fem)return `<path d="M${cx-4.6} ${cy+1.2}Q${cx} ${cy-4.8} ${cx+4.6} ${cy+1.2}" stroke="${OL}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  if(o.fem){const rx=4.6,ry=6;
   return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" stroke="${OL}" stroke-width="1"/><ellipse cx="${cx+sd*.2}" cy="${cy+.8}" rx="3.4" ry="4.4" fill="${o.iris}"/><circle cx="${cx+sd*.2}" cy="${cy+1}" r="2.1" fill="${OL}"/><circle cx="${cx+1.4}" cy="${cy-1.4}" r="1.5" fill="#fff"/><circle cx="${cx-1.2}" cy="${cy+2.8}" r=".7" fill="#fff"/>`+
    `<path d="M${cx-sd*5.6} ${cy-1.6}Q${cx} ${cy-ry-2.6} ${cx+sd*5.4} ${cy-2.6}l${sd*2.4} -2.4M${cx+sd*5.2} ${cy-1}l${sd*2.6} -.4" stroke="${OL}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;}
  if(o.sharp)return `<path d="M${cx-sd*4.6} ${cy+.4}Q${cx} ${cy-3.6} ${cx+sd*5.4} ${cy-1.4}Q${cx+sd*1} ${cy+3.6} ${cx-sd*4.6} ${cy+.4}Z" fill="#fff" stroke="${OL}" stroke-width="1"/><circle cx="${cx+sd*.6}" cy="${cy}" r="2" fill="${OL}"/><circle cx="${cx+sd*.6+.7}" cy="${cy-.8}" r=".6" fill="#fff"/><path d="M${cx-sd*5} ${cy-.4}Q${cx} ${cy-4.6} ${cx+sd*5.8} ${cy-2}" stroke="${OL}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
  return `<ellipse cx="${cx}" cy="${cy}" rx="4.3" ry="5" fill="#fff" stroke="${OL}" stroke-width="1"/><circle cx="${cx+sd*.3}" cy="${cy+.6}" r="2.5" fill="${OL}"/><circle cx="${cx+sd*.3+1}" cy="${cy-.5}" r=".85" fill="#fff"/><path d="M${cx-4.6} ${cy-2.4}Q${cx} ${cy-6.6} ${cx+4.6} ${cy-2.4}" stroke="${OL}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;};
 const brow=(cx,by,sd,mood,o)=>{const oe=cx+sd*6,ie=cx-sd*4.6;const oy=mood<0?by-1.6:by+.4,iy=mood<0?by+3.4:by+(mood>0?-.6:.6),qy=mood>0?by-2.8:by-1.4;const w=o.thick?3.8:o.fem?1.9:2.8;
  return `<path d="M${oe} ${oy}Q${cx} ${qy} ${ie} ${iy}" stroke="${OL}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;};
 const mouthOf=(mood,o)=>{
  if(mood>0)return `<path d="M39.5 60.5Q50 74 60.5 60.5Q50 63 39.5 60.5Z" fill="#fff" ${stk}/><path d="M41.5 62.6Q50 65 58.5 62.6M45 62.4L45.6 67M50 63L50 68.6M55 62.4L54.4 67" stroke="${OL}" stroke-width="1" fill="none"/><path d="M37.5 59.5q1.8 1.2 2.4 3M62.5 59.5q-1.8 1.2-2.4 3" stroke="${OL}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
  if(mood<0)return `<path d="M42.5 62.5Q50 60.5 57.5 62.5L57 67Q50 68.6 43 67Z" fill="#fff" ${stk}/><path d="M42.8 64.8Q50 63.6 57.2 64.8M46.5 61.8L46.5 67.6M50 61.4L50 68M53.5 61.8L53.5 67.6" stroke="${OL}" stroke-width="1" fill="none"/>`;
  return `<path d="M44.5 64Q50 66 55.5 63" stroke="${OL}" stroke-width="1.9" fill="none" stroke-linecap="round"/>`;};
 const clothes=o=>{const body=`<path d="M10 102C12 86 27 78 42 76L58 76C73 78 88 86 90 102Z" fill="${o.c}" ${stk}/>`;
  if(o.cl==="hoodie")return body+`<path d="M32 81Q50 94 68 81Q62 74.5 50 74.5Q38 74.5 32 81Z" fill="${o.c2}" ${stk}/><path d="M45 86L44 98M55 86L56 98" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`;
  if(o.cl==="blouse")return body+`<path d="M42 76L50 86L45 92L36.5 79Z M58 76L50 86L55 92L63.5 79Z" fill="${o.c2}" ${stk}/>`;
  if(o.cl==="jacket")return body+`<path d="M43 76L50 93L57 76Z" fill="${o.c2}" ${stk}/><path d="M43 76L48 91L39 86Z M57 76L52 91L61 86Z" fill="#00000033" ${stk}/>`;
  if(o.cl==="cardigan")return body+`<path d="M42 76Q50 85 58 76L57 102L43 102Z" fill="${o.c2}" ${stk}/><circle cx="56" cy="88" r="1" fill="${OL}"/><circle cx="56" cy="95" r="1" fill="${OL}"/>`;
  return body+`<path d="M43 76L50 91L57 76Z" fill="${o.c2}" ${stk}/><path d="M42 76L49 93L38.5 84Z M58 76L51 93L61.5 84Z" fill="#00000040" ${stk}/>`;};
 face=function(k,t){const o=P[k]||P.anon,H=HAIRS[o.st],p=LD[k]||PP[k]||{n:""};const id="fc"+(++N);
  const mood=t==null?0:t>=66?1:t<=35?-1:0;
  return `<svg viewBox="0 0 100 100" role="img" aria-label="${p.n}"><defs><clipPath id="${id}"><circle cx="50" cy="50" r="50"/></clipPath></defs><circle cx="50" cy="50" r="50" fill="var(--tile)"/><g clip-path="url(#${id})"><g transform="translate(50 48) scale(1.22) translate(-50 -48)">`+
   (H.back?`<path d="${H.back}" fill="${o.h}" ${stk}/>`:"")+clothes(o)+
   (o.phones?`<path d="M36 80Q50 90 64 80" stroke="#3a3a3a" stroke-width="3" fill="none"/><rect x="31" y="76" width="7" height="9" rx="3" fill="#ff7a3d" ${stk}/><rect x="62" y="76" width="7" height="9" rx="3" fill="#ff7a3d" ${stk}/>`:"")+
   `<path d="M44 63L56 63L56 79Q50 82 44 79Z" fill="${SK}" ${stk}/><path d="M44.5 67Q50 75 55.5 67L55.5 72Q50 77 44.5 72Z" fill="${SKD}"/>`+
   `<ellipse cx="30.5" cy="50" rx="3.4" ry="5" fill="${SK}" ${stk}/><ellipse cx="69.5" cy="50" rx="3.4" ry="5" fill="${SK}" ${stk}/><path d="${JAW[o.jaw]}" fill="${SK}" ${stk}/>`+
   (o.stub?`<path d="M34 59C37 69 44 73.5 50 73.5C56 73.5 63 69 66 59C62 66 57 69 50 69C43 69 38 66 34 59Z" fill="#3a2e28" opacity=".28"/>`:"")+
   (o.jaw==="square"?`<path d="M48.5 72.2Q50 73.6 51.5 72.2" stroke="${OL}" stroke-width="1" fill="none"/>`:"")+
   eye(41,50.5,-1,o,mood)+eye(59,50.5,1,o,mood)+
   `<path d="M50.5 54.5Q48 58.6 51 59.3" stroke="${OL}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`+mouthOf(mood,o)+
   (mood>0&&o.fem?`<path d="M34 57.5l1.6-2M36.5 58l1.6-2M39 58.3l1.4-1.8M61 58.3l1.4-1.8M63.5 58l1.6-2M66 57.5l1.6-2" stroke="#e8606a" stroke-width="1.1" stroke-linecap="round"/>`:"")+
   (o.glass?`<g fill="none" stroke="${OL}" stroke-width="1.6"><rect x="34" y="44.5" width="14" height="11.5" rx="2.5"/><rect x="52" y="44.5" width="14" height="11.5" rx="2.5"/><path d="M48 49.5Q50 48.3 52 49.5M34 48L30 47M66 48L70 47"/></g><path d="M36 46.5l3 3M54 46.5l3 3" stroke="#fff" stroke-width="1.2" opacity=".8"/>`:"")+
   (H.lock?`<path d="${H.lock}" fill="${o.h}" ${stk}/>`:"")+`<path d="${H.front}" fill="${o.h}" ${stk}/>`+
   `<path d="${H.ln}" stroke="${OL}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".7"/><path d="${H.hi}" stroke="${o.hh}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`+
   brow(41,41.4,-1,mood,o)+brow(59,41.4,1,mood,o)+
   (o.pin?`<rect x="61.5" y="30.5" width="9" height="3" rx="1.4" transform="rotate(-25 66 32)" fill="${o.pin}" stroke="${OL}" stroke-width="1"/>`:"")+
   (o.tie?`<circle cx="66" cy="22.5" r="3" fill="${o.tie}" stroke="${OL}" stroke-width="1.2"/>`:"")+
   (o.ear?`<circle cx="30" cy="57" r="1.9" fill="${o.ear}" stroke="${OL}" stroke-width="1"/><circle cx="70" cy="57" r="1.9" fill="${o.ear}" stroke="${OL}" stroke-width="1"/>`:"")+
   (mood<0?`<path d="M63.5 29.5q3 0 3 3M71.5 29.5q-3 0-3 3M63.5 37.5q3 0 3-3M71.5 37.5q-3 0-3-3" stroke="#e0262f" stroke-width="2" fill="none" stroke-linecap="round"/>`:"")+`</g></g></svg>`;};
}

window.SC_NICK={"1-3":"올해의 핵심 과제","1-5":"첫 주간 회의","3-1":"KPI 합의서 · 기여 기준","3-9":"1분기 펄스 서베이","RET2":"되돌아온 일","4-2":"여력 배분","4-3":"강태식의 공개 반대","4-5":"헬씨푸드 운영비 협상 (2차)","6-1":"헬씨푸드 운영비 협상 (3차)","6-1p":"헬씨푸드 협상 · 재검토 조건","5-4":"장애 대응 포상 추천","8-1a":"본사 인력 차출 · 대응","8-1b":"본사 차출 · 줄일 칸","8-1c":"본사 차출 · 알리기","6-3":"김 사원의 야간 대기","4-4":"표지에는 다른 이름","S1":"청구서 · 미뤄 둔 일의 대가","S2":"청구서 · 미뤄 둔 일의 대가","6-2":"세 개의 설명","9-7":"3분기 펄스 서베이","R3-0":"Round 3 배분 조정","R3-1a":"새벽 장애 · 지휘자 지정","9-4":"헬씨푸드 임원 전화","11-4":"강태식의 거취","6-4a":"인사팀 평가 지침 변경","6-4b":"바뀐 지침 알리기","12-3":"연말 평가 등급 배분","12-4":"이의 면담","12-6":"평가 결과 공지","R1-pick":"KPI 합의 (면담·문서)","3-1-3":"KPI 합의서 · 재검토 조건","4-2b":"AI 토큰 배분","3-2":"KPI 합의 · 서하준(R&D)","3-3":"KPI 합의 · 문지원(조달)","3-4":"KPI 합의 · 강태식(생산)","3-5":"KPI 합의 · 이수진(가공)","3-6":"KPI 합의 · 정다은(마케팅)","R3-1b":"새벽 장애 · 3번 라인 판단","12-3a":"연말 평가 · 나머지 구성원"};
if(!document.getElementById("sc-css")){const st=document.createElement("style");st.id="sc-css";st.textContent=`
.sch{font-size:17px;margin:26px 0 6px}
.sch .note{font-weight:400;font-size:13px}
.scgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:10px 0}
.sccard{background:var(--panel2,var(--tile));border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:4px}
.sccard>span{font-weight:600;color:var(--ink)}
.sccard .def{color:var(--muted);font-size:12px;line-height:1.45}
.sccard .v{font-size:19px;margin-top:2px}
.sccard .why{font-size:12px;line-height:1.55;color:var(--muted);border-top:1px dashed var(--line);padding-top:6px;margin-top:auto}`;document.head.appendChild(st);}

/* 결과 코드 보내기 카드 (2026-11-26): 성적표의 '결과 코드' 탭 대신, 라운드 끝 화면과 결산 마지막 쪽에 한 장으로.
   코드 내용·형식은 그대로. 설명은 단계 그림과 접는 칸으로 줄였다 */
window.rcCard=function(r){
 const esc=x=>String(x??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const code=v3ResultCode(r),when=r<3?"내일 아침 피드백 세션":"종합 디브리핑";
 const IN=["별칭","이끄는 방식","주요 결정의 선택","다섯 가지 점수","자가진단과 실제 습관","걸린 시간"],OUT=["실명·사번","직접 쓴 글","메일 답장 내용"];
 const copy=()=>{const n=document.getElementById("rc-nick");if(n)G.nick=n.value.trim().slice(0,20);save();const c=v3ResultCode(r);rcPaint(r,c);
  const ok=document.getElementById("rc-ok"),done=()=>{if(ok)ok.innerHTML=`<b>✓ 복사했습니다</b> · 끝 네 글자 ${esc(c.slice(-4))}`;const cd=document.querySelector(".rc-card");if(cd)cd.classList.add("sent");toast(r<3?"결과 코드를 복사했습니다. 안내받은 곳에 붙여 넣어 주세요.":"최종 결과 코드를 복사했습니다.");};
  const fail=()=>{const d=document.getElementById("rc-full-d");if(d)d.open=true;const t=document.getElementById("rc-full");if(t){t.focus();t.select();}if(ok)ok.textContent="자동 복사가 막혔습니다. 아래 칸에서 직접 복사해 주세요.";};
  try{navigator.clipboard.writeText(c).then(done,fail);}catch(e){fail();}};
 return `<section class="rc-card" aria-labelledby="rc-h" data-r="${r}">
  <div class="rc-hd"><span class="rc-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3.4 11.2 19.6 4.3c.8-.3 1.5.4 1.2 1.2l-6.9 16.2c-.3.8-1.5.8-1.8-.1l-2-6.1-6.1-2c-.9-.3-.9-1.5-.1-1.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m10.4 13.6 4.4-4.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
   <div><b id="rc-h">${r<3?"결과 코드를 강사에게 보내 주세요":"최종 결과 코드를 강사에게 보내 주세요"}</b><span>결과는 자동으로 모이지 않습니다. 보낸 코드로 ${when}에서 반 전체 결과를 함께 봅니다.</span></div></div>
  <ol class="rc-steps">
   <li><i>1</i><div><b>별칭</b><input id="rc-nick" value="${esc(G.nick||"")}" placeholder="예: 판교곰" maxlength="20" aria-label="별칭, 실명과 사번은 쓰지 않기" autocomplete="off"><small>실명·사번 대신. 비워 둬도 됩니다.</small></div></li>
   <li><i>2</i><div><b>복사</b><button type="button" class="rc-copy" ${A(copy)}>코드 복사</button><small id="rc-ok" aria-live="polite">버튼 한 번이면 됩니다.</small></div></li>
   <li><i>3</i><div><b>붙여 넣기</b><span class="rc-where">강사가 안내한 단톡방·설문</span><small>처음부터 끝까지 그대로</small></div></li>
  </ol>
  <div class="rc-code" title="${esc(code)}"><code id="rc">${esc(code.slice(0,22))}…${esc(code.slice(-10))}</code><span class="rc-tail">끝 네 글자 <b id="rc-tail">${esc(code.slice(-4))}</b></span></div>
  <div class="rc-mores">
   <details class="rc-more"><summary>코드에 담기는 것</summary><div class="rc-chips">${IN.map(x=>`<span class="in">${x}</span>`).join("")}${OUT.map(x=>`<span class="out">${x}</span>`).join("")}</div><p class="note0">결과는 교육에만 쓰이고 인사 평가와 이어지지 않습니다.</p></details>
   <details class="rc-more" id="rc-full-d"><summary>코드 전체 보기</summary><textarea id="rc-full" readonly rows="3" aria-label="결과 코드 전체">${esc(code)}</textarea></details>
   <details class="rc-more"><summary>강사는 이 코드를 어디에 쓰나요?</summary><ol class="rc-fac"><li>강사가 <a href="facilitator.html" target="_blank" rel="noopener">진행자 집계 페이지</a>에 모인 코드를 한 줄에 하나씩 붙여 넣습니다.</li><li>같은 갈림길에서 각 선택을 고른 인원, 그 사람들의 지표 평균, 반 전체의 습관 맹점, 걸린 시간이 나옵니다.</li><li>'발표 모드'로 별칭을 가린 채 화면에 띄워 피드백 세션을 진행합니다.</li></ol><p class="note0">계산은 강사의 브라우저 안에서만 하고 어디로도 보내지 않습니다. 따로 로그인하는 강사 모드는 없습니다.</p></details>
  </div></section>`;};
window.rcPaint=function(r,c0){const c=c0||v3ResultCode(r);const e=document.getElementById("rc"),t=document.getElementById("rc-tail"),f=document.getElementById("rc-full"),cd=document.querySelector(".rc-card");
 if(e)e.textContent=c.slice(0,22)+"…"+c.slice(-10);if(t)t.textContent=c.slice(-4);if(f)f.value=c;if(cd)cd.querySelector(".rc-code").title=c;};
document.addEventListener("input",e=>{if(e.target&&e.target.id==="rc-nick"){G.nick=e.target.value.trim().slice(0,20);const cd=document.querySelector(".rc-card");if(cd){if(cd.classList.contains("sent")){cd.classList.remove("sent");const ok=document.getElementById("rc-ok");if(ok)ok.textContent="별칭이 바뀌었습니다. 다시 복사해 주세요.";}rcPaint(+cd.dataset.r||1);}try{save();}catch(err){}}});
/* 결과 코드 설명 (2026-11-20) */
window.rcExplain=function(r){return `<div class="prose" style="font-size:14.5px"><p>아래 긴 글자 줄은 <b>이번 라운드 결과를 한 줄로 압축한 코드</b>입니다. 이 게임은 각자의 브라우저에서만 돌아가서, 결과가 강사에게 자동으로 모이지 않습니다. 그래서 이 코드를 강사에게 보내는 방식으로 반 전체 결과를 모읍니다.</p></div>
<div class="steps"><div><b>1</b> <span> · '코드 복사'를 누르고, 강사가 안내한 곳(메신저, 설문 등)에 붙여 넣어 보냅니다.</span></div><div><b>2</b> <span> · 강사가 모든 코드를 집계 페이지에 한꺼번에 넣습니다.</span></div><div><b>3</b> <span> · ${r<3?"다음 날 아침 피드백 세션":"종합 피드백 세션"}에서 반 전체 결과를 함께 봅니다. 같은 갈림길에서 동료들은 어떤 길을 골랐고 결과가 어땠는지, 반 전체가 자주 놓친 습관은 무엇인지를 봅니다.</span></div></div>
<div class="scgrid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))"><div class="sccard"><span style="color:var(--good)">들어가는 것</span><small class="def" style="font-size:13px">별칭 · 고른 이끄는 방식 · 주요 결정의 선택지 · 고객·재무·구성원·서비스 안정·헬씨푸드 만족 점수 · 자가진단과 실제 습관 비율 · 걸린 시간</small></div><div class="sccard"><span style="color:var(--bad)">들어가지 않는 것</span><small class="def" style="font-size:13px">실명·사번 · 직접 쓴 글(과제 근거, 공지문, 설명) · 메일 답장 내용. 결과는 교육에만 쓰이고 인사 평가와 이어지지 않습니다.</small></div></div>
<p class="note">별칭은 집계 화면에서 내 결과를 찾는 이름표입니다. 비워 두어도 됩니다. 코드 맨 끝 네 글자는 복사하다 잘리거나 바뀌지 않았는지 확인하는 검사용 숫자라서, 코드는 처음부터 끝까지 그대로 보내야 합니다.</p><details class="ref"><summary>강사는 이 코드를 어디에 쓰나요? (강사 모드 안내)</summary><div style="margin-top:6px;font-size:14px;line-height:1.65"><p>따로 로그인하는 강사 모드는 없습니다. 강사는 같은 주소의 <a href="facilitator.html" target="_blank" rel="noopener">진행자 집계 페이지(facilitator.html)</a>를 엽니다.</p><p>① 학습자들이 보낸 코드를 한 줄에 하나씩 붙여 넣고 '집계하기'를 누릅니다. ② 같은 갈림길에서 각 선택을 고른 인원과 그 사람들의 지표 평균, KPI 조건 충족 인원, 반 전체의 습관 맹점 후보, 소요 시간이 나옵니다. ③ '발표 모드'를 켜면 별칭을 가린 채 화면에 띄워 피드백 세션을 진행할 수 있습니다.</p><p>계산은 강사의 브라우저 안에서만 하고 어디로도 보내지 않습니다. 라운드 시작 화면에서 '시작하기'를 누르면 바로 시작합니다. 강사 없이 혼자 할 때는 '혼자 진행 (해설 포함)'을 누르면 성적표에 피드백 세션을 대신하는 해설이 붙습니다.</p></div></details>`;};

if(!document.getElementById("sc2-css")){const st=document.createElement("style");st.id="sc2-css";st.textContent=`
.sctabs{display:flex;flex-wrap:wrap;gap:6px;margin:14px 0 4px;position:sticky;top:0;z-index:2;background:var(--bg,var(--panel));padding:6px 0}
.sctab{font:inherit;font-size:14px;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:999px;padding:6px 14px;cursor:pointer}
.sctab[aria-selected="true"]{background:var(--ink);color:var(--panel);border-color:var(--ink);font-weight:600}
.secbox{background:var(--tile);border-radius:14px;padding:12px 16px;margin:10px 0;font-size:14.5px;line-height:1.65}
.secbox p{margin:2px 0 6px}
.seclab{font-size:12px;font-weight:700;letter-spacing:.02em;color:var(--muted);margin-top:4px}
.secul{margin:4px 0 2px;padding-left:18px}.secul li{margin:3px 0}
.sum3{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin:12px 0}
.sumc{font:inherit;text-align:left;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:2px;cursor:pointer}
.sumc:hover{border-color:var(--ink)}
.sumc b{font-size:16px;margin-top:6px}.sumc small{color:var(--muted);font-size:12px}.sumc em{font-style:normal;font-size:12.5px;color:var(--muted);margin-top:8px}
.chain{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:6px 0}
.chain>span{color:var(--muted);font-size:18px}
.cbox{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:8px 12px;min-width:92px;display:flex;flex-direction:column}
.cbox small{color:var(--muted);font-size:12px}.cbox b{font-size:18px}
.habit{display:grid;gap:6px}
.sccontent .card b,.sccontent .card small b{font-size:inherit}
.sccontent .card b.hname{font-size:16px}
.hrow{display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap}
.hbar{height:8px;border-radius:999px;background:color-mix(in srgb,var(--bad) 35%,transparent);overflow:hidden}
.hbar i{display:block;height:100%;background:var(--good)}
.hlr{display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12.5px;line-height:1.5;color:var(--muted)}
@media (max-width:560px){.hlr{grid-template-columns:1fr}}`;document.head.appendChild(st);}
/* 성적표 · 결정 돌아보기용 코칭 노트 (2026-11-20). sit 상황, pt 쟁점, ld 좋은 리더라면, best 리더 행동에 가까운 선택 */
window.COACH={
 "1-3":{sit:"올해 정말 풀어야 할 핵심 과제 세 가지를 고르고, 고른 근거를 썼습니다.",pt:"급한 일과 팀의 1년을 좌우할 일은 다릅니다.",ld:"좋은 리더라면 당장 시끄러운 일보다 팀의 1년을 좌우할 구조적인 문제를 고릅니다. 근거에는 어떤 기준으로 골랐는지, 누구의 어떤 사정을 고려했는지, 언제까지 무엇을 할지를 담습니다.",best:[]},
 "1-5":{sit:"첫 주간 회의. AI 도구를 두고 서하준과 문지원이 부딪치고, 시니어 강태식은 말이 없습니다.",pt:"회의 방식이 누가 말하고 누가 침묵할지를 정합니다.",ld:"좋은 리더라면 회의를 보고하는 자리가 아니라 쟁점을 다루는 자리로 바꿉니다. 안건을 미리 공유해 준비할 시간을 주거나(B), 말이 적은 사람을 따로 만나 듣습니다(C). 익숙한 보고 방식(A)은 편하지만 쟁점을 회의 밖으로 밀어냅니다.",best:["B","C"]},
 "1-4":{sit:"엘리베이터 앞. 입사 2년 선배 강태식이 \"생산은 내가 알아서 할게\"라고 선을 긋습니다.",pt:"선배를 존중하는 것과 생산 모듈에서 손을 떼는 것은 다릅니다.",ld:"세 선택지 모두 리더 행동의 한 면입니다. A는 맡기기, B는 관계를 여는 설명, C는 모듈 간 형평입니다. 좋은 리더라면 선배의 전문성을 인정하면서도 팀장으로서 봐야 할 것은 보는 관계를 만듭니다. 관계 초기에는 배우겠다며 정기적으로 만나는 B가 관계와 정보를 함께 얻기 쉽습니다. A는 편하지만 생산 소식이 끊기고, C는 원칙은 맞지만 첫 주부터 정면으로 부딪칩니다. 그래서 이 장면은 맞고 틀림을 판정하지 않습니다.",best:[]},
 "3-1":{sit:"인사팀 양식의 '등급 기여 기준' 칸을 채우고, 그 기준을 어디까지 알릴지 정합니다. 전임 팀장은 '종합 판단'이라고만 적었습니다.",pt:"기준이 공개되지 않으면 팀원은 무엇을 해야 인정받는지 모릅니다.",ld:"좋은 리더라면 드러나지 않는 기여까지 넣은 기준을 팀 전체에 공개합니다(A). 점수를 따지는 문의가 늘어나는 비용은 생기지만, '종합 판단'만 적던 시절의 불신을 끊는 첫걸음입니다. 리더에게만 알리면(C) 구성원은 기준을 모른 채 1년을 보냅니다.",best:["A"]},
 "3-1-3":{sit:"KPI 합의서에, 상황이 크게 바뀌면 기준을 다시 볼 조건을 적어 둘지 정합니다.",pt:"한 해 동안 상황은 반드시 바뀝니다.",ld:"좋은 리더라면 무엇이 바뀌면 언제 누구와 다시 볼지를 미리 합의해 둡니다(A). 그래야 기준을 바꿀 때 '그때그때 바꾼다'는 말을 듣지 않습니다.",best:["A"]},
 "R1-pick":{sit:"리더 다섯 명과 KPI를 합의해야 하는데, 직접 만날 수 있는 사람은 최대 세 명입니다. 만나지 않은 리더는 자기에게 유리한 KPI를 문서로 써 옵니다.",pt:"누구를 만나느냐가 어떤 기준이 문서로만 정해지는지를 정합니다.",ld:"좋은 리더라면 편한 사람이 아니라 이견이 가장 크거나 팀 목표와 어긋날 위험이 큰 사람부터 만납니다. 이번 판에서는 예방을 원하는 이수진(가공), 생산 KPI를 그대로 쓰려는 강태식, 수주액 하나만 원하는 정다은이 그런 사람들이었습니다.",best:[]},
 "3-2":{sit:"서하준이 \"실패한 실험까지 실험 건수로 KPI에 넣어 달라\"고 합니다.",pt:"실험할 자유와 운영 성과 사이의 균형입니다.",ld:"좋은 리더라면 실험 건수 대신 '현업에 넘긴 건수'처럼 팀 목표와 이어진 결과로 잡고, 실패 기록도 기여로 인정합니다(A). 원하는 대로 다 들어주면(B) 실험이 운영 개선으로 이어지는지 볼 수 없습니다.",best:["A"]},
 "3-3":{sit:"문지원이 \"조달은 사고가 안 나는 게 성과인데, AI 목표는 올해 넣지 말아 달라\"고 합니다.",pt:"불안을 인정하는 것과 전환에서 빼 주는 것은 다릅니다.",ld:"좋은 리더라면 '무사고는 성과로 안 보인다'는 불안을 인정하면서도, 조달만 전환에서 빠지게 두지 않습니다. 작은 자동화 1건을 목표로 넣거나(A), 방식과 속도는 문지원이 정하게 맡깁니다(C).",best:["A","C"]},
 "3-4":{sit:"강태식이 \"작년 KPI 그대로 하자, 내 모듈 숫자는 내가 제일 잘 안다\"고 합니다.",pt:"선배의 경험을 존중하면서 바꿔야 할 것을 바꾸는 일입니다.",ld:"좋은 리더라면 작년 KPI를 바탕으로 두되, 바꿔야 할 항목은 이유를 밝혀 더합니다(A). 다른 모듈과 똑같이 맞추는 C도 형평을 세우는 리더 행동이지만, 선배와 정면으로 부딪치는 비용이 큽니다. 초안을 통째로 맡기면(B) 예방과 주니어 기여가 빠질 수 있습니다.",best:["A","C"]},
 "3-5":{sit:"이수진이 \"예방은 어떻게 세실 거예요? 건수로 세면 다들 건수를 만들 거예요\"라고 묻습니다.",pt:"눈에 띄지 않는 예방을 어떻게 인정할 것인가.",ld:"좋은 리더라면 예방을 건수로 세지 않습니다. 건수는 건수 채우기를 부릅니다. 재발이 없던 기간과 개선 내역처럼 예방의 질을 보는 근거를 정하거나(A), 측정 방법을 현장을 가장 잘 아는 이수진이 제안하게 맡깁니다(C). C는 '옛 동료라 봐준다'는 말이 돌 수 있으니, 맡긴 이유를 다른 리더들에게도 설명해야 합니다.",best:["A","C"]},
 "3-6":{sit:"정다은이 \"제 KPI는 수주액 하나로, 깔끔하게 해 달라\"고 합니다.",pt:"숫자 하나는 깔끔하지만, 누가 일했는지와 그 일의 부담을 가립니다.",ld:"좋은 리더라면 숫자 하나로 끝내지 않습니다. 수주액을 쓰더라도 실제로 제안서를 쓴 사람의 기여가 남게 하거나(A), 받아 온 일이 다른 모듈에 주는 부담을 함께 봅니다(C). 수주액 하나(B)는 '일은 주니어가 하고 이름은 리더가'라는 불만의 씨앗이 됩니다.",best:["A","C"]},
 "3-8":{sit:"승인되지 않은 외부 AI 서비스로 헬씨푸드 고객 데이터가 나간 것을 이틀 뒤에 알았습니다.",pt:"규정은 '알게 된 즉시 신고'입니다. 신고 시한이 흐르고 있습니다.",ld:"좋은 리더라면 사실을 다 알 때까지 기다리지 않고 바로 멈추고 신고합니다(A). 범위를 먼저 파악하려는 B는 책임감처럼 보이지만, 신고 시한을 넘기는 위험을 팀장이 떠안는 선택입니다. C처럼 한 사람을 공개적으로 지목하면 선은 분명해지지만, 다음부터 아무도 실수를 먼저 말하지 않게 됩니다.",best:["A"]},
 "3-9":{sit:"1분기 팀 설문 결과가 나왔습니다.",pt:"설문 결과를 어떻게 다루느냐가 다음 설문의 솔직함을 정합니다.",ld:"좋은 리더라면 결과를 숨기지 않고 돌려주며, 고칠 한 가지를 약속합니다(A). 모듈 리더들에게 대응을 맡기는 B도 리더 행동이지만, 모듈마다 대응이 달라질 수 있어 팀 전체에 같은 기준을 알려 두어야 합니다. '아직 이르니 지켜보자'(C)는 시간을 아끼지만, 답한 사람들은 '말해도 바뀌는 게 없다'고 배웁니다.",best:["A","B"]},
 "4-2":{sit:"팀의 여력 10칸을 운영(RUN), AI, 성장(GROW), 예방(SEC)에 나누고 팀에 공지합니다.",pt:"어디에 몇 칸을 주느냐가 모듈의 업무량과 스트레스를 정합니다.",ld:"좋은 리더라면 이미 부담이 큰 모듈(업무량 70 이상)부터 확인하고, 효과·비용·위험을 기준으로 나눈 뒤 그 기준을 공지합니다. AI로 아낀 여력을 말없이 새 일로 채우면 다음 분기 스트레스로 돌아옵니다.",best:[]},
 "4-3":{sit:"리더 회의에서 배분안이 화면에 뜨자 강태식이 공개적으로 반대합니다.",pt:"공개 반대를 피하지도, 누르지도 않는 법.",ld:"좋은 리더라면 모두 앞에서 배분 기준을 다시 확인하거나(B), 선배의 체면을 지켜 따로 쟁점을 듣습니다(A). '이미 알린 안'이라며 밀어붙이면(C) 결정은 지키지만 선배와 그 동맹을 잃습니다.",best:["A","B"]},
 "4-5":{sit:"헬씨푸드 임원이 \"주 140시간이 줄었다면서요, 운영비를 8% 낮춰 달라\"고 합니다. 140시간은 추정치였습니다.",pt:"추정치를 실적처럼 내준 대가를 어떻게 처리할 것인가.",ld:"좋은 리더라면 잘못 나간 숫자를 먼저 바로잡고, 실측 방법을 정해 근거로 협상합니다(A). 일을 더 얹어 운영비를 지키는 C는 당장은 좋아 보이지만, 아낀 시간을 새 일로 채우는 실무자 습관입니다.",best:["A"]},
 "6-1":{sit:"하반기 계약 자리. 헬씨푸드가 운영비를 얼마나 내릴지 묻습니다. 운영비 1%는 팀 연간 이익의 약 6%입니다.",pt:"팀 이익과 고객 관계를 근거로 함께 지키는 일입니다.",ld:"좋은 리더라면 실측으로 확인된 절감만 반영하자고 근거로 협상합니다(A). 신규 과제를 더 얹는 C는 고객 만족과 재무를 함께 올리지만, 이미 바쁜 모듈의 부담을 키웁니다.",best:["A"]},
 "6-1p":{sit:"헬씨푸드가 계약 뒤에 다시 협상하자고 할 때 어디까지 물러설지 미리 적어 둘지 정합니다.",pt:"압박 속에서 그 자리에서 정하면 많이 내주게 됩니다.",ld:"좋은 리더라면 물러설 선을 미리 적어 둡니다(A~C 중 하나). 적지 않으면(D) 재협상 자리에서 압박을 받으며 정하게 됩니다.",best:["A","B","C"]},
 "5-4":{sit:"장애 대응 포상 후보를 내야 합니다. 밤새 복구한 생산(강태식)과 8개월 동안 사고를 막아 온 가공(이수진)이 맞섭니다.",pt:"불을 끈 사람과 불이 나지 않게 막은 사람.",ld:"좋은 리더라면 복구와 예방을 함께 봅니다(B). 복구만 상을 받으면(A) 예방하던 사람들이 점검을 형식으로만 하게 됩니다.",best:["B"]},
 "8-1a":{sit:"본사가 'AI 효율화 실적'을 이유로 9월부터 2명을 차출하겠다는 공문을 보냈습니다. 9월은 성수기입니다.",pt:"효율화의 성과가 인력 감축으로 돌아올 때.",ld:"좋은 리더라면 공문을 그대로 받기 전에, 확인된 절감 수치로 협상하거나(B) 복귀 자리를 지킬 방법을 찾습니다(C). 그대로 보내면(A) 남은 사람들에게 일이 몰립니다.",best:["B","C"]},
 "8-1b":{sit:"차출로 여력이 2칸 줄었습니다. 어디서 줄일지 정합니다.",pt:"무엇을 지키고 무엇을 멈출 것인가.",ld:"좋은 리더라면 우선순위로 정합니다. 지금 돌아가는 운영과 예방을 지키고 새 일을 멈추는 A가 위험이 가장 적습니다. 고르게 덜어 내면(C) 공평해 보이지만 어느 모듈도 일을 덜지 못합니다.",best:["A"]},
 "8-1c":{sit:"줄인 결과를 팀에 어떻게 알릴지 정합니다.",pt:"",ld:"좋은 리더라면 무엇을 왜 줄였는지 기준과 근거를 설명합니다(A).",best:["A"]},
 "6-3":{sit:"생산 모듈 김 사원의 새벽 접속과 제안을 두고, 모듈 리더 강태식과 김 사원 사이에서 정해야 합니다.",pt:"구성원을 보호하는 것과 모듈 리더를 건너뛰는 것.",ld:"좋은 리더라면 김 사원을 보호하되 모듈 리더 강태식을 건너뛰지 않습니다. 새벽 접속 문제라면 기록을 보여 주고 강태식이 직접 표를 고치게 하거나(B), 본인의 선택을 존중하면서 위험 신호를 함께 봅니다(C). 김 사원의 제안이라면 범위와 기한을 정해 맡기고 강태식에게 먼저 알리거나(A), 모듈 일로 정식 시간을 받게 합니다(B).",best:["B"],bestCase:{0:["B","C"],1:["A","B"]}},
 "4-4":{sit:"익명 게시판에 '41시간 쓴 제안서, 표지에는 다른 이름'이라는 글이 올라왔습니다.",pt:"당사자를 보호하면서 공로 표기를 바로잡는 일.",ld:"좋은 리더라면 당사자의 말을 먼저 듣고(A), 같은 일이 반복되지 않게 기여 표기 규칙을 만듭니다(B). 모듈 안에서 알아서 정리하게 맡기면(C) 글쓴이가 드러날 위험이 큽니다.",best:["A","B"]},
 "6-2":{sit:"하반기 계약 결과를 입장이 다른 세 사람에게 설명해야 합니다.",pt:"같은 결정도 듣는 사람에 따라 궁금한 것이 다릅니다.",ld:"좋은 리더라면 결론만 같은 글로 돌리지 않고, 상대마다 무엇이 바뀌는지, 왜 그렇게 정했는지, 다음에 무엇을 하면 되는지를 그 사람의 말로 설명합니다.",best:[]},
 "9-7":{sit:"3분기 팀 설문 결과가 나왔습니다.",pt:"설문 결과를 어떻게 다루느냐가 다음 설문의 솔직함을 정합니다.",ld:"좋은 리더라면 결과를 돌려주며 고칠 한 가지를 약속하거나(A), 모듈 리더들이 같은 기준으로 대응하게 맡깁니다(B). 연말 평가와 묶어 미루면(C) 답한 사람들은 반응을 기다리다 지칩니다.",best:["A","B"]},
 "inbox":{ld:"좋은 리더라면 맡길 수 있는 메일은 기대 결과·기한·권한·이유를 붙여 위임하거나 코칭하고, 직접 처리는 팀장만 할 수 있는 일에 씁니다. 보류는 상대에게 언제 답할지 알려 줄 때만 효과가 있습니다."}
};
/* 다음 라운드에 기다리는 일과 습관별 주안점 */
window.NEXT_PREVIEW={1:"다음 라운드(2·3분기)에는 팀 여력 10칸 배분, 강태식의 공개 반대, 헬씨푸드 운영비 협상 두 번, 장애 공로를 둘러싼 강태식과 이수진의 중재, 본사 인력 차출, 익명 게시판의 공로 문제가 기다립니다.",2:"다음 라운드(4분기)에는 새벽 장애와 현장 안전 판단, 헬씨푸드 임원의 항의 전화, 바뀐 인사팀 평가 지침, 강태식의 거취, 연말 평가와 이의 면담이 기다립니다.",3:""};
window.AX_FOCUS={1:{1:"받은편지함과 위임 장면에서, 맡길 수 있는 일은 기대 결과·기한·권한·이유를 붙여 맡기고 직접 처리는 팀장만 할 수 있는 일로 줄이세요.",2:"받은편지함과 김 사원의 제안 장면에서, 직접 처리하기 전에 '이 일을 누가 더 잘 배울 수 있나'를 먼저 물어보세요.",3:"새벽 장애 장면에서, 직접 접속해 지시하기보다 지휘자를 정하고 팀장은 고객 통지와 위쪽 보고를 맡는 역할 분담을 검토하세요."},
 2:{1:"장애 공로 추천과 익명 게시판 장면에서, 눈에 띄는 성과만이 아니라 예방과 실제 작성자 같은 드러나지 않는 기여를 함께 보세요.",2:"공로 문제와 평가 지침 변경 장면에서, 숫자 순서가 아니라 관찰한 사실과 합의한 기준으로 판단하세요.",3:"연말 평가에서, 리더 의견서의 관찰 사실을 확인하고 KPI 숫자 순서로만 등급을 정하지 마세요."},
 3:{1:"라운드 시작의 여력 10칸 배분에서, 업무량 70 이상인 모듈부터 확인하고 효과·비용·위험 기준으로 나눈 뒤 먼저 공지하세요.",2:"헬씨푸드 협상과 본사 차출 장면에서, AI로 아낀 시간을 새 일로 채우지 말고 근거로 협상하세요.",3:"배분 조정 장면에서, 스트레스 80 이상인 모듈에 부하 완화 조치를 먼저 쓰세요."},
 4:{1:"결정 뒤 '알리기' 단계에서, 결과만 알리지 말고 기준과 근거를 영향을 받는 사람에게 직접 설명하세요.",2:"공개 반대나 중재 장면에서, 결론을 통보하기 전에 양쪽의 말을 먼저 들으세요.",3:"바뀐 평가 지침을 알리는 장면에서, 무엇이 왜 바뀌었는지 전원에게 다시 공지하세요."}};
if(!document.getElementById("sc3-css")){const st=document.createElement("style");st.id="sc3-css";st.textContent=`
.chip{display:inline-block;border:1px solid;border-radius:999px;padding:1px 8px;margin:3px 4px 0 0;font-size:12.5px;font-weight:600;background:var(--panel)}
.pill{display:inline-block;border-radius:999px;padding:1px 9px;font-size:12px;font-weight:600;background:var(--tile);color:var(--ink);margin-right:4px}
.pill.good{background:color-mix(in srgb,var(--good) 18%,transparent);color:var(--good)}
.pill.bad{background:color-mix(in srgb,var(--bad) 16%,transparent);color:var(--bad)}
.pill.warn{background:color-mix(in srgb,var(--bad) 10%,transparent);color:var(--bad)}
.pill.mine{background:var(--ink);color:var(--panel)}
.dlist{display:grid;gap:10px;margin-top:12px}
.dcard{border:1px solid var(--line);border-radius:14px;background:var(--panel);overflow:hidden}
.dcard>summary{cursor:pointer;padding:12px 14px;display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;list-style:none}
.dcard>summary::-webkit-details-marker{display:none}
.dcard>summary::before{content:"▸";color:var(--muted)}.dcard[open]>summary::before{content:"▾"}
.dcard .dt{font-weight:700}.dcard .dm{font-size:13px;color:var(--muted)}
.dbody{padding:0 14px 14px;font-size:14.5px;line-height:1.6}
.dbody p{margin:8px 0}
.optcmp{display:grid;gap:8px;margin-top:10px}
.ocard{border:1px solid var(--line);border-radius:12px;padding:9px 12px;background:var(--tile)}
.ocard.me{border:2px solid var(--ink);background:var(--panel)}
.ohead{font-size:14px;line-height:1.5}.otags{margin:4px 0}
.ldbox{margin-top:10px;border-left:4px solid var(--good);background:color-mix(in srgb,var(--good) 8%,transparent);border-radius:0 12px 12px 0;padding:8px 12px}
.ldbox p{margin:4px 0 0}
.cols2{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px}
.weakbox{border-left:4px solid var(--bad)}.goodbox{border-left:4px solid var(--good)}.focusbox{border-left:4px solid var(--accent,#c9e04f)}
.mrow2{display:grid;grid-template-columns:1.2fr 1fr 1.4fr;gap:6px 10px;align-items:center;font-size:14px}
@media (max-width:560px){.mrow2{grid-template-columns:1fr}}
#focusw{width:100%;min-height:72px;font:inherit;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink)}`;document.head.appendChild(st);}

/* ---------- 넘어서는 안 되는 선: 위반 목록 (지시서 v3 B-1, 2026-11-22) ----------
   위반으로 칠 선택은 이 목록 한곳에서 관리한다. 성적표 요약, 결산(finale.js의 breaches, 결산 1/6), 결과 코드(vb)가 모두 이 목록을 쓴다.
   어느 라운드에 일어났는지는 플래그가 처음 켜질 때 G.vioAt에 남긴다(되돌리기와 함께 되돌려지도록 G 안에 둔다). 기록이 없는 옛 저장 데이터는 m(기본 달)로 정한다. */
/* 2026-11-26 (Round 1 개선 1단계): 선마다 범주(line)와, 그 선택을 할 때 화면에 있던 규정 문구(rule·src)를 둔다.
   규정 문구는 화면에 실제로 나오는 글에서 가져온다: 규정 요약(c00.js RULES), 3-8 규정집, 새벽 3시 참고 카드(R3-1a). 점수·판정에는 쓰지 않는다 */
{const RL=i=>{try{return String(RULES[i]||"").replace(/<[^>]+>/g,"").replace(/^\S+\s+/,"").trim();}catch(e){return "";}};
 const R31=(()=>{try{return (String((CONTENT.find(x=>x.id==="R3-1a")||{}).ref||"").match(/[^.]*인터록[^.]*\./)||[""])[0].trim();}catch(e){return "";}})();
 window.LINE_RULE={보안:RL(2),장애:RL(1),"3-8":"고객 데이터가 외부로 나간 정황을 알게 되면, 그 즉시 정보보안팀에 신고한다.",안전:R31};}
window.VIOLATION_FLAGS=[
 {k:"ai_shared",m:1,line:"보안",rule:LINE_RULE.보안,src:"규정 요약 · 보안",t:"외부 AI에 사내 로그를 넣어 얻은 결과를 보안 승인 없이 팀 채널에 공유하도록 했습니다."},
 {k:"sec_breach",m:3,line:"보안",rule:LINE_RULE["3-8"],src:"규정집",t:"정보보안팀에 알리기 전에 우리가 먼저 범위를 파악하기로 했습니다.",found:"sec_breach_caught"},
 {k:"sec_hidden",m:7,line:"보안",rule:LINE_RULE.보안,src:"규정 요약 · 보안",t:"한 선임의 외부 AI 입력을 보고받고 조치하지 않았습니다.",found:"sec_found"},
 {k:"sec_breach_data",m:8,line:"보안",rule:LINE_RULE.보안,src:"규정 요약 · 보안",t:"승인 없이 고객 데이터를 외부 서비스로 돌렸습니다.",found:"sec_data_found"},
 {k:"inc_breach",m:9,line:"장애 절차",rule:LINE_RULE.장애,src:"규정 요약 · 장애",t:"긴급 승인 없이 우회 패치를 올렸습니다.",found:"inc_found",more:g=>g.f.inc_breach_nowrite?" 세 개의 설명에 쓰지 않았습니다.":""},
 {k:"safety_breach",m:10,line:"현장 안전",rule:LINE_RULE.안전,src:"참고 카드 · 장애·안전 절차",t:"현장 안전 책임자와 고객사의 승인 없이 인터록 우회를 허락했습니다.",more:g=>g.f.near_miss?" 그 자리에서 아차 사고가 났습니다.":""}];
{const rOf=m=>m>=10?3:m>=4?2:1;
 window.violationsAll=function(){const g=G,at=g.vioAt||{};return VIOLATION_FLAGS.filter(v=>g.f&&g.f[v.k]).map(v=>{const w=at[v.k]||{};const m=w.m||v.m,r=w.r||rOf(m);
   const hid=v.found?(g.f[v.found]?"":" 이 일은 끝까지 아무도 몰랐습니다. 판정은 같습니다."):"";return {k:v.k,r,m,line:v.line||"",rule:v.rule||"",src:v.src||"",text:`${m}월: ${v.t}${v.more?v.more(g):""}${hid}`};}).sort((a,b)=>a.m-b.m);};
 window.violationsOf=r=>violationsAll().filter(v=>v.r===r);
 /* 플래그가 처음 켜진 라운드·달을 남긴다 */
 const _af=applyFx;applyFx=function(){const x=_af.apply(this,arguments);try{VIOLATION_FLAGS.forEach(v=>{if(G.f[v.k]&&!(G.vioAt&&G.vioAt[v.k])){G.vioAt=G.vioAt||{};G.vioAt[v.k]={r:G.round||rOf(G.month||1),m:G.month||v.m};
   /* 1단계: '일어난 일' 화면에 바로 알리려고, 플래그가 켜진 장면 위치와 그때 열려 있던 메일을 기억해 둔다. 화면 표시용이라 저장하지 않는다 */
   try{const st=(CONTENT[G.idx]||{})._st;const E=window.__lineEvt=window.__lineEvt||[];E.push({k:v.k,idx:G.idx,sel:(st&&st.sel)||null});if(E.length>30)E.shift();}catch(e){}}});}catch(e){}return x;};
 /* ---------- 선 사전 경고 (Round 1 개선 1단계, 2026-11-26) ----------
   선과 연결된 장면·메일은 위 목록의 플래그를 켜는 선택지가 있는 곳을 콘텐츠에서 찾아 정한다. 목록에 새 선이 생기면 배지도 따라간다.
   배지는 어느 선택지가 선을 넘는지 말하지 않는다. 판정·점수·저장 형식은 그대로다 */
 let LIX=null;
 window.lineIndex=function(){if(LIX)return LIX;const ks=VIOLATION_FLAGS.map(v=>v.k),ix={scene:{},mail:{}};
  const txt=(v,d,seen)=>{if(v==null||d>6)return "";if(typeof v==="string")return v;if(typeof v==="function")return String(v);if(typeof v!=="object"||seen.has(v))return "";seen.add(v);return Object.values(v).map(x=>txt(x,d+1,seen)).join(" ");};
  const hit=t=>ks.filter(k=>t.indexOf("`"+k+"`")>=0);const RP=typeof REPLIES!=="undefined"?REPLIES:(window.REPLIES||{});
  CONTENT.forEach(s=>{const one=(o,id)=>{if(!o||!id)return;const h=hit(txt([o.options,o.levels,o.planb],0,new Set()));if(h.length)ix.scene[id]=h;};one(s,s.id);(Array.isArray(s.cases)?s.cases:[]).forEach(c=>one(c,c&&c.id));
   (Array.isArray(s.mail)?s.mail:[]).forEach(m=>{if(!m||!m.id)return;const h=hit(txt([m.self,m.to,m.other,m.hold,RP[m.id]],0,new Set()));if(h.length)ix.mail[m.id]=h;});});
  LIX=ix;return ix;};
 const vOf=k=>VIOLATION_FLAGS.find(v=>v.k===k)||{};
 const lnOf=ks=>[...new Set(ks.map(k=>vOf(k).line).filter(Boolean))].join(" · ");
 const LG_IC='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 2.8 4.5 5.6v5.6c0 4.6 3.1 8.6 7.5 10 4.4-1.4 7.5-5.4 7.5-10V5.6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 12h8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
 window.lineBadge=function(x,kind){try{const ks=(kind==="mail"?lineIndex().mail:lineIndex().scene)[x&&x.id];if(!ks||!ks.length)return "";const ln=lnOf(ks);
   return `<div class="lineguard" role="note"><span class="lg-ic">${LG_IC}</span><div><b class="lg-tag">넘어서는 안 되는 선${ln?" · "+ln:""}</b><p>이 결정에는 넘어서는 안 되는 선이 걸려 있습니다. 선을 벗어난 선택은 다른 점수와 관계없이 기준 미달입니다.</p></div></div>`;}catch(e){return "";}};
 /* 방금 고른 선택이 선을 넘었으면 '일어난 일' 화면에 바로 알린다. 이 장면(또는 이 메일)이 켤 수 있는 플래그만 본다 */
 window.lineResult=function(s,mailId){try{const ix=lineIndex();const own=mailId?(ix.mail[mailId]||[]):(ix.scene[s&&s.id]||[]);if(!own.length)return "";
   const ks=[...new Set((window.__lineEvt||[]).filter(e=>e.idx===G.idx&&own.includes(e.k)&&G.f[e.k]&&(!mailId||e.sel===mailId)).map(e=>e.k))];
   return ks.map(k=>{const v=vOf(k);return `<div class="happen alertbox lg-res" role="status"><span class="label">넘어서는 안 되는 선${v.line?" · "+v.line:""}</span><p>이 선택은 기준 미달로 기록됩니다. 이유: ${v.t}</p>${v.rule?`<p class="lg-q"><span>${v.src||"규정"}</span>“${v.rule}”</p>`:""}</div>`;}).join("");}catch(e){return "";}};
 /* 결산(finale.js)의 위반 목록도 같은 목록을 쓴다 */
 breaches=function(){return violationsAll().map(v=>v.text);};
 /* 1월 M06: 팀 채널 공유를 허용한 답장에 위반 플래그를 붙인다 */
 {const RP=typeof REPLIES!=="undefined"?REPLIES:window.REPLIES;const o=(RP&&RP.M06||[]).find(x=>/팀 채널에 공유해 보라/.test(x.t));if(o&&o.r&&!/ai_shared/.test(o.r[1]))o.r[1]=String(o.r[1])+" `ai_shared`";}
}

/* ---------- 받은편지함 건별 기록과 복기 (Round 1 개선 2단계, 2026-11-26) ----------
   G.inboxLog: 메일 하나를 처리할 때마다 {id, r 라운드, sc 장면, i 장면 위치, k 처리 분류, lab 내가 고른 문구, txt 일어난 일, sig 습관 신호, to, op 열어 봄, pr 약속, d 계기판, tr 신뢰, wl 업무량}.
   기존 기록(G.decisions, G.fxLog, 결과 코드)은 그대로 둔다. 분류 이름은 화면에서만 다섯 가지(직접 처리·답장·코칭·위임·보류)로 맞춘다.
   전화를 받아 상대에게 맡긴 기본 응답은 '위임'으로 보인다(기존 기록의 '코칭'과 결과 코드는 그대로). 이 건별 기록이 없는 이전 저장은 G.decisions로 할 수 있는 만큼만 보여 준다 */
{
 const IB_DELEG={M08:true};
 const SC4=["성과","재무","사람","안정"];
 window.ibSnap=()=>({s:{...G.score},F:G.fsat,t:{...G.trust},w:G.mod&&G.mod.add?{...G.mod.add}:{}});
 const diffOf=b0=>{const d={},tr={},wl={};if(!b0)return {d,tr,wl};SC4.forEach(k=>{const x=G.score[k]-b0.s[k];if(x)d[k]=x;});if(G.fsat-b0.F)d.F=G.fsat-b0.F;
  Object.keys(LD).forEach(k=>{const x=G.trust[k]-b0.t[k];if(x)tr[k]=x;});if(G.mod&&G.mod.add)Object.keys(LD).forEach(k=>{const x=(G.mod.add[k]||0)-(b0.w[k]||0);if(x)wl[k]=x;});return {d,tr,wl};};
 const kind5=(m,o)=>{if(o.kind==="위임"||o.kind==="보류"||o.kind==="시간 초과"||o.kind==="미결")return o.kind;if(IB_DELEG[m.id]&&o.meta&&o.meta.self)return "위임";return o.rk==="직접"?"직접 처리":o.rk==="코칭"?"코칭":"답장";};
 const push=e=>{const L=G.inboxLog=Array.isArray(G.inboxLog)?G.inboxLog:[];L.push(e);if(L.length>80)L.splice(0,L.length-80);};
 window.ibLog=function(m,o,b0){try{const sc=CONTENT[G.idx]||{};push(Object.assign({id:m.id,r:G.round||1,sc:sc.id||"",i:G.idx,k:kind5(m,o),lab:(o.meta&&o.meta.lab)||"",txt:String(o.text||""),sig:String(o.sig||""),to:o.to||null,op:o.opened?1:0,pr:o.pr||null},diffOf(b0)));}catch(e){}};
 window.ibSettleLog=function(b0,txt){try{const sc=CONTENT[G.idx]||{};const df=diffOf(b0);if(!Object.keys(df.d).length&&!Object.keys(df.tr).length&&!Object.keys(df.wl).length)return;push(Object.assign({id:"_settle",r:G.round||1,sc:sc.id||"",i:G.idx,k:"정산",lab:"",txt,sig:""},df));}catch(e){}};
 const KORDER=["직접 처리","답장","코칭","위임","보류","시간 초과","미결"];
 window.ibCount=list=>{const c={};KORDER.forEach(k=>c[k]=0);(list||[]).forEach(e=>{if(c[e.k]!=null)c[e.k]++;});return c;};
 window.ibCountText=c=>{const a=["직접 처리","답장","코칭","위임"].map(k=>`${k} ${c[k]}`);const h=c["보류"]+c["시간 초과"];a.push(`보류 ${h}${c["시간 초과"]?`(시간 초과 ${c["시간 초과"]} 포함)`:""}`);if(c["미결"])a.push(`미결 ${c["미결"]}`);return a.join(" · ");};
 /* 이전 저장용: 기록된 처리 이름을 다섯 가지로 */
 const kindOfDec=(id,ch)=>{const t=String(ch||"");if(/^위임/.test(t))return "위임";if(t==="시간 초과(미결)")return "미결";if(/^시간 초과/.test(t))return "시간 초과";if(t==="보류")return "보류";if(t==="직접")return "직접 처리";if(t==="코칭")return IB_DELEG[id]?"위임":"코칭";return "답장";};
 /* 라운드의 건별 항목. 기록이 없으면 G.decisions에서 만든다(legacy) */
 window.ibEntries=function(r){const st=(G.rs||{})[r]||{},nx=(G.rs||{})[r+1];
  const log=(Array.isArray(G.inboxLog)?G.inboxLog:[]).filter(e=>e.r===r);
  if(log.length)return {legacy:false,items:log.filter(e=>e.id!=="_settle"),settle:log.filter(e=>e.id==="_settle")};
  const ds=(G.decisions||[]).slice(st.dec||0,nx?nx.dec:undefined).filter(x=>/^M\d+/.test(x.scene));
  return {legacy:true,settle:[],items:ds.map(x=>{const mo=typeof mailOf==="function"?mailOf(x.scene):null;const to=String(x.choice).split(":")[1]||null;return {id:x.scene,r,sc:"",k:kindOfDec(x.scene,x.choice),lab:"",txt:"",sig:null,to,legacy:true,mo};})};};
 /* 습관 신호 → 판정 */
 const cls=sig=>{if(sig==null)return null;const t=String(sig);return /[①②③④]P/.test(t)?"P":/[①②③④]L/.test(t)?"L":"";};
 const rowSig=row=>Array.isArray(row)?String(row[2]||""):null;
 const keyByName=n=>Object.keys(LD).find(k=>LD[k].n===n)||null;
 /* 습관 기록이 없는 처리를 위한 메일별 기준 (2026-11-27 병준님 확인). 화면 판정에만 쓰고 습관 비율·결과 코드·결산에는 쓰지 않는다.
    rep: [답장 문구 정규식, L 같음 | P 다름, 이유], del: {리더 키 | "*": [판정, 이유]}, hold: [판정, 이유] */
 const MJ={
  M01:{rep:[[/목요일 오후 30분/,"L",""],[/2월 초로 미루/,"P","고객이 먼저 청한 자리를 미룹니다."],[/정다은 리더와 함께/,"P","임원이 물으려던 장애 이야기가 계약 이야기에 묻힙니다."]],del:{"*":["P","팀장을 지명한 첫 만남을 다른 사람에게 넘깁니다."]},hold:["P","팀장을 지명한 첫 만남을 미룹니다."]},
  M06:{rep:[[/어떤 로그를 넣었는지/,"L",""],[/팀 채널에 공유/,"P","승인 전에 결과를 퍼뜨립니다."],[/쓰지 말자고만/,"P","막기만 하고, 이미 무엇이 나갔는지는 모른 채 남습니다."]],del:{src:["L","확인을 맡을 사람에게 넘깁니다."],"*":["P","무엇을 넣었는지 확인하지 않은 채 지나갑니다."]},hold:["P","무엇을 넣었는지 확인하지 않은 채 지나갑니다."]},
  M09:{rep:[[/오늘 잠깐 이야기해요/,"L",""],[/강태식 리더에게 말하면/,"P","3주째 대기가 몰린 사정을 들을 기회를 놓치고, 구성원 혼자 선배에게 말하게 둡니다."],[/승인하겠다고 바로/,"P","대기 공백이 그대로 남고 모듈 리더를 건너뜁니다."]],del:{"*":["P","사정을 듣지 않은 채 넘깁니다."]},hold:["P","사정을 듣지 않은 채 미룹니다."]},
  M16:{rep:[[/이틀 새벽으로 나눠/,"L",""],[/요청대로 승인/,"P","같은 새벽의 다른 작업과 겹치는지 확인하지 않습니다."],[/다음 주로 다시/,"P","기한이 있는 보안 패치를 미룹니다."]],del:{"*":["L",""]},hold:["P","기한이 있는 보안 패치를 미룹니다."]}};
 /* 판정: 습관 기록이 있으면 그것, 없으면 메일별 기준, 둘 다 없으면 판정 없음 */
 const judgeIB=(e,m,legacy)=>{const hs=cls(legacy?legacySig(e,m):e.sig);if(hs==="L"||hs==="P")return {v:hs,src:"habit",why:""};
  const J=MJ[e.id];if(!J||e.k==="시간 초과"||e.k==="미결")return {v:null,src:"",why:""};
  if(e.k==="위임"){const k=LD[e.to]?e.to:keyByName(e.to);const x=(k&&J.del[k])||J.del["*"];return x?{v:x[0],src:"table",why:x[1]}:{v:null};}
  if(e.k==="보류")return J.hold?{v:J.hold[0],src:"table",why:J.hold[1]}:{v:null};
  if(!e.lab)return {v:null,src:"",why:""};const x=J.rep.find(r=>r[0].test(e.lab));return x?{v:x[1],src:"table",why:x[2]}:{v:null,src:"",why:""};};
 const legacySig=(e,m)=>{if(!m)return null;if(e.k==="직접 처리")return "①P";if(e.k==="코칭")return "①L";if(e.k==="위임"){if(IB_DELEG[e.id])return rowSig(m.self);const k=keyByName(e.to);return rowSig((k&&m.to&&m.to[k])||m.other);}if(e.k==="보류")return rowSig(m.hold);if(e.k==="시간 초과"||e.k==="미결")return "";return null;};
 /* 같은 메일에서 리더 행동으로 기록되는 처리 */
 const shortT=t=>{t=String(t||"").replace(/^"([^"]*)"/,"‘$1’").replace(/["“”]/g,"").replace(/[.。]\s*$/,"").trim();return t.length>26?t.slice(0,26).replace(/\s+\S*$/,"")+"…":t;};
 const leaderOpts=m=>{const out=[];const RP=(typeof REPLIES!=="undefined"?REPLIES:{})[m.id];
  if(RP)RP.forEach(x=>{const s=x.self?rowSig(m.self):Array.isArray(x.r)?rowSig(x.r):null;if(cls(s)==="L")out.push(`답장 “${shortT(x.t)}”`);});
  else if(cls(rowSig(m.self))==="L")out.push("직접 답장");
  if(!m.noDel){Object.keys(m.to||{}).forEach(k=>{if(cls(rowSig(m.to[k]))==="L")out.push(`${LD[k].n}에게 위임`);});if(cls(rowSig(m.other))==="L")out.push("다른 리더에게 위임");}
  const J=MJ[m.id];if(J){if(RP)RP.forEach(x=>{const y=J.rep.find(r=>r[0].test(x.t));if(y&&y[1]==="L"){const t=`답장 “${shortT(x.t)}”`;if(!out.includes(t))out.push(t);}});
   Object.keys(J.del).forEach(k=>{if(J.del[k][0]==="L"){const t=k==="*"?"위임":`${LD[k].n}에게 위임`;if(!out.some(o=>o.startsWith(t)||(k==="*"&&/위임$/.test(o))))out.push(t);}});}
  return out.slice(0,3);};
 /* Round 1 메일별 코칭 (없으면 받은편지함 공통 문구) */
 const MC={
  M01:{th:["manageup","trust"],ld:"고객 임원과의 첫 만남은 팀장이 직접 챙길 일입니다. 시간을 잡고, 상대가 궁금해할 작년 장애 내용을 미리 준비해 가면 관계의 출발점이 됩니다.",imp:"고객 임원의 요청은 미루기 전에 상대가 무엇을 궁금해하는지 먼저 확인하고, 준비해 갈 자료를 정하세요."},
  M03:{th:["monkey","ocb"],ld:"수치를 직접 고치면 오늘은 빠르지만, 작성자가 스스로 고칠 기회와 41시간을 들인 한 선임의 기여가 가려집니다. 고칠 곳 대신 확인할 기준을 주고 판단은 맡깁니다.",imp:"문서를 고쳐 주고 싶을 때는 고친 문서 대신 확인할 기준(출처, 근거)을 돌려주세요."},
  M06:{th:["justcult","hro"],ld:"결과보다 무엇을 넣었는지를 먼저 확인합니다. 승인 전에 퍼뜨리면 선을 넘게 되고, 막기만 하면 실험 의욕이 꺾입니다. 사실을 묻고 승인 절차로 이어 줍니다.",imp:"새 도구 소식을 들으면 어떤 데이터를 넣었는지, 승인은 받았는지부터 물으세요."},
  M08:{th:["monkey","trust"],ld:"현장을 아는 선배가 맡겠다면 맡기고, 팀장은 겹치는 일정처럼 팀 전체에 걸린 위험만 확인합니다. 로그를 직접 받아 보면 선배의 판단을 가져오게 됩니다.",imp:"맡길 때는 상대가 맡을 일과 내가 확인할 일을 한 문장으로 나눠 말하세요."},
  M09:{th:["psysafe","voice"],ld:"휴가 질문 뒤에는 3주째 야간 대기가 몰린 사정이 있습니다. 바로 승인하거나 넘기기보다 짧게라도 직접 들으면 쏠림을 알게 됩니다.",imp:"구성원이 누구에게 말해야 하느냐고 물으면, 절차를 알려 주기 전에 사정부터 들어 보세요."},
  M11:{th:["transition","monkey"],ld:"작년에 직접 복구해 본 장애라도, 지금은 담당자가 해결하도록 돕는 것이 팀장의 몫입니다. 상황을 묻고 막히면 부르게 하거나, 고객 통지를 먼저 챙깁니다.",imp:"익숙한 장애가 뜨면 손을 대기 전에 담당자가 무엇에 막혔는지 먼저 물으세요."},
  M13:{th:["monkey","situational"],ld:"경로를 바로 주면 오늘은 빠르지만 원인을 아는 사람은 늘지 않습니다. 담당 리더와 함께 원인을 보도록 이어 줍니다.",imp:"후배가 자료 위치를 물으면 답 대신 함께 볼 사람을 이어 주세요."},
  M14:{th:["procjust","voice"],ld:"익명 글에는 답하지 않아도 되지만, 팀 전체가 같은 답을 듣도록 기준을 알리겠다고 약속하면 침묵이 줄어듭니다. 약속은 지켜야 효과가 있습니다.",imp:"익명 질문에는 개인이 아니라 팀 전체에 답하고, 언제까지 무엇을 알릴지 기한을 붙이세요."},
  M16:{th:["hro","monkey"],ld:"패치는 승인하되, 같은 새벽의 다른 작업과 겹치는지 확인하는 것이 팀 전체 일정을 보는 팀장만 할 수 있는 일입니다.",imp:"작업 승인 요청을 받으면 같은 시간에 겹치는 다른 작업이 있는지 한 번 확인하세요."}};
 const coachOf=id=>{const T=(window.THEORY||{}).inbox||{};const C=(window.COACH||{}).inbox||{};const m=MC[id]||{};return {th:m.th||T.th||[],ld:m.ld||C.ld||"",imp:m.imp||T.imp||""};};
 /* 약속이 이후 어디서 반영되는지 */
 const PW={P1:"이 약속은 3월 말 분기 정산에서 판정됩니다. 3월 KPI 합의서에서 등급 기준을 '리더에게만' 알리면 어긴 것이 되고, 그때 구성원 점수가 2 내려갑니다."};
 const promLine=id=>{const p=(G.prom||{})[id];if(!p)return "";const st=p.status==="이행"?"이번 라운드 판정: 지켰습니다.":p.status==="파기"?"이번 라운드 판정: 어겼습니다.":"아직 판정 전입니다.";
  return `<p class="ib-prom"><span class="seclab">약속 장부</span><br>이 처리로 '${p.text}'(상대: ${p.to}, 기한: ${p.due})가 약속 장부에 기록되었습니다. ${PW[id]||"기한에 맞춰 지켰는지 판정됩니다."} ${st}</p>`;};
 const esc=t=>String(t??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const subOf=(e,m)=>m?(m.t==="CALL"?`전화 · ${String(m.from||"").replace(/^[^가-힣A-Za-z]+/,"")}`:(m.sub==="(제목 없음)"?`${m.from} 메일 (제목 없음)`:m.sub)):e.id;
 const fromOf=m=>m?String(m.from||"").replace(/^[^가-힣A-Za-z]+/,""):"";
 /* 통계 (참고 결정) */
 window.ibStats=function(r){const E=ibEntries(r);const n={L:0,P:0,N:0};E.items.forEach(e=>{const m=(typeof mailOf==="function"?mailOf(e.id):null)||{};const c=judgeIB(e,m.m,E.legacy).v;if(c==="L")n.L++;else if(c==="P")n.P++;else n.N++;});return Object.assign({n:E.items.length,legacy:E.legacy},n);};
 /* 상위 기여 (② 탭 툴팁) */
 window.ibTop=function(r,k,field,lim){const E=ibEntries(r);if(E.legacy)return [];const f=field||"d";return E.items.concat(E.settle).map(e=>{const v=((e[f]||{})[k])||0;const mo=typeof mailOf==="function"?mailOf(e.id):null;return {v,name:e.id==="_settle"?"보류 누적 정산":shortT(subOf(e,mo&&mo.m))};}).filter(x=>x.v).sort((a,b)=>Math.abs(b.v)-Math.abs(a.v)).slice(0,lim||2);};
 /* 성적표 ① 받은편지함 참고 결정 섹션 */
 window.ibSectionHtml=function(r,h){try{const E=ibEntries(r);if(!E.items.length)return "";const sg=x=>(x>0?"+":"")+x;
  const scM=(()=>{const sc=CONTENT.find(x=>x.id===(E.items[0]||{}).sc)||CONTENT.find(x=>x.type==="inbox"&&x.month===((G.rs||{})[r]||{}).m)||null;return sc&&Array.isArray(sc.mail)?sc.mail.map(x=>x.id):[];})();
  const items=E.items.slice().sort((a,b)=>{const ia=scM.indexOf(a.id),ib=scM.indexOf(b.id);return (ia<0?99:ia)-(ib<0?99:ib);});
  const cnt=ibCount(items),S=ibStats(r);
  const card=e=>{const mo=typeof mailOf==="function"?mailOf(e.id):null,m=mo&&mo.m;const co=coachOf(e.id);
   const J=judgeIB(e,m,E.legacy),c=J.v;const lo=m?leaderOpts(m):[];
   const to=e.k==="시간 초과"?(e.op?"열었지만 시간 안에 처리하지 못함":"시간 초과로 열지 않음"):e.k==="미결"?(e.op?"열었지만 정하지 못해 미결":"시간 초과로 열지 않아 미결"):"";
   const lab=to||e.lab||e.k;
   const pill=c==="L"?`<span class="pill good">좋은 리더의 선택과 같음</span>`:c==="P"?`<span class="pill bad">좋은 리더의 선택과 다름</span>`:`<span class="pill">판정하지 않음</span>`;
   const gap=(e.k==="시간 초과"||e.k==="미결")?`${to}. 습관 기록에는 들어가지 않고, 보류와 같은 점수 영향을 받습니다.${lo.length?` 같은 메일에서 좋은 리더의 선택으로 보는 처리: ${lo.join(", ")}.`:""}`
    :J.src==="table"&&c==="L"?"이 처리는 습관 기록에는 들어가지 않지만, 이 메일의 기준으로는 좋은 리더의 선택과 같습니다."
    :J.src==="table"&&c==="P"?`이 처리는 습관 기록에는 들어가지 않습니다. 이 메일의 기준으로는 다릅니다. ${J.why}${lo.length?` 좋은 리더의 선택으로 보는 처리: ${lo.join(", ")}.`:""}`
    :c==="L"?"이 처리는 리더 행동으로 기록되었습니다."
    :c==="P"?`이 처리는 실무자 습관으로 기록되었습니다.${lo.length?` 같은 메일에서 좋은 리더의 선택으로 보는 처리: ${lo.join(", ")}.`:""}`
    :`이 처리는 습관이 드러나지 않아 판정하지 않습니다.${lo.length?` 같은 메일에서 좋은 리더의 선택으로 보는 처리: ${lo.join(", ")}.`:""}`;
   const hasFx=!E.legacy&&(Object.keys(e.d||{}).length||Object.keys(e.tr||{}).length||Object.keys(e.wl||{}).length);
   const L=window.LEX||{};
   return `<details class="dcard ibm"${c==="P"||to?" open":""}><summary><span class="dt">${esc(subOf(e,m))}</span><span class="note">${esc(fromOf(m))}${m&&m.at?` · ${m.at}`:""}</span><span class="dm">${e.k==="시간 초과"?"보류":e.k}${lab&&lab!==e.k?` · ${esc(shortT(lab))}`:""}</span>${pill}</summary><div class="dbody">
    <p><span class="seclab">내 선택</span><br>${E.legacy?`${e.k}${e.to?` · ${esc(e.to)}`:""}`:to||lab===e.k?esc(lab):`“${esc(lab)}”`}</p>
    ${e.txt?`<p><span class="seclab">일어난 일</span><br>${esc(e.txt)}</p>`:""}
    <div class="thbox"><div class="th-h"><span class="seclab">이론으로 점검하기</span><span class="th-chips">${co.th.filter(id=>L[id]).map(id=>`<button type="button" class="lxchip" data-lex="${id}">${esc(L[id].name)}</button>`).join("")}</span></div>
     ${co.ld?`<div class="th-row"><span class="th-l">이론이 권하는 행동</span><p>${esc(co.ld)}</p></div>`:""}
     <div class="th-row"><span class="th-l">내 행동</span><p>${E.legacy||to||lab===e.k?esc(E.legacy?e.k:lab):`“${esc(shortT(lab))}”`} ${J.src!=="habit"?"":c==="L"?`<span class="pill good">리더 행동</span>`:c==="P"?`<span class="pill bad">실무자 습관</span>`:""}</p></div>
     <div class="th-row th-gap"><span class="th-l">차이</span><p>${esc(gap)}</p></div>
     ${co.imp?`<div class="th-row th-imp"><span class="th-l">다음에 해 볼 행동</span><p>${esc(co.imp)}</p></div>`:""}</div>
    ${e.pr?promLine(e.pr):""}
    ${hasFx?`<p style="margin-top:10px"><span class="seclab">움직인 값</span><br><span class="chips">${h.chips({d:e.d,tr:e.tr,wl:e.wl})}</span></p>`:E.legacy?"":`<p class="note" style="margin-top:10px">이 처리로 점수·신뢰·업무량이 움직이지 않았습니다.</p>`}
   </div></details>`;};
  const st=E.settle.map(x=>`<p class="note">${esc(x.txt)} <span class="chips">${h.chips({d:x.d,tr:x.tr,wl:x.wl})}</span></p>`).join("");
  return `<details class="dcard ibsec" id="ibsec"${S.P?" open":""}><summary><span class="dt">받은편지함</span><span class="note">참고 결정</span><span class="dm">메시지 ${items.length}건 · ${ibCountText(cnt)}</span><span class="pill">같음 ${S.L} · 다름 ${S.P} · 판정 없음 ${S.N}</span></summary><div class="dbody">
   <p class="note">받은편지함의 처리는 '핵심 결정' 집계에 넣지 않는 <b>참고 결정</b>입니다. 판정은 습관 기록을 먼저 따릅니다(리더 행동이면 같음, 실무자 습관이면 다름). 습관 기록이 없는 처리는 메일마다 정한 기준을 따르고, 둘 다 없으면 판정하지 않습니다.</p>
   ${E.legacy?`<p class="note">이전 버전에서 저장된 진행이라 처리 분류만 남아 있습니다. 내가 고른 문구, 일어난 일, 움직인 값은 이번 라운드부터 다시 기록됩니다.</p>`:""}
   <p><span class="seclab">받은편지함 전체로 움직인 값</span><br><span class="chips">${h.chips(h.inboxAct)}</span></p>${st}
   <div class="iblist">${items.map(card).join("")}</div>
   ${h.ld?`<div class="ldbox"><span class="seclab">좋은 리더라면</span><p>${h.ld}</p></div>`:""}</div></details>`;}catch(e){console.warn("ibSection",e);return "";}};
}

/* ---------- 토큰 효율 (지시서 v3 B-3③, 2026-11-22) ----------
   이전 식은 (고객+서비스 안정)÷2를 쓴 토큰으로 나눠, 토큰을 적게 쓸수록 값이 커졌다(나쁜 플레이가 더 효율적으로 보임).
   새 식: 기간 동안 오른 (고객+서비스 안정)÷2 를 (쓴 토큰÷10)으로 나눈다 = 토큰 10당 오른 점수.
   쓴 토큰이 기준(min) 미만이거나 점수가 오르지 않았으면 재지 않는다. 강사 집계 화면(facilitator.html)도 같은 식을 쓴다. */
window.tokEffOf=function(gain,used,min){if(!(used>=min))return {v:null,why:"쓴 토큰이 "+min+" 미만"};if(!(gain>0))return {v:null,why:"고객·서비스 안정이 오르지 않았기 때문"};return {v:Math.round(gain/(used/10)*10)/10,why:""};};

/* ---------- 상태에 맞지 않는 문구 바꾸기 (지시서 v3 B-4, 2026-11-22) ----------
   선택지·대사가 플레이어가 만든 적 없는 것(6월 협상선, 실측 수치, 공개하지 않은 기준, 이미 퍼진 사실)을 전제로 할 때, 같은 자리에서 상태에 맞는 문구로 바꿔 보여 준다.
   선택지의 글자·순서·효과는 그대로 두고 보이는 글만 바꾼다(강사 집계와 결과 코드는 원래 글자를 쓴다). 화면에 넣기 직전(shell)에 바꾸므로 성적표·결산 복기에도 같은 문구가 나온다. */
window.COND_TEXT=[
 {id:"9-4 A",when:g=>!g.f.planb_contract,from:"계약 조건은 6월 안대로 지킨다",to:"계약 조건은 지금 계약대로 지킨다"},
 {id:"8-1a B",when:g=>!(g.f.ct_measure||g.f.r2_measure),from:"확인된 절감 수치를 들고 가서, 2명을 1명으로 줄이자고 본사와 협상해 본다.",to:"아직 실측은 없지만 절감 근거를 정리해 가서, 2명을 1명으로 줄이자고 본사와 협상해 본다."},
 {id:"8-1a B 결과",when:g=>!(g.f.ct_measure||g.f.r2_measure),from:"확인된 절감 수치를 들고 본사에 갔습니다.",to:"절감 근거를 정리해 본사에 갔습니다."},
 {id:"6-4a 이수진",when:g=>!g.f.pub_prevent,from:"AI 항목을 20%로 넣느라 다른 항목을 고르게 줄이셨으면, 결국 예방 몫이 깎인 거네요. 올해 처음 기준에 들어간 건데요.",to:"AI 항목을 20%로 넣느라 다른 항목을 고르게 줄이셨으면, 저희가 해 온 일은 결국 어디에 들어가는 거예요? 처음부터 기준에 없던 일인데요."},
 {id:"6-4a 이수진(짧은 문구)",when:g=>!g.f.pub_prevent,from:"그럼 예방은 깎인 거네요",to:"그럼 저희가 해 온 일은 어디에 들어가요"},
 {id:"3-8 아는 사람",when:g=>!!g.f.ai_shared,from:"지금 이 사실을 아는 사람은 팀장, 문지원, 서하준 셋뿐입니다.",to:"고객 데이터가 나간 사실을 아는 사람은 지금 팀장, 문지원, 서하준 셋뿐입니다. 다만 서하준의 결과는 1월에 팀 채널에 공유되어, 같은 방식을 따라 해 본 사람이 더 있을 수 있습니다."}];
window.condText=function(h){if(typeof h!=="string"||typeof G==="undefined"||!G)return h;let x=h;COND_TEXT.forEach(c=>{try{if(x.includes(c.from)&&c.when(G))x=x.split(c.from).join(c.to);}catch(e){}});return x;};
{const _sh=shell;shell=function(html){return _sh.apply(this,[condText(html)].concat([].slice.call(arguments,1)));};}

/* ---------- 청구서 원인 연결 보강 (지시서 v3 B-5, 2026-11-22) ----------
   9월 "장기 병가 1건"(B7, 초과 부하 번아웃) 청구서가 관련 결정을 찾지 못하던 문제. 운영 칸 축소, 김 사원 야간 대기 쏠림, 차출 때 운영·예방 칸 축소를 연결 후보로 더한다.
   "찾지 못했습니다"는 후보가 하나도 없을 때만 나온다(scenes2.js causeHtml의 기존 규칙). */
if(typeof BILL_CAUSE!=="undefined"&&BILL_CAUSE.B7){
 BILL_CAUSE.B7.push([g=>!!g.cells&&cell(g,"RUN")<=1,"운영(RUN) 칸을 1칸 이하로 배분","4-2",4]);
 BILL_CAUSE.B7.push([g=>!!(g.f.night_wait||g.f.kim_no_leave||g.f.kim_waited),"야간 대기가 김 사원 한 사람에게 몰림","6-3",6]);
 BILL_CAUSE.B7.push(["c_8-1b_B","차출로 줄어든 여력을 운영·예방 칸에서 뺌","8-1b",8]);
}

/* ---------- 약속만으로 오르는 재무 (지시서 v3 B-6, 2026-11-22, 병준님 승인 전 시험 적용) ----------
   3-6 정다은 "수주액 하나로" 합의(B)는 합의하는 순간 재무가 올랐다(+3, 확률 사건까지 최대 +6). 실제 수주 없이 약속만으로 오르는 구조였다.
   합의 때는 기대값만 표시하고(G.expect), 분기 말 정산(endQuarter)에서 확정 반영한다. 최종 반영량은 그대로다. */
{const o=(()=>{try{return (CONTENT.find(s=>s.id==="3-6").options||[]).find(x=>x.k==="B");}catch(e){return null;}})();
 if(o&&/재무\+3/.test(String(o.fx))){
  o.fx=String(o.fx).replace("재무+3","`exp_mkt_one`");
  o.done="수주액 하나로 합의했습니다. 재무 효과(기대 +3)는 수주가 실제로 잡히는 분기 말 정산에서 반영합니다.";
  (o.tw||[]).forEach(t=>{if(/올린 목표를 달성할 것 같습니다/.test(t.t)&&/재무\+3/.test(String(t.fx))){t.fx=String(t.fx).replace("재무+3","`exp_mkt_goal`");t.t="올린 목표를 달성할 것 같습니다. 재무 효과(기대 +3)는 분기 말 정산에서 반영합니다.";}});
 }
 window.EXPECT_FX=[{f:"exp_mkt_one",fx:"재무+3",t:"3-6 정다은 KPI 수주액 합의"},{f:"exp_mkt_goal",fx:"재무+3",t:"3-6 올린 수주 목표 달성"}];
 const _eq=endQuarter;endQuarter=function(){
  try{EXPECT_FX.forEach(e=>{if(G.f[e.f]&&!G.f[e.f+"_done"]){applyFx(e.fx);G.f[e.f+"_done"]=true;(G.settled=G.settled||[]).push({q:G.quarter+1,t:e.t,fx:e.fx});}});}catch(e){}
  return _eq.apply(this,arguments);};
}

/* ---------- 시간·메시지 처리 (지시서 v3 B-7, 2026-11-25) ----------
   - 미결 안건: 보안·장애 절차 메시지는 시간이 끝나도 거절로 적지 않는다(engine.js expire). 대상은 아래 id.
   - 같은 인력 중복 승인: 윤 책임을 서하준(M24)·문지원(M25) 양쪽에 모두 승인하려 하면 보내기 전에 묻는다.
   - 장애 공로 메시지(M37b)의 예방 기록 요청은 5월 공로 추천 장면의 근거가 된다. */
window.PEND_IDS=["M11","M13","M16","M35","M41"];
window.pendMail=m=>PEND_IDS.includes(m.id);
window.PEND_TEXT="미결: 시간 안에 정하지 못했습니다. 승인도 거절도 아닌 미결 안건으로 남았습니다.";
window.replyGuard=function(m,x,st){
 if(m.id!=="M24"&&m.id!=="M25")return null;if(!G.f.yoon_double)return null;
 const row=x.self?m.self:x.r;let rr;try{rr=typeof row==="function"?row(st.opened):row;}catch(e){return null;}
 if(!rr||!/`yoon_double`/.test(String(rr[1]||"")))return null;
 const was=m.id==="M24"?"문지원(조달)의 감사 준비 전담":"서하준(R&D)의 AI 도구 이전";
 return ["윤 책임을 두 곳에 함께 승인할까요?",`윤 책임은 이미 <b>${was}</b>에 4월 셋째·넷째 주로 승인되어 있습니다. 이 답장을 보내면 같은 2주에 두 일을 모두 맡게 됩니다.`,"그대로 승인"];
};
{const s=CONTENT.find(x=>x&&x.id==="5-4");if(s){(s.conds2=s.conds2||[]).push({c:g=>!!g.f.prc_record,t:"이수진이 8개월 동안의 예방 점검 기록을 정리해 보내 왔습니다. 두 모듈을 엮어 추천할 근거가 있습니다."});
 const ob=(s.options||[]).find(o=>o.k==="B"),tw=ob&&(ob.tw||[]).find(t=>/한 모듈만/.test(typeof t.t==="string"?t.t:""));
 if(tw){const p0=tw.p;tw.p=g=>g.f.prc_record?10:(typeof p0==="function"?p0(g):p0);}}}

/* ---------- Phase D 서사 보강 (지시서 v3, 2026-11-25) ---------- */
/* D-1: 4월 M39(김 사원, 집에서 야간 경고)를 받았는데 8월 김 사원 장면(6-3)이 없었던 경로에도, 11월 인사팀 공문(투입량 제외)과 이어지는 메시지 한 통 */
{const s=CONTENT.find(x=>x&&x.id==="6-4a");if(s){s.conds=(s.conds||[]).concat([{c:g=>!!g.f.got_M39&&!(g.decisions||[]).some(d=>/^6-3/.test(d.scene)),t:g=>`📩 김 사원 DM · "${g.f.night_seen?"4월에 물어보셨던 그 경고요. ":""}대기표에서 빠진 뒤로 낮에는 괜찮아요. 그런데 경고는 아직 집에서 봐요, 근태 안 찍히게요. 공문 2번대로면 이 시간은 어디에도 안 남겠네요."`}]);}}
/* D-3: 2라운드 성적표에서 "지금 공개한 기준으로 설명하기 어려운 기여가 있는 사람"을 한 번 보여 주고, 기준 하나를 보완(재공지 포함)할 수 있게 한다 */
window.critGapPeople=function(){if(typeof EVAL==="undefined")return [];const pub=G.pub||[],gone=k=>typeof isGone==="function"&&isGone(k);const nm=k=>typeof name==="function"?name(k):k;
 return EVAL.filter(e=>!gone(e.k)).map(e=>{const rs=e.r.filter(r=>!r[3]&&(r[2]||[]).length&&(!r[1]||G.f[r[1]]));const ok=rs.filter(r=>r[2].some(x=>pub.includes(x))).length;
  if(ok>=2)return null;const need={};rs.filter(r=>!r[2].some(x=>pub.includes(x))).forEach(r=>r[2].forEach(x=>{if(x!=="리더 종합 판단")need[x]=(need[x]||0)+1;}));const nk=Object.keys(need).sort((a,b)=>need[b]-need[a]);
  return nk.length?{k:e.k,n:nm(e.k),ok,need:nk}:null;}).filter(Boolean);};
window.critGapHtml=function(r){if(r!==2||G.review)return "";const L=critGapPeople(),done=G.f.crit_mid_add;if(!L.length)return done?`<div class="happen"><span class="label">기준 보완</span>"${done}"${jo(done,"을","를")} 기준에 더하고 다시 공지했습니다. 지금 기준으로 설명하기 어려운 사람은 없습니다.</div>`:"";
 const cand={};L.forEach(x=>x.need.forEach(c=>{cand[c]=(cand[c]||0)+1;}));const top=Object.keys(cand).sort((a,b)=>cand[b]-cand[a]).slice(0,3);
 return `<div class="happen"><span class="label">지금 기준으로 설명하기 어려운 기여</span>${L.slice(0,4).map(x=>`· <b>${x.n}</b>: 공개한 기준에 맞는 기록 ${x.ok}건. "${x.need[0]}"${x.need[1]?` 또는 "${x.need[1]}"`:""}${jo(x.need[1]||x.need[0],"이","가")} 기준에 있으면 쓸 수 있는 기록이 있습니다.`).join("<br>")}${L.length>4?`<br>· 그 밖에 ${L.length-4}명`:""}<br><small>12월 평가에서는 공개한 기준에 맞는 기록이 2건 이상이어야 근거가 됩니다. 지금 기준을 하나 보완할 수 있습니다. 규칙 ③대로 팀 전체에 다시 알리는 것까지 포함합니다.</small>
  ${done?`<p style="margin-top:6px"><b>보완함:</b> "${done}"${jo(done,"을","를")} 기준에 더하고 다시 공지했습니다.</p>`:`<div class="btns" style="margin-top:8px">${top.map(c=>`<button class="btn" data-crit="${c}" onclick="v3CritAdd(this.dataset.crit)">"${c}" 더하고 다시 공지</button>`).join("")}</div>`}</div>`;};
window.v3CritAdd=function(c){if(G.f.crit_mid_add||!c)return;G.pub=(G.pub||[]).concat([c]);G.f.crit_mid_add=c;{const k=((CONTENT.find(x=>x&&x.id==="3-1")||{}).cards||[]).find(x=>x.n===c);if(k&&k.f)G.f[k.f]=true;}G.f.renotice=true;applyFx("안전+1 사람+1");record("R2-crit",c);toast(`"${c}"${jo(c,"을","를")} 기준에 더하고 팀 전체에 다시 알렸습니다.`);{const b=document.querySelector("[data-crit]"),box=b&&b.closest(".happen");if(box)box.outerHTML=critGapHtml(2);}};
/* D-2: 결산 질문용 — C를 준 사람과 그 근거 기록 수 */
window.gradeCInfo=function(){const g=G.grades||{};return Object.keys(g).filter(k=>g[k].등급==="C").map(k=>({n:typeof name==="function"?name(k):k,ev:(g[k].근거||[]).length,fit:!!g[k].근거충족}));};
