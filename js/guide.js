'use strict';
/* ---------- prototype guide (side panel + "More" sheet) ---------- */
function guideHTML(){
  const cur=S.todayType||'qr';
  return `<div class="panel-in" style="display:flex;flex-direction:column;gap:18px">
    <span class="tag">Concept prototype</span>
    <h2>BPI Daily Wins</h2>
    <p class="lead">Earn points from everyday banking and convert them to cashback. Two kinds of mission: one <b>daily</b> mission a day, assigned automatically, plus <b>major</b> product milestones that refresh every 6 months.</p>
    <h3>Walkthrough</h3>
    <ol class="steps">
      <li><button data-act="demoGo" data-v="1"><span class="n">1</span><span><b>Discover today’s mission</b><small>Banner and quest tile on the home screen</small></span></button></li>
      <li><button data-act="demoGo" data-v="2"><span class="n">2</span><span><b>A month of daily goals</b><small>Pick any of the 30 dates</small></span></button></li>
      <li><button data-act="demoGo" data-v="3"><span class="n">3</span><span><b>Instant rewards visibility</b><small>Complete today’s mission</small></span></button></li>
      <li><button data-act="demoGo" data-v="4"><span class="n">4</span><span><b>Convert points to cashback</b><small>Confirm and see the credit</small></span></button></li>
      <li><button data-act="demoGo" data-v="5"><span class="n">5</span><span><b>Major missions</b><small>One-off milestones, ${MAJOR_CYCLE.label} cycle</small></span></button></li>
      <li><button data-act="demoGo" data-v="6"><span class="n">6</span><span><b>Seasonal campaign</b><small>${season().month}: ${season().title}</small></span></button></li>
    </ol>
    <h3>Seasonal campaign</h3>
    <div class="seg4">${SEASON_KEYS.map(k=>`<button class="${S.season===k?'on':''}" data-act="seasonMode" data-v="${k}">${SEASON[k].month.slice(0,3)}</button>`).join('')}</div>
    <p class="fine">The banner above the dates. Only the live month shows in the real app — this previews all three. Pictures live in <b>img/</b>; see the README there.</p>
    <h3>Try today’s daily mission as</h3>
    <div class="seg4">${DAILY_KEYS.map(k=>`<button class="${cur===k?'on':''}" data-act="demoType" data-v="${k}">${MISSION[k].short}</button>`).join('')}</div>
    <p class="fine">Normally assigned by BPI from the customer’s recent activity — there is no in-app mission picker. This toggle previews each one.</p>
    <h3>Major mission progress</h3>
    <div class="seg4">
      <button class="${nMajor()?'':'on'}" data-act="demoMajor" data-v="0">All open</button>
      <button class="${nMajor()===MAJOR_KEYS.length?'on':''}" data-act="demoMajor" data-v="1">All done</button>
    </div>
    <p class="fine">${nMajor()} of ${MAJOR_KEYS.length} earned this cycle. Resets ${MAJOR_CYCLE.next}.</p>
    <h3>Credit card status</h3>
    <div class="seg4">
      <button class="${S.hasCard?'on':''}" data-act="cardMode" data-v="1">Cardholder</button>
      <button class="${S.hasCard?'':'on'}" data-act="cardMode" data-v="0">Non-holder</button>
    </div>
    <h3>Application route (non-holder)</h3>
    <div class="seg4">
      <button class="${S.ccRoute==='pq'?'on':''}" data-act="ccRoute" data-v="pq">Pre-qualified</button>
      <button class="${S.ccRoute==='regular'?'on':''}" data-act="ccRoute" data-v="regular">Regular</button>
      <button class="${S.ccRoute==='express'?'on':''}" data-act="ccRoute" data-v="express">Express Start</button>
    </div>
    <p class="fine">Normally chosen automatically by BPI’s eligibility engine based on the applicant’s history. This toggle previews each path.</p>
    <h3>Personal loan route</h3>
    <div class="seg4">
      <button class="${S.loanRoute==='pq'?'on':''}" data-act="loanRoute" data-v="pq">Pre-qualified</button>
      <button class="${S.loanRoute==='regular'?'on':''}" data-act="loanRoute" data-v="regular">Regular</button>
    </div>
    <h3>Investment account</h3>
    <div class="seg4">
      <button class="${S.hasFund?'on':''}" data-act="fundMode" data-v="1">Investor</button>
      <button class="${S.hasFund?'':'on'}" data-act="fundMode" data-v="0">Not yet</button>
    </div>
    <button class="ghost" data-act="demoReset">Reset demo</button>
    <p class="fine">Illustrative values only: 100 pts = ₱5. Not connected to real accounts. Finance validates actual rewards and costs.</p>
  </div>`;
}
function renderPanel(){$('#panel').innerHTML=guideHTML();}
function reset(tt){
  const hc=S.hasCard,route=S.ccRoute,loanRoute=S.loanRoute,hasFund=S.hasFund,sea=S.season;
  S=fresh(tt);
  S.hasCard=hc===undefined?true:hc;
  S.ccRoute=route||'pq';
  S.loanRoute=loanRoute||'pq';
  S.hasFund=hasFund===undefined?true:hasFund;
  S.season=sea||SEASON_KEYS[0];
  closeSheet();paint(true);
}
function demoGo(n){
  closeSheet();
  if(n===1){S.chip='deposits';setStack(['home']);$('#homeScroll').scrollTop=0;const c=$('#car');if(c)c.scrollLeft=0;}
  if(n===2){S.tab='month';S.selected=S.today;setStack(['home','hub']);}
  if(n===3){if(todayDone())reset(S.todayType);S.tab='daily';S.selected=S.today;setStack(['home','hub']);startMission();}
  if(n===4){if(S.pts<2000)reset(S.todayType);S.redeemSel=null;setStack(['home','hub','redeem']);}
  if(n===5){S.tab='major';setStack(['home','hub']);}
  if(n===6){S.tab='daily';S.selected=S.today;setStack(['home','hub']);}
}
