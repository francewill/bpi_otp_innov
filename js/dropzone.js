'use strict';
/* ---------- shared file-drop widget (used by screen-supp.js, screen-apply.js) ---------- */
const DROP_HINT=`Drop a file here, or <span class="link-inline">browse</span>`;
function dropField(label,idPrefix,aria){
  return `<div class="id-field">
    <label>${label}</label>
    <div class="dropzone" id="${idPrefix}Drop" tabindex="0" role="button" aria-label="${aria}">
      <input type="file" id="${idPrefix}File" accept="image/*,.pdf" hidden>
      <span class="ic">${ic('arrow-up')}</span>
      <span id="${idPrefix}Text">${DROP_HINT}</span>
    </div>
  </div>`;
}
function wireDropzone(idPrefix,onChange){
  const drop=$('#'+idPrefix+'Drop'),file=$('#'+idPrefix+'File'),txt=$('#'+idPrefix+'Text');
  function setFile(f){
    if(f){drop.classList.add('has-file');txt.textContent=`Selected: ${f.name}`;}
    else{drop.classList.remove('has-file');txt.innerHTML=DROP_HINT;}
    if(onChange)onChange(f);
  }
  drop.addEventListener('click',()=>file.click());
  drop.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();file.click();}});
  file.addEventListener('change',()=>setFile(file.files[0]));
  drop.addEventListener('dragover',ev=>{ev.preventDefault();drop.classList.add('drag');});
  drop.addEventListener('dragleave',()=>drop.classList.remove('drag'));
  drop.addEventListener('drop',ev=>{
    ev.preventDefault();drop.classList.remove('drag');
    if(ev.dataTransfer.files[0]){file.files=ev.dataTransfer.files;setFile(ev.dataTransfer.files[0]);}
  });
}
