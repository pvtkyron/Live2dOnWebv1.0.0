(()=>{
if(window.__REV_EDITORIAL_BLOGFA__)return;window.__REV_EDITORIAL_BLOGFA__=1;
const href='https://cdn.jsdelivr.net/gh/pvtkyron/Live2dOnWebv1.0.0@master/assets/blogfa-editorial.css?rev=20260820.1';
const add=(root,css)=>{if(root.querySelector?.('style[data-rev-editorial]'))return;const s=document.createElement('style');s.dataset.revEditorial='';s.textContent=css;(root.head||root).appendChild(s)};
const scan=(node,css)=>{if(node.nodeType!==1&&node!==document)return;if(node.shadowRoot)add(node.shadowRoot,css);node.querySelectorAll?.('*').forEach(n=>{if(n.shadowRoot)add(n.shadowRoot,css)})};
fetch(href,{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.text()}).then(css=>{add(document,css);scan(document,css);new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>scan(n,css)))).observe(document.documentElement,{subtree:true,childList:true})}).catch(e=>console.warn('[ProjectRev Editorial]',e));
})();
