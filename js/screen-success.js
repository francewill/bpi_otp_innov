'use strict';
/* ---------- success ---------- */
function sucHead(){
  const r=S.result;
  if(r.type==='apply'){
    if(r.route==='regular')return ['Application submitted!','We’ll review your documents and get back to you within 3–5 business days.'];
    if(r.route==='express')return ['Card approved!',`${peso(r.holdAmount||0,0)} is now on hold in your Savings Account as collateral.`];
    return ['You’re approved!',`Your BPI credit card with a ${peso(PQ_LIMIT,0)} limit is on its way.`];
  }
  if(r.type==='ploan'){
    if(r.route==='regular')return ['Application submitted!','We’ll review your documents and get back to you within 3–5 business days.'];
    return ['You’re approved!',`Your ${peso(r.amount||0,0)} personal loan is being processed for release.`];
  }
  if(LOAN_KINDS[r.type]){
    return ['Application submitted!',`We’ll review your ${LOAN_KINDS[r.type].label} application and documents within 3–5 business days.`];
  }
  if(FUNDS[r.type]){
    return ['You’re in!',`Your ${FUNDS[r.type].label} account is being set up. You can start investing right in the app.`];
  }
  if(r.type==='fundDeposit'){
    return ['Deposit successful!',`${peso(r.amount||0)} added to your ${FUNDS[r.kind].label} investment.`];
  }
  const map={qr:['Payment successful!',`${peso(r.amount||0)} paid to ${r.payee}`],bill:['Payment successful!',`${peso(r.amount||0)} paid to ${r.payee}`],learn:['Nice work!','You finished today’s money tip'],supp:['Application submitted!','We’ll review it and activate your supplementary card.'],inst:['Installment set up!',`${r.merchant} · ${peso(r.monthly||0)}/month for ${r.tenor} months`]};
  return map[r.type];
}
function renderSuccess(){
  const r=S.result;if(!r)return;
  const [h,sub]=sucHead();
  $('#sucBody').innerHTML=`<div class="ok-wrap"><div class="ok-badge">${ic('check')}</div><h2>${h}</h2><p>${sub}</p></div><div id="rwWrap"></div>`;
  updateSuccess(true);
}
function updateSuccess(first){
  const r=S.result;if(!r)return;
  if(r.noReward){
    $('#rwWrap').innerHTML='';
    $('#sucFoot').innerHTML=`<button class="btn btn-red btn-block" data-act="goHome">Go to accounts</button>`;
    return;
  }
  const e=r.counts?S.ledger.find(x=>x.id===r.entry):null;
  const conf=e&&e.status==='confirmed',unlocked=conf&&S.pts>=20000;
  const m=MISSION[r.type],left=5-S.stamps;
  const major=!!m&&m.kind==='major';
  let html='';
  if(r.counts){
    html=`<div class="card"><div class="row-b" style="margin-bottom:2px"><h4>${major?'Major mission':'Daily Wins'} reward ${conf?'confirmed':'validating'}</h4></div>
      <div class="rows"><div><span>${major?'Major mission':'Today’s mission'}</span><b class="g">Completed</b></div>
      ${major?`<div><span>Unlocks again</span><b>${MAJOR_CYCLE.next}</b></div>`:''}
      ${m.stamp?`<div><span>Stamp collected</span><b>+${m.stamp} stamp</b></div>`:''}
      <div><span>Reward points</span><span style="display:flex;gap:10px;align-items:center">${conf?'<span class="status-chip ok">Confirmed</span>':'<span class="status-chip pend"><i class="spin"></i>Validating</span>'}<b class="num">+${m.pts} pts</b></span></div></div></div>
      ${m.stamp?`<div class="card"><h4>You’re getting closer to your reward!</h4>${stampsHTML(S.stamps,first&&S.lastStamp)}<p class="muted" style="font-size:15px">${left>0?`${left} more stamp${left>1?'s':''} to your 5-stamp milestone.`:'Milestone reached. Nice work.'}</p></div>`:''}
      ${unlocked?`<div class="unlock">${ic('gift')}<div><b>Your ₱1,000 cashback is ready</b><small>You have ${pts(S.pts)} pts. Convert them to cash in your savings.</small></div></div>`:''}`;
  }else if(r.belowMin){
    html=`<div class="note warn">${ic('info','md')}<span>This payment was under ${peso(m.min,0)}, so it did not count for today’s win. You can still complete today’s mission.</span></div>`;
  }else{
    // r.why is the reason the mission's own elig() gave at submit time —
    // captured before earn() ran, so it still reads correctly here.
    html=`<div class="note info">${ic('info','md')}<span>${r.why||'This action did not earn reward points.'}</span></div>`;
  }
  $('#rwWrap').innerHTML=`<div class="stack" style="padding:0">${html}</div>`;
  const backAct=major?'goMajor':'goHub',backLbl=major?'Back to major missions':'Back to Daily Wins';
  $('#sucFoot').innerHTML=unlocked
    ?`<button class="btn btn-red btn-block" data-act="go" data-to="redeem">Convert to cashback</button><button class="btn btn-ghost btn-block" data-act="${backAct}">${backLbl}</button>`
    :`<button class="btn btn-red btn-block" data-act="${backAct}">${backLbl}</button><button class="btn btn-ghost btn-block" data-act="goHome">Go to accounts</button>`;
}
