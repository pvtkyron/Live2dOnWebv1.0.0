(()=>{
if(window.__REV_BLOGFA_WIDGET__)return;
window.__REV_BLOGFA_WIDGET__=1;
const OWNER='pvtkyron';
const REPO='Live2dOnWebv1.0.0';
const BLOG=(location.origin+location.pathname).replace(/\/$/,'');
const params=new URLSearchParams(location.search);
const native=params.get('native')==='1';
const nativePath=/^\/(post|archive|posts|category|tag|author)(?:\/|$)/i.test(location.pathname);
if(native||nativePath)return;
let BASE='https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@master/';
const resolveBase=async()=>{
    try
    {
        const r=await fetch('https://api.github.com/repos/'+OWNER+'/'+REPO+'/commits/master',{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});
        if(!r.ok)return;
        const j=await r.json();
        if(j&&j.sha)BASE='https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@'+j.sha+'/';
    }
    catch(e)
    {
    }
};
const clean=s=>{
    try
    {
        return decodeURIComponent(String(s||'').replace(/^\/+|\/+$/g,''));
    }
    catch(e)
    {
        return '';
    }
};
const route=()=>{
    const q=clean(params.get('rev')||'home');
    return/^[a-z0-9/_-]+$/i.test(q)&&!q.includes('..')?q:'404';
};
const file=r=>r==='home'?'index.html':r+'.html';
const routeUrl=r=>BLOG+(r==='home'?'':'?rev='+encodeURIComponent(r));
const get=async p=>{
    const r=await fetch(BASE+p,{cache:'no-store'});
    if(!r.ok)throw Error(p+' HTTP '+r.status);
    return r.text();
};
const rewriteCss=(css,url)=>css.replace(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/g,(m,q,v)=>{
    const raw=String(v||'').trim();
    if(!raw||/^(data:|https?:|#)/i.test(raw))return m;
    try
    {
        return 'url("'+new URL(raw,url).href+'")';
    }
    catch(e)
    {
        return m;
    }
});
const internalRoute=(href,current)=>{
    if(!href||href[0]==='#'||/^(mailto:|tel:|javascript:)/i.test(href))return null;
    if(/^https:\/\/t\.me\//i.test(href))return null;
    try
    {
        let p='';
        if(/^https?:\/\//i.test(href))
        {
            const u=new URL(href);
            if(u.hostname==='pvtkyron.github.io')p=u.pathname.split('/Live2dOnWebv1.0.0/')[1]||'index.html';
            else if(u.hostname==='cdn.jsdelivr.net'&&u.pathname.includes('/Live2dOnWebv1.0.0@'))p=u.pathname.split(/Live2dOnWebv1\.0\.0@[^/]+\//)[1]||'index.html';
            else return null;
        }
        else
        {
            p=new URL(href,BASE+current).pathname.split('/'+REPO+'@')[1];
            if(p)p=p.split('/').slice(1).join('/');
            if(!p)p=new URL(href,'https://rev.local/'+current).pathname.replace(/^\//,'');
        }
        if(p==='sitemap.xml')return'sitemap';
        if(p==='robots.txt')return'about';
        if(!p.endsWith('.html'))return null;
        p=p.replace(/\.html$/,'');
        return p==='index'?'home':p;
    }
    catch(e)
    {
        return null;
    }
};
const rewriteHtml=(doc,current)=>{
    const source=BASE+current;
    doc.querySelectorAll('script,#waifu').forEach(n=>n.remove());
    doc.querySelectorAll('[src]').forEach(n=>{
        const v=n.getAttribute('src');
        if(!v||/^(data:|https?:|\/\/)/i.test(v))return;
        try
        {
            n.setAttribute('src',new URL(v,source).href);
        }
        catch(e)
        {
        }
    });
    doc.querySelectorAll('a[href]').forEach(a=>{
        const h=a.getAttribute('href');
        const r=internalRoute(h,current);
        if(r)a.setAttribute('href',routeUrl(r));
        else if(/^https:\/\/t\.me\//i.test(h||''))
        {
            a.setAttribute('target','_blank');
            a.setAttribute('rel','noopener');
        }
    });
};
const mount=async()=>{
    await resolveBase();
    const r=route();
    const current=file(r);
    const [html,css]=await Promise.all([get(current),get('assets/store.css')]);
    const doc=new DOMParser().parseFromString(html,'text/html');
    rewriteHtml(doc,current);
    const host=document.createElement('div');
    host.id='rev-project-host';
    host.style.cssText='position:fixed;inset:0;z-index:2147483000;background:#070305;overflow:auto;overscroll-behavior:contain;';
    const shadow=host.attachShadow({mode:'open'});
    const style=document.createElement('style');
    style.textContent=':host{all:initial;display:block;color-scheme:dark;--bg:#070305;--bg2:#0d0509;--panel:#13070d;--panel2:#1d0a12;--text:#fff5f8;--muted:#b99da7;--line:rgba(255,82,126,.18);--hot:#ff2f68;--rose:#ff5f8f;--acid:#ff9fba;--scarlet:#d80b42;--blush:#ffd2df;--wine:#4b071f;--max:1280px;--display:Orbitron,Inter,ui-sans-serif,system-ui,sans-serif;font-family:Inter,Poppins,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:var(--text);line-height:1.6}.rev-shadow-body{min-height:100vh;background:radial-gradient(circle at 50% -20%,#2c0717 0,#0d0509 35%,#070305 70%)}*{box-sizing:border-box}'+rewriteCss(css,BASE+'assets/store.css')+'\n#rev-native-exit{position:fixed;left:14px;bottom:14px;z-index:2147483647;padding:9px 12px;border:1px solid rgba(255,95,143,.45);border-radius:999px;background:rgba(7,3,5,.92);color:#ffd5e1;font:700 12px/1.2 Tahoma,Arial,sans-serif;text-decoration:none;box-shadow:0 8px 28px rgba(0,0,0,.35)}';
    const shell=document.createElement('div');
    shell.className='rev-shadow-body';
    shell.innerHTML=doc.body.innerHTML;
    const exit=document.createElement('a');
    exit.id='rev-native-exit';
    exit.href=BLOG+'?native=1';
    exit.textContent='NOVA6 BLOG';
    shadow.append(style,shell,exit);
    document.body.appendChild(host);
    const title=doc.title||'Project Rev Market';
    if(title)document.title=title;
};
mount().catch(e=>console.error('[ProjectRev widget]',e));
})();