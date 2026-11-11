/* 변환기가 표에서 읽지 못하는 원고 규칙을 장면별로 잇는다. 근거: 03-4 ~ 03-12 원고 */
const S=id=>{for(const s of GEN){if(!s)continue;if(s.id===id)return s;if(s.cases)for(const c of s.cases)if(c.id===id)return c;}throw new Error("장면 없음 "+id);};
const OP=(id,k)=>S(id).options.find(o=>o.k===k);
const ML=(id,m)=>S(id).mail.find(x=>x.id===m);
const C=(c,t)=>({c,t});
const P5OK=()=>{if(G.prom.P5&&G.prom.P5.status==="진행 중")settle("P5",true,"cha");};
const P5NO=()=>{if(G.prom.P5&&G.prom.P5.status==="진행 중")settle("P5",false,"cha");};
const lowLeader=g=>Object.keys(LD).sort((a,b)=>g.trust[a]-g.trust[b])[0];
const T=(p,t,fx,extra)=>Object.assign({p,t,fx},extra||{});
const wpos=(fx,m)=>fx.replace(/\+(\d+)/g,(_,n)=>"+"+Math.max(1,Math.round(+n*m)));

/* 결과 문장 */
for(const id in DONE){let s;try{s=S(id);}catch(e){continue;}if(Array.isArray(s.options))s.options.forEach((o,i)=>{if(DONE[id][i])o.done=DONE[id][i];});}

/* ===== 4월 ===== */
ML("4-1","M22").self=()=>G.f.saw_gap?R("\"추정치이며 실측을 정리 중\"이라고 회신했습니다.","F사만족-1 `f_corrected`"):R("감사하다고 회신했습니다.","F사만족+1 `f_140`");
S("4-3").rel="mfg";OP("4-3","B").dis=g=>g.f.alloc_notice?"":"공지한 기준이 없어 고를 수 없습니다.";
S("4-4").rel="mkt";OP("4-4","A").tw=[T(g=>g.f.yoon_rumor?45:30,"\"팀장이 또 글쓴이를 찾는다\"는 말이 돌았습니다.","안전-3 소문1")];
S("4-5").rel="mkt";
OP("4-5","B").tw=[T(35,"본사 재무가 \"2년 약정은 팀장 권한 밖\"이라고 합니다.","재무-1 `r2_out`"),T(20,"2년 약정 얘기가 F사 쪽에서 긍정적으로 돌고 있습니다.","`r2_good`")];
OP("4-5","C").tw=[T(g=>cell(g,"GROW")>=3?25:0,"신규 과제가 수익이 됐습니다.","재무+3")];
S("4-5").xfx=(S("4-5").xfx||[]).concat([{c:g=>g.f.demo_ready,o:"C",fx:"F사만족+1"}]);
S("4-6").intro=[g=>"장기 미사용 계정 9건, 과다 권한 3건. 시정 기한 2주."+(g.f.acct_open?" 전배자 계정 2건, 전배 후 접속 이력 1회.":""),"문지원: \"이 일정이면 이번 달 다른 일이 다 밀립니다.\""];
S("4-6").enter=g=>[(g.f.acct_open?"안정-3":""),(g.f.audit_late?"안정-1":""),(g.f.audit_ease?"안정+3":""),(g.f.sec_breach_caught?"안정-2":"")].join(" ");
S("4-6").conds=[C(g=>g.f.acct_fixed,"지적 건수에 전배자 항목은 없습니다."),C(g=>g.f.audit_late,"정보보안팀의 어조가 강합니다."),C(g=>g.f.audit_ease,"지적이 절반으로 줄었습니다."),C(g=>g.f.sec_breach_caught,"\"3월 건과 묶어 재점검합니다.\"")];
S("4-6").mods=[{c:g=>g.f.audit_prep,o:"B",d:-15}];S("4-6").common={fit:{A:["보안 준수"],B:["보안 준수"],C:["보안 준수"]}};S("4-6").rel="src";
const IV=(id,k)=>S(id).leaders.find(r=>r.k===k)||S(id).members.find(r=>r.k===k);
["4-7","6-6","7-6","8-7"].forEach(id=>{const r=IV(id,"mfg");const f=r.fx;r.fx=g=>g.f.mfg_bloc?"":val(f);});
IV("10-7","mfg").fx=g=>g.f.mfg_exit?"":"mfg+2";
IV("4-7","mfg").line=g=>g.f.mfg_bloc?"할 말 없어.":"회의 때 말이 좀 셌지. 야간 사람 줄 때마다 내가 먼저 서는 거, 알아줬으면 해서.";
IV("4-7","yoon").line=g=>g.f.yoon_double?"2주에 두 군데서 부르네요.":"교육 일정이 또 나왔더라고요. 들어야 하는 건 알아요.";
IV("4-7","kim").line=g=>g.f.night_open?"요즘 잠을 자요.":"괜찮아요. 아마도요.";

/* ===== 5월 ===== */
const a51=S("5-1a");
a51.say=g=>g.f.mfg_bloc?a51._say.filter(x=>x[0]!=="mfg"&&x[0]!=="src"):a51._say;a51._say=a51.say0||[["mkt","6월에 F사 앞에 보여 줄 게 있어야 해요. 데모가 없으면 3차 협상은 가격 얘기만 합니다."],["rd","3명이 8주면 됩니다."],["mfg","야간 경고는 그대로고 감사 후속도 안 끝났어. 돌아가는 게 먼저지."],["src","지적받은 건이 남아 있으면 다음 감사 때 더 크게 돌아옵니다."],["prc","점검표가 47개 항목이에요. 한 사람이 다 보면 여섯 시간이고요. 여기 한 명만 주세요."],["mfg","또 점검표야?"]];
a51.conds=[C(g=>g.f.mfg_bloc,"강태식과 문지원의 자리가 비어 있다. \"일정상 어렵습니다\" 한 줄이 왔다."),C(g=>g.f.r2_measure,"F사와 6월까지 실측 방법을 정하기로 했습니다. 이 일에도 사람이 필요합니다."),C(g=>g.f.r2_more,"F사에 약속한 신규 과제가 데모와 같은 인력을 씁니다."),C(g=>g.f.know_oh_risk,"\"체크리스트를 다 못 본다\"는 말이 떠오른다.")];
OP("5-1a","A").tw=[T(40,"목소리 큰 동맹 쪽으로 기울었습니다.","",{nextMult:1.5}),T(25,"이수진이 점검 시간표를 꺼내자 강태식이 처음으로 물었습니다.","mfg+1 prc+2")];
OP("5-1a","B").fx=g=>g.f.alloc_notice?"":"mfg-2";
OP("5-1a","B").onDone=(g,hit)=>{if(g.f.alloc_notice)g.nextMult=g.f.mfg_bloc?.75:.5;};
OP("5-1a","B").tw=[T(g=>g.f.mfg_bloc?0:35,"점수 매기기가 동맹끼리의 표 대결이 됐습니다.","rd-1 mfg-1")];
OP("5-1a","B").says=g=>g.f.alloc_notice?[]:[["mfg","그 표는 어디에 공지됐죠?"]];
OP("5-1a","C").tw=[T(35,"사흘 사이 양쪽이 따로 찾아왔습니다.","",{nextMult:1.5}),T(30,"서하준과 이수진이 겹치는 작업을 찾아 왔습니다.","성과+1 rd+1 prc+1")];
OP("5-1b","A").sig=g=>cell(g,"GROW")>=5||g.f.r2_more?"③P":"";
OP("5-1b","B").fx=g=>"`q2_stable` "+(g.f.mfg_bloc?"mfg+1 src+1":"mfg+3 src+3")+" rd-3 mkt-3 안정+2 성과-1";
OP("5-1b","B").says=g=>g.f.mfg_bloc?[["mfg","자리에 없었는데 뭘."]]:[];
OP("5-1b","B").tw=[T(35,"6월에 들고 갈 것이 화면 시안뿐입니다.","`demo_none`"),T(25,"야간 경고가 줄어 대기가 조용해졌습니다.","이야기:kim+ `night_less`")];
S("5-1b").rel="mfg";
S("5-2").rel="prc";S("5-2").enter=g=>g.f.q2_prevent?"안정-2 F사만족-2":"안정-3 F사만족-3";
S("5-2").enter2=null;
OP("5-2","A").tw=[T(g=>g.safe<40?60:30,"아무도 입을 열지 않고 \"시스템 문제\"로 끝났습니다.","`pm_empty` 안전-3 안정-1"),T(g=>(g.safe>=60||g.f.know_oh_risk)?100:0,"\"47개를 다 보면 하루가 끝나요. 다들 표시만 해요.\"","`pm_root` 안정+3 이야기:oh+")];
OP("5-2","A").tw2=[{p:30,t:"유 과장: \"그래서 담당자 조치는요?\"",fx:"F사만족-3"}];
S("5-3").rel="prc";
S("5-3").options.forEach(o=>{o.onDone=g=>{if((o.k==="C"||g.f.pm_blame)&&g.safe<40){const m="오 사원은 6월에 표시하지 못한 항목을 말하려다 보내지 않았습니다.";if(!g.unsent.includes(m))g.unsent.push(m);}};});
const m54=S("5-4");m54.pair=["mfg","prc"];m54.rel="mfg";m54.enter=g=>g.f.prevent_doubt?"mfg-2 prc-2":"";
m54.conds2=[C(g=>g.f.pub_prevent&&!g.f.pub_recovery,"공개한 기준에는 예방만 있습니다."),C(g=>g.f.pub_recovery&&!g.f.pub_prevent,"공개한 기준에는 복구만 있습니다."),C(g=>!g.f.pub_prevent&&!g.f.pub_recovery,"공개한 기준에 장애 공로가 없습니다."),C(g=>g.f.pm_blame,"이수진은 이미 경위서를 받은 모듈의 리더입니다.")];
m54.xfx=[{c:g=>g.f.pub_prevent&&!g.f.pub_recovery,o:"A",fx:"prc-3"},{c:g=>g.f.pub_recovery&&!g.f.pub_prevent,o:"B",fx:"mfg-2"}];
OP("5-4","A").says=g=>g.f.pub_prevent&&!g.f.pub_recovery?[["prc","공개하신 기준엔 예방이 있잖아요."]]:[];
OP("5-4","B").says=g=>g.f.pub_recovery&&!g.f.pub_prevent?[["mfg","기준에 없는 걸 왜 끼워요?"]]:[];
OP("5-4","C").tw=[T(40,"7월이 되어도 자리가 잡히지 않았습니다.","`award_defer_bad`"),T(30,"두 사람이 예방과 복구를 함께 적는 양식을 만들어 왔습니다.","`award_form` prc+2 mfg+2")];
OP("5-5","A").after={t:"차 선임이 묻습니다. \"하반기 신규 과제, 제가 설계를 맡을 수 있나요?\"",opts:[{t:"\"맡기겠습니다.\"",fx:"안전+2 사람+1",pr:{id:"P5",text:"하반기 신규 과제 설계를 차 선임에게",to:"차 선임",due:"9월"}},{t:"답하지 않는다. 서하준과 상의가 먼저다.",fx:()=>"rd+1"+(Math.random()<.25?" 이야기:cha-":"")}]};
OP("5-5","A").tw=[T(30,"\"누가 그래요, 이직이요?\" 소문이 본인 귀에 먼저 들어가 있었습니다.","`cha_watched` 안전-2")];
S("5-5").rel="rd";
S("5-6_1").common=S("5-6_1").common||{};S("5-6_2").common=S("5-6_2").common||{};S("5-6_1").rel="rd";S("5-6_2").rel="mkt";
OP("5-6_1","A").sig=g=>g.f.token_audit?"":"③P";OP("5-6_2","A").sig=g=>cell(g,"GROW")>0?"":"③P";
OP("5-6_2","C").tw=[T(30,"유 과장이 \"장애부터 챙기시네요\"라고 임원에게 전했습니다.","`small_c_good`")];

