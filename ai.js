/* AI 분석 검증 도장 (AI 협업역량 측정)
   AI 분석이 붙은 메일·안건마다 처리 전에 도장을 찍는다: 확인(맞음) / 오류 / 검증 불가.
   원자료의 줄을 근거로 고를 수 있고(최대 2줄), 담당자에게 물어볼 수 있다(시간이 든다).
   정답(truth)은 결산에서 처음 공개한다. 기록: G.ver */
const STAMP={ok:"확인 (분석이 맞음)",err:"오류 (분석이 틀림)",unv:"검증 불가 (원자료로 판단할 수 없음)"};
const STAMP_SHORT={ok:"확인",err:"오류",unv:"검증 불가"};

/* 받은편지함 메일에 붙는 분석 */
const AIREP={
M11:{sub:"BT-22 야간 배치 지연",src:"모니터링 AI 원인 분석",ai:["지연 원인은 E-417입니다. 가공 배치가 생산 집계보다 먼저 시작돼 잠금이 걸렸습니다. 지난해 3건과 같은 순서입니다."],
 raw:{head:["시각·일자","기록"],rows:[["01:02","가공 배치 BT-22 시작"],["01:04","생산 집계 시작"],["01:05","E-417 잠금 대기"],["작년 3/14 · 7/2 · 11/20","E-417 발생. 세 번 모두 가공 배치가 먼저 시작"]]},
 truth:"ok",key:[0,1,3],ask:{who:"prc",t:"순서 맞아요. 작년에도 다 이렇게 났어요."},
 why:"오늘과 작년 3건 모두 가공 배치가 집계보다 먼저 시작됐습니다. 분석이 원자료와 맞습니다."},
M21:{sub:"1분기 AI 절감 효과",src:"재무팀 AI 집계",ai:["1분기 AI 도입으로 팀은 주 140시간을 절감했습니다."],
 raw:{head:["항목","주당 시간","구분"],rows:[["모듈별 절감 추정치 합계","140","각 모듈이 낸 추정"],["작업이 실제로 없어진 것이 확인된 분","38","실측"],["확인되지 않은 분","102","측정 전"]]},
 truth:"err",key:[1,2],ask:{who:"src",t:"140은 모듈마다 낸 추정을 더한 거예요. 확인된 건 38이고요."},
 why:"140시간은 추정치 합계입니다. 실제로 확인된 절감은 38시간이라 '절감했다'는 결론은 원자료와 다릅니다."},
M32:{sub:"상반기 토큰과 모듈별 성과",src:"재무팀 AI 분석",ai:["토큰을 가장 많이 쓴 R&D가 토큰 1당 성과도 가장 높습니다."],
 raw:{head:["모듈","토큰 사용 비중","성과 기여 비중"],rows:[["R&D","45%","18%"],["마케팅","31%","27%"],["생산","8%","22%"],["가공","9%","19%"],["조달","7%","14%"]]},
 truth:"err",key:[0,2],ask:{who:"src",t:"성과 기여 비중은 본사 기준표를 그대로 옮긴 거예요."},
 why:"R&D는 사용 45%에 기여 18%로 토큰 1당 성과가 가장 낮은 편입니다. 가장 높은 곳은 생산입니다."},
M34:{sub:"가공 모듈 점검 완료율",src:"본사 품질팀 AI 요약",ai:["가공 모듈 배포 전 점검 완료율 100%, 점검 누락 0건. 전사 최우수입니다."],
 raw:{head:["항목","값"],rows:[["점검표 체크 완료","47/47 항목 (최근 배포 12회)"],["체크 입력 시각","모두 배포 2~3분 전"],["점검 실행 로그","수집 대상 아님"],["배포 뒤 결함 보고","0건"]]},
 truth:"unv",key:[1,2],ask:{who:"prc",t:"실행 로그요? 점검은 체크로만 남겨요. 따로 남는 기록은 없어요."},
 why:"체크 표시는 100%지만 점검을 실제로 했는지 보여 줄 로그가 없습니다. 원자료로는 맞는지 틀린지 판단할 수 없습니다."}
};

