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
     each can be earned once per 6-month cycle (MAJOR_CYCLE).
   kind:'season' — the month's campaign, one per calendar month. Reached
     only from the seasonal banner; see SEASON below for its presentation. */
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
  alfm:{kind:'major',name:'Apply for an ALFM fund',short:'ALFM',desc:'Start investing in an ALFM Mutual Fund — no forms, just a few questions.',min:0,pts:100,stamp:1,cta:'Apply now',icon:'chart'},
  jump:{kind:'season',name:'Jumpstart a child’s savings',short:'Jumpstart',desc:'Open a Jumpstart Savings account for a child aged 7 to 17.',min:0,pts:200,stamp:1,cta:'Join Jumpstart',icon:'coins'},
  annual:{kind:'season',name:'Free annual fee for life',short:'Annual fee',desc:'Apply for a BPI credit card with the annual fee waived for life.',min:0,pts:200,stamp:1,cta:'Apply for the card',icon:'card'},
  insure:{kind:'season',name:'Get covered for 2027',short:'Insurance',desc:'Start a life or non-life plan, or open a Pamana Savings account.',min:0,pts:200,stamp:1,cta:'Apply now',icon:'shield'}
};
const DAILY_KEYS=Object.keys(MISSION).filter(k=>MISSION[k].kind==='daily');
const MAJOR_KEYS=Object.keys(MISSION).filter(k=>MISSION[k].kind==='major');
// Major missions refresh every 6 months. This prototype sits inside the
// Jul–Dec 2026 window, so the whole major list unlocks again on Jan 1, 2027.
const MAJOR_CYCLE={label:'Jul – Dec 2026',ends:'Dec 31, 2026',next:'Jan 1, 2027'};

/* ---------- seasonal campaigns ----------
   One per calendar month, surfaced as a banner above the date strip on the
   hub's Daily and Month tabs. Each entry carries its presentation (picture,
   title, tagline, the plain-language definition shown after you tap it) and
   points at the MISSION key that holds its reward. `form` picks which
   mechanic the screen renders: 'photo' (upload + referral), 'referral'
   (referral only) or 'plans' (pick one of PLANS).
   `img` is the picture dropped into img/, named after the SEASON key; see
   img/README.md for the fallback chain when it isn't there yet. */
const SEASON_IMG_DEFAULT='img/default.svg';
const SEASON={
  nov:{
    month:'November',title:'Jumpstart',tagline:'A savings account built for kids 7 to 17',
    mission:'jump',form:'photo',img:'img/nov.jpg',
    lede:'BPI Jumpstart Savings is a savings account designed for children aged 7 to 17, helping them develop smart saving habits and financial responsibility at an early age. With an initial deposit of just ₱100, kids can begin their savings journey while enjoying convenient banking features and financial education tools.',
    bullets:['Opens with an initial deposit of just ₱100','Younger than 7? It can still be opened with ABD approval','Opened by you, owned by them'],
    how:'Send one photo of your child in their favourite Disney costume. That is the whole mechanic — no forms to fill in.',
    done:['Your child is in!','We’ll set up the Jumpstart Savings account and message you once it’s ready.']
  },
  dec:{
    month:'December',title:'Free annual fee for life',tagline:'Apply for a BPI credit card this December',
    mission:'annual',form:'referral',img:'img/dec.jpg',
    lede:'Apply for a basic BPI credit card this December and the annual fee is waived for as long as you keep the card — no renewal fee, ever.',
    bullets:['Annual fee waived for life, not just the first year','Applies to the basic BPI credit card','Subject to the usual credit evaluation and approval'],
    how:'Nothing to upload. Tap apply, and add a referral code if a friend sent you one.',
    done:['Application submitted!','We’ll review it and come back to you. Your annual fee is already waived for life.']
  },
  jan:{
    month:'January',title:'2027: Ready, Set, Secure',tagline:'Bancassurance month with AIA and BPI MS',
    mission:'insure',form:'plans',img:'img/jan.jpg',
    lede:'January is bancassurance month. Start the year protected — life cover with BPI AIA, non-life cover with BPI MS, or a Pamana Savings account that insures you just for keeping a balance.',
    bullets:['Life insurance with our partner AIA','Non-life insurance with our partner BPI MS','Pamana Savings: ₱25,000 maintaining balance, life cover worth 3× your average daily balance'],
    how:'Pick the plan you want to start with. A BPI adviser takes it from there.',
    done:['You’re on your way!','An adviser will call you to finish the plan and confirm your coverage.']
  }
};
const SEASON_KEYS=Object.keys(SEASON);
// January's three choices. Pamana sits beside the two insurers because it is
// sold the same way this month — a savings account that carries life cover.
const PLANS=[
  {n:'AIA — Life insurance',d:'Protection and savings plans from our partner BPI AIA'},
  {n:'BPI MS — Non-life insurance',d:'Home, motor and travel coverage from BPI MS'},
  {n:'Pamana Savings',d:'₱25,000 maintaining balance · life cover worth 3× your average daily balance'}
];
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
