'use strict';
/* ---------- prototype guide (side panel + "More" sheet) ---------- */
function guideHTML(){
  const cur=S.todayType||'qr';
  return `<div class="panel-in" style="display:flex;flex-direction:column;gap:18px">
    <span class="tag">Concept prototype</span>
    <h2>BPI Daily Wins</h2>
    <p class="lead">Earn points from everyday banking and convert them to cashback. Follow the four steps from the deck.</p>
    <h3>Walkthrough</h3>
    <ol class="steps">
      <li><button data-act="demoGo" data-v="1"><span class="n">1</span><span><b>Discover today’s mission</b><small>Banner and quest tile on the home screen</small></span></button></li>
      <li><button data-act="demoGo" data-v="2"><span class="n">2</span><span><b>A month of daily goals</b><small>Pick any of the 30 dates</small></span></button></li>
      <li><button data-act="demoGo" data-v="3"><span class="n">3</span><span><b>Instant rewards visibility</b><small>Complete today’s mission</small></span></button></li>
      <li><button data-act="demoGo" data-v="4"><span class="n">4</span><span><b>Convert points to cashback</b><small>Confirm and see the credit</small></span></button></li>
    </ol>
    <h3>Try today’s mission as</h3>
    <div class="seg4">${['qr','bill','save','learn','supp','apply','inst'].map(k=>`<button class="${cur===k?'on':''}" data-act="demoType" data-v="${k}">${MISSION[k].short}</button>`).join('')}</div>
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
    <button class="ghost" data-act="demoReset">Reset demo</button>
    <p class="fine">Illustrative values only: 100 pts = ₱5. Not connected to real accounts. Finance validates actual rewards and costs.</p>
  </div>`;
}
function renderPanel(){$('#panel').innerHTML=guideHTML();}
function reset(tt){
  const hc=S.hasCard,route=S.ccRoute;
  S=fresh(tt);
  S.hasCard=hc===undefined?true:hc;
  S.ccRoute=route||'pq';
  closeSheet();paint(true);
}
function demoGo(n){
  closeSheet();
  if(n===1){S.chip='deposits';setStack(['home']);$('#homeScroll').scrollTop=0;const c=$('#car');if(c)c.scrollLeft=0;}
  if(n===2){S.tab='month';S.selected=S.today;setStack(['home','hub']);}
  if(n===3){if(todayDone())reset(S.todayType);S.tab='quests';S.selected=S.today;setStack(['home','hub']);startMission();}
  if(n===4){if(S.pts<2000)reset(S.todayType);S.redeemSel=null;setStack(['home','hub','redeem']);}
}