/* 받은편지함이 없는 달의 AI 검토 안건. before: 이 장면 바로 앞에 끼운다 */
const AIQ=[
{id:"AI2",before:"2-5",month:2,rel:"mfg",from:"모니터링 AI · 강태식 전달",sub:"1월 야간 경고 분류",lead:"강태식이 AI 분류 결과를 넘겼습니다. \"자동 규칙 만들 때 이걸 기준으로 쓰려고요.\"",
 ai:["1월 야간 경고 212건 중 191건(90%)이 반복되는 3종입니다. 디스크 사용률 경고, 배치 지연, 인증 재시도입니다."],
 raw:{head:["경고 종류","건수"],rows:[["디스크 사용률 경고","88"],["배치 지연","61"],["인증 재시도","42"],["기타 14종","21"],["합계","212"]]},
 truth:"ok",key:[0,1,2,4],ask:{who:"mfg",t:"그 세 개가 거의 다예요. 나머지는 가끔 떠요."},
 why:"88+61+42=191건, 합계 212건의 90%입니다. 분석이 원자료와 맞습니다.",
 fx:{use:"안정+1 mfg+1 `ai_night_ok`",fix:"mfg-2",hold:"안정-1"}},
{id:"AI3",before:"3-1",month:3,rel:"prc",from:"인사팀 AI 요약",sub:"작년 평가 결과 요약",lead:"KPI 합의 전에 인사팀이 작년 평가 요약을 보냈습니다.",
 ai:["작년 B등급 7명은 모두 KPI를 다 채우지 못했습니다. KPI 미달이 B등급의 공통 원인입니다."],
 raw:{head:["구분","인원"],rows:[["작년 B등급","7명"],["그중 KPI 100% 달성","3명"],["그중 KPI 미달","4명"],["작년 이의제기","3건 (모두 KPI 100% 달성자)"]]},
 truth:"err",key:[1,3],ask:{who:"인사팀 담당자",t:"요약은 AI가 평균만 보고 만든 거라서요. 명단은 원자료 그대로입니다."},
 why:"B등급 7명 중 3명은 KPI를 다 채웠고, 이의제기 3건이 모두 그 3명에게서 나왔습니다.",
 fx:{use:"안전-1 `ai3_used`",fix:"안전+1 사람+1 `kpi_gap_seen`",hold:""}},
{id:"AI5",before:"5-3",month:5,rel:"prc",from:"품질 AI · 장애 사후 분석 초안",sub:"5월 배포 장애 원인",lead:"장애 뒤 사후 분석 보고서의 AI 초안이 올라왔습니다. 금요일까지 확정해야 합니다.",
 ai:["원인: 작업자 확인 누락(가공 모듈 오 사원).","재발 방지: 해당 작업자 재교육."],
 raw:{head:["항목","기록"],rows:[["배포 전 점검표","47개 항목"],["당일 점검에 쓴 시간","12분 (1인)"],["같은 항목 누락, 지난 분기","3건 (다른 작업자 3명)"],["누락된 항목","31번 연동 테이블 확인"]]},
 truth:"err",key:[1,2],ask:{who:"prc",t:"그 항목은 다들 놓쳐요. 47개를 12분에 보니까요."},
 why:"같은 누락이 다른 작업자 3명에게도 있었습니다. 47개 항목을 12분에 혼자 보는 구조의 문제이며, 한 사람의 누락으로 결론 낼 근거가 없습니다.",
 fx:{use:"prc-1 안전-2 `ai5_blame`",fix:"prc+1 안전+1 `ai5_fixed`",hold:""}},
{id:"AI6",before:"6-7",month:6,rel:"src",exec:true,from:"본사 경영지원 임원",sub:"[반영 바람] AI 생산성 진단 결과",lead:"본사 임원의 메일: \"좋은 분석입니다. 하반기 인력 계획에 반영 바랍니다.\"",
 ai:["귀 팀 운영 업무의 22%를 AI로 대체할 수 있습니다. 운영 인력 22% 조정이 가능합니다."],
 raw:{head:["산식 항목","값"],rows:[["대체율 계산 방식","자동화 가능 업무 항목 수 ÷ 전체 업무 항목 수"],["시간 가중","적용하지 않음"],["자동화 가능 항목","41개 중 9개 (대부분 5분 안쪽 작업)"],["야간 대기 업무","진단 대상에서 제외"]]},
 truth:"err",key:[0,1,3],ask:{who:"본사 진단 담당",t:"항목 수 기준이 맞습니다. 업무 시간 자료는 받지 못했습니다."},
 why:"대체율을 업무 항목의 개수로 셌고 시간으로 따지지 않았습니다. 야간 대기도 빠져 있어 '인력 22% 조정'으로 이어질 근거가 없습니다.",
 act:{use:{t:"지시대로 하반기 인력 계획에 반영한다.",fx:"성과+2 사람-3 안전-2 `ai22_accepted`",done:"진단 결과를 하반기 계획에 반영했습니다. 팀 게시판: \"22%가 누구예요?\""},
  fix:{t:"산식의 한계를 짚어 임원에게 정정 의견을 보낸다.",cost:1,fx:"성과-1 안정+1 사람+2 `upward_fix`",done:"정정 의견을 보냈습니다. 비서실: \"검토하겠습니다.\"",tw:[{p:40,t:"임원: \"현장은 늘 그렇게 말하더군요.\"",fx:"성과-1"},{p:30,t:"본사가 시간 기준으로 진단을 다시 돌리기로 했습니다.",fx:"사람+1 `ai22_redo`"}]},
  hold:{t:"반영을 미루고 업무 시간 자료로 다시 봐 달라고 한다.",fx:"성과-1",done:"자료를 다시 요청했습니다. 답은 아직 없습니다."}}},
{id:"AI8",before:"8-2",month:8,rel:"mfg",from:"R&D 용량 예측 AI",sub:"9월 성수기 야간 경고 예측",lead:"서하준이 9월 예측을 공유했습니다. \"대기표 짤 때 쓰시면 돼요.\"",
 ai:["9월 야간 경고는 하룻밤 약 190건으로 예상됩니다. 1인 처리량 40건 기준으로 야간 대기 5명이 필요합니다."],
 raw:{head:["항목","값"],rows:[["올해 7월 하룻밤 평균 경고","105건"],["작년 9월 ÷ 작년 7월","1.8배"],["1인 하룻밤 처리량","40건"],["현재 야간 대기","3명"]]},
 truth:"ok",key:[0,1,2],ask:{who:"rd",t:"작년 패턴을 그대로 곱한 거예요. 올해 7월이 작년보다 조금 높긴 해요."},
 why:"105건의 1.8배는 약 190건이고, 40건씩 나누면 5명입니다. 분석이 원자료와 맞습니다.",
 fx:{use:"안정+2 mfg+1 `ai8_used`",fix:"rd-2",hold:"안정-1"}},
{id:"AI9",before:"9-4",month:9,rel:"mkt",exec:true,from:"F사 유 과장",sub:"AI 가용성 재산정 결과 공유",lead:"\"임원께서 AI로 재산정한 결과를 보셨습니다. 이 수치로 조건을 다시 논의하자고 하십니다.\"",
 ai:["F사 AI 재산정: 상반기 납품 시스템 가용성 98.7% (귀사 보고 99.4%)."],
 raw:{head:["항목","상반기 시간"],rows:[["전체 운영 시간","4,344시간"],["장애로 멈춘 시간","26시간"],["사전 공지한 계획 정비","30시간"],["F사 산식에서 '중단'으로 센 시간","56시간 (장애 + 계획 정비)"]]},
 truth:"err",key:[2,3],ask:{who:"mkt",t:"계약서 부속서에 계획 정비는 가용성 계산에서 뺀다고 돼 있어요."},
 why:"98.7%는 계약상 빼야 하는 계획 정비 30시간까지 중단으로 센 값입니다. 장애 26시간만 세면 99.4%입니다.",
 act:{use:{t:"수치를 받아들이고 조건 논의를 준비한다.",fx:"F사만족+1 재무-2 `ai9_accepted`",done:"재산정 수치를 받아들인다고 회신했습니다."},
  fix:{t:"계획 정비가 들어간 산식임을 짚어 정정 의견을 보낸다.",cost:1,fx:"F사만족-1 `ai9_fixed`",done:"계획 정비 30시간이 포함됐다는 점을 짚어 회신했습니다. 유 과장: \"임원께 그대로 전하겠습니다.\""},
  hold:{t:"산식 원본을 먼저 보내 달라고 요청한다.",fx:"`ai9_asked`",done:"산식 원본을 요청했습니다."}}},
{id:"AI10",before:"10-2",month:10,rel:"mkt",from:"정다은 · 수주 리스크 AI 요약",sub:"본계약 착수 리스크",lead:"정다은이 계약 범위 회의 전에 AI 요약을 돌렸습니다. \"보시면 아시겠지만 괜찮아요.\"",
 ai:["1월 착수 시 데이터 준비율 50%로 납기 위험은 '낮음'입니다."],
 raw:{head:["항목","값"],rows:[["데이터 준비율","50% (출처 표시 없음)"],["착수에 필요한 준비율","정의되지 않음"],["유사 과제 3건의 납기","2건 지연"]]},
 truth:"unv",key:[0,1],ask:{who:"rd",t:"50%요? 저희가 낸 숫자는 아닌데요. 아직 세어 보지 않았어요."},
 why:"준비율 50%의 출처가 없고 착수에 필요한 준비율도 정해져 있지 않습니다. '위험 낮음'이 맞는지 원자료로 판단할 수 없습니다.",
 fx:{use:"mkt+1 `ai10_used` `scope_risk`",fix:"mkt-1",hold:"rd+1 `ai10_hold`"}},
{id:"AI11a",before:"11-2",month:11,rel:"mkt",from:"보고서 AI · 기여자 자동 추출",sub:"우수 사례 보고서 기여자",lead:"본사 우수 사례 보고서 양식에 AI가 기여자를 자동으로 채웠습니다.",
 ai:["주요 기여자: 정다은 (작성자란 기준). 그 밖의 기여자 없음."],
 raw:{head:["편집 이력","비중"],rows:[["한 선임","본문 68%"],["정다은","본문 21%, 표지"],["이수진","부록 11%"],["작성자란","정다은"]]},
 truth:"err",key:[0,2],ask:{who:"mkt",t:"작성자란은 늘 리더 이름으로 써요. 관행이에요."},
 why:"편집 이력상 본문의 68%를 한 선임이, 부록을 이수진이 썼습니다. 작성자란만 보고 뽑은 결과입니다.",
 fx:{use:"mkt+1 안전-2 `ai11_cover`",fix:"mkt-1 안전+2 `ai11_fixed`",hold:""}},
{id:"AI11b",before:"11-6",month:11,rel:"src",from:"재무 AI · 연간 토큰 정산 요약",sub:"토큰 효율 개선",lead:"연간 정산 메일에 AI 요약이 붙어 있습니다.",
 ai:["올해 토큰 1당 성과가 전년보다 개선됐습니다."],
 raw:{head:["항목","값"],rows:[["올해 토큰 1당 성과","측정함 (올해 처음)"],["전년 토큰 1당 성과","측정하지 않음"],["전년 토큰 비용 처리","본사 공통비"]]},
 truth:"unv",key:[1,2],ask:{who:"src",t:"작년엔 토큰이 본사 공통비라 팀별로 안 셌어요."},
 why:"전년에는 이 값을 재지 않았습니다. 비교 대상이 없어 '개선됐다'고 판단할 수 없습니다.",
 fx:{use:"재무+1 `ai11b_used`",fix:"src-1",hold:"src+1"}},
{id:"AI12",before:"12-3a",month:12,rel:"src",from:"인사시스템 AI",sub:"KPI 달성률 기준 등급 추천",lead:"인사시스템이 등급 추천안을 띄웠습니다.",
 ai:["KPI 달성률 순서로 배분 가이드에 맞춘 추천 등급입니다. 계산 오류 없음."],
 raw:{head:["확인 항목","결과"],rows:[["KPI 달성률 입력값","11명 모두 인사시스템 원값과 일치"],["배분 가이드 (S·A·B·C)",["S","A","B","C"].map(g=>GRADE_GUIDE[g]).join("·")+", 추천 결과와 일치"],["달성률 순서","추천 순서와 일치"]]},
 truth:"ok",key:[0,1,2],ask:{who:"인사팀 담당자",t:"계산은 맞습니다. 쓰실지는 팀장님 판단이고요."},
 why:"입력값, 배분, 순서가 모두 원자료와 맞습니다. 계산은 정확합니다. 이 추천을 등급의 근거로 쓸지는 따로 판단할 일입니다.",
 act:{use:{t:"추천 등급을 참고 자료로 받아 둔다.",fx:"",done:"추천안을 참고 자료로 저장했습니다."},
  fix:{t:"계산이 틀렸다며 다시 돌려 달라고 한다.",cost:1,fx:"안정-1",done:"다시 요청했습니다. 인사팀: \"다시 돌렸는데 같은 결과입니다.\""},
  hold:{t:"추천은 보지 않고 관찰 기록만으로 정하기로 한다.",fx:"",done:"추천안을 닫았습니다."}}}
];

