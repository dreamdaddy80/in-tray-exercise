/* ===== 리더십 사전 · 이론으로 돌아보기 (2026-11-26) =====
   1) 리더십 사전 앱: 언제든 열어 이론을 찾아보고, 결정 전에 점검 질문으로 자신의 판단을 확인한다.
      - 메뉴바 "리더십 사전" 버튼, 결정 장면의 "결정 전에 점검해 보기" 칩, 성적표의 이론 칩에서 연다.
      - 결정 장면에서 펼쳐 본 항목은 G.lk에 남겨, 성적표에서 "결정 전에 찾아본 이론"으로 보여 준다.
   2) 성적표의 결정 카드: 상황별로 [근거 이론 → 이론이 권하는 행동 → 내 행동 → 차이 → 다음에 해 볼 행동]을 보여 준다.
      - Round 1·2는 v3.js 성적표의 결정 카드에, Round 3은 결산 첫 페이지에 들어간다.
   게임 규칙·점수·결과 코드는 건드리지 않는다. */
(function(){
 const esc=t=>String(t==null?"":t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const val=x=>{try{return typeof x==="function"?x(G):x;}catch(e){return "";}};
 const strip=x=>String(x||"").replace(/<[^>]+>/g,"");
 const jo=(w,a,b)=>{const c=String(w||"").trim().slice(-1).charCodeAt(0);if(c<0xAC00||c>0xD7A3)return b;return (c-0xAC00)%28?a:b;};

 /* ---------- 사전 항목 ---------- */
 const CATS=[["del","일 맡기기"],["eval","평가하기"],["res","자원 나누기"],["exp","설명하기"],["crisis","위기와 안전"],["rel","관계와 신뢰"],["judge","판단과 결정"]];
 const L={};
 const E=(id,cat,name,en,def,core,here,check,trap,src,kw)=>{L[id]={id,cat,name,en,def,core,here,check,trap,src,kw:kw||""};};

 E("transition","del","전문가에서 관리자로","Becoming a Manager",
  "뛰어난 실무자가 관리자가 될 때 가장 먼저 바꿔야 하는 것은 기술이 아니라 '내 일이 무엇인가'에 대한 생각이라는 관점입니다.",
  ["신임 관리자는 흔히 직위가 곧 영향력이라고 믿지만, 실제 영향력은 구성원과 동료의 신뢰에서 나옵니다.",
   "내가 직접 통제해야 결과가 난다는 생각은 구성원의 몰입을 떨어뜨립니다. 관리자의 성과는 팀이 내는 성과입니다.",
   "한 사람씩 관계를 관리하는 것만으로는 부족합니다. 팀 전체의 규칙과 분위기를 만드는 일이 관리자의 몫입니다.",
   "일이 조용히 돌아가게 하는 것을 넘어, 팀이 바뀌어야 할 방향을 정하고 이끄는 것도 관리자의 일입니다."],
  "어제까지 동료였던 사람들, 팀장 자리를 놓친 선배와 처음 마주하는 1월 장면들이 이 전환의 순간입니다. 시스템을 가장 잘 아는 사람이 직접 처리하고 싶은 유혹이 1년 내내 나옵니다.",
  ["이 일은 팀장인 나만 할 수 있는 일인가, 내가 가장 잘하는 일일 뿐인가?","이 결정으로 내가 얻는 것은 권한인가, 신뢰인가?","한 사람과의 관계뿐 아니라 팀 전체에 어떤 규칙을 보여 주는가?"],
  "실무를 직접 붙잡아 빠르게 해결하면 그 순간은 유능해 보이지만, 팀은 팀장 없이는 움직이지 못하게 됩니다.",
  "Hill, L. A. (2003). Becoming a Manager: How New Managers Master the Challenges of Leadership (2nd ed.). Harvard Business School Press.","신임 팀장 전환 정체성 실무자");
 E("monkey","del","원숭이를 넘겨받지 않기","Who's Got the Monkey?",
  "구성원이 들고 온 문제의 '다음 행동'(원숭이)이 누구 등에 올라가 있는지 살피라는 위임·시간 관리 원칙입니다.",
  ["\"제가 검토해 보고 알려 줄게요\"라고 답하는 순간, 다음 할 일은 관리자에게 넘어옵니다.",
   "대화가 끝날 때 다음 행동이 누구에게 있는지, 언제 다시 볼지를 분명히 합니다.",
   "구성원의 주도성에는 단계가 있습니다. 지시를 기다림 → 무엇을 할지 물어봄 → 안을 제안하고 실행함 → 실행하고 바로 알림 → 스스로 실행하고 정기적으로 보고함. 위임은 이 단계를 한 칸씩 올리는 일입니다.",
   "관리자가 원숭이를 모두 떠안으면 구성원은 기다리고, 관리자는 늘 시간이 모자랍니다."],
  "받은편지함의 메일 하나하나가 원숭이입니다. '직접 답장'은 원숭이를 내 등에 올리는 선택이고, '위임'은 다음 행동과 범위를 정해 돌려주는 선택입니다.",
  ["이 메시지에 답하고 나면 다음 행동은 누구에게 있는가?","상대가 스스로 할 수 있는 단계는 어디까지인가?","다시 확인할 시점을 정했는가?"],
  "도와준다는 마음으로 '내가 볼게'를 반복하면, 팀장 시간은 남의 원숭이를 돌보는 데 다 쓰입니다.",
  "Oncken, W., Jr., & Wass, D. L. (1974). Management time: Who's got the monkey? Harvard Business Review, 52(6), 75–80.","위임 받은편지함 시간 관리 메일");
 E("situational","del","상황적 리더십","Situational Leadership",
  "늘 옳은 리더십 방식 하나는 없으며, 구성원이 그 일에 대해 가진 능력과 의지에 맞춰 지시·코칭·지원·위임을 바꿔 써야 한다는 이론입니다.",
  ["능력도 자신감도 낮을 때는 구체적으로 지시합니다.",
   "의지는 있으나 능력이 부족하면 코칭합니다. 방향을 주되 이유를 설명하고 질문을 받습니다.",
   "능력은 있으나 자신감이나 의지가 흔들리면 지원합니다. 함께 결정하고 불안을 들어 줍니다.",
   "능력과 의지가 모두 높으면 위임합니다. 결과와 범위만 합의하고 방법은 맡깁니다."],
  "같은 리더라도 일에 따라 준비도가 다릅니다. 새 AI 도구 앞에서 불안해하는 리더에게 필요한 것은 목표를 빼 주는 것이 아니라 지원과 작은 첫 단계입니다.",
  ["이 사람은 이 일에 대해 능력이 있는가, 의지가 있는가?","지금 필요한 것은 지시·코칭·지원·위임 중 무엇인가?","준비도가 오르면 언제 한 단계 더 맡길 것인가?"],
  "모든 사람에게 같은 방식을 쓰면, 누군가에게는 간섭이 되고 누군가에게는 방치가 됩니다.",
  "Hersey, P., & Blanchard, K. H. (1969). Life cycle theory of leadership. Training and Development Journal, 23(5), 26–34. / Hersey, P., & Blanchard, K. H. (1977). Management of Organizational Behavior (3rd ed.). Prentice-Hall.","준비도 코칭 지원 지시");
 E("intent","del","의도를 밝혀 맡기기","Mission Command · Commander's Intent",
  "무엇을, 왜 해야 하는지와 지켜야 할 범위를 분명히 하고, 어떻게 할지는 현장에 맡기는 위임 방식입니다.",
  ["계획과 실제 사이에는 늘 틈이 생깁니다. 지시를 촘촘히 할수록 틈은 오히려 커집니다.",
   "맡길 때는 기대하는 결과, 그 일이 필요한 이유, 쓸 수 있는 권한(범위), 기한을 밝힙니다.",
   "이유를 아는 사람은 상황이 바뀌어도 스스로 판단해 목표를 지킵니다.",
   "맡은 사람이 자기 말로 다시 설명하게 하면(되묻기) 오해를 일찍 잡을 수 있습니다."],
  "이 과정에서 말하는 좋은 위임은 기대 결과·기한·권한·이유 네 가지를 붙여 맡기는 것입니다. 위기 때 지휘자를 정하는 일도 같은 원리입니다.",
  ["기대 결과·기한·권한·이유 네 가지를 말했는가?","상대가 자기 말로 다시 설명할 수 있는가?","내가 개입할 조건(범위를 벗어나는 경우)을 정했는가?"],
  "'알아서 잘해 줘'는 위임이 아니라 방치이고, 방법까지 정해 주면 위임이 아니라 지시입니다.",
  "Bungay, S. (2011). The Art of Action: How Leaders Close the Gaps between Plans, Actions and Results. Nicholas Brealey.","위임 권한 기한 이유 지휘");

 E("procjust","eval","절차 공정성","Procedural Justice",
  "사람들은 결과만큼이나 그 결과가 정해진 과정이 공정했는지를 따지며, 과정이 공정하면 불리한 결과도 더 잘 받아들인다는 원리입니다.",
  ["일관성: 사람과 시점에 관계없이 같은 기준을 씁니다.",
   "편향 억제·정확성: 개인적 이해나 인상이 아니라 확인된 정보로 정합니다.",
   "수정 가능성: 잘못된 결정을 바로잡을 통로(이의제기)가 있습니다.",
   "대표성·윤리성: 영향을 받는 사람의 목소리가 반영되고, 도덕 기준에 맞습니다."],
  "'공개하지 않은 기준은 결정의 근거로 쓸 수 없다', '공개한 기준을 바꾸면 다시 알려야 한다'는 이 과정의 규칙이 절차 공정성에서 나왔습니다.",
  ["이 기준을 영향받는 사람 모두가 미리 알고 있는가?","다른 사람에게도 같은 기준을 썼는가?","결과에 이의가 있으면 어디로 말하면 되는지 알려 주었는가?"],
  "결과가 좋으면 과정은 넘어가도 된다고 생각하기 쉽지만, 불공정한 과정은 다음 결정의 신뢰까지 깎습니다.",
  "Thibaut, J., & Walker, L. (1975). Procedural Justice: A Psychological Analysis. Erlbaum. / Leventhal, G. S. (1980). What should be done with equity theory? In K. J. Gergen, M. S. Greenberg, & R. H. Willis (Eds.), Social Exchange (pp. 27–55). Plenum.","공정 기준 공개 이의제기 평가");
 E("kerr","eval","A를 바라며 B를 보상하기","On the Folly of Rewarding A, While Hoping for B",
  "조직이 바라는 행동(A)과 실제로 측정·보상하는 행동(B)이 다르면, 사람들은 B를 한다는 경고입니다.",
  ["측정하기 쉬운 것을 지표로 삼으면, 측정하기 어려운 중요한 일은 줄어듭니다.",
   "지표가 목표가 되면 지표를 채우는 행동이 늘고 지표의 의미는 흐려집니다(캠벨의 법칙).",
   "지표를 정할 때는 '이 숫자를 올리는 가장 쉬운 방법이 무엇인가'를 먼저 물어봅니다.",
   "숫자 하나보다 결과 지표와 과정 근거를 함께 봅니다."],
  "실험 건수, 예방 건수, 수주액 하나 같은 KPI 제안이 모두 이 함정과 닿아 있습니다.",
  ["이 지표를 가장 쉽게 올리는 방법은 무엇이고, 그것이 내가 바라는 행동인가?","이 지표에 잡히지 않는 중요한 일은 무엇인가?","숫자 옆에 볼 근거(과정, 질)는 무엇인가?"],
  "'깔끔한 숫자 하나'는 다툼을 줄여 주지만, 숫자에 없는 일을 하던 사람을 조용히 떠나게 합니다.",
  "Kerr, S. (1975). On the folly of rewarding A, while hoping for B. Academy of Management Journal, 18(4), 769–783. / Campbell, D. T. (1979). Assessing the impact of planned social change. Evaluation and Program Planning, 2(1), 67–90.","KPI 지표 측정 보상 건수");
 E("ocb","eval","보이지 않는 기여","Organizational Citizenship Behavior",
  "공식 직무나 보상 체계에 적혀 있지 않지만 조직이 잘 돌아가게 하는 자발적 기여(돕기, 예방, 지식 공유 등)입니다.",
  ["동료 돕기, 문제를 미리 막기, 노하우 공유, 궂은일 맡기 같은 행동입니다.",
   "평가와 인정에서 계속 빠지면 이런 행동은 줄어듭니다.",
   "특히 예방은 성공할수록 '아무 일도 없었다'로 보여 기여가 지워지기 쉽습니다.",
   "보이는 성과(복구, 수주)와 보이지 않는 기여(예방, 지원)를 같은 표에 올려야 균형이 잡힙니다."],
  "8개월 동안 사고를 막아 온 가공 모듈, 제안서를 쓰고도 표지에 이름이 없던 구성원이 이 개념의 장면입니다.",
  ["이 결정에서 눈에 띄지 않게 기여한 사람은 누구인가?","그 기여는 기준이나 기록 어디에 남는가?","눈에 띄는 기여만 인정하면 다음에 누가 무엇을 그만두게 될까?"],
  "불을 끈 사람만 상을 받으면, 불이 나지 않게 막던 사람은 점검을 형식으로만 하게 됩니다.",
  "Organ, D. W. (1988). Organizational Citizenship Behavior: The Good Soldier Syndrome. Lexington Books.","예방 공로 인정 기여 표기");
 E("rater","eval","평가 오류","Rater Errors",
  "평가자가 의도하지 않아도 등급을 한쪽으로 비트는 판단 습관들입니다.",
  ["후광 효과: 한 가지 인상(성격, 한 번의 큰 성과)이 다른 기준의 평가까지 끌어올리거나 내립니다.",
   "관대화·중심화: 갈등을 피하려고 모두 후하게 주거나 가운데 등급에 몰아 줍니다.",
   "최근 효과: 연말에 가까운 일이 1년 전체를 대신합니다.",
   "유사성 효과: 나와 비슷하거나 가까운 사람을 더 좋게 봅니다.",
   "줄이는 법: 기준별로 따로 평가하고, 1년 치 관찰 기록을 근거로 붙이고, 다른 평가자와 등급을 맞춰 보는 보정 회의를 거칩니다."],
  "12월 평가에서 모듈 리더의 의견서를 그대로 받을지, 7명을 직접 평가할 때 무엇을 근거로 삼을지가 이 오류들과 맞닿습니다.",
  ["이 등급의 근거가 되는 관찰 기록이 기준별로 있는가?","1월~6월의 일도 보았는가?","나와 가까운 사람에게 다른 잣대를 쓰지 않았는가?"],
  "'다 아는 사람들인데 기록까지 필요할까'라는 생각이 가장 흔한 오류의 출발점입니다.",
  "Thorndike, E. L. (1920). A constant error in psychological ratings. Journal of Applied Psychology, 4(1), 25–29. / Murphy, K. R., & Cleveland, J. N. (1995). Understanding Performance Appraisal. Sage.","등급 후광 최근 효과 관대화 보정");
 E("goal","eval","목표 설정 이론","Goal-Setting Theory",
  "구체적이고 도전적인 목표가 '최선을 다하자' 같은 막연한 목표보다 성과를 높이며, 이를 위해 몰입과 피드백이 필요하다는 이론입니다.",
  ["목표는 구체적이고 어느 정도 도전적일 때 효과가 큽니다.",
   "목표에 대한 몰입은 함께 정하거나, 왜 중요한지 이해할 때 높아집니다.",
   "진척을 알 수 있는 피드백이 있어야 목표가 행동을 이끕니다.",
   "새롭고 복잡한 일에서는 성과 목표보다 '무엇을 배울지'를 정하는 학습 목표가 더 낫습니다."],
  "KPI 합의 장면은 목표의 구체성, 함께 정하기, 상황이 바뀌면 다시 보기를 모두 다룹니다.",
  ["이 목표는 달성 여부를 누구나 같은 방식으로 판단할 수 있을 만큼 구체적인가?","목표를 정할 때 당사자가 참여했는가?","상황이 바뀌면 언제 다시 볼지 정했는가?"],
  "작년 목표를 그대로 쓰면 다툼은 없지만, 올해 새로 생긴 일(AI 전환, 예방)은 목표 밖에 남습니다.",
  "Locke, E. A., & Latham, G. P. (1990). A Theory of Goal Setting and Task Performance. Prentice-Hall. / Locke, E. A., & Latham, G. P. (2002). Building a practically useful theory of goal setting and task motivation. American Psychologist, 57(9), 705–717.","KPI 목표 합의 피드백");

 E("explore","res","탐색과 활용의 균형","Exploration and Exploitation",
  "이미 아는 것을 더 잘하는 활용과 새로운 가능성을 찾는 탐색은 같은 자원을 두고 경쟁하므로, 둘의 균형을 의도적으로 잡아야 한다는 관점입니다.",
  ["활용은 성과가 빠르고 확실하지만, 그것만 하면 환경이 바뀔 때 뒤처집니다(역량의 함정).",
   "탐색은 불확실하고 늦게 보답하지만, 미래의 역량을 만듭니다.",
   "단기 성과 압박 속에서는 활용이 탐색을 밀어내기 쉽습니다.",
   "그래서 탐색에 쓸 몫을 미리 떼어 두고 보호하는 결정이 필요합니다."],
  "여력 10칸을 운영(RUN)과 AI·제안(GROW)·예방(SEC)에 나누는 일, 차출 뒤 무엇을 멈출지 정하는 일이 이 균형의 결정입니다.",
  ["지금 배분은 이번 분기 성과와 내년 역량 중 어디에 치우쳐 있는가?","탐색에 준 몫을 단기 압박에서 어떻게 지킬 것인가?","멈추는 일과 지키는 일의 기준을 말할 수 있는가?"],
  "AI로 아낀 시간을 말없이 새 일로 채우면, 탐색도 활용도 아닌 과부하만 남습니다.",
  "March, J. G. (1991). Exploration and exploitation in organizational learning. Organization Science, 2(1), 71–87.","배분 여력 AI 전환 우선순위");
 E("equity","res","형평 이론과 분배 공정성","Equity Theory · Distributive Justice",
  "사람들은 자신의 투입 대비 보상을 다른 사람과 비교하며, 그 비율이 불공평하다고 느끼면 노력을 줄이거나 떠나는 방식으로 균형을 맞추려 한다는 이론입니다.",
  ["공정함은 절대량이 아니라 비교에서 느껴집니다.",
   "불공평을 느낀 사람은 노력을 줄이거나, 비교 대상을 깎아내리거나, 조직을 떠납니다.",
   "누가 무엇을 투입했는지 보이지 않으면 비교가 왜곡됩니다. 기여 기록이 중요한 이유입니다.",
   "분배가 어쩔 수 없이 불리할 때는 절차와 설명의 공정성이 그 충격을 줄입니다."],
  "공로 표기, 포상 후보, 여력과 토큰 배분, 연말 등급 모두 누군가는 비교하며 봅니다.",
  ["이 배분을 본 사람들은 누구와 자신을 비교할까?","각자의 투입(시간, 위험, 보이지 않는 기여)이 보이게 되어 있는가?","불리한 쪽에 어떤 설명을 할 것인가?"],
  "'고르게 나누면 공평하다'는 생각은 투입이 다른 사람들에게 오히려 불공평합니다.",
  "Adams, J. S. (1965). Inequity in social exchange. In L. Berkowitz (Ed.), Advances in Experimental Social Psychology (Vol. 2, pp. 267–299). Academic Press.","형평 분배 비교 공로");
 E("jdr","res","직무 요구-자원 모델","Job Demands–Resources Model",
  "일의 요구(업무량, 시간 압박, 정서 부담)가 자원(자율, 지원, 피드백, 회복)을 넘어서면 소진이, 자원이 충분하면 몰입이 생긴다는 모델입니다.",
  ["요구가 높다고 바로 소진되지는 않습니다. 자원이 함께 부족할 때 위험해집니다.",
   "자원은 요구의 충격을 줄이고, 그 자체로 몰입을 높입니다.",
   "소진은 서서히 쌓이고, 드러날 때는 이탈이나 사고로 한꺼번에 나타납니다.",
   "리더가 줄 수 있는 자원: 우선순위 정리, 멈출 일 정하기, 권한, 인정, 회복 시간."],
  "모듈의 업무량과 스트레스가 이 모델을 옮긴 것입니다. 업무량 70 이상이 이어지면 스트레스가 쌓이고, 80을 넘으면 신뢰가 깎입니다.",
  ["이 결정으로 어느 모듈의 요구가 늘어나는가?","늘어난 요구만큼 줄 수 있는 자원(시간, 권한, 멈출 일)은 무엇인가?","이미 부하가 높은 모듈을 먼저 확인했는가?"],
  "'다들 바쁘니까 고르게 조금씩 더'는 이미 한계에 있는 사람에게 가장 큰 부담이 됩니다.",
  "Bakker, A. B., & Demerouti, E. (2007). The Job Demands-Resources model: State of the art. Journal of Managerial Psychology, 22(3), 309–328.","업무량 스트레스 소진 부하");
 E("negot","res","원칙 협상","Principled Negotiation (Getting to Yes)",
  "입장을 두고 밀고 당기기보다 서로의 이해관계를 밝히고 객관적 기준으로 합의하라는 하버드 협상 프로젝트의 협상 방식입니다.",
  ["사람과 문제를 분리합니다. 관계를 지키면서도 문제에는 단호할 수 있습니다.",
   "입장('8% 깎아 달라')이 아니라 이해관계('왜 그 숫자가 필요한가')에 집중합니다.",
   "결정 전에 서로 이익이 되는 선택지를 여러 개 만듭니다.",
   "객관적 기준(실측치, 시장 관행, 계약 산식)을 근거로 합의합니다.",
   "협상 전에 합의가 안 될 때의 최선의 대안(BATNA)과 물러설 선을 정해 둡니다."],
  "헬씨푸드 운영비 협상, 하반기 계약, 가용성 재산정 전화, 본사 차출 협의가 모두 이 원칙의 장면입니다.",
  ["상대의 입장 뒤에 있는 이해관계는 무엇인가?","합의의 근거로 쓸 객관적 기준은 무엇인가?","합의가 안 되면 우리의 최선의 대안은 무엇이고, 물러설 선은 어디인가?"],
  "관계를 지키려고 그 자리에서 양보하면, 근거 없는 양보가 다음 협상의 출발점이 됩니다.",
  "Fisher, R., Ury, W., & Patton, B. (2011). Getting to Yes: Negotiating Agreement Without Giving In (3rd ed.). Penguin. (초판 1981)","협상 고객 계약 BATNA 이해관계");

 E("fairproc","exp","공정한 프로세스(3E)","Fair Process",
  "결정에 사람들을 참여시키고(Engagement), 결정의 이유를 설명하고(Explanation), 앞으로의 기대를 분명히 하면(Expectation clarity) 결과에 동의하지 않는 사람도 결정을 받아들이고 협력한다는 원리입니다.",
  ["참여: 결정에 영향을 받는 사람의 의견을 묻고, 서로의 생각에 반론할 기회를 줍니다.",
   "설명: 왜 그렇게 정했는지, 어떤 의견은 왜 반영하지 않았는지 밝힙니다.",
   "기대 명확화: 결정 뒤 무엇이 바뀌는지, 무엇을 기준으로 평가받는지, 실패하면 어떻게 되는지 알려 줍니다.",
   "공정한 프로세스의 목표는 모두의 합의가 아니라, 동의하지 않는 사람도 실행에 나서게 하는 것입니다."],
  "'설명하지 않은 결정은 소문이 된다'는 이 과정의 규칙이 여기서 나왔습니다. 배분 공지, 차출 결과 공지, 세 개의 설명이 모두 3E의 장면입니다.",
  ["결정 전에 영향받는 사람의 의견을 들었는가?","반영하지 않은 의견에 대해 이유를 말할 수 있는가?","결정 뒤 무엇이 바뀌고 무엇을 기대하는지 알렸는가?"],
  "'결정은 이미 났으니 설명은 나중에'라고 미루면, 그 사이를 소문이 채웁니다.",
  "Kim, W. C., & Mauborgne, R. (1997). Fair process: Managing in the knowledge economy. Harvard Business Review, 75(4), 65–75.","설명 공지 참여 3E 소문");
 E("psysafe","exp","심리적 안전감","Psychological Safety",
  "이 팀에서는 질문하거나 실수를 말하거나 반대 의견을 내도 창피를 당하거나 불이익을 받지 않는다는, 팀원들이 함께 가진 믿음입니다.",
  ["심리적 안전감이 높은 팀은 실수를 더 많이 '보고'합니다. 실수가 많아서가 아니라 숨기지 않기 때문입니다.",
   "리더가 실수 보고, 나쁜 소식, 이견에 어떻게 반응하는지가 안전감을 만들거나 무너뜨립니다.",
   "안전감은 기준을 낮추는 것이 아닙니다. 높은 기준과 높은 안전감이 함께 있을 때 학습이 일어납니다.",
   "리더가 할 일: 일을 배워 가는 과제로 설명하기, 자신이 모르는 것을 인정하기, 먼저 묻기, 말해 준 사람에게 고마워하기."],
  "이 게임에는 숨겨진 값 '팀의 심리적 안전'이 있습니다. 회의 운영, 설문 대응, 실수를 공개적으로 지목하는 결정이 이 값을 움직이고, 보내지 않은 메시지 수로 드러납니다.",
  ["이 결정을 본 팀원은 다음에 실수나 반대 의견을 말할까?","말해 준 사람이 손해를 보지 않게 되어 있는가?","기준은 지키면서도 사람을 공개적으로 깎아내리지 않는 방법이 있는가?"],
  "본보기로 한 사람을 지목하면 선은 분명해지지만, 다음 실수는 보고되지 않습니다.",
  "Edmondson, A. C. (1999). Psychological safety and learning behavior in work teams. Administrative Science Quarterly, 44(2), 350–383. / Edmondson, A. C. (2019). The Fearless Organization. Wiley.","안전 실수 보고 이견 회의");
 E("voice","exp","조직 침묵과 발언","Organizational Silence · Employee Voice",
  "구성원은 '말해도 소용없다' 또는 '말하면 위험하다'고 믿을 때 침묵하며, 리더의 열린 반응과 실제 후속 조치가 발언을 늘린다는 연구 흐름입니다.",
  ["침묵의 두 이유: 무력감(말해도 안 바뀐다)과 두려움(말하면 손해 본다).",
   "구성원은 리더가 의견을 들은 뒤 실제로 무엇을 했는지를 보고 다음 발언을 정합니다.",
   "열린 태도라는 말보다, 들은 것을 돌려주고 하나라도 바꾸는 행동이 발언을 늘립니다.",
   "침묵이 길어지면 문제는 사라지는 것이 아니라 숨어서 커집니다."],
  "팀 설문 결과를 돌려줄지, 익명 게시판 글에 어떻게 반응할지가 다음 설문과 '보내지 않은 메시지'를 정합니다.",
  ["의견을 낸 사람에게 무엇을 돌려줄 것인가?","이번에 실제로 바꿀 한 가지는 무엇이고, 언제까지인가?","말하지 않고 있는 사람은 누구이고, 왜일까?"],
  "'아직 이르니 지켜보자'는 신중해 보이지만, 답한 사람들은 '말해도 바뀌는 게 없다'고 배웁니다.",
  "Morrison, E. W., & Milliken, F. J. (2000). Organizational silence: A barrier to change and development in a pluralistic world. Academy of Management Review, 25(4), 706–725. / Detert, J. R., & Burris, E. R. (2007). Leadership behavior and employee voice: Is the door really open? Academy of Management Journal, 50(4), 869–884.","설문 익명 침묵 발언");
 E("bridges","exp","변화와 전환","Managing Transitions",
  "조직의 변화(새 제도, 인력 감축)는 하루 만에 일어나지만, 사람들의 심리적 전환은 '끝남 → 중립 지대 → 새 시작'을 거쳐 천천히 일어난다는 관점입니다.",
  ["새 시작을 말하기 전에 무엇이 끝나는지(잃는 것)를 먼저 인정합니다.",
   "옛 방식은 끝났고 새 방식은 아직 자리 잡지 않은 중립 지대에서 혼란과 불안이 가장 큽니다. 이때 자주, 분명하게 소통합니다.",
   "새 시작에는 목적, 그림, 계획, 각자의 역할을 함께 줍니다.",
   "같은 변화도 사람마다 잃는 것이 다르므로 설명도 달라야 합니다."],
  "본사 차출, 바뀐 평가 지침, 줄어든 여력을 팀에 알리는 장면이 모두 전환의 장면입니다.",
  ["이 변화로 누가 무엇을 잃는가? 그것을 먼저 인정했는가?","바뀌는 것과 바뀌지 않는 것을 나눠 말했는가?","다음 소통은 언제인가?"],
  "좋은 점만 강조하는 공지는 잃는 것이 있는 사람에게 '내 사정은 모른다'는 말로 들립니다.",
  "Bridges, W. (1991). Managing Transitions: Making the Most of Change. Addison-Wesley.","변화 공지 차출 지침 변경");

 E("hro","crisis","고신뢰 조직","High Reliability Organizing",
  "원자력 발전소, 항공모함, 관제탑처럼 실수가 치명적인 조직이 예상치 못한 사건을 다루는 다섯 가지 원칙입니다.",
  ["실패에 대한 집착: 작은 이상 신호를 큰 사고의 전조로 다룹니다.",
   "단순화 거부: '센서 오작동 같다'처럼 편한 설명으로 서둘러 결론 내지 않습니다.",
   "운영에 대한 민감성: 현장에서 지금 실제로 무슨 일이 일어나는지 봅니다.",
   "회복탄력성: 문제가 생겼을 때 빠르게 수습하고 배우는 능력을 기릅니다.",
   "전문성 존중: 위기 때는 직급이 아니라 그 문제를 가장 잘 아는 사람에게 판단을 맡깁니다."],
  "새벽 3시 인터록 신호, 고객 데이터 유출이 이 원칙의 장면입니다. 장애 절차·보안·현장 안전은 다른 점수와 관계없이 지켜야 하는 선입니다.",
  ["확인되지 않은 위험을 '없는 것'으로 다루고 있지 않은가?","이 문제를 가장 잘 아는 사람이 판단하고 있는가?","납기나 고객 반응 때문에 절차를 건너뛰려 하지 않는가?"],
  "결과적으로 아무 일 없었다고 해서, 위험을 감수한 결정이 옳았던 것은 아닙니다.",
  "Weick, K. E., & Sutcliffe, K. M. (2015). Managing the Unexpected: Sustained Performance in a Complex World (3rd ed.). Wiley. (초판 2001)","장애 안전 위기 지휘 인터록");
 E("justcult","crisis","공정 문화","Just Culture",
  "정직한 실수는 처벌하지 않고 배우는 기회로 삼되, 무모한 행동에는 책임을 묻는 선을 분명히 하는 안전 문화입니다.",
  ["사고의 대부분은 개인의 악의가 아니라 시스템의 빈틈(절차, 도구, 압박)에서 생깁니다.",
   "실수한 사람을 공개적으로 처벌하면, 다음 실수는 보고되지 않고 숨겨집니다.",
   "정직한 실수, 위험을 의식하지 못한 행동, 알면서 무시한 무모한 행동을 구분해 다룹니다.",
   "사고 뒤의 질문은 '누가 했나'보다 '무엇이 이 일을 가능하게 했나'입니다."],
  "승인되지 않은 AI 서비스로 고객 데이터가 나간 3월 장면이 대표적입니다. 신고는 즉시, 비판은 사람이 아니라 절차의 빈틈에 둡니다.",
  ["이 일은 정직한 실수인가, 무모한 행동인가?","보고한 사람이 손해를 보는 구조는 아닌가?","같은 일이 다시 일어나지 않게 바꿀 절차는 무엇인가?"],
  "본보기 처벌은 선을 분명히 하는 것처럼 보이지만, 다음 사고를 늦게 알게 만듭니다.",
  "Reason, J. (1997). Managing the Risks of Organizational Accidents. Ashgate. / Dekker, S. (2016). Just Culture: Restoring Trust and Accountability in Your Organization (3rd ed.). CRC Press.","보안 사고 신고 처벌 실수");

 E("trust","rel","신뢰의 세 요소","Integrative Model of Organizational Trust",
  "상대를 믿을지는 그 사람의 능력(할 수 있는가), 선의(나를 위하는가), 진실성(원칙과 약속을 지키는가)에 대한 판단으로 정해진다는 모델입니다.",
  ["능력: 그 일을 해낼 역량이 있어 보이는가.",
   "선의: 자기 이익만이 아니라 나를 위해 줄 것으로 보이는가.",
   "진실성: 말과 행동이 같고, 받아들일 만한 원칙을 일관되게 지키는가.",
   "신뢰는 위험을 감수하는 행동(맡기기, 솔직하게 말하기)으로 이어지고, 그 결과가 다시 신뢰를 바꿉니다."],
  "모듈 리더 다섯 명의 신뢰 점수가 이 세 가지 판단의 합입니다. 틀린 숫자를 먼저 인정하는 것은 진실성을, 선배의 경험을 존중하는 것은 선의를 보여 줍니다.",
  ["이 결정은 상대에게 나의 능력·선의·진실성 중 무엇을 보여 주는가?","지난번에 한 약속과 지금 결정이 일치하는가?","불리한 사실을 먼저 말하고 있는가?"],
  "신뢰를 얻으려고 원하는 것을 다 들어주면 선의는 보이지만, 원칙(진실성)이 흔들립니다.",
  "Mayer, R. C., Davis, J. H., & Schoorman, F. D. (1995). An integrative model of organizational trust. Academy of Management Review, 20(3), 709–734.","신뢰 선배 약속 진실성");
 E("lmx","rel","리더-구성원 교환(LMX)","Leader–Member Exchange",
  "리더는 구성원 모두와 같은 관계를 맺지 않으며, 관계의 질에 따라 정보·기회·지원이 달라져 '안쪽 사람'과 '바깥 사람'이 생긴다는 이론입니다.",
  ["관계의 질이 높은 구성원은 더 많은 정보와 도전적인 일, 지원을 받습니다.",
   "바깥에 있다고 느끼는 사람은 최소한의 역할만 하고, 공정성을 의심합니다.",
   "후기 연구는 일부와만 좋은 관계를 맺지 말고, 모두에게 높은 질의 관계를 제안하라고 권합니다.",
   "누구와 먼저 만나는지, 누구에게 먼저 묻는지를 다른 사람들이 보고 있습니다."],
  "어제까지 동료였던 이수진, 생각이 잘 맞는 서하준과 먼저 가까워지기 쉽습니다. 다른 리더들은 그것을 셈합니다.",
  ["이 결정에서 나와 가까운 사람에게 다른 기회를 주고 있지 않은가?","내가 덜 만나는 리더는 누구인가?","친한 사람에게 맡긴 이유를 다른 사람에게도 설명할 수 있는가?"],
  "편한 사람과 먼저 상의하는 습관이 쌓이면, 의도하지 않아도 팀 안에 바깥 사람들이 생깁니다.",
  "Graen, G. B., & Uhl-Bien, M. (1995). Relationship-based approach to leadership: Development of leader-member exchange (LMX) theory of leadership over 25 years. The Leadership Quarterly, 6(2), 219–247.","관계 편애 옛 동료 면담");
 E("conflict","rel","갈등 대처 방식","Thomas–Kilmann Conflict Modes",
  "갈등 상황에서 사람들은 자기 관심을 주장하는 정도와 상대 관심을 배려하는 정도에 따라 경쟁·협력·타협·회피·수용 다섯 가지 방식 가운데 하나를 쓴다는 모델입니다.",
  ["경쟁: 내 관심을 밀어붙입니다. 급하거나 원칙이 걸린 일에 맞습니다.",
   "협력: 양쪽 관심을 모두 채우는 답을 찾습니다. 시간이 들지만 중요한 일에 맞습니다.",
   "타협: 서로 조금씩 양보합니다. 빠르지만 어느 쪽도 온전히 얻지 못합니다.",
   "회피: 지금은 다루지 않습니다. 사소하거나 열을 식혀야 할 때만 맞습니다.",
   "수용: 상대 관심을 먼저 채웁니다. 관계가 더 중요할 때 맞습니다. 어느 방식도 늘 옳지는 않습니다."],
  "강태식의 공개 반대, 강태식과 이수진의 포상 다툼처럼 리더들 사이의 갈등 장면에서 쓰는 방식이 신뢰와 동맹 관계를 움직입니다.",
  ["지금 쓰려는 방식은 다섯 가지 중 무엇인가?","이 갈등에 걸린 것은 원칙인가, 관계인가, 시간인가?","회피하고 있다면, 언제 다시 다룰지 정했는가?"],
  "늘 같은 방식(특히 회피나 수용)을 쓰면, 갈등은 줄어든 것처럼 보이지만 쌓입니다.",
  "Thomas, K. W., & Kilmann, R. H. (1974). Thomas-Kilmann Conflict Mode Instrument. Xicom. / Thomas, K. W. (1976). Conflict and conflict management. In M. D. Dunnette (Ed.), Handbook of Industrial and Organizational Psychology (pp. 889–935). Rand McNally.","갈등 중재 반대 다툼");
 E("manageup","rel","상사·본사와 일하기","Managing Your Boss",
  "상사(또는 본사·인사팀)와의 관계는 지시를 받기만 하는 관계가 아니라 서로 의존하는 관계이므로, 상대의 목표와 압박을 이해하고 내 필요를 근거와 함께 전하며 관리해야 한다는 관점입니다.",
  ["상대의 목표, 압박, 일하는 방식을 이해합니다. 공문 뒤에도 누군가의 목표가 있습니다.",
   "내 강점·약점과 필요를 분명히 압니다.",
   "기대를 서로 맞추고, 나쁜 소식은 먼저, 근거와 함께 알립니다.",
   "무조건 따르는 것도, 무조건 거부하는 것도 아닌 '근거 있는 대안'을 들고 협의합니다."],
  "본사 차출 공문, 인사팀 평가 지침 변경이 대표 장면입니다. 위에서 온 결정을 팀에 그대로 넘기면 팀장은 전달자가 됩니다.",
  ["이 요청을 보낸 쪽이 실제로 얻고 싶은 것은 무엇인가?","그 목표를 지키면서 우리 팀의 핵심을 지킬 대안이 있는가?","대안을 뒷받침할 숫자와 근거를 가지고 있는가?"],
  "위에서 온 것이니 그대로 따르면 갈등은 없지만, 팀은 팀장이 자신들을 지켜 주지 않는다고 배웁니다.",
  "Gabarro, J. J., & Kotter, J. P. (1980). Managing your boss. Harvard Business Review, 58(1), 92–100.","본사 인사팀 공문 상사");

 E("outcome","judge","결과 편향","Outcome Bias",
  "결정 당시의 정보와 판단 과정이 아니라, 나중에 나온 결과로 결정의 좋고 나쁨을 평가하는 경향입니다.",
  ["좋은 결정도 운이 나쁘면 나쁜 결과를 낳고, 나쁜 결정도 운이 좋으면 통합니다.",
   "결과로만 배우면 위험한 결정을 '통했으니 괜찮다'고 반복하게 됩니다.",
   "결정을 돌아볼 때는 그때 알 수 있었던 정보, 고려한 대안, 감수한 위험을 봅니다.",
   "결정 전에 '이 선택이 잘못될 확률과 그때의 손실'을 적어 두면 나중에 공정하게 돌아볼 수 있습니다."],
  "이 게임의 선택에는 확률로 일어나는 일이 붙어 있습니다. 성적표는 결과와 함께 '그 선택이 리더 행동이었는가'를 따로 보여 줍니다.",
  ["이 선택이 잘못될 확률과 그때의 손실은 얼마인가?","결과가 좋았어도 다시 같은 선택을 할 것인가?","결과가 나빴어도 과정이 옳았다면 무엇을 유지할 것인가?"],
  "'아무 일 없었잖아'는 결정을 돌아볼 때 가장 위험한 말입니다.",
  "Baron, J., & Hershey, J. C. (1988). Outcome bias in decision evaluation. Journal of Personality and Social Psychology, 54(4), 569–579.","확률 결과 운 판단");
 E("vroom","judge","참여의 정도 정하기","Normative Decision Model (Vroom–Yetton)",
  "리더가 혼자 결정할지, 의견을 물을지, 함께 결정할지를 결정의 질 요구, 구성원의 수용 필요, 정보가 누구에게 있는지에 따라 골라야 한다는 모델입니다.",
  ["정보가 나에게 충분하고 수용이 크게 필요 없으면 혼자 결정해도 됩니다.",
   "정보가 구성원에게 있으면 묻지 않고는 좋은 결정을 할 수 없습니다.",
   "실행에 구성원의 수용이 꼭 필요하면 참여 수준을 높입니다.",
   "참여 방식(개별 상담, 집단 토론, 위임)도 결정의 일부입니다."],
  "첫 주간 회의를 어떻게 운영할지, KPI를 누구와 직접 합의할지, 평가를 어디까지 리더 의견에 맡길지가 이 판단입니다.",
  ["이 결정에 필요한 정보는 누구에게 있는가?","실행하려면 누가 받아들여야 하는가?","혼자·상의·함께 결정 중 무엇이 맞는가?"],
  "모두에게 묻는 것이 늘 좋은 것도, 혼자 정하는 것이 늘 빠른 것도 아닙니다. 실행 단계에서 반대가 나오면 더 늦어집니다.",
  "Vroom, V. H., & Yetton, P. W. (1973). Leadership and Decision-Making. University of Pittsburgh Press. / Vroom, V. H., & Jago, A. G. (1988). The New Leadership. Prentice-Hall.","회의 참여 결정 방식 면담");
 E("adaptive","judge","기술적 과제와 적응적 과제","Adaptive Leadership",
  "전문 지식으로 풀 수 있는 기술적 과제와, 사람들의 가치·습관·관계가 바뀌어야 풀리는 적응적 과제를 구분하고, 적응적 과제를 기술적 해법으로만 풀려 하지 말라는 관점입니다.",
  ["기술적 과제: 답이 알려져 있고 전문가가 풀 수 있습니다(시스템 설정, 절차 도입).",
   "적응적 과제: 답을 당사자들이 찾아야 하고, 무언가를 잃는 사람이 생깁니다(AI 전환, 일하는 방식 변화).",
   "적응적 과제를 기술적으로만 다루면 도구는 들어오는데 일은 바뀌지 않습니다.",
   "리더는 답을 주기보다 문제를 당사자에게 돌려주고, 감당할 수 있는 속도로 압력을 조절합니다."],
  "AI Native 전환과 '아낀 시간을 어디에 쓸 것인가'는 대표적인 적응적 과제입니다. 도구 도입만으로는 풀리지 않습니다.",
  ["이 문제는 전문가가 풀 수 있는가, 당사자들이 바뀌어야 풀리는가?","이 변화로 누가 무엇을 잃는가?","답을 내가 주고 있는가, 당사자가 찾게 하고 있는가?"],
  "새 도구를 들이고 교육을 하면 전환이 끝났다고 여기기 쉽습니다. 습관은 도구보다 늦게 바뀝니다.",
  "Heifetz, R. A. (1994). Leadership Without Easy Answers. Harvard University Press. / Heifetz, R. A., Grashow, A., & Linsky, M. (2009). The Practice of Adaptive Leadership. Harvard Business Press.","AI 전환 변화 핵심 과제");
 window.LEX=L;window.LEX_CATS=CATS;

 /* ---------- 장면별 근거 이론과 다음에 해 볼 행동 ---------- */
 const TH={
  "inbox":{th:["monkey","intent"],imp:"메일을 열면 먼저 '이건 팀장만 할 수 있는 일인가'를 묻고, 아니라면 기대 결과·기한·권한·이유를 붙여 넘기세요. 보류할 때는 언제 답할지를 상대에게 알려 주세요."},
  "1-3":{th:["adaptive","goal"],imp:"과제를 고를 때 '이 일이 해결되면 1년 뒤 무엇이 달라지는가'를 한 문장으로 적어 보세요. 전문가가 풀 수 있는 일과 사람들의 습관이 바뀌어야 풀리는 일을 나눠 두면 우선순위가 분명해집니다."},
  "1-5":{th:["vroom","psysafe"],gap:"참여의 정도 정하기 관점에서, 이 회의에 필요한 정보(쟁점과 이견)는 리더들에게 있습니다. 보고 중심 회의는 그 정보를 꺼내지 못하고, 심리적 안전감이 낮은 첫 주에는 이견이 더 숨습니다.",imp:"다음 회의는 안건을 하루 전에 보내고, 첫 10분은 말이 적었던 사람에게 먼저 묻는 순서로 바꿔 보세요."},
  "1-4":{th:["transition","trust"],imp:"선배와의 첫 정기 면담에서 '내가 배워야 할 것'과 '팀장으로서 꼭 봐야 할 것'을 둘 다 말로 꺼내 보세요. 하나만 말하면 존중이 방임이 되거나, 원칙이 대립이 됩니다."},
  "3-1":{th:["procjust","ocb"],gap:"절차 공정성의 일관성·대표성 규칙은 영향을 받는 모든 사람이 같은 기준을 미리 아는 것을 요구합니다. 기준을 일부에게만 알리거나 '종합 판단'으로 두면, 구성원은 결과만 보고 과정을 짐작하게 됩니다.",imp:"기준 초안을 공개하기 전에 각 모듈 리더에게 '이 기준으로는 안 보이는 기여가 있는가'를 한 번 묻고, 답을 반영한 뒤 전원에게 같은 날 공개하세요."},
  "3-1-3":{th:["goal","procjust"],gap:"목표 설정 이론은 목표가 상황에 맞게 다시 조정될 때 몰입이 유지된다고 봅니다. 재검토 조건이 없으면 기준을 바꿀 때마다 '그때그때 바꾼다'는 절차 공정성 문제가 생깁니다.",imp:"합의서마다 '무엇이 바뀌면, 언제, 누구와 다시 본다'를 한 줄로 적어 두세요."},
  "R1-pick":{th:["vroom","lmx"],imp:"면담 대상을 정할 때 친한 순서가 아니라 '이견이 큰 순서'와 '내가 가진 정보가 가장 적은 순서'로 목록을 만들어 보세요."},
  "3-2":{th:["kerr","explore"],gap:"'A를 바라며 B를 보상하기'의 경고처럼, 실험 건수를 그대로 KPI로 두면 실험을 하는 것 자체가 목표가 되고 운영 개선으로 이어지는지는 보이지 않습니다.",imp:"실험 KPI를 정할 때 '실험 수' 대신 '현업으로 넘어간 수'와 '실패에서 배운 기록'을 함께 세어 보세요."},
  "3-3":{th:["situational","adaptive"],gap:"상황적 리더십에서 능력은 있으나 자신감이 흔들리는 사람에게 필요한 것은 지원이지 면제가 아닙니다. 목표에서 빼 주면 불안은 달래지만 전환에서 혼자 뒤처지게 됩니다.",imp:"불안을 말하는 리더에게는 목표를 빼 주는 대신, 가장 작은 첫 단계와 그 방식을 정할 권한을 함께 주세요."},
  "3-4":{th:["goal","trust"],gap:"신뢰의 세 요소로 보면, 선배의 경험을 존중하는 것은 선의를, 바꿀 것을 이유와 함께 바꾸는 것은 진실성을 보여 줍니다. 초안을 통째로 맡기면 선의는 보이지만 팀 목표와의 연결이 빠집니다.",imp:"선배의 작년 KPI를 출발점으로 인정하고, 바꿀 항목마다 '왜 바뀌는지'를 한 줄씩 적어 함께 보세요."},
  "3-5":{th:["kerr","lmx"],gap:"예방을 건수로 세면 'A를 바라며 B를 보상하기'의 함정처럼 건수 채우기가 생깁니다. 옛 동료에게 맡길 때 이유를 설명하지 않으면 다른 리더들은 '안쪽 사람' 대우로 읽습니다(LMX).",imp:"측정하기 어려운 일은 건수 대신 '질을 보는 근거'를 정하고, 가까운 사람에게 맡길 때는 맡긴 이유를 다른 리더들에게도 같은 말로 설명하세요."},
  "3-6":{th:["ocb","equity"],gap:"수주액 하나는 보이는 성과만 남기고, 제안서를 쓴 사람의 보이지 않는 기여를 지웁니다. 형평 이론으로 보면, 일한 사람과 인정받는 사람이 다를 때 노력은 줄어듭니다.",imp:"숫자 하나로 정리하고 싶을 때, 그 숫자 뒤에서 실제로 일한 사람의 이름이 기록에 남는지 확인하세요."},
  "3-8":{th:["justcult","hro"],gap:"공정 문화와 고신뢰 조직은 '알게 된 즉시 멈추고 알리는 것'을 첫 원칙으로 둡니다. 범위를 먼저 파악하려고 기다리면 신고 시한을 넘기고, 한 사람을 공개적으로 지목하면 다음 실수가 숨겨집니다.",imp:"사고를 알게 되면 '멈추고, 알리고, 그다음에 조사한다' 순서를 지키세요. 공개 자리에서는 사람이 아니라 절차의 빈틈을 말하세요."},
  "3-9":{th:["voice","psysafe"],gap:"조직 침묵 연구에 따르면 구성원은 의견을 낸 뒤 리더가 실제로 무엇을 했는지를 보고 다음 발언을 정합니다. 결과를 돌려주지 않거나 미루면 '말해도 바뀌는 게 없다'를 배웁니다.",imp:"설문 결과는 2주 안에 팀 전체에 돌려주고, '이번에 고칠 한 가지'와 날짜를 함께 말하세요."},
  "4-2":{th:["explore","jdr"],imp:"칸을 나누기 전에 업무량 70 이상인 모듈부터 표시하고, 아낀 시간을 새 일로 채우기 전에 부하를 먼저 덜어 내세요. 나눈 기준은 공지에 한 줄로 적으세요."},
  "4-3":{th:["conflict","fairproc"],gap:"갈등 대처 방식으로 보면, 이미 알린 안이라며 그대로 밀고 가는 것은 '경쟁'입니다. 공정한 프로세스의 참여와 설명이 빠지면 결정은 지켜도 선배와 그 동맹의 실행 의지를 잃습니다.",imp:"공개 반대를 받으면 결정을 바꾸기 전에 '어디가 안 맞는지'를 먼저 묻고, 결정 기준을 다시 말한 뒤 따로 이어서 듣는 자리를 잡으세요."},
  "4-5":{th:["negot","trust"],gap:"원칙 협상은 객관적 기준으로 합의하라고 합니다. 잘못 나간 추정치를 바로잡지 않은 채 일을 더 얹거나 양보하면, 근거 없는 숫자가 다음 협상의 출발점이 되고 진실성도 흔들립니다.",imp:"숫자가 틀렸다면 협상 전에 먼저 바로잡고, 실측 방법을 상대와 함께 정해 객관적 기준으로 삼으세요."},
  "6-1":{th:["negot","jdr"],gap:"원칙 협상에서 객관적 기준은 실측으로 확인된 절감입니다. 신규 과제를 얹어 고객과 재무를 지키면, 직무 요구-자원 모델로 볼 때 이미 바쁜 모듈의 요구만 늘어납니다.",imp:"협상 전에 우리 쪽 최선의 대안과 물러설 선을 숫자로 적어 두고, 신규 과제를 얹을 때는 어느 모듈이 그 일을 하는지부터 확인하세요."},
  "6-1p":{th:["negot"],gap:"원칙 협상은 협상 전에 물러설 선과 최선의 대안을 정해 두라고 합니다. 적어 두지 않으면 압박 속에서 그 자리에서 정하게 됩니다.",imp:"압박이 예상되는 자리에 들어가기 전에, 어디까지 물러설지를 미리 적어 두세요. 그 자리에서 정하면 많이 내주게 됩니다."},
  "5-4":{th:["ocb","conflict"],gap:"보이지 않는 기여 관점에서, 복구만 상을 받으면 예방은 기여로 남지 않습니다. 갈등 대처 방식으로 보면 한쪽 손을 들어 주는 것은 '경쟁'이고, 두 기여를 함께 보는 것이 '협력'입니다.",imp:"포상 후보를 낼 때 복구처럼 눈에 띄는 기여와 예방처럼 안 보이는 기여를 같은 표에 나란히 놓고, 판단 기준을 두 사람에게 먼저 알리세요."},
  "8-1a":{th:["manageup","negot"],gap:"상사·본사와 일하기 관점에서, 공문을 그대로 받으면 팀장은 전달자가 됩니다. 본사의 목표(효율화 실적)를 인정하면서 확인된 숫자로 대안을 내는 것이 원칙 협상의 방식입니다.",imp:"본사 요청을 받으면 수용·거절 전에 상대가 얻고 싶은 것(효율화 실적)을 확인하고, 확인된 숫자와 대안을 들고 협의를 요청하세요."},
  "8-1b":{th:["explore","jdr"],gap:"탐색과 활용, 직무 요구-자원 모델 모두 '무엇을 멈출지'를 정하라고 합니다. 고르게 덜어 내면 공평해 보이지만, 어느 모듈도 실제로 부담이 줄지 않습니다.",imp:"자원이 줄면 '고르게 덜기'보다 멈출 일 목록을 먼저 만들고, 운영과 안전을 지키는 순서를 정하세요."},
  "8-1c":{th:["fairproc","bridges"],gap:"공정한 프로세스의 '설명'과 변화 관리의 '무엇이 끝나는지 먼저 말하기'가 빠지면, 줄어든 결과만 남고 그 이유는 소문이 채웁니다.",imp:"줄인 결과를 알릴 때 무엇이 끝나는지, 왜 그렇게 정했는지, 앞으로 무엇을 기대하면 되는지를 순서대로 말하세요."},
  "6-3":{th:["intent","jdr"],gap:"의도를 밝혀 맡기기 관점에서, 모듈 리더를 건너뛰면 그의 권한이 비고 다음부터 구성원은 팀장에게 바로 옵니다. 직무 요구-자원 모델로 보면 새벽 접속은 자원이 바닥나고 있다는 신호이기도 합니다.",imp:"구성원의 문제를 직접 풀고 싶을 때, 모듈 리더를 먼저 거쳐 그가 해결하게 돕고, 구성원에게는 결과를 함께 확인하자고 약속하세요."},
  "4-4":{th:["psysafe","ocb"],gap:"심리적 안전감 관점에서, 익명 글을 모듈 안에서 알아서 정리하게 맡기면 글쓴이가 드러날 위험이 커지고, 다음 문제는 익명으로도 올라오지 않습니다. 기여 표기 규칙이 없으면 같은 일이 반복됩니다.",imp:"익명 제보가 오면 글쓴이를 찾지 말고 사실을 확인할 통로를 여세요. 같은 일이 반복되지 않게 기여 표기 규칙을 공개하세요."},
  "6-2":{th:["fairproc","bridges"],imp:"같은 결정을 설명할 때 상대별로 '무엇이 바뀌나, 왜, 다음에 무엇을 하면 되나' 세 줄을 따로 써 보세요."},
  "9-7":{th:["voice","psysafe"],gap:"조직 침묵 연구에 따르면 구성원은 의견을 낸 뒤 리더가 실제로 무엇을 했는지를 보고 다음 발언을 정합니다. 두 번째 설문에서도 반응이 늦으면 답한 사람들은 지칩니다.",imp:"두 번째 설문에서는 지난번 약속을 지켰는지부터 보고하고, 지키지 못한 것은 이유를 말하세요."},
  "R3-0":{th:["jdr","fairproc"],imp:"분기가 바뀌면 지난 분기에 부하가 쌓인 모듈부터 덜어 내고, 바꾼 칸과 이유를 다시 알리세요."},
  "R3-1a":{th:["hro","intent"],gap:"고신뢰 조직의 '전문성 존중'은 위기 때 직급이 아니라 현장을 가장 잘 아는 사람에게 판단을 맡기라고 합니다. 팀장이 직접 지시하면 지휘가 둘이 되고, 고객 통지처럼 팀장만 할 수 있는 일이 비게 됩니다.",imp:"위기에서는 '누가 지휘하는가'를 먼저 한 문장으로 선언하고, 팀장인 나는 지휘자가 할 수 없는 일(고객·본사 소통, 자원 확보)을 맡으세요."},
  "R3-1b":{th:["hro","outcome"],gap:"고신뢰 조직의 '단순화 거부'는 '센서 오작동 같다'는 편한 설명으로 결론 내지 말라고 합니다. 인터록을 우회하고 아무 일이 없었더라도, 결과 편향을 걷어 내면 감수한 위험은 그대로입니다.",imp:"납기 압박 속 안전 판단은 '확인되지 않은 위험은 있는 것으로 본다'를 기준선으로 미리 정해 두세요. 고객에게는 세운 이유와 재가동 기준을 함께 알리세요."},
  "9-4":{th:["negot","trust"],gap:"신뢰의 세 요소에서 진실성은 불리한 사실을 먼저 인정하는 데서 보입니다. 원칙 협상은 숫자 오류와 계약 조건을 분리하고 검증 방법부터 맞추라고 합니다. 바로 깎아 주거나 답을 미루면 둘 중 하나를 잃습니다.",imp:"고객이 숫자로 압박할 때는 오류를 인정하는 말과 조건을 양보하는 말을 분리하고, 검증 방법부터 함께 정하자고 제안하세요."},
  "11-4":{th:["trust","intent"],gap:"신뢰의 세 요소로 보면, 선배가 내민 손에 답하지 않거나 떠나려는 사람을 건너뛰면 선의를 의심받습니다. 맡길 것과 책임질 것을 말로 나누는 것이 의도를 밝혀 맡기기입니다.",imp:"선배 리더와의 관계가 바뀌는 순간에는 결론을 정하기 전에 먼저 그의 이야기를 듣고, 맡길 것과 내가 책임질 것을 말로 나눠 약속하세요."},
  "6-4a":{th:["manageup","kerr"],gap:"상사·본사와 일하기 관점에서, 지침을 그대로 따르거나 미루기보다 지침의 목표를 지키면서 팀 기준이 지키던 것을 살리는 대안을 내는 편이 낫습니다. 그대로 따르면 'A를 바라며 B를 보상하기'처럼 예방하던 사람들의 몫이 지표에서 사라집니다.",imp:"위에서 기준이 바뀌면 바로 따르거나 거부하기 전에, 그 기준이 바라는 것과 우리 기준이 지키던 것을 둘 다 살리는 안을 들고 협의하세요."},
  "6-4b":{th:["procjust","bridges"],gap:"절차 공정성의 일관성 규칙과 이 과정의 규칙(공개한 기준을 바꾸면 다시 알린다)은 평가 전에, 모두에게 같은 말로 알리라고 요구합니다. 나중에 알리거나 리더마다 다르게 전하면 평가에서 처음 아는 사람이 생깁니다.",imp:"공개한 기준을 바꿀 때는 무엇이, 왜, 언제부터 바뀌는지를 모두에게 같은 날 같은 말로 알리고, 질문을 받을 창구를 열어 두세요."},
  "12-3a":{th:["rater","procjust"],gap:"평가 오류 연구는 근거 없는 등급에서 후광·유사성 효과가 커진다고 봅니다. 의견서를 그대로 받거나 숫자 순서로 정하면 빠르지만, 이의제기 때 설명할 근거가 없습니다.",imp:"남이 매긴 등급을 확정할 때는 등급마다 관찰 사실 한 줄이 붙어 있는지 확인하고, 없으면 돌려보내 근거를 받으세요."},
  "12-3":{th:["rater","ocb"],imp:"등급을 정하기 전에 1년 치 관찰 기록을 기준별로 다시 펼치고, 1월~6월의 일부터 보세요. 최근 효과를 줄이는 가장 쉬운 방법입니다."},
  "12-4":{th:["procjust","trust"],imp:"이의제기를 받으면 '어느 기준의 어느 근거가 다르게 보이는지'부터 묻고, 다시 볼 날짜를 약속하세요."},
  "12-6":{th:["fairproc","procjust"],imp:"평가 공지를 보내기 전에 '기준, 근거, 이의제기 절차' 세 가지가 들어 있는지 확인하세요."}
 };
 window.THEORY=TH;

 /* Round 3 코칭 노트 (성적표 형식에 맞춰 새로 씀. 플레이 때 선택지 글자가 섞이므로 글자 대신 선택지 내용으로 가리킨다) */
 const C3={
  "R3-0":{sit:"4분기를 앞두고 여력 배분을 다시 조정합니다.",pt:"3분기 동안 쌓인 부하를 어디서 덜어 낼 것인가.",ld:"좋은 리더라면 부하가 쌓인 모듈부터 덜어 내고, 바꾼 칸과 그 이유를 팀에 다시 알립니다.",best:[]},
  "R3-1a":{sit:"새벽 3시, 해외 공장 3번 라인의 안전 인터록 센서 값이 시스템 기록과 맞지 않습니다. 1등급 장애 절차는 먼저 지휘자 한 명을 정하라고 합니다.",pt:"현장을 가장 잘 아는 사람에게 지휘를 맡길 것인가, 내가 직접 잡을 것인가.",ld:"좋은 리더라면 현장을 가장 잘 아는 강태식에게 지휘를 맡기고, 자신은 고객 통지와 위쪽 보고처럼 지휘자가 할 수 없는 일을 맡습니다. 원격으로 직접 지시하면 빠르게 보이지만 현장 리더의 역할이 비고, 모르는 설정을 건드릴 위험이 생깁니다.",best:["A"]},
  "R3-1b":{sit:"현장은 센서 오작동 같다고 합니다. 납기는 내일 아침입니다.",pt:"확인되지 않은 안전 신호 앞에서 납기와 안전 중 무엇을 기준선으로 둘 것인가.",ld:"좋은 리더라면 안전 신호가 확인되지 않은 동안에는 라인을 세우고 절차대로 원인을 확인합니다. 이상 구간만 세우는 판단도 위험을 줄이지만 같은 센서를 쓰는 구간이 남습니다. 인터록을 우회하고 승인을 사후로 받는 것은 넘어서는 안 되는 선(현장 안전)을 넘는 결정입니다.",best:["A","B"]},
  "9-4":{sit:"헬씨푸드 임원이 상반기 가용성을 99.4%가 아니라 98.7%로 다시 계산했다며 계약 조건을 다시 보자고 합니다.",pt:"숫자의 오류와 계약 조건을 한꺼번에 내줄 것인가.",ld:"좋은 리더라면 틀린 숫자는 먼저 인정하되, 재산정을 양쪽이 함께 검증하고 계약 조건은 근거 없이 바꾸지 않습니다. 다툼을 계약 부속서의 산식 정의로 좁히는 것도 객관적 기준을 세우는 방법입니다. 운영비를 바로 깎아 주면 고객은 누그러지지만 승인 없이 팀 이익을 내준 셈이고, 답을 미루면 공식 압박으로 번집니다.",best:["A","D"]},
  "11-4":{sit:"11월, 1년 동안 부딪쳐 온 강태식과의 관계가 갈림길에 섭니다.",pt:"선배가 내민 손을 어떻게 잡을 것인가, 떠나려는 선배를 어떻게 대할 것인가.",ld:"좋은 리더라면 선배가 내민 제안을 받아 권한과 책임을 함께 맡기거나 공식 목표로 올려 기여가 기록되게 합니다. 선배가 떠나려 한다면 붙잡을 방법보다 무엇이 틀어졌는지를 먼저 듣고, 동시에 모듈이 흔들리지 않게 대비합니다. 본인을 건너뛰고 핵심 인력부터 따로 만나면 남은 사람들에게 '떠나는 사람은 이렇게 대한다'는 신호를 줍니다.",best:[],bestCase:{"0":["A","B"],"1":["A","B"]}},
  "6-4a":{sit:"인사팀이 하반기 평가부터 'AI 활용 효과'를 등급 기준에 20% 이상 반영하라는 지침을 보냈습니다. 3월에 합의한 기준과 다릅니다.",pt:"위에서 바뀐 기준을 연초의 약속과 어떻게 맞출 것인가.",ld:"좋은 리더라면 지침은 지키되, 팀의 기준이 지키려던 기여(예방 등)가 사라지지 않도록 점검을 돕는 자동화도 AI 효과로 치자고 인사팀과 협의합니다. 다른 항목에서 고르게 덜어 내면 예방하던 사람들의 몫이 깎이고, 적용을 내년으로 미루면 회사 지침과 부딪칩니다.",best:["B"]},
  "6-4b":{sit:"바뀐 지침을 팀에 언제, 어떻게 알릴지 정합니다.",pt:"기준이 바뀌었다는 사실을 평가 전에 아느냐, 평가에서 처음 아느냐.",ld:"좋은 리더라면 바뀌는 항목과 이유, 적용 시점을 평가 전에 전원에게 다시 알리고 합의서를 고칩니다. 모듈 리더에게 전달을 맡기면 사정에 맞게 설명할 수 있지만 모듈마다 말이 달라질 수 있습니다. 평가 공지 때 한 번에 알리면 평가에서 처음 듣는 사람이 생깁니다.",best:["A"]},
  "12-3a":{sit:"평가 대상 30명 가운데 23명은 모듈 리더들이 낸 의견서를 바탕으로 정합니다.",pt:"속도와 근거, 리더 존중과 공정성 사이.",ld:"좋은 리더라면 리더들의 의견서를 존중하되 관찰 사실을 확인한 뒤 등급을 확정합니다. 그대로 받으면 빠르지만 '친한 사람이 잘 받는다'는 말이 남고, KPI 달성률 순서로 정하면 숫자에 없는 기여가 사라집니다.",best:["A"]},
  "12-3":{sit:"모듈 리더 5명과 구성원 2명을 직접 평가했습니다.",pt:"인상이 아니라 근거로 등급을 정했는가.",ld:"좋은 리더라면 연초에 공개한 기준별로 관찰한 사실을 근거로 등급을 정하고, 최근 일이나 가까운 관계에 끌리지 않았는지 점검합니다.",best:[]},
  "12-4":{sit:"평가 결과에 이의제기가 들어왔습니다.",pt:"이의제기를 공격으로 받을 것인가, 절차로 받을 것인가.",ld:"좋은 리더라면 이의제기를 절차의 일부로 받아 기준과 근거를 다시 보여 주고, 잘못이 있으면 고칩니다.",best:[]},
  "12-6":{sit:"평가 결과를 팀 전체에 알리는 글을 썼습니다.",pt:"결과만 알릴 것인가, 기준과 다음 절차까지 알릴 것인가.",ld:"좋은 리더라면 결과만 알리지 않고 어떤 기준으로 정했는지, 내년에 무엇이 바뀌는지, 이의가 있으면 어떻게 하면 되는지를 함께 씁니다.",best:[]}
 };
 window.COACH3=C3; /* 하네스와 v3 성적표가 쓰는 COACH는 건드리지 않는다 */

 /* ---------- 결정 전에 찾아본 기록 ---------- */
 const curScene=()=>{try{return CONTENT[G.idx]||{};}catch(e){return {};}};
 const roundOf=()=>{try{return G.round||((G.month||1)<=3?1:(G.month<=9?2:3));}catch(e){return 0;}};
 window.LEX_TH=TH; /* 6단계: 성적표 요약의 "다음 행동"이 장면별 이론의 다음 행동을 읽는다 */
 function noteLookup(eid){
  try{const s=curScene();if(!s.id||!TH[s.type==="inbox"?"inbox":s.id]||G.review||/^(ROUND|V3END|FINALE)/.test(s.id))return;
   const sid=s.type==="inbox"?"inbox:"+s.id:s.id;G.lk=G.lk||[];if(!G.lk.some(x=>x.s===sid&&x.e===eid))G.lk.push({s:sid,e:eid,r:roundOf()});}catch(e){}
 }
 const lookedFor=(id,r)=>{const L2=(G.lk||[]).filter(x=>(x.s===id||(id==="inbox"&&/^inbox:/.test(x.s)&&(!r||x.r===r))));return [...new Set(L2.map(x=>x.e))];};
 window.lexLookedFor=lookedFor;

 /* ---------- 사전 창 ---------- */
 let win=null,cur=null,ctx=[],lastFocus=null;
 const catName=k=>(CATS.find(c=>c[0]===k)||[,""])[1];
 function build(){
  if(win)return win;
  win=document.createElement("div");win.id="lexw";win.hidden=true;win.setAttribute("role","dialog");win.setAttribute("aria-modal","true");win.setAttribute("aria-labelledby","lexwt");
  win.innerHTML=`<div class="lx-win"><div class="lx-tb"><span class="lx-dots" aria-hidden="true"><i></i><i></i><i></i></span><b id="lexwt">리더십 사전</b><span class="lx-n">${Object.keys(L).length}개 항목</span><button type="button" class="lx-x">닫기</button></div>
   <div class="lx-body"><aside class="lx-side"><label class="lx-s"><span class="sr">항목 찾기</span><input type="search" placeholder="찾기: 위임, 공정, 협상, 평가…" autocomplete="off"></label><div class="lx-list" role="list"></div></aside>
   <article class="lx-art" tabindex="-1"></article></div></div>`;
  document.body.appendChild(win);
  win.querySelector(".lx-x").addEventListener("click",close);
  win.addEventListener("click",e=>{if(e.target===win)close();const b=e.target.closest("[data-lexgo]");if(b){show(b.dataset.lexgo,true);}const bk=e.target.closest(".lx-back");if(bk)win.classList.remove("lx-reading");});
  win.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();close();}if(e.key==="Tab")trap(e);});
  win.querySelector("input").addEventListener("input",list);
  return win;
 }
 function trap(e){const f=[...win.querySelectorAll("button,input,[tabindex]:not([tabindex='-1'])")].filter(x=>x.offsetParent);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){z.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===z){a.focus();e.preventDefault();}}
 function item(id){const x=L[id];return `<button type="button" role="listitem" class="lx-it${cur===id?" on":""}" data-lexgo="${id}"><b>${esc(x.name)}</b><small>${esc(x.en)}</small></button>`;}
 function list(){
  const q=(win.querySelector("input").value||"").trim().toLowerCase();const box=win.querySelector(".lx-list");
  const hit=x=>!q||[x.name,x.en,x.def,x.kw,catName(x.cat)].join(" ").toLowerCase().includes(q);
  let h="";
  if(!q&&ctx.length)h+=`<div class="lx-g lx-ctx"><div class="lx-gh">지금 장면과 관련된 항목</div>${ctx.map(item).join("")}</div>`;
  CATS.forEach(([k,n])=>{const ids=Object.keys(L).filter(id=>L[id].cat===k&&hit(L[id]));if(ids.length)h+=`<div class="lx-g"><div class="lx-gh">${n}</div>${ids.map(item).join("")}</div>`;});
  box.innerHTML=h||`<p class="lx-none">'${esc(q)}'와 맞는 항목이 없습니다. 다른 낱말로 찾아보세요.</p>`;
 }
 function show(id,user){
  const x=L[id];if(!x)return;cur=id;if(user)noteLookup(id);
  const a=win.querySelector(".lx-art");
  a.innerHTML=`<button type="button" class="lx-back">← 목록</button><p class="lx-cat">${esc(catName(x.cat))}</p><h2>${esc(x.name)}</h2><p class="lx-en">${esc(x.en)}</p><p class="lx-def">${esc(x.def)}</p>
   <h3>핵심</h3><ul>${x.core.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>
   <h3>이 과정에서는</h3><p>${esc(x.here)}</p>
   <div class="lx-check"><h3>결정 전에 물어볼 것</h3><ul>${x.check.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div>
   <h3>흔한 함정</h3><p>${esc(x.trap)}</p>
   <p class="lx-src"><b>출처</b> ${esc(x.src)}</p>`;
  a.scrollTop=0;win.classList.add("lx-reading");list();
 }
 const chipSeen=new Set(); /* 화면 표시용. 저장하지 않는다 */
 function open(id){
  build();lastFocus=document.activeElement;
  const s=curScene();const key=s.type==="inbox"?"inbox":s.id;ctx=(TH[key]&&!/^(ROUND|V3END|FINALE)/.test(s.id||""))?TH[key].th.slice():[];
  win.hidden=false;win.querySelector("input").value="";
  const first=id||ctx[0]||cur||Object.keys(L)[0];
  /* 6단계: 칩으로 연 이론은 '눌러 봄' 표시만 바꾸고 사전 열람으로 세지 않는다. 열람은 사전 목록에서 직접 누른 것만 센다(show(id,true)) */
  if(id){const k=s.type==="inbox"?"inbox":s.id;if(k)chipSeen.add(k+"|"+id);}
  show(first,false);if(!id)win.classList.remove("lx-reading");
  list();(id?win.querySelector(".lx-art"):win.querySelector("input")).focus();
 }
 function close(){if(!win)return;win.hidden=true;
  /* 6단계: 칩의 '읽음' 표시를 바로 반영한다 */
  let lx=null;try{lx=lastFocus&&lastFocus.getAttribute&&lastFocus.closest&&lastFocus.closest(".lxstrip")?lastFocus.getAttribute("data-lex"):null;const o=document.querySelector("#view .lxstrip");if(o){o.remove();addStrip();}if(lx){const b=document.querySelector(`#view .lxstrip [data-lex="${lx}"]`);if(b)lastFocus=b;}}catch(e){}
  try{lastFocus&&lastFocus.focus();}catch(e){}}
 window.openLex=open;window.closeLex=close;
 document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-lex]");if(!b)return;e.preventDefault();open(b.dataset.lex||null);});

 /* ---------- 메뉴바 버튼 ---------- */
 const _db=drawBar;
 drawBar=function(){const r=_db.apply(this,arguments);
  try{const res=document.getElementById("res");if(res&&!res.querySelector(".lexbtn")){const b=document.createElement("button");b.type="button";b.className="lexbtn";b.setAttribute("data-lex","");b.innerHTML='<span class="lx-ic" aria-hidden="true"></span><span class="l">리더십 </span>사전';
   const m=res.querySelector(".dk-menu");if(m)res.insertBefore(b,m);else res.appendChild(b);}}catch(e){}
  return r;};

 /* ---------- 결정 장면: 결정 전에 점검해 보기 ---------- */
 const NOOPT=/^(tasks|kpipick|alloc|write3|realloc|evalc|appeal|write)$/;
 const TH_MAIL={M01:["manageup","negot"],M03:["monkey","intent"],M06:["hro","justcult"],M08:["intent","situational"],M09:["voice","psysafe"],M11:["monkey","hro"],M13:["monkey","situational"],M14:["procjust","fairproc"],M16:["hro","intent"],
  M21:["outcome","kerr"],M22:["negot","trust"],M24:["explore","equity"],M25:["explore","equity"],M26:["fairproc","equity"],M37b:["ocb","procjust"],M39:["jdr","voice"],M41:["justcult","hro"]};
 function addStrip(){
  const s=curScene();if(!s.id||/^(ROUND|V3END|FINALE)/.test(s.id))return;
  const key=s.type==="inbox"?"inbox":s.id;let T=TH[key];if(!T)return;
  /* 피드백 4단계 #36: 받은편지함은 지금 열어 둔 메일에 맞는 이론을 보여 준다 */
  if(s.type==="inbox"){const mid=(s._st||{}).sel;if(mid&&TH_MAIL[mid])T=Object.assign({},T,{th:TH_MAIL[mid]});}
  const V=document.getElementById("view");if(!V||V.querySelector(".lxstrip"))return;
  let at=null,parent=null;
  if(s.type==="inbox"){const ask=V.querySelector(".reader .ask");if(ask){parent=ask;at=ask.firstChild;}}
  else{const o=V.querySelector(".opts");
   if(o){const p=o.previousElementSibling;at=p&&(p.classList.contains("dkm-q")||p.classList.contains("dkc-lab"))?p:o;parent=at.parentNode;}
   else if(NOOPT.test(s.type||"")){const f=V.querySelector(".foot");if(f){at=f;parent=f.parentNode;}}}
  if(!parent)return;
  const d=document.createElement("div");d.className="lxstrip";
  const seen=lookedFor(key);
  /* 6단계: 이 장면과 가장 관련 있는 이론(목록의 첫 항목)을 강조하고, 한 번 눌러 본 이론은 '읽음'으로 바꾼다 */
  const chip=(id,i)=>{const v=seen.includes(id)||chipSeen.has(key+"|"+id);return `<button type="button" class="lxchip${i===0?" lx-key":""}${v?" seen":""}" data-lex="${id}"${i===0?' aria-describedby="lxkeyl"':""}>${esc(L[id].name)}${v?'<span class="lx-read">읽음</span>':""}</button>`;};
  d.innerHTML=`<span class="lxs-h">결정 전에 점검해 보기</span>${T.th.filter(id=>L[id]).map((id,i)=>i===0?`<span class="lx-keyw"><span class="lx-keyl" id="lxkeyl">이 장면과 가장 관련 있는 이론</span>${chip(id,0)}</span>`:chip(id,i)).join("")}`;
  parent.insertBefore(d,at);
 }
 const _sh=shell;
 shell=function(){const r=_sh.apply(this,arguments);try{addStrip();}catch(e){}return r;};

 /* ---------- 성적표: 이론으로 점검하기 ---------- */
 const chipsOf=ids=>ids.filter(id=>L[id]).map(id=>`<button type="button" class="lxchip" data-lex="${id}">${esc(L[id].name)}</button>`).join("");
 const short=t=>{t=strip(val(t)).replace(/["“”]/g,"").replace(/[.。]\s*$/,"").trim();return t.length>46?t.slice(0,46).replace(/\s+\S*$/,"")+"…":t;};
 /* c: {id, opts, mine, best, match}, ldText: 좋은 리더라면(글자 치환을 마친 문장) */
 window.theoryBox=function(c,ldText){
  const T=TH[c.id]||{th:[],imp:""};const ids=T.th||[];const first=L[ids[0]];
  const mineO=(c.opts||[]).find(o=>o.k===c.mine);const gl=mineO&&mineO.gl||[];
  const verdict=c.match==null?"":c.match?`<span class="pill good">이론이 권하는 방향과 같음</span>`:`<span class="pill bad">이론이 권하는 방향과 다름</span>`;
  let gap="";
  if(mineO&&c.match===true)gap=`이론이 권하는 방향과 같습니다.${gl[1]?` 이 선택에도 '${esc(gl[1])}'${jo(gl[1],"이라는","라는")} 대가가 있습니다. 그 대가를 줄이려고 무엇을 했는지, 또는 다음에 무엇을 더 할 수 있을지 돌아보세요.`:""}`;
  else if(mineO&&c.match===false)gap=`${gl[0]&&gl[1]?`내 선택은 '${esc(gl[0])}'${jo(gl[0],"을","를")} 얻는 대신 '${esc(gl[1])}'${jo(gl[1],"을","를")} 감수했습니다. `:""}${T.gap?esc(T.gap):first?`<b>${esc(first.name)}</b>의 관점에서 보면, ${esc(first.trap)}`:""}`;
  const checks=(c.match==null)?`<div class="th-row"><span class="th-l">스스로 점검하기</span><div><p class="note" style="margin:0 0 4px">${mineO?"이 장면은 맞고 틀림을 가리지 않습니다. ":""}아래 질문에 답해 보며 내 결정을 돌아보세요.</p><ul class="th-ck">${ids.slice(0,2).map(id=>L[id]?`<li>${esc(L[id].check[0])}</li>`:"").join("")}${first?`<li>${esc(first.check[1])}</li>`:""}</ul></div></div>`:"";
  const seen=lookedFor(c.id);
  return `<div class="thbox"><div class="th-h"><span class="seclab">이론으로 점검하기</span><span class="th-chips">${chipsOf(ids)}</span></div>
   ${ldText?`<div class="th-row"><span class="th-l">이론이 권하는 행동</span><p>${ldText}</p></div>`:""}
   ${mineO?`<div class="th-row"><span class="th-l">내 행동</span><p>“${esc(short(mineO.t))}” ${verdict}</p></div>`:""}
   ${gap?`<div class="th-row th-gap"><span class="th-l">차이</span><p>${gap}</p></div>`:""}
   ${checks}
   ${T.imp?`<div class="th-row th-imp"><span class="th-l">다음에 해 볼 행동</span><p>${esc(T.imp)}</p></div>`:""}
   ${seen.length?`<p class="th-lk">결정 전에 사전에서 ${seen.map(id=>`「${esc((L[id]||{}).name||id)}」`).join(" ")}을(를) 찾아봤습니다.</p>`:""}</div>`;
 };
 /* 요약 탭: 이번 라운드를 이론으로 */
 window.theorySummary=function(cards){
  const miss={};cards.filter(c=>c.match===false).forEach(c=>{((TH[c.id]||{}).th||[]).forEach(id=>{miss[id]=(miss[id]||0)+1;});});
  const top=Object.entries(miss).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]).filter(id=>L[id]);
  const withTh=cards.filter(c=>TH[c.id]);const looked=withTh.filter(c=>lookedFor(c.id).length).length;
  return `<div class="secbox thsum"><div class="seclab">이론으로 본 이번 라운드</div>${top.length?`<p>이론이 권하는 방향과 다르게 간 결정에 가장 많이 걸린 이론은 ${top.map(id=>`<button type="button" class="lxchip" data-lex="${id}">${esc(L[id].name)}</button>`).join(" ")}입니다.</p><p class="note">${esc(L[top[0]].trap)}</p>`:`<p>판정한 결정에서 이론이 권하는 방향과 크게 어긋난 곳은 없었습니다. 결정 카드의 '다음에 해 볼 행동'으로 한 단계 더 나아가 보세요.</p>`}
   ${looked?`<p class="note">결정 전에 리더십 사전 목록에서 이론을 직접 찾아본 결정: ${withTh.length}개 중 ${looked}개 (${withTh.filter(c=>lookedFor(c.id).length).map(c=>esc((window.SC_NICK&&SC_NICK[c.id])||strip(val((c.sc||{}).title)||c.id))).join(", ")}).</p>`:""}</div>`;
 };

 /* ---------- Round 3 결산 첫 페이지 ---------- */
 const AR=x=>Array.isArray(x)?x:[];
 window.theoryYearPage=function(){
  const C=Object.assign({},C3,window.COACH||{});const i0=CONTENT.findIndex(x=>x.id==="GATE3"),i1=CONTENT.findIndex(x=>x.id==="V3END");
  const scenes=CONTENT.slice(i0<0?0:i0,i1<0?G.idx:i1);const dec0=(G.rs&&G.rs[3]&&G.rs[3].dec)||0;const ds=(G.decisions||[]).slice(dec0);
  const cards=[];
  scenes.forEach(sc=>{const id=sc.id;if(!TH[id])return;const co=C[id]||{};
   if(!AR(sc.options).length&&!AR(sc.cases).length){cards.push({id,sc,opts:[],mine:null,best:[],match:null,co});return;}
   const caseIds=AR(sc.cases).map(c=>c&&c.id).filter(Boolean);const dd=ds.filter(x=>x.scene===id||caseIds.includes(x.scene));const d=dd[dd.length-1];if(!d)return;
   let opts=AR(sc.options);const ci=(G.cases||{})[id];if(!opts.length&&sc.cases){const cc=AR(sc.cases)[ci];opts=cc?AR(cc.options):[];}
   const best=(co.bestCase&&co.bestCase[ci])||co.best||[];
   let match=best.length&&!(opts.length&&opts.every(o=>best.includes(o.k)))?best.includes(d.choice):null;
   /* 피드백 6단계 #38: 이론이 권하는 선택이 모두 토큰 부족으로 잠겨 있었으면 판정하지 않는다 */
   const tkLocked=match===false&&Array.isArray(d.tkLock)&&best.every(k=>d.tkLock.includes(k));if(tkLocked)match=null;
   cards.push({id,sc,opts,mine:d.choice,best,match,co,tkLocked});});
  const judged=cards.filter(c=>c.match!=null),mN=judged.filter(c=>c.match).length;
  const title=c=>{const t=strip(val(c.sc.title)||"");return t||({"R3-0":"여력 재배분","11-4":"강태식과의 갈림길","12-3":"7명 직접 평가","12-4":"이의제기","12-6":"평가 결과 공지"}[c.id])||c.id;};
  const card=c=>`<details class="dcard"${c.match===false?" open":""}><summary><span class="dt">${esc(title(c))}</span><span class="note">${esc(strip(val(c.sc.when)||""))}</span>${c.match==null?(c.tkLocked?`<span class="pill">판정하지 않음 · 토큰 부족</span>`:""):c.match?`<span class="pill good">이론과 같은 방향</span>`:`<span class="pill bad">이론과 다른 방향</span>`}</summary>
   <div class="dbody">${c.co.sit?`<p><span class="seclab">상황</span><br>${esc(c.co.sit)}</p>`:""}${c.co.pt?`<p><span class="seclab">쟁점</span><br>${esc(c.co.pt)}</p>`:""}${c.tkLocked?`<p class="note">이론이 권하는 선택은 이 결정을 할 때 토큰이 모자라 잠겨 있었습니다. 고를 수 없었던 선택이라 판정에서 뺐습니다.</p>`:""}${theoryBox(c,esc(c.co.ld||""))}</div></details>`;
  return `<div class="eyebrow">결산 · Round 3 결정과 이론</div><h2>4분기의 결정을 이론으로 돌아봅니다</h2>
   <div class="prose"><p>위기, 고객 압박, 바뀐 평가 지침, 연말 평가. 결정마다 근거가 되는 이론과 그 이론이 권하는 행동을 내 선택과 나란히 놓았습니다. 다르게 간 결정은 처음부터 펼쳐 두었습니다.</p></div>
   ${judged.length?`<div class="happen"><span class="label">한눈에</span>판정한 결정 ${judged.length}개 중 <b>${mN}개</b>가 이론이 권하는 방향과 같았습니다.</div>`:""}
   <div class="dlist">${cards.map(card).join("")}</div>${theorySummary(cards)}
   <p class="note">이론 이름을 누르면 리더십 사전이 열립니다. 결산이 끝난 뒤에도 사전은 메뉴바에서 계속 볼 수 있습니다.</p>`;
 };

 /* 스타일 */
 {const l=document.createElement("link");l.rel="stylesheet";l.href="lexicon.css";document.head.appendChild(l);}
})();
