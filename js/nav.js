'use strict';
/* ---------- navigation ----------
   RENDER is defined later (main.js), after every render* function exists.
   paint() only reads RENDER when it actually runs (on a click, or the
   bootstrap call at the bottom of main.js) — by then it's populated. */
function go(name,replace){
  if(S.stack[S.stack.length-1]===name&&!replace)return;
  if(replace)S.stack[S.stack.length-1]=name;else S.stack.push(name);
  paint(true);
}
function back(){ if(S.stack.length>1){S.stack.pop();paint(false);} }
function setStack(arr){ S.stack=arr; paint(true); }
function paint(fresh){
  const n=S.stack.length, top=S.stack[n-1];
  $$('.screen').forEach(el=>{
    const name=el.id.slice(2), i=S.stack.lastIndexOf(name);
    el.classList.toggle('on',i===n-1);
    el.classList.toggle('under',i>-1&&i<n-1);
    el.style.zIndex=i+1;
    el.inert=i!==n-1;
  });
  (RENDER[top]||(()=>{}))();
  if(fresh){const sc=$('#s-'+top+' .scroll'); if(sc)sc.scrollTop=0;}
  renderPanel();
}
let toastT;
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2200);}
function openSheet(html){const w=$('#sheet');$('#sheetBody').innerHTML=`<div class="grab"></div>`+html;w.classList.add('open');w.setAttribute('aria-hidden','false');}
function closeSheet(){const w=$('#sheet');w.classList.remove('open');w.setAttribute('aria-hidden','true');}
