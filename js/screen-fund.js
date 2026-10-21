'use strict';
/* ---------- BPI Wealth: apply for UITF / ALFM (major missions) ----------
   Not gated on S.hasCard — investing isn't tied to card ownership.
   S.hasFund covers both funds together (a prototype simplification: once
   you've opened either fund, the Investments tab shows mock holdings for
   both). One shared screen parameterized by S.fundKind. No document
   upload — just a few demographic questions, matching the "no forms"
   brief, all pre-filled to their first option so "just click apply"
   is literally true unless the presenter wants to change them. */
function fundElig(kind){
  if(S.hasFund)return {counts:false,tone:'info',icon:'check',tag:'Already an investor',msg:'You already have a BPI Wealth investment account.'};
  if(S.majorDone.has(kind))return majorDoneElig(kind);
  return majorOpenElig(kind);
}
function fundRadios(opts,sel,act){
  return `<div class="radios" role="radiogroup">${opts.map((o,i)=>`<button class="radio ${i===sel?'on':''}" role="radio" aria-checked="${i===sel}" data-act="${act}" data-i="${i}"><span style="flex:1"><b>${o}</b></span><span class="rd"></span></button>`).join('')}</div>`;
}
function renderFundApply(){
  const kind=S.fundKind||'uitf',info=FUNDS[kind]||FUNDS.uitf,e=fundElig(kind);
  $('#fundApplyTitle').textContent=info.label;
  if(S.hasFund){
    $('#fundApplyBody').innerHTML=`<div class="note info">${ic('check','md')}<span>${e.msg}</span></div>`;
    $('#fundApplyFoot').innerHTML=`<button class="btn btn-ghost btn-block" data-act="back">Back</button>`;
    return;
  }
  $('#fundApplyBody').innerHTML=`<div class="card tip"><span class="big-ic">${ic('chart')}</span><h3>Apply for ${info.full}</h3>
    <p>No forms to fill out — just a few quick questions and you’re in.</p></div>
    <div class="card"><h4>Marital status</h4>${fundRadios(MARITAL,S.fundMarital,'fundMarital')}</div>
    <div class="card"><h4>Nature of job</h4>${fundRadios(JOB_NATURE,S.fundJob,'fundJob')}</div>
    <div class="card"><h4>Monthly income bracket</h4>${fundRadios(INCOME_BRACKETS,S.fundIncome,'fundIncome')}</div>
    <div class="note ${e.tone}">${ic(e.icon,'md')}<span>${e.msg}</span></div>`;
  $('#fundApplyFoot').innerHTML=`<button class="btn btn-red btn-block" data-act="submitFundApply">Apply now</button>`;
}
function submitFundApply(){
  const kind=S.fundKind||'uitf',e=fundElig(kind);
  S.result={type:kind,counts:e.counts,why:e.msg,entry:null,marital:MARITAL[S.fundMarital],job:JOB_NATURE[S.fundJob],income:INCOME_BRACKETS[S.fundIncome]};
  S.hasFund=true;
  if(e.counts)earn(kind);
  go('success',true);
}

/* ---------- deposit more into an existing fund (not quest-gated) ---------- */
function renderFundDeposit(){
  const kind=S.fundKind||'uitf',info=FUNDS[kind]||FUNDS.uitf,h=S.fundHoldings[kind],amt=S.fundDepositAmt||FUND_DEP_QUICK[0];
  $('#fundDepositTitle').textContent='Deposit to '+info.label;
  $('#fundDepositBody').innerHTML=`<div class="card"><div class="row-b"><span class="muted">Current value</span><b class="num">${peso(h.value)}</b></div></div>
    <div class="card amt-card"><label for="fundDepAmt">Amount</label><div class="amt-row"><span>₱</span><input id="fundDepAmt" inputmode="decimal" autocomplete="off" value="${amt}"></div>
      <div class="quick">${FUND_DEP_QUICK.map(v=>`<button data-act="fundDepQuick" data-v="${v}" class="${v===amt?'on':''}">${peso(v,0)}</button>`).join('')}</div>
      <div class="err" id="fundDepErr" role="alert"></div></div>
    <div class="card from"><span class="lbl">From</span><div><b>Savings Account</b><small>••••191274 · Available ${peso(S.balance)}</small></div></div>`;
  $('#fundDepositFoot').innerHTML=`<button class="btn btn-red btn-block" id="fundDepBtn" data-act="submitFundDeposit"></button>`;
  fundDepDyn();
}
function fundDepDyn(){
  const amt=S.fundDepositAmt||0,over=amt>S.balance;
  $('#fundDepErr').textContent=over?'That is more than your available balance.':'';
  const b=$('#fundDepBtn');b.disabled=!(amt>0)||over;b.textContent=`Deposit ${peso(amt,0)}`;
  $$('.quick button').forEach(x=>x.classList.toggle('on',+x.dataset.v===amt));
}
function submitFundDeposit(){
  const kind=S.fundKind||'uitf',amt=S.fundDepositAmt||0;
  if(!(amt>0&&amt<=S.balance))return;
  const h=S.fundHoldings[kind];
  S.balance-=amt;h.invested+=amt;h.value+=amt;
  S.result={type:'fundDeposit',kind,amount:amt,noReward:true};
  go('success',true);
}
