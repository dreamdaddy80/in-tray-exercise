/* ===== 배경 음악 (2026-11-26) =====
   - 외부 음원 없이 Web Audio로 그 자리에서 연주한다(저작권·용량·네트워크 걱정 없음).
   - 평상시: 라운드마다 다른 잔잔한 곡. Round 1 "아침 출근", Round 2 "한낮의 협업", Round 3 "겨울의 마무리".
   - 돌발(장애·보안 사고·임원 전화·속보) 장면에서는 긴박한 곡으로 바뀌고, 장면이 끝나면 원래 곡으로 돌아온다.
   - "소리"가 꺼져 있거나 메뉴의 "배경 음악"을 끄면 멈춘다(ftm_bgm). 브라우저 정책상 첫 클릭 뒤에 시작한다.
   게임 규칙·점수·결과 코드는 건드리지 않는다. */
(function(){
 const ACx=window.AudioContext||window.webkitAudioContext;
 const LS="ftm_bgm";
 const pref=()=>{try{return localStorage.getItem(LS)!=="off";}catch(e){return true;}};
 const setPref=v=>{try{localStorage.setItem(LS,v?"on":"off");}catch(e){}};
 const mtof=m=>440*Math.pow(2,(m-69)/12);
 const N={C:0,"C#":1,Db:1,D:2,"D#":3,Eb:3,E:4,F:5,"F#":6,Gb:6,G:7,"G#":8,Ab:8,A:9,"A#":10,Bb:10,B:11};
 const n=s=>{const m=s.match(/^([A-G][#b]?)(-?\d)$/);return 12*(+m[2]+1)+N[m[1]];};

 /* ---------- 악기 ---------- */
 let noiseBuf=null;
 function noise(ctx){if(noiseBuf&&noiseBuf.sampleRate===ctx.sampleRate)return noiseBuf;const b=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;noiseBuf=b;return b;}
 function env(g,t,a,peak,hold,rel){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.setValueAtTime(peak,t+a+hold);g.gain.exponentialRampToValueAtTime(0.0001,t+a+hold+rel);}
 const I={
  /* 부드러운 패드: 살짝 어긋난 두 음색 + 저역 필터 */
  pad(ctx,bus,t,notes,dur,vol){const f=ctx.createBiquadFilter();f.type="lowpass";f.frequency.value=1000;f.Q.value=.4;const g=ctx.createGain();env(g,t,Math.min(.9,dur*.3),vol,Math.max(.1,dur-1.1),1.2);f.connect(g);g.connect(bus.dry);g.connect(bus.wet);
   notes.forEach(m=>{[["triangle",-5],["sawtooth",6]].forEach(([ty,dt],i)=>{const o=ctx.createOscillator();o.type=ty;o.frequency.value=mtof(m);o.detune.value=dt;const og=ctx.createGain();og.gain.value=i?.18:.5;o.connect(og);og.connect(f);o.start(t);o.stop(t+dur+1.4);});});},
  /* 칼림바·실로폰 같은 맑은 음 */
  tine(ctx,bus,t,m,vol){const f=mtof(m);const g=ctx.createGain();env(g,t,.004,vol,.0,1.1);g.connect(bus.dry);g.connect(bus.wet);
   const o=ctx.createOscillator();o.type="sine";o.frequency.value=f;o.connect(g);o.start(t);o.stop(t+1.3);
   const g2=ctx.createGain();env(g2,t,.002,vol*.35,0,.16);g2.connect(bus.dry);const o2=ctx.createOscillator();o2.type="sine";o2.frequency.value=f*4.01;o2.connect(g2);o2.start(t);o2.stop(t+.3);},
  /* 둥근 베이스 */
  bass(ctx,bus,t,m,dur,vol){const f=ctx.createBiquadFilter();f.type="lowpass";f.frequency.value=420;const g=ctx.createGain();env(g,t,.02,vol,Math.max(.05,dur*.6),dur*.5);f.connect(g);g.connect(bus.dry);
   const o=ctx.createOscillator();o.type="triangle";o.frequency.value=mtof(m);o.connect(f);o.start(t);o.stop(t+dur*1.3);},
  /* 셰이커 */
  shaker(ctx,bus,t,vol){const s=ctx.createBufferSource();s.buffer=noise(ctx);const f=ctx.createBiquadFilter();f.type="highpass";f.frequency.value=6500;const g=ctx.createGain();env(g,t,.008,vol,0,.06);s.connect(f);f.connect(g);g.connect(bus.dry);s.start(t,Math.random()*.5,.12);},
  /* 긴박: 째깍이는 하이햇 */
  tick(ctx,bus,t,vol){const s=ctx.createBufferSource();s.buffer=noise(ctx);const f=ctx.createBiquadFilter();f.type="highpass";f.frequency.value=9000;const g=ctx.createGain();env(g,t,.002,vol,0,.035);s.connect(f);f.connect(g);g.connect(bus.dry);s.start(t,Math.random()*.5,.06);},
  /* 긴박: 낮은 북 */
  drum(ctx,bus,t,vol){const o=ctx.createOscillator();o.type="sine";o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(42,t+.18);const g=ctx.createGain();env(g,t,.003,vol,0,.32);o.connect(g);g.connect(bus.dry);o.start(t);o.stop(t+.4);},
  /* 긴박: 필터가 열리고 닫히는 펄스 베이스 */
  pulse(ctx,bus,t,m,vol){const o=ctx.createOscillator();o.type="sawtooth";o.frequency.value=mtof(m);const f=ctx.createBiquadFilter();f.type="lowpass";f.Q.value=6;f.frequency.setValueAtTime(900,t);f.frequency.exponentialRampToValueAtTime(160,t+.12);const g=ctx.createGain();env(g,t,.004,vol,.02,.1);o.connect(f);f.connect(g);g.connect(bus.dry);o.start(t);o.stop(t+.2);},
  /* 긴박: 짧은 현악 스탭 */
  stab(ctx,bus,t,notes,vol){const f=ctx.createBiquadFilter();f.type="lowpass";f.frequency.setValueAtTime(2600,t);f.frequency.exponentialRampToValueAtTime(700,t+.25);const g=ctx.createGain();env(g,t,.01,vol,.05,.22);f.connect(g);g.connect(bus.dry);g.connect(bus.wet);
   notes.forEach(m=>{const o=ctx.createOscillator();o.type="sawtooth";o.frequency.value=mtof(m);o.detune.value=(Math.random()-.5)*10;o.connect(f);o.start(t);o.stop(t+.45);});}
 };

 /* ---------- 곡 ---------- */
 const pick=a=>a[Math.floor(Math.random()*a.length)];
 const T={
  r1:{name:"아침 출근",bpm:84,steps:16,chords:[["C3","E4","G4","D5"],["G2","B3","D4","A4"],["A2","C4","E4","B4"],["F2","A3","C4","E4"]],
   scale:["C5","D5","E5","G5","A5","C6"],arp:[0,null,1,null,2,null,1,null,3,null,2,null,1,null,2,null],
   step(ctx,bus,t,s,bar,ch,sec){const c=ch.map(n);if(s===0){I.pad(ctx,bus,t,c.slice(1),sec*16,.032);I.bass(ctx,bus,t,c[0],sec*6,.085);}
    if(s===8)I.bass(ctx,bus,t,c[0]+12,sec*5,.05);
    const a=this.arp[s];if(a!=null)I.tine(ctx,bus,t,c[1+(a%3)]+12,.05);
    if(s%4===2)I.shaker(ctx,bus,t,.018);
    if((s===6||s===14)&&Math.random()<.55)I.tine(ctx,bus,t+sec*.02,n(pick(this.scale)),.04);}},
  r2:{name:"한낮의 협업",bpm:96,steps:16,chords:[["G2","B3","D4","F#4"],["A2","C#4","E4","B4"],["F#2","A3","C#4","E4"],["B2","D4","F#4","A4"]],
   scale:["D5","E5","F#5","A5","B5","D6"],arp:[0,null,null,1,null,null,2,null,0,null,null,1,null,2,null,null],
   step(ctx,bus,t,s,bar,ch,sec){const c=ch.map(n);if(s===0){I.pad(ctx,bus,t,c.slice(1),sec*16,.026);}
    if(s===0||s===6||s===10)I.bass(ctx,bus,t,c[0],sec*(s===0?5:3),.08);
    const a=this.arp[s];if(a!=null)I.tine(ctx,bus,t,c[1+a]+12,.048);
    if(s%2===1)I.shaker(ctx,bus,t,s%4===3?.02:.011);
    if(s===12&&Math.random()<.6){const m=n(pick(this.scale));I.tine(ctx,bus,t,m,.038);I.tine(ctx,bus,t+sec*2,m+(Math.random()<.5?2:-3),.03);}}},
  r3:{name:"겨울의 마무리",bpm:72,steps:16,chords:[["D2","F3","A3","E4"],["A#1","D3","F3","A3"],["F2","A3","C4","G4"],["C2","E3","G3","D4"]],
   scale:["F5","G5","A5","C6","D6"],arp:[0,null,null,null,1,null,null,null,2,null,null,null,1,null,null,null],
   step(ctx,bus,t,s,bar,ch,sec){const c=ch.map(n);if(s===0){I.pad(ctx,bus,t,c.slice(1),sec*16,.04);I.bass(ctx,bus,t,c[0],sec*10,.08);}
    const a=this.arp[s];if(a!=null)I.tine(ctx,bus,t,c[1+a]+12,.045);
    if(s===10&&Math.random()<.7)I.tine(ctx,bus,t,n(pick(this.scale)),.035);}},
  urgent:{name:"긴박",bpm:128,steps:16,chords:[["D2","D4","F4","A4"],["A#1","D4","F4","A#4"],["G2","D4","G4","A#4"],["A1","C#4","E4","A4"]],
   motif:["D5","F5","E5","A4","D5","F5","G5","E5"],
   step(ctx,bus,t,s,bar,ch,sec){const c=ch.map(n);
    I.pulse(ctx,bus,t,c[0]+12*(s%8===7?1:0),s%4===0?.11:.075);
    if(s%4===0)I.drum(ctx,bus,t,s%8===0?.32:.18);
    I.tick(ctx,bus,t,s%2?.03:.016);
    if(s===0||s===6)I.stab(ctx,bus,t,c.slice(1),.03);
    if(s%2===0&&bar%2===1){const m=n(this.motif[s/2]);I.tine(ctx,bus,t,m,.03);}}}
 };
 window.BGM_TRACKS=T;

 /* ---------- 연주기 ---------- */
 let ctx=null,master=null,wetIn=null,timer=null,current=null;const players=[];
 function impulse(c,dur,decay){const len=Math.floor(c.sampleRate*dur);const b=c.createBuffer(2,len,c.sampleRate);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,decay);}return b;}
 function graph(c,outVol){const comp=c.createDynamicsCompressor();comp.threshold.value=-22;comp.ratio.value=3;comp.attack.value=.01;comp.release.value=.25;
  const m=c.createGain();m.gain.value=outVol;const rv=c.createConvolver();rv.buffer=impulse(c,2.4,2.6);const rg=c.createGain();rg.gain.value=.28;
  m.connect(comp);rv.connect(rg);rg.connect(comp);comp.connect(c.destination);return {master:m,wet:rv};}
 function busFor(c,m,w){const g=c.createGain();g.gain.value=0.0001;const dry=c.createGain(),wet=c.createGain();wet.gain.value=.55;dry.connect(g);wet.connect(w);g.connect(m);return {gain:g,dry,wet};}
 function init(){if(ctx)return true;if(!ACx)return false;try{ctx=new ACx();}catch(e){return false;}const gr=graph(ctx,.0001);master=gr.master;wetIn=gr.wet;return true;}
 function startTrack(key){
  if(!init())return;const tr=T[key];if(!tr)return;
  const bus=busFor(ctx,master,wetIn);const p={key,tr,bus,step:0,next:ctx.currentTime+.08,dead:false};
  const fadeIn=key==="urgent"?.6:2.4;bus.gain.gain.setValueAtTime(0.0001,ctx.currentTime);bus.gain.gain.exponentialRampToValueAtTime(1,ctx.currentTime+fadeIn);
  players.forEach(o=>{if(o.dead)return;o.dead=true;const now=ctx.currentTime;o.bus.gain.gain.cancelScheduledValues(now);o.bus.gain.gain.setValueAtTime(Math.max(.0001,o.bus.gain.gain.value),now);o.bus.gain.gain.exponentialRampToValueAtTime(0.0001,now+(key==="urgent"?.5:1.8));o.until=now+2;});
  players.push(p);current=key;
  if(!timer)timer=setInterval(tick,25);
 }
 function tick(){if(!ctx)return;const ahead=ctx.currentTime+.14;
  for(let i=players.length-1;i>=0;i--){const p=players[i];if(p.dead&&ctx.currentTime>p.until){try{p.bus.gain.disconnect();}catch(e){}players.splice(i,1);continue;}
   const sec=60/p.tr.bpm/4;if(p.next<ctx.currentTime-.05)p.next=ctx.currentTime+.02;
   while(p.next<ahead){const s=p.step%16,bar=Math.floor(p.step/16);const ch=p.tr.chords[bar%p.tr.chords.length];try{p.tr.step(ctx,p.bus,p.next,s,bar,ch,sec);}catch(e){}p.step++;p.next+=sec;}}
  if(!players.length){clearInterval(timer);timer=null;}}
 function setMaster(v,sec){if(!ctx)return;const now=ctx.currentTime;master.gain.cancelScheduledValues(now);master.gain.setValueAtTime(Math.max(.0001,master.gain.value),now);master.gain.exponentialRampToValueAtTime(Math.max(.0001,v),now+(sec||1.2));}
 function stopAll(){if(!ctx)return;setMaster(.0001,.8);setTimeout(()=>{if(want()===null){players.forEach(p=>{p.dead=true;p.until=0;});current=null;}},900);}

 /* ---------- 어떤 곡을 틀지 ---------- */
 const URG=new Set(["err","sec","call","news"]);
 function roundOf(){try{const i=G.idx,g2=CONTENT.findIndex(x=>x.id==="GATE2"),g3=CONTENT.findIndex(x=>x.id==="GATE3");if(g3>=0&&i>=g3)return "r3";if(g2>=0&&i>=g2)return "r2";return "r1";}catch(e){return "r1";}}
 function want(){try{if(!pref()||!G.sound)return null;const s=CONTENT[G.idx]||{};if(s.id==="P0")return null;const app=window.appOf?appOf(s):"";if(URG.has(app))return "urgent";return roundOf();}catch(e){return null;}}
 let unlocked=false;
 function update(){
  if(!unlocked||document.hidden)return;const w=want();
  if(!w){if(current)stopAll();return;}
  if(!init())return;if(ctx.state==="suspended")ctx.resume();
  setMaster(w==="urgent"?.72:.8,1.2);
  if(w!==current||!players.some(p=>!p.dead))startTrack(w);
 }
 window.bgmUpdate=update;
 window.bgmState=()=>({current,want:want(),live:players.filter(p=>!p.dead).length,state:ctx?ctx.state:"none",unlocked});
 const unlock=()=>{if(unlocked)return;unlocked=true;if(init()&&ctx.state==="suspended")ctx.resume();setTimeout(update,60);};
 ["pointerdown","keydown","touchstart"].forEach(ev=>window.addEventListener(ev,unlock,{capture:true,passive:true}));
 document.addEventListener("visibilitychange",()=>{if(!ctx)return;if(document.hidden)ctx.suspend();else{ctx.resume();update();}});
 setInterval(update,1000);
 const _sh=shell;shell=function(){const r=_sh.apply(this,arguments);try{setTimeout(update,30);}catch(e){}return r;};

 /* ---------- 메뉴: 배경 음악 켜기/끄기 ---------- */
 const label=()=>`배경 음악 ${pref()?"켜짐":"꺼짐"}`;
 const _db=drawBar;
 drawBar=function(){const r=_db.apply(this,arguments);
  try{if(!document.querySelector(".bgmbtn")){const snd=document.querySelector('[data-a="__snd"]');const b=document.createElement("button");b.type="button";b.className="tool bgmbtn";b.textContent=label();b.title="라운드마다 다른 잔잔한 곡, 돌발 상황에는 긴박한 곡이 흐릅니다. '소리'를 끄면 함께 꺼집니다.";
    b.addEventListener("click",e=>{e.stopPropagation();setPref(!pref());document.querySelectorAll(".bgmbtn").forEach(x=>x.textContent=label());if(!pref())stopAll();else{unlocked=true;update();}});
    if(snd)snd.after(b);else{const res=document.getElementById("res");if(res)res.appendChild(b);}}
   else document.querySelectorAll(".bgmbtn").forEach(x=>x.textContent=label());}catch(e){}
  return r;};

 /* ---------- 미리 듣기용: 곡을 오프라인으로 렌더링 (검수·안내 자료용) ---------- */
 window.bgmRender=async function(key,seconds){
  const OAC=window.OfflineAudioContext||window.webkitOfflineAudioContext;const sr=44100;const c=new OAC(2,Math.ceil(sr*seconds),sr);
  const gr=graph(c,key==="urgent"?.72:.8);const bus=busFor(c,gr.master,gr.wet);bus.gain.gain.setValueAtTime(0.0001,0);bus.gain.gain.exponentialRampToValueAtTime(1,1.2);
  bus.gain.gain.setValueAtTime(1,seconds-2.5);bus.gain.gain.exponentialRampToValueAtTime(0.0001,seconds-.1);
  const tr=T[key];const sec=60/tr.bpm/4;let t=.05,st=0;while(t<seconds-1){const s=st%16,bar=Math.floor(st/16);tr.step(c,bus,t,s,bar,tr.chords[bar%tr.chords.length],sec);st++;t+=sec;}
  const buf=await c.startRendering();
  const L=buf.getChannelData(0),R=buf.getChannelData(1);let peak=0,sum=0;for(let i=0;i<L.length;i++){peak=Math.max(peak,Math.abs(L[i]),Math.abs(R[i]));sum+=L[i]*L[i];}
  const pcm=new Int16Array(L.length*2);for(let i=0;i<L.length;i++){pcm[2*i]=Math.max(-1,Math.min(1,L[i]))*32767;pcm[2*i+1]=Math.max(-1,Math.min(1,R[i]))*32767;}
  let bin="";const u8=new Uint8Array(pcm.buffer);for(let i=0;i<u8.length;i+=32768)bin+=String.fromCharCode.apply(null,u8.subarray(i,i+32768));
  return {peak,rms:Math.sqrt(sum/L.length),sr,b64:btoa(bin)};
 };
})();
