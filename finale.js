/* 결산 · 원고 03-13 (2-4의 G 순서) */
const REVIEW2=[["7-1 받은편지함","초록불은 사실일 수 있습니다. 그것을 확인해 줄 사람이 말을 하는지가 다른 문제입니다."],["M41 외부 AI 고백","말해 준 사람을 보호하는 일과 절차를 밟는 일은 같은 순서로 일어나야 합니다."],["7-2 F사 신규 제안","받을 일의 크기를 정한 것이 아니라, 지금 돌아가는 일 중 무엇을 밀지를 정한 것입니다."],["7-5 보고서 기명","이름을 쓰면 빠진 사람이 생기고, 이름을 빼면 아무도 하지 않은 일이 됩니다."],["8-1 본사 차출","권한 밖의 일에 한 약속은 권한 밖의 일로 깨집니다. 그때 무엇을 말할지는 권한 안의 일입니다."],["8-4 고객 데이터","일정과 신뢰가 아니라, 이번 한 번과 다음 모든 번을 바꾸는 결정이었습니다."],["8-5 자동화 확대","절감의 속도와 사람이 자기 일을 다시 찾는 속도는 다릅니다."],["9-1 새벽 장애","내가 들어가면 오늘 빨라집니다. 다음 새벽에 전화가 올지는 다른 곳에서 정해집니다."],["9-2 공로 인정","불 끄는 일을 칭찬할수록 불을 막는 사람의 시간이 사라집니다. 그래도 불은 꺼야 합니다."],["9-4 F사 클레임","오류를 인정하는 비용은 지금 나고, 넘기는 비용은 다음 계약에 납니다."],["10-2 수주 범위","큰 계약을 받는 날에 팀의 다음 해가 정해집니다."],["10-4 예산","어느 동맹의 손을 드는지가 아니라, 어떤 잣대를 쓰는지를 보여 준 결정이었습니다."],["11-2 우수 사례","표지는 작은 칸입니다. 그 칸에 누구 이름을 쓰는지를 모두가 봅니다."],["12-3 연말 평가","12월에 쓸 수 있는 기록은 1월부터 쌓은 것뿐입니다."],["12-4 이의 면담","등급을 바꿀 수는 없어도, 왜 그런지는 말할 수 있습니다. 말할 것이 있었는지는 앞선 열한 달이 정했습니다."]];
const TITLE_L={"기준을 보여주는 팀장":"무엇으로 정할지 먼저 말했고, 말한 대로 정했습니다.","조용한 팀의 팀장":"올해 팀은 조용했습니다.","약속을 지키는 팀장":"장부의 약속이 모두 지켜졌습니다.","혼자 다 하는 해결사":"문제는 풀렸습니다. 다음에 풀 사람은 아직 없습니다.","숫자를 믿는 심판":"숫자는 정확했습니다. 숫자에 없는 일은 없는 일이 되었습니다.","일을 부르는 팀장":"팀은 많은 일을 받았습니다. 무엇을 내려놓았는지는 적혀 있지 않습니다.","말 없는 실행가":"결정은 빨랐습니다. 이유는 소문이 대신 말했습니다.","줄 위의 팀장":"어느 쪽으로도 떨어지지 않았습니다."};
const PROM_TXT={P1:["3월에 알렸습니다.","구성원은 끝내 보지 못했습니다."],P2:["표가 바뀌었습니다.","표는 그대로였습니다."],P3:["올해는 지켰습니다.","8월의 공문에 그 사유가 있었습니다."],P4:["답을 주었습니다.","9월은 지나갔습니다."],P5:["맡겼습니다.","\"설계를 맡을 줄 알았습니다.\""],P6:["고쳤습니다.","10월은 지나갔습니다."],P7:["발표자 칸에 이름이 있었습니다.","다른 사람이 발표했습니다."],P8:["아직 지키는 중입니다.","—"]};
function consPct(){const c=G.cons;if(!c.length)return null;let n=0;c.forEach(x=>{if(x.fit)n+=x.half?.5:1;});return Math.round(n/c.length*100);}
function resultType(){
 const pr=G.prio,g=k=>G.score[k]-50;const avg=pr.reduce((a,k)=>a+g(k),0)/pr.length;
 const others=SCORES.filter(k=>!pr.includes(k));const c=G.cells||{};
 const talk=G.tu.all?(G.tu.exp+G.tu.meet)/G.tu.all:0;
 const al={성과:(c.GROW||0)+(c.AI||0)>=4,재무:!!(G.f.token_low||G.f.token_mid)&&!G.f.ct_cut&&!G.f.quote_cut,사람:G.over===0&&talk>=.4,안정:(c.SEC||0)+(c.RUN||0)>=4};
 const aligned=pr.every(k=>al[k]);
 if(others.some(k=>g(k)>avg+5))return["방향 이탈","고르지 않은 성적표가 더 크게 움직였습니다. 말한 우선순위와 쓴 자원이 달랐습니다."];
 if(avg>=10){if(others.some(k=>g(k)<=-15)||G.burnout>=4||G.over>=3)return["고른 두 장은 올렸지만 대가","고른 두 장은 올랐습니다. 다른 곳에서 치른 값을 함께 보세요."];if(aligned&&G.over<=1&&G.burnout<=2)return["정렬된 성공","고른 두 장이 실제로 올랐고, 자원도 그쪽에 놓였습니다."];return["궤도 진입","방향은 맞았습니다. 움직임은 아직 작습니다."];}
 if(avg>=3&&aligned)return["궤도 진입","방향은 맞았습니다. 움직임은 아직 작습니다."];
 return["표류","고른 두 장이 거의 움직이지 않았습니다."];
}
function titleOf(){
 const ax=[1,2,3,4].map(a=>({a,r:axScore(a)}));const pct=consPct()||0;
 if(ax.every(x=>x.r.v!=null&&x.r.v>=60)&&pct>=75&&(G.quality||0)>=60)return"기준을 보여주는 팀장";
 if(G.unsent.length>=5)return"조용한 팀의 팀장";
 const ps=Object.values(G.prom).filter(p=>p.status!=="진행 중");if(ps.length>=3&&ps.every(p=>p.status==="이행"))return"약속을 지키는 팀장";
 const low=ax.filter(x=>x.r.v!=null).sort((p,q)=>p.r.v-q.r.v)[0];
 if(low)return{1:"혼자 다 하는 해결사",2:"숫자를 믿는 심판",3:"일을 부르는 팀장",4:"말 없는 실행가"}[low.a];
 return"줄 위의 팀장";
}
function breaches(){const o=[];if(G.f.sec_breach)o.push("3월: 정보보안팀에 알리기 전에 우리가 먼저 범위를 파악하기로 했습니다."+(G.f.sec_breach_caught?"":" 이 일은 끝까지 아무도 몰랐습니다. 판정은 같습니다."));if(G.f.sec_hidden)o.push("7월: 한 선임의 외부 AI 입력을 보고받고 조치하지 않았습니다."+(G.f.sec_found?"":" 이 일은 끝까지 아무도 몰랐습니다. 판정은 같습니다."));if(G.f.sec_breach_data)o.push("8월: 승인 없이 고객 데이터를 외부 서비스로 돌렸습니다."+(G.f.sec_data_found?"":" 이 일은 끝까지 아무도 몰랐습니다. 판정은 같습니다."));if(G.f.inc_breach)o.push("9월: 긴급 승인 없이 우회 패치를 올렸습니다."+(G.f.inc_found?"":" 이 일은 끝까지 아무도 몰랐습니다. 판정은 같습니다.")+(G.f.inc_breach_nowrite?" 세 개의 설명에 쓰지 않았습니다.":""));return o;}
function evalAch(){const a=x=>{if(!G.ach.includes(x))G.ach.push(x);};
 if(G.f.planb_kpi&&G.f.planb_alloc&&G.f.planb_contract)a("깨질 것을 계획한 사람");if(G.f.renotice)a("다시 공지");
 const ps=Object.values(G.prom);if(ps.length>=3&&!G.broken)a("약속 장부 무결");if(!G.bills.length)a("청구서 0장");if(G.f.tae_end_ally)a("돌아온 선배");
 if(!G.f.cha_left&&!G.f.cha_end_gone)a("남겨진 사람");if(resultType()[0]==="정렬된 성공")a("정렬된 성공");
 if((G.hist||[]).every(h=>h.사람>=50)&&G.score.사람>=50)a("연쇄를 끊다");
 const wp=G.wrotePieces||{};if(["6-2","9-6","12-6"].every(k=>wp[k]&&wp[k].every(n=>n>=2)))a("세 개의 목소리");
}
function exportBundle(){const w=G.written;return JSON.stringify({선임다짐:G.pledge,우선순위:G.prio,우선순위변경:!!G.f.prio_changed,핵심과제:w.tasks,공개한기준:w.kpi,공개수준:G.f.pub_full?"전체":G.f.pub_items?"항목":"리더만",공지문:w.notice,"세개의설명6월":w["6-2"],"세개의설명9월":w["9-6"],"세개의설명12월":w["12-6"],반기회고:w.again,약속장부:G.prom,연말등급:G.grades,일관성:consPct(),기준의질:G.quality,기준미달:breaches(),AI검증:typeof verStats==="function"?{지표:verStats(),기록:G.ver||[]}:null,디브리핑:w.debrief,실행카드:w.action},null,2);}

