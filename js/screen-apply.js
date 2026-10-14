'use strict';
/* ---------- apply for a credit card (non-holders only) ----------
   Which of the 3 routes is offered is normally decided by BPI's own
   eligibility algorithm based on the applicant's history. Here it's a
   demo toggle (S.ccRoute) in the guide panel, so a presenter can preview
   all three without needing real account history. */
function applyElig(){
  if(S.hasCard)return {counts:false,tone:'info',icon:'check',msg:'You already have a BPI credit card.'};
  if(todayDone())return {counts:false,tone:'info',icon:'check',msg:'You already collected today’s Daily Win.'};
  if(mtype(S.today)!=='apply')return {counts:false,tone:'info',icon:'info',msg:`Today’s Daily Win is “${MISSION[mtype(S.today)].name}”. Submitting this application won’t earn points today.`};
  return {counts:true,tone:'ok',icon:'gift',msg:`Counts for today’s Daily Win. You’ll earn ${MISSION.apply.pts} pts + ${MISSION.apply.stamp} stamp.`};
}
function renderApply(){
  const e=applyElig();
  if(S.hasCard){
    $('#applyBody').innerHTML=`<div class="note info">${ic('check','md')}<span>${e.msg}</span></div>`;
    $('#applyFoot').innerHTML=`<button class="btn btn-ghost btn-block" data-act="back">Back</button>`;
    return;
  }
  const qual=`<div class="note ${e.tone}">${ic(e.icon,'md')}<span>${e.msg}</span></div>`;
  let body='',foot='';
  if(S.ccRoute==='regular'){
    body=`<div class="card tip"><span class="big-ic">${ic('card')}</span><h3>Apply for a BPI credit card</h3>
      <p>Upload proof of income. Your application is subject to credit evaluation and approval.</p></div>
      ${dropField('Proof of income','incomeDoc','Upload a payslip, ITR, or Certificate of Employment')}
      <button class="link" data-act="ccRoute" data-v="express">Can’t provide income documents? Try Express Start instead</button>
      ${qual}`;
    foot=`<button class="btn btn-red btn-block" id="applyBtn" data-act="submitApply" disabled>Submit application</button>`;
  }else if(S.ccRoute==='express'){
    const amt=S.holdAmt||MIN_HOLD;
    body=`<div class="card tip"><span class="big-ic">${ic('card')}</span><h3>Express Start — secured credit card</h3>
      <p>For freelancers, self-employed, or anyone who can’t provide income documents. Place a hold amount in your Savings Account as collateral — your credit limit matches it, and since it’s secured, approval is immediate.</p></div>
      <div class="card amt-card"><label for="holdAmt">Hold amount</label><div class="amt-row"><span>₱</span><input id="holdAmt" inputmode="decimal" autocomplete="off" value="${amt}"></div>
        <div class="quick">${HOLD_QUICK.map(v=>`<button data-act="holdQuick" data-v="${v}" class="${v===amt?'on':''}">${peso(v,0)}</button>`).join('')}</div>
        <div class="err" id="holdErr" role="alert"></div></div>
      <button class="link" data-act="ccRoute" data-v="regular">Prefer to submit income documents instead? Switch to Regular</button>
      ${qual}`;
    foot=`<button class="btn btn-red btn-block" id="applyBtn" data-act="submitApply">Apply with Express Start</button>`;
  }else{
    body=`<div class="unlock">${ic('gift')}<div><b>You’re pre-qualified</b><small>Based on your BPI relationship — no income documents needed.</small></div></div>
      <div class="card"><div class="row-b"><span class="muted">Pre-approved credit limit</span><b class="num" style="font-size:20px">${peso(PQ_LIMIT,0)}</b></div></div>
      ${qual}`;
    foot=`<button class="btn btn-red btn-block" id="applyBtn" data-act="submitApply">Apply now</button>`;
  }
  $('#applyBody').innerHTML=body;
  $('#applyFoot').innerHTML=foot;
  if(S.ccRoute==='regular')wireDropzone('incomeDoc',applyDyn);
  if(S.ccRoute==='regular'||S.ccRoute==='express')applyDyn();
}
function applyDyn(){
  const b=$('#applyBtn');if(!b)return;
  if(S.ccRoute==='regular'){
    b.disabled=!($('#incomeDocFile')&&$('#incomeDocFile').files.length>0);
  }else if(S.ccRoute==='express'){
    const amt=S.holdAmt||0,bad=amt<MIN_HOLD;
    const err=$('#holdErr');if(err)err.textContent=bad?`Minimum hold amount is ${peso(MIN_HOLD,0)}.`:'';
    b.disabled=bad;
    $$('.quick button').forEach(x=>x.classList.toggle('on',+x.dataset.v===amt));
  }
}
function submitApply(){
  const e=applyElig();
  if(S.ccRoute==='regular'){
    const file=$('#incomeDocFile').files[0];
    if(!file)return;
    S.result={type:'apply',route:'regular',counts:e.counts,entry:null,docFile:file.name};
  }else if(S.ccRoute==='express'){
    if(!(S.holdAmt>=MIN_HOLD))return;
    S.result={type:'apply',route:'express',counts:e.counts,entry:null,holdAmount:S.holdAmt};
  }else{
    S.result={type:'apply',route:'pq',counts:e.counts,entry:null};
  }
  if(e.counts)earn('apply');
  go('success',true);
}
