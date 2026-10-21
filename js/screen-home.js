'use strict';
/* ---------- HOME ---------- */
function slide(o){return `<article class="slide"><div class="slide-tx"><span class="dot-red"></span><h3>${o.t}</h3><p>${o.d}</p><button class="link" data-act="${o.act}" ${o.attr||''}>${o.l}</button></div>${o.pill||''}<div class="slide-ill">${o.ill}</div></article>`;}
function renderHome(){
  const oc=$('#car'),cs=oc?oc.scrollLeft:0,och=$('#chips'),chs=och?och.scrollLeft:0;
  const t=mtype(S.today),m=MISSION[t],done=todayDone(),nx=MISSION[mtype(S.today+1)];
  const s1=done
    ? slide({t:'Today’s win is collected',d:`You earned ${m.pts} pts. Tomorrow: ${nx.name.toLowerCase()}.`,l:'See my rewards',act:'go',attr:'data-to="hub"',ill:ic('gift')})
    : slide({t:'Today’s Daily Win',d:`${m.desc.replace('.','')} to earn ${m.pts} pts${m.stamp?' + 1 stamp':''}.`,l:'Explore my mission',act:'go',attr:'data-to="hub"',ill:ic('gift')});
  const s2=slide({t:'Have a look at your inbox',d:'Check out the personal finance insights that you have so far',l:'Go to Insights Inbox',act:'toast',attr:'data-msg="Insights Inbox is not part of this prototype"',ill:ic('wallet')+''});
  const s3=slide({t:'Pay your bills with ease',d:'Set up auto-pay for Meralco, Maynilad and more',l:'Set up auto-pay',act:'toast',attr:'data-msg="Auto-pay is not part of this prototype"',ill:ic('bill')});
  const titles={deposits:'Deposits',investments:'Investments',cards:'Cards',loans:'Loans',rewards:'Rewards'};
  let content='';
  if(S.chip==='deposits'){
    const bal=S.showBal?`PHP <b class="num">${fmt(S.balance)}</b>`:'PHP <b>••••••••</b>';
    content=`<button class="card acct" data-act="toast" data-msg="Account details are not part of this prototype"><h3>SAVINGS ACCOUNT</h3><p class="mask">••••191274</p><div class="bal"><span>${bal}</span><small>Available balance</small></div></button>${dwTile()}`;
  }else if(S.chip==='rewards'){
    const left=MAJOR_KEYS.length-nMajor();
    content=dwTile()
      +`<button class="card tile" data-act="goMajor"><span class="tile-ic">${ic('arrow-up')}</span><span class="tile-tx"><b>Major missions</b><small>${left?`${left} open until ${MAJOR_CYCLE.ends}`:`All done · resets ${MAJOR_CYCLE.next}`}</small></span>${ic('chev-r')}</button>`
      +`<button class="card tile" data-act="go" data-to="redeem" ${S.pts<2000?'disabled':''}><span class="tile-ic">${ic('cash')}</span><span class="tile-tx"><b>Convert to cashback</b><small>100 pts = ₱5, credited to your savings</small></span>${ic('chev-r')}</button>`;
  }else if(S.chip==='investments'){
    content=S.hasFund
      ?Object.entries(FUNDS).map(([k,f])=>{
          const h=S.fundHoldings[k],gain=h.value-h.invested,up=gain>=0,pct=h.invested?Math.abs(gain/h.invested*100).toFixed(1):'0.0';
          return `<div class="card"><div class="row-b"><h4>${f.full}</h4><span class="pill">${f.label}</span></div>
            <div class="rows" style="margin-top:8px">
              <div><span>Amount invested</span><b class="num">${peso(h.invested)}</b></div>
              <div><span>Current value</span><b class="num">${peso(h.value)}</b></div>
              <div><span>Unrealized ${up?'gain':'loss'}</span><b class="num ${up?'g':'r'}">${up?'+':'−'}${peso(Math.abs(gain))} (${up?'+':'−'}${pct}%)</b></div>
            </div>
            <button class="btn btn-red btn-block" style="margin-top:12px" data-act="goFundDeposit" data-kind="${k}">Deposit more</button></div>`;
        }).join('')
      :`<button class="card tile" data-act="goFund" data-kind="uitf"><span class="tile-ic">${ic('chart')}</span><span class="tile-tx"><b>UITF</b><small>Unit Investment Trust Fund · No forms, just a few questions</small></span>${ic('chev-r')}</button>
        <button class="card tile" data-act="goFund" data-kind="alfm"><span class="tile-ic">${ic('chart')}</span><span class="tile-tx"><b>ALFM</b><small>ALFM Mutual Fund · No forms, just a few questions</small></span>${ic('chev-r')}</button>`;
  }else if(S.chip==='cards'){
    content=S.hasCard
      ?`<div class="card cc"><div><small>BPI</small><b style="display:block;margin-top:2px">Rewards Credit Card</b><small>•••• 4821</small></div><div class="row-b"><small>Credit limit</small><b class="num" style="font-size:16px">${peso(150000,0)}</b></div></div>
        <button class="card tile" data-act="go" data-to="inst"><span class="tile-ic">${ic('card')}</span><span class="tile-tx"><b>Switch a purchase to installment</b><small>Spread a big purchase over 3, 6, or 12 months</small></span>${ic('chev-r')}</button>
        <button class="card tile" data-act="go" data-to="supp"><span class="tile-ic">${ic('card')}</span><span class="tile-tx"><b>Add a supplementary card</b><small>Share your credit limit with family · Free for your first card</small></span>${ic('chev-r')}</button>`
      :`<button class="card tile" data-act="go" data-to="apply"><span class="tile-ic">${ic('card')}</span><span class="tile-tx"><b>You may be eligible for a BPI credit card</b><small>Takes less than a minute to check</small></span>${ic('chev-r')}</button>`;
  }else if(S.chip==='loans'){
    content=`<button class="card tile feat" data-act="go" data-to="ploan"><span class="tile-ic">${ic('wallet')}</span><span class="tile-tx"><b>Personal Loan</b><small>Pre-qualified offers available · No income docs needed for PQ</small></span>${ic('chev-r')}</button>
      <p class="muted" style="font-size:14px;padding:4px 2px 0">Other loans</p>
      ${Object.entries(LOAN_KINDS).map(([k,v])=>`<button class="card tile" data-act="goLoan" data-kind="${k}"><span class="tile-ic">${ic(v.icon)}</span><span class="tile-tx"><b>${v.label}</b><small>Subject to credit evaluation and approval</small></span>${ic('chev-r')}</button>`).join('')}`;
  }else{
    content=`<div class="card empty"><b>No cards to show</b><p>Your credit and debit cards will show up here.</p></div>`;
  }
  $('#homeBody').innerHTML=`
    <header class="greet"><div><p>Good afternoon,</p><h1>France</h1></div><button class="ib" data-act="toast" data-msg="Inbox is not part of this prototype" aria-label="Inbox">${ic('mail')}</button></header>
    <div class="car" id="car" tabindex="0" aria-label="Highlights">${s1}${s2}${s3}</div>
    <div class="dots" id="dots" aria-hidden="true"><i class="on"></i><i></i><i></i></div>
    <div class="filters"><button class="eye" data-act="toggleBal" aria-label="${S.showBal?'Hide':'Show'} balances" aria-pressed="${S.showBal}">${ic(S.showBal?'eye':'eye-off','md')}</button><span class="vr"></span>
      <div class="chips" id="chips">${Object.keys(titles).map(k=>`<button data-act="chip" data-v="${k}" class="${S.chip===k?'on':''}" aria-pressed="${S.chip===k}">${titles[k]}</button>`).join('')}</div></div>
    <section class="home-sec"><h2>${titles[S.chip]}</h2>${content}</section>`;
  const car=$('#car');car.scrollLeft=cs;$('#chips').scrollLeft=chs;
  car.addEventListener('scroll',()=>{const w=car.firstElementChild.offsetWidth+12,i=Math.round(car.scrollLeft/w);$$('#dots i').forEach((d,k)=>d.classList.toggle('on',k===i));},{passive:true});
}
function dwTile(){
  const t=mtype(S.today),m=MISSION[t],done=todayDone();
  return `<button class="card tile" data-act="go" data-to="hub"><span class="tile-ic">${ic('gift')}</span><span class="tile-tx"><b>Daily Wins</b><small>${done?'Today’s win collected':`Today: ${m.name} · +${m.pts} pts`}</small></span><span class="tile-pts"><b class="num">${pts(S.pts)}</b><small>pts</small></span></button>`;
}
