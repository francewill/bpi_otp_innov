'use strict';
/* ---------- state ---------- */
let S=fresh();
function fresh(tt){
  return {
    today:14,selected:14,todayType:tt||null,
    balance:48250.75,showBal:false,
    pts:19900,pendingPts:0,stamps:1,streak:3,lastStamp:false,hasCard:true,ccRoute:'pq',holdAmt:MIN_HOLD,instSel:0,instTenor:TENORS[0],
    loanRoute:'pq',loanBiz:false,loanKind:'auto',
    hasFund:true,fundKind:'uitf',fundMarital:0,fundJob:0,fundIncome:0,fundDepositAmt:FUND_DEP_QUICK[0],
    fundHoldings:{uitf:{invested:20000,value:21850},alfm:{invested:15000,value:14100}},
    season:'nov',seasonPick:0,seasonRef:'',
    done:new Set([1,2,3,4,5,6,8,9,11,12,13]),
    majorDone:new Set(),seasonDone:new Set(),
    check:{salary:true,bill:tt!=='bill',pay:false},
    ledger:[11,12,13].concat([9,8,6,5,4,3,2,1]).sort((a,b)=>b-a).map(d=>({id:d,title:MISSION[PATTERN[d-1]].name,date:'Nov '+d,pts:MISSION[PATTERN[d-1]].pts,status:'confirmed'}))
           .concat([{id:0,title:'Rewards from earlier months',date:'Before Nov',pts:19000,status:'confirmed'}]),
    chip:'deposits',tab:'daily',pay:null,learn:null,result:null,redeemSel:null,redeemed:null,uid:100,
    stack:['home']
  };
}
/* ---------- daily missions: one per date, S.done tracks which dates are collected ---------- */
const mtype=d=>(d===S.today&&S.todayType)||PATTERN[d-1];
const dstatus=d=>d<S.today?(S.done.has(d)?'done':'missed'):d===S.today?(S.done.has(d)?'done':'today'):'upcoming';
const todayDone=()=>S.done.has(S.today);
const nCheck=()=>Object.values(S.check).filter(Boolean).length;
/* ---------- major missions: no date, once per 6-month cycle ----------
   S.majorDone holds the MISSION keys already earned this cycle. The two
   helpers below are the blocking/open outcomes every major mission's
   elig() shares, so that copy lives in exactly one place. */
const nMajor=()=>MAJOR_KEYS.filter(k=>S.majorDone.has(k)).length;
const cycleDaysLeft=()=>30-S.today+31;   // Nov S.today → Dec 31, when the cycle ends
const majorDoneElig=k=>({counts:false,tone:'info',icon:'check',tag:'Completed',
  msg:`You already earned “${MISSION[k].name}” this cycle. It unlocks again on ${MAJOR_CYCLE.next}.`});
const majorOpenElig=k=>({counts:true,tone:'ok',icon:'gift',tag:'Open',
  msg:`Counts as a major mission. You’ll earn ${MISSION[k].pts} pts + ${MISSION[k].stamp} stamp — no daily deadline.`});
/* ---------- seasonal campaign: the current month's, once per campaign ---------- */
const season=()=>SEASON[S.season]||SEASON[SEASON_KEYS[0]];
const seasonDone=()=>S.seasonDone.has(season().mission);
