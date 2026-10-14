'use strict';
/* ---------- learn ---------- */
function renderLearn(){
  const L=S.learn;if(!L)return;
  const dots=`<div class="steps-dots"><i class="on"></i><i class="${L.step?'on':''}"></i></div>`;
  if(L.step===0){
    $('#learnBody').innerHTML=`${dots}<div class="card tip"><span class="big-ic">${ic('bulb')}</span><h3>Pay yourself first</h3><p>Move money into savings on payday, before you start spending. Even ₱500 each payday builds an emergency fund steadily, and you never have to rely on what is left at month-end.</p></div>`;
    $('#learnFoot').innerHTML=`<button class="btn btn-red btn-block" data-act="learnNext">Next: one quick question</button>`;
  }else{
    const ok=L.sel===QUIZ.ok;
    $('#learnBody').innerHTML=`${dots}<h3 class="q-title">${QUIZ.q}</h3><div class="radios" role="radiogroup">${QUIZ.opts.map((o,i)=>`<button class="radio ${L.sel===i?(i===QUIZ.ok?'good':'bad'):''}" role="radio" aria-checked="${L.sel===i}" data-act="quiz" data-i="${i}"><span style="flex:1"><b>${o}</b></span><span class="rd"></span></button>`).join('')}</div>
      ${L.sel===null?'':ok?`<div class="note ok">${ic('check','md')}<span>Correct. Saving first keeps the goal safe from everyday spending.</span></div>`:`<div class="note warn">${ic('info','md')}<span>Not quite. Try another answer.</span></div>`}`;
    $('#learnFoot').innerHTML=`<button class="btn btn-red btn-block" data-act="learnDone" ${ok?'':'disabled'}>Claim +${MISSION.learn.pts} pts</button>`;
  }
}
function learnDone(){
  S.result={type:'learn',counts:true,entry:null};earn('learn');go('success',true);
}