/* ===== 6월 ===== */
const s61=S("6-1");s61.rel="mkt";
s61.enter=g=>[(g.f.q2_demo&&!g.f["c_5-6_B"]?"F사만족+2":""),(g.f.q2_demo&&g.f["c_5-6_B"]?"F사만족-1":""),(g.f.pm_root?"F사만족+2":""),(g.f.pm_blame?"F사만족+1":""),((g.f.small_win||g.f.small_scoped)?"F사만족+1":""),(g.f.sla_met?"F사만족+4":""),(g.f.r2_out?"F사만족-2":""),(g.f.r2_good?"재무+3":""),(g.f.small_c_good?"F사만족+3":"")].join(" ");
s61.conds=s61.conds.filter(c=>!/데모를 띄울 수/.test(c.t)).concat([C(g=>g.f.q2_demo&&!g.f["c_5-6_B"],"데모를 띄울 수 있습니다.")]);
OP("6-1","B").tw=[T(g=>g.f.r2_out?55:35,"본사 재무가 인하분을 어디서 메울지 묻습니다.","재무-2 다음분기⏳-1"),T(25,"우선 협상권이 10-1 대형 수주에서 유리한 조건이 될 것 같습니다.","`ct_first`")];
OP("6-3_1","C").tw=[T(50,"\"괜찮습니다\"로 끝났습니다.","`kim_fragile` B7+20"),T(30,"이틀 쉬겠다며 동료와 순서를 바꿔 왔습니다.","`kim_rest` 사람+2 안전+2")];
S("6-3_1").rel="mfg";S("6-3_2").rel="mfg";
OP("6-4a","C").tw=[T(45,"유예가 승인됐습니다.","`rule_kept`"),T(55,"거절됐습니다. 인사팀 안대로 적용됩니다.","`rule_flat` rd+4 큰변화1")];
const rulePub=g=>{if((g.f.rule_flat||g.f.rule_wide)&&!g.f.rule_pub_done){g.f.rule_pub_done=true;if(!g.pub.includes("AI 활용 효과"))g.pub.push("AI 활용 효과");g.pub=g.pub.filter(x=>x!=="책임감 있는 근무");delete g.f.pub_night;g.f.pub_ai=true;}};
S("6-4a").options.forEach(o=>{o.onDone=rulePub;});
OP("6-4a","B").tw[0].fx="`rule_flat` `~rule_wide` prc-1";S("6-4a").rel="rd";
const b64=S("6-4b");b64.rel="rd";
b64.skip=g=>{rulePub(g);if(g.f.rule_kept||g.f.pub_leaders)return true;if(g.f.planb_kpi){applyFx("`renotice` 안전+2 사람+1");applySig("④L",1,"6-4","재검토 조건");if(Math.random()<.25)applyFx("안전-1 "+lowLeader(g)+"-1",{neg:.5});toast("3월에 적어 둔 재검토 조건대로 다시 알렸습니다.");return true;}return false;};
OP("6-4b","A").tw=[T(25,"\"3월에는 뭐였죠? 또 바뀌나요?\"",g=>"안전-1 "+lowLeader(g)+"-1")];
OP("6-4b","B").tw=[T(40,"모듈마다 설명이 달라졌습니다.","안전-1 `renotice_split`")];
OP("6-4b","C").tw=[T(30,"9월에 알려 보니 다들 인사팀 공지로 이미 알고 있었습니다.","B10-15")];
OP("6-5_1","A").tw=[T(g=>g.f.yoon_silenced?55:35,"\"그것도 결국 제 일을 없애는 거잖아요.\"","안전-2 `~yoon_validator`")];
OP("6-5_1","B").tw=[T(40,"7월에도 미이수로 남았습니다.","`yoon_src_fail` 이야기:yoon-"),T(25,"문지원이 동료와 짝을 지어 이수시켰습니다.","사람+1 이야기:yoon+")];
S("6-5_1").rel="src";S("6-5_2").rel="src";
const pulseA=(scene)=>{OP(scene,"A").tw=[T(30,"고칠 항목에서 빠진 쪽이 \"저희는요?\"라고 묻습니다.",g=>lowLeader(g)+"-2")];OP(scene,"B").tw=[T(40,"모듈마다 대응이 달라지고 있습니다.",g=>"`pulse_split_q"+(g.quarter+1)+"`")];};
pulseA("6-7");pulseA("9-7");pulseA("12-1");

/* ===== 7월: 침묵하는 세계 ===== */
const SIL={M36:[8,"강태식은 9월 야간 인력이 3명 모자란다고 쓰다가 지웠습니다."],M37:[22,"이수진은 실적 보고서에서 모듈 이름이 빠진 일을 물어보려다 보내지 않았습니다."],M38:[36,"윤 책임은 문지원이 병원에 다닌다는 말을 전하려다 보내지 않았습니다."],M39:[50,"김 사원은 근태가 찍히지 않게 야간 경고를 보고 있다고 말하려다 보내지 않았습니다."],M40:[65,"오 사원은 완료율 100%가 사실이 아니라고 말하려다 보내지 않았습니다."],M41:[79,"한 선임은 개인 계정 외부 AI에 F사 문서를 넣은 일을 털어놓으려다 보내지 않았습니다."],M42:[93,"배 책임은 6월 계약이 틀렸다는 의견을 실명으로 쓰다가 지웠습니다."]};
for(const k in SIL){const m=ML("7-1",k);m.need=SIL[k][0];m.unsent=SIL[k][1];}
const i71=S("7-1");i71.title="7월 받은편지함";i71.lead="성수기 첫 월요일입니다. 메시지를 열면 시간이 흐르기 시작합니다.";
i71.onStart=(g,s)=>{const n=s.mail.length;if(n<=8)g.f.quiet_inbox=true;if(n===12){g.f.loud_inbox=true;ach("시끄러운 팀");}if(!s.mail.find(x=>x.id==="M41"))g.f.sec_unknown=true;if(!s.mail.find(x=>x.id==="M40"))g.f.m40_gone=true;};
i71.quiet=g=>g.f.quiet_inbox;
const kimHard=()=>G.cases&&G.cases["6-3"]===0;
Object.defineProperty(ML("7-1","M39"),"body",{get:()=>kimHard()?"대기표에서는 빠졌는데요, 경고 오면 아직 집에서 봐요. 근태는 안 찍히게요.":"저는 나아졌어요. 그런데 제 대기가 옮겨 간 동기가 요즘 근태 안 찍히게 집에서 경고를 봐요. 제가 말했다고는 안 해 주셨으면 해요."});
ML("7-1","M39").hold=()=>R("답하지 않았습니다.","안전-2"+(kimHard()?" `kim_fragile`":""));
Object.defineProperty(ML("7-1","M40"),"body",{get:()=>(G.f.pm_root||G.f.q2_prevent?"항목은 줄었어요. ":"")+"완료율 100%로 나오는 거요, 저희 아직 다 못 봐요. 바쁜 주에는요. 다들 그런 것 같아요."});
Object.defineProperty(ML("7-1","M42"),"body",{get:()=>(G.f.ct_measure?"실측을 누가 재는지 현장은 아직 못 들었습니다.":G.f.ct_cut?"5% 인하분이 어디서 나오는지 아무도 말을 안 합니다.":"신규 2건 일정대로면 9월 야간이 무너집니다.")+" 결정이 틀렸다고 봅니다. 실명으로 씁니다."});
ML("7-1","M38").self=()=>R("문지원에게 이번 달 일정을 물어보며 결재를 나눠 보자고 했습니다."+(Math.random()<.25?" 문지원: \"윤 책임이 말했습니까?\"":""),"src+1 `src_warned`");
ML("7-1","M38").to.mfg=()=>R("강태식이 챙겨 보기로 했습니다.","mfg+1 `src_warned`"+(Math.random()<.4?" 소문1":""),"①L");
{const m=ML("7-1","M38");const f=m.self;m.self=()=>{const r=f();if(/윤 책임이 말했/.test(r[0]))r[1]+=" 안전-2";return r;};}
Object.defineProperty(ML("7-1","M35").to,"rd",{value:()=>R("서하준이 회신했습니다."+(G.f.ai_shadow?" \"2월 뒤로 다 정리했어요.\"":""),"rd+1","①L"),enumerable:true});
const a72=S("7-2a");a72.rel="mkt";a72.xfx=(a72.xfx||[]).concat([{c:g=>cell(g,"GROW")<=1,o:"B",fx:"초과부하1"}]);
S("7-2b").rel="rd";OP("7-2b","A").onDone=P5OK;
OP("7-2b","B").tw=[T(30,"서하준이 설계 핵심을 차 선임에게 넘겨 줬습니다.","`p5_passed`"),T(g=>g.prom.P5?40:0,"차 선임: \"역시 그렇군요.\"","안전-2 이야기:cha-")];
OP("7-2b","B").onDone=(g,hit)=>{if(hit&&hit.fx==="`p5_passed`")P5OK();};
S("7-3_1").rel="prc";S("7-3_2").rel="prc";
/* 7-4 RUN 효과(두 경우 공통) */
["7-4_1","7-4_2"].forEach(id=>{const s=S(id);s.tellNote="병명과 사유는 넣지 않습니다.";s.conds=s.conds.filter(c=>!/운영 칸에 여유|어느 선택이든/.test(c.t));
 s.conds.unshift(C(g=>cell(g,"RUN")>=3,"운영 칸에 여유가 있어 빈자리에 사람을 바로 붙일 수 있었습니다."),C(g=>cell(g,"RUN")<=1,"운영 칸이 비어 있습니다."));
 s.options.forEach(o=>{o.tw2=[{p:g=>cell(g,"RUN")<=1?30:0,t:"공백 중 처리 오류가 났습니다.",fx:"안정-2 F사만족-1"}];});});
{const e1=S("7-4_1");e1.rel="src";e1.enter=g=>"`case_src`"+(cell(g,"RUN")>=3?" 안정+1":"");}
{const e2=S("7-4_2");e2.rel="mfg";e2.enter=g=>"안전-3 `kim_sick` `~kim_fragile`"+(cell(g,"RUN")>=3?" 안정+1":"");
 e2.intro=[g=>(g.f.got_M38?"문지원의 병원 일은 \"검사 결과는 괜찮답니다\" 한 줄로 끝났습니다. ":"")+"강태식의 전화. 새벽 5시."];
 e2.onEnterUnsent=true;}
