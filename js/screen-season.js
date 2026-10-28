'use strict';
/* ---------- seasonal campaign (kind:'season' missions) ----------
   One campaign per calendar month, defined in SEASON (data.js). It shows as
   a banner above the date strip on the hub's Daily and Month tabs — no tab
   of its own — and opens this screen: what the campaign is, the one thing
   you have to do, and an Apply button. The reward arrives as a sheet rather
   than the success screen, because applying never leaves the campaign.
   Which month is showing is S.season, a guide-panel preview toggle (the
   prototype is pinned to November 2026, so 'nov' is the live one). */

/* The banner picture. SEASON[k].img is the file you drop into img/ (img/nov.jpg,
   img/dec.jpg, img/jan.jpg — named after the SEASON key); if it isn't there,
   onerror walks data-fb — the shipped SVG placeholder for that month, then
   the generic default — and finally hides the <img> so the card's own
   gradient shows. An inline onerror is the only way to catch an image 404
   without wiring a listener on every render. */
function seasonImg(k){
  const s=SEASON[k];
  return `<img class="season-img" src="${s.img}" alt="" data-fb="img/${k}.svg|${SEASON_IMG_DEFAULT}" onerror="seasonImgFail(this)">`;
}
function seasonImgFail(el){
  const fb=(el.dataset.fb||'').split('|').filter(Boolean),next=fb.shift();
  el.dataset.fb=fb.join('|');
  if(next)el.src=next;
  else{el.onerror=null;el.style.display='none';}
}
/* The banner, rendered by screen-hub.js at the top of the Daily and Month tabs. */
function seasonBanner(){
  const k=S.season,s=season(),m=MISSION[s.mission],done=seasonDone();
  return `<button class="season" data-act="goSeason" aria-label="${s.month} seasonal campaign: ${s.title}. ${done?'Joined':'Open'}">
    ${seasonImg(k)}<span class="season-shade"></span>
    <span class="season-in">
      <span class="season-tag">${ic('flame','sm')}${s.month} · Seasonal</span>
      <b>${s.title}</b>
      <small>${s.tagline}</small>
      <span class="season-row">
        ${done?`<span class="status-chip ok">Joined</span>`:`<span class="pill gold">+${m.pts} pts · +${m.stamp} stamp</span>`}
        <span class="season-go">${done?'See details':'See the offer'}${ic('chev-r','sm')}</span>
      </span>
    </span></button>`;
}
function seasonElig(){
  const s=season(),m=MISSION[s.mission];
  if(seasonDone())return {counts:false,tone:'info',icon:'check',msg:`You already joined ${s.title}. Each campaign runs once, and a new one opens next month.`};
  return {counts:true,tone:'ok',icon:'gift',msg:`Counts as this month’s seasonal mission. You’ll earn ${m.pts} pts + ${m.stamp} stamp.`};
}
function refField(){
  return `<div class="id-field"><label for="seasonRef">Referral code (optional)</label>
    <input id="seasonRef" autocomplete="off" placeholder="e.g. BPI-FRIEND-2026" value="${S.seasonRef||''}"></div>`;
}
function renderSeason(){
  const k=S.season,s=season(),m=MISSION[s.mission],e=seasonElig(),done=seasonDone();
  $('#seasonTitle').textContent=s.month;
  const hero=`<div class="season tall" aria-hidden="true">${seasonImg(k)}<span class="season-shade"></span>
    <span class="season-in"><span class="season-tag">${ic('flame','sm')}${s.month} · Seasonal</span><b>${s.title}</b><small>${s.tagline}</small></span></div>`;
  const about=`<div class="card tip"><span class="big-ic">${ic(m.icon)}</span><h3>${m.name}</h3>
    <p>${s.lede}</p><ul class="bullets">${s.bullets.map(b=>`<li>${b}</li>`).join('')}</ul></div>`;
  const rew=`<div class="q-rew"><span class="pill gold">+${m.pts} pts</span><span class="pill">+${m.stamp} stamp</span></div>`;
  let form='';
  if(done){
    form='';
  }else if(s.form==='photo'){
    form=`<div class="card" style="display:flex;flex-direction:column;gap:16px">
      <div><h4>How to join</h4><p class="muted" style="font-size:15px;margin-top:4px">${s.how}</p></div>
      ${dropField('Your child in a Disney costume','seasonPhoto','Upload a photo of your child in a Disney costume')}
      ${refField()}</div>`;
  }else if(s.form==='referral'){
    form=`<div class="card" style="display:flex;flex-direction:column;gap:16px">
      <div><h4>How to join</h4><p class="muted" style="font-size:15px;margin-top:4px">${s.how}</p></div>
      ${refField()}</div>`;
  }else{
    form=`<div class="card"><h4>Choose your plan</h4><p class="muted" style="font-size:15px;margin:4px 0 12px">${s.how}</p>
      <div class="radios" role="radiogroup" aria-label="Choose your plan">${PLANS.map((p,i)=>`<button class="radio ${i===S.seasonPick?'on':''}" role="radio" aria-checked="${i===S.seasonPick}" data-act="seasonPick" data-i="${i}"><span class="grow"><b>${p.n}</b><small>${p.d}</small></span><span class="rd"></span></button>`).join('')}</div></div>`;
  }
  $('#seasonBody').innerHTML=hero+about+rew+form+
    `<div class="note ${e.tone}">${ic(e.icon,'md')}<span>${e.msg}</span></div>
     <p class="footnote">Concept prototype. Campaign mechanics, partners and rewards are illustrative and need Marketing and Finance sign-off.</p>`;
  $('#seasonFoot').innerHTML=done
    ?`<button class="btn btn-ghost btn-block" data-act="goHub">Back to BPI Quest</button>`
    :`<button class="btn btn-red btn-block" id="seasonBtn" data-act="submitSeason">${m.cta}</button>`;
  if(!done&&s.form==='photo'){wireDropzone('seasonPhoto',seasonDyn);seasonDyn();}
}
function seasonDyn(){
  const b=$('#seasonBtn');if(!b)return;
  b.disabled=!($('#seasonPhotoFile')&&$('#seasonPhotoFile').files.length>0);
}
function submitSeason(){
  const s=season();
  if(seasonDone())return;
  const file=s.form==='photo'?($('#seasonPhotoFile')&&$('#seasonPhotoFile').files[0]):null;
  if(s.form==='photo'&&!file)return;
  S.result={type:s.mission,counts:true,entry:null,season:S.season,
    photo:file?file.name:'',ref:S.seasonRef||'',plan:s.form==='plans'?PLANS[S.seasonPick].n:''};
  earn(s.mission);
  renderSeason();
  // Passed as a function, not a string, so repaintSheet() can flip the
  // points chip from validating to confirmed while the sheet stays open.
  openSheet(seasonRewardHTML);
}
function seasonRewardHTML(){
  const r=S.result;if(!r)return '';
  const s=SEASON[r.season],m=MISSION[s.mission];
  const e=S.ledger.find(x=>x.id===r.entry),conf=e&&e.status==='confirmed';
  return `<div class="ok-wrap" style="padding:2px 0 0"><div class="ok-badge sm">${ic('check')}</div><h2>${s.done[0]}</h2><p>${s.done[1]}</p></div>
    <div class="rows">
      <div><span>${s.month} campaign</span><b class="g">Joined</b></div>
      ${r.plan?`<div><span>Plan</span><b>${r.plan}</b></div>`:''}
      ${r.photo?`<div><span>Photo sent</span><b>${r.photo}</b></div>`:''}
      ${r.ref?`<div><span>Referral code</span><b>${r.ref}</b></div>`:''}
      <div><span>Stamp collected</span><b>+${m.stamp} stamp</b></div>
      <div><span>Reward points</span><span style="display:flex;gap:10px;align-items:center">${conf?'<span class="status-chip ok">Confirmed</span>':'<span class="status-chip pend"><i class="spin"></i>Validating</span>'}<b class="num">+${m.pts} pts</b></span></div>
    </div>
    <button class="btn btn-red btn-block" data-act="goHub">See my rewards</button>
    <button class="btn btn-ghost btn-block" data-act="closeSheet">Close</button>`;
}
