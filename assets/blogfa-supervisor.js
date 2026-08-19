(()=>{
if(window.__REV_STABLE_SUPERVISOR__)return;
window.__REV_STABLE_SUPERVISOR__=1;
const VERSION='2026.08.20.3';
const OWNER='pvtkyron',REPO='Live2dOnWebv1.0.0';
const WIDGET='assets/blogfa-widget-v3.js',LIVE2D='assets/blogfa-live2d-addon.js',RESPONSIVE='assets/blogfa-responsive.js';
const cdn=p=>'https://cdn.jsdelivr.net/gh/'+OWNER+'/'+REPO+'@master/'+p;
if(!document.querySelector('link[data-rev-responsive]')){const l=document.createElement('link');l.rel='stylesheet';l.href=cdn('assets/blogfa-responsive.css')+'?rev='+VERSION;l.dataset.revResponsive=VERSION;document.head.appendChild(l);}
if(!window.__REV_RESPONSIVE_RUNTIME__&&!document.querySelector('script[data-rev-responsive-runtime]')){const s=document.createElement('script');s.src=cdn(RESPONSIVE)+'?rev='+VERSION;s.async=true;s.dataset.revResponsiveRuntime=VERSION;document.head.appendChild(s);}
const P=new URLSearchParams(location.search);
const native=P.get('native')==='1'||/^\/(post|archive|posts|category|tag|author)(?:\/|$)/i.test(location.pathname);
const safe=P.get('revsafe')==='1';
const debug=P.get('revdebug')==='1';
const H=window.__REV_SYSTEM_HEALTH__={version:VERSION,status:native?'native':safe?'safe-mode':'booting',widget:null,live2d:null,responsive:true,attempts:[],failures:[],readyAt:null};
window.REV_SYSTEM_HEALTH=()=>JSON.parse(JSON.stringify(H));
if(native||safe)return;
const LS='rev:supervisor:';
const lsGet=k=>{try{return localStorage.getItem(LS+k);}catch(e){return null;}};
const lsSet=(k,v)=>{try{localStorage.setItem(LS+k,v);return true;}catch(e){return false;}};
const labels={'STORE-BOOT':'ストア起動','STORE-OK':'ストア正常','DOLL-BOOT':'Live2D起動','HEALTHY':'正常','DEGRADED':'一部機能停止','FAILSAFE':'安全モード'};
let badge=null;
const paint=(s,d='')=>{H.status=s;if(!debug)return;if(!badge){badge=document.createElement('div');badge.style.cssText='position:fixed;right:10px;bottom:10px;z-index:2147483647;padding:8px 10px;border:1px solid #ff5f8f;border-radius:999px;background:#090407ee;color:#ffd2df;font:700 11px/1.2 "Noto Sans JP",sans-serif;box-shadow:0 8px 30px #0008';document.body.appendChild(badge);}badge.textContent='REV '+(labels[s]||s)+(d?' • '+d:'');};
const fail=(stage,e)=>{H.failures.push({stage,message:String(e&&e.message||e),at:Date.now()});if(H.failures.length>40)H.failures.shift();};
const timeout=(fn,ms)=>{const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);return fn(c.signal).finally(()=>clearTimeout(t));};
const api=p=>'https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/'+p.split('/').map(encodeURIComponent).join('/')+'?ref=master';
const valid=(path,code)=>typeof code==='string'&&code.length>1000&&(path===WIDGET?code.includes('__REV_BLOGFA_WIDGET_V3__'):code.includes('__REV_LIVE2D_ADDON__'));
const fetchCode=async path=>{const tries=[{name:'jsdelivr',url:cdn(path)+'?rev='+Date.now()},{name:'github-api',url:api(path),headers:{Accept:'application/vnd.github.raw+json'}}];let last;for(const x of tries){try{const r=await timeout(signal=>fetch(x.url,{cache:'no-store',headers:x.headers||{},signal}),7000);if(!r.ok)throw Error(x.name+' HTTP '+r.status);const code=await r.text();if(!valid(path,code))throw Error(x.name+' の内容が不正です');lsSet('code:'+path,code);H.attempts.push({path,source:x.name,ok:true,at:Date.now()});return{code,source:x.name};}catch(e){last=e;fail(path+':'+x.name,e);H.attempts.push({path,source:x.name,ok:false,at:Date.now()});}}const cached=lsGet('code:'+path);if(valid(path,cached)){H.attempts.push({path,source:'lkg-cache',ok:true,at:Date.now()});return{code:cached,source:'lkg-cache'};}throw last||Error('ソースを取得できません: '+path);};
const exec=(code,label)=>{const s=document.createElement('script');s.text=code+'\n//# sourceURL='+label;document.head.appendChild(s);return s;};
const wait=async(fn,ms)=>new Promise(resolve=>{const st=Date.now();const tick=()=>{if(fn())return resolve(true);if(Date.now()-st>=ms)return resolve(false);setTimeout(tick,250);};tick();});
const bootWidget=async()=>{paint('STORE-BOOT');const x=await fetchCode(WIDGET);exec(x.code,'rev-blogfa-widget-v3.js');const ok=await wait(()=>window.__REV_WIDGET_READY__&&window.__REV_WIDGET_HEALTH__&&window.__REV_WIDGET_HEALTH__.status==='healthy',15000);if(!ok)throw Error('ストアのヘルスチェックがタイムアウトしました');H.widget={status:'healthy',source:x.source,health:window.REV_WIDGET_HEALTH?window.REV_WIDGET_HEALTH():null};paint('STORE-OK','取得元: '+x.source);};
const bootLive2d=async()=>{paint('DOLL-BOOT');try{const x=await fetchCode(LIVE2D);exec(x.code,'rev-blogfa-live2d-addon.js');const ok=await wait(()=>window.__REV_LIVE2D_HEALTH__&&['healthy','failed-safe','skipped'].includes(window.__REV_LIVE2D_HEALTH__.status),16000);const h=window.REV_LIVE2D_HEALTH?window.REV_LIVE2D_HEALTH():window.__REV_LIVE2D_HEALTH__;H.live2d=h||{status:ok?'unknown':'timeout'};if(h&&h.status==='healthy'){paint('HEALTHY','ストア + Live2D');return true;}paint('DEGRADED','ストア正常 / Live2D停止');return false;}catch(e){fail('live2d',e);H.live2d={status:'failed',message:String(e&&e.message||e)};paint('DEGRADED','ストア正常 / Live2D失敗');return false;}};
const boot=async()=>{try{await bootWidget();await bootLive2d();H.readyAt=Date.now();if(H.status!=='DEGRADED')paint('HEALTHY','全システム正常');}catch(e){fail('store',e);H.widget={status:'failed',message:String(e&&e.message||e)};paint('FAILSAFE','Blogfa本体はそのまま');}};
window.REV_SYSTEM_RETRY_DOLL=async()=>{try{delete window.__REV_LIVE2D_ADDON__;}catch(e){window.__REV_LIVE2D_ADDON__=0;}document.getElementById('waifu')?.remove();return bootLive2d();};
window.REV_SYSTEM_CLEAR_CACHE=()=>{try{Object.keys(localStorage).filter(k=>k.startsWith(LS)).forEach(k=>localStorage.removeItem(k));return true;}catch(e){return false;}};
const domReady=()=>document.body?Promise.resolve():new Promise(r=>document.addEventListener('DOMContentLoaded',r,{once:true}));
domReady().then(boot).catch(e=>{fail('boot',e);paint('FAILSAFE','Blogfa本体はそのまま');});
})();