OP("7-4_1","A").tw=[T(g=>g.f.yoon_forced||g.f.yoon_silenced?60:40,"\"저 곧 없어질 사람 아닙니까.\" 윤 책임이 거절했습니다. 강태식이 겸임합니다.","안전-2 `~yoon_acting` `mfg_acting` mfg+4 안정+1 prc-1"),T(g=>g.f.yoon_validator?45:30,"2주 동안 AI 발주 오류까지 잡았습니다.","안정+2 성과+1 이야기:yoon+")];
OP("7-4_1","B").tw=[T(40,"생산 야간이 비는 사이 피로가 쌓였습니다.","초과부하1 이야기:kim-"),T(g=>g.f.mfg_bloc?50:30,"결재선이 강태식 방식으로 바뀌어 있습니다.","src-3 재무-1")];
S("7-4").pick=PICK["7-4"];
const kimSickUnsent=g=>{if(g.f.kim_sick&&!g.f.got_M39){const m="김 사원은 쓰러지기 전날 대기표 얘기를 쓰다가 지웠습니다.";if(!g.unsent.includes(m))g.unsent.push(m);}};
S("7-4_2").options.forEach(o=>{const f=o.onDone;o.onDone=(g,h)=>{kimSickUnsent(g);if(f)f(g,h);};});
const m75=S("7-5");m75.aCost=g=>g.f.prc_preheard?1:2;m75.enter=g=>g.f.got_M37?"":"mkt-2 prc-2";m75.pair=["mkt","prc"];m75.rel="mkt";
m75.enter2=g=>g.f.award_fix?"prc-1":"";
m75.conds2=[C(g=>g.f.credit_rule,"4월에 표지에 실제 작성자를 적기로 했습니다."),C(g=>g.f.pub_prevent&&!g.f.pub_revenue,"공개한 기준에는 예방만 있습니다."),C(g=>g.f.pub_revenue&&!g.f.pub_prevent,"공개한 기준에는 매출만 있습니다."),C(g=>g.f.award_fix,"5월 포상도 다른 모듈로 갔습니다."),C(g=>g.f.award_both,"5월 포상은 두 모듈 이름으로 냈습니다."),C(g=>g.f.han_hurt,"정다은은 4월 일 이후로 이런 얘기에 말을 아낀다.")];
m75.xfx=[{c:g=>g.f.credit_rule,o:"C",fx:"안전-2"},{c:g=>g.f.pub_prevent&&!g.f.pub_revenue,o:"A",fx:"prc-2"},{c:g=>g.f.pub_revenue&&!g.f.pub_prevent,o:"B",fx:"mkt-2"}];
OP("7-5","C").says=g=>g.f.credit_rule?[["prc","표지 규칙은요?"]]:[];
IV("7-6","src").fxInfo=g=>g.cases&&g.cases["7-4"]===1?"`know_hq`":"";

