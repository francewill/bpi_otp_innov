'use strict';
/* ---------- HUB ---------- */
function renderHub(){
  const prev=$('#days'),keep=prev?prev.scrollLeft:null;
  const pct=Math.min(100,S.pts/200),ready=S.pts>=20000;
  const doneN=[...S.done].filter(d=>d<=S.today).length;
  const hero=`<div class="hero">
    <div class="hero-top"><span>My rewards</span><span class="streak">${ic('flame','sm')} ${S.streak}-day streak</span></div>
    <div class="hero-pts num">${pts(S.pts)}<small>pts</small></div>
    <div class="hero-sub">Worth ${peso(S.pts*0.05,0)} in cashback${S.pendingPts?` · +${S.pendingPts} pts validating`:''}</div>
    <div class="meter" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100" aria-label="Progress to ₱1,000 cashback"><i style="width:${pct}%"></i></div>
    <div class="hero-note"><span>${ready?'Your ₱1,000 cashback is ready':`${pts(20000-S.pts)} pts to unlock ₱1,000`}</span><span class="num">${pts(S.pts)} / 20,000</span></div>
    <button class="btn btn-light btn-block" data-act="go" data-to="redeem" ${S.pts<2000?'disabled':''}>Convert to cashback</button>
  </div>`;
  const seg=`<div class="seg" role="tablist">${[['quests','Quests'],['month','Month'],['activity','Activity']].map(([k,l])=>`<button role="tab" aria-selected="${S.tab===k}" class="${S.tab===k?'on':''}" data-act="tab" data-v="${k}">${l}</button>`).join('')}</div>`;
  let body='';
  if(S.tab==='quests'){
    const days=Array.from({length:30},(_,i)=>i+1).map(d=>{
      const st=dstatus(d),m=MISSION[mtype(d)];
      const mk=st==='done'?ic('check'):st==='missed'?ic('minus'):ic(m.icon);
      return `<button class="day st-${st} ${d===S.selected?'sel':''}" data-act="pick" data-d="${d}" aria-label="${dlabel(d)}, ${m.short}, ${st}" aria-pressed="${d===S.selected}"><small>${wd(d)}</small><b class="num">${d}</b><span class="mk">${mk}</span></button>`;
    }).join('');
    body=`<div><div class="sect-row" style="padding:0 0 8px"><h3>November 2026</h3><span class="muted" style="font-size:14px">${doneN} of ${S.today} days done</span></div><div class="days" id="days">${days}</div></div>
      ${questCard(S.selected)}${stampsCard()}${checklistCard()}`;
  }else if(S.tab==='month'){
    const cells=Array.from({length:30},(_,i)=>i+1).map(d=>{
      const st=dstatus(d),m=MISSION[mtype(d)];
      return `<button class="cell st-${st} ${d===S.selected?'sel':''}" data-act="pick" data-d="${d}" aria-label="${dlabel(d)}, ${m.short}, ${st}" aria-pressed="${d===S.selected}"><b class="num">${d}</b>${st==='done'?ic('check'):ic(m.icon)}</button>`;
    }).join('');
    body=`<div class="card"><div class="row-b" style="margin-bottom:12px"><h4>November 2026</h4><span class="muted" style="font-size:14px">30 dates, a goal every day</span></div>
      <div class="cal">${WD.map(w=>`<span class="wh">${w[0]}</span>`).join('')}${cells}</div>
      <div class="legend"><span><i style="background:var(--green-tint);outline:1px solid var(--green)"></i>Done</span><span><i style="background:var(--red)"></i>Today</span><span><i style="background:var(--bg);border:1px solid var(--ink-2)"></i>Upcoming</span><span><i style="background:var(--bg);border:1px dashed var(--ink-2)"></i>Missed</span></div></div>${questCard(S.selected)}`;
  }else{
    body=`<div class="card"><div class="row-b"><h4>Points activity</h4><span class="muted" style="font-size:14px">${S.ledger.length} entries</span></div>
      <ul class="led">${S.ledger.map(e=>{
        const neg=e.pts<0,chip=e.status==='pending'?`<span class="status-chip pend"><i class="spin"></i>Validating</span>`:e.status==='redeemed'?`<span class="status-chip red">Converted</span>`:`<span class="status-chip ok">Confirmed</span>`;
        return `<li><span class="tile-ic" style="width:40px;height:40px">${ic(neg?'cash':'gift','md')}</span><div class="ti"><b>${e.title}</b><small>${e.date}</small></div><div class="pt"><b class="num ${neg?'':'pos'}">${neg?'−':'+'}${pts(Math.abs(e.pts))} pts</b>${chip}</div></li>`;}).join('')}</ul></div>`;
  }
  $('#hubBody').innerHTML=hero+seg+body+`<p class="footnote">Concept prototype. Points and cashback values are illustrative: 100 pts = ₱5.</p>`;
  const strip=$('#days');
  if(strip){ if(keep!==null)strip.scrollLeft=keep; else {const b=$('.day.sel',strip);strip.scrollLeft=b.offsetLeft-strip.clientWidth/2+b.offsetWidth/2-16;} }
}
function questCard(d){
  const t=mtype(d),m=MISSION[t],st=dstatus(d);
  const rew=`<div class="q-rew"><span class="pill gold">+${m.pts} pts</span>${m.stamp?`<span class="pill">+${m.stamp} stamp</span>`:''}</div>`;
  let act='';
  if(st==='today'){
    if((t==='supp'||t==='inst')&&!S.hasCard)act=`<div class="q-state">${ic('info','md')}Available to BPI credit cardholders. Try the “Cardholder” toggle in the prototype guide.</div>`;
    else if(t==='apply'&&S.hasCard)act=`<div class="q-state ok">${ic('check','md')}You already have a BPI credit card.</div>`;
    else if((t==='uitf'||t==='alfm')&&S.hasFund)act=`<div class="q-state ok">${ic('check','md')}You already have a BPI Wealth investment account.</div>`;
    else act=`<button class="btn btn-red btn-block" data-act="start">${m.cta}</button>`;
  }
  else if(st==='done')act=`<div class="q-state ok">${ic('check','md')}Completed · ${m.pts} pts earned</div>`;
  else if(st==='missed')act=`<div class="q-state">${ic('info','md')}This day has passed. Missions can only be done on the day.</div>`;
  else act=`<div class="q-state">${ic('lock','md')}Opens on ${dlabel(d)}</div>`;
  const lbl=d===S.today?'Today':dlabel(d).split(',')[0];
  return `<article class="card quest"><div class="q-head"><span class="q-ic">${ic(m.icon)}</span><div><div class="q-date">${lbl} · ${dlabel(d)}</div><h3>${m.name}</h3></div></div><p>${m.desc}</p>${rew}${act}</article>`;
}
function stampsHTML(n,newOne){return `<div class="stamps">${Array.from({length:5},(_,i)=>`<span class="stamp ${i<n?'on':''} ${newOne&&i===n-1?'new':''}">${ic('check')}</span>`).join('')}</div>`;}
function stampsCard(){
  const left=5-S.stamps;
  return `<article class="card"><div class="row-b"><h4>Stamps</h4><span class="muted num" style="font-size:15px">${S.stamps} of 5</span></div>${stampsHTML(S.stamps)}<p class="muted" style="font-size:15px">${left>0?`${left} more stamp${left>1?'s':''} to your 5-stamp milestone.`:'Milestone reached. Nice work.'}</p></article>`;
}
function checklistCard(){
  const n=nCheck(),pct=n*25,c=2*Math.PI*22;
  return `<article class="card"><div class="row-b" style="align-items:center"><div><h4>Your Everyday Wins</h4><p class="muted" style="font-size:15px">November financial missions</p><p style="font-size:15px;margin-top:4px"><b>${n} of 4</b> missions completed</p></div>
    <div class="ring"><svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="22" fill="none" stroke="var(--chip)" stroke-width="6"/><circle cx="28" cy="28" r="22" fill="none" stroke="var(--green)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c*pct/100} ${c}"/></svg><b class="num">${pct}%</b></div></div>
    <ul class="check-list">${CHECKS.map(([k,l])=>`<li class="${S.check[k]?'on':''}"><span class="c">${ic('check')}</span>${l}</li>`).join('')}</ul></article>`;
}
