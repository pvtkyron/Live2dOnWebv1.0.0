(()=>{
if(window.__REV_RESPONSIVE_RUNTIME__)return;
window.__REV_RESPONSIVE_RUNTIME__=1;
const OWNER='pvtkyron',REPO='Live2dOnWebv1.0.0',VERSION='2026.08.20.3';
const CSS='https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@master/assets/blogfa-responsive.css?rev='+VERSION;
document.documentElement.lang='ja';
document.documentElement.classList.add('rev-responsive-ready');
const viewport=()=>{
    let m=document.querySelector('meta[name="viewport"]');
    if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m);}
    m.content='width=device-width,initial-scale=1,viewport-fit=cover,interactive-widget=resizes-content';
};
const addCss=(root=document)=>{
    if(root.querySelector?.('link[data-rev-responsive]'))return;
    const l=document.createElement('link');l.rel='stylesheet';l.href=CSS;l.dataset.revResponsive=VERSION;
    (root.head||root).appendChild(l);
};
const size=()=>{
    const v=window.visualViewport,w=v?.width||innerWidth,h=v?.height||innerHeight,r=document.documentElement.style;
    r.setProperty('--rev-vw',(w*.01)+'px');r.setProperty('--rev-vh',(h*.01)+'px');
    r.setProperty('--rev-viewport-width',w+'px');r.setProperty('--rev-viewport-height',h+'px');
    document.documentElement.classList.toggle('rev-touch',matchMedia('(pointer:coarse)').matches);
    document.documentElement.classList.toggle('rev-landscape',w>h);
};
const labels={
    'icon-next':'モデルを切り替える','icon-home':'ホームへ戻る','icon-message':'メッセージを表示する','icon-camera':'スクリーンショットを撮る',
    'icon-volumeup':'音量を上げる','icon-volumedown':'音量を下げる','icon-about':'このサイトについて','icon-cross':'Live2Dを閉じる'
};
const enhance=(root=document)=>{
    root.querySelectorAll?.('img').forEach((n,i)=>{if(!n.loading)n.loading=i<2?'eager':'lazy';if(!n.decoding)n.decoding='async';});
    root.querySelectorAll?.('iframe').forEach(n=>{if(!n.loading)n.loading='lazy';n.setAttribute('title',n.getAttribute('title')||'埋め込みコンテンツ');});
    root.querySelectorAll?.('a[target="_blank"]').forEach(n=>{const rel=new Set((n.rel||'').split(/\s+/).filter(Boolean));rel.add('noopener');rel.add('noreferrer');n.rel=[...rel].join(' ');});
    root.querySelectorAll?.('.waifu-tool>span').forEach(n=>{const key=[...n.classList].find(x=>labels[x]);if(!key)return;n.setAttribute('role','button');n.setAttribute('tabindex','0');n.setAttribute('aria-label',labels[key]);n.setAttribute('title',labels[key]);if(!n.dataset.revKey){n.dataset.revKey='1';n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();n.click();}});}});
    root.querySelectorAll?.('table').forEach(n=>{if(n.parentElement?.classList.contains('rev-table-scroll'))return;const w=document.createElement('div');w.className='rev-table-scroll';w.style.cssText='max-width:100%;overflow:auto;-webkit-overflow-scrolling:touch';n.parentNode.insertBefore(w,n);w.appendChild(n);});
};
const shadow=host=>{
    const root=host?.shadowRoot;if(!root)return;
    addCss(root);enhance(root);
    root.querySelectorAll('.topbar nav a').forEach(a=>a.addEventListener('click',()=>root.querySelector('.topbar nav')?.classList.remove('nav-active')));
};
viewport();addCss();size();
const ready=()=>{enhance();shadow(document.getElementById('rev-project-host'));};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
const mo=new MutationObserver(ms=>{let run=false;for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){run=true;if(n.id==='rev-project-host')shadow(n);}if(run)requestAnimationFrame(()=>enhance());});
mo.observe(document.documentElement,{childList:true,subtree:true});
addEventListener('resize',size,{passive:true});addEventListener('orientationchange',size,{passive:true});
if(window.visualViewport){visualViewport.addEventListener('resize',size,{passive:true});visualViewport.addEventListener('scroll',size,{passive:true});}
window.REV_RESPONSIVE_REFRESH=()=>{viewport();addCss();size();enhance();shadow(document.getElementById('rev-project-host'));return true;};
})();