/* ----- 화면 ----- */
function verRec(id,o){G.ver=G.ver||[];const i=G.ver.findIndex(x=>x.id===id);if(i>=0)G.ver[i]={...G.ver[i],...o};else G.ver.push({id,...o});}
function aiBoxHtml(it,v,redraw,askCost,askLabel){
 const rows=it.raw.rows.map((r,i)=>`<button class="rawrow" aria-pressed="${v.ev.includes(i)}" ${A(()=>{const j=v.ev.indexOf(i);if(j>=0)v.ev.splice(j,1);else{if(v.ev.length>=2)v.ev.shift();v.ev.push(i);}redraw();})}>${r.map(c=>`<span>${c}</span>`).join("")}</button>`).join("");
 return `<div class="aibox"><div class="label">🤖 ${it.src||it.from}</div>${it.ai.map(t=>`<p>${t}</p>`).join("")}
 <div class="label" style="margin-top:8px">원자료 <span class="note">도장의 근거로 쓸 줄을 눌러 고를 수 있습니다 (최대 2줄)</span></div>
 <div class="rawtab"><div class="rawrow head">${it.raw.head.map(c=>`<span>${c}</span>`).join("")}</div>${rows}</div>
 ${v.asked?`<div class="say">${typeof it.ask.who==="string"&&LD[it.ask.who]||PP[it.ask.who]?face(it.ask.who):""}<div><b>${LD[it.ask.who]||PP[it.ask.who]?name(it.ask.who):it.ask.who}</b><span>${it.ask.t}</span></div></div>`:`<div class="btns" style="margin-top:8px"><button class="btn" ${askCost.dis?"disabled":""} ${A(()=>{if(askCost.pay)askCost.pay();v.asked=true;redraw();})}>${askLabel}</button></div>${askCost.dis?`<p class="note">${askCost.dis}</p>`:""}`}
 <div class="label" style="margin-top:8px">검증 도장</div><div class="btns">${["ok","err","unv"].map(k=>`<button class="btn ${v.stamp===k?"main":""}" aria-pressed="${v.stamp===k}" ${A(()=>{v.stamp=k;redraw();})}>${STAMP[k]}</button>`).join("")}</div></div>`;}
