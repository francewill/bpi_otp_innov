'use strict';
/* ---------- redeem ---------- */
function bestTier(){let b=null;TIERS.forEach((t,i)=>{if(S.pts>=t.p)b=i;});return b;}
function renderRedeem(){
  if(S.redeemSel===null||S.pts<TIERS[S.redeemSel].p)S.redeemSel=bestTier();
  const sel=S.redeemSel;
  $('#redeemBody').innerHTML=`<div class="card" style="display:flex;justify-content:space-between;align-items:center"><div><p class="muted" style="font-size:15px">Available points</p><b class="num" style="font-size:30px">${pts(S.pts)} pts</b></div><span class="pill gold">100 pts = ₱5</span></div>
    <h3 style="font-size:19px;font-weight:600">Choose your cashback</h3>
    <div class="radios" role="radiogroup" aria-label="Cashback amount">${TIERS.map((t,i)=>{const ok=S.pts>=t.p;
      return `<button class="radio tier ${i===sel?'on':''} ${ok?'':'lock'}" role="radio" aria-checked="${i===sel}" ${ok?'':'aria-disabled="true"'} data-act="redeemPick" data-i="${i}"><span style="flex:1"><span class="amt">${peso(t.c,0)}</span><small style="display:block"><b>${pts(t.p)} pts</b>${ok?'':` · need ${pts(t.p-S.pts)} more`}</small></span>${ok?'':ic('lock','md')}<span class="rd"></span></button>`;}).join('')}</div>
    <div class="card from"><span class="lbl">To</span><div><b>Savings Account</b><small>••••191274 · Credited instantly</small></div></div>
    <p class="footnote">Illustrative rate for this prototype. Final rewards and cashback rules need Finance approval.</p>`;
  const t=sel===null?null:TIERS[sel];
  $('#redeemFoot').innerHTML=`<button class="btn btn-red btn-block" data-act="redeemAsk" ${t?'':'disabled'}>${t?`Convert ${pts(t.p)} pts to ${peso(t.c,0)}`:'Not enough points yet'}</button>`;
}
function redeemAsk(){
  const t=TIERS[S.redeemSel];if(!t)return;
  openSheet(`<h3>Confirm conversion</h3><div class="rows"><div><span>Points used</span><b class="num">−${pts(t.p)} pts</b></div><div><span>Cashback</span><b class="num g">${peso(t.c)}</b></div><div><span>Points left</span><b class="num">${pts(S.pts-t.p)} pts</b></div><div><span>Credited to</span><b>Savings ••••191274</b></div></div>
    <button class="btn btn-red btn-block" data-act="redeemDo">Confirm</button><button class="btn btn-ghost btn-block" data-act="closeSheet">Cancel</button>`);
}
function redeemDo(){
  const t=TIERS[S.redeemSel];if(!t)return;
  S.pts-=t.p;S.balance+=t.c;
  S.ledger.unshift({id:S.uid++,title:`Converted to ${peso(t.c,0)} cashback`,date:'Nov '+S.today,pts:-t.p,status:'redeemed'});
  S.redeemed={...t,left:S.pts,bal:S.balance};S.redeemSel=null;
  closeSheet();go('done',true);
}
function renderDone(){
  const r=S.redeemed;if(!r)return;
  $('#doneBody').innerHTML=`<div class="ok-wrap"><div class="ok-badge">${ic('check')}</div><h2>Cashback credited!</h2><div class="cash num">${peso(r.c)}</div><p>added to your Savings Account</p></div>
    <div class="card"><div class="rows"><div><span>Points used</span><b class="num">${pts(r.p)} pts</b></div><div><span>Points left</span><b class="num">${pts(r.left)} pts</b></div><div><span>Credited to</span><b>Savings ••••191274</b></div><div><span>New available balance</span><b class="num">${peso(r.bal)}</b></div></div></div>
    <p class="footnote">Prototype only. No real money moves.</p>`;
  $('#doneFoot').innerHTML=`<button class="btn btn-red btn-block" data-act="goHub">Back to BPI Quest</button><button class="btn btn-ghost btn-block" data-act="goHome">Go to accounts</button>`;
}
