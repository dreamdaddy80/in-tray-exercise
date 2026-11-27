/* 5단계 (2026-11-27): 인생극장 갈림길 선정 규칙. 순수 함수입니다(게임 상태를 읽거나 바꾸지 않습니다).
   입력
     cands: 이번 라운드 결정 후보 [{scene, choice, order, label, line, viol, mag, opts:[{k, viol, best, mag}]}]
       viol: 이 결정이 선을 넘었는가, line: 넘은 선 이름, mag: 내 선택의 계기판 네 축 변화 크기 합
       opts: 그 장면의 선택지. viol은 선을 넘는 선택지, best는 좋은 리더의 선택, mag는 그 선택지의 변화 크기 합
     fallback: 후보가 없을 때 쓸 {scene, choice}
   규칙
     1) 선을 넘은 결정이 있으면 가장 먼저 일어난 것을 고른다.
     2) 없으면 변화 크기 합(mag)이 가장 큰 결정을 고른다. 같으면 먼저 일어난 것.
     3) 후보가 없으면 fallback.
   가지 않은 길
     선을 넘은 결정이면: 선을 넘지 않는 선택지 중 좋은 리더의 선택을 먼저, 없으면 선택지 순서상 첫 번째.
     아니면: 내 선택이 좋은 리더의 선택이 아니면 그 선택. 맞으면 변화 크기 차이가 가장 큰 다른 선택지(같으면 순서상 앞). */
(function(root,factory){const f=factory();if(typeof module==="object"&&module.exports)module.exports=f;else{root.cinePick=f.cinePick;root.cineAlt=f.cineAlt;}})(typeof window!=="undefined"?window:this,function(){
 "use strict";
 const eul=t=>{const c=String(t||"").replace(/[^가-힣0-9A-Za-z]+$/,"").slice(-1).charCodeAt(0);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28?"을":"를";};
 function cineAlt(c){
  const opts=(c&&c.opts)||[];const mine=opts.find(o=>o.k===c.choice)||{k:c&&c.choice,mag:c&&c.mag||0};
  const others=opts.filter(o=>o.k!==mine.k);
  if(!others.length)return null;
  if(c.viol){const ok=others.filter(o=>!o.viol);if(!ok.length)return null;return (ok.find(o=>o.best)||ok[0]).k;}
  if(!mine.best){const b=others.find(o=>o.best&&!o.viol);if(b)return b.k;}
  let pick=null,gap=-1;others.forEach(o=>{if(o.viol)return;const g=Math.abs((o.mag||0)-(mine.mag||0));if(g>gap){gap=g;pick=o;}});
  return pick?pick.k:null;}
 function cinePick(inp){
  const cs=((inp&&inp.cands)||[]).filter(c=>c&&c.scene&&c.choice&&Array.isArray(c.opts)&&c.opts.length>=2).slice().sort((a,b)=>(a.order||0)-(b.order||0));
  let sel=null,why="fallback";
  const v=cs.filter(c=>c.viol);
  if(v.length){sel=v[0];why="violation";}
  else if(cs.length){let m=-1;cs.forEach(c=>{const x=c.mag||0;if(x>m){m=x;sel=c;}});why="magnitude";}
  if(!sel){const f=(inp&&inp.fallback)||null;return f?{scene:f.scene,choice:f.choice||null,alt:null,why:"fallback",reason:"선정 이유: 비교할 결정 기록이 부족해 KPI 공개 범위를 보여 줍니다."}:null;}
  const alt=cineAlt(sel);
  const nm=sel.label?`'${sel.label}'`:"이 결정";
  const reason=why==="violation"
   ?`선정 이유: 이번 라운드에서 선${sel.line?`(${sel.line})`:""}을 넘은 결정이 ${nm}입니다. 선을 넘은 결정을 가장 먼저 봅니다. 가지 않은 길은 선을 넘지 않는 선택지입니다.`
   :`선정 이유: 이번 라운드에 선을 넘은 결정이 없어, 계기판 네 축을 가장 크게 움직인 결정 ${nm}${eul(sel.label||"결정")} 골랐습니다(변화 크기 합 ${sel.mag||0}).`;
  return {scene:sel.scene,choice:sel.choice,alt,why,reason,mag:sel.mag||0,line:sel.line||""};}
 return {cinePick,cineAlt};
});
