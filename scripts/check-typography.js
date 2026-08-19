const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const files=['assets/ja.css','assets/blogfa-responsive.js','blogfa-custom-html-snippet.html','blogfa-final-template.html','blogfa-bootstrap-template.html','assets/blogfa-widget-v3.js','assets/store.css'];
const text=files.map(p=>`\n/* ${p} */\n${read(p)}`).join('');
const ja=read('assets/ja.css');
const responsive=read('assets/blogfa-responsive.js');
const failures=[];
const test=(name,ok)=>{if(!ok)failures.push(name);};
const forbidden=[
  [/fonts\.googleapis\.com/i,'Google Fonts CSS'],
  [/fonts\.gstatic\.com/i,'Google Fonts binary'],
  [/use\.typekit\.net|p\.typekit\.net/i,'Adobe Fonts'],
  [/fonts\.bunny\.net/i,'Bunny Fonts'],
  [/@font-face/i,'custom @font-face'],
  [/\.(?:woff2?|ttf|otf)(?:[?"')]|$)/i,'font binary reference']
];
for(const [re,label] of forbidden)test(`外部/追加フォント禁止: ${label}`,!re.test(text));
test('Arial Narrowを日本語表示変数に使わない',!/--(?:display|rev-font-display)[^;}]*Arial Narrow/i.test(ja+responsive));
test('UIフォント変数',/--rev-font-ui:/.test(ja)&&/--rev-font-ui:/.test(responsive));
test('表示フォント変数',/--rev-font-display:/.test(ja)&&/--rev-font-display:/.test(responsive));
test('丸みUIフォント変数',/--rev-font-soft:/.test(ja)&&/--rev-font-soft:/.test(responsive));
test('等幅フォント変数',/--rev-font-mono:/.test(ja)&&/--rev-font-mono:/.test(responsive));
test('日本語カーニング',/font-kerning:normal/.test(ja)&&/font-feature-settings:[^}]*"palt" 1[^}]*"pkna" 1/.test(ja));
test('合成太字禁止',/font-synthesis:none/.test(ja)&&/font-synthesis:none/.test(responsive));
test('日本語改行規則',/line-break:strict/.test(ja)&&/line-break:strict/.test(responsive));
test('見出しバランス',/text-wrap:balance/.test(ja)&&/text-wrap:balance/.test(responsive));
test('本文pretty wrap',/text-wrap:pretty/.test(ja)&&/text-wrap:pretty/.test(responsive));
test('コード等幅分離',/var\(--rev-font-mono\)/.test(ja)&&/font-variant-ligatures:none/.test(ja));
test('モバイル文字間最適化',/@media\(max-width:760px\)/.test(ja)&&/letter-spacing:-\.028em/.test(ja));
test('ja.css軽量',Buffer.byteLength(ja,'utf8')<=9000);
test('responsive runtime軽量',Buffer.byteLength(responsive,'utf8')<=24000);
test('追加フォント接続なし',!/preconnect[^\n]*(?:font|gstatic|googleapis)/i.test(text));
if(failures.length){console.error(`タイポグラフィ検証に失敗しました: ${failures.length}件`);failures.forEach(x=>console.error(`- ${x}`));process.exit(1);}
console.log(`タイポグラフィOK: ${files.length}ファイル / ${20+forbidden.length}契約を確認しました。`);
