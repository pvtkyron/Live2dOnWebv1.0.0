(()=>{
if(window.__REV_WAIFU_ROUTE__)return;
window.__REV_WAIFU_ROUTE__=1;
const root='/Live2dOnWebv1.0.0/';
document.addEventListener('click',e=>{const home=e.target.closest?.('.icon-home'),about=e.target.closest?.('.icon-about');if(home){e.preventDefault();location.href=root;}else if(about){e.preventDefault();location.href=root+'about.html';}},true);
})();