/* ===== 8월 ===== */
const a81=S("8-1a");a81.rel="mfg";a81.xfx=[];
a81.conds=[C(g=>g.f.f_140&&!g.f.f_corrected,"공문 첨부에 \"주 140시간 절감\"이 근거로 적혀 있다."),C(g=>g.f.f_corrected,"공문 첨부에 \"주 38시간 (실측 진행 중)\"이라고 적혀 있다."),C(g=>g.f.know_hq,"지난달 들은 얘기다. 빠질 수 있는 일의 목록을 미리 뽑아 두었다."),C(g=>g.f.run_agenda,"강태식에게 이 회의에서 9월 야간을 다루겠다고 했습니다."),C(g=>g.f.mfg_bloc,"강태식과 문지원의 자리가 비어 있다."),C(g=>g.f.kim_sick,"김 사원은 복귀한 지 일주일이 안 됐다."),C(g=>g.f.yoon_acting,"윤 책임이 2주 대행을 막 끝냈다.")];
a81._say=a81.say;a81.say=g=>g.f.mfg_bloc?a81._say.filter(x=>x[0]!=="mfg"&&x[0]!=="src"):a81._say;
OP("8-1a","A").fx="`hq_two` 성과+2 사람-2 안전-2";
OP("8-1a","B").fx=g=>{let p=g.f.saw_gap?55:25;if(g.f.f_140&&!g.f.f_corrected)p-=20;if(g.f.f_corrected)p+=10;return Math.random()*100<p?"`hq_one` 사람+1 성과-1":"`hq_two` 성과-2 사람-1";};
OP("8-1a","B").tw=[T(g=>g.f.hq_one?30:0,"본사: \"그럼 그동안 보낸 효과 숫자는 뭡니까.\"","재무-2")];
OP("8-1a","C").fx=g=>Math.random()*100<(g.f.know_hq?65:50)?"`hq_loan` 성과-1 안전+1":"`hq_two` 사람-1";
OP("8-1a","C").tw=[T(g=>g.f.hq_loan?30:0,"가는 사람이 \"다녀오면 제 자리 있나요?\"라고 묻습니다.","안전-1")];
a81.options.forEach(o=>{o.onDone=g=>{if(g.f.know_hq)g.nextMult=.5;};o.done=null;});
OP("8-1a","A").done="공문대로 2명을 보내기로 했습니다.";
OP("8-1a","B").done=g=>g.f.hq_one?"협상 끝에 1명만 보내게 됐습니다.":"협상은 받아들여지지 않았습니다. 2명을 보냅니다.";
OP("8-1a","C").done=g=>g.f.hq_loan?"6개월 파견으로 바뀌었습니다. 복귀 자리를 문서로 받았습니다.":"파견 제안은 거절됐습니다. 2명을 보냅니다.";
const cutCells=(g,a,b)=>{const n=g.f.hq_one?1:2;const seq=[a,b];for(let i=0;i<n;i++){let k=seq[i]||a;if(!g.cells[k])k=Object.keys(g.cells).sort((x,y)=>g.cells[y]-g.cells[x])[0];g.cells[k]=Math.max(0,g.cells[k]-1);}};
const b81=S("8-1b");b81.rel="mfg";
b81.ask="어느 칸에서 줄일까요?";b81.intro=[g=>(g.f.hq_one?"1칸":"2칸")+"이 줄어듭니다. 고른 칸이 비어 있으면 다음으로 많은 칸에서 줄입니다."];
b81.skip=g=>{if(g.f.planb_alloc){const o=Object.keys(g.cells).sort((x,y)=>g.cells[y]-g.cells[x]);cutCells(g,o[0],o[1]);applyFx("안전+1");toast("4월에 정한 순서대로 칸을 줄였습니다.");return true;}return false;};
b81.ctxFn=g=>g.f.planb_alloc?{}:{addNeg:1,foe2:true};
b81.xfx=[{c:g=>g.f.run_agenda,o:"A",fx:"mfg+1"},{c:g=>g.f.run_agenda,o:"B",fx:"mfg-2"}];
OP("8-1b","A").onDone=g=>cutCells(g,"GROW","AI");OP("8-1b","B").onDone=g=>cutCells(g,"RUN","SEC");
OP("8-1b","C").onDone=g=>{const o=Object.keys(g.cells).sort((x,y)=>g.cells[y]-g.cells[x]);cutCells(g,o[0],o[1]);};
OP("8-1b","A").tw=[T(g=>g.f.prop_full||g.f.ct_more?60:0,"받아 둔 일은 그대로라 일이 넘칩니다.","초과부하1"),T(25,"서하준이 과제 하나를 스스로 접었습니다.","rd+1 재무+1")];
OP("8-1b","B").tw=[T(45,"운영과 예방 인력이 빠져 현장 대응이 얇아졌습니다.","`run_thin`"),T(25,"강태식: \"이번엔 해 보겠습니다.\" 야간을 재편했습니다.","mfg+2 안정+1")];
OP("8-1b","C").tw=[T(40,"어느 모듈도 일을 덜지 못했습니다.","초과부하1"),T(30,"리더들이 서로 겹치는 일을 찾아 왔습니다.","안정+1 재무+1")];
const c81=S("8-1c");const c81o=c81.options;
c81.title="리더 회의③ · 본사 차출";c81.ask="팀에 뭐라고 할까요?";c81.rel="mfg";
c81.intro=[g=>g.prom.P3?"2월의 답글이 게시판 맨 위로 다시 올라왔습니다. \"올해 AI를 이유로 우리 팀 인원을 줄이지 않겠습니다.\" 댓글: \"공문 사유가 'AI 효율화 실적'이던데요.\"":""];
c81o.find(o=>o.k==="A").fx="`p3_owned` 안전+2 사람-1";
c81o.find(o=>o.k==="A").onDone=g=>{if(g.prom.P3&&!g.f.hq_loan){g.prom.P3.status="파기";g.broken++;applyFx("안전-1");}};
c81o.find(o=>o.k==="A").done=g=>g.f.hq_loan?"약속을 지키지 못했다고 썼습니다. \"6개월 뒤 돌아옵니다\"를 덧붙였습니다.":"약속을 지키지 못했다고 이유와 함께 썼습니다.";
c81o.find(o=>o.k==="A").tw=[T(25,"\"그럼 앞으로 하는 말도 못 믿겠네요.\"","안전-3"),T(g=>g.safe>=50?45:30,"\"이렇게 인정하는 글은 처음 봅니다.\"","안전+3 사람+1")];
c81o.find(o=>o.k==="B").fx="`p3_spin` B10+20";
c81o.find(o=>o.k==="B").tw=[T(g=>g.f.hq_loan?20:50,"\"말장난이네요\" 댓글이 쌓였습니다.","안전-2")];
c81o.find(o=>o.k==="B").onDone=(g,hit)=>{if(hit)settle("P3",false);};
c81o.find(o=>o.k==="C").fx="`p3_silent` mfg+1 src+1 소문규칙";
c81o.find(o=>o.k==="C").tw=[T(30,"리더들이 사정을 잘 전했습니다.","`p3_soft`")];
c81o.find(o=>o.k==="C").onDone=(g,hit)=>{if(g.prom.P3&&!g.f.hq_loan){if(hit){g.prom.P3.status="파기";g.broken++;applyFx("안전-3");}else settle("P3",false);}};
c81.options=g=>g.prom.P3?c81o:[{k:"A",t:"기준과 근거를 설명한다",cost:2,fx:"안전+2",sig:"④L",done:"차출의 이유와 줄인 칸을 설명했습니다.",tw:[T(25,"반박이 붙었습니다.",g=>lowLeader(g)+"-1")]},{k:"B",t:"결과만 간단히 알린다",cost:1,done:"결과만 알렸습니다."},{k:"C",t:"따로 알리지 않는다",fx:"안전-2 소문규칙",sig:"④P",done:"따로 알리지 않았습니다."}];
const s82=S("8-2");s82.rel="mfg";OP("8-2","A").noTell=true;
s82._say=s82.say;s82.say=g=>s82._say.map(x=>x[0]==="mfg"&&g.f.kim_sick?["mfg","다시는 그런 일 없게 하고 싶습니다. "+x[1]]:x);
s82.conds=[C(g=>g.f.kim_manual,"김 사원이 쓴 경고 처리 규칙 초안이 있습니다."),C(g=>g.f.night_open,"2월에 대기를 모듈 밖으로 연 적이 있어 당번 명단이 남아 있습니다."),C(g=>g.f.night_stuck,"2월의 표가 아직 바뀌지 않았다."),C(g=>g.f.night_audit||g.f.night_seen,"표 밖의 접속이 있다는 것을 안다."),C(g=>g.f.kim_sick,"7월에 김 사원이 쓰러졌다."),C(g=>cell(g,"AI")>=3,"AI 칸에 여유가 있어 튜닝 인력을 붙일 수 있습니다."),C(g=>cell(g,"AI")<=1,"AI 칸이 비어 있습니다. 자동화는 조율 없이 돌아갑니다.")];
s82.boost=[{c:g=>cell(g,"AI")>=3,o:"B",m:1.5},{c:g=>g.f.kim_manual,o:"B",m:1.5}];
S("8-3_1").rel="rd";S("8-3_2").rel="rd";
S("8-3_1").xfx=[{c:g=>g.f.cha_counter,o:"B",fx:"재무+2"}];
OP("8-3_1","A").onDone=P5OK;OP("8-3_2","A").onDone=P5NO;OP("8-3_2","C").onDone=P5NO;
OP("8-3_2","A").tw=[T(35,"떠나는 이유를 들어 보니 \"설계를 맡을 줄 알았어요.\"",g=>g.f.cha_heard?"안전-2":""),T(30,"나간 뒤에도 후임에게 설명 문서를 보내 주기로 했습니다.","성과+1 안정+1")];
OP("8-3_2","B").fx=g=>{if(g.f.cha_counter){}if(Math.random()<.5){P5OK();return (g.f.cha_counter?"재무-3":"재무-5")+" `cha_stay_pay` 사람+1 성과+2";}return (g.f.cha_counter?"재무-3":"재무-5")+" `cha_left` 사람-3";};
OP("8-3_2","B").done=g=>g.f.cha_left?"다시 붙잡아 봤지만 떠나기로 했습니다.":"연봉 조정과 설계 자리를 받아들였습니다.";
const s84=S("8-4");s84.rel="mkt";
{const dm=s84.intro[0];s84.intro=["정다은의 DM."];s84.say=g=>[["mkt",dm+(g.f.prop_gap?" 제안서에 이미 썼잖아요.":"")]];}
OP("8-4","C").tw=[T(55,"정보보안팀이 뒤늦게 알았습니다.","안정-8 F사만족-6 src-4 mkt-3 `sec_data_found`"),T(45,"아무도 묻지 않았습니다.","")];
s84.conds=[C(g=>g.f.sec_breach,"3월의 건이 정보보안팀 기록에 남아 있다."),C(g=>g.f.rd_drafts_rule,"R&D가 쓴 사용 규칙에 마스킹 절차가 있습니다."),C(g=>g.f.prop_gap,"제안서에 쓴 \"지난 3년치 실측\"을 채워야 한다."),C(g=>g.f.ct_first,"우선 협상권이 있습니다. PT 일정을 2주 미룰 여지가 있습니다."),C(g=>cell(g,"SEC")>=3,"보안 칸에 여유가 있어 심사 자료를 바로 낼 수 있습니다."),C(g=>cell(g,"SEC")<=1,"보안 칸이 비어 있습니다.")];
s84.top=()=>`<details class="ref"><summary>규정집</summary><p style="margin-top:6px">고객 데이터의 외부 서비스 입력은 정보보안팀의 사전 승인이 있어야 한다. 식별자 제거만으로 예외가 되지 않는다.</p></details>`;
OP("8-4","B").fx=g=>{let p=40+(g.f.rd_drafts_rule?10:0)+(cell(g,"SEC")>=3?20:0)-(cell(g,"SEC")<=1?20:0);const ok=Math.random()*100<p;g.f.data_ok=ok;return "`data_fast` src+1 "+(ok?"성과+2 mkt+2":"mkt-3 성과-2 F사만족-1");};
OP("8-4","B").done=g=>g.f.data_ok?"긴급 심사가 승인됐습니다.":"긴급 심사가 통과하지 못했습니다. 분석 없이 PT를 준비합니다.";
OP("8-4","B").tw=[T(30,"심사 과정에서 정보보안팀이 다른 제안 문서도 보자고 합니다.","`sec_probe`")];
s84.harm=[{c:g=>g.f.sec_breach,o:"C",m:1.5},{c:g=>cell(g,"SEC")<=1,o:"C",m:1.5}];
s84.tail=g=>{const half=g.f.sec_gap_asked,pb=g.f.sec_probe?20:0;if(g.f.sec_reported)return{who:"src",t:"정보보안팀: 7월 신고 건은 조치 완료로 닫았습니다.",fx:"안정+1"};if(g.f.sec_hidden&&Math.random()*100<60+pb)return{who:"src",t:"정보보안팀이 6월의 외부 입력을 발견했습니다. \"알고 있던 분이 계셨나요?\"",fx:(half?"안정-2 F사만족-2 mkt-2":"안정-4 F사만족-3 mkt-3")+" 안전-2 `sec_found`"};if(g.f.sec_unknown&&Math.random()*100<50+pb)return{who:"src",t:"정보보안팀이 6월의 외부 입력을 발견했습니다.",fx:(half?"안정-2 F사만족-2 mkt-1":"안정-4 F사만족-3 mkt-2")+" `sec_found`"};return null;};
const s85=S("8-5");s85.rel="rd";
s85.boost=[{c:g=>cell(g,"AI")>=3,o:"AB",m:1.5},{c:g=>g.f.src_drift,o:"AB",m:.5}];
s85.enter=g=>cell(g,"AI")>=3?"이야기:yoon+":"";
S("8-6_1").rel="mkt";S("8-6_2").rel="mkt";
OP("8-6_1","B").tw=[T(50,"표지 이름으로 끝났습니다.",g=>g.f.credit_rule?"":"안전-2"),T(25,"정다은이 한 선임에게 발표를 넘겼습니다.","사람+2 mkt+1")];
S("8-6_2").intro=[g=>"사내 공모 시스템 알림: \"귀 팀 한 선임이 타 팀 공고에 지원했습니다. 현 팀장 의견을 입력해 주세요.\" 마감 이번 주."+(g.f.sec_found&&g.f.sec_hidden?" 한 선임의 DM: \"조사받았어요. 말씀드렸었는데요.\"":"")];

