/* 온보딩 노트 배치: 1월·4월·7월·10월, 분기가 시작될 때 하나씩 */
(function(){
 const at=(m)=>CONTENT.findIndex(x=>x.month===m&&!x.bare&&x.type!=="note");
 const mk=(id,k,m)=>{const d=noteData(NOTES[k]);return{id,type:"note",month:m,when:m+"월",tag:"온보딩 노트"+NOTES[k].n,title:d.title,body:d.body,q:d.q,btn:"다음"};};
 /* ② 3월 → 4월 */
 const i3=CONTENT.findIndex(x=>x.id==="3-0");const n2=i3>=0?CONTENT.splice(i3,1)[0]:null;
 const s2={...(n2||mk("NOTE2",1,4)),id:"NOTE2",month:4,when:"4월"};
 CONTENT.splice(at(4),0,s2);
 /* ③ 6월 반기 회고 첫 화면 → 7월, ④ 결산 첫 화면 → 10월 */
 CONTENT.splice(at(7),0,mk("NOTE3",2,7));
 CONTENT.splice(at(10),0,mk("NOTE4",3,10));
 /* 사이드바 메뉴의 열리는 시점도 같은 장면으로 */
 const W=["1월","4월","7월","10월"],A=["P4","NOTE2","NOTE3","NOTE4"];NOTES.forEach((x,k)=>{x.at=A[k];x.when=W[k];});
})();