function evOK(it,ev){return ev.some(i=>it.key.includes(i));}

/* 받은편지함 안에서: 도장을 찍어야 답장·위임·보류 버튼이 나온다 */
function aiInbox(m,st,redraw){const it=AIREP[m.id];st.vs=st.vs||{};const v=st.vs[m.id]=st.vs[m.id]||{stamp:null,ev:[],asked:false};
 const ask={dis:st.left<=15?"물어볼 시간이 없습니다.":"",pay:()=>{st.left=Math.max(0,st.left-15);G.verAsk=(G.verAsk||0)+1;}};
 return aiBoxHtml(it,v,redraw,ask,`${typeof it.ask.who==="string"&&(LD[it.ask.who]||PP[it.ask.who])?name(it.ask.who):it.ask.who}에게 원자료를 물어본다 · 15초`)+
 `<div class="btns"><button class="btn main" ${v.stamp?"":"disabled"} ${A(()=>{st.vdone=st.vdone||{};st.vdone[m.id]=true;verRec(m.id,{sub:it.sub,month:G.month,truth:it.truth,stamp:v.stamp,ev:[...v.ev],evOK:evOK(it,v.ev),asked:v.asked,exec:false});redraw();})}>도장 찍고 처리하기</button></div>`;}
/* 시간이 다 돼 도장 없이 넘어간 메일 */
function aiInboxExpire(s,st){s.mail.forEach(m=>{if(AIREP[m.id]&&!(st.vdone||{})[m.id]){const it=AIREP[m.id];verRec(m.id,{sub:it.sub,month:G.month,truth:it.truth,stamp:null,ev:[],evOK:false,asked:false,exec:false});}});}

