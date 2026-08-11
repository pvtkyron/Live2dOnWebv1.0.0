(()=>{
if(window.__REV_BOOTSTRAP__)return;
window.__REV_BOOTSTRAP__=1;
window.REV_BOOTSTRAP_VERSION='2026.08.11.1';
const RAW='https://raw.githubusercontent.com/pvtkyron/Live2dOnWebv1.0.0/master/';
const PAGES='https://pvtkyron.github.io/Live2dOnWebv1.0.0/';
const TG='https://t.me/project_rev';
const SCHEMA='https://schema.org';
const ROOT=document.getElementById('rev-root');
const BLOG=(window.REV_BLOG_URL||location.origin+location.pathname).replace(/\/$/,'');
if(!ROOT)return;
const get=async p=>{
    const r=await fetch(RAW+p,{cache:'no-cache'});
    if(!r.ok)throw Error(p+' HTTP '+r.status);
    return r.text();
};
const classic=async p=>{
    const s=document.createElement('script');
    s.text=await get(p);
    s.dataset.revSource=p;
    document.body.appendChild(s);
};
const clean=s=>{
    try{return decodeURIComponent(String(s||'').replace(/^\/+|\/+$/g,''));}
    catch(e){return'';}
};
const route=()=>{
    const q=clean(new URLSearchParams(location.search).get('rev')||'home');
    return/^[a-z0-9/_-]+$/i.test(q)&&!q.includes('..')?q:'404';
};
const file=r=>r==='home'?'index.html':r+'.html';
const routeUrl=r=>BLOG+(r==='home'?'':'?rev='+encodeURIComponent(r));
const routeFrom=(href,current)=>{
    try{
        if(!href||href[0]==='#'||/^(mailto:|tel:|javascript:)/i.test(href)||/^https:\/\/t\.me\//i.test(href))return null;
        let f='';
        if(href.startsWith(PAGES))f=href.slice(PAGES.length)||'index.html';
        else{
            const u=new URL(href,RAW+current),base=new URL(RAW);
            if(u.origin!==base.origin||!u.pathname.includes('/pvtkyron/Live2dOnWebv1.0.0/master/'))return null;
            f=u.pathname.split('/pvtkyron/Live2dOnWebv1.0.0/master/')[1]||'index.html';
        }
        if(f==='sitemap.xml')return'sitemap';
        if(f==='robots.txt')return'about';
        if(!f.endsWith('.html'))return null;
        f=f.replace(/\.html$/,'');
        return f==='index'?'home':f;
    }catch(e){return null;}
};
const meta=(name,value,prop=false)=>{
    let n=document.head.querySelector(`meta[${prop?'property':'name'}="${name}"]`);
    if(!n){
        n=document.createElement('meta');
        n.setAttribute(prop?'property':'name',name);
        document.head.appendChild(n);
    }
    n.content=value;
};
const canonical=r=>{
    let c=document.head.querySelector('link[rel="canonical"]');
    if(!c){
        c=document.createElement('link');
        c.rel='canonical';
        document.head.appendChild(c);
    }
    c.href=routeUrl(r);
};
const schema=(r,title,desc)=>{
    document.head.querySelectorAll('script[data-rev-schema]').forEach(n=>n.remove());
    const add=o=>{
        const s=document.createElement('script');
        s.type='application/ld+json';
        s.dataset.revSchema='1';
        s.textContent=JSON.stringify(o);
        document.head.appendChild(s);
    };
    if(r==='home')add({'@context':SCHEMA,'@type':'WebSite',name:'Project Rev Market',url:BLOG,sameAs:[TG]});
    else add({'@context':SCHEMA,'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Project Rev Market',item:BLOG},{'@type':'ListItem',position:2,name:title,item:routeUrl(r)}]});
    if(r.startsWith('posts/'))add({'@context':SCHEMA,'@type':'Article',headline:title,description:desc,url:routeUrl(r),dateModified:'2026-08-11',author:{'@type':'Organization',name:'Project Rev'},publisher:{'@type':'Organization',name:'Project Rev'}});
};
const head=(doc,r)=>{
    const title=doc.title||'Project Rev Market';
    const desc=doc.querySelector('meta[name="description"]')?.content||'Project Rev Market — digital tools, buyer guides, utilities and updates.';
    document.title=title;
    meta('description',desc);
    meta('robots','index,follow,max-image-preview:large,max-snippet:-1');
    meta('og:title',title,true);
    meta('og:description',desc,true);
    meta('og:url',routeUrl(r),true);
    meta('twitter:card','summary_large_image');
    canonical(r);
    schema(r,title,desc);
};
const wire=current=>{
    ROOT.querySelectorAll('a[href]').forEach(a=>{
        const href=a.getAttribute('href');
        if(/^https:\/\/t\.me\//i.test(href||'')){
            a.target=a.target||'_blank';
            a.rel='noopener';
            return;
        }
        const r=routeFrom(href,current);
        if(!r)return;
        a.href=routeUrl(r);
        a.dataset.revRoute=r;
        a.addEventListener('click',e=>{
            if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
            e.preventDefault();
            history.pushState({rev:r},'',routeUrl(r));
            render();
        });
    });
    ROOT.querySelectorAll('[data-rev-url="tg"]').forEach(a=>{
        a.href=TG;
        a.target='_blank';
        a.rel='noopener';
    });
    const top=ROOT.querySelector('.topbar'),nav=ROOT.querySelector('#site-nav')||top?.querySelector('nav');
    let menu=ROOT.querySelector('[data-menu-toggle]');
    if(nav&&!nav.id)nav.id='site-nav';
    if(top&&nav&&!menu){
        menu=document.createElement('button');
        menu.className='menu-toggle';
        menu.dataset.menuToggle='';
        menu.setAttribute('aria-label','Toggle menu');
        menu.setAttribute('aria-expanded','false');
        menu.textContent='☰';
        top.appendChild(menu);
    }
    if(menu&&nav)menu.addEventListener('click',()=>{
        const on=nav.classList.toggle('nav-active');
        menu.setAttribute('aria-expanded',String(on));
        menu.textContent=on?'×':'☰';
    });
    const b=ROOT.querySelector('[data-lang-toggle]'),k='revLang';
    if(b){
        const apply=v=>{
            document.documentElement.dataset.uiLang=v;
            b.textContent=v==='fa'?'EN / FA':'FA / EN';
            ROOT.querySelectorAll('.fa-copy').forEach(x=>x.style.display=v==='fa'?'block':'');
        };
        b.addEventListener('click',()=>{
            const v=localStorage.getItem(k)==='fa'?'en':'fa';
            localStorage.setItem(k,v);
            apply(v);
        });
        apply(localStorage.getItem(k)||'en');
    }
    const stats=[...ROOT.querySelectorAll('[data-count]')];
    if(stats.length&&'IntersectionObserver'in window){
        const io=new IntersectionObserver(es=>es.forEach(e=>{
            if(!e.isIntersecting)return;
            const n=e.target,t=Number(n.dataset.count||0),s=n.dataset.suffix||'',d=700,start=performance.now();
            const tick=now=>{
                const p=Math.min((now-start)/d,1),v=Math.round(t*(1-Math.pow(1-p,3)));
                n.textContent=v.toLocaleString()+s;
                if(p<1)requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.unobserve(n);
        }),{threshold:.45});
        stats.forEach(n=>io.observe(n));
    }
};
const render=async()=>{
    const r=route(),f=file(r);
    ROOT.setAttribute('aria-busy','true');
    try{
        const doc=new DOMParser().parseFromString(await get(f),'text/html');
        doc.querySelectorAll('script,#waifu').forEach(n=>n.remove());
        ROOT.innerHTML=doc.body.innerHTML;
        head(doc,r);
        wire(f);
        ROOT.removeAttribute('aria-busy');
        scrollTo(0,0);
    }catch(e){
        console.error('[ProjectRev route]',e);
        ROOT.removeAttribute('aria-busy');
        ROOT.innerHTML='<main class="page-hero"><div class="eyebrow">PROJECT REV / SOURCE LOAD ERROR</div><h1>The market aisle did not arrive.</h1><p>The Blogfa shell is alive, but GitHub did not return this page.</p><div class="hero-actions"><a class="cta hot" href="'+BLOG+'">HOME</a><a class="cta" href="'+TG+'" target="_blank" rel="noopener">TELEGRAM ↗</a></div></main>';
    }
};
const style=async()=>{
    const [css,svg]=await Promise.all([get('assets/store.css'),get('assets/hero-grid.svg')]);
    const hero='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
    const s=document.createElement('style');
    s.dataset.revStyle='1';
    s.textContent=css+'\n.hero-stage{background-image:url('+JSON.stringify(hero)+')!important}';
    document.head.appendChild(s);
};
const live2d=async()=>{
    try{
        await classic('dist/live2d_bundle.js');
        let code=await get('waifu-tips.js');
        code=code.replace(/'modelUrl'\s*:\s*'[^']*'/,"'modelUrl': "+JSON.stringify(RAW+'model'))
            .replace(/'tipsMessage'\s*:\s*'[^']*'/,"'tipsMessage': "+JSON.stringify(RAW+'waifu-tips.json'))
            .replace(/'homePageUrl'\s*:\s*'[^']*'/,"'homePageUrl': "+JSON.stringify(BLOG))
            .replace(/'aboutPageUrl'\s*:\s*'[^']*'/,"'aboutPageUrl': "+JSON.stringify(routeUrl('about')))
            .replace(/export\s*\{\s*showMessage\s*,\s*initModel\s*\};?/,'');
        const s=document.createElement('script');
        s.text=code;
        s.dataset.revSource='waifu-tips.js';
        document.body.appendChild(s);
    }catch(e){
        console.warn('[ProjectRev Live2D]',e);
        const w=document.getElementById('waifu');
        if(w)w.style.display='none';
    }
};
document.addEventListener('click',e=>{
    const h=e.target.closest&&e.target.closest('.icon-home');
    if(!h)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    history.pushState({rev:'home'},'',BLOG);
    render();
},true);
addEventListener('popstate',render);
(async()=>{
    await Promise.all([style(),render()]);
    live2d();
})().catch(e=>console.error('[ProjectRev bootstrap]',e));
})();