/* 3월 · 원고 03-3 */
const harm=g=>{let m=1;if(g.f.ai_unchecked&&g.f.ai_shadow)m=2;else if(g.f.ai_unchecked||g.f.ai_shadow)m=1.5;if(g.f.rd_drafts_rule)m*=.5;return m;};
const baseHarm=(g,halfF)=>{const m=harm(g);let f=2*m;if(halfF)f/=2;return `안정-${Math.max(1,Math.round(4*m))} F사만족-${Math.max(1,Math.round(f))}`;};
addContent([
 {id:"3-0",type:"note",month:3,when:"3월",tag:"온보딩 노트②",title:"사람들은 등급보다 설명을 기억한다",body:["사람들이 평가를 \"공정하다\"고 느끼는지는 받은 등급만으로 정해지지 않습니다.", "한 연구(Colquitt, 2001)는 공정하다는 느낌을 네 가지로 나눠 봤습니다.<br>· <b>결과</b>: 받은 몫이 한 일에 비해 합당한가<br>· <b>과정</b>: 모두에게 같은 기준을 썼고, 반대 의견을 말할 기회가 있었는가<br>· <b>대우</b>: 존중받으며 이야기를 들었는가<br>· <b>설명</b>: 왜 그렇게 정했는지 제때, 구체적으로 들었는가", "등급이 기대보다 낮아도 이유를 제때 구체적으로 들으면 받아들이는 사람이 많습니다. 반대로 등급이 나쁘지 않아도 이유를 모르면 불만이 남습니다.", "작년 이의제기를 떠올려 보세요. 이의를 낸 사람들이 정말 원한 것은 더 높은 등급뿐이었을까요?"],q:"생각해 볼 질문: 등급을 가른 것이 KPI 숫자가 아닌 다른 무엇이었다면, 그 기준을 언제 미리 말해 주어야 했을까요?"},
 {id:"3-1",type:"kpi",month:3,when:"3월 첫째 주",tag:"KPI 합의서",title:"등급 기여 기준",intro:["인사팀 양식의 \"등급 기여 기준\" 칸이 비어 있다. 전임 팀장은 이 칸에 \"종합 판단\"이라고만 적었다."],
  ref:"Kerr(1975), \"B를 바라면서 A에 보상하는 어리석음\". 사람들은 측정되고 보상받는 일을 한다. 이 기준으로 평가하면 사람들은 내일부터 무엇을 더 하고, 무엇을 덜 할까?",
  cards:[
   {n:"장애 예방 활동",d:"재발을 막은 점검과 개선",fx:"prc+3 mfg-1",f:"pub_prevent",ok:["안정"],hide:1},
   {n:"보안 준수",d:"절차와 데이터 규정을 지킨 기록",fx:"src+2 rd-1",f:"pub_security",ok:["안정"],hide:1},
   {n:"장애 복구 기여",d:"장애가 났을 때 해결에 기여한 정도",fx:"mfg+3 prc-1",f:"pub_recovery",ok:["안정"]},
   {n:"동료 지원과 온보딩",d:"후배를 돕고 지식을 나눈 일",fx:"prc+1 안전+1",f:"pub_support",ok:["사람"],hide:1},
   {n:"AI 활용 효과",d:"도구를 써서 줄인 작업과 그 비용",fx:"rd+3 src-1",f:"pub_ai",ok:["재무","성과"]},
   {n:"추가 과제 매출 기여",d:"수주와 제안에 기여한 정도",fx:"mkt+3",f:"pub_revenue",ok:["성과","재무"]},
   {n:"고객 칭찬",d:"F사가 보내 온 감사와 칭찬",fx:"mkt+2 mfg-1",f:"pub_praise",ok:["성과"]},
   {n:"책임감 있는 근무",d:"야간과 주말까지 책임진 시간",fx:"mfg+2 안전-2 사람-1",f:"pub_night",ok:[],bad:1},
   {n:"리더 종합 판단",d:"모듈 리더가 본 전반적 기여",fx:"mfg+1 src+1 안전-3",f:"pub_judgment",ok:[],bad:1},
  ],
  levels:[
   {k:"A",t:"기준 이름과 비중, 사례까지 문서로 써서 팀 전체에 돌린다.",cost:2,done:"기준과 비중, 사례를 문서로 돌렸습니다.",fx:"`pub_full` 안전+4 사람+2 큰변화1",sig:"②L",tw:[{p:35,t:"\"제 점검은 몇 점이에요?\" 문의가 쌓였습니다.",fx:"다음분기⏳-1 mfg-2"},{p:g=>g.f.pub_prevent?25:0,t:"사소한 점검을 부풀리는 일이 생겼습니다.",fx:"`gaming` 안정-1"}]},
   {k:"B",t:"기준 항목만 팀에 알리고, 비중과 적용은 면담에서 설명한다.",cost:1,done:"기준 항목을 팀에 알렸습니다.",fx:"`pub_items` 안전+2 큰변화1",tw:[{p:35,t:"모듈마다 설명이 달라지고 있습니다.",fx:"B3+20"}]},
   {k:"C",t:"기준은 리더들과만 맞춰 두고, 구성원에겐 면담 때 말해 준다.",done:"리더들과만 맞췄습니다.",fx:"`pub_leaders` 안전-3 mfg+2 src+2",sig:"②P",tw:[{p:25,t:"리더들이 자기 모듈에 직접 설명하기 시작했습니다.",fx:"안전+3 B3-10"},{p:75,t:"구성원들은 아직 기준을 보지 못했습니다.",fx:"B3+40"}]},
  ],
  planb:[
   {k:"A",t:"적어 둔다",cost:.5,done:"재검토 조건을 합의서에 적었습니다.",fx:"`planb_kpi`"},
   {k:"B",t:"적지 않는다",done:"재검토 조건 없이 합의서를 마쳤습니다."},
  ]},
 {id:"3-2",type:"choice",month:3,when:"3월 둘째 주",tag:"KPI 면담",title:"서하준 (R&D)",rel:"rd",prep:true,
  say:[["rd","실험 건수를 KPI로 넣어 주세요. 실패한 것도요. 실패를 안 쳐 주면 아무도 새로운 걸 안 해요."]],
  options:[
   {k:"A",t:"실험 건수 대신 현업에 넘긴 건수로 잡고, 실패 기록도 기여로 본다.",done:"현업에 넘긴 건수로 합의했습니다.",fx:"`kpi_rd_handoff` rd-1 성과+2 안정+1",sig:"②L",tw:[{p:g=>g.trust.src<=40?50:30,who:"rd",t:"넘길 곳이 조달이면 1년 내내 못 넘겨요.",fx:"rd-3"}]},
   {k:"B",t:"말한 대로 실험 건수를 KPI로 잡되, 보안 준수를 전제 조건으로 붙인다.",done:"실험 건수로 합의했습니다.",fx:"`kpi_rd_exp` rd+4 성과-1 안정-1",sig:"②P",tw:[{p:g=>g.f.ai_shadow?45:30,t:"건수를 채우려 작은 실험만 늘어나고 있습니다.",fx:"`token_drain`"},{p:25,t:"실험 하나가 사내 표준이 됐습니다.",fx:"성과+3"}]},
   {k:"C",t:"다른 모듈처럼 운영 지표 중심으로 잡고, 실험은 여유가 될 때 하게 한다.",done:"운영 지표 중심으로 합의했습니다.",fx:"`kpi_rd_same` rd-5 안정+2 src+1",sig:"②P",tw:[{p:35,who:"cha",t:"여기서 뭘 더 할 수 있죠?",fx:"`cha_restless`"},{p:20,t:"서하준이 운영 지표 개선을 자기 과제로 들고 왔습니다.",fx:"rd+3 성과+2"}]},
  ]},
 {id:"3-3",type:"choice",month:3,when:"3월 둘째 주",tag:"KPI 면담",title:"문지원 (조달)",rel:"src",prep:true,
  say:[["src","조달은 사고가 안 나는 게 성과예요. 그런데 사고가 안 나면 한 일이 없는 것처럼 보이죠. AI 목표요? 올해는 넣지 말아 주세요."]],
  options:[
   {k:"A",t:"무사고는 유지하고, 발주 검토 자동화 1건을 올해 목표로 더 넣는다.",done:"자동화 1건을 목표에 넣었습니다.",fx:"`kpi_src_auto` src-3 성과+2 안정-1 큰변화1",sig:"②L",tw:[{p:g=>g.f.yoon_owner?10:g.f.yoon_silenced?55:35,who:"yoon",t:"결국 제 표부터네요.",fx:"안전-2 이야기:yoon- `yoon_first`"}]},
   {k:"B",t:"무사고와 규정 준수를 KPI로 두고, AI 목표는 올해 넣지 않기로 한다.",done:"AI 목표 없이 합의했습니다.",fx:"`kpi_src_safe` src+4 성과-2 안정+2",sig:"②P",tw:[{p:30,t:"\"조달은 AI 안 해도 되는 곳\"이라는 말이 돌았습니다.",fx:"rd-2"},{p:25,t:"조달의 감사 대비 자료가 일찍 정리됐습니다.",fx:"`audit_ease`"}]},
   {k:"C",t:"AI 목표를 넣되, 방식과 일정은 문지원 리더가 정하도록 넘겨 준다.",done:"방식과 일정은 문지원이 정하기로 했습니다.",fx:"`kpi_src_own` src+2 성과+1",sig:"①L",tw:[{p:40,t:"문지원의 계획이 아직 일정으로 내려오지 않았습니다.",fx:"`src_drift`"}]},
  ]},
 {id:"3-4",type:"choice",month:3,when:"3월 셋째 주",tag:"KPI 면담",title:"강태식 (생산)",rel:"mfg",prep:true,
  say:g=>[["mfg",(g.f.sla_up?"F사에 가용성 올린다고 했다며. 그건 나한테 물어봤어? ":"")+(g.f.mfg_mentor?"작년 KPI 그대로 해도 되지 않을까. 내 모듈 숫자는 내가 제일 잘 아니까.":"작년 KPI 그대로 하면 되잖아. 내 모듈 숫자를 네가 왜 새로 짜?")]],
  options:[
   {k:"A",t:"작년 KPI를 바탕으로 두고, 달라진 항목 두 개만 이유를 밝혀 더한다.",done:"항목 두 개를 이유와 함께 더했습니다.",fx:"`kpi_mfg_base` mfg+1 안전+1",sig:"②L",tw:[{p:30,who:"mfg",t:"그 두 개가 왜 내 모듈부터야?",fx:"mfg-3"}]},
   {k:"B",t:"생산 모듈 KPI 초안은 선배가 쓰고, 나는 다른 모듈과 형평만 맞춘다.",done:"초안을 강태식에게 맡겼습니다.",fx:"`kpi_mfg_self` mfg+5 prc-1 안전-2",sig:"①L ②P",tw:[{p:35,t:"올라온 초안에 예방과 주니어 기여 항목이 없습니다.",fx:"`mfg_soft` B4+15"},{p:20,t:"작년보다 높은 목표를 써 왔습니다.",fx:"mfg+3 성과+2"}]},
   {k:"C",t:"다른 모듈과 양식도 비중도 똑같이 잡는다. 생산만 예외를 두지 않는다.",done:"같은 양식과 비중으로 합의했습니다.",fx:"`kpi_mfg_same` mfg-5 prc+1 mkt+1 안전+2",sig:"②L",tw:[{p:40,t:"강태식의 불만이 깊어졌습니다.",fx:"`mfg_angry`"},{p:25,who:"mfg",t:"같은 잣대면 나도 할 말 없지.",fx:"mfg+5"}]},
  ]},
 {id:"3-5",type:"choice",month:3,when:"3월 셋째 주",tag:"KPI 면담",title:"이수진 (가공)",rel:"prc",prep:true,
  enter:g=>g.f.pub_prevent?"":"prc-5",
  say:g=>[["prc",(g.f.pub_prevent?"":"이번에도 예방은 없네요. ")+"예방은 어떻게 세실 거예요? 건수로 세면 다들 건수를 만들 거예요. 작년 평가표엔 아예 없었지만요."]],
  options:[
   {k:"A",t:"예방 건수 대신, 재발이 없던 기간과 개선 내역을 근거로 보기로 한다.",done:"재발 없는 기간과 개선 내역으로 합의했습니다.",fx:"`kpi_prc_quality` prc+4 성과+1",sig:"②L",tw:[{p:30,who:"mfg",t:"재발 없는 건 운 아니에요?",fx:"mfg-2 `prevent_doubt`"}]},
   {k:"B",t:"미리 잡은 건수를 세어 KPI로 두고, 분기마다 내용을 검토하기로 한다.",done:"미리 잡은 건수로 합의했습니다.",fx:"`kpi_prc_count` prc-2 mfg+1 안정+1",sig:"②P",tw:[{p:40,t:"사소한 점검이 늘고 있습니다.",fx:"`gaming` 안정-2"},{p:25,t:"예방이 처음으로 월간 보고서에 숫자로 실렸습니다.",fx:"prc+4"}]},
   {k:"C",t:"측정 방법은 이수진 리더가 제안하게 하고, 나는 승인만 하기로 한다.",done:"측정 방법을 이수진에게 맡겼습니다.",fx:"`kpi_prc_own` prc+3 mfg-1",sig:"①L",tw:[{p:35,t:"\"팀장 옛 모듈이라 봐준다\"는 말이 돌았습니다.",fx:"소문1 mfg-3"}]},
  ]},
 {id:"3-6",type:"choice",month:3,when:"3월 셋째 주",tag:"KPI 면담",title:"정다은 (마케팅)",rel:"mkt",prep:true,
  say:g=>[["mkt","제 KPI는 수주액 하나로 해 주세요. 깔끔하게요. 결과로 보여 드릴게요."+(g.f.f_pilot?" F사 시범 과제도 제 수주로 잡히는 거죠?":"")]],
  options:[
   {k:"A",t:"수주액을 쓰되, 제안서마다 참여자별 기여를 기록하는 조건을 단다.",done:"참여자별 기여를 기록하기로 했습니다.",fx:"`kpi_mkt_credit` mkt-2 사람+2 안전+1",sig:"②L",tw:[{p:g=>g.f.know_han?15:30,t:"기록에 한 선임 이름이 형식적으로만 올라갔습니다.",fx:"안전-1 이야기:han-"}]},
   {k:"B",t:"수주액 하나로 깔끔하게 잡는다. 대신 목표치를 작년보다 올려 둔다.",done:"수주액 하나로 합의했습니다.",fx:"`kpi_mkt_one` mkt+4 성과+3 사람-1",sig:"②P",tw:[{p:40,t:"받아 온 일의 운영 부담이 다른 모듈로 넘어가고 있습니다.",fx:"`overload_risk`"},{p:20,t:"올린 목표를 달성할 것 같습니다.",fx:"재무+3"}]},
   {k:"C",t:"수주액 비중을 줄이고, 고객 유지와 운영 부담 지표를 나란히 넣는다.",done:"수주액 비중을 줄였습니다.",fx:"`kpi_mkt_mix` mkt-5 안정+1 성과-1",sig:"②L",tw:[{p:35,who:"mkt",t:"그럼 저는 뭘 보고 뛰죠?",fx:"성과-2"}]},
  ]},
 {id:"3-7",type:"choice",month:3,when:"3월 넷째 주",tag:"구성원 이야기",title:"배 책임의 질문",rel:"mfg",
  intro:["면담이 끝난 주 금요일, 배 책임이 자리로 온다."],
  say:g=>[["bae",(g.f.h_M15?"메일 드렸는데 답이 없으셔서요. ":"")+"작년에 KPI 다 채웠는데 B였습니다. 이유는 아직 못 들었고요. 올해 기준이 뭔가요? 그리고 저, 가공으로 옮기고 싶습니다."]],
  options:[
   {k:"A",t:"올해 합의서를 펴고, 배 책임 경우에 어떻게 적용되는지 짚어 본다.",cost:1,dis:g=>g.f.pub_leaders?"공개한 기준이 없어 고를 수 없습니다.":"",done:"합의서를 펴고 항목별로 짚어 봤습니다.",fx:"안전+2 사람+1 `bae_criteria`",sig:"②L ④L",tw:[{p:30,who:"bae",t:"그 기준이면 저는 올해도 B네요.",fx:"사람-1 이야기:bae-"}]},
   {k:"B",t:"작년 평가 기록을 찾아, 왜 B였는지부터 설명하겠다고 일정을 잡는다.",cost:2,done:"작년 기록을 찾아보기로 했습니다.",fx:"안전+1 `bae_past`",sig:"④L",tw:[{p:g=>g.f.read_appeal?20:40,who:"bae",t:"기록에 사유가 한 줄도 없다고요. 팀장님도 모르시네요.",fx:"안전-2 사람-1"}]},
   {k:"C",t:"작년 일은 되돌릴 수 없으니, 올해 가공 이동부터 검토해 보자고 한다.",done:"가공 이동 얘기를 먼저 했습니다.",fx:"사람+1 mfg-2 prc+1",sig:"④P",tw:[{p:30,t:"이동 이야기로 표정이 풀렸습니다.",fx:"사람+1 안전+1"}],
    after:{t:"배 책임이 묻습니다. \"그럼 언제까지 답을 주실 수 있습니까?\"",opts:[{t:"9월까지 이동 여부를 답하겠다고 말한다",pr:{id:"P4",text:"9월까지 가공 이동 여부 답변",to:"배 책임",due:"9월"}},{t:"기한은 말하지 않는다"}]}},
  ]},
 {id:"3-8",type:"choice",month:3,when:"3월 넷째 주",tag:"돌발",title:"승인 안 된 AI 도구",rel:"rd",common:{fit:{A:["보안 준수"],C:["보안 준수"]}},
  enter:g=>g.f.sec_late?"안정-1":"",
  say:[["src","R&D 공유 폴더 캡처에 F사 주문번호가 보여요. 승인 안 된 서비스 화면이고요."],["rd","마스킹한 줄 알았는데 컬럼 일부가 빠졌어요. 이틀 전 일입니다. 분석 결과는 좋았어요."]],
  top:()=>`<details class="ref"><summary>규정집</summary><p style="margin-top:6px">고객 데이터의 외부 전송 정황은 인지 즉시 정보보안팀에 신고한다.</p></details>`,
  conds:[{c:g=>g.f.asked_log,t:"1월에 물어본 덕분에 어떤 로그인지 이미 알고 있다."},{c:g=>g.f.ai_unchecked,t:"1월 연휴부터 쓰고 있었다."},{c:g=>g.f.ai_shadow,t:"2월 시범 범위 밖에서 쓰고 있었다."},{c:g=>g.f.rd_drafts_rule,t:"서하준이 쓰던 규칙 초안대로 로그가 남아 있다."},{c:g=>g.f.sec_late,t:"정보보안팀: \"1월 점검표부터 늦으셨죠.\""}],
  tail:(g,o)=>g.f.pub_ai&&!g.f.pub_security?{who:"rd",t:"AI 활용이 기준이라고 하셨잖아요.",fx:"안전-1"}:null,
  options:[
   {k:"A",t:"바로 사용을 멈추게 하고 보안팀에 신고한다. 범위 조사는 절차에 맡긴다.",done:"사용을 멈추고 보안팀에 신고했습니다.",fx:g=>baseHarm(g,g.f.asked_log)+" rd-3 src+3 성과-2",sig:"①L",tw:[{p:35,t:"조사로 시범이 3주 멈추고 F사에 통지가 나갔습니다.",fx:"F사만족-5 성과-1"}]},
   {k:"B",t:"바로 사용을 멈추게 하고, 범위를 우리가 파악한 다음 보안팀에 알린다.",done:"사용을 멈추고 범위부터 파악하기로 했습니다.",fx:"`sec_breach` rd+1",sig:"①P",tw:[{p:60,t:"이틀 뒤 보안팀이 먼저 알았습니다.",fx:"안정-8 F사만족-6 src-4 `sec_breach_caught`"}]},
   {k:"C",t:"서하준을 시범에서 빼고 팀 전체에 사유를 알린 다음 보안팀에 신고한다.",done:"서하준을 시범에서 빼고 신고했습니다.",fx:g=>baseHarm(g,g.f.asked_log)+" rd-8 src+4 안전-6 안정+1",sig:"④P",tw:[{p:30,t:"팀에 선이 분명해졌습니다.",fx:"안정+3 `ai_line`"}]},
  ]},
 {id:"3-9",type:"pulse",month:3,when:"3월 마지막 주",tag:"1분기 펄스 서베이",title:"팀 설문 결과",
  qs:g=>{let fat=g.big>=5?2:g.big===4?1:0;g.fatigue=fat;return [30+(g.f.pub_full?35:g.f.pub_items?20:g.f.pub_leaders?5:0)+g.shared*2+g.told.full*2-g.told.none*2,50+(g.score.사람-50)*.3+(g.f.night_changed?5:0)-(g.f.night_stuck?8:0)+(g.f.kpi_mkt_credit?3:0)-g.broken*5,g.score.사람*.6+g.safe*.4-g.burnout-fat*3];},
  comments:[{c:g=>g.f.pub_full,t:"처음으로 뭘 보고 평가받는지 알았어요."},{c:g=>g.f.pub_leaders,t:"기준이 있다는데 저희는 못 봤어요."},{c:g=>g.f.pub_night,t:"밤에 오래 있는 사람이 잘 받는 건가요?"},{c:g=>g.f.gaming,t:"요즘 점검 건수 늘리기 눈치 싸움이에요."},{c:g=>g.f.night_stuck,t:"대기표 바뀐다더니요."},{c:g=>g.f.yoon_silenced,t:"게시판에 글 쓰면 찾아온다던데요."},{c:g=>g.f.sec_breach_caught,t:"보안은 우리한테만 엄격한가 봐요."},{c:g=>g.fatigue>0,t:"또 바뀌었어요."},{c:g=>g.burnout>0,t:"팀장님이 늘 바빠 보여서 말을 못 걸겠어요."}],
  options:[
   {k:"A",t:"결과를 팀에 그대로 돌리고, 2분기에 고칠 한 가지를 골라 알린다.",cost:1,done:"결과를 팀에 돌렸습니다.",fx:"사람+1 안전+3",sig:"④L",tw:[{p:30,t:"고칠 항목에서 빠진 쪽이 \"저희는요?\"라고 물었습니다.",fx:g=>Object.keys(LD).sort((a,b)=>g.trust[a]-g.trust[b])[0]+"-2"}]},
   {k:"B",t:"모듈 리더들과 결과를 나눠 보고, 모듈별로 대응 방법을 정하게 한다.",done:"모듈별로 대응하기로 했습니다.",fx:"사람+1",sig:"①L",tw:[{p:40,t:"모듈마다 대응이 달라지고 있습니다.",fx:"`pulse_split_q1`"}]},
   {k:"C",t:"첫 분기라 아직 이르니 이번은 지켜보고, 6월 결과와 묶어서 판단한다.",done:"이번 분기는 지켜보기로 했습니다.",fx:g=>g.pulseAvg>=65?"":"안전-3",sig:"④P"},
  ]},
 {id:"END3",type:"monthEnd",month:3,quarter:true,btn:"다음",onEnd:g=>{
   if(g.prom.P1){settle("P1",!g.f.pub_leaders);if(g.f.pub_leaders)applyFx("사람-2");}
   if(g.fatigue)applyFx("사람-"+(g.fatigue*2));
  },title:"3월이 끝났습니다. 1분기가 지나갔습니다."},
]);