/* 월별 AI 검토 장면. 원자료를 물어보는 일은 한 문장이면 되므로 ⏳0.5 */
const ASK_COST=.5;
const AI_FIX={ok:["정정을 요청했습니다. 담당자: \"원자료와 다시 맞춰 봤는데 그대로입니다.\"","정정을 요청했습니다. 담당자: \"다시 돌려 봤습니다. 숫자는 같습니다.\"","정정을 요청했습니다. 담당자: \"한 줄씩 견줘 봤는데 틀린 곳을 못 찾았습니다.\"","정정을 요청했습니다. 담당자: \"어느 줄이 틀렸는지 짚어 주시겠어요? 저는 맞게 나옵니다.\""],
 err:["정정을 요청했습니다. 담당자가 짚은 줄을 확인하고 결론을 고쳤습니다.","정정을 요청했습니다. 담당자: \"그 줄을 놓쳤네요. 결론을 다시 썼습니다.\"","정정을 요청했습니다. 고친 판이 그날 오후에 다시 올라왔습니다.","정정을 요청했습니다. 담당자가 원자료를 다시 보고 결론을 바꿨습니다."],
 unv:["정정을 요청했습니다. 담당자: \"무엇이 틀렸는지는 이 자료로는 알 수 없어요.\"","정정을 요청했습니다. 담당자: \"틀렸다고 할 근거도 맞다고 할 근거도 여기엔 없습니다.\"","정정을 요청했습니다. 담당자: \"고치려면 원자료부터 더 받아야 합니다.\"","정정을 요청했습니다. 담당자: \"어느 쪽으로 고쳐야 할지 저도 모르겠습니다.\""]};
