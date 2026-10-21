'use strict';
/* ---------- dom + format helpers ---------- */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const ic=(n,c='')=>`<svg class="ic ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const fmt=(n,d=2)=>n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const peso=(n,d=2)=>'₱'+fmt(n,d);
const pts=n=>n.toLocaleString('en-US');

/* ---------- content ---------- */
const WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const wd=d=>WD[(d-1)%7];               // November 2026 starts on a Sunday
const dlabel=d=>`${wd(d)}, Nov ${d}`;
/* Two mission kinds, one table.
   kind:'daily' — everyday banking actions. Exactly one is active per date,
     assigned by the bank from PATTERN below; it has to be done on the day.
   kind:'major' — one-off product milestones. No date, no daily deadline:
     each can be earned once per 6-month cycle (MAJOR_CYCLE). */
const MISSION={
  qr:{kind:'daily',name:'Pay with QR Ph',short:'QR pay',desc:'Pay ₱400 or more at any QR Ph merchant.',min:400,pts:100,stamp:1,cta:'Scan to pay',icon:'qr'},
  bill:{kind:'daily',name:'Pay a bill',short:'Pay bill',desc:'Pay any bill of ₱300 or more through BPI.',min:300,pts:100,stamp:1,cta:'Choose a biller',icon:'bill'},
  learn:{kind:'daily',name:'Learn a money tip',short:'Learn',desc:'Read a 1-minute tip and answer one question.',min:0,pts:50,stamp:0,cta:'Start the 1-minute tip',icon:'book'},
  supp:{kind:'major',name:'Add a supplementary card',short:'Supp. card',desc:'Give a supplementary card to a family member and share your credit limit.',min:0,pts:100,stamp:1,cta:'Apply for a supplementary card',icon:'card'},
  apply:{kind:'major',name:'Apply for a credit card',short:'Apply',desc:'See if you’re eligible for a BPI credit card — your path depends on your BPI history.',min:0,pts:100,stamp:1,cta:'Check your application',icon:'card'},
  inst:{kind:'major',name:'Switch a purchase to installment',short:'Installment',desc:'Spread an eligible posted purchase over 3, 6, or 12 months.',min:0,pts:100,stamp:1,cta:'Choose a purchase',icon:'card'},
  ploan:{kind:'major',name:'Apply for a personal loan',short:'Personal loan',desc:'See if you’re pre-qualified for a personal loan — your path depends on your BPI history.',min:0,pts:100,stamp:1,cta:'Check your application',icon:'wallet'},
  auto:{kind:'major',name:'Apply for an auto loan',short:'Auto loan',desc:'Finance a car purchase — subject to credit evaluation and approval.',min:0,pts:100,stamp:1,cta:'Check your application',icon:'car'},
  housing:{kind:'major',name:'Apply for a housing loan',short:'Housing loan',desc:'Finance a home purchase — subject to credit evaluation and approval.',min:0,pts:100,stamp:1,cta:'Check your application',icon:'home'},
  moto:{kind:'major',name:'Apply for a motorcycle loan',short:'Moto loan',desc:'Finance a motorcycle purchase — subject to credit evaluation and approval.',min:0,pts:100,stamp:1,cta:'Check your application',icon:'moto'},
  uitf:{kind:'major',name:'Apply for a UITF fund',short:'UITF',desc:'Start investing in a BPI Unit Investment Trust Fund — no forms, just a few questions.',min:0,pts:100,stamp:1,cta:'Apply now',icon:'chart'},
  alfm:{kind:'major',name:'Apply for an ALFM fund',short:'ALFM',desc:'Start investing in an ALFM Mutual Fund — no forms, just a few questions.',min:0,pts:100,stamp:1,cta:'Apply now',icon:'chart'}
};
const DAILY_KEYS=Object.keys(MISSION).filter(k=>MISSION[k].kind==='daily');
const MAJOR_KEYS=Object.keys(MISSION).filter(k=>MISSION[k].kind==='major');
// Major missions refresh every 6 months. This prototype sits inside the
// Jul–Dec 2026 window, so the whole major list unlocks again on Jan 1, 2027.
const MAJOR_CYCLE={label:'Jul – Dec 2026',ends:'Dec 31, 2026',next:'Jan 1, 2027'};
const MIN_HOLD=5000;      // Express Start minimum hold amount
const PQ_LIMIT=80000;     // illustrative pre-qualified credit limit
const HOLD_QUICK=[5000,10000,20000];
const INSTALL_ITEMS=[{n:'Samsung Appliance Store',d:'Posted Oct 2',a:15990},{n:'Cebu Pacific',d:'Posted Oct 8',a:8400},{n:'SM Department Store',d:'Posted Oct 11',a:4200}];
const TENORS=[3,6,12];
const PROCESSING_FEE=500;   // flat fee added to the purchase before dividing by term
const PL_PQ_AMOUNT=150000;  // illustrative pre-qualified personal loan amount
// Auto/Housing/Motorcycle share one screen (screen-loan.js); LOAN_KINDS holds
// the product-name label + icon used for Home-tab tiles and success copy,
// separate from MISSION's verb-phrase name/short used for the quest card.
const LOAN_KINDS={
  auto:{label:'Auto Loan',icon:'car'},
  housing:{label:'Housing Loan',icon:'home'},
  moto:{label:'Motorcycle Loan',icon:'moto'}
};
// BPI Wealth (investment). Static label/icon only — the mutable invested/
// value figures per fund live in S.fundHoldings (state.js), not here.
const FUNDS={
  uitf:{label:'UITF',full:'Unit Investment Trust Fund',icon:'chart'},
  alfm:{label:'ALFM',full:'ALFM Mutual Fund',icon:'chart'}
};
const FUND_DEP_QUICK=[1000,5000,10000];
const MARITAL=['Single','Married','Widowed','Separated'];
const JOB_NATURE=['Employed','Self-employed','Business owner','OFW','Retired'];
const INCOME_BRACKETS=['Below ₱20,000','₱20,000 – ₱49,999','₱50,000 – ₱99,999','₱100,000 and above'];
// The bank's assignment of a daily mission to each of the 30 dates — the
// user never picks it, so this only ever holds DAILY_KEYS.
const PATTERN=['qr','learn','bill','qr','learn','qr','bill','learn','qr','bill','learn','qr','bill','qr','learn','bill','qr','learn','qr','bill','learn','qr','bill','qr','learn','bill','qr','learn','bill','qr'];
const BILLERS=[{n:'Meralco',k:'Electricity',a:1850},{n:'Maynilad',k:'Water',a:640},{n:'PLDT Home',k:'Internet',a:1299}];
const TIERS=[{c:100,p:2000},{c:250,p:5000},{c:500,p:10000},{c:1000,p:20000}];   // 100 pts = ₱5
const QUIZ={q:'When is the best time to move money into savings?',opts:['Right after payday','After all bills and spending','Only at year-end'],ok:0};
const PAY_TITLE={qr:'Pay with QR Ph',bill:'Pay a bill'};
const PAY_CTA={qr:a=>`Pay ${peso(a||0)}`,bill:a=>`Pay ${peso(a||0)}`};
const CHECKS=[['salary','Receive your salary through BPI'],['bill','Pay a recurring bill'],['pay','Make an eligible digital payment']];
