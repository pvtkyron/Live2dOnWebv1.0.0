const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),fail=[];
const html=[];for(const d of ['.','posts','products'])for(const f of fs.readdirSync(path.join(root,d)).filter(x=>x.endsWith('.html')))html.push(path.join(d,f).replace(/^\.\//,''));
for(const f of html){const s=read(f);if(/<script[^>]+dist\/live2d_bundle\.js/i.test(s))fail.push(`${f}: Live2D bundle is eager`)}
const store=read('assets/store.js'),disc=read('assets/rev-discovery.js'),css=read('assets/rev-discovery.css'),loader=read('assets/live2d-loader.js'),entry=read('blogfa-custom-html-snippet.html'),pkg=JSON.parse(read('package.json'));
if(!loader.includes("'preLoadMotion': false")||!loader.includes("'showHitokoto': false"))fail.push('live2d-loader.js: lightweight runtime policy missing');
if(!loader.includes('pvtkyron/Live2dOnWebv1.0.0'))fail.push('live2d-loader.js: repository URL patch missing');
if(!store.includes('rev-discovery.js'))fail.push('store.js: legacy discovery bootstrap missing');
if(!entry.includes('blogfa-editorial.js')&&!entry.includes('rev-discovery.js'))fail.push('Blogfa entry: discovery/theme bootstrap missing');
if(/https?:\/\/(fonts\.|fonts\.googleapis|use\.typekit)/i.test(disc+css))fail.push('discovery: external font request detected');
if(/@font-face/i.test(css))fail.push('discovery: @font-face not allowed');
if(Buffer.byteLength(disc)>36000)fail.push('rev-discovery.js exceeds 36KB');
if(Buffer.byteLength(css)>24000)fail.push('rev-discovery.css exceeds 24KB');
if(Buffer.byteLength(loader)>7000)fail.push('live2d-loader.js exceeds 7KB');
if(!pkg.scripts||pkg.scripts['check:vnext']!=='node scripts/check-rev-vnext.js')fail.push('package.json: check:vnext missing');
if(fail.length){console.error('REV vNext check failed:\n- '+fail.join('\n- '));process.exit(1)}console.log(`REV vNext compatibility OK: ${html.length} HTML / legacy discovery ${Buffer.byteLength(disc)}B / loader ${Buffer.byteLength(loader)}B`);