function SC_AIQ(s){const it=s.item;const fixLine=vary("aifix_"+it.truth,AI_FIX[it.truth]);const v={stamp:null,ev:[],asked:false};let step=1;
 const d=()=>{paint("");
  if(step===1){const rsv=isKey({id:it.id}),short=!rsv&&G.time<ASK_COST;if(short&&!v.asked){G.aiLock=G.aiLock||{};G.aiLock[it.id]=1;}
   shell(`<div class="pane"><div class="eyebrow">AI 분석 검토 · ${G.month}월</div><h2>${it.sub}</h2><div class="prose"><p>${it.lead}</p><p class="note">${it.from}</p></div>
   ${aiBoxHtml(it,v,d,{dis:short?lackText(ASK_COST-G.time):"",pay:()=>{if(rsv)G.rsvUsed=(G.rsvUsed||0)+ASK_COST;else G.time-=ASK_COST;G.tu.all+=ASK_COST;G.verAsk=(G.verAsk||0)+1;if(G.aiLock)delete G.aiLock[it.id];}},`${typeof it.ask.who==="string"&&(LD[it.ask.who]||PP[it.ask.who])?name(it.ask.who):it.ask.who}에게 원자료를 물어본다 · ${rsv?"예약 ":""}⏳${ASK_COST}`)}
   <div class="foot"><span class="note">도장을 찍은 뒤 이 분석을 어떻게 쓸지 정합니다.</span><button class="btn main" ${v.stamp?"":"disabled"} ${A(()=>{verRec(it.id,{sub:it.sub,month:G.month,truth:it.truth,stamp:v.stamp,ev:[...v.ev],evOK:evOK(it,v.ev),asked:v.asked,exec:!!it.exec});step=2;d();})}>도장 찍기</button></div></div>`);
  }else{
   const A0={use:{t:"분석을 받아들여 다음 결정에 쓴다."},fix:{t:"틀린 곳을 짚어 작성자에게 정정을 요청한다.",cost:1},hold:{t:"결론을 쓰기 전에 원자료를 더 받아 본다."}};
   const dfx={ok:{use:"성과+1",fix:(it.rel||"mfg")+"-2",hold:"성과-1"},err:{use:"안정-2",fix:"안정+1",hold:""},unv:{use:"안정-1",fix:"",hold:"안정+1"}}[it.truth];
   const ddone={use:"분석대로 반영했습니다.",fix:fixLine,hold:"원자료를 더 요청했습니다."};
   const opts=["use","fix","hold"].map((k,i)=>{const a={...A0[k],...((it.act||{})[k]||{})};return {k:"ABC"[i],t:a.t,cost:a.cost||0,fx:a.fx!=null?a.fx:(it.fx?it.fx[k]:dfx[k]),done:a.done||ddone[k],tw:a.tw,onDone:()=>verRec(it.id,{action:k})};});
   SC_CHOICE({id:it.id,tag:"AI 분석 검토",when:G.month+"월",title:"이 분석을 어떻게 쓸까요?",rel:it.rel,intro:[`찍은 도장: ${STAMP[v.stamp]}${v.ev.length?` · 근거로 고른 줄: ${v.ev.map(i=>it.raw.rows[i][0]).join(", ")}`:" · 근거로 고른 줄 없음"}`],options:opts});
  }};
 d();}
