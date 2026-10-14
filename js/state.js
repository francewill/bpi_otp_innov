'use strict';
/* ---------- state ---------- */
let S=fresh();
function fresh(tt){
  return {
    today:14,selected:14,todayType:tt||null,
    balance:48250.75,goal:12400,showBal:false,
    pts:19900,pendingPts:0,stamps:1,streak:3,lastStamp:false,hasCard:true,ccRoute:'pq',holdAmt:MIN_HOLD,
    done:new Set([1,2,3,4,5,6,8,9,11,12,13]),
    check:{salary:true,bill:tt!=='bill',pay:false,save:false},
    ledger:[11,12,13].concat([9,8,6,5,4,3,2,1]).sort((a,b)=>b-a).map(d=>({id:d,title:MISSION[PATTERN[d-1]].name,date:'Nov '+d,pts:MISSION[PATTERN[d-1]].pts,status:'confirmed'}))
           .concat([{id:0,title:'Rewards from earlier months',date:'Before Nov',pts:19000,status:'confirmed'}]),
    chip:'deposits',tab:'quests',pay:null,learn:null,result:null,redeemSel:null,redeemed:null,uid:100,
    stack:['home']
  };
}
const mtype=d=>(d===S.today&&S.todayType)||PATTERN[d-1];
const dstatus=d=>d<S.today?(S.done.has(d)?'done':'missed'):d===S.today?(S.done.has(d)?'done':'today'):'upcoming';
const todayDone=()=>S.done.has(S.today);
const nCheck=()=>Object.values(S.check).filter(Boolean).length;
