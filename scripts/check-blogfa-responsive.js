const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const checks=[];
const test=(name,ok)=>checks.push([name,!!ok]);
const css=read('assets/blogfa-responsive.css');
const js=read('assets/blogfa-responsive.js');
const entry=read('blogfa-custom-html-snippet.html');
const supervisor=read('assets/blogfa-supervisor.js');
const template=read('blogfa-bootstrap-template.html');

for(const bp of ['1180','900','680','460','360'])test(`ブレークポイント ${bp}px`,new RegExp(`max-width:${bp}px`).test(css));
test('安全領域',/safe-area-inset-(top|right|bottom|left)/.test(css));
test('横向き短画面',/max-height:620px[^}]*orientation:landscape/.test(css));
test('タッチ端末',/pointer:coarse/.test(css));
test('低モーション',/prefers-reduced-motion:reduce/.test(css));
test('高コントラスト',/prefers-contrast:more/.test(css));
test('印刷表示',/@media print/.test(css));
test('Live2Dキャンバスだけ縮小',/#waifu canvas/.test(css)&&/width:min\(245px,58vw\)/.test(css)&&!/transform:scale\(/.test(css));
test('Live2D実タッチ領域',/\.waifu-tool>span\{min-width:44px;min-height:44px/.test(css));
test('ネイティブ記事レスポンシブ',/\.native-layout/.test(css)&&/\.native-sidebar/.test(css));
test('埋め込みレスポンシブ',/\.native-body iframe/.test(css)&&/aspect-ratio:16\/9/.test(css));

test('VisualViewport対応',/visualViewport/.test(js));
test('resizeのrAF抑制',/requestAnimationFrame\(sizeNow\)/.test(js));
test('Shadow DOMへCSS注入',/shadowRoot/.test(js)&&/addCss\(root\)/.test(js));
test('追加ノードだけ強化',/MutationObserver/.test(js)&&/enhance\(n\)/.test(js));
test('画像遅延読み込み',/loading='lazy'/.test(js));
test('Live2Dキーボード操作',/tabindex/.test(js)&&/aria-label/.test(js));
test('viewport-fit cover',/viewport-fit=cover/.test(js)&&/interactive-widget=resizes-content/.test(js));

const responsiveBoot=entry.indexOf('await load(RESPONSIVE');
const supervisorBoot=entry.indexOf('await load(SUPERVISOR');
test('入口がレスポンシブを先に起動',responsiveBoot>=0&&supervisorBoot>responsiveBoot&&/viewport-fit=cover/.test(entry));
test('入口キャッシュ移行v3',/rev:ja:20260820:3/.test(entry));
test('supervisor冗長CSS',/blogfa-responsive\.css/.test(supervisor));
test('supervisor冗長runtime',/blogfa-responsive\.js/.test(supervisor));
test('BlogCustomHtmlが全テンプレートに存在',(template.match(/<-BlogCustomHtml->/g)||[]).length>=3);

const failed=checks.filter(([,ok])=>!ok);
if(failed.length){console.error(`Blogfaレスポンシブ検証に失敗しました: ${failed.length}件`);failed.forEach(([n])=>console.error(`- ${n}`));process.exit(1);}
console.log(`BlogfaレスポンシブOK: ${checks.length}項目を確認しました。`);