/* 분기별 추이 차트: 네 성적표, 시작~4분기, 같은 축 0~100 */
function trendChart(){
 const h=G.hist||[],pts=[{q:"시작",v:{성과:50,재무:50,사람:50,안정:50}}].concat(h.map((x,i)=>({q:(i+1)+"분기",v:x})));
 const W=560,H=240,L=34,R=74,T=14,B=26,iw=W-L-R,ih=H-T-B;const X=i=>L+(pts.length>1?i*iw/(pts.length-1):iw/2),Y=v=>T+ih-(v/100)*ih;
 const col={성과:"var(--s1)",재무:"var(--s2)",사람:"var(--s3)",안정:"var(--s4)"};
 let svg=`<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="네 성적표의 분기별 추이">`;
 [0,25,50,75,100].forEach(v=>{svg+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${L-6}" y="${Y(v)+4}" text-anchor="end">${v}</text>`;});
 pts.forEach((p,i)=>{svg+=`<text x="${X(i)}" y="${H-8}" text-anchor="middle">${p.q}</text>`;});
 const ends=[];
 SCORES.forEach(k=>{const d=pts.map((p,i)=>`${i?"L":"M"}${X(i).toFixed(1)},${Y(p.v[k]).toFixed(1)}`).join("");svg+=`<path d="${d}" fill="none" stroke="${col[k]}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  const last=pts[pts.length-1];svg+=`<circle cx="${X(pts.length-1)}" cy="${Y(last.v[k])}" r="4" fill="${col[k]}" stroke="var(--panel)" stroke-width="2"/>`;ends.push({k,y:Y(last.v[k]),v:last.v[k]});});
 ends.sort((a,b)=>a.y-b.y);for(let i=1;i<ends.length;i++)if(ends[i].y-ends[i-1].y<14)ends[i].y=ends[i-1].y+14;
 ends.forEach(e=>{svg+=`<text class="lbl" x="${W-R+8}" y="${e.y+4}">${e.k} ${e.v}</text>`;});
 pts.forEach((p,i)=>{svg+=`<rect data-q="${i}" x="${X(i)-iw/(2*Math.max(1,pts.length-1))}" y="${T}" width="${iw/Math.max(1,pts.length-1)}" height="${ih}" fill="transparent"/>`;});
 svg+=`<line id="vx" x1="0" x2="0" y1="${T}" y2="${T+ih}" stroke="var(--muted)" stroke-width="1" opacity="0"/></svg>`;
 return {html:`<div>${svg}<div class="vtip" id="vtip" aria-live="polite">점에 마우스를 올리면 그 분기의 값을 보여 줍니다.</div></div>`,bind:()=>{const tip=$("vtip"),vx=$("vx");document.querySelectorAll(".viz rect[data-q]").forEach(r=>{const i=+r.dataset.q;const show=()=>{vx.setAttribute("x1",X(i));vx.setAttribute("x2",X(i));vx.setAttribute("opacity",".6");tip.textContent=pts[i].q+" · "+SCORES.map(k=>k+" "+pts[i].v[k]).join(" · ")+(pts[i].v.F사!=null?" · F사 만족 "+pts[i].v.F사:"");};r.addEventListener("mouseenter",show);r.addEventListener("touchstart",show,{passive:true});});}};
}
/* 리더 관계도: 동맹(실선), 갈등(점선), 끊긴 동맹(점선 회색) */
function relationMap(){
 const W=360,H=300,cx=W/2,cy=H/2+6,r=112,keys=["rd","mkt","prc","mfg","src"];const pos={};
 keys.forEach((k,i)=>{const a=-Math.PI/2+i*2*Math.PI/5;pos[k]=[cx+r*Math.cos(a),cy+r*Math.sin(a)];});
 const line=(a,b,st)=>`<line x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}" ${st}/>`;
 let svg=`<svg class="viz" viewBox="0 0 ${W} ${H}" role="img" aria-label="리더 관계도" style="max-width:380px">`;
 svg+=line("rd","mkt",'stroke="var(--accent)" stroke-width="2.5"');
 svg+=G.f.ally_broken?line("mfg","src",'stroke="var(--muted)" stroke-width="2" stroke-dasharray="2 5"'):line("mfg","src",'stroke="var(--accent)" stroke-width="2.5"');
 [["mfg","prc"],["mkt","prc"],["rd","src"]].forEach(([a,b])=>{svg+=line(a,b,'stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="6 5"');});
 keys.forEach(k=>{const [x,y]=pos[k];svg+=face(k,G.trust[k]).replace("<svg ",`<svg x="${x-22}" y="${y-30}" width="44" height="44" `);svg+=`<text class="lbl" x="${x}" y="${y+28}" text-anchor="middle">${LD[k].n} ${G.trust[k]}</text>`;});
 svg+=`</svg>`;
 return `<div>${svg}<p class="note">실선: 동맹 · 붉은 점선: 갈등${G.f.ally_broken?" · 회색 점선: 12월에 끊긴 동맹":""}</p></div>`;
}
function safeSpark(){const h=(G.hist||[]).map(x=>x.안전).filter(v=>v!=null);const vals=[50].concat(h);const W=240,H=60;const X=i=>8+i*(W-16)/Math.max(1,vals.length-1),Y=v=>H-8-(v/100)*(H-16);
 return `<svg class="viz" viewBox="0 0 ${W} ${H}" style="max-width:260px" aria-label="심리적 안전의 분기별 변화"><polyline points="${vals.map((v,i)=>X(i)+","+Y(v)).join(" ")}" fill="none" stroke="currentColor" stroke-width="2"/>${vals.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="3" fill="currentColor"/>`).join("")}</svg>`;}
function SC_FINALE(s){
 let page=0;evalAch();const N=12;
 const nb=(t)=>`<div class="foot"><span class="note num">${page+1}/${N}</span>${BTN(()=>{page++;draw();},t||"다음","main")}</div>`;
 const row=(a,b)=>`<div class="card" style="display:flex;justify-content:space-between;gap:12px"><span style="font-size:14px;color:var(--ink)">${a}</span><b style="font-size:15px;text-align:right">${b}</b></div>`;
 const draw=()=>{paint("");window.scrollTo(0,0);const br=breaches(),ty=resultType(),ti=titleOf();
  if(page===0)shell(`<div class="pane"><div class="eyebrow">📘 온보딩 노트④</div><h2>원인과 결과 사이의 시간</h2><div class="prose"><p>Sterman(1989)은 사람들이 결정과 결과 사이의 시간이 길어질수록 피드백을 잘못 읽는다는 것을 실험으로 보였습니다. 결과가 늦게 오면 사람들은 지금의 결과를 지금의 결정 탓으로 돌립니다. 어제의 결정은 잊습니다.</p><p>올해 받은 청구서를 떠올려 보세요. 도착한 달에 무엇을 하고 있었습니까. 그 청구서의 원인은 언제 생겼습니까.</p><p><b>마지막 질문: 올해의 일 가운데, 잘했다고 믿고 있지만 아직 청구서가 오지 않은 것은 무엇입니까?</b></p></div>${nb()}</div>`);
  else if(page===1)shell(`<div class="pane"><div class="eyebrow">결산</div><h2 style="font-size:28px">${br.length?"기준 미달":"기준 통과"}</h2><div class="prose">${br.length?`<p>다른 점수와 관계없이, 아래의 선택은 넘어서는 안 되는 선을 넘었습니다.</p>${br.map(x=>`<p>${x}</p>`).join("")}`:"<p>올해 장애 절차와 보안 기준을 벗어난 선택이 없었습니다.</p>"}</div>${nb()}</div>`);
  else if(page===2){const h=[...(G.hist||[])];const ch=trendChart();shell(`<div class="pane"><div class="eyebrow">칭호</div><h2>${ti}</h2><p class="voice">${TITLE_L[ti]}</p>${ch.html}
   <div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:14px;min-width:320px;width:100%"><thead><tr><th style="text-align:left;padding:4px 8px">성적표</th>${["시작","1분기","2분기","3분기","4분기"].map(q=>`<th style="padding:4px 8px" class="num">${q}</th>`).join("")}</tr></thead><tbody>${SCORES.concat(["F사","F사기대"]).map(k=>`<tr style="border-top:1px solid var(--line)"><td style="padding:4px 8px">${k==="F사"?"F사 만족":k==="F사기대"?"F사 기대":k}</td><td class="num" style="text-align:center">50</td>${[0,1,2,3].map(i=>`<td class="num" style="text-align:center">${h[i]?h[i][k]:"-"}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
   ${(G.chain||[]).map(chainLine).filter(Boolean).map(t=>`<p class="note">${t}</p>`).join("")}${(G.fexpLog||[]).length?`<details class="ref"><summary>F사 기대가 움직인 결정</summary><p class="note" style="margin-top:6px">${G.fexpLog.map(x=>`${x.m}월 ${x.t} → 기대 ${x.d>0?"+":""}${x.d}`).join("<br>")}</p><p class="note">약속을 키우면 같은 안정 점수도 불만이 됩니다.</p></details>`:""}${nb()}</div>`);ch.bind();}
  else if(page===3)shell(`<div class="pane"><div class="eyebrow">결과 유형</div><div class="happen"><span class="label">1월의 다짐</span><span class="voice">${G.pledge}</span></div><h2>${ty[0]}</h2><p>${ty[1]}</p><p class="note">우선순위: ${G.prio.join(", ")}${G.f.prio_changed?" (6월에 우선순위를 바꿈)":""}</p>${nb()}</div>`);
  else if(page===4){const n=G.unsent.length;shell(`<div class="pane" style="background:var(--ink);color:var(--panel);border-radius:4px"><div class="eyebrow" style="color:inherit;opacity:.7">보내지 않은 메시지</div><h2>올해 당신의 받은편지함에 도착하지 않은 메시지가 ${n}건 있었습니다.</h2><div class="prose">${G.unsent.map(x=>`<p class="voice">${x}</p>`).join("")}<div style="color:inherit">${safeSpark()}</div><p>${n?(G.f.quiet_inbox?`그해 7월, 받은편지함은 ${CONTENT.find(x=>x.id==="7-1").mail.filter(m=>G.f["got_"+m.id]).length}건이었습니다. 10시 전에 비었습니다.`:""):"올해는 말하려던 것이 모두 도착했습니다. 시끄러웠던 받은편지함을 기억하시나요."}</p></div><div class="foot"><span></span>${BTN(()=>{page++;draw();},"다음")}</div></div>`);}
  else if(page===5)shell(`<div class="pane"><div class="eyebrow">네 개의 축</div><h2>간극은 실패의 증거가 아니라 성찰의 재료입니다.</h2><div class="table">${[1,2,3,4].map(a=>{const r=axScore(a),d=G.diag?G.diag[a]:50,self=d>=50,act=(r.v||0)>=50;const box=self&&act?"알고 있는 강점. 그렇게 믿었고, 기록도 그렇습니다.":self?"맹점. 그렇게 믿었습니다. 기록은 다릅니다.":act?"숨은 강점. 스스로 생각한 것보다 기록이 낫습니다.":"알고 있는 과제. 스스로도 알고 있었고, 기록도 그렇습니다.";
   const h1=axScore(a,(x,i)=>i<(G.h2At||0)),h2=axScore(a,(x,i)=>i>=(G.h2At||0));
   return `<div class="task"><b>${AXN[a]}</b><p class="num">자가진단 ${d}% · 실제 행동 ${r.v==null?"-":r.v+"%"}</p><p>${box}</p><p class="note">일치: ${evid(a,"L").join(", ")||"없음"}</p><p class="note">균열: ${evid(a,"P").join(", ")||"없음"}</p>${G.h2_focus===a?`<p class="note">바꾸기로 한 습관입니다. 상반기 ${h1.v==null?"-":h1.v+"%"} → 하반기 ${h2.v==null?"-":h2.v+"%"}</p><p class="note">6월에 쓴 행동: "${G.written.again?G.written.again.행동:""}"</p>`:""}</div>`}).join("")}</div>${nb()}</div>`);
  else if(page===6){const miss=Object.entries(G.billP||{}).filter(([b,p])=>!G.bills.includes(b)&&p>=40);
   let near="";if(!G.wowGot){const ax=[1,2,3,4].map(a=>({a,r:axScore(a)})).filter(x=>x.r.v!=null);if(ax.length&&ax.every(x=>x.r.v>=50)){const lo=ax.sort((p,q)=>p.r.v-q.r.v)[0];near=`<p class="note">가장 아슬아슬했던 축: ${AXN[lo.a]} (리더 쪽 ${lo.r.v}%)</p>`;}}
   shell(`<div class="pane"><div class="eyebrow">청구서</div><h2>올해 도착한 청구서 ${G.bills.length}장</h2><div class="table">${G.bills.map(b=>{const at=(G.billAt&&G.billAt[b])||12;return `<div class="task"><b>${BILL[b].t} · ${at}월 도착</b>${causeHtml(b,at)}</div>`;}).join("")||'<p class="note">없습니다.</p>'}</div>
   <h2 style="font-size:18px">아슬아슬하게 피한 청구서</h2><div class="table">${miss.map(([b,p])=>row(BILL[b].t,p+"%")).join("")||'<p class="note">거의 위험이 없었습니다.</p>'}</div>${near}${nb()}</div>`);}
  else if(page===7){const ps=Object.values(G.prom);shell(`<div class="pane"><div class="eyebrow">약속 장부</div><h2>올해 한 약속</h2><div class="ledger">${ps.map(p=>{let t=PROM_TXT[p.id]?(p.status==="파기"?PROM_TXT[p.id][1]:PROM_TXT[p.id][0]):"";if(p.id==="P3"&&p.status==="파기"&&G.f.p3_owned)t="지키지 못했다고 직접 썼습니다.";if(p.status==="진행 중")t="진행 중";if(p.status==="형식 이행")t=p.note||"표는 바뀌었습니다. 쏠림은 다른 곳으로 옮겨 갔습니다.";return `<div>${p.text}<small>상대: ${p.to} · ${p.status}${t&&t!=="진행 중"?" · "+t:""}</small></div>`;}).join("")||'<p class="note">맺은 약속이 없습니다.</p>'}</div>${nb()}</div>`);}
  else if(page===8){const m=["yoon","oh","han","kim","cha","bae"];shell(`<div class="pane"><div class="eyebrow">사람들</div><h2>1년 뒤</h2>${relationMap()}<div class="table">${G.ends.mfg?`<div class="say">${face("mfg",G.trust.mfg)}<div><b>강태식</b><span>${G.ends.mfg}</span></div></div>`:""}${m.map(k=>`<div class="say">${face(k)}<div><b>${name(k)}</b><span>${G.ends[k]||"올해도 자기 자리에서 일하고 있습니다."}${G.grades[k]&&G.grades[k].등급==="C"?" 등급은 C였습니다.":""}</span></div></div>`).join("")}</div>${nb()}</div>`);}
  else if(page===9){const pct=consPct();const n3=(G.goal3&&G.goal3.three);shell(`<div class="pane"><div class="eyebrow">학습 목표</div><h2>성적표가 게임의 결과라면, 아래는 학습의 결과입니다. 둘은 다를 수 있습니다.</h2><div class="table">
   ${G.ds&&(G.ds.f+G.ds.p)?row("위임의 네 요소",`함께 전한 위임 ${G.ds.f}건 중 되돌아온 일 ${G.ds.bf}건 · 전하지 않은 위임 ${G.ds.p}건 중 되돌아온 일 ${G.ds.bp}건`):""}
   ${row("① 분석",(G.f.urgent_task?"시급한 일을 과제로 삼음":"과제 선택 충족")+" · 근거 문장 사람 채점 대기")}
   ${row("② 정렬",G.goal2?"충족":"미충족")}
   ${row("③ 결정",(n3?"세 기준 포함":"세 기준 미포함")+" · 공지문 사람 채점 대기"+(G.f.sec_breach_data||G.f.sec_hidden?" · 승인되지 않은 데이터 사용":""))}
   ${row("④ 판단",`일관성 ${pct==null?"-":pct+"%"} · 기준의 질 ${G.quality==null?"-":G.quality}${(pct||0)>=75&&(G.quality||0)<60?" · 일관성은 높지만 기준의 질은 낮음":""}${br.length?" · 절차·보안 기준 미달":""}`)}
   ${row("⑤ 조율",[["6-2","6월"],["9-6","9월"],["12-6","12월"]].map(([k,m])=>m+" 설명 "+(G.wrote[k]!=null?G.wrote[k]+"/9":"-")).join(" · ")+" · 사람 채점 대기")}
   ${row("⑥ 평가",`근거 충족 ${G.evalGood||0}/${G.evalN||11} · ${G.appeal0?("이의제기 0건 ("+(G.appeal0==="침묵"?"말하지 않은 사람이 있었음":"근거가 충족됨")+")"):"이의 면담 "+(G.appealOK?"기록 제시":"기록 미제시")}${G.f.kpi_order?" · KPI 순서대로":""}`)}
   </div>
   ${typeof verHtml==="function"?verHtml():""}
   ${(G.badEvid||[]).length?`<h2 style="font-size:18px">쓰면 안 되는 근거</h2><p>12월에 근거로 고른 다음 기록은 등급의 근거가 될 수 없습니다.</p><div class="prose" style="font-size:14.5px">${G.badEvid.map(x=>`<p>${x}</p>`).join("")}</div><div class="table">${[["투입 시간","오래 일한 것은 무엇을 해냈는지를 말해 주지 않습니다. 6월 지침에서 제외되었습니다."],["병가·휴직","아픈 것은 평가 대상이 아닙니다."],["익명 글·소문","확인되지 않은 일이고, 글쓴이를 추정한 것은 쓸 수 없습니다."],["내부 제보·반대 의견","말한 사람이 등급으로 불이익을 받으면 다음 사람은 말하지 않습니다."],["이동·이직 의사","앞날에 대한 의사이지 올해의 기여가 아닙니다."]].map(([a,b])=>`<div class="task"><b>${a}</b><span class="note">${b}</span></div>`).join("")}</div>`:""}
   <p class="note">업적: ${G.ach.join(", ")||"없음"}</p>${window.SEEDED?`<p class="note">진단 모드 · 시드 ${window.SEEDED}: 같은 선택을 하면 같은 확률 결과가 나옵니다.</p>`:`<p class="note">확률로 일어난 일은 "일어난 일" 화면에 따로 표시했습니다. 같은 선택도 회차마다 결과가 다를 수 있습니다. 평가 도구로 쓸 때는 주소 끝에 ?seed=숫자 를 붙여 진단 모드로 실행하세요.</p>`}${nb()}</div>`);}
  else if(page===10){const keyOf=r=>r[0].split(" ")[0];const hot=r=>G.sig.some(x=>x.scene.startsWith(keyOf(r)));const all=REVIEW1.concat(REVIEW2);const first=all.filter(hot).slice(0,8),rest=all.filter(r=>!first.includes(r));
   shell(`<div class="pane"><div class="eyebrow">1년 결정 복기</div><h2>그 결정이 무엇과 무엇을 바꿨는가</h2><div class="prose" style="font-size:15px">${first.map(r=>`<p><b>${stripId(r[0])}</b> ${r[1]}</p>`).join("")}</div><details class="ref"><summary>전체 보기</summary><div class="prose" style="font-size:15px;margin-top:8px">${rest.map(r=>`<p><b>${stripId(r[0])}</b> ${r[1]}</p>`).join("")}</div></details>${nb()}</div>`);}
  else{
   const qs=["끝난 지금 가장 많이 남아 있는 장면은 무엇입니까?","1월의 다짐을 다시 읽어 보세요. 어느 문장이 지켜졌고 어느 문장이 지켜지지 않았습니까?","가장 아팠던 청구서의 원인이 된 결정을 내릴 때 무엇을 맞다고 믿었습니까? 그 믿음은 지금까지 어디서 통했습니까?","실제 팀의 안건 하나를 고른다면 무엇입니까? 기준을 먼저 공개한다면 언제, 누구에게, 어떤 말로 하겠습니까?"];
   shell(`<div class="pane"><div class="eyebrow">디브리핑과 실행 카드</div><h2>실제 팀으로</h2>${qs.map((q,i)=>`<label class="label" for="db${i+1}">${q}</label><textarea id="db${i+1}"></textarea>`).join("")}${G.unsent.length?'<p class="note">보내지 않은 메시지가 있었습니다. 그 사람은 왜 말하지 않았을까요?</p>':""}${G.f["c_3-7_C"]?`<div class="happen"><span class="label">다시 보기: 3월 배 책임</span>질문을 미루고 가공 이동 이야기를 먼저 했을 때, 그 자리의 표정은 풀렸고 사람 점수도 올랐습니다. 12월에 배 책임은 ${G.baeAppeal?"다시 이의를 냈습니다":"이의를 내지 않았습니다"}. 그날 풀린 것은 무엇이었고, 미뤄진 것은 무엇이었습니까?</div><label class="label" for="db5">그날의 선택을 다시 한다면</label><textarea id="db5"></textarea>`:""}
   <h2 style="font-size:18px">실행 카드</h2>${[["내 팀의 안건 1개","예: 3월 KPI 합의 때 기여 기준 공개"],["무엇을 언제 공개하는가","날짜까지 쓰세요"],["결정 뒤 누구에게 어떻게 설명하는가","대상을 쓰세요"],["바꿀 습관 하나","네 축 중 하나"]].map((q,i)=>`<label class="label" for="ac${i+1}">${q[0]}</label><textarea id="ac${i+1}" placeholder="${q[1]}" style="min-height:52px"></textarea>`).join("")}
   <p class="note">30일 뒤 동료 코칭 · 90일 뒤 행동 진단 재측정 · 12월 평가 시즌 전 리마인드</p>
   <p class="note">원하면 애니어그램 같은 자기이해의 언어로 자신의 선택 패턴을 돌아볼 수 있습니다. 점수와 판정에는 쓰지 않습니다.</p>
   <h2 style="font-size:18px">채점용 응답 묶음</h2><p class="note">선임 다짐, 핵심 과제와 근거, 공개한 기준, 공지문, 세 개의 설명 9편, 반기 회고, 약속 장부, 디브리핑 답변이 들어 있습니다. 자가진단 답은 포함하지 않습니다. 복사해서 담당자에게 보내 주세요.</p>
   <div class="btns">${BTN(()=>{G.written.debrief=[1,2,3,4,5].map(i=>$("db"+i)?$("db"+i).value:"").filter((x,i)=>i<4||x);G.written.action=[1,2,3,4].map(i=>$("ac"+i).value);const t=exportBundle();$("exp").value=t;$("exp").hidden=false;$("exp").select();if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast("복사했습니다."),()=>toast("아래 칸을 선택해 복사해 주세요."));else toast("아래 칸을 선택해 복사해 주세요.");},"응답 묶음 복사","main")}${BTN(()=>{clearSave();G=newGame();G.idx=0;render();window.scrollTo(0,0);},"다른 경로로 다시 하기")}</div>
   <p class="note">같은 1년을 다르게 살아 볼 수 있습니다. 다른 사람이 다른 메시지를 보내올 것입니다.</p>
   <textarea id="exp" hidden style="min-height:160px;font-family:var(--mono);font-size:12px" aria-label="채점용 응답 묶음"></textarea>
   <p class="voice">내일 아침 8시 40분, 당신의 받은편지함에는 몇 통이 와 있을까요. 몇 통이 오지 않았을까요.</p></div>`);
  }
 };
 draw();
}
