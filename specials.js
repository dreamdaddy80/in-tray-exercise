/* 생성 데이터가 참조하는 표 (원고 규칙) */
const SECONDS={"4-1":()=>300,"7-1":g=>CONTENT[g.idx].mail.filter(m=>m.need==null||g.safe>=m.need).length*30};
const fat=g=>{const f=g.big>=5?2:g.big===4?1:0;g.fatigue=f;return f;};
const pm=g=>g.pulse[g.quarter-1]||[50,50,50];
/* 분기별로 "업무 배분이 공정하다" 문항을 움직이는 결정. 식에 이미 들어 있는 것(대기표 변경, 표지 규칙 등)은 여기에 넣지 않는다 */
const FAIR=[
 [["pub_full",4,"3월 평가 기준을 전원에게 공개함"],["pub_leaders",-4,"3월 평가 기준을 리더들과만 맞춤"],["night_open",4,"2월 야간 대기를 모듈 밖까지 열어 나눔"],["kim_no_leave",-2,"1월에 김 사원이 쉬지 못함"]],
 [["alloc_notice",4,"4월 배분 기준을 공지함"],["alloc_none",-4,"4월 배분을 알리지 않음"],["award_both",4,"5월 포상을 두 모듈 이름으로 냄"],["award_fix",-3,"5월 포상을 한 모듈로만 냄"],["kim_rest",2,"6월 김 사원의 대기를 덜어 줌"],["night_open",2,"야간 대기를 모듈 밖까지 나눠 서는 중"]],
 [["report_both",3,"상반기 보고서에 모듈별 기여를 적음"],["award_form",2,"예방과 복구를 함께 적는 포상 양식이 생김"],["night_auto",2,"야간 경고를 자동으로 걸러 대기 부담을 줄임"],["hq_two",-2,"본사 차출로 2명이 빠짐"],["alloc_renotice",2,"6월 재배분의 이유를 알림"]],
 [["credit_both",3,"9월 포상에 복구자와 점검자를 함께 올림"],["credit_fix",-3,"9월 포상을 복구자에게만 줌"],["bae_move",2,"배 책임의 이동을 승인함"],["scope_full",-2,"전 품목 1월 착수로 일이 몰림"],["b26_score",2,"내년 예산을 같은 잣대로 매겨 나눔"]],
];
function fairAdj(g,q){return (FAIR[q]||[]).filter(x=>g.f[x[0]]).map(x=>[x[2],x[1]]);}
const QS={
 "6-7":g=>{const f=fat(g),p=pm(g);return [p[0]+(g.f.alloc_notice?5:0)+(g.f.renotice?5:0)-(g.f.rule_silent?8:0)-(g.f.renotice_split?3:0)+g.told.full*2-g.told.none*2,50+(g.score.사람-50)*.3+(g.f.credit_rule?3:0)-(g.f.pulse_split_q1?3:0)-g.over*3-(g.f.night_stuck?8:0)-g.broken*5,g.score.사람*.6+g.safe*.4-g.burnout-f*3];},
 "9-7":g=>{const f=fat(g),p=pm(g);return [p[0]+(g.f.alloc_renotice?3:0)+g.told.full*2-g.told.none*2-(g.f.rule_silent?5:0)-(g.bills.includes("B8")?5:0),50+(g.score.사람-50)*.3+(g.f.credit_rule?3:0)+(g.f.night_rotate?3:0)+(g.f.credit_both?3:0)-(g.f.report_mkt?2:0)-g.over*3-g.broken*5-(g.bills.includes("B5")?5:0)-(g.f.pulse_split_q2?3:0),g.score.사람*.6+g.safe*.4-g.burnout-f*3-(g.f.cha_left?3:0)];},
 "12-1":g=>{const f=fat(g),p=pm(g);const gone=["yoon_end_left","oh_end_left","han_left","cha_left"].filter(x=>g.f[x]).length;return [p[0]+g.told.full*2-g.told.none*2-(g.f.rule_silent?5:0)-(g.bills.includes("B10")?8:0)+(g.f.b26_score?3:0),50+(g.score.사람-50)*.3+(g.f.case_doer?3:0)+(g.f.win_credit?3:0)-(g.f.case_lead?2:0)-g.over*3-g.broken*5-(g.f.pulse_split_q3?3:0),g.score.사람*.6+g.safe*.4-g.burnout-f*3-gone*2];},
};
const PICK={
 "5-6":g=>{let p=20+(g.f.token_drain?30:0)+(g.f.token_low?20:0)+(g.f.token_game?10:0)-(g.f.token_audit?10:0)-(g.f["c_4-2b_B"]?10:0);if(g.tokenCap&&g.token<g.tokenCap*.2)p=100;return Math.random()*100<p?0:1;},
 "7-4":g=>{if(!g.f.kim_fragile)return 0;const p=(g.f.r_M39&&g.f.night_seen?30:60)+g.over*10;return Math.random()*100<p?1:0;},
 "11-4":g=>g.f.mfg_ally?0:1,
 "11-7":g=>g.f.cha_left?1:0,
};
const END=(m,title,on,q)=>({id:"END"+m,type:"monthEnd",month:m,title,onEnd:on||(()=>{}),quarter:!!q});
const SPEC={
 "4-2":{id:"4-2",type:"alloc",month:4,when:"4월"},
 "6-1p":{id:"6-1p",type:"choice",month:6,when:"6월",tag:"F사 협상",title:"재검토 조건",intro:["F사가 계약 뒤에 지표를 문제 삼아 다시 협상하자고 하면, 어디까지 물러설지 미리 적어 둘까요?"],options:[{k:"A",t:"적어 둔다",cost:.5,done:"협상선을 적어 뒀습니다.",fx:"`planb_contract`"},{k:"B",t:"적지 않는다",done:"적지 않았습니다.",fx:"B6+15"}]},
 "6-2":{id:"6-2",type:"write",month:6,when:"6월",title:"하반기 계약을 세 사람에게",
  fit:g=>g.f.ct_measure?["AI 활용 효과","장애 예방 활동"]:g.f.ct_cut?["추가 과제 매출 기여","고객 칭찬"]:["추가 과제 매출 기여","AI 활용 효과"],
  conds:[{c:g=>g.prom.P3,t:"2월에 \"올해 AI를 이유로 인원을 줄이지 않겠다\"고 썼습니다."},{c:g=>g.f.alloc_notice,t:"4월 공지문에 쓴 \"하지 않기로 한 일\"이 있습니다."},{c:g=>g.f.f_140&&!g.f.f_corrected,t:"F사는 아직 주 140시간을 확정치로 알고 있습니다."}],
  draft:g=>"하반기 계약 방향을 확정했습니다. "+(g.f.f_140&&!g.f.f_corrected?"주 140시간의 절감 효과를 바탕으로 한 결과입니다.":"효율과 안정성을 종합적으로 고려한 결과입니다.")+" 앞으로도 최선을 다하겠습니다. 많은 이해와 협조를 부탁드립니다.",bad6:true,
  targets:[
   {k:"f",n:"F사 임원",form:"메일",q:g=>g.f.ct_measure?"실측은 언제, 누가, 어떻게 잽니까?":g.f.ct_cut?"우선 협상권이 저희에게 무슨 의미입니까?":"2건은 언제부터 볼 수 있습니까?",ans:g=>g.f.ct_measure?["실측","측정","담당","주기","매주","매달","매월","방법","로그","표본"]:g.f.ct_cut?["우선 협상","협상권","먼저","다음 계약","갱신","제안"]:["2건","신규 과제","착수","시작","일정","시범"],words:["귀사","납품","운영비","장애"],reply:[["유 과장: \"임원께 그대로 전달했습니다.\"","F사만족+2"],["답이 없습니다.",""],["\"자세한 내용은 언제 받을 수 있나요?\"","F사만족-2"]]},
   {k:"b",n:"사업부장",form:"보고",q:g=>g.f.ct_measure?"F사가 불만을 가지면 계약은 괜찮나?":g.f.ct_cut?"5%는 어디서 메우나?":"이 인력으로 2건이 되나?",ans:g=>g.f.ct_measure?["계약","불만","해지","재협상","조항","실측"]:g.f.ct_cut?["5%","인하","메우","손익","절감","토큰","원가","수주"]:["인력","2건","여력","인원","일정","우선순위","미루","줄이"],words:["손익","계약","인력","위험"],reply:[["\"알겠네. 8월에 다시 보지.\"","재무+1"],["\"그래.\"",""],["\"이걸로 내가 뭘 답하나?\"","성과-1"]]},
   {k:"t",n:"팀 전체 30명",form:"공지",q:g=>g.f.ct_measure?"실측이면 저희가 또 뭘 적어야 하나요?":g.f.ct_cut?"비용 줄이면 다음은 사람인가요?":"그래서 우리 일이 늘어나는 거죠?",ans:g=>g.f.ct_measure?["적어","적는","적지","기록","입력","양식","자동","부담"]:g.f.ct_cut?["인원","사람","감축","줄이지","인력","고용","자리"]:["업무","일이","늘어","줄이","미루","내려놓","하지 않","부담","야간"],words:["일정","업무","야간","인력","부담"],reply:[["댓글: \"이번엔 이유를 알겠네요.\"","안전+3"],["읽음 표시만 쌓입니다.","안전+1"],["\"그래서 뭐가 바뀐다는 건지…\"","안전-1"]]},
  ]},
 "BILL6":{id:"BILL6",type:"bills",month:6,when:"6월 말",pool:["B1","B5","B8"],max:3},
 "BILL9":{id:"BILL9",type:"bills",month:9,when:"9월 말",pool:["B1","B2","B5","B6","B7","B8","B9"],max:3,wow:true},
 "BILL11":{id:"BILL11",type:"bills",month:11,when:"11월 말",pool:["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11"],max:2},
 "BILL12":{id:"BILL12",type:"bills",month:12,when:"12월",pool:["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11"],max:3},
 "REVIEW":{id:"REVIEW",type:"review",month:6,bare:false,when:"반기 회고"},
 "9-6":{id:"9-6",type:"write",month:9,when:"9월",title:"새벽 장애를 세 사람에게",
  fit:g=>g.f.inc_proc?["장애 복구 기여","장애 예방 활동"]:g.f.inc_direct?["장애 복구 기여"]:[],
  conds:[{c:g=>g.f.inc_breach,t:"승인 없이 올린 패치가 있었습니다. 쓸지 말지는 당신이 정합니다."},{c:g=>g.f.inc_big,t:"복구 시간이 평소의 2배였습니다."},{c:g=>g.f.claim_verify||g.f.claim_refund||g.f.claim_delay||g.f.claim_define,t:"F사는 지금 가용성 수치를 다시 따지고 있습니다."}],
  draft:()=>"이번 장애로 불편을 드려 죄송합니다. 원인을 철저히 분석하고 있습니다. 재발 방지에 최선을 다하겠습니다. 앞으로도 많은 관심 부탁드립니다.",
  after:(g,t,live,lines)=>{if(g.f.inc_breach){if(/패치|승인/.test(t.t)){applyFx("mfg-3 src+2 안전+3",{live});lines.push("팀 공지에 승인 없는 변경을 썼습니다.");}else g.f.inc_breach_nowrite=true;}},
  targets:[
   {k:"f",n:"F사 임원",form:"메일",q:"재발하지 않는다는 것을 무엇으로 확인할 수 있습니까?",ans:["지표","가용성","점검","모니터링","측정","주기","매주","매월","매달","로그","보고서","리포트","검증","테스트"],words:["귀사","납품","운영비","장애","복구","재발"],reply:[["유 과장: \"재발 방지안까지 받아서 다행입니다.\"","F사만족+2"],["답이 없습니다.",""],["\"원인은 언제 받을 수 있나요?\"","F사만족-2"]]},
   {k:"b",n:"사업부장",form:"보고",q:"책임 소재와 손실 규모는 어떻게 되나?",ans:["책임","원인","손실","규모","금액","만 원","억","배상","위약","SLA"],words:["손익","계약","인력","위험","원인","손실"],reply:[["\"알겠네. 12월에 숫자로 보세.\"","재무+1"],["\"그래.\"",""],["\"그래서 누구 책임인가?\"","성과-1"]]},
   {k:"t",n:"팀 전체",form:"공지",q:"그날 새벽에 나온 사람들은 어떻게 되나요?",ans:["새벽","대체휴무","휴무","휴가","수당","보상","포상","근태","당번"],words:["일정","업무","야간","인력","부담","새벽","당번"],reply:[["댓글: \"새벽 얘기까지 적어 주셨네요.\"","안전+3"],["읽음 표시만 쌓입니다.","안전+1"],["\"또 사과문이네요.\"","안전-1"]]},
  ]},
 "10S":{id:"10S",type:"branch",month:10,when:"10월 시작",pick:g=>g.f.auto_defer?0:g.f.fp_stop?1:2,cases:[
  {id:"10S_1",type:"choice",month:10,when:"10월 시작",tag:"미뤄 둔 일",title:"10월에 다시 보자고 하셨죠",rel:"rd",say:[["rd","10월에 다시 보자고 하셨죠."]],options:[
   {k:"A",tok:30,t:"발주 검토와 납품 리포트까지 이번 분기에 넓히고, 절감분은 신규 과제로 돌린다.",fx:"`auto_wide` 성과+3 재무+2 rd+4 src-3 안전-4 사람-2 큰변화1",sig:"③P"},
   {k:"B",cost:2,t:"납품 리포트만 넓히고, 조달은 윤 책임이 검수 규칙을 쓴 뒤에 다음 단계로 간다.",fx:"`auto_staged` 성과+1 안정+1 사람+1 안전+1 rd-2 src+2 이야기:yoon+",sig:"③L"},
   {k:"C",t:"한 번 더 미룬다.",fx:"`auto_defer2` rd-4"}]},
  {id:"10S_2",type:"choice",month:10,when:"10월 시작",tag:"미뤄 둔 일",title:"멈춰 둔 분류 자동화",intro:["멈춰 둔 분류 자동화의 재개 시점입니다."],options:[{k:"A",t:"그대로 재개한다",fx:"`fp_keep`"},{k:"B",t:"긴급 구간만 사람이 검수하며 재개한다",fx:"`fp_gate` 재무-1 안정+1"}]},
 ]},
 "12-3":{id:"12-3",type:"evalc",month:12,when:"12월"},
 "12-4":{id:"12-4",type:"appeal",month:12,when:"12월"},
 "12-6":{id:"12-6",type:"write",month:12,when:"12월",title:"평가 결과를 세 사람에게",
  fit:g=>{const c={};Object.values(g.grades).forEach(x=>(x.근거||[]).forEach(s=>{const k=s.split("→")[1];if(k)c[k]=(c[k]||0)+1;}));const m=Object.entries(c).sort((a,b)=>b[1]-a[1])[0];return m?[m[0]]:[];},
  conds:[{c:g=>g.f.rule_flat||g.f.rule_wide,t:"하반기에 평가 지침이 바뀌었습니다."},{c:g=>g.f.rule_silent,t:"그 변경을 구성원에게 알린 적이 없습니다."},{c:g=>g.f.eval_kpi,t:"나머지 구성원은 KPI 순서로 정했습니다."},{c:g=>g.f.eval_leader,t:"나머지 구성원은 리더 의견대로 정했습니다."}],
  draft:()=>"올해 평가를 공정하게 마쳤습니다. 다양한 요소를 종합적으로 고려했습니다. 구성원 여러분의 노고에 감사드립니다. 내년에도 함께 성장하길 바랍니다.",
  targets:[
   {k:"t",n:"팀 전체",form:"공지",q:"올해 무엇이 등급을 갈랐나요? 내년에도 같습니까?",ans:["등급","기준","합의서","기록","평가"],words:["일정","업무","인력","등급","평가","합의서"],reply:[["댓글: \"처음으로 왜 그랬는지 알겠어요.\"","안전+3"],["읽음 표시만 쌓입니다.","안전+1"],["\"그래서 내년엔 뭘 보시는 건데요.\"","안전-1"]]},
   {k:"f",n:g=>g.appeals&&g.appeals.length?name(g.appeals[0])+" (이의 제기자)":"등급이 가장 낮은 구성원",form:"답변서",q:"왜 저는 이 등급입니까?",ans:["기록","기준","등급","역할","근거","합의서"],words:["기록","역할","다음 해","내년"],reply:[["\"읽었습니다. 납득은 천천히 해 볼게요.\"","안전+2"],["답이 없습니다.",""],["\"복사한 답이네요.\"","안전-2"]]},
   {k:"b",n:"인사팀",form:"제출",q:"이의 건의 처리 근거와 내년 개선점은 무엇입니까?",ans:["이의","처리","근거","절차","개선","기록","면담"],words:["이의","절차","손익","위험"],reply:[["\"처리 기록으로 받았습니다.\"","성과+1"],["접수 완료.",""],["\"근거 보완 요청드립니다.\"","성과-1"]]},
  ]},
 "END4":END(4,"4월이 끝났습니다."),
 "END5":END(5,g=>g.f.pm_root||g.f.q2_prevent?"5월이 끝났습니다. 점검표를 줄이는 중입니다.":"5월이 끝났습니다. 점검표는 아직 47개 항목입니다."),
 "END6":END(6,"6월이 끝났습니다. 상반기가 지나갔습니다.",g=>{if(g.fatigue)applyFx("사람-"+g.fatigue*2);},true),
 "END7":END(7,g=>g.f.kim_sick?"7월이 끝났습니다. 김 사원의 자리가 2주 비어 있었습니다.":"7월이 끝났습니다. 근태 경고는 이번 달에도 0건입니다."),
 "END8":END(8,g=>`8월이 끝났습니다. 팀은 ${g.f.hq_one?29:g.f.hq_two?28:g.f.hq_loan?"28명, 6개월 뒤 복귀":30}${g.f.hq_loan?"":"명"}입니다.`),
 "END9":END(9,"9월이 끝났습니다. 3분기가 지나갔습니다.",g=>{if(g.prom.P5&&g.prom.P5.status==="진행 중")settle("P5",false,"cha");if(g.fatigue)applyFx("사람-"+g.fatigue*2);},true),
 "END10":END(10,"10월이 끝났습니다. 내년 계약서가 책상 위에 있습니다.",g=>{}),
 "END11":END(11,"11월이 끝났습니다. 평가 시즌입니다.",g=>{}),
 "END12":END(12,"12월이 끝났습니다. 첫 1년이 지나갔습니다.",g=>{if(g.prom.P3&&g.prom.P3.status==="진행 중")settle("P3",true);if(g.fatigue)applyFx("사람-"+g.fatigue*2);},true),
};