SCENES.aiq=s=>SC_AIQ(s);

/* 끼우기: 각 안건을 지정한 장면 바로 앞에 */
AIQ.forEach(it=>{const i=CONTENT.findIndex(x=>x.id===it.before);const sc={id:it.id,type:"aiq",month:it.month,when:it.month+"월",tag:"AI 분석 검토",title:it.sub,item:it};if(i>=0)CONTENT.splice(i,0,sc);});

/* 뒤 장면에 남는 흔적 */
(function(){const addC=(id,c,t)=>{const all=CONTENT.flatMap(x=>[x,...(Array.isArray(x.cases)?x.cases:[])]);const s=all.find(x=>x.id===id);if(s)s.conds=(s.conds||[]).concat([{c,t}]);};
 addC("5-3",g=>g.f.ai5_fixed,"AI 초안이 한 사람의 누락으로 결론 낸 부분을 정정해 두었다.");
 addC("5-3",g=>g.f.ai5_blame,"AI 초안의 \"작업자 확인 누락(오 사원)\"이 그대로 보고서에 올라가 있다.");
 addC("8-1a",g=>g.f.ai22_accepted,"6월에 반영한 AI 진단(운영 인력 22% 조정 가능)이 공문 근거로 붙어 있다.");
 addC("8-1a",g=>g.f.upward_fix,"6월에 보낸 AI 진단 정정 의견이 본사 기록에 남아 있다.");
 addC("9-4",g=>g.f.ai9_fixed,"F사 재산정에 계획 정비 30시간이 들어간 것을 짚어 두었다.");
 addC("9-4",g=>g.f.ai9_accepted,"F사 재산정 수치를 받아들인다고 이미 회신했다.");
 addC("10-2",g=>g.f.ai10_hold,"데이터 준비율을 실제로 세어 보라고 서하준에게 요청해 두었다.");
 addC("11-2",g=>g.f.ai11_fixed,"편집 이력에서 한 선임 68%, 이수진 11%를 확인해 두었다.");
 addC("11-2",g=>g.f.ai11_cover,"AI가 채운 기여자란에는 정다은 한 사람만 있다.");
})();

