'use strict';
/* ---------- installment (existing cardholders only) ---------- */
function instElig(){
  if(!S.hasCard)return {counts:false,tone:'info',icon:'info',msg:'Installment conversion is available to BPI credit cardholders. Apply for a BPI credit card to unlock this.'};
  if(todayDone())return {counts:false,tone:'info',icon:'check',msg:'You already collected today’s Daily Win.'};
  if(mtype(S.today)!=='inst')return {counts:false,tone:'info',icon:'info',msg:`Today’s Daily Win is “${MISSION[mtype(S.today)].name}”. Converting a purchase won’t earn points today.`};
  return {counts:true,tone:'ok',icon:'gift',msg:`Counts for today’s Daily Win. You’ll earn ${MISSION.inst.pts} pts + ${MISSION.inst.stamp} stamp.`};
}
function renderInst(){
  const e=instElig();
  const pitch=`<div class="card tip"><span class="big-ic">${ic('card')}</span><h3>Turn big purchases into monthly installments</h3>
    <p>Switch an eligible posted purchase to 3, 6, or 12 months — spread the cost without applying for a separate loan.</p>
    <ul class="bullets">
      <li>No extra paperwork — your existing credit card does it</li>
      <li>Frees up part of your available credit limit right away</li>
      <li>Illustrative 0% add-on rate for this prototype</li>
    </ul></div>`;
  if(!S.hasCard){
    $('#instBody').innerHTML=`${pitch}<div class="note info">${ic('info','md')}<span>${e.msg}</span></div>
      <button class="link" data-act="go" data-to="apply">Apply for a BPI credit card</button>`;
    $('#instFoot').innerHTML=`<button class="btn btn-ghost btn-block" data-act="back">Back</button>`;
    return;
  }
  const sel=S.instSel||0,item=INSTALL_ITEMS[sel],tenor=S.instTenor||TENORS[0];
  const total=item.a+PROCESSING_FEE,monthly=total/tenor;
  $('#instBody').innerHTML=`${pitch}
    <div class="radios" role="radiogroup" aria-label="Purchase to convert">${INSTALL_ITEMS.map((it,i)=>`<button class="radio ${i===sel?'on':''}" role="radio" aria-checked="${i===sel}" data-act="instPick" data-i="${i}"><span class="avatar">${it.n[0]}</span><span class="grow"><b>${it.n}</b><small>${it.d}</small></span><span class="pill">${peso(it.a,0)}</span><span class="rd"></span></button>`).join('')}</div>
    <div class="card">
      <h4>Choose your term</h4>
      <div class="quick" style="margin-top:12px">${TENORS.map(t=>`<button data-act="instTenor" data-v="${t}" class="${t===tenor?'on':''}">${t} mo</button>`).join('')}</div>
      <div class="rows" style="margin-top:14px">
        <div><span>Purchase amount</span><b class="num">${peso(item.a)}</b></div>
        <div><span>Processing fee</span><b class="num">${peso(PROCESSING_FEE,0)}</b></div>
        <div><span>Total to finance</span><b class="num">${peso(total)}</b></div>
      </div>
      <div class="row-b" style="margin-top:12px"><span class="muted">Monthly amortization</span><b class="num" style="font-size:20px">${peso(monthly)}</b></div>
    </div>
    <div class="note ${e.tone}">${ic(e.icon,'md')}<span>${e.msg}</span></div>
    <p class="footnote">Illustrative 0% add-on rate for this prototype. A flat ${peso(PROCESSING_FEE,0)} processing fee is added to the total and spread across the term. Actual terms and eligible purchases are set by Finance.</p>`;
  $('#instFoot').innerHTML=`<button class="btn btn-red btn-block" id="instBtn" data-act="submitInst">Convert to ${tenor}-month installment</button>`;
}
function submitInst(){
  const item=INSTALL_ITEMS[S.instSel||0],tenor=S.instTenor||TENORS[0];
  const total=item.a+PROCESSING_FEE,monthly=total/tenor;
  const e=instElig();
  S.result={type:'inst',counts:e.counts,entry:null,merchant:item.n,amount:item.a,fee:PROCESSING_FEE,total,tenor,monthly};
  if(e.counts)earn('inst');
  go('success',true);
}
