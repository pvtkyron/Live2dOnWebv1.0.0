(()=>{
if(window.__REV_BLOGFA_WIDGET_V2__)return;
window.__REV_BLOGFA_WIDGET_V2__=1;
const VERSION='2026.08.11.4';
const OWNER='pvtkyron',REPO='Live2dOnWebv1.0.0';
const BLOG=(location.origin+location.pathname).replace(/\/$/,'');
const params=new URLSearchParams(location.search);
const native=params.get('native')==='1';
const nativePath=/^\/(post|archive|posts|category|tag|author)(?:\/|$)/i.test(location.pathname);
const health=window.__REV_WIDGET_HEALTH__={version:VERSION,status:'booting',route:null,source:null,checks:[],failures:[],attempts:0,recoveries:0,mountedAt:null,lastCheck:null};
window.REV_WIDGET_HEALTH=()=>JSON.parse(JSON.stringify(health));
const mark=(name,ok,detail='')=>health.checks.push({name,ok,detail,at:Date.now()});
const fail=(stage,e)=>health.failures.push({stage,message:String(e&&e.message||e),at:Date.now()});
if(native||nativePath){health.status='native';mark('native-route',true,location.pathname);return;}
const timeout=async(p,ms,label)=>{
    const c=new AbortController();
    const t=setTimeout(()=>c.abort(label||'timeout'),ms);
    try{return await p(c.signal);}finally{clearTimeout(t);}
};
const resolveSha=async()=>{
    try{
        const r=await timeout(signal=>fetch('https://api.github.com/repos/'+OWNER+'/'+REPO+'/commits/master',{cache:'no-store',headers:{Accept:'application/vnd.github+json'},signal}),5000,'sha');
        if(!r.ok)throw Error('sha HTTP '+r.status);
        const j=await r.json();
        if(!j||!/^[a-f0-9]{40}$/i.test(j.sha||''))throw Error('invalid sha');
        mark('resolve-sha',true,j.sha.slice(0,12));
        return j.sha;
    }catch(e){fail('resolve-sha',e);mark('resolve-sha',false);return null;}
};
const apiUrl=p=>'https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/'+p.split('/').map(encodeURIComponent).join('/')+'?ref=master';
const providers=sha=>[
    {name:'jsdelivr-sha',url:p=>'https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@'+sha+'/'+p},
    {name:'jsdelivr-master',url:p=>'https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@master/'+p+'?rev='+Date.now()},
    {name:'github-api',url:apiUrl,headers:{Accept:'application/vnd.github.raw+json'}}
].filter(x=>sha||x.name!=='jsdelivr-sha');
const validText=(p,text)=>{
    if(typeof text!=='string')return false;
    if(p.endsWith('.html'))return text.length>700&&/<(?:html|main|body|section|article)\b/i.test(text)&&/project\s*rev/i.test(text);
    if(p.endsWith('.css'))return text.length>1200&&/[.#][a-z0-9_-]+\s*\{/i.test(text)&&/--(?:hot|rose|bg)/i.test(text);
    return text.length>20;
};
const get=async(p,ps)=>{
    let last;
    for(const src of ps){
        health.attempts++;
        try{
            const r=await timeout(signal=>fetch(src.url(p),{cache:'no-store',headers:src.headers||{},signal}),6500,p);
            if(!r.ok)throw Error(src.name+' HTTP '+r.status);
            const text=await r.text();
            if(!validText(p,text))throw Error(src.name+' invalid '+p+' payload');
            mark('fetch:'+p,true,src.name);
            return{text,source:src.name,base:src.name==='github-api'?'https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@master/':src.url('').replace(/\?rev=.*$/,'')};
        }catch(e){last=e;fail('fetch:'+p+':'+src.name,e);mark('fetch:'+p,false,src.name);}
    }
    throw last||Error('no provider for '+p);
};
const clean=s=>{try{return decodeURIComponent(String(s||'').replace(/^\/+|\/+$/g,''));}catch(e){return'';}};
const route=()=>{const q=clean(params.get('rev')||'home');return/^[a-z0-9/_-]+$/i.test(q)&&!q.includes('..')?q:'404';};
const file=r=>r==='home'?'index.html':r+'.html';
const routeUrl=r=>BLOG+(r==='home'?'':'?rev='+encodeURIComponent(r));
const rewriteCss=(css,base)=>css.replace(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/g,(m,q,v)=>{
    const raw=String(v||'').trim();
    if(!raw||/^(data:|https?:|#)/i.test(raw))return m;
    try{return 'url("'+new URL(raw,base).href+'")';}catch(e){return m;}
});
const internalRoute=(href,current)=>{
    if(!href||href[0]==='#'||/^(mailto:|tel:|javascript:)/i.test(href)||/^https:\/\/t\.me\//i.test(href))return null;
    try{
        let p='';
        if(/^https?:\/\//i.test(href)){
            const u=new URL(href);
            if(u.hostname==='pvtkyron.github.io')p=u.pathname.split('/Live2dOnWebv1.0.0/')[1]||'index.html';
            else if(u.hostname==='cdn.jsdelivr.net'&&u.pathname.includes('/Live2dOnWebv1.0.0@'))p=u.pathname.split(/Live2dOnWebv1\.0\.0@[^/]+\//)[1]||'index.html';
            else return null;
        }else p=new URL(href,'https://rev.local/'+current).pathname.replace(/^\//,'');
        if(p==='sitemap.xml')return'sitemap';
        if(p==='robots.txt')return'about';
        if(!p.endsWith('.html'))return null;
        p=p.replace(/\.html$/,'');
        return p==='index'?'home':p;
    }catch(e){return null;}
};
const rewriteHtml=(doc,current,assetBase)=>{
    const source=assetBase+current;
    doc.querySelectorAll('script,#waifu').forEach(n=>n.remove());
    doc.querySelectorAll('[src]').forEach(n=>{
        const v=n.getAttribute('src');
        if(!v||/^(data:|https?:|\/\/)/i.test(v))return;
        try{n.setAttribute('src',new URL(v,source).href);}catch(e){}
    });
    doc.querySelectorAll('a[href]').forEach(a=>{
        const h=a.getAttribute('href');
        const r=internalRoute(h,current);
        if(r)a.setAttribute('href',routeUrl(r));
        else if(/^https:\/\/t\.me\//i.test(h||'')){a.setAttribute('target','_blank');a.setAttribute('rel','noopener');}
    });
};
const preflight=(doc,css,r)=>{
    const body=doc.body;
    const main=body&&body.querySelector('main');
    const links=body?[...body.querySelectorAll('a[href]')]:[];
    const text=(body&&body.textContent||'').replace(/\s+/g,' ').trim();
    const checks=[
        ['html-body',!!body],
        ['html-main',!!main],
        ['html-text',text.length>180],
        ['html-links',links.length>=2],
        ['css-size',css.length>1200],
        ['css-rules',/[.#][a-z0-9_-]+\s*\{/i.test(css)],
        ['route',r!=='404'||/404|not found/i.test(text)]
    ];
    checks.forEach(x=>mark('preflight:'+x[0],x[1],String(r)));
    const bad=checks.find(x=>!x[1]);
    if(bad)throw Error('preflight failed: '+bad[0]);
};
const wire=(shadow)=>{
    const menu=shadow.querySelector('[data-menu-toggle]');
    const nav=shadow.querySelector('#site-nav')||shadow.querySelector('.topbar nav');
    if(menu&&nav)menu.addEventListener('click',()=>{
        const on=nav.classList.toggle('nav-active');
        menu.setAttribute('aria-expanded',String(on));
        menu.textContent=on?'×':'☰';
    });
    const lang=shadow.querySelector('[data-lang-toggle]');
    if(lang)lang.addEventListener('click',()=>{
        const fa=lang.dataset.revFa!=='1';
        lang.dataset.revFa=fa?'1':'0';
        lang.textContent=fa?'EN / FA':'FA / EN';
        shadow.querySelectorAll('.fa-copy').forEach(n=>n.style.display=fa?'block':'none');
    });
};
const visualCheck=(host,shadow)=>new Promise((ok,bad)=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
    try{
        const shell=shadow.querySelector('.rev-shadow-body');
        const main=shadow.querySelector('main');
        const rect=host.getBoundingClientRect();
        const mrect=main&&main.getBoundingClientRect();
        const style=getComputedStyle(host);
        const checks=[
            ['host-connected',host.isConnected],
            ['host-width',rect.width>240],
            ['host-height',rect.height>240],
            ['main-visible',!!mrect&&mrect.width>120&&mrect.height>80],
            ['shadow-shell',!!shell],
            ['host-display',style.display!=='none']
        ];
        checks.forEach(x=>mark('visual:'+x[0],x[1]));
        const badOne=checks.find(x=>!x[1]);
        if(badOne)bad(Error('visual failed: '+badOne[0]));else ok();
    }catch(e){bad(e);}
})));
let mountedHost=null,previousTitle=document.title,watchdog=null,retrying=false;
const rollback=(reason)=>{
    if(mountedHost&&mountedHost.isConnected)mountedHost.remove();
    mountedHost=null;
    document.title=previousTitle;
    health.status='rolled-back';
    if(reason)fail('rollback',reason);
    mark('rollback',true,String(reason&&reason.message||reason||''));
};
const mount=async(isRecovery=false)=>{
    if(mountedHost&&mountedHost.isConnected)return;
    health.status=isRecovery?'recovering':'loading';
    health.route=route();
    const r=health.route,current=file(r),sha=await resolveSha(),ps=providers(sha);
    const [h,c]=await Promise.all([get(current,ps),get('assets/store.css',ps)]);
    const doc=new DOMParser().parseFromString(h.text,'text/html');
    preflight(doc,c.text,r);
    const assetBase=h.source==='github-api'?(sha?'https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@'+sha+'/':'https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@master/'):h.base;
    rewriteHtml(doc,current,assetBase);
    const host=document.createElement('div');
    host.id='rev-project-host';
    host.style.cssText='position:fixed;inset:0;z-index:2147483000;background:#070305;overflow:auto;overscroll-behavior:contain;visibility:hidden;opacity:0;pointer-events:none;';
    const shadow=host.attachShadow({mode:'open'});
    const style=document.createElement('style');
    style.textContent=':host{all:initial;display:block;color-scheme:dark;--bg:#070305;--bg2:#0d0509;--panel:#13070d;--panel2:#1d0a12;--text:#fff5f8;--muted:#b99da7;--line:rgba(255,82,126,.18);--hot:#ff2f68;--rose:#ff5f8f;--acid:#ff9fba;--scarlet:#d80b42;--blush:#ffd2df;--wine:#4b071f;--max:1280px;--display:Orbitron,Inter,ui-sans-serif,system-ui,sans-serif;font-family:Inter,Poppins,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:var(--text);line-height:1.6}.rev-shadow-body{min-height:100vh;background:radial-gradient(circle at 50% -20%,#2c0717 0,#0d0509 35%,#070305 70%)}*{box-sizing:border-box}'+rewriteCss(c.text,assetBase+'assets/store.css')+'\n#rev-native-exit{position:fixed;left:14px;bottom:14px;z-index:2147483647;padding:9px 12px;border:1px solid rgba(255,95,143,.45);border-radius:999px;background:rgba(7,3,5,.92);color:#ffd5e1;font:700 12px/1.2 Tahoma,Arial,sans-serif;text-decoration:none;box-shadow:0 8px 28px rgba(0,0,0,.35)}';
    const shell=document.createElement('div');
    shell.className='rev-shadow-body';
    shell.innerHTML=doc.body.innerHTML;
    const exit=document.createElement('a');
    exit.id='rev-native-exit';
    exit.href=BLOG+'?native=1';
    exit.textContent='NOVA6 BLOG';
    shadow.append(style,shell,exit);
    wire(shadow);
    mountedHost=host;
    document.body.appendChild(host);
    try{
        await visualCheck(host,shadow);
        host.style.visibility='visible';
        host.style.opacity='1';
        host.style.pointerEvents='auto';
        health.status='healthy';
        health.source=h.source+' / '+c.source;
        health.mountedAt=Date.now();
        health.lastCheck=Date.now();
        document.title=doc.title||'Project Rev Market';
        window.__REV_WIDGET_READY__=VERSION;
        mark('commit',true,health.source);
        startWatchdog();
    }catch(e){rollback(e);throw e;}
};
const watchdogCheck=()=>{
    if(health.status!=='healthy')return;
    health.lastCheck=Date.now();
    try{
        const host=mountedHost;
        const shadow=host&&host.shadowRoot;
        const main=shadow&&shadow.querySelector('main');
        const rect=host&&host.getBoundingClientRect();
        const ok=!!host&&host.isConnected&&!!shadow&&!!main&&rect.width>240&&rect.height>240;
        mark('watchdog',ok);
        if(!ok)throw Error('watchdog detected unhealthy mount');
    }catch(e){
        rollback(e);
        if(!retrying&&health.recoveries<2){
            retrying=true;health.recoveries++;
            setTimeout(()=>mount(true).catch(x=>{fail('recovery',x);}).finally(()=>{retrying=false;}),1200*health.recoveries);
        }
    }
};
const startWatchdog=()=>{
    if(watchdog)clearInterval(watchdog);
    watchdog=setInterval(watchdogCheck,15000);
    setTimeout(watchdogCheck,2500);
};
mount(false).catch(e=>{rollback(e);health.status='failed-safe';console.error('[ProjectRev widget v2]',e);});
})();