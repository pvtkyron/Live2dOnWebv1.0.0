(()=>{
if(window.__REV_BLOGFA_WIDGET_V3__)return;
window.__REV_BLOGFA_WIDGET_V3__=1;
const VERSION='2026.08.11.5';
const OWNER='pvtkyron',REPO='Live2dOnWebv1.0.0';
const BLOG=(location.origin+location.pathname).replace(/\/$/,'');
const params=new URLSearchParams(location.search);
const safe=params.get('revsafe')==='1'||sessionStorage.getItem('rev:disable')==='1';
const native=params.get('native')==='1'||/^\/(post|archive|posts|category|tag|author)(?:\/|$)/i.test(location.pathname);
const health=window.__REV_WIDGET_HEALTH__={version:VERSION,status:'booting',route:null,source:null,manifest:null,checks:[],failures:[],attempts:0,recoveries:0,cacheHits:0,mountedAt:null,lastCheck:null};
window.REV_WIDGET_HEALTH=()=>JSON.parse(JSON.stringify(health));
const mark=(name,ok,detail='')=>{health.checks.push({name,ok,detail,at:Date.now()});if(health.checks.length>120)health.checks.splice(0,health.checks.length-120);};
const fail=(stage,e)=>{health.failures.push({stage,message:String(e&&e.message||e),at:Date.now()});if(health.failures.length>60)health.failures.splice(0,health.failures.length-60);};
const terminal=s=>['native','disabled','safe-mode'].includes(s);
if(safe){health.status='safe-mode';mark('safe-mode',true);return;}
if(native){health.status='native';mark('native-route',true,location.pathname);return;}
const LS='rev:v3:';
const DEFAULTS={version:VERSION,enabled:true,widget:'assets/blogfa-widget-v3.js',minHtmlBytes:700,minCssBytes:1200,watchdogMs:12000,maxRecoveries:3,cacheTtlMs:604800000,staleCacheTtlMs:2592000000,healthGraceMs:11000,release:'stable'};
const storageGet=k=>{try{return localStorage.getItem(LS+k);}catch(e){return null;}};
const storageSet=(k,v)=>{try{localStorage.setItem(LS+k,v);return true;}catch(e){return false;}};
const readJson=k=>{try{const x=storageGet(k);return x?JSON.parse(x):null;}catch(e){return null;}};
const writeJson=(k,v)=>storageSet(k,JSON.stringify(v));
const timeout=async(fn,ms,label)=>{const c=new AbortController();const t=setTimeout(()=>c.abort(label||'timeout'),ms);try{return await fn(c.signal);}finally{clearTimeout(t);}};
const api=p=>'https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/'+p.split('/').map(encodeURIComponent).join('/')+'?ref=master';
const jd=ref=>p=>'https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@'+ref+'/'+p;
const validManifest=m=>m&&typeof m==='object'&&typeof m.version==='string'&&typeof m.enabled==='boolean'&&typeof m.widget==='string';
const loadManifest=async()=>{
    const cached=readJson('manifest');
    const urls=[
        {name:'jsdelivr-master',url:jd('master')('assets/blogfa-runtime-manifest.json')+'?v='+Date.now()},
        {name:'github-api',url:api('assets/blogfa-runtime-manifest.json'),headers:{Accept:'application/vnd.github.raw+json'}}
    ];
    for(const src of urls){
        try{
            const r=await timeout(signal=>fetch(src.url,{cache:'no-store',headers:src.headers||{},signal}),4500,'manifest');
            if(!r.ok)throw Error(src.name+' HTTP '+r.status);
            const m=JSON.parse(await r.text());
            if(!validManifest(m))throw Error('invalid manifest');
            writeJson('manifest',{at:Date.now(),value:m});
            mark('manifest',true,src.name);
            return{...DEFAULTS,...m};
        }catch(e){fail('manifest:'+src.name,e);mark('manifest',false,src.name);}
    }
    if(cached&&validManifest(cached.value)){
        health.cacheHits++;
        mark('manifest-cache',true);
        return{...DEFAULTS,...cached.value};
    }
    mark('manifest-default',true);
    return{...DEFAULTS};
};
const resolveSha=async()=>{
    try{
        const r=await timeout(signal=>fetch('https://api.github.com/repos/'+OWNER+'/'+REPO+'/commits/master',{cache:'no-store',headers:{Accept:'application/vnd.github+json'},signal}),4500,'sha');
        if(!r.ok)throw Error('sha HTTP '+r.status);
        const j=await r.json();
        if(!j||!/^[a-f0-9]{40}$/i.test(j.sha||''))throw Error('invalid sha');
        writeJson('sha',{at:Date.now(),value:j.sha});
        mark('resolve-sha',true,j.sha.slice(0,12));
        return j.sha;
    }catch(e){
        fail('resolve-sha',e);mark('resolve-sha',false);
        const c=readJson('sha');
        if(c&&/^[a-f0-9]{40}$/i.test(c.value||'')){health.cacheHits++;mark('sha-cache',true,c.value.slice(0,12));return c.value;}
        return null;
    }
};
const clean=s=>{try{return decodeURIComponent(String(s||'').replace(/^\/+|\/+$/g,''));}catch(e){return'';}};
const route=()=>{const q=clean(params.get('rev')||'home');return/^[a-z0-9/_-]+$/i.test(q)&&!q.includes('..')?q:'404';};
const file=r=>r==='home'?'index.html':r+'.html';
const routeUrl=r=>BLOG+(r==='home'?'':'?rev='+encodeURIComponent(r));
const validators=(cfg)=>({
    html:(p,t)=>typeof t==='string'&&t.length>=cfg.minHtmlBytes&&/<(?:html|main|body|section|article)\b/i.test(t)&&/project\s*rev/i.test(t),
    css:(p,t)=>typeof t==='string'&&t.length>=cfg.minCssBytes&&/[.#][a-z0-9_-]+\s*\{/i.test(t)&&/--(?:hot|rose|bg)/i.test(t),
    any:(p,t)=>typeof t==='string'&&t.length>20
});
const cacheKey=p=>'asset:'+btoa(unescape(encodeURIComponent(p))).replace(/=+$/,'');
const cacheRead=(p,cfg,allowStale=true)=>{
    const x=readJson(cacheKey(p));
    if(!x||typeof x.text!=='string'||!x.at)return null;
    const age=Date.now()-x.at;
    const limit=allowStale?cfg.staleCacheTtlMs:cfg.cacheTtlMs;
    if(age>limit)return null;
    return x;
};
const cacheWrite=(p,payload)=>writeJson(cacheKey(p),{...payload,at:Date.now()});
const providers=sha=>[
    ...(sha?[{name:'jsdelivr-sha',url:jd(sha)}]:[]),
    {name:'jsdelivr-master',url:p=>jd('master')(p)+'?rev='+Date.now()},
    {name:'github-api',url:api,headers:{Accept:'application/vnd.github.raw+json'}}
];
const getAsset=async(p,ps,cfg,kind)=>{
    const check=validators(cfg)[kind]||validators(cfg).any;
    const cached=cacheRead(p,cfg,true);
    if(navigator.onLine===false&&cached&&check(p,cached.text)){
        health.cacheHits++;mark('fetch:'+p,true,'lkg-offline');return{...cached,source:'lkg-offline'};
    }
    let last;
    for(const src of ps){
        health.attempts++;
        try{
            const r=await timeout(signal=>fetch(src.url(p),{cache:'no-store',headers:src.headers||{},signal}),6000,p);
            if(!r.ok)throw Error(src.name+' HTTP '+r.status);
            const text=await r.text();
            if(!check(p,text))throw Error(src.name+' invalid '+p);
            const base=src.name==='github-api'?(cached&&cached.base)||jd('master')(''):src.url('').replace(/\?rev=.*$/,'');
            const out={text,base,source:src.name};
            cacheWrite(p,out);
            mark('fetch:'+p,true,src.name);
            return out;
        }catch(e){last=e;fail('fetch:'+p+':'+src.name,e);mark('fetch:'+p,false,src.name);}
    }
    if(cached&&check(p,cached.text)){
        health.cacheHits++;mark('fetch:'+p,true,'lkg-cache');return{...cached,source:'lkg-cache'};
    }
    throw last||Error('no provider for '+p);
};
const rewriteCss=(css,base)=>css.replace(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/g,(m,q,v)=>{const raw=String(v||'').trim();if(!raw||/^(data:|https?:|#)/i.test(raw))return m;try{return 'url("'+new URL(raw,base).href+'")';}catch(e){return m;}});
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
    doc.querySelectorAll('[src]').forEach(n=>{const v=n.getAttribute('src');if(!v||/^(data:|https?:|\/\/)/i.test(v))return;try{n.setAttribute('src',new URL(v,source).href);}catch(e){}});
    doc.querySelectorAll('a[href]').forEach(a=>{const h=a.getAttribute('href');const r=internalRoute(h,current);if(r)a.setAttribute('href',routeUrl(r));else if(/^https:\/\/t\.me\//i.test(h||'')){a.setAttribute('target','_blank');a.setAttribute('rel','noopener');}});
};
const preflight=(doc,css,r,cfg)=>{
    const body=doc.body,main=body&&body.querySelector('main'),links=body?[...body.querySelectorAll('a[href]')]:[],text=(body&&body.textContent||'').replace(/\s+/g,' ').trim();
    const checks=[
        ['body',!!body],['main',!!main],['text',text.length>180],['links',links.length>=2],['css-size',css.length>=cfg.minCssBytes],['css-rules',/[.#][a-z0-9_-]+\s*\{/i.test(css)],['route',r!=='404'||/404|not found/i.test(text)],['no-iframe-root',!(body&&body.firstElementChild&&body.firstElementChild.tagName==='IFRAME')]
    ];
    checks.forEach(x=>mark('preflight:'+x[0],x[1],String(r)));
    const bad=checks.find(x=>!x[1]);
    if(bad)throw Error('preflight failed: '+bad[0]);
};
const wire=shadow=>{
    const menu=shadow.querySelector('[data-menu-toggle]'),nav=shadow.querySelector('#site-nav')||shadow.querySelector('.topbar nav');
    if(menu&&nav)menu.addEventListener('click',()=>{const on=nav.classList.toggle('nav-active');menu.setAttribute('aria-expanded',String(on));menu.textContent=on?'×':'☰';});
    const lang=shadow.querySelector('[data-lang-toggle]');
    if(lang)lang.addEventListener('click',()=>{const fa=lang.dataset.revFa!=='1';lang.dataset.revFa=fa?'1':'0';lang.textContent=fa?'EN / FA':'FA / EN';shadow.querySelectorAll('.fa-copy').forEach(n=>n.style.display=fa?'block':'none');});
};
const visualCheck=(host,shadow)=>new Promise((ok,bad)=>requestAnimationFrame(()=>requestAnimationFrame(()=>{try{
    const shell=shadow.querySelector('.rev-shadow-body'),main=shadow.querySelector('main'),rect=host.getBoundingClientRect(),mrect=main&&main.getBoundingClientRect(),style=getComputedStyle(host);
    const checks=[['connected',host.isConnected],['width',rect.width>240],['height',rect.height>240],['main-visible',!!mrect&&mrect.width>120&&mrect.height>80],['shell',!!shell],['display',style.display!=='none'],['shadow-style',shadow.querySelectorAll('style').length>0]];
    checks.forEach(x=>mark('visual:'+x[0],x[1]));const b=checks.find(x=>!x[1]);b?bad(Error('visual failed: '+b[0])):ok();
}catch(e){bad(e);}})));
let mountedHost=null,previousTitle=document.title,watchdog=null,observer=null,retrying=false,cfg={...DEFAULTS};
const rollback=reason=>{
    if(mountedHost&&mountedHost.isConnected)mountedHost.remove();
    mountedHost=null;document.title=previousTitle;health.status='rolled-back';
    if(reason)fail('rollback',reason);mark('rollback',true,String(reason&&reason.message||reason||''));
};
const stopWatchers=()=>{if(watchdog){clearInterval(watchdog);watchdog=null;}if(observer){observer.disconnect();observer=null;}};
const scheduleRecovery=reason=>{
    if(terminal(health.status)||retrying||health.recoveries>=cfg.maxRecoveries)return;
    retrying=true;health.recoveries++;fail('recovery-trigger',reason||'unknown');
    rollback(reason instanceof Error?reason:Error(String(reason||'recovery')));
    setTimeout(()=>mount(true).catch(e=>fail('recovery',e)).finally(()=>{retrying=false;}),Math.min(5000,900*health.recoveries));
};
const watchdogCheck=()=>{
    if(health.status!=='healthy')return;
    health.lastCheck=Date.now();
    try{
        const host=mountedHost,shadow=host&&host.shadowRoot,main=shadow&&shadow.querySelector('main'),rect=host&&host.getBoundingClientRect();
        const ok=!!host&&host.isConnected&&!!shadow&&!!main&&rect.width>240&&rect.height>240;
        mark('watchdog',ok);
        if(!ok)throw Error('watchdog unhealthy mount');
    }catch(e){scheduleRecovery(e);}
};
const startWatchers=()=>{
    stopWatchers();
    watchdog=setInterval(watchdogCheck,cfg.watchdogMs);
    setTimeout(watchdogCheck,2200);
    observer=new MutationObserver(()=>{if(health.status==='healthy'&&(!mountedHost||!mountedHost.isConnected))scheduleRecovery('host removed');});
    observer.observe(document.documentElement,{childList:true,subtree:true});
};
const mount=async(isRecovery=false)=>{
    if(mountedHost&&mountedHost.isConnected)return;
    health.status=isRecovery?'recovering':'loading';
    cfg=await loadManifest();health.manifest={version:cfg.version,release:cfg.release,enabled:cfg.enabled};
    if(cfg.enabled===false){health.status='disabled';mark('manifest-enabled',false);return;}
    mark('manifest-enabled',true);
    health.route=route();
    const r=health.route,current=file(r),sha=await resolveSha(),ps=providers(sha);
    const [h,c]=await Promise.all([getAsset(current,ps,cfg,'html'),getAsset('assets/store.css',ps,cfg,'css')]);
    const doc=new DOMParser().parseFromString(h.text,'text/html');
    preflight(doc,c.text,r,cfg);
    const assetBase=h.base||(sha?jd(sha)(''):jd('master')(''));
    rewriteHtml(doc,current,assetBase);
    const host=document.createElement('div');host.id='rev-project-host';host.dataset.revVersion=VERSION;host.style.cssText='position:fixed;inset:0;z-index:2147483000;background:#070305;overflow:auto;overscroll-behavior:contain;visibility:hidden;opacity:0;pointer-events:none;contain:layout paint style;';
    const shadow=host.attachShadow({mode:'open'}),style=document.createElement('style');
    style.textContent=':host{all:initial;display:block;color-scheme:dark;--bg:#070305;--bg2:#0d0509;--panel:#13070d;--panel2:#1d0a12;--text:#fff5f8;--muted:#b99da7;--line:rgba(255,82,126,.18);--hot:#ff2f68;--rose:#ff5f8f;--acid:#ff9fba;--scarlet:#d80b42;--blush:#ffd2df;--wine:#4b071f;--max:1280px;--display:Orbitron,Inter,ui-sans-serif,system-ui,sans-serif;font-family:Inter,Poppins,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:var(--text);line-height:1.6}.rev-shadow-body{min-height:100vh;background:radial-gradient(circle at 50% -20%,#2c0717 0,#0d0509 35%,#070305 70%)}*{box-sizing:border-box}'+rewriteCss(c.text,assetBase+'assets/store.css')+'\n#rev-native-exit{position:fixed;left:14px;bottom:14px;z-index:2147483647;padding:9px 12px;border:1px solid rgba(255,95,143,.45);border-radius:999px;background:rgba(7,3,5,.92);color:#ffd5e1;font:700 12px/1.2 Tahoma,Arial,sans-serif;text-decoration:none;box-shadow:0 8px 28px rgba(0,0,0,.35)}';
    const shell=document.createElement('div');shell.className='rev-shadow-body';shell.innerHTML=doc.body.innerHTML;
    const exit=document.createElement('a');exit.id='rev-native-exit';exit.href=BLOG+'?native=1';exit.textContent='NOVA6 BLOG';
    shadow.append(style,shell,exit);wire(shadow);mountedHost=host;document.body.appendChild(host);
    try{
        await visualCheck(host,shadow);
        host.style.visibility='visible';host.style.opacity='1';host.style.pointerEvents='auto';
        health.status='healthy';health.source=h.source+' / '+c.source;health.mountedAt=Date.now();health.lastCheck=Date.now();document.title=doc.title||'Project Rev Market';window.__REV_WIDGET_READY__=VERSION;mark('commit',true,health.source);startWatchers();
    }catch(e){rollback(e);throw e;}
};
window.REV_WIDGET_RECOVER=()=>{if(terminal(health.status))return false;scheduleRecovery('manual');return true;};
window.REV_WIDGET_DISABLE_SESSION=()=>{sessionStorage.setItem('rev:disable','1');rollback('session disabled');health.status='safe-mode';stopWatchers();return true;};
window.REV_WIDGET_CLEAR_CACHE=()=>{try{Object.keys(localStorage).filter(k=>k.startsWith(LS)).forEach(k=>localStorage.removeItem(k));return true;}catch(e){return false;}};
addEventListener('online',()=>{if(health.status!=='healthy'&&!terminal(health.status))scheduleRecovery('online');});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')watchdogCheck();});
mount(false).catch(e=>{rollback(e);health.status='failed-safe';console.error('[ProjectRev widget v3]',e);});
})();
