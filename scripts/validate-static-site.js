const fs=require('fs');
const path=require('path');

const root=path.resolve(__dirname,'..');
const skip=new Set(['.git','node_modules']);
const html=[];
const errors=[];

function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(skip.has(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full);
    else if(entry.name.endsWith('.html'))html.push(full);
  }
}

function localTarget(from,value){
  if(!value||/^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(value))return null;
  let clean=value.split('#')[0].split('?')[0];
  if(!clean)return null;
  try{clean=decodeURIComponent(clean);}catch{}
  if(clean.startsWith('/Live2dOnWebv1.0.0/'))clean=clean.slice('/Live2dOnWebv1.0.0/'.length);
  else if(clean.startsWith('/'))return null;
  let target=path.resolve(path.dirname(from),clean);
  if(clean.endsWith('/'))target=path.join(target,'index.html');
  return target;
}

walk(root);
for(const file of html){
  const text=fs.readFileSync(file,'utf8');
  const attr=/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while((m=attr.exec(text))){
    const target=localTarget(file,m[1]);
    if(target&&!fs.existsSync(target))errors.push(`${path.relative(root,file)} -> missing ${m[1]}`);
  }
}

const sitemap=path.join(root,'sitemap.xml');
if(fs.existsSync(sitemap)){
  const xml=fs.readFileSync(sitemap,'utf8');
  const urls=[...xml.matchAll(/<loc>https:\/\/pvtkyron\.github\.io\/Live2dOnWebv1\.0\.0\/(.*?)<\/loc>/g)].map(m=>m[1]);
  for(const route of urls){
    const clean=route.split(/[?#]/)[0];
    const target=path.join(root,clean||'index.html');
    if(!fs.existsSync(target))errors.push(`sitemap.xml -> missing route ${route||'/'}`);
  }
}

if(errors.length){
  console.error(`Static integrity check failed with ${errors.length} problem(s):`);
  for(const error of errors)console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Static integrity OK: checked ${html.length} HTML files and sitemap routes.`);
