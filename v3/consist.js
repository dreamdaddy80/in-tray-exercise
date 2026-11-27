/* 4단계 (2026-11-27): 핵심 과제와 이후 결정의 일관성 점검, 그리고 "언제 어디서 다시 나오는지" 안내.
   표시 전용입니다. 점수·확률·선택지 효과·결과 코드·저장 키를 바꾸지 않습니다.
   판정은 G.f.task_N(1월 핵심 과제)과 G.decisions, G.f의 기존 플래그만 읽습니다. */
(function(){
 "use strict";
 /* 핵심 과제 여덟 가지의 짧은 이름 (1-3 장면 items 순서) */
 const TASK={1:"추가 과제가 기존 운영 위에 얹혀 있음",2:"AI 토큰 비용의 사용 기준이 없음",3:"등급 기준이 구성원에게 보이지 않음",4:"야간 대기와 업무가 몇 사람에게 몰림",5:"외부 AI 서비스 관리 체계가 없음",6:"예방 같은 드러나지 않는 일이 인정받지 못함",7:"헬씨푸드 월간 보고서 가용성 지표",8:"내일 임원 보고용 제안서"};
 const ST={same:"같은 방향",part:"일부 같은 방향",diff:"다른 방향"};
 /* 연결 규칙. at: 결정이 기록되는 장면, by: 그 장면의 선택별 판정, flag: 그 장면 시점의 기존 플래그로 판정 */
 const RULES=[
  {id:"t3-pub",task:3,at:"3-1-2",by:{
   A:["same","기준 이름과 비중, 사례까지 팀 전체에 돌렸습니다."],
   B:["part","기준 항목은 팀에 보이게 했고, 비중과 적용은 면담에서만 설명합니다."],
   C:["diff","기준을 리더들과만 맞춰, 구성원에게는 여전히 보이지 않습니다."]}},
  {id:"t6-card",task:6,at:"3-1-2",card:true,flag:g=>g.f.pub_prevent?["same","등급 기준 카드에 '장애 예방 활동'을 넣었습니다."]:["diff","등급 기준 카드에 '장애 예방 활동'이 없습니다. 예방은 이번에도 기준 밖에 남았습니다."]},
  {id:"t4-card",task:4,at:"3-1-2",card:true,flag:g=>g.f.pub_night?["diff","등급 기준 카드에 '책임감 있는 근무(야간과 주말까지 책임진 시간)'를 넣었습니다. 대기가 몰린 사람의 긴 근무가 계속 보상받는 구조가 됩니다."]:null},
  {id:"t1-card",task:1,at:"3-1-2",card:true,flag:g=>g.f.pub_revenue?["diff","등급 기준 카드에 '추가 과제 매출 기여'를 넣었습니다. 기존 운영 위에 얹힌 추가 과제를 더 늘리는 쪽으로 보상하게 됩니다."]:null},
  {id:"t2-card",task:2,at:"3-1-2",card:true,flag:g=>g.f.pub_ai?["same","등급 기준 카드에 'AI 활용 효과(줄인 작업과 그 비용)'를 넣어, 토큰 비용을 효과와 함께 보게 했습니다."]:null},
  {id:"t4-elev",task:4,at:"1-4",by:{
   A:["diff","대기가 몰린 생산 모듈을 강태식 선배에게 맡기고 보고만 받기로 했습니다."],
   B:["same","생산 모듈 사정을 직접 배우기로 해, 대기가 왜 몰리는지 볼 통로가 생겼습니다."]}},
  {id:"t4-mfg",task:4,at:"3-4",by:{
   B:["diff","야간 대기가 몰린 생산 모듈의 KPI 초안을 그 모듈이 직접 쓰게 했습니다."]}},
  {id:"t6-prc",task:6,at:"3-5",by:{
   A:["same","예방을 재발이 없던 기간과 개선 내역으로 보기로 해, 드러나지 않는 일을 기록에 남겼습니다."],
   B:["diff","예방을 미리 잡은 건수로 세기로 했습니다. 셀 수 있는 예방만 인정받을 수 있습니다."]}},
  {id:"t1-mkt",task:1,at:"3-6",by:{
   B:["diff","수주액 하나로 잡고 목표를 올렸습니다. 추가 과제가 기존 운영 위에 더 얹힐 수 있습니다."],
   C:["same","수주액 비중을 줄이고 운영 부담 지표를 나란히 넣었습니다."]}},
  {id:"t5-ai",task:5,at:"3-8",by:{
   A:["same","정해진 절차대로 보안팀에 바로 신고했습니다."],
   B:["diff","범위를 우리가 먼저 파악한 다음 알리기로 해, 관리 체계 밖에서 먼저 처리했습니다."],
   C:["same","보안팀에 신고하는 절차는 지켰습니다."]}},
 ];
 const ORDER={diff:0,part:1,same:2};
 const WHERE={"3-1-2":"KPI 합의서 · 어디까지 알릴까"};
 /* 받침에 따라 와/과 */
 const wa=t=>{const c=String(t).charCodeAt(String(t).length-1);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28?"과":"와";};
 const taskOn=(g,n)=>!!(g&&g.f&&g.f["task_"+n]);
 function judge(rule,choice,g){
  if(!taskOn(g,rule.task))return null;
  const v=rule.flag?rule.flag(g):(rule.by||{})[String(choice||"").charAt(0)];
  return v?{rule,st:v[0],text:v[1]}:null;}
 /* 결정 직후 화면에 붙이는 한 줄 */
 function consistLine(sceneId,choice){
  try{const hits=RULES.filter(r=>r.at===sceneId).map(r=>judge(r,choice,G)).filter(Boolean).sort((a,b)=>ORDER[a.st]-ORDER[b.st]);
   if(!hits.length)return "";
   const h=hits[0];
   const more=hits.length>1?` 이 결정과 이어진 점검 ${hits.length}건은 성적표 ③ '일관성 점검'에 모아 둡니다.`:"";
   return `<p class="note cs-line cs-${h.st}"><b>일관성 점검</b> · 1월에 고른 핵심 과제 "${TASK[h.rule.task]}"${wa(TASK[h.rule.task])} ${ST[h.st]}입니다. ${h.text}${more}</p>`;
  }catch(e){return "";}}
 /* 성적표 ③: 이번 라운드 결정에서 모은 점검 결과 */
 function consistRows(decs){
  const out=[];const seen=new Set();
  (decs||[]).forEach(d=>{if(!d||d.doc)return;RULES.filter(r=>r.at===d.scene).forEach(r=>{if(seen.has(r.id))return;const j=judge(r,d.choice,G);if(j){seen.add(r.id);out.push(Object.assign(j,{scene:d.scene,choice:d.choice}));}});});
  return out;}
 function consistHtml(decs,nameOf){
  const tasks=[1,2,3,4,5,6,7,8].filter(n=>taskOn(G,n));
  const rows=consistRows(decs);
  const nm=id=>{try{return nameOf?nameOf(id):id;}catch(e){return id;}};
  const cnt={same:0,part:0,diff:0};rows.forEach(x=>cnt[x.st]++);
  const head=`<div class="label" style="margin-top:14px">일관성 점검 · 핵심 과제와 이후 결정${rows.length?` · ${rows.length}건 중 같은 방향 ${cnt.same}, 일부 ${cnt.part}, 다른 방향 ${cnt.diff}`:""}</div>`;
  if(!tasks.length)return head+`<p class="note">1월에 핵심 과제를 고른 기록이 없어 점검하지 않았습니다.</p>`;
  const pick=`<p class="note">1월에 고른 핵심 과제: ${tasks.map(n=>`"${TASK[n]}"`).join(", ")}</p>`;
  if(!rows.length)return head+pick+`<p class="note">고른 과제와 이어지는 결정이 이번 라운드에는 없었습니다.</p>`;
  return head+pick+`<div class="table cs-table">${rows.map(x=>`<div class="card cs-row"><span class="cs-pill cs-${x.st}">${ST[x.st]}</span><span><b style="font-weight:600">${TASK[x.rule.task]}</b> <span class="note">→ ${x.rule.card?"KPI 합의서 · 기여 기준 카드":WHERE[x.scene]||nm(x.scene)}</span><br><small>${x.text}</small></span></div>`).join("")}</div>
  <p class="note">다른 방향이라고 틀린 선택은 아닙니다. 상황이 바뀌었거나 다른 과제를 먼저 지켰을 수 있습니다. 그때 그렇게 고른 이유를 팀에 설명할 수 있는지가 점검의 핵심입니다.</p>`;}
 window.CONSIST_RULES=RULES;window.CONSIST_TASK=TASK;
 window.consistLine=consistLine;window.consistRows=consistRows;window.consistHtml=consistHtml;

 /* "언제 어디서 다시 나오는지": 효과는 바꾸지 않고 문장만 붙입니다 */
 const BACK={
  "3-1-3":{A:"다시 나오는 곳: Round 3, 11월 '인사팀 평가 지침 변경' 장면. 적어 둔 조건이 있으면 그때 이 조건대로 바뀐 기준을 다시 알립니다.",
           B:"다시 나오는 곳: Round 3, 11월 '인사팀 평가 지침 변경' 장면. 적어 둔 조건이 없으면 그때 바뀐 기준을 어떻게 알릴지 새로 정해야 할 수 있습니다."},
 };
 const billsLeft=()=>{const m=[[9,"9월 3분기 말"],[12,"12월 평가 직전"]].filter(x=>x[0]>=(G.month||0)).map(x=>x[1]);return m.length?m.join("과 ")+" 청구서 장면":"남은 청구서 장면";};
 const R1=()=>(G.round||1)===1;
 const Q1="3월 말 팀 설문(1분기 펄스 서베이)의 '업무 배분과 평가 기준을 알고 있다' 문항";
 const TELLBACK={
  full:()=>`다시 나오는 곳: ${R1()?Q1+"에 더해지고, ":""}${billsLeft()}에서 '설명 없는 결정의 대가'가 올 가능성을 낮춥니다.`,
  short:()=>"다시 나오는 곳: 결과만 알린 결정은 팀 설문 문항과 청구서 장면의 가능성을 바꾸지 않습니다.",
  none:()=>`다시 나오는 곳: ${R1()?Q1+"에서 빠지고, ":""}${billsLeft()}에서 '설명 없는 결정의 대가'가 올 가능성을 높입니다.`};
 window.backLine=function(sceneId,choice,tell,borrowedNow){
  try{const out=[];const b=BACK[sceneId];const k=String(choice||"").charAt(0);
   if(b&&b[k])out.push(b[k]);
   if(tell&&TELLBACK[tell])out.push(TELLBACK[tell]());
   if(borrowedNow>0)out.push(`다시 나오는 곳: 야근으로 빌린 ⏳${borrowedNow}${typeof jo==="function"?jo(borrowedNow,"은","는"):"은"} ${G.quarter>=3?"연말 야근 기록에 쌓입니다":"다음 라운드 시작 시간에서 빠집니다"}.${R1()?" 쌓인 야근은 3월 말 팀 설문의 '이 팀에서 계속 일하고 싶다' 문항도 낮춥니다.":""}`);
   return out.map(t=>`<p class="note backline">${t}</p>`).join("");
  }catch(e){return "";}};
 window.PROM_BACK={P1:"다시 나오는 곳: 3월 KPI 합의서에서 기준을 어디까지 알릴지 정할 때. 3월 말 분기 정산에서 지켰는지 판정합니다."};
})();
