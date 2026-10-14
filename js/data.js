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
const MISSION={
  qr:{name:'Pay with QR Ph',short:'QR pay',desc:'Pay ₱400 or more at any QR Ph merchant.',min:400,pts:100,stamp:1,cta:'Scan to pay',icon:'qr'},
  bill:{name:'Pay a bill',short:'Pay bill',desc:'Pay any bill of ₱300 or more through BPI.',min:300,pts:100,stamp:1,cta:'Choose a biller',icon:'bill'},
  save:{name:'Save to your goal',short:'Save',desc:'Move ₱500 or more into your savings goal.',min:500,pts:100,stamp:1,cta:'Move money to goal',icon:'coins'},
  learn:{name:'Learn a money tip',short:'Learn',desc:'Read a 1-minute tip and answer one question.',min:0,pts:50,stamp:0,cta:'Start the 1-minute tip',icon:'book'},
  supp:{name:'Add a supplementary card',short:'Supp. card',desc:'Give a supplementary card to a family member and share your credit limit.',min:0,pts:100,stamp:1,cta:'Apply for a supplementary card',icon:'card'},
  apply:{name:'Apply for a credit card',short:'Apply',desc:'See if you’re eligible for a BPI credit card — your path depends on your BPI history.',min:0,pts:100,stamp:1,cta:'Check your application',icon:'card'}
};
const MIN_HOLD=5000;      // Express Start minimum hold amount
const PQ_LIMIT=80000;     // illustrative pre-qualified credit limit
const HOLD_QUICK=[5000,10000,20000];
const PATTERN=['qr','learn','bill','save','qr','learn','qr','learn','bill','save','qr','learn','bill','qr','save','learn','qr','bill','save','learn','qr','learn','bill','qr','save','learn','qr','bill','learn','save'];
const BILLERS=[{n:'Meralco',k:'Electricity',a:1850},{n:'Maynilad',k:'Water',a:640},{n:'PLDT Home',k:'Internet',a:1299}];
const TIERS=[{c:100,p:2000},{c:250,p:5000},{c:500,p:10000},{c:1000,p:20000}];   // 100 pts = ₱5
const QUIZ={q:'When is the best time to move money into savings?',opts:['Right after payday','After all bills and spending','Only at year-end'],ok:0};
const PAY_TITLE={qr:'Pay with QR Ph',bill:'Pay a bill',save:'Save to goal'};
const PAY_CTA={qr:a=>`Pay ${peso(a||0)}`,bill:a=>`Pay ${peso(a||0)}`,save:a=>`Move ${peso(a||0)} to goal`};
const CHECKS=[['salary','Receive your salary through BPI'],['bill','Pay a recurring bill'],['pay','Make an eligible digital payment'],['save','Complete your savings retention goal']];
