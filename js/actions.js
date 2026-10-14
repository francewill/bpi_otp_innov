'use strict';
/* ---------- events ---------- */
const A={
  go:d=>go(d.to),back:()=>back(),toast:d=>toast(d.msg),
  toggleBal:()=>{S.showBal=!S.showBal;renderHome();},
  chip:d=>{S.chip=d.v;renderHome();},
  tab:d=>{S.tab=d.v;renderHub();},
  pick:d=>{S.selected=+d.d;renderHub();},
  start:()=>startMission(),
  changeMission:()=>{if(todayDone())return;openSheet(missionPickerHTML());},
  pickMission:d=>{if(todayDone())return;S.todayType=d.v;closeSheet();renderHub();},
  startQR:()=>{S.pay=mkPay('qr');go('scan');},
  scan:()=>go('pay',true),
  biller:d=>{S.pay.biller=+d.i;S.pay.amount=BILLERS[+d.i].a;renderPay();},
  quick:d=>{S.pay.amount=+d.v;$('#amt').value=d.v;payDyn();},
  submitPay:()=>submitPay(),
  learnNext:()=>{S.learn.step=1;renderLearn();},
  quiz:d=>{S.learn.sel=+d.i;renderLearn();},
  learnDone:()=>learnDone(),
  redeemPick:d=>{const i=+d.i;if(S.pts>=TIERS[i].p){S.redeemSel=i;renderRedeem();}},
  redeemAsk:()=>redeemAsk(),redeemDo:()=>redeemDo(),
  submitSupp:()=>submitSupp(),
  submitApply:()=>submitApply(),
  holdQuick:d=>{S.holdAmt=+d.v;$('#holdAmt').value=d.v;applyDyn();},
  instPick:d=>{S.instSel=+d.i;renderInst();},
  instTenor:d=>{S.instTenor=+d.v;renderInst();},
  submitInst:()=>submitInst(),
  cardMode:d=>{S.hasCard=d.v==='1';paint(false);},
  ccRoute:d=>{S.ccRoute=d.v;paint(false);},
  loanRoute:d=>{S.loanRoute=d.v;paint(false);},
  loanBiz:d=>{S.loanBiz=d.v==='1';paint(false);},
  submitPloan:()=>submitPloan(),
  goLoan:d=>{S.loanKind=d.kind;go('loan');},
  submitLoan:()=>submitLoan(),
  fundMode:d=>{S.hasFund=d.v==='1';paint(false);},
  goFund:d=>{if(S.hasFund)return;S.fundKind=d.kind;go('fundApply');},
  goFundDeposit:d=>{S.fundKind=d.kind;S.fundDepositAmt=FUND_DEP_QUICK[0];go('fundDeposit');},
  fundMarital:d=>{S.fundMarital=+d.i;renderFundApply();},
  fundJob:d=>{S.fundJob=+d.i;renderFundApply();},
  fundIncome:d=>{S.fundIncome=+d.i;renderFundApply();},
  submitFundApply:()=>submitFundApply(),
  fundDepQuick:d=>{S.fundDepositAmt=+d.v;$('#fundDepAmt').value=d.v;fundDepDyn();},
  submitFundDeposit:()=>submitFundDeposit(),
  closeSheet:()=>closeSheet(),
  goHub:()=>{S.tab='quests';S.selected=S.today;setStack(['home','hub']);},
  goHome:()=>setStack(['home']),
  how:()=>openSheet(`<h3>How Daily Wins works</h3><ul><li>Each date has one mission. Complete it on the day to earn points.</li><li>Points show as validating first, then confirmed.</li><li>Collect stamps toward your 5-stamp milestone.</li><li>Convert points to cashback in your savings. 100 pts = ₱5.</li></ul><button class="btn btn-ghost btn-block" data-act="closeSheet">Got it</button>`),
  more:()=>openSheet(`<h3>Prototype controls</h3>${guideHTML()}`),
  demoGo:d=>demoGo(+d.v),
  demoType:d=>{reset(d.v);S.tab='quests';setStack(['home','hub']);},
  demoReset:()=>reset()
};
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]');if(!t||t.disabled)return;
  const f=A[t.dataset.act];if(f)f(t.dataset,t);
});
document.addEventListener('input',e=>{
  const id=e.target.id;
  if(id!=='amt'&&id!=='holdAmt'&&id!=='fundDepAmt')return;
  let v=e.target.value.replace(/[^0-9.]/g,'');const i=v.indexOf('.');if(i>-1)v=v.slice(0,i+1)+v.slice(i+1).replace(/\./g,'');
  const parts=v.split('.');if(parts[1]&&parts[1].length>2)v=parts[0]+'.'+parts[1].slice(0,2);
  e.target.value=v;
  if(id==='amt'){S.pay.amount=parseFloat(v)||0;payDyn();}
  else if(id==='holdAmt'){S.holdAmt=parseFloat(v)||0;applyDyn();}
  else{S.fundDepositAmt=parseFloat(v)||0;fundDepDyn();}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet();});
