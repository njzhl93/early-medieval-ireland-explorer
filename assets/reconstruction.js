// v0.22 bird's-eye lightbox. Presentation-only; phase runtime stays in dublin.js.
const reconstructionDialog=document.getElementById('reconstructionDialog');
const openReconstruction=document.getElementById('openReconstruction');
const closeReconstruction=document.getElementById('closeReconstruction');
if(reconstructionDialog&&openReconstruction&&closeReconstruction){
  openReconstruction.addEventListener('click',()=>{
    if(typeof reconstructionDialog.showModal==='function') reconstructionDialog.showModal();
  });
  closeReconstruction.addEventListener('click',()=>reconstructionDialog.close());
  reconstructionDialog.addEventListener('click',event=>{
    if(event.target===reconstructionDialog) reconstructionDialog.close();
  });
}