/* 결산용 지표 */
function verStats(){const v=G.ver||[];const n=v.length;const st=v.filter(x=>x.stamp);const acc=st.filter(x=>x.stamp===x.truth).length;
 const over=v.filter(x=>x.truth==="ok"&&x.stamp&&x.stamp!=="ok").length,blind=v.filter(x=>x.truth!=="ok"&&x.stamp==="ok").length;
 const ev=st.filter(x=>x.ev&&x.ev.length).length,evGood=st.filter(x=>x.evOK).length;
 /* 시간이 모자라 정정 의견 선택지가 잠겨 있던 건은 분모에서 뺀다 */
 const fz=id=>(G.decisions||[]).some(d=>d.scene===id&&d.forced&&d.lockedOpt);const upF=v.filter(x=>x.exec&&x.truth==="err"&&x.action!=="fix"&&fz(x.id)).length;
 const up=v.filter(x=>x.exec&&x.truth==="err"&&x.action==="fix").length,upN=v.filter(x=>x.exec&&x.truth==="err").length-upF;
 return{n,stamped:st.length,acc,over,blind,ev,evGood,ask:G.verAsk||0,askLock:Object.keys(G.aiLock||{}).length,missed:n-st.length,up,upN,upF};}
function verHtml(){const s=verStats();if(!s.n)return "";const pct=(a,b)=>b?Math.round(a/b*100)+"%":"-";
 const all=Object.assign({},AIREP);AIQ.forEach(x=>all[x.id]=x);
 return `<h2 style="font-size:18px">AI 분석과 일한 방식</h2><div class="table">
 ${[["검증 정확도",`${s.acc}/${s.n} (${pct(s.acc,s.n)})`],["과잉 의심 (맞는 분석을 의심함)",s.over+"건"],["맹신 (틀리거나 판단할 수 없는 분석을 확인함)",s.blind+"건"],["근거를 붙인 판단",`${s.ev}/${s.stamped} (${pct(s.ev,s.stamped)}) · 그중 핵심 줄을 고른 판단 ${s.evGood}`],["원자료를 물어본 횟수",s.ask+"회"+(s.askLock?` · 시간이 없어 묻지 못함 ${s.askLock}회`:"")],["윗선·고객에게 낸 정정 의견",`${s.up}/${s.upN}`+(s.upF?` · 시간이 없어 고르지 못함 ${s.upF}건`:"")]].concat((()=>{const d=Object.values(G.draftLog||{});if(!d.length)return [];const n=d.reduce((p,x)=>p+x.n,0),l=d.reduce((p,x)=>p+x.left,0);return [["AI 초안의 틀린 곳을 고쳐 보낸 글",`${n-l}/${n}`]];})()).concat(s.missed?[["도장 없이 지나간 분석",s.missed+"건"]]:[]).map(([a,b])=>`<div class="card" style="display:flex;justify-content:space-between;gap:12px"><span style="font-size:14px;color:var(--ink)">${a}</span><b style="font-size:15px;text-align:right">${b}</b></div>`).join("")}</div>
 <details class="ref"><summary>분석별 정답 보기</summary><div class="prose" style="font-size:14.5px;margin-top:8px">${(G.ver||[]).map(x=>{const it=all[x.id];return it?`<p><b>${x.month||""}월 ${it.sub}</b> · 내 도장: ${x.stamp?STAMP_SHORT[x.stamp]:"없음"} · 정답: ${STAMP_SHORT[it.truth]}<br><span class="note">${it.why} 핵심 줄: ${it.key.map(i=>it.raw.rows[i][0]).join(", ")}</span></p>`:""}).join("")}</div></details>`;}
