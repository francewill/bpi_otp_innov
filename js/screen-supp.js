'use strict';
/* ---------- supplementary card ---------- */
function suppElig(){
  if(!S.hasCard)return {counts:false,tone:'info',icon:'info',msg:'Supplementary cards are available to BPI credit cardholders. Apply for a BPI credit card to unlock this.'};
  if(todayDone())return {counts:false,tone:'info',icon:'check',msg:'You already collected today’s Daily Win.'};
  if(mtype(S.today)!=='supp')return {counts:false,tone:'info',icon:'info',msg:`Today’s Daily Win is “${MISSION[mtype(S.today)].name}”. Submitting this application won’t earn points today.`};
  return {counts:true,tone:'ok',icon:'gift',msg:`Counts for today’s Daily Win. You’ll earn ${MISSION.supp.pts} pts + ${MISSION.supp.stamp} stamp.`};
}
function renderSupp(){
  const e=suppElig();
  const pitch=`<div class="card tip"><span class="big-ic">${ic('card')}</span><h3>Share your credit limit with family</h3>
    <p>Add a supplementary card for a parent, spouse, or child. They get their own card, linked to your account and credit limit — you stay in control with a single bill.</p>
    <ul class="bullets">
      <li>Shares your existing credit limit, no separate approval needed</li>
      <li>Free for your first supplementary card</li>
      <li>₱500 yearly fee applies per additional card (2nd onward)</li>
    </ul></div>`;
  if(!S.hasCard){
    $('#suppBody').innerHTML=`${pitch}<div class="note info">${ic('info','md')}<span>${e.msg}</span></div>
      <button class="link" data-act="go" data-to="apply">Apply for a BPI credit card</button>`;
    $('#suppFoot').innerHTML=`<button class="btn btn-ghost btn-block" data-act="back">Back</button>`;
    return;
  }
  $('#suppBody').innerHTML=`${pitch}
    <div class="note ${e.tone}">${ic(e.icon,'md')}<span>${e.msg}</span></div>
    <div class="card amt-card" style="display:flex;flex-direction:column;gap:16px">
      ${dropField('Primary cardholder ID','suppPrimary','Upload a photo of the primary cardholder’s ID')}
      ${dropField('Supplementary cardholder ID','suppUser','Upload a photo of the supplementary cardholder’s ID')}
    </div>`;
  $('#suppFoot').innerHTML=`<button class="btn btn-red btn-block" id="suppBtn" data-act="submitSupp" disabled>Submit application</button>`;
  wireDropzone('suppPrimary',suppDyn);
  wireDropzone('suppUser',suppDyn);
}
function suppDyn(){
  const b=$('#suppBtn');if(!b)return;
  const hasPrimary=$('#suppPrimaryFile').files.length>0;
  const hasSupp=$('#suppUserFile').files.length>0;
  b.disabled=!(hasPrimary&&hasSupp);
}
function submitSupp(){
  const primary=$('#suppPrimaryFile').files[0],suppUser=$('#suppUserFile').files[0];
  if(!primary||!suppUser)return;
  const e=suppElig();
  S.result={type:'supp',counts:e.counts,belowMin:false,entry:null,primaryIdFile:primary.name,suppIdFile:suppUser.name};
  if(e.counts)earn('supp');
  go('success',true);
}
