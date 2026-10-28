'use strict';
/* ---------- auto / housing / motorcycle loans (major missions) ----------
   Regular-only, per spec, but — unlike an earlier draft — now part of the
   BPI Quest points economy, same as every other mission. One shared
   screen parameterized by S.loanKind ('auto'/'housing'/'moto'); LOAN_KINDS
   (data.js) holds the display label + icon, MISSION holds the quest copy. */
function loanElig(kind){
  if(S.majorDone.has(kind))return majorDoneElig(kind);
  return majorOpenElig(kind);
}
function renderLoan(){
  const kind=S.loanKind||'auto',info=LOAN_KINDS[kind]||LOAN_KINDS.auto,e=loanElig(kind);
  $('#loanTitle').textContent=info.label;
  $('#loanBody').innerHTML=`<div class="card tip"><span class="big-ic">${ic(info.icon)}</span><h3>Apply for a ${info.label}</h3>
    <p>Upload proof of income. Your application is subject to credit evaluation and approval.</p></div>
    ${dropField('Proof of income','loanDoc','Upload your COE, payslip, or ITR')}
    <div class="note ${e.tone}">${ic(e.icon,'md')}<span>${e.msg}</span></div>
    <p class="footnote">Illustrative application only. Actual requirements and rates are set by Finance.</p>`;
  $('#loanFoot').innerHTML=`<button class="btn btn-red btn-block" id="loanBtn" data-act="submitLoan" disabled>Submit application</button>`;
  wireDropzone('loanDoc',loanDyn);
  loanDyn();
}
function loanDyn(){
  const b=$('#loanBtn');if(!b)return;
  b.disabled=!($('#loanDocFile')&&$('#loanDocFile').files.length>0);
}
function submitLoan(){
  const file=$('#loanDocFile').files[0];
  if(!file)return;
  const kind=S.loanKind||'auto',e=loanElig(kind);
  S.result={type:kind,counts:e.counts,why:e.msg,entry:null,docFile:file.name};
  if(e.counts)earn(kind);
  go('success',true);
}
