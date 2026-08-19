(()=>{
if(window.__REV_LIVE2D_ADDON__)return;
window.__REV_LIVE2D_ADDON__=1;
const VERSION='2026.08.20.1';
const OWNER='pvtkyron',REPO='Live2dOnWebv1.0.0';
const P=new URLSearchParams(location.search);
const native=P.get('native')==='1'||P.get('revsafe')==='1'||/^\/(post|archive|posts|category|tag|author)(?:\/|$)/i.test(location.pathname);
const H=window.__REV_LIVE2D_HEALTH__={version:VERSION,status:native?'bypassed':'waiting',source:null,checks:[],failures:[],model:null,readyAt:null};
window.REV_LIVE2D_HEALTH=()=>JSON.parse(JSON.stringify(H));
const mark=(n,ok,d='')=>H.checks.push({name:n,ok,detail:d,at:Date.now()});
const fail=(s,e)=>H.failures.push({stage:s,message:String(e&&e.message||e),at:Date.now()});
if(native)return;
let BASE='https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@master/';
let root=null;
const timeout=(fn,ms)=>{const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);return fn(c.signal).finally(()=>clearTimeout(t));};
const resolveBase=async()=>{
    try{
        const r=await timeout(signal=>fetch('https://api.github.com/repos/'+OWNER+'/'+REPO+'/commits/master',{cache:'no-store',headers:{Accept:'application/vnd.github+json'},signal}),4500);
        if(!r.ok)throw Error('sha HTTP '+r.status);
        const j=await r.json();
        if(!j||!/^[a-f0-9]{40}$/i.test(j.sha||''))throw Error('SHAが不正です');
        BASE='https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@'+j.sha+'/';
        mark('sha',true,j.sha.slice(0,12));
    }catch(e){fail('sha',e);mark('sha',false,'masterへフォールバック');}
};
const get=async p=>{
    const urls=[
        {name:'jsdelivr',url:BASE+p},
        {name:'github-api',url:'https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/'+p.split('/').map(encodeURIComponent).join('/')+'?ref=master',headers:{Accept:'application/vnd.github.raw+json'}}
    ];
    let last;
    for(const s of urls){
        try{
            const r=await timeout(signal=>fetch(s.url,{cache:'no-store',headers:s.headers||{},signal}),6500);
            if(!r.ok)throw Error(s.name+' HTTP '+r.status);
            const text=await r.text();
            if(text.length<200)throw Error(s.name+' の取得内容が短すぎます');
            mark('fetch:'+p,true,s.name);
            return{text,source:s.name};
        }catch(e){last=e;fail('fetch:'+p+':'+s.name,e);mark('fetch:'+p,false,s.name);}
    }
    throw last||Error('ソースを取得できません: '+p);
};
const loadScript=async src=>new Promise((ok,bad)=>{
    const s=document.createElement('script');
    let done=false;
    const t=setTimeout(()=>{if(done)return;done=true;s.remove();bad(Error('スクリプト読み込みがタイムアウトしました'));},10000);
    s.async=true;s.src=src;
    s.onload=()=>{if(done)return;done=true;clearTimeout(t);ok(s);};
    s.onerror=()=>{if(done)return;done=true;clearTimeout(t);s.remove();bad(Error('スクリプトの読み込みに失敗しました'));};
    document.head.appendChild(s);
});
const cleanup=reason=>{
    try{if(root&&root.isConnected)root.remove();}catch(e){}
    root=null;
    document.querySelectorAll('style[data-rev-live2d-style],script[data-rev-live2d-tips]').forEach(n=>n.remove());
    H.status='failed-safe';
    if(reason)fail('cleanup',reason);
};
const createDom=()=>{
    if(document.getElementById('waifu'))document.getElementById('waifu').remove();
    root=document.createElement('div');
    root.id='waifu';
    root.dataset.revLive2d='1';
    root.style.zIndex='2147483300';
    root.innerHTML='<div id="waifu-message"></div><div class="waifu-tool"><span class="icon-next"></span><span class="icon-home"></span><span class="icon-message"></span><span class="icon-camera"></span><span class="icon-volumeup"></span><span class="icon-volumedown"></span><span class="icon-about"></span><span class="icon-cross"></span></div><canvas id="live2d2"></canvas><canvas id="live2d4"></canvas>';
    document.body.appendChild(root);
    mark('dom',!!document.getElementById('live2d2')&&!!document.getElementById('live2d4'));
};
const patchTips=code=>code
    .replace(/'modelUrl'\s*:\s*'[^']*'/,"'modelUrl': "+JSON.stringify(BASE+'model'))
    .replace(/'tipsMessage'\s*:\s*'[^']*'/,"'tipsMessage': "+JSON.stringify(BASE+'waifu-tips.json'))
    .replace(/'homePageUrl'\s*:\s*'[^']*'/,"'homePageUrl': "+JSON.stringify(location.origin+location.pathname))
    .replace(/'aboutPageUrl'\s*:\s*'[^']*'/,"'aboutPageUrl': "+JSON.stringify((location.origin+location.pathname)+'?rev=about'))
    .replace(/'modelName'\s*:\s*'[^']*'/,"'modelName': 'shizuku'")
    .replace(/'debug'\s*:\s*true/,"'debug': false")
    .replace(/'logMessageToConsole'\s*:\s*true/,"'logMessageToConsole': false")
    .replace(/#0396FF/gi,'#ff5f8f')
    .replace(/#43CBFF/gi,'#ff9fba')
    .replace(/export\s*\{\s*showMessage\s*,\s*initModel\s*\};?/,'');
const waitStore=ms=>new Promise(resolve=>{
    const st=Date.now();
    const tick=()=>{
        const ok=window.__REV_WIDGET_READY__&&window.__REV_WIDGET_HEALTH__&&window.__REV_WIDGET_HEALTH__.status==='healthy';
        if(ok)return resolve(true);
        if(Date.now()-st>=ms)return resolve(false);
        setTimeout(tick,250);
    };
    tick();
});
const visual=()=>new Promise((ok,bad)=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const w=document.getElementById('waifu');
    const c2=document.getElementById('live2d2'),c4=document.getElementById('live2d4');
    const pass=!!w&&w.isConnected&&!!c2&&!!c4;
    mark('visual-root',pass);
    pass?ok():bad(Error('Live2DのDOMが見つかりません'));
})));
const boot=async()=>{
    H.status='waiting-store';
    if(!await waitStore(14000)){H.status='skipped';mark('store-ready',false);return;}
    mark('store-ready',true);
    H.status='loading';
    await resolveBase();
    createDom();
    try{
        await loadScript(BASE+'dist/live2d_bundle.js');
        mark('bundle',true,BASE);
    }catch(e){
        fail('bundle-pinned',e);
        await loadScript('https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@master/dist/live2d_bundle.js?rev='+Date.now());
        mark('bundle',true,'master-fallback');
    }
    const tips=await get('waifu-tips.js');
    H.source=tips.source;
    const code=patchTips(tips.text);
    if(!code.includes('initModel();'))throw Error('tips内にinitModelが見つかりません');
    window.waifuReady=()=>{H.status='healthy';H.readyAt=Date.now();mark('waifuReady',true);};
    const s=document.createElement('script');
    s.dataset.revLive2dTips='1';
    s.text=code+'\n//# sourceURL=rev-waifu-tips.js';
    document.body.appendChild(s);
    await visual();
    setTimeout(()=>{
        const ok=H.status==='healthy'||!!document.querySelector('#waifu canvas[width]');
        mark('post-init',ok);
        if(!ok)cleanup(Error('Live2Dを初期化できませんでした'));
    },6000);
};
window.REV_LIVE2D_RELOAD=()=>{cleanup();delete window.__REV_LIVE2D_ADDON__;const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@master/assets/blogfa-live2d-addon.js?retry='+Date.now();document.head.appendChild(s);};
boot().catch(e=>{console.warn('[ProjectRev Live2D]',e);cleanup(e);});
})();