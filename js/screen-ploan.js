'use strict';
/* ---------- personal loan (not gated on S.hasCard — available to everyone) ---------- */
function ploanElig(){
  if(todayDone())return {counts:false,tone:'info',icon:'check',msg:'You already collected today’s Daily Win.'};
  if(mtype(S.today)!=='ploan')return {counts:false,tone:'info',icon:'info',msg:`Today’s Daily Win is “${MISSION[mtype(S.today)].name}”. Submitting this application won’t earn points today.`};
  return {counts:true,tone:'ok',icon:'gift',msg:`Counts for today’s Daily Win. You’ll earn ${MISSION.ploan.pts} pts + ${MISSION.ploan.stamp} stamp.`};
}
function renderPloan(){
  const e=ploanElig();
  let body='',foot='';
  if(S.loanRoute==='regular'){
    const docLabel=S.loanBiz?'Audited Financial Statement':'COE, payslip, or ITR';
    body=`<div class="card tip"><span class="big-ic">${ic('wallet')}</span><h3>Apply for a personal loan</h3>
      <p>Upload proof of income. Your application is subject to credit evaluation and approval.</p></div>
      <div class="quick">
        <button data-act="loanBiz" data-v="0" class="${S.loanBiz?'':'on'}">Employed</button>
        <button data-act="loanBiz" data-v="1" class="${S.loanBiz?'on':''}">Business owner</button>
      </div>
      ${dropField('Proof of income — '+docLabel,'ploanDoc','Upload your '+docLabel)}
      <button class="link" data-act="loanRoute" data-v="pq">See if you’re pre-qualified instead</button>
      <div class="note ${e.tone}">${ic(e.icon,'md')}<span>${e.msg}</span></div>`;
    foot=`<button class="btn btn-red btn-block" id="ploanBtn" data-act="submitPloan" disabled>Submit application</button>`;
  }else{
    body=`<div class="unlock">${ic('gift')}<div><b>You’re pre-qualified</b><small>Based on your BPI relationship — no income documents needed.</small></div></div>
      <div class="card"><div class="row-b"><span class="muted">Pre-approved loan amount</span><b class="num" style="font-size:20px">${peso(PL_PQ_AMOUNT,0)}</b></div></div>
      <button class="link" data-act="loanRoute" data-v="regular">Need a larger amount? Apply with income documents instead</button>
      <div class="note ${e.tone}">${ic(e.icon,'md')}<span>${e.msg}</span></div>`;
    foot=`<button class="btn btn-red btn-block" id="ploanBtn" data-act="submitPloan">Apply now</button>`;
  }
  $('#ploanBody').innerHTML=body;
  $('#ploanFoot').innerHTML=foot;
  if(S.loanRoute==='regular'){wireDropzone('ploanDoc',ploanDyn);ploanDyn();}
}
function ploanDyn(){
  const b=$('#ploanBtn');if(!b)return;
  b.disabled=!($('#ploanDocFile')&&$('#ploanDocFile').files.length>0);
}
function submitPloan(){
  const e=ploanElig();
  if(S.loanRoute==='regular'){
    const file=$('#ploanDocFile').files[0];
    if(!file)return;
    S.result={type:'ploan',route:'regular',counts:e.counts,entry:null,docFile:file.name,biz:S.loanBiz};
  }else{
    S.result={type:'ploan',route:'pq',counts:e.counts,entry:null,amount:PL_PQ_AMOUNT};
  }
  if(e.counts)earn('ploan');
  go('success',true);
}