/* ===== 9월 ===== */
const s91=S("9-1");s91.rel="mfg";
s91.enter=g=>{let p=20+(g.f.m40_gone?10:0)+(g.f.run_thin?15:0)+(cell(g,"SEC")<=1?15:0)+(cell(g,"RUN")<=1?10:0)+(g.f.borrow_miss?10:0)-(g.f.know_line?10:0)-(cell(g,"SEC")>=3?10:0);const big=Math.random()*100<p;const cp=g.f.check_truth||g.f.check_sampled?10:g.f.check_showcase?50:25;const prc=Math.random()*100<cp;return "안정-3 F사만족-2"+(big?" 안정-3 F사만족-3 `inc_big`":"")+(prc?" `inc_prc`":"")+(prc&&g.f.check_showcase?" 성과-2 `showcase_pulled`":"");};
s91.conds=s91.conds.map(c=>/복구 시간/.test(c.t)?C(c.c,"야간 당번이 경고를 바로 올렸다."):c);
const recov=h=>g=>{let m=h*60+(g.f.inc_big?120:0)-((g.f.night_rotate||g.f.night_auto)?30:0);return (Math.floor(m/60))+"시간"+(m%60?" "+m%60+"분":"");};
OP("9-1","A").recover=recov(4);OP("9-1","B").recover=recov(3);OP("9-1","C").recover=recov(2);
s91.tail=g=>{if(g.trust.mfg>=50){g.f.mfg_ally=true;return{who:"mfg",t:"1월에 축하한다고 했을 때, 진심 반이었어. 지금은 좀 더 돼."};}g.f.mfg_exit=true;return{who:"src",t:"강태식 선배 자리가 비어 있네요. 이력서 얘기는 저한테 듣지 마시죠."};};
s91.intro=[g=>g.f.inc_prc&&g.f.showcase_pulled?"원인은 가공 배치 연동이었습니다. 본사 품질팀이 우수 사례 자료를 거둬들였습니다.":g.f.inc_prc?"원인은 가공 배치 연동이었습니다.":"원인은 해외 공장 인터페이스였습니다."];
const s92=S("9-2");s92.enter=g=>g.f.award_defer_bad?"mfg-2 prc-2":"";s92.rel="mfg";
s92.mods=(s92.mods||[]).concat([{c:g=>g.f.award_form,o:"B",d:-100}]);
s92._say=s92.say;s92.say=g=>s92._say.map(x=>x[0]==="mfg"&&g.f.inc_prc?["mfg",x[1]+" 그쪽에서 난 불이기도 하고요."]:x);
const s93=S("9-3");s93.rel="mfg";
OP("9-3","A").fx=g=>"`bae_move` 사람+2 안전+2 prc+3 "+(g.f.mfg_exit?"mfg-3":"mfg-5")+" 큰변화1";
OP("9-3","A").says=g=>g.f.mfg_exit?[["mfg","맘대로 하세요."]]:[];
s93.xfx=[{c:g=>cell(g,"RUN")<=1,o:"A",fx:"초과부하1"}];
s93.conds=s93.conds.map(c=>/다른 곳을 보고/.test(c.t)?C(c.c,"강태식은 이미 다른 곳을 보고 있다."):c);
OP("9-3","C").settle=null;OP("9-3","C").tw=[T(g=>g.f.mfg_exit?70:50,"두 리더가 합의하지 못하고 달을 넘겼습니다.","안전-2",{settle:["P4","파기"]}),T(30,"강태식이 12월까지 있고 넘기는 안을 먼저 냈습니다.","`bae_move` mfg+2 prc+2",{settle:["P4","이행"]})];
const s94=S("9-4");s94.rel="mkt";OP("9-4","A").cost=g=>g.f.planb_contract?0:2;
OP("9-4","B").tw=[T(35,"본사 재무가 \"왜 저희 승인 없이 깎았습니까\"라고 묻습니다.","성과-2 다음분기⏳-1"),T(25,"임원이 이 건을 더 묻지 않습니다.","B6-20")];
s94.conds=s94.conds.filter(c=>!/어디까지 물러설지/.test(c.t)).map(c=>c);
const m95=S("9-5");m95.enter=g=>g.f.auto_noise?"rd-2 src-2":"";m95.pair=["rd","src"];m95.rel="rd";m95.multX=g=>cell(g,"AI")<=1?1.5:1;
Object.defineProperty(m95,"story",{get:()=>[["rd","이 자동화까지 멈추면 올해 R&D가 남긴 건 뭐예요. 저희 애들 얼굴을 어떻게 봐요."],["src",G.cases&&G.cases["7-4"]===1?"제가 자리를 비우면 이 분류기는 누가 잡는지 모르겠어요.":"입원했을 때 제일 걱정한 게 이 분류기였어요. 제가 없으면 누가 잡는지 몰라서요."]]});

