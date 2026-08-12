(()=>{
if(window.__REV_STORE_UI__)return;
window.__REV_STORE_UI__=1;
document.documentElement.classList.add('js-enhanced');
const $=(q,r=document)=>r.querySelector(q),$$=(q,r=document)=>[...r.querySelectorAll(q)];
const top=$('.topbar'),nav=top&&$('nav',top);
let menu=top&&$('[data-menu-toggle]',top);
if(top&&nav&&!menu){menu=document.createElement('button');menu.className='menu-toggle';menu.dataset.menuToggle='';menu.setAttribute('aria-label','Toggle menu');menu.setAttribute('aria-expanded','false');menu.textContent='☰';top.appendChild(menu);}
const closeMenu=()=>{if(!menu||!nav)return;nav.classList.remove('nav-active');menu.setAttribute('aria-expanded','false');menu.textContent='☰';};
if(menu&&nav)menu.addEventListener('click',()=>{const on=nav.classList.toggle('nav-active');menu.setAttribute('aria-expanded',String(on));menu.textContent=on?'×':'☰';});
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
addEventListener('resize',()=>{if(innerWidth>760)closeMenu();},{passive:true});
if(top)addEventListener('scroll',()=>top.classList.toggle('scrolled',scrollY>18),{passive:true});
if(nav){const page=location.pathname.split('/').pop()||'index.html';$$('a[href]',nav).forEach(a=>{try{const f=new URL(a.href,location.href).pathname.split('/').pop()||'index.html';if(f===page)a.classList.add('active');}catch(e){}});}
const lang=$('[data-lang-toggle]'),langKey='revLang';
if(lang){const apply=v=>{document.documentElement.dataset.uiLang=v;lang.textContent=v==='fa'?'EN / FA':'FA / EN';$$('.fa-copy').forEach(n=>n.style.display=v==='fa'?'block':'');};lang.addEventListener('click',()=>{const v=localStorage.getItem(langKey)==='fa'?'en':'fa';localStorage.setItem(langKey,v);apply(v);});apply(localStorage.getItem(langKey)||'en');}
const filter=$('.filterbar'),cards=$$('.product-card');
if(filter&&cards.length){$$('button',filter).forEach(btn=>btn.addEventListener('click',()=>{const key=btn.textContent.trim().toLowerCase();$$('button',filter).forEach(b=>b.classList.toggle('active',b===btn));cards.forEach(card=>{const type=($('.eyebrow',card)?.textContent||'').trim().toLowerCase();card.classList.toggle('is-hidden',key!=='all'&&!type.includes(key));});}));}
const reveal=$$('.reveal,.section,.story-grid>a,.reason,.seo-market>div,.gaming-corner').filter((n,i,a)=>a.indexOf(n)===i);
if('IntersectionObserver'in window){reveal.forEach(n=>{if(!n.classList.contains('reveal'))n.classList.add('section-reveal');});const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('is-visible');io.unobserve(e.target);}),{threshold:.08,rootMargin:'0px 0px -28px'});reveal.forEach(n=>io.observe(n));}else reveal.forEach(n=>n.classList.add('is-visible'));
$$('.product-card,.story-grid>a,.reason,.seo-market>div,.gaming-corner').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',`${e.clientX-r.left}px`);el.style.setProperty('--my',`${e.clientY-r.top}px`);},{passive:true}));
const article=$('.article');
if(article){const bar=document.createElement('div');bar.className='reading-progress';document.body.appendChild(bar);const progress=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=`${max>0?Math.min(100,scrollY/max*100):0}%`;};addEventListener('scroll',progress,{passive:true});progress();}
$$('[data-count]').forEach(n=>{const target=Number(n.dataset.count||0),suffix=n.dataset.suffix||'';if(!target)return;let ran=false;const run=()=>{if(ran)return;ran=true;const start=performance.now();const tick=now=>{const p=Math.min((now-start)/700,1),v=Math.round(target*(1-Math.pow(1-p,3)));n.textContent=v.toLocaleString()+suffix;if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);};if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){run();io.disconnect();}}),{threshold:.4});io.observe(n);}else run();});
})();
