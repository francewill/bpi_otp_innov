'use strict';
/* ---------- missions: QR / bill ---------- */
function mkPay(type){return {type,biller:0,amount:type==='qr'?450:BILLERS[0].a};}
/* The one place that maps a MISSION key to the screen that completes it —
   used by today's daily quest card (startMission) and by the major mission
   list (A.startMajor). Ineligible major missions still open: their screens
   explain why and offer the way in (e.g. "Apply for a BPI credit card"). */
function openMission(t){
  const m=MISSION[t];
  if(m&&m.kind==='season'){
    const k=SEASON_KEYS.find(x=>SEASON[x].mission===t);
    if(k)S.season=k;
    go('season');return;
  }
  if(t==='qr'){S.pay=mkPay('qr');go('scan');}
  else if(t==='learn'){S.learn={step:0,sel:null};go('learn');}
  else if(t==='supp')go('supp');
  else if(t==='apply')go('apply');
  else if(t==='inst')go('inst');
  else if(t==='ploan')go('ploan');
  else if(LOAN_KINDS[t]){S.loanKind=t;go('loan');}
  else if(FUNDS[t]){S.fundKind=t;go('fundApply');}
  else{S.pay=mkPay(t);go('pay');}
}
function startMission(){
  const d=S.selected; if(d!==S.today||todayDone())return;
  openMission(mtype(d));
}
function renderScan(){
  const t=mtype(S.today),m=MISSION[t];
  $('#scanBanner').innerHTML=(t==='qr'&&!todayDone())?`${ic('gift','sm')} Pay ${peso(m.min,0)}+ to earn ${m.pts} pts`:`${ic('qr','sm')} QR Ph payment`;
}
function elig(p){
  const m=MISSION[p.type],dt=mtype(S.today);
  if(todayDone())return {counts:false,tone:'info',icon:'check',msg:'You already collected today’s Daily Quest.'};
  if(dt!==p.type)return {counts:false,tone:'info',icon:'info',msg:`Today’s daily mission is “${MISSION[dt].name}”. This payment won’t earn points.`};
  if(p.amount>=m.min)return {counts:true,tone:'ok',icon:'gift',msg:`Counts for today’s Daily Quest. You’ll earn ${m.pts} pts + ${m.stamp} stamp.`};
  return {counts:false,tone:'warn',icon:'info',msg:`Pay ${peso(m.min,0)} or more to earn ${m.pts} pts + ${m.stamp} stamp.`};
}
function renderPay(){
  const p=S.pay;if(!p)return;const t=p.type;
  $('#payTitle').textContent=PAY_TITLE[t];
  let top='';
  if(t==='qr')top=`<div class="card payee"><span class="avatar">K</span><div><b>Kape Kalye Coffee</b><small>QR Ph · Poblacion, Makati</small></div><span class="pill">${ic('qr','sm')}QR Ph</span></div>`;
  if(t==='bill')top=`<div class="radios" role="radiogroup" aria-label="Biller">${BILLERS.map((b,i)=>`<button class="radio ${i===p.biller?'on':''}" role="radio" aria-checked="${i===p.biller}" data-act="biller" data-i="${i}"><span class="avatar">${b.n[0]}</span><span class="grow"><b>${b.n}</b><small>${b.k} · Recurring bill</small></span><span class="rd"></span></button>`).join('')}</div>`;
  const quick=t==='qr'?[250,450,800]:[BILLERS[p.biller].a];
  $('#payBody').innerHTML=`${top}
    <div class="card amt-card"><label for="amt">Amount</label><div class="amt-row"><span>₱</span><input id="amt" inputmode="decimal" autocomplete="off" value="${p.amount}"></div>
      <div class="quick">${quick.map(v=>`<button data-act="quick" data-v="${v}">${peso(v,0)}</button>`).join('')}</div><div class="err" id="amtErr" role="alert"></div></div>
    <div id="qual"></div>
    <div class="card from"><span class="lbl">From</span><div><b>Savings Account</b><small>••••191274 · Available ${peso(S.balance)}</small></div></div>`;
  $('#payFoot').innerHTML=`<button class="btn btn-red btn-block" id="payBtn" data-act="submitPay"></button>`;
  payDyn();
}
function payDyn(){
  const p=S.pay,e=elig(p);
  $('#qual').innerHTML=`<div class="note ${e.tone}">${ic(e.icon,'md')}<span>${e.msg}</span></div>`;
  const over=p.amount>S.balance;
  $('#amtErr').textContent=over?'That is more than your available balance.':'';
  const b=$('#payBtn');b.disabled=!(p.amount>0)||over;b.textContent=PAY_CTA[p.type](p.amount);
  $$('.quick button').forEach(x=>x.classList.toggle('on',+x.dataset.v===p.amount));
}
function submitPay(){
  const p=S.pay;if(!(p.amount>0&&p.amount<=S.balance))return;
  const e=elig(p);
  S.balance-=p.amount;
  const payee=p.type==='qr'?'Kape Kalye Coffee':BILLERS[p.biller].n;
  S.result={type:p.type,amount:p.amount,payee,counts:e.counts,why:e.msg,belowMin:!todayDone()&&mtype(S.today)===p.type&&!e.counts,entry:null};
  if(e.counts)earn(p.type);
  go('success',true);
}
/* Shared by every mission. Points, stamps and the ledger entry work the
   same either way; what differs is what gets marked off — a daily mission
   closes today's date (and feeds the streak + November checklist), a major
   mission is struck off the 6-month cycle list, a seasonal one off the
   month's campaign. */
function earn(type){
  const m=MISSION[type],id=S.uid++,st=S;
  S.ledger.unshift({id,title:m.name,date:'Nov '+S.today,pts:m.pts,status:'pending'});
  S.pendingPts+=m.pts;
  if(m.kind==='major')S.majorDone.add(type);
  else if(m.kind==='season')S.seasonDone.add(type);
  else{
    S.done.add(S.today);S.streak++;
    if(type==='qr')S.check.pay=true;if(type==='bill')S.check.bill=true;
  }
  const before=S.stamps;S.stamps=Math.min(5,S.stamps+m.stamp);S.lastStamp=S.stamps>before;
  S.result.entry=id;
  setTimeout(()=>{ if(st!==S)return;
    const e=S.ledger.find(x=>x.id===id);if(!e||e.status!=='pending')return;
    e.status='confirmed';S.pts+=e.pts;S.pendingPts-=e.pts;refreshTop();
  },1800);
}
function refreshTop(){
  const top=S.stack[S.stack.length-1];
  if(top==='success')updateSuccess();else(RENDER[top]||(()=>{}))();
  repaintSheet();
}