/* ===== 10월 ===== */
const s10S=S("10S_1");s10S.options=[Object.assign({},OP("8-5","A"),{done:"발주 검토와 납품 리포트까지 자동화를 넓혔습니다."}),Object.assign({},OP("8-5","B"),{done:"납품 리포트만 넓혔습니다."}),{k:"C",t:"한 번 더 미룬다.",fx:"`auto_defer2` rd-4",done:"한 번 더 미뤘습니다."}];
s10S.boost=s85.boost;
const s101=S("10-1");s101.rel="mkt";
const small=g=>g.fsat<40||g.f.prop_narrow;
s101.intro=[g=>"임원의 메일: \"수요예측 본계약을 귀사로 정했습니다. 내부 승인은 끝났습니다. 1월 착수로 계약서 초안을 보내겠습니다.\" 규모는 연 "+(small(g)?"6억":"12억")+"입니다."];
s101.boost=[{c:small,o:"A",m:1}];
OP("10-1","A").fx=g=>"`win_mkt` mkt+5 사람+1 "+(small(g)?"성과+1":"성과+2")+" rd-2 prc-2 mfg-2";
OP("10-1","C").tw=[T(30,"명단에 빠진 쪽이 묻습니다. \"저희는요?\"",g=>lowLeader(g)+"-2 안전-1"),T(30,"이름이 적힌 사람들이 다음 달 일을 먼저 물어 옵니다.","성과+1 사람+1")];
s101.options.forEach(o=>{const f=o.onDone;o.onDone=(g,h)=>{if(g.f.pub_revenue&&o.k!=="C")g.f.win_norecord=true;if(f)f(g,h);};});
const s102=S("10-2");s102._say=s102.say.map(x=>[x[0],x[1].replace(/"$/,"")]);
s102.say=g=>s102._say.filter(x=>!(x[0]==="mfg"&&g.f.mfg_exit)).map(x=>x[0]==="rd"&&g.f.cha_left?["rd",x[1]+" 설계자도 나가고요."]:x);
s102.mods=(s102.mods||[]).concat([{c:g=>g.f.prop_gap,o:"A",d:15,i:1},{c:g=>g.f.ct_first,o:"ABC",d:-15}]);
s102.xfx=(s102.xfx||[]).concat([{c:g=>cell(g,"GROW")<=1,o:"A",fx:"초과부하1"}]);
S("10-3_1").rel="src";S("10-3_2").rel="src";
const yoonP3=g=>{if(g.f.yoon_end_left&&g.prom.P3&&g.prom.P3.status==="진행 중")settle("P3",false);};
OP("10-3_1","B").tw=[T(40,"평가 반영은 문서로 남지 않았습니다.","`yoon_norecord`"),T(30,"문지원이 이를 모듈 표준으로 만들었습니다.","안정+2 사람+1")];
OP("10-3_2","A").tw=[T(g=>g.safe>=50?45:30,"윤 책임이 상담을 취소했습니다.","`yoon_end_role` 사람+2",{ending:"윤 책임은 내년 AI 검수 책임자입니다. 8년의 표가 잣대가 되었습니다."})];
OP("10-3_2","B").tw=[T(40,"문지원: \"말려 봤는데요.\" 그대로 떠났습니다.","`yoon_end_left` 사람-3",{ending:"윤 책임은 11월에 희망퇴직했습니다. 8년의 표는 자동화 설명서 부록이 되었습니다."})];
["10-3_1","10-3_2"].forEach(id=>S(id).options.forEach(o=>{const f=o.onDone;o.onDone=(g,h)=>{yoonP3(g);if(f)f(g,h);};}));
const m104=S("10-4");m104.pair=["mfg","mkt"];m104.rel="mfg";m104.multX=g=>g.f.mfg_bloc?1.5:1;
m104._say=m104.say;m104.say=g=>m104._say.map(x=>x[0]==="mfg"&&g.f.mfg_ally?["mfg",x[1]+" …말은 이렇게 해도, 숫자는 보겠습니다."]:x[0]==="mfg"&&g.f.mfg_exit?["mfg","(메일로만 의견을 보냈습니다) "+x[1]]:x);
m104.intro=(m104.intro||[]).concat([g=>g.f.mfg_bloc?"강태식·문지원 쪽이 함께 서명한 문서를 냈다.":""]);
m104.conds2=[C(g=>g.f.alloc_notice,"4월 공지문의 세 가지 잣대가 옆에 표시된다."),C(g=>g.f.scope_full,"수주 이행에 들어갈 돈이 이미 잡혀 있습니다."),C(g=>g.f.inc_big,"지난달 라인이 6시간 섰다."),C(g=>g.bills.includes("B6"),"F사가 내년 8% 인하를 전제로 하고 있습니다.")];
m104.enter2=g=>{g.pre104={a:g.trust.mfg+g.trust.src,b:g.trust.mkt+g.trust.rd};return "";};
m104.xfx=(m104.xfx||[]).filter(x=>x.o!=="C").concat([{c:g=>!g.f.alloc_notice,o:"C",fx:"mfg-2 mkt-2"}]);
OP("10-4","C").says=g=>g.f.alloc_notice?[]:[["mfg","처음 듣는 표네요."]];
m104.options.forEach(o=>{const f=o.onDone;o.onDone=(g,h)=>{if(f)f(g,h);if(g.pre104&&g.trust.mfg+g.trust.src>=g.pre104.a&&g.trust.mkt+g.trust.rd>=g.pre104.b)ach("동맹의 중재자");};});
const s105=S("10-5");s105.rel="mkt";
s105.conds=s105.conds.map(c=>/실측 절감만 내년/.test(c.t)?C(c.c,"6월에 실측 절감만 내년 단가에 반영하기로 했습니다."):c);
s105.xfx=[{c:g=>g.f.ct_measure,o:"BC",fx:"F사만족-2"},{c:g=>g.f.ct_cut,o:"C",fx:"재무-3"}];
S("10-6_1").rel="prc";S("10-6_2").rel="prc";
["10-6_1","10-6_2"].forEach(id=>{S(id).intro=[g=>g.prom.P6?"7월에 약속했습니다. 10월에는 오 사원이 E-417을 고치기로 했습니다.":""].concat(S(id).intro||[]);});
OP("10-6_1","B").settle=null;OP("10-6_1","B").onDone=()=>{if(G.prom.P6)settle("P6",Math.random()>.4,"oh");};
OP("10-6_2","A").tw=[T(35,"추천서를 읽고 이동을 취소했습니다.","`oh_end_prc` 사람+2",{ending:"오 사원은 가공 모듈에서 맡은 일을 늘려 가고 있습니다."})];
OP("10-6_2","B").tw=[T(45,"이수진이 설득하지 못했습니다.","`oh_end_left` 사람-2",{ending:"오 사원은 11월에 다른 팀으로 옮겼습니다."})];

/* ===== 11월 ===== */
const a111=S("11-1a");a111.rel="mfg";
a111._say=a111.say;
a111.say=g=>a111._say.filter(x=>!(x[0]==="mfg"&&!g.f.mfg_ally)).concat(g.f.mfg_ally?[]:[]);
a111.intro=(a111.intro||[]).concat([g=>g.f.mfg_exit?"강태식의 자리가 비어 있다.":""]);
a111.conds=[C(g=>g.f.b26_score,"10월 예산 표를 내년 계획에 그대로 쓸 수 있습니다."),C(g=>g.f.b26_run||g.f.b26_grow,"10월 예산에서 밀린 쪽이 팔짱을 끼고 있다."),C(g=>g.f["c_1-5_B"],"안건을 전날 공유하는 방식이 올해 내내 이어졌다."),C(g=>g.f.scope_full,"1월부터 전 품목 이행입니다."),C(g=>g.f.pm_root||g.f.q2_prevent,"점검표는 줄어드는 중이다.")];
a111.enter=g=>g.f.b26_run?"rd-1 mkt-1":g.f.b26_grow?"mfg-1 src-1":"";
a111.options.forEach(o=>{const f=o.onDone;o.onDone=(g,h)=>{if(f)f(g,h);if(g.f.b26_score)g.nextMult=.5;};});
OP("11-1a","C").after={t:"누구에게 맡길까요?",opts:["rd","src","mfg","prc","mkt"].map(k=>({t:LD[k].n,fx:g=>{if(k==="mfg"&&g.f.mfg_exit)return "";g.delegWin++;const foe=(FOE[k]||[])[0];let s=k+"+4"+(foe?" "+foe+"-3":"");g.f.plan_by=k;
 if(k==="mfg"&&g.f.mfg_ally&&Math.random()<.4){s+=" 안정+2 mfg+3";toast("야간과 신규 일정이 처음으로 한 표에 들어왔습니다.");}
 else if(Math.random()<.4&&foe){s+=" "+foe+"-2";toast("자기 모듈 쪽으로 기운 초안이 왔습니다.");}
 return s;}}))};
OP("11-1a","C").fx="";OP("11-1a","C").tw=[];
OP("11-1a","B").tw=[T(40,"다섯 개의 안이 합쳐지지 않았습니다. 12월까지 초안이 없습니다.","성과-1"),T(25,"이수진이 겹치는 일 9개를 찾아 왔습니다.","재무+1 prc+2")];
const s112=S("11-2");s112.rel="mkt";
s112.conds=[C(g=>g.f.credit_rule,"4월에 표지에 작성자와 기여자를 적기로 했습니다."),C(g=>g.f.kpi_mkt_credit,"3월 합의서에 공로 항목이 있습니다."),C(g=>g.f.report_mkt,"7월 보고서도 정다은 이름이 앞에 있었다."),C(g=>g.f.report_both,"7월 보고서에는 모듈별 기여를 적었다."),C(g=>g.f.report_team,"7월 보고서에는 이름을 빼고 냈다."),C(g=>g.f.know_case,"지난달 들은 얘기다. 기여 시간표를 미리 받아 두었다."),C(g=>g.f.han_left,"본문의 절반을 쓴 사람은 8월에 다른 팀으로 옮겼다."),C(g=>g.f.cha_left,"설계를 쓴 사람은 이번 달에 나갔다."),C(g=>g.f.win_credit,"10월 공지에 이미 이름들이 적혀 있다.")];
s112.xfx=[{c:g=>g.f.credit_rule,o:"BC",fx:"안전-2"},{c:g=>g.f.kpi_mkt_credit,o:"A",fx:"mkt+3"}];
OP("11-2","B").says=g=>g.f.credit_rule?[["han","규칙은요?"]]:[];OP("11-2","C").says=OP("11-2","B").says;
const g113=S("11-3");const f113=g113.pick;g113.pick=g=>g.f.han_left?2:f113(g);
g113.cases[2].note=true;g113.cases[2].title="한 선임";g113.cases[2].intro=[g=>g.f.case_doer?"옮겨 간 팀에서 메시지가 왔습니다. \"표지 봤어요. 고맙습니다.\"":g.f.case_lead?"부록 3쪽에 이름이 있었습니다. 답은 없었습니다.":"표지에 이름이 없었습니다. 답은 없었습니다."];
g113.cases[2].onDone=g=>{g.ends.han="한 선임은 다른 팀에서 제안서를 쓰고 있습니다.";};
["11-3_1","11-3_2"].forEach(id=>{S(id).rel="mkt";S(id).intro=[g=>g.prom.P7?"8월에 11월 보고 발표를 한 선임에게 맡기겠다고 했습니다.":""].concat(S(id).intro||[]);});
OP("11-3_1","B").tw=[T(35,"정다은이 리드를 맡겼습니다.","`han_end_lead` mkt+1",{settle:["P7","이행"],ending:"한 선임은 내년 제안 파트 리드입니다. 표지에 이름이 먼저 나옵니다."})];
OP("11-3_2","B").tw=[T(40,"정리는 표지 이름만 옮긴 수준이었습니다.","안전-2 `han_norecord`")];
S("11-4_1").rel="mfg";S("11-4_2").rel="mfg";
OP("11-4_1","A").pr={id:"P8",text:"내년 인력 협의 책임",to:"강태식",due:"내년"};
OP("11-4_1","C").tw=[T(40,"\"나를 내보내려는 거야?\"","mfg-5 `~tae_end_ally` `tae_hurt`")];
OP("11-4_2","A").tw=[T(35,"대화 뒤에도 떠나기로 했습니다.","`tae_end_left` 안정-3",{ending:"강태식은 3월에 떠났습니다. \"그래도 그날 얘기는 했으니까.\""}),T(g=>g.trust.mfg>=40?40:25,"면접을 취소했습니다.","`tae_end_ally` mfg+5",{ending:"강태식은 면접을 취소했습니다. 내년 야간표를 설계합니다."})];
OP("11-4_2","C").fx=()=>"`tae_end_left` 안정+1 mfg-6"+(Math.random()<.4?" 안전-4":"");
const s115=S("11-5");s115.pick=g=>{const sn=(k,s)=>storyN(g,k,s);let v=sn("kim","+")+["night_open","night_rotate","night_auto","kim_manual","kim_rest","night_seen"].filter(x=>g.f[x]).length-sn("kim","-")-["kim_fragile","night_stuck","kim_no_leave"].filter(x=>g.f[x]).length-(g.over>=3?1:0);if(g.f.kim_sick||(g.bills.includes("B7")&&!g.f.cha_left))v-=1;return v>=0?0:1;};
S("11-5_1").rel="mfg";S("11-5_2").rel="mfg";
S("11-5_2").conds=S("11-5_2").conds.filter(c=>!/7월에 보내려다/.test(c.t));
["11-5_1","11-5_2"].forEach(id=>{const s=S(id);s._say=s.say;s.say=g=>(s._say||[]).map(x=>x[0]==="kim"&&g.f.mfg_exit&&id==="11-5_1"?["kim","강태식 리더님 얘기는 들었어요. "+x[1]]:x);});
const s116=S("11-6");s116.rel="rd";
s116.intro=[g=>{const n=g.tokSpent.reduce((a,b)=>a+b,0);const m=Math.max(1,Math.round((g.score.성과-50)+(g.score.재무-50)/2+20));return `재무팀 박 책임의 메일: "올해 토큰 집행 ${n}, 성과 환산 ${m}, 토큰 1당 성과 ${(m/Math.max(1,n)*100).toFixed(1)}(×100)입니다. 내년 사용 원칙을 이달 안에 주세요."`;},g=>"분기별 집행: "+g.tokSpent.map((v,i)=>`${i+1}분기 ${v}`).join(" · ")];
S("11-7_1").rel="rd";S("11-7_2").rel="rd";
S("11-7_1").conds=(S("11-7_1").conds||[]).concat([C(g=>g.f.know_cha3,"서하준이 지난달 \"11월엔 정해질 것 같다\"고 했다.")]);
S("11-7_1").say=g=>[["cha",g.f.cha_stay_role||g.f.cha_design||storyN(g,"cha","+")?"내년 수요예측 설계, 제가 총괄해도 되나요? 서하준 님이 괜찮다고는 했어요.":"다른 곳에서 또 연락이 왔어요. 이번에는 진짜 답해야 해요."]];
const stay=g=>g.f.cha_stay_role||g.f.cha_design||storyN(g,"cha","+");
OP("11-7_1","A").tw=[T(25,"서하준: \"저는 그럼 뭘 합니까.\"","rd-3")];
OP("11-7_1","B").tw=[T(g=>stay(g)?0:40,"차 선임이 떠나기로 했습니다.","`cha_end_gone` 사람-3",{ending:"차 선임은 떠났습니다."})];
OP("11-7_1","C").tw=[T(g=>stay(g)?0:50,"차 선임이 떠나기로 했습니다.","`cha_end_gone` 사람-4 성과-2",{ending:"차 선임은 떠났습니다."}),T(25,"차 선임이 혼자 설계안을 들고 왔습니다.","성과+1")];
Object.defineProperty(S("11-7_2"),"intro",{get:()=>["인사팀이 퇴직 면담 기록을 보냈습니다.","퇴직 사유: 처우 2 / 성장 기회 5 / 리더와의 관계 1"+(promIs(G,"P5","파기")?" / 기타: \"설계를 맡을 줄 알았습니다.\"":"")]});
S("11-8").members=["kim","yoon","oh","han","cha","bae"].map(k=>({k,line:g=>g.ends[k]||"올해도 하던 일을 하고 있어요."}));

/* ===== 12월 ===== */
S("12-1").top0=true;
const s122=S("12-2");s122.rel="mfg";
s122.conds=s122.conds.map(c=>/장애 효과 2배/.test(c.t)?C(c.c,"운영 칸이 비어 있습니다."):c);
s122.enter=g=>(cell(g,"RUN")<=1?"안정-4 F사만족-4":"안정-2 F사만족-2")+(g.f.scope_risk?" F사만족-1":"");
OP("12-2","A").tw=[T(35,"복구가 늦어져 유 과장이 임원에게 올렸습니다.","F사만족-3"),T(25,"맡은 리더가 복구 보고까지 끝냈습니다.","mfg+3")];
OP("12-2","B").fx="`dec_extend` 안정+1 F사만족+2 mfg-3";
OP("12-2","B").done="평가 연장 사유서를 냈습니다. 이틀간 복구를 지휘했고, 평가는 이틀 늦어집니다.";
OP("12-2","C").tw=[T(40,"\"결국 리더 평가네요.\"","안전-3"),T(30,"리더들이 의견서에 관찰 사실을 적어 왔습니다.","안전+1 `dec_half`")];
const i123=GEN.findIndex(x=>x&&x.id==="12-3");
GEN.splice(i123,0,{id:"12-3a",type:"choice",month:12,when:"12월",tag:"연말 평가",title:"나머지 구성원은 어떻게 할까요?",intro:["인사시스템이 열렸습니다. 대상은 팀 전원입니다. 11명은 팀장이 직접 평가합니다."],
 skip:g=>{if(g.f.dec_bulk){applyFx("`eval_leader` rd+2 src+2 mfg+2 prc+2 mkt+2");const r=Math.random()*100;if(r<(g.f.dec_half?22:45)){applyFx("안전-3");g.f.appeal_extra=true;}return true;}return false;},
 options:[{k:"A",cost:2,t:"나머지 구성원은 리더 의견서의 관찰 사실을 확인한 뒤에 등급을 확정한다.",done:"리더 의견서의 관찰 사실을 하나씩 확인했습니다.",fx:"`eval_checked` 안전+2 사람+1",sig:"②L",tw:[T(40,"의견서 절반에 사실이 없어 되돌려 보냈습니다.","rd-1 src-1 mfg-1 prc-1 mkt-1 ⏳-1"),T(25,"리더들이 내년 기록 양식을 먼저 제안했습니다.","안정+1")]},
 {k:"B",t:"나머지 구성원은 리더들이 제안한 등급을 그대로 받아 이번 주에 일괄 확정한다.",done:"리더들이 제안한 등급으로 일괄 확정했습니다.",fx:"`eval_leader` rd+2 src+2 mfg+2 prc+2 mkt+2",sig:"①L",tw:[T(45,"\"친한 사람이 잘 받네요.\"","안전-3 `appeal_extra`"),T(25,"리더들이 근거까지 설명해 주고 있습니다.","안전+1")]},
 {k:"C",t:"나머지 구성원은 KPI 달성률 순서로 배분하고, 리더 의견은 참고로만 받아 둔다.",done:"KPI 달성률 순서로 배분했습니다.",fx:"`eval_kpi` 안전-2 prc-3",sig:"②P",tw:[T(g=>g.f.pub_prevent?65:50,"\"KPI 다 채웠는데 왜요.\" 작년과 같은 말이 나왔습니다.","안전-2 `appeal_extra`"),T(25,"숫자라 말이 없습니다.","안전+1")]}]});
const low=g=>{const r={S:0,A:1,B:2,C:3},a=g.grades.mfg,b=g.grades.src;return (r[a?a.등급:"B"]>=r[b?b.등급:"B"])?["mfg","src"]:["src","mfg"];};
const m125=S("12-5");m125.pair=["mfg","src"];m125.rel="mfg";m125.noA=g=>g.f.know_rift;
Object.defineProperty(m125,"say",{get:()=>{const[l]=low(G);const leave=G.f.tae_end_left||G.f.tae_end_plan?" 어차피 나갈 사람이지만.":"";const r={S:0,A:1,B:2,C:3},m=G.grades.mfg,s=G.grades.src;const mHigh=m&&s&&r[m.등급]<r[s.등급];
 const tae=["mfg","새벽에 나온 사람은 나고, A는 저쪽이네."+leave],moon=["src",mHigh?"결국 불 끄는 게 위네요.":"감사 지적 닫은 건 저희입니다. 선배도 아시잖아요."];return l==="src"?[moon,tae]:[tae,moon];}});
m125.intro=["평가 결과를 본 복도. 올해 내내 같은 편이던 두 사람이다.",g=>g.f.know_rift?"지난달 들은 얘기다.":""];
OP("12-5","A").fx=g=>{const[l,h]=low(g);return `\`rift_record\` 안전+1 ${l}-2 ${h}+1`;};
OP("12-5","A").dis=g=>g.grades.mfg&&g.grades.src&&g.grades.mfg.근거충족&&g.grades.src.근거충족?"":"제시할 기록이 부족합니다.";
OP("12-5","A").tw=[T(35,"\"숫자로 사람을 나란히 놓습니까.\"",g=>low(g)[0]+"-3"),T(30,"\"기록은 인정합니다.\" 둘이 복도에서 다시 얘기합니다.","mfg+2 src+2")];
OP("12-5","B").fx="`rift_draft` mfg+2 src+2 안정+1";
OP("12-5","B").tw=[T(40,"두 사람이 초안 앞에서 더 멀어졌습니다.","mfg-3 src-3 `ally_broken`"),T(25,"내년 합의서에 예방·복구 공동 항목이 생겼습니다.","prc+1 성과+1")];
OP("12-5","C").fx=g=>{const[l,h]=low(g);return `\`rift_makeup\` ${l}+3 ${h}-2`;};
OP("12-5","C").tw=[T(40,"\"다음엔 불평하면 되겠네요.\"","안전-2"),T(25,"등급이 낮은 쪽이 그 과제로 내년을 다시 시작합니다.","사람+1")];

/* 보충: 8-2 C의 전개는 9-1 대형화 판정에 쓰인다, 12-2 C의 전개는 12-3 일괄 확정의 나쁜 효과를 절반으로 */
{const c=OP("8-2","C");if(c.tw&&c.tw[0])c.tw[0].fx=(c.tw[0].fx||"")+" `borrow_miss`";}
{const s=S("12-3a");const b=s.options.find(o=>o.k==="B");b.tw[0].p=g=>g.f.dec_half?22:45;}
a111.say=g=>(g.f.mfg_ally?a111._say.map(x=>x[0]==="mfg"?["mfg",x[1].replace(/^"|"$/g,"").trim()]:x):a111._say.filter(x=>x[0]!=="mfg"));

/* 원고의 괄호 메모를 규칙으로: 5-5 C의 "8-3 선택지 효과 상승", 9-1 C의 "결산에서 처음 밝힌다" */
{const t=OP("5-5","C").tw;t[1]={p:30,t:"실제 제안이 오면 일주일 안에 답할 수 있도록 미리 정리해 두었습니다.",fx:"`cha_ready`"};
 ["8-3_1","8-3_2"].forEach(id=>{const s=S(id);s.boost=(s.boost||[]).concat([{c:g=>g.f.cha_ready,o:"ABC",m:1.5}]);});
 OP("7-2b","C").tw[0]={...OP("7-2b","C").tw[0],t:"컨설턴트에게 줄 F사 자료가 보안 심사에 걸려 일정이 2주 늦어졌습니다."};
 OP("11-4_1","C").ending="강태식은 다른 팀 팀장 후보로 올라갔습니다. 운영 쪽 내년 인계자는 아직 정해지지 않았습니다.";
 {const a=S("12-3a").options[0];a.cost=g=>g.f.dec_extend?0:2;}
 OP("9-1","C").tw=[T(50,"사후 감사에서 드러났습니다.","안정-8 F사만족-4 src-4 `inc_found`"),T(50,"아무도 묻지 않았습니다.","")];}
/* 약속 판정을 형식이 아니라 결과로: P2는 7월에 다시 본다 */
{const i=S("7-1"),f0=i.onStart;i.onStart=(g,s)=>{if(f0)f0(g,s);const p=g.prom.P2;if(p&&p.status==="이행"&&(!g.f.night_open||kimHard())){p.status="형식 이행";p.note=kimHard()?"표는 바뀌었지만 김 사원은 아직 집에서 경고를 봅니다.":"표는 바뀌었지만 대기는 다른 저연차에게 옮겨 갔습니다.";g.f.p2_hollow=true;}};}
/* ===== 화면에 새던 원고 메모 정리 (효과는 위에서 이미 enter/say로 처리됨) ===== */
{const strip=t=>typeof t==="string"?t.replace(/\s*\((3-5에서|M37이|P4가 있으면)[^)]*\)\s*/g,"").trim():t;
 const fixIntro=s=>{if(Array.isArray(s.intro))s.intro=s.intro.map(strip);};
 ["5-4","7-5"].forEach(id=>fixIntro(S(id)));
 S("9-2").intro=S("9-2").intro.filter(t=>typeof t!=="string"||!/원인이 가공이면/.test(t));
 {const s=S("7-2b");s.intro=s.intro.filter(t=>typeof t!=="string"||!/P5가 있으면/.test(t));s.top=()=>G.prom.P5?`<div class="happen"><span class="label">약속 장부</span>5월에 차 선임에게 설계를 맡기겠다고 했습니다.</div>`:"";}
 {const s=S("9-3");const sy=s.say;s.say=g=>(typeof sy==="function"?sy(g):sy).map(x=>x[0]==="bae"?["bae",(g.prom.P4?"9월까지라고 하셨죠. ":"")+strip(x[1]).replace(/"$/,"")]:x);}
 {const s=S("12-2");s.intro=s.intro.filter(t=>typeof t!=="string"||!/9-1과 같다/.test(t));s.top=()=>`<details class="ref"><summary>장애 절차</summary><p style="margin-top:6px">1등급 장애는 지휘자 1인을 지정한다. 운영 변경은 긴급 승인자의 확인을 거친다. 고객 통지는 인지 후 30분 안에 한다.</p></details>`;}
 {const s=S("10-4");s.conds2=(s.conds2||[]).map(c=>/세 가지 잣대/.test(c.t)?{...c,t:()=>"4월 공지문에 쓴 기준: "+((G.written.notice&&G.written.notice.기준||[]).join(", ")||"(기준 없음)")}:c);}
 {const s=S("11-5_2");s.conds=(s.conds||[]).map(c=>/1월의 금요일/.test(c.t)?{...c,t:"1월, 김 사원은 금요일 하루를 쉬지 못했다."}:c);}
 {const o=OP("11-7_2","C");o.tw=o.tw.map(t=>/표시된다/.test(t.t)?{...t,t:"인사팀: \"비슷한 사유의 퇴직이 내년에도 나올 수 있습니다.\""}:t);}
 {const o=OP("6-1","B");(o.tw||[]).forEach(t=>{if(typeof t.t==="string")t.t=t.t.replace("10-1 대형 수주","10월 대형 수주");});}
 GEN.forEach(s=>{if(!s)return;[s,...(Array.isArray(s.cases)?s.cases:[])].forEach(c=>{if(typeof c.title==="string")c.title=c.title.replace(/Wobbler[①②③]\s*/g,"").replace(/\s*\(둘 중 하나\)\s*/g,"").trim()||(c.caseTitle||"").replace(/^경우 \d+:\s*/,"").replace(/\s*\(`[^`]*`\)/g,"")||cleanTitle(s.title)||c.title;if(typeof c.caseTitle==="string")c.caseTitle=c.caseTitle.replace(/\s*\(`[^`]*`\)/g,"");});});
 ["5-6"].forEach(id=>{const p=S(id);(p.cases||[]).forEach(c=>{if(!c.title)c.title=p.title;});});}
/* ===== 2차 피드백: 고정 대사를 현재 상태에 맞게, 화자 표기 ===== */
{GEN.forEach(s=>{if(!s)return;[s,...(Array.isArray(s.cases)?s.cases:[])].forEach(c=>{if(typeof c.title==="string")c.title=c.title.replace(/\s*\((발단|전개|결말)\)/g,"");});});
 {const s=S("11-7_1");s.intro=(s.intro||[]).filter(t=>typeof t!=="string"||!/^\((자리를 잡음|또 제안이 옴)\)/.test(t));}
 {const s=S("10-1");s.conds=(s.conds||[]).map(c=>typeof c.t==="string"&&/위 대사 뒤/.test(c.t)?{...c,t:"강태식은 말을 마치고 자리를 떴다."}:c);}
 {const s=S("7-4_1");const [a0,b0,c0]=s.intro;s.intro=[a0];const sy=s.say;s.say=g=>[["src",b0],["mfg",c0],...((typeof sy==="function"?sy(g):sy)||[])];}
 {const s=S("6-3_1");s.intro=["근태 시스템의 자동 알림: \"김 사원, 최근 3주 새벽 2시 이후 접속 11회. 잔여 연차 14일.\"","김 사원의 DM."];s.say=[["kim","괜찮습니다. 이번 달 대기도 제가 설게요."]];}
 {const s=S("6-3_2");const t=s.intro[1];s.intro=["김 사원의 DM."];s.say=[["kim",t]];}
 {const s=S("8-6_1");const [a0,b0,c0]=s.intro;s.intro=["다음 제안 PT 준비 회의."];s.say=[["han",b0],["mkt",c0]];}
 {const s=S("11-4_2");const t=s.intro[0];s.intro=["문지원의 DM."];s.say=[["src",t]];}
 {const s=S("8-2");const sy=s.say;s.say=g=>(typeof sy==="function"?sy(g):sy).map(x=>x[0]==="mfg"?["mfg",x[1].replace("두 명 빠지고",g.f.hq_one?"한 명 빠지고":"두 명 빠지고")]:x);}
 ["8-3_1","8-3_2"].forEach(id=>{const s=S(id);s.conds=(s.conds||[]).map(c=>typeof c.t==="string"&&/지난주 2명이 빠졌다/.test(c.t)?{...c,t:()=>G.f.hq_one?"지난주 1명이 빠졌다.":"지난주 2명이 빠졌다."}:c);});
 {const s=S("9-3");s.intro=s.intro.map(t=>t==="3월에 받은 질문의 기한이다."?(g=>g.prom.P4?"3월에 받은 질문의 기한이다.":"3월에 배 책임이 물었던 가공 이동 이야기가 다시 나왔다."):t);}
 {const s=S("9-5");s.intro=s.intro.map(t=>typeof t==="string"&&/^자동화된 발주 분류가/.test(t)?(g=>g.f.auto_defer?"8월에 미뤄 둔 발주 자동화를 서하준이 다시 꺼냈다. 그사이 수작업 분류에서 긴급 건 하나가 일반으로 처리돼 공급사 납기가 하루 늦었다.":t.replace(/\s*\(.*$/,"")):t);}
 {const s=S("11-1a");const sy=s.say;s.say=g=>(typeof sy==="function"?sy(g):sy).filter(x=>!(x[0]==="mfg"&&g.f.mfg_exit)).map(x=>[x[0],x[1].replace(/^"(.*)"$/,"$1")]);
  s.options.forEach(o=>{const t0=o.t;Object.defineProperty(o,"t",{get:()=>G.f.mfg_exit?t0.replace("다섯","네"):t0,configurable:true});(o.tw||[]).forEach(w=>{const w0=w.t;if(typeof w0==="string"&&/다섯/.test(w0))Object.defineProperty(w,"t",{get:()=>G.f.mfg_exit?w0.replace("다섯","네"):w0,configurable:true});});});}
 Object.defineProperty(m125,"say",{get:()=>{const[l]=low(G);const leave=G.f.tae_end_left||G.f.tae_end_plan?" 어차피 나갈 사람이지만.":"";const r={S:0,A:1,B:2,C:3},m=G.grades.mfg,s=G.grades.src;const mg=m?m.등급:"B",sg=s?s.등급:"B";
  const tae=["mfg",(r[mg]<r[sg]?`이번엔 새벽에 나온 사람이 위네.`:r[mg]>r[sg]?`새벽에 나온 사람은 ${mg}, ${sg}는 저쪽이네.`:`둘이 같은 ${mg}네. 새벽에 나온 건 셈에 없나.`)+leave];
  const moon=["src",r[mg]<r[sg]?"결국 불 끄는 게 위네요.":"감사 지적 닫은 건 저희입니다. 선배도 아시잖아요."];return l==="src"?[moon,tae]:[tae,moon];},configurable:true});
 {const b9=BILL.B9;b9.body=()=>{const x=[...G.sig].reverse().find(v=>v.choice==="안 알림");return x?`정리하자면 이렇습니다. ${nm(x.scene)}, 그거 위에서 내려온 지시대로 한 거래요. 이유를 안 알려 준 건 말 못 할 사정이 있어서고요. 다들 아시죠?`:"정리하자면 이렇습니다. 요즘 결정들, 다 위에서 정해져 내려온 거래요. 다들 아시죠?";};}
 s116.intro=[s116.intro[0],g=>"분기별 집행: "+g.tokSpent.map((v,i)=>{const b=(g.tokBase||[])[i]||0;return `${i+1}분기 ${v} (모듈 평소 사용 ${b} + 안건에서 쓴 ${v-b})`;}).join(" · ")];}
fixTwText(GEN);fixTwText(CONTENT);
/* 내가 직접 맡는 안도 팀장 시간이 든다: ⏳가 붙은 안이 늘 정답이 되지 않게 */
[["11-1a","A",2],["5-1a","A",1],["8-3_1","B",1]].forEach(([id,k,c])=>{const o=OP(id,k);if(!val(o.cost))o.cost=c;});
{const s=CONTENT.find(x=>x.id==="1-2");if(s){const o=s.options.find(x=>x.k==="A");if(o&&!o.cost)o.cost=1;}}
{const a=S("7-2a"),b=S("7-2b");if(b.common&&!a.common){a.common=b.common;b.common=null;}}
{const m=CONTENT.find(x=>x.id==="2-6");if(m&&m.members){const b=m.members.find(x=>x.k==="bae");if(b)b.lead="mfg";}}
addContent(GEN.filter(Boolean));
addContent([{id:"FINALE",type:"finale",month:12,bare:true}]);

/* 참고 카드: 쉬운 말로 다시 쓴 원고 */
const REF_TEXT={"1-3": "<b>Charan 외(2011), 리더십 파이프라인</b><br>팀장은 내가 직접 해내는 사람이 아니라, 팀원을 통해 성과를 내는 사람입니다. 급한 일을 내가 처리하면 오늘은 해결되지만, 팀이 일하는 방식은 그대로 남습니다.<br><b>생각해 볼 질문:</b> 지금 급한 일과, 올해 팀을 바꾸는 일은 같은 일입니까?", "3-1": "<b>Kerr(1975), \"B를 바라면서 A에 보상하는 어리석음\"</b><br>사람들은 조직이 \"바란다\"고 말하는 일보다, 실제로 재고 보상하는 일을 합니다. 예를 들어 예방이 중요하다고 말하면서 평가에는 장애 복구만 넣으면, 사람들은 예방보다 복구에 힘을 씁니다.<br><b>생각해 볼 질문:</b> 이 기준으로 평가하면, 사람들은 내일부터 무엇을 더 하고 무엇을 덜 하게 될까요?", "5-2": "<b>Dekker(2007), 공정한 문화(Just Culture)</b><br>사고가 났을 때 아무도 탓하지 않는 것과, 책임을 제대로 따지는 것은 다릅니다. 제대로 따진다는 것은 \"누가 실수했나\"보다 \"왜 그 실수가 일어날 수밖에 없었나\"를 묻는 것입니다.<br><b>생각해 볼 질문:</b> 같은 자리에 다른 사람이 있었어도 같은 일이 일어났을까요?", "6-4a": "<b>Colquitt(2001), 설명이 주는 공정함</b><br>사람들은 기준이 바뀌었다는 사실보다, 그 소식을 언제, 누구에게서, 어떤 이유와 함께 들었는지로 공정한지를 판단합니다. 같은 변경이라도 이유와 함께 미리 들으면 받아들이고, 소문으로 먼저 들으면 반발합니다.<br><b>생각해 볼 질문:</b> 이 변경을 팀원들은 언제, 누구에게서 처음 듣게 될까요?", "7-2a": "<b>March(1991), 탐색과 활용</b><br>지금 잘하는 일(활용)은 성과가 빨리, 확실하게 나옵니다. 그래서 결과가 늦고 불확실한 새 시도(탐색)를 밀어내기 쉽습니다. 반대로 새 시도에만 몰리면 지금 돌아가는 일이 먼저 무너집니다. 둘 사이의 균형이 필요합니다.<br><b>생각해 볼 질문:</b> 이 제안을 받으면, 지금 돌아가는 일 가운데 무엇이 밀려날까요?", "8-5": "<b>Schein의 배움의 두 가지 불안(Coutu, 2002 인터뷰)</b><br>사람은 변화 앞에서 두 가지 불안을 함께 느낍니다. 하나는 \"배우지 않으면 뒤처진다\"는 불안, 다른 하나는 \"배우는 동안 무능해 보일 것\"이라는 불안입니다. 앞의 불안을 키워 몰아붙이기보다 뒤의 불안을 줄여 줄 때 사람이 실제로 바뀝니다.<br><b>생각해 볼 질문:</b> 이 사람이 잃을까 봐 두려워하는 것은 일자리입니까, 8년 동안 쌓아 온 자신의 쓸모입니까?", "9-2": "<b>Repenning & Sterman(2001), 예방은 보이지 않는다</b><br>\"일어나지 않은 문제를 막은 사람은 아무도 인정받지 못한다.\" 불을 끈 사람만 칭찬받으면 모두가 불 끄기에 몰리고, 예방할 시간은 사라집니다. 그러면 불은 더 자주 납니다.<br><b>생각해 볼 질문:</b> 일어나지 않은 장애는, 누가 막았다고 기록되나요?"};
(function(){const seen=new WeakSet();const walk=(v,id)=>{if(!v||typeof v!=="object"||seen.has(v))return;seen.add(v);const k=v.id||id;if(typeof v.ref==="string"&&REF_TEXT[k])v.ref=REF_TEXT[k];Object.values(v).forEach(x=>walk(x,k));};CONTENT.forEach(s=>walk(s,s.id));})();
