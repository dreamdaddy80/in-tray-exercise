/* WOW 장치 화면 (2026-11-26)
   점수·규칙·결과 코드는 건드리지 않고, 이미 있는 값을 보이는 방식만 바꾼다.
   ① 결산 '청구의 순간'과 결산 재구성 (v3ui.js v3final이 이 파일의 페이지 함수를 부른다)
   ② 결정 직후 '1월의 나' 카드
   ③ 라운드 성적표 '팀의 목소리' (v3.js 요약 탭이 voicePanel을 부른다)
   ④ 3번 라인 상황판과 확률 점 그래프
   ⑤ 인생극장 장면 (라운드 성적표 앞)
   원칙: Math.random을 쓰지 않는다. 인생극장 재계산은 난수를 잠시 고정해 게임의 난수 흐름을 건드리지 않는다.
   새로 넣는 요소는 버튼(.btn, .opt)이 아니어서 자동 플레이 하네스의 선택에 끼어들지 않는다. */
(function(){
 {const l=document.createElement("link");l.rel="stylesheet";l.href="wow.css";document.head.appendChild(l);}
 const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const plain=s=>String(s??"").replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim();
 const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
 const sgn=v=>(v>0?"+":"")+v;
 const V=x=>{try{return typeof x==="function"?x(G):x;}catch(e){return null;}};
 const SN=k=>({성과:"고객",재무:"재무",사람:"구성원",안정:"서비스 안정",F:"헬씨푸드 만족"})[k]||k;
 const SV=k=>k==="F"?G.fsat:G.score[k];
 /* 인생극장 재계산: 게임 난수를 소비하지 않도록 잠시 고정 난수로 바꾼다 */
 const fixedRand=fn=>{const R=Math.random;let k=11;Math.random=()=>{k=(k*16807)%2147483647;return (k-1)/2147483646;};try{return fn();}catch(e){console.warn("wow",e);return null;}finally{Math.random=R;}};
 const cine=r=>fixedRand(()=>window.cinema?cinema(r):null);

 /* ---------- 공통 시각 요소 ---------- */
 /* 가로 막대: v 0~100, base는 기준선 */
 const meter=(v,o={})=>`<span class="wx-meter${o.cls?" "+o.cls:""}" role="img" aria-label="${esc(o.aria||Math.round(v)+" / 100")}"><i style="width:${cl(v,0,100)}%"></i>${o.base!=null?`<b style="left:${cl(o.base,0,100)}%"></b>`:""}</span>`;
 /* 점 10개: p% 쪽이 나쁜 일. now=bad|ok 이면 이번 결과의 점에 테두리 */
 const dots=(p,o={})=>{const n=Math.round(cl(p,0,100)/10);let h="";for(let i=0;i<10;i++){const bad=i<n;const now=o.now==="bad"?i===n-1&&bad:o.now==="ok"?i===n&&!bad:false;h+=`<i class="${bad?"b":"o"}${now?" now":""}"></i>`;}
  return `<span class="wx-dots${o.big?" big":""}" role="img" aria-label="10번 중 약 ${n}번 나쁜 일">${h}</span>`;};
 /* 반원 계기: 0~100 */
 const arc=(v,o={})=>{const f=cl(v,0,100)/100,a=Math.PI*(1-f),cx=64,cy=64,R=52;const x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);
  const base=o.base!=null?(()=>{const b=Math.PI*(1-cl(o.base,0,100)/100);return `<line class="base" x1="${(cx+43*Math.cos(b)).toFixed(1)}" y1="${(cy-43*Math.sin(b)).toFixed(1)}" x2="${(cx+61*Math.cos(b)).toFixed(1)}" y2="${(cy-61*Math.sin(b)).toFixed(1)}"/>`;})():"";
  return `<svg class="wx-arc${o.cls?" "+o.cls:""}" viewBox="0 0 128 74" role="img" aria-label="${esc(o.aria||v)}"><path class="trk" d="M12 64 A52 52 0 0 1 116 64"/>${f>0?`<path class="val" d="M12 64 A52 52 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}"/>`:""}${base}<text class="big" x="64" y="62">${esc(o.label??v)}</text></svg>`;};
 /* 꺾은선: 마지막 점 강조 */
 const spark=(vals,o={})=>{const W=o.w||260,H=o.h||70,mx=o.max||100,lb=o.labels?14:0;const X=i=>10+i*(W-20)/Math.max(1,vals.length-1),Y=v=>H-8-lb-(cl(v,0,mx)/mx)*(H-18-lb);
  const pts=vals.map((v,i)=>X(i).toFixed(1)+","+Y(v).toFixed(1));const area=o.area?`<polygon class="ar" points="${X(0).toFixed(1)},${(H-8-lb).toFixed(1)} ${pts.join(" ")} ${X(vals.length-1).toFixed(1)},${(H-8-lb).toFixed(1)}"/>`:"";
  const ends=o.ends&&vals.length>1?`<text class="ev" x="${X(0).toFixed(1)}" y="${(Y(vals[0])-8).toFixed(1)}">${vals[0]}</text><text class="ev last" x="${X(vals.length-1).toFixed(1)}" y="${(Y(vals[vals.length-1])-9).toFixed(1)}">${vals[vals.length-1]}</text>`:"";
  return `<svg class="wx-spark${o.cls?" "+o.cls:""}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.aria||"")}">${area}${o.base!=null?`<line class="bl" x1="10" x2="${W-10}" y1="${Y(o.base).toFixed(1)}" y2="${Y(o.base).toFixed(1)}"/>`:""}${ends}<polyline points="${vals.map((v,i)=>X(i).toFixed(1)+","+Y(v).toFixed(1)).join(" ")}"/>${vals.map((v,i)=>`<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="${i===vals.length-1?4:2.6}"${i===vals.length-1?' class="last"':""}/>`).join("")}${o.labels?o.labels.map((l,i)=>`<text x="${X(i).toFixed(1)}" y="${H-2}">${esc(l)}</text>`).join(""):""}</svg>`;};
 /* 얼굴 */
 const faceSm=k=>{try{return k==="board"?`<span class="wx-anon" aria-hidden="true">익명</span>`:`<span class="wx-face" aria-hidden="true">${face(k,(LD[k]&&G.trust)?G.trust[k]:undefined)}</span>`;}catch(e){return "";}};
 const whoName=k=>{try{return k==="board"?"익명 라운지":name(k);}catch(e){return k;}};

 /* ---------- 팀의 목소리: 발언량과 익명 라운지 ---------- */
 const coefOf=st=>st==="push"?.85:st==="care"?1.15:1;
 const styleAt=r=>{const L=(G.styleLog||[]).filter(e=>e.r<=r);return L.length?L[L.length-1].style:G.style;};
 const v0Year=()=>{const a=G.rs&&G.rs[1]&&G.rs[1].voice0;return a!=null?a:voice(Object.assign({},G,{safe:50}));};
 function voiceSeries(){const out=[{l:"시작",v:v0Year()}];(G.hist||[]).forEach((h,i)=>{if(h.안전==null)return;const q=i+1,r=q===1?1:q<=3?2:3;out.push({l:q+"분기",v:Math.max(0,Math.round(h.안전*.8*coefOf(styleAt(r))))});});
  const now=voice();if(out.length>1)out[out.length-1].v=now;else out.push({l:"지금",v:now});return out;}
 const decText=id=>{const d=(G.decisions||[]).filter(x=>x.scene===id).slice(-1)[0];if(!d)return "";try{return String(choiceText(id,d.choice)||d.choice||"");}catch(e){return String(d.choice||"");}};
 function loungePosts(r){const sf=G.safe,st=G.style,P=[];const add=(p,t)=>P.push({p,t});
  if(st==="push"){add(9,"새 팀장도 한 분기 만에 꼰대 소리 듣네요. 빠르긴 한데, 왜 그렇게 정했는지는 아무도 몰라요.");add(7,"회의에서 팀장님 말이 끝나면 회의도 끝나요. 질문은 늘 '다음에'래요.");}
  if(st==="care")add(4,"요즘 팀장님이 먼저 물어봐서 좀 어색한데, 나쁘진 않아요.");
  if(/지켜보/.test(decText("3-9")))add(8,"설문 또 한대요. 지난번 결과는 어디 갔나요?");
  if(r>=2&&/그대로/.test(decText("4-3")))add(8,"리더 회의에서 반대가 나왔는데 '이미 정한 안'이래요. 다음 회의부터는 다들 조용하겠네요.");
  if(r>=2&&G.f.alloc_none)add(8,"칸을 나눴다는데 공지는 못 봤어요. 다들 어디서 들으세요?");
  if((G.rumors||0)>=2)add(6,"누가 그러는데 다음 분기에 또 사람을 뺀대요. 공식적으로는 아무 말이 없고요.");
  if(sf<35){add(6,"말해 봤자 바뀌는 게 없으니까, 그냥 하던 대로 해요.");add(5,"회의에서 반대하면 찍혀요. 여기 쓰는 게 마음 편하죠.");}
  else if(sf<55)add(4,"다들 회의 때는 조용하고, 끝나고 메신저로 얘기하더라고요.");
  else{if(G.f.alloc_notice||(G.told&&G.told.full)||(G.toldAll&&G.toldAll.full))add(5,"이번 공지는 이유까지 같이 와서 좋았어요. 처음이에요.");add(4,"회의에서 반대 의견을 냈는데 그대로 받아 줬어요. 이 팀 좀 달라졌네요.");}
  if((G.pub||[]).includes("장애 예방 활동")&&sf>=45)add(3,"예방 일도 기준표에 들어갔네요. 사고 없는 달도 일한 달이라는 거죠.");
  P.sort((a,b)=>b.p-a.p);const low=sf<35?12:sf<55?5:0;
  return P.slice(0,3).map((x,i)=>({t:x.t,like:4+(x.t.length*7)%19+low+(2-i)*3,cm:1+(x.t.length*3)%9+(low?4:0)}));}
 function voiceCounts(){const v1=voice();const none=((G.toldAll||{}).none||0)+((G.told||{}).none||0);
  return {named:Math.round(v1*.6),anon:Math.round(3+(G.rumors||0)*4+(G.style==="push"?6:0)+Math.max(0,45-v1)*.6+none*2)};}
 window.voicePanel=function(r){try{
  const ser=voiceSeries(),v0=ser[0].v,v1=voice(),pc=v0?Math.round((v1-v0)/v0*100):0;const rs=(G.rs||{})[r]||{};const vr=rs.voice0!=null?rs.voice0:v0;
  const c=voiceCounts(),mx=Math.max(c.named,c.anon,1);const posts=loungePosts(r);
  const cls=pc<=-15?"bad":pc>=10?"good":"";
  return `<div class="wx-voice" role="group" aria-label="팀의 목소리">
   <div class="wx-vl"><span class="wx-lab">팀의 목소리 · 회의와 게시판에서 팀원들이 의견을 내는 정도</span>
    <div class="wx-vrow"><div class="wx-vbig"><b class="num">${v1}</b><span>팀 발언량</span></div>
     <div class="wx-vchg ${cls}"><b class="num">${pc>0?"+":""}${pc}%</b><span>올해 시작 ${v0} 대비</span><span class="note0">이번 라운드 ${vr} → ${v1}</span></div></div>
    ${spark(ser.map(x=>x.v),{labels:ser.map(x=>x.l),max:Math.max(...ser.map(x=>x.v))*1.3||10,cls:cls,area:true,ends:true,h:96,aria:"팀 발언량 추이"})}
    <div class="wx-vs2"><div><span>이름을 걸고 낸 의견</span>${meter(c.named/mx*100,{cls:"named"})}<b class="num">${c.named}</b></div>
     <div><span>익명 라운지 글</span>${meter(c.anon/mx*100,{cls:"anon"})}<b class="num">${c.anon}</b></div></div>
    <p class="note0">이번 라운드의 추정치입니다. 발언량이 줄면 문제는 사라지지 않고 익명 글로 옮겨 갑니다.</p></div>
   <div class="wx-lounge"><div class="wx-lh"><b>익명 라운지</b><span class="cert">퓨쳐테크 인증</span><span class="cnt">헬씨푸드 운영팀 · 새 글 ${c.anon}</span></div>
    ${posts.length?posts.map(p=>`<div class="wx-post"><span class="wx-who">익명 · 운영팀</span><p>${esc(p.t)}</p><span class="meta">공감 ${p.like} · 댓글 ${p.cm}</span></div>`).join(""):`<p class="note0">이번 라운드에는 팀 이야기가 거의 올라오지 않았습니다.</p>`}</div>
  </div>`;}catch(e){console.warn("voicePanel",e);return "";}};

 /* ---------- 인생극장 ---------- */
 const CELL={RUN:["운영","c1"],AI:["AI","c3"],GROW:["성장","c2"],SEC:["예방","c4"]};
 const cellsOf=s=>{const o={};String(s||"").replace(/(RUN|AI|GROW|SEC) (\d+)/g,(_,k,n)=>{o[k]=+n;});return o;};
 const strip10=c=>`<span class="wx-cells" role="img" aria-label="${Object.keys(CELL).map(k=>CELL[k][0]+" "+(c[k]||0)+"칸").join(", ")}">${Object.keys(CELL).map(k=>Array.from({length:c[k]||0},()=>`<i class="${CELL[k][1]}"></i>`).join("")).join("")}</span>`;
 const cellLegend=c=>`<span class="wx-cleg">${Object.keys(CELL).map(k=>`<span><i class="${CELL[k][1]}"></i>${CELL[k][0]} ${c[k]||0}</span>`).join("")}</span>`;
 const pathName=s=>String(s||"").replace(/^[A-Z]\.\s*/,"").replace(/\s+(RUN|AI|GROW|SEC)\s.*$/,"");
 window.wxTab=function(b){try{const w=b.closest(".wx-ctabs");w.querySelectorAll(".wx-tab").forEach(x=>x.setAttribute("aria-selected",String(x===b)));w.querySelectorAll("[data-p]").forEach(p=>{p.hidden=p.getAttribute("data-p")!==b.getAttribute("data-t");});}catch(e){}};
 window.wxCineHtml=function(c,o={}){if(!c)return "";
  /* 5단계: 규칙으로 고른 갈림길이 KPI 공개 범위가 아니면, KPI 공개 범위 비교를 보조 탭으로 둔다 */
  if(c.sub&&!o.noTabs){const main=wxCineHtml(Object.assign({},c,{sub:null}),o);const sub=wxCineHtml(c.sub,Object.assign({},o,{hl:false,q:false,noTabs:true}));
   return `<div class="wx-ctabs"><div class="wx-tabbar" role="tablist" aria-label="인생극장 보기"><button type="button" class="wx-tab" role="tab" aria-selected="true" data-t="0" onclick="wxTab(this)">이번 라운드의 갈림길 · ${esc(c.label)}</button><button type="button" class="wx-tab" role="tab" aria-selected="false" data-t="1" onclick="wxTab(this)">보조 · KPI 공개 범위</button></div><div data-p="0" role="tabpanel">${main}</div><div data-p="1" role="tabpanel" hidden>${sub}</div></div>`;}
  const R2=c.r==="R2";const lowGood=i=>R2&&i===0;const abs=k=>/기준 인지/.test(k);
  const better=(i,a,b)=>lowGood(i)?a<b:a>b;
  const span=Math.max(5,...c.keys.map((k,i)=>abs(k)?0:Math.max(Math.abs(c.mine5[i]),Math.abs(c.alt5[i]))));
  const bar=(k,v,i,who)=>{if(abs(k))return `<i class="${who}" style="left:0;width:${cl(v,0,100)}%"></i>`;const w=Math.abs(v)/span*50;const bad=lowGood(i)?v>0:v<0;return `<i class="${who}${bad?" neg":""}" style="${v>=0?`left:50%`:`left:${50-w}%`};width:${Math.max(v?1.5:0,w)}%"></i>`;};
  const fmt=(k,v)=>abs(k)?v:sgn(v);
  const rows=c.keys.map((k,i)=>{const m=c.mine5[i],a=c.alt5[i];const mw=better(i,m,a),aw=better(i,a,m);
   return `<div class="wx-crow"><span class="k">${esc(k)}${lowGood(i)?' <small>낮을수록 좋음</small>':""}</span><div class="wx-dv${abs(k)?" abs":""}">${bar(k,m,i,"me")}${bar(k,a,i,"alt")}</div><span class="v me${mw?" win":""}">${fmt(k,m)}</span><span class="v alt${aw?" win":""}">${fmt(k,a)}</span></div>`;}).join("");
  const mc=R2?cellsOf(c.mineN):null,ac=R2?cellsOf(c.altN):null;
  const tot=Math.max(1,c.mw+c.aw);
  const say=(c.say||[]).map(x=>`<div class="wx-say">${faceSm(x[0])}<div><b>${esc(whoName(x[0]))}</b><p>“${esc(x[1])}”</p></div></div>`).join("");
  return `<div class="wx-cine${o.compact?" compact":""}${o.hl?" hl":""}">
   ${o.q!==false?`<div class="wx-cq"><span class="wx-lab">${o.round?esc(o.round)+" · ":""}갈림길</span><b>${esc(c.label)}</b></div>`:""}
   ${c.why?`<p class="wx-why">${esc(c.why)}</p>`:""}
   <div class="wx-paths"><div class="wx-path me"><span class="wx-lab">내가 간 길</span><b>${esc(R2?"내 배분":pathName(c.mineN))}</b>${R2?strip10(mc)+cellLegend(mc):""}</div>
    <div class="wx-vs" aria-hidden="true">VS</div>
    <div class="wx-path alt"><span class="wx-lab">가지 않은 길 · 추정${c.altNote?" · "+esc(c.altNote):""}</span><b>${esc(pathName(c.altN))}</b>${R2?strip10(ac)+cellLegend(ac):""}</div></div>
   <div class="wx-tally"><span>내 길이 나았던 지표 <b class="num">${c.mw}</b></span><span class="wx-split" role="img" aria-label="내 길 ${c.mw}, 다른 길 ${c.aw}"><i class="me" style="flex:${c.mw||0.001}"></i><i class="alt" style="flex:${c.aw||0.001}"></i></span><span>다른 길이 나았던 지표 <b class="num">${c.aw}</b></span></div>
   <div class="wx-crows"><div class="wx-crow h"><span class="k">${R2?"배분 한 분기 뒤 기대 효과":c.note?"선택지의 직접 효과":"결정 직후 변화"}</span><span class="wx-dvh"><i class="me"></i>내 길 <i class="alt"></i>다른 길</span><span class="v">내 길</span><span class="v">다른 길</span></div>${rows}</div>
   ${say?`<div class="wx-says"><span class="wx-lab">다른 길이었다면 들었을 말</span>${say}</div>`:""}
   <p class="note0">${esc(c.note||"결정 직전 상태에서 다른 선택지의 즉시 효과와 확률 결과의 기대값만 다시 계산한 추정입니다. 어느 쪽이 정답인지 판정하지 않습니다.")}</p>
  </div>`;};
 window.wxCine=cine;
 /* 라운드 성적표 앞: 인생극장 한 장면 */
 const cineSeen={};
 {const _re=SCENES.roundEnd;SCENES.roundEnd=function(s){
  const r=s.round,key=r+"@"+G.idx;
  if(r<3&&!cineSeen[key]){const c=cine("R"+r);if(c){paint("");
   shell(`<div class="pane wx-cpane"><div class="eyebrow">Round ${r} 끝 · 인생극장</div><h2>그래, 결심했어</h2><div class="prose"><p>이번 라운드에서 가장 큰 갈림길입니다. 그때 다른 길을 골랐다면 팀은 어떻게 됐을까요? 성적표를 열기 전에 먼저 보세요.</p></div>
    ${wxCineHtml(c,{round:"Round "+r})}
    <div class="foot"><span></span><button class="btn main" ${A(()=>{cineSeen[key]=1;_re(s);try{window.scrollTo(0,0);}catch(e){}})}>성적표 열기</button></div></div>`);return;}}
  return _re(s);};}

 /* ---------- 결정 직후: 1월의 나 ---------- */
 const ME_AT={"3-9":1,"4-3":1,"8-1c":1,"R3-1b":1,"12-3a":1};
 function meCard(){const pr=(G.prio||[]).slice(0,2);
  return `<div class="wx-me" role="group" aria-label="1월의 나"><div class="wx-me-q"><span class="wx-lab">1월의 나 · 선임 다짐</span><p>“${esc(G.pledge)}”</p></div>
   ${pr.length?`<div class="wx-me-g"><span class="wx-lab">그때 지키겠다고 고른 성적표</span>${pr.map(k=>{const v=G.score[k],d=v-50;return `<div class="wx-me-r"><span>${SN(k)}</span>${meter(v,{base:50,cls:d<0?"down":"up",aria:SN(k)+" "+v})}<b class="num">${v}</b><small class="${d<0?"bad":d>0?"good":""}">${d?sgn(d):"±0"}</small></div>`;}).join("")}<small class="note0">세로선은 1월의 값 50입니다.</small></div>`:""}</div>`;}
 function resultEyebrow(){return [...document.querySelectorAll("#view .eyebrow")].find(e=>e.textContent.trim()==="일어난 일");}
 function placeBefore(host,html){const foot=host.querySelector(":scope > .foot,:scope > .ask");if(foot)foot.insertAdjacentHTML("beforebegin",html);else host.insertAdjacentHTML("beforeend",html);}
 function injectMe(s,eb){if(!ME_AT[s.id]||!G.pledge)return;const host=eb.parentElement;if(!host||host.querySelector(".wx-me"))return;placeBefore(host,meCard());}
 /* 확률 점 그래프 */
 function optOf(s){const d=(G.decisions||[]).filter(x=>x.scene===s.id).slice(-1)[0];if(!d)return null;let opts=V(s.options);if(!Array.isArray(opts)&&s.cases){const cs=V(s.cases)||[];opts=cs.flatMap(c=>V(c&&c.options)||[]);}return (opts||[]).find(o=>o&&o.k===d.choice)||null;}
 function injectOdds(s,eb){const host=eb.parentElement;if(!host||host.querySelector(".wx-odds"))return;
  const n=[...host.querySelectorAll("p.note")].find(p=>/나쁜 일이 따라올 확률은 약 \d+%였습니다/.test(p.textContent));if(!n)return;
  const p=+n.textContent.match(/약 (\d+)%/)[1];const k=Math.round(p/10);
  const o=optOf(s);const bads=o?(o.tw||[]).filter(t=>{try{return twBad(t);}catch(e){return false;}}):[];
  const shown=[...host.querySelectorAll("p,.say,.happen")].map(x=>x.textContent).join(" ");
  const hitBad=bads.some(t=>{const tt=plain(V(t.t)).slice(0,14);return tt&&shown.includes(tt);});
  const big=(s.id==="R3-1b"||p>=40)&&!hitBad&&k>0;
  const list=big&&bads.length?`<div class="wx-odds-l"><span class="wx-lab">그 ${k}번에 일어났을 일</span>${bads.slice(0,3).map(t=>`<p>${esc(plain(V(t.t)))}</p>`).join("")}</div>`:"";
  n.outerHTML=`<div class="wx-odds${big?" big":""}">${dots(p,{now:hitBad?"bad":"ok",big})}<p>${k?`같은 선택을 10번 하면 약 <b>${k}번</b>은 나쁜 일이 따라옵니다.`:"나쁜 일이 따라올 확률은 낮았습니다."} ${hitBad?"<b>이번에는 그쪽이었습니다.</b>":"이번에는 피해 갔습니다."}</p>${list}${big?`<p class="note0">결과가 좋았던 것과 결정이 좋았던 것은 다릅니다.</p>`:""}</div>`;}
 /* ---------- 3번 라인 상황판 ---------- */
 const LS={"":{seg:[["on","가동"],["alarm","인터록 이상"],["on","가동"]],x:50,risk:0,loss:0},
  stop:{seg:[["off","정지"],["off","정지 · 원인 확인"],["off","정지"]],x:8,risk:1,loss:3},
  part:{seg:[["watch","감시하며 가동"],["off","정지 · 원인 확인"],["watch","감시하며 가동"]],x:42,risk:2,loss:1},
  run:{seg:[["on","가동"],["bypass","우회 가동"],["on","가동"]],x:92,risk:3,loss:0}};
 const RISK_T=["—","낮음","중간","높음"],LOSS_T=["없음","적음","중간","큼"];
 function lineHtml(k){const L=LS[k]||LS[""];const lv=(n,cls)=>`<span class="wx-lv ${cls}" role="img" aria-label="${n}/3">${[1,2,3].map(i=>`<i${i<=n?' class="on"':""}></i>`).join("")}</span>`;
  return `<div class="wx-line" data-sel="${k}" aria-live="polite"><div class="wx-line-h"><b>LINE-03 상황판</b><span>헬씨푸드 해외 공장 · 03:20 · 납기 내일 아침</span></div>
   <div class="wx-segs">${L.seg.map((x,i)=>`<div class="wx-seg ${x[0]}"><b>SEGMENT-${i+1}</b><span>${x[1]}</span>${i===1?"<small>센서 값 불일치</small>":"<small>같은 센서 모델</small>"}</div>`).join(`<i class="wx-flow" aria-hidden="true"></i>`)}</div>
   <div class="wx-scale"><span>현장 안전 우선</span><div class="wx-track"><i class="wx-needle" style="left:${L.x}%"></i></div><span>납기 우선</span></div>
   <div class="wx-lvs"><div><span>남는 현장 위험</span>${lv(L.risk,"risk")}<b>${k?RISK_T[L.risk]:"—"}</b></div><div><span>납기 손실</span>${lv(L.loss,"loss")}<b>${k?LOSS_T[L.loss]:"—"}</b></div></div>
   <p class="note0">${k?"고른 안대로 라인이 바뀐 모습입니다. 실제 결과의 크기는 결정한 뒤에 정해집니다.":"아래에서 하나를 고르면 상황판이 그 결정대로 바뀝니다."}</p></div>`;}
 function injectLine(s){if(s.id!=="R3-1b")return;const ops=document.querySelector("#view .opts");if(!ops)return;
  ops.classList.add("wx-ctl");
  [...ops.querySelectorAll(".opt")].forEach(b=>{const t=b.textContent;const k=/우회/.test(t)?"run":/구간만/.test(t)?"part":/세우/.test(t)?"stop":"";if(k){b.dataset.wx=k;b.dataset.lab={stop:"전체 정지",part:"구간 정지",run:"우회 가동"}[k];}});
  lineUpd();}
 function lineUpd(){const ops=document.querySelector("#view .opts.wx-ctl");if(!ops)return;const p=ops.querySelector('.opt[aria-pressed="true"]');const k=p&&p.dataset.wx||"";const old=document.querySelector("#view .wx-line");if(old&&old.dataset.sel===k)return;if(old)old.outerHTML=lineHtml(k);else ops.insertAdjacentHTML("beforebegin",lineHtml(k));}
 document.addEventListener("click",e=>{if(e.target&&e.target.closest&&e.target.closest(".wx-ctl"))setTimeout(lineUpd,0);});
 /* ---------- shell 뒤에 붙이기 ---------- */
 {const _sh=shell;shell=function(){const r=_sh.apply(this,arguments);try{const s=CONTENT[G.idx]||{};const eb=resultEyebrow();
   if(eb){injectOdds(s,eb);injectMe(s,eb);}else injectLine(s);}catch(e){console.warn("wow",e);}return r;};}

 /* ---------- 12월 · 떠나겠다는 사람들 (규칙은 v3.js exodusCalc) ---------- */
 const EXQ={trust:k=>`${LD[k].m} 모듈 퇴직 면담: "리더님도 이제 팀장님 얘기는 안 하세요. 저희가 뭘 기대하겠어요."`,
  stay:()=>`퇴직 면담: "열심히 해도 이 팀이 어디로 가는지 모르겠어요. 1년 더 있을 이유를 못 찾았어요."`,
  b4:()=>`가공 모듈 전보 신청 사유: "사고가 없으면 할 일이 없는 사람으로 보이더라고요."`,
  stress:k=>`${LD[k].m} 모듈 병가 신청서: "몸이 먼저 신호를 보냈습니다."`,b7:()=>`병가 신청서: "몸이 먼저 신호를 보냈습니다."`};
 window.exodusHtml=function(x,o={}){if(!x)return "";const LK=Object.keys(LD);const stay=30-x.n-x.sick;
  const grid=LK.map(k=>{const m=x.mods[k]||{out:0,sick:0};const ps=Array.from({length:6},(_,i)=>i<m.out?"out":i<m.out+m.sick?"sick":"stay");
   return `<div class="wx-ex-m${m.out||m.sick?" hit":""}"><b>${LD[k].m}</b><span class="wx-ex-p" role="img" aria-label="${LD[k].m} 6명 중 떠남 ${m.out}명, 병가 ${m.sick}명">${ps.map(c=>`<i class="pp ${c}"></i>`).join("")}</span><small>${LD[k].n} 신뢰 ${(x.trust||G.trust)[k]}</small></div>`;}).join("");
  const rows=(x.rows||[]).map(r=>`<div class="wx-ex-r ${r.kind}"><span class="n">${r.kind==="cap"?"상한 "+EXODUS_RULE.maxOut:(r.kind==="stress"||r.kind==="b7"?"병가":"떠남")+" "+r.n}</span><p>${esc(r.t)} <em>${esc(r.lim)}</em></p></div>`).join("");
  const qs=[];(x.rows||[]).forEach(r=>{const f=EXQ[r.kind];if(f&&qs.length<3)qs.push(f(r.k));});if(G.safe<35&&qs.length<3)qs.push(`퇴직 면담: "말해도 바뀌지 않을 것 같아서, 말 대신 신청서를 냈어요."`);
  return `<div class="wx-ex${o.compact?" compact":""}"><div class="wx-ex-top"><div class="wx-ex-n"><b class="num">30 <span>→</span> ${30-x.n}</b><small>내년 1월 운영팀 인원${x.sick?` · 그중 병가 ${x.sick}명`:""}</small></div>
    <div class="wx-ex-k"><span><i class="pp out"></i>떠남 ${x.n}</span>${x.sick?`<span><i class="pp sick"></i>병가 ${x.sick}</span>`:""}<span><i class="pp stay"></i>남음 ${stay}</span></div></div>
   <div class="wx-ex-grid">${grid}</div>
   ${rows?`<div class="wx-ex-why"><span class="wx-lab">넘어선 기준선</span>${rows}</div>`:""}
   ${o.scene&&qs.length?`<div class="wx-ex-q">${qs.map(q=>`<p>${esc(q)}</p>`).join("")}</div>`:""}
   ${o.scene&&(x.dP||x.dS)?`<p class="note0">이 일로 바뀐 점수: ${[x.dP?`구성원 -${x.dP}`:"",x.dS?`서비스 안정 -${x.dS}`:""].filter(Boolean).join(" · ")}. 떠난 자리는 남은 사람의 일이 됩니다.</p>`:""}</div>`;};
 /* ---------- 결산 페이지 ---------- */
 const EB=t=>`<div class="eyebrow">결산 · ${t}</div>`;
 const billMonth=b=>(G.billAt&&G.billAt[b])||12;
 /* ① 청구의 순간 */
 window.wxClaimPage=function(act,self){
  if(!act){act={};[1,2,3,4].forEach(a=>{const v=axScore(a).v;act[a]={v:v==null?null:v/100};});}self=self||G.diag||{};
  const pr=G.prio||[];const did=[],seen=new Set();
  const add=(t,tag,cls)=>{const k=plain(t).replace(/\s/g,"").slice(0,26);if(!k||seen.has(k))return;seen.add(k);did.push({t:plain(t),tag,cls});};
  (window.violationsAll?violationsAll():[]).slice(0,2).forEach(v=>add(v.text.replace(/ 이 일은 끝까지.*$/,""),"넘어선 선","bad"));
  (G.bills||[]).forEach(b=>{try{billCauses(b).filter(c=>!c.m||c.m<=billMonth(b)).slice(0,2).forEach(c=>add((c.m&&!/^\d+월/.test(c.t)?c.m+"월 · ":"")+c.t,"청구서의 원인","warn"));}catch(e){}});
  const gaps=[1,2,3,4].map(a=>({a,g:(self[a]??50)-(act[a].v==null?50:Math.round(act[a].v*100))})).sort((x,y)=>y.g-x.g);
  gaps.filter(x=>x.g>=15).forEach(x=>{try{const e=evid(x.a,"P");if(e.length)add(e[e.length-1],AXN[x.a].slice(2)+" · 맹점","axis");}catch(err){}});
  const mismatch=did.length>0;
  if(mismatch){if(did.length<3)gaps.forEach(x=>{try{const e=evid(x.a,"P");if(e.length)add(e[e.length-1],AXN[x.a].slice(2)+" · 작은 균열","axis");}catch(err){}});}
  else{[1,2,3,4].forEach(a=>{try{const e=evid(a,"L");if(e.length)add(e[e.length-1],AXN[a].slice(2)+" · 말한 대로","ok");}catch(err){}});
   const sm=gaps.map(x=>{try{const e=evid(x.a,"P");return e.length?[x.a,e[e.length-1]]:null;}catch(err){return null;}}).filter(Boolean)[0];if(sm)add(sm[1],AXN[sm[0]].slice(2)+" · 작은 균열","axis");}
  const rows=did.slice(0,4);
  /* 청구된 것 */
  const bill=[];
  (G.bills||[]).forEach(b=>{if(BILL[b])bill.push({k:"📮 "+billMonth(b)+"월 청구서",t:BILL[b].t,cls:"bill"});});
  const LK5=Object.keys(LD);const lo=[...LK5].sort((a,b)=>G.trust[a]-G.trust[b])[0];
  if(G.trust[lo]<=40)bill.push({k:LD[lo].n+" 신뢰",t:`50 → ${G.trust[lo]}`,m:G.trust[lo],base:50,cls:"tr"});
  const v0=v0Year(),v1=voice();if(v0&&v1<v0-3)bill.push({k:"팀 발언량",t:`${v0} → ${v1} (${Math.round((v1-v0)/v0*100)}%)`,m:v1,base:v0,cls:"tr"});
  if(G.exodus&&(G.exodus.n||G.exodus.sick))bill.splice(Math.min(bill.length,(G.bills||[]).length),0,{k:"내년 1월 · 팀을 떠나는 사람",t:`${G.exodus.n}명${G.exodus.sick?` · 병가 ${G.exodus.sick}명`:""}`,cls:"un"});
  if((G.unsent||[]).length)bill.push({k:"보내지 않은 메시지",t:G.unsent.length+"건",cls:"un"});
  const drops=["성과","재무","사람","안정","F"].map(k=>({k,d:SV(k)-50})).filter(x=>x.d<=-8).sort((a,b)=>a.d-b.d);
  drops.slice(0,2).forEach(x=>bill.push({k:SN(x.k),t:`50 → ${SV(x.k)}`,m:SV(x.k),base:50,cls:"tr"}));
  if(G.ends&&G.ends.mfg&&/떠났/.test(G.ends.mfg))bill.push({k:"강태식",t:"떠남",cls:"un"});
  const items=bill.slice(0,6);
  const head=mismatch?((G.bills||[]).length?"말한 것과 한 것 사이로 청구서가 도착했습니다":"말한 것과 한 것이 달랐던 순간들"):"말한 대로 했습니다. 그래도 치른 값이 있습니다";
  const ty=typeof resultType==="function"?resultType():null;
  const chart=["성과","재무","사람","안정","F"].map(k=>{const d=SV(k)-50,w=Math.min(50,Math.abs(d)/40*50);const mine=pr.includes(k);return `<div class="wx-drow${mine?" mine":""}"><span class="k">${SN(k)}${mine?'<em>지키겠다고 한 것</em>':""}</span><div class="wx-dbar"><i class="${d<0?"neg":"pos"}" style="${d>=0?"left:50%":`left:${50-w}%`};width:${Math.max(d?1.2:0,w)}%"></i></div><b class="num ${d<0?"bad":d>0?"good":""}">${d?sgn(d):"±0"}</b></div>`;}).join("");
  return `${EB("청구의 순간")}<h2>${head}</h2>
   <div class="wx-claim">
    <section class="wx-cc said"><span class="wx-lab">1월에 한 말</span><p class="wx-pledge">“${esc(G.pledge||"")}”</p>${pr.length?`<div class="wx-chips">${pr.map(k=>`<span>${SN(k)}</span>`).join("")}<small>지키겠다고 고른 성적표</small></div>`:""}</section>
    <i class="wx-arrow" aria-hidden="true"></i>
    <section class="wx-cc did"><span class="wx-lab">${mismatch?"실제로 한 일":"말한 대로 한 일"}</span>${rows.length?rows.map(x=>`<div class="wx-did ${x.cls}"><span class="tag">${esc(x.tag)}</span><p>${esc(x.t)}</p></div>`).join(""):`<p class="note0">기록할 만한 결정이 없었습니다.</p>`}</section>
    <i class="wx-arrow" aria-hidden="true"></i>
    <section class="wx-cc bill"><span class="wx-lab">${mismatch?"청구된 것":"대신 치른 값"}</span>${items.length?items.map(x=>`<div class="wx-bl ${x.cls}"><span>${esc(x.k)}</span><b>${esc(x.t)}</b>${x.m!=null?meter(x.m,{base:x.base,cls:"down"}):""}</div>`).join(""):`<p class="note0">눈에 띄게 청구된 것이 없습니다.</p>`}</section>
   </div>
   ${!mismatch&&drops.length?`<div class="happen"><span class="label">좋은 결정에도 대가가 있습니다</span>가장 크게 내준 것은 ${SN(drops[0].k)}(${sgn(drops[0].d)})입니다. 그 값을 치르고 무엇을 지켰는지 말할 수 있다면, 그것이 기준을 가진 결정입니다.</div>`:""}
   <div class="wx-pv"><div class="wx-pvh"><b>지키겠다고 한 것과 실제로 움직인 것</b><span>1월(50) 대비 변화</span></div>${chart}
    ${ty?`<p class="wx-pvt"><b>${esc(ty[0])}</b> ${esc(ty[1])}</p>`:""}</div>
   <p class="note0">청구서는 확률로 옵니다. 위의 결정 하나가 곧바로 원인이라고 단정할 수는 없습니다. 그래도 이 결정들이 확률을 올렸습니다.</p>`;};
 /* ② 숫자가 말하지 않은 것 */
 window.wxHiddenPage=function(){
  const M=G.mon||[];const sum=k=>M.reduce((a,x)=>a+(x[k]||0),0);const rep=sum("rep"),hid=sum("hidden");const rate=hid?Math.round(rep/hid*100):0;
  const first=M.length?M[0].rep:0,last=M.length?M[M.length-1].rep:0;
  const mx=Math.max(4,...M.map(x=>x.hidden||0));
  const bars=M.map((x,i)=>`<div class="wx-qb"><div class="wx-qc"><i class="hid" style="height:${(x.hidden||0)/mx*100}%;animation-delay:${.9+i*.15}s"></i><i class="rep" style="height:${(x.rep||0)/mx*100}%"></i></div><span class="num">${x.rep||0}<small> / ${x.hidden||0}</small></span><small>${x.m}월</small></div>`).join("");
  const sf=[50].concat((G.hist||[]).map(h=>h.안전).filter(v=>v!=null));
  const u=G.unsent||[];const n=u.length,s0=G.safe;
  const why=n&&s0>=60?`값이 높았는데도 아래 ${n}건은 도착하지 않았습니다. 이 값은 팀 전체의 분위기를 재는 것이라, 한 사람이 한 주제를 끝내 말하지 못한 일은 따로 잡히지 않습니다.`:!n&&s0<40?"말하려던 것은 모두 도착했지만 값은 낮았습니다. 말은 했어도, 말한 뒤에 치른 대가를 팀이 기억하고 있다는 뜻일 수 있습니다.":"";
  const ov=G.over||0,bo=G.burnout||0;
  return `${EB("숫자가 말하지 않은 것")}<h2>보고는 ${last<first?"줄었습니다":"이어졌습니다"}. 그런데 숫자가 말하지 않은 것이 있습니다</h2>
   <div class="wx-hid">
    <div class="wx-ht"><div class="wx-tile"><span>보고된 이슈·아차 사례</span><b class="num">${rep}<small>건</small></b><span class="note0">${last<first?`1분기 ${first}건 → 4분기 ${last}건으로 줄었습니다`:`1분기 ${first}건 → 4분기 ${last}건`}</span></div>
     <div class="wx-tile dark"><span>실제로 있었던 아차 사례</span><b class="num">약 ${hid}<small>건</small></b><span class="note0">성적표에 한 번도 나오지 않은 값</span></div>
     <div class="wx-tile"><span>보고율</span><b class="num ${rate<60?"bad":""}">${rate}<small>%</small></b>${meter(rate,{cls:rate<60?"down":"up",aria:"보고율 "+rate+"%"})}</div></div>
    <div class="wx-qchart" role="img" aria-label="분기별 보고된 건수와 실제 건수"><div class="wx-qleg"><span><i class="rep"></i>보고된 것</span><span><i class="hid"></i>실제로 있었던 것</span></div><div class="wx-qbars">${bars}</div></div>
    <div class="wx-safe"><div>${arc(s0,{label:s0,base:50,cls:s0<40?"bad":s0>=60?"good":"",aria:"심리적 안전 "+s0})}<span class="wx-lab">1년 동안 숨겨 둔 값 · 팀의 심리적 안전</span></div>
     <div><p>팀 전체가 말하기 쉬웠던 정도입니다(0~100, 시작 50). 성적표의 발언량은 이 값의 겉모습이었습니다. 보고되는 몫은 이 값이 높을수록 커집니다.</p>${spark(sf,{labels:["시작"].concat(sf.slice(1).map((_,i)=>(i+1)+"분기")),base:50,cls:s0<40?"bad":s0>=60?"good":"",area:true,ends:true,h:100,aria:"심리적 안전 분기별 추이"})}${ov||bo?`<p class="note0">야간·초과 부하 ${ov}회 · 번아웃 신호 ${bo}회</p>`:""}</div></div>
   </div>
   <div class="wx-unsent"><div class="wx-uh"><b>임시 보관함 · 보내지 않은 메시지 ${n}건</b><span>올해 당신의 받은편지함에 도착하지 않았습니다</span></div>
    ${n?u.map(x=>`<div class="wx-draft"><span class="st">보내지 않음</span><p>${esc(x)}</p></div>`).join(""):`<p class="note0">올해는 말하려던 것이 모두 도착했습니다. 시끄러웠던 받은편지함을 기억하시나요.</p>`}
    ${why?`<p class="note0">${why}</p>`:""}</div>
   <p class="voice">보고가 줄었을 때, 팀은 안전해진 것입니까, 입을 닫은 것입니까?</p>`;};
 /* ③ 인생극장 */
 window.wxCinePage=function(){const cs=["R1","R2","R3"].map(r=>({r,c:cine(r)})).filter(x=>x.c);const big=cs.slice().sort((a,b)=>b.c.gap-a.c.gap)[0];
  return `${EB("인생극장")}<h2>그래, 결심했어</h2><p class="note">세 번의 갈림길에서 고른 길과 고르지 않은 길입니다. 가장 크게 갈린 곳에 테두리를 쳤습니다.</p>
   ${cs.length?cs.map(x=>wxCineHtml(x.c,{round:"Round "+x.r.slice(1),compact:true,hl:big&&big.r===x.r})).join(""):'<p class="note">비교할 갈림길 기록이 없습니다.</p>'}
   ${big?`<div class="happen"><span class="label">가장 큰 갈림길 · ${esc(big.c.label)}</span>이 결정을 다시 한다면, 무엇을 먼저 확인하겠습니까?</div>`:""}`;};
 /* ④ 운이었나, 실력이었나 */
 window.wxLuckPage=function(){const L=(G.luck||[]).slice();const top=L.sort((a,b)=>b.p-a.p).slice(0,5);const cats={};(G.luck||[]).forEach(x=>cats[x.cat]=(cats[x.cat]||0)+1);
  return `${EB("확률의 호의 장부")}<h2>${L.length?`운 좋게 피해 간 나쁜 결과 ${L.length}건`:"올해는 운에 기댄 결정이 없었습니다"}</h2>
   ${L.length?`<div class="wx-cats">${Object.entries(cats).map(([k,v])=>`<span><b class="num">${v}</b>${esc(k)}</span>`).join("")}</div>
   <div class="wx-dleg"><span><span class="wx-dots"><i class="b"></i></span> 같은 선택을 10번 했을 때 나쁜 일이 따라오는 경우</span><span><span class="wx-dots"><i class="o now"></i></span> 올해 실제로 떨어진 자리</span></div>
   <div class="wx-luck">${top.map(x=>`<div class="wx-lk">${dots(x.p,{now:"ok"})}<div><b>${x.m}월 · ${esc(x.title)}${x.choice?` <small>고른 안: ${esc(x.choice)}${x.choice.length>=40?"…":""}</small>`:""}</b><p><span class="wx-lab">일어나지 않은 일 · 확률 ${x.p}%</span>${esc(String(x.t).replace(/""/g,'"'))}</p></div></div>`).join("")}</div>${L.length>top.length?`<p class="note0">확률이 높았던 ${top.length}건만 보여 드렸습니다. 나머지 ${L.length-top.length}건도 같은 성격입니다.</p>`:""}
   <p class="voice">무사했던 달을 실력이라고 할 수 있습니까?</p><p class="note0">결과가 좋았던 것과 결정이 좋았던 것은 다릅니다. 같은 선택을 다시 하면 위의 일들은 일어날 수 있습니다.</p>`:`<p>위험한 선택 뒤에 운 좋게 피해 간 나쁜 결과가 없었습니다. 결과가 결정을 그대로 보여 준 해였습니다.</p>`}`;};
 /* ⑦ 세 개의 나 (360) */
 window.wx360Page=function(r360,act,self){
  const AX={1:"① 일 맡기기",2:"② 평가하기",3:"③ 자원 나누기",4:"④ 설명하기"};
  const rows=[1,2,3,4].map(a=>{const sv=self[a]??null,ov=r360.other[a-1],av=act[a].v==null?null:Math.round(act[a].v*100);
   const lo=[sv,ov,av].filter(v=>v!=null),mn=Math.min(...lo),mxv=Math.max(...lo);const gap=sv!=null&&av!=null?sv-av:0;
   const note=av==null?"기록이 적어 판단하지 않습니다.":ov<av-15?"하신 일은 기록에 있습니다. 상대에게는 그만큼 전해지지 않았습니다.":ov>av+15?"사람들은 기록보다 후하게 보았습니다. 관계가 채워 준 몫이 있습니다.":"남이 본 모습과 기록이 비슷합니다.";
   let ev="";try{const L=evid(a,"L"),P=evid(a,"P");if(L.length||P.length)ev=`<details class="ref"><summary>근거가 된 결정</summary><p class="note">일치: ${esc(L.join(", ")||"없음")}</p><p class="note">균열: ${esc(P.join(", ")||"없음")}</p></details>`;}catch(e){}
   return `<div class="wx-ax"><b>${AX[a]}</b><div class="wx-db" role="img" aria-label="스스로 ${sv??"-"}, 남이 본 ${ov??"-"}, 실제 ${av??"-"}">${lo.length>1?`<i class="span${gap>=15?" gap":""}" style="left:${mn}%;width:${mxv-mn}%"></i>`:""}${sv!=null?`<i class="pt self" style="left:${sv}%"><em>${sv}</em></i>`:""}${ov!=null?`<i class="pt other" style="left:${ov}%"><em>${ov}</em></i>`:""}${av!=null?`<i class="pt act" style="left:${av}%"><em>${av}</em></i>`:""}</div>
    <p class="note0">${typeof axisBox==="function"&&sv!=null&&av!=null?esc(axisBox(sv,av))+" ":""}${note}</p>${ev}</div>`;}).join("");
  return `${EB("가상 360 피드백")}<h2>스스로 본 나, 남이 본 나, 실제로 한 행동</h2>
   <div class="wx-axleg"><span><i class="self"></i>스스로 본 나(자가진단)</span><span><i class="other"></i>남이 본 나(360)</span><span><i class="act"></i>실제로 한 행동</span><span class="sc">0 ─ 실무자 습관 · 리더 행동 ─ 100</span></div>
   <div class="wx-axs">${rows}</div>
   <div class="r360">${r360.R.map(x=>`<div class="c360"><b>${esc(x.label)}</b><span class="num">${x.s.map((v,i)=>"①②③④"[i]+" "+v.toFixed(1)).join(" · ")}</span><p class="voice" style="font-size:14.5px">"${esc(x.c[x.pick])}"</p>${x.extra?`<p class="voice" style="font-size:14.5px">"${esc(x.extra)}"</p>`:""}</div>`).join("")}</div>
   <p class="note0">간극은 실패의 증거가 아니라 성찰의 재료입니다.</p>${typeof forcedHtml==="function"?forcedHtml():""}`;};
 /* ⑧ 1년의 흔적 */
 window.wxTracePage=function(){const ps=Object.values(G.prom||{});const [kn,kt]=typeof knowPct==="function"?knowPct():[0,0];
  const prom=ps.map(p=>{let t=window.PROM_TXT&&PROM_TXT[p.id]?(p.status==="파기"?PROM_TXT[p.id][1]:PROM_TXT[p.id][0]):"";try{if(typeof PROM_TXT!=="undefined"&&PROM_TXT[p.id])t=p.status==="파기"?PROM_TXT[p.id][1]:PROM_TXT[p.id][0];}catch(e){}if(p.status==="진행 중")t="";if(p.status==="형식 이행")t=p.note||"표는 바뀌었습니다. 쏠림은 다른 곳으로 옮겨 갔습니다.";
   const cls=p.status==="이행"?"ok":p.status==="파기"?"bad":"mid";return `<div class="wx-pr ${cls}"><span class="st">${esc(p.status)}</span><div><b>${esc(p.text)}</b><small>상대: ${esc(p.to)}${t?" · "+esc(t):""}</small></div></div>`;}).join("");
  const bills=(G.bills||[]).map(b=>`<div class="wx-bl2"><b>📮 ${billMonth(b)}월 · ${esc(BILL[b]?BILL[b].t:b)}</b>${typeof causeHtml==="function"?causeHtml(b,billMonth(b)):""}</div>`).join("");
  let near="";if(!G.wowGot){const ax=[1,2,3,4].map(a=>({a,r:axScore(a)})).filter(x=>x.r.v!=null);if(ax.length&&ax.every(x=>x.r.v>=50)){const lo=ax.sort((p,q)=>p.r.v-q.r.v)[0];near=`<p class="note0">가장 아슬아슬했던 축: ${AXN[lo.a]} (리더 행동 ${lo.r.v}%)</p>`;}}
  const mem=["yoon","oh","han","kim","cha","bae"];
  const ppl=`${G.ends&&G.ends.mfg?`<div class="say">${face("mfg",G.trust.mfg)}<div><b>강태식</b><span>${esc(G.ends.mfg)}</span></div></div>`:""}${mem.map(k=>`<div class="say">${face(k)}<div><b>${esc(name(k))}</b><span>${esc((G.ends||{})[k]||"올해도 자기 자리에서 일하고 있습니다.")}${G.grades&&G.grades[k]&&G.grades[k].등급==="C"?" 등급은 C였습니다.":""}</span></div></div>`).join("")}`;
  return `${EB("약속 · 청구서 · 사람들")}<h2>1년의 흔적</h2>
   <div class="wx-trace"><div><h3 class="wx-h3">약속 장부</h3>${prom||'<p class="note0">맺은 약속이 없습니다.</p>'}
    <h3 class="wx-h3">도착한 청구서 ${(G.bills||[]).length}장</h3>${bills||'<p class="note0">청구서가 한 장도 오지 않았습니다.</p>'}${near}</div>
    <div><h3 class="wx-h3">1년 뒤 · 운영팀 30명</h3>${G.exodus&&(G.exodus.n||G.exodus.sick)?exodusHtml(G.exodus,{compact:true}):`<p class="note0">내년 1월에도 30명 모두 남습니다. 12월에 '이 팀에서 계속 일하고 싶다'는 ${G.exodus?G.exodus.S:"-"}이었습니다.</p>`}
    <h3 class="wx-h3">리더를 아는 정도 ${kn}/${kt}칸</h3>${typeof relationMap==="function"?relationMap():""}<div class="table">${ppl}</div></div></div>`;};
})();
