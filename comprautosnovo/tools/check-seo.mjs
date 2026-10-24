import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse((await fs.readFile(path.join(root,'seo.config.json'),'utf8')).replace(/^\uFEFF/,''));
const inventory=JSON.parse(await fs.readFile(path.join(root,'inventory.json'),'utf8'));
const routes=['','comprar/','vender/','lojistas/','favoritos/',...inventory.map(c=>'veiculo/'+c.id+'/')];
const titles=new Set();
for(const route of routes){
  const html=await fs.readFile(path.join(root,route,'index.html'),'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,'One h1: '+route);
  assert.match(html,/<meta name="robots" content="noindex, follow">/,'Preview not indexable: '+route);
  assert.match(html,/<main id="app"[^>]*>[\s\S]+<\/main>/,'Rendered HTML: '+route);
  const title=html.match(/<title>(.*?)<\/title>/)[1];assert(!titles.has(title),'Unique title: '+route);titles.add(title);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
  assert(html.includes('href="'+new URL(route,config.previewBaseUrl).href+'"'),'Canonical '+route);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json" id="structured-data">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema['@context'],'https://schema.org');
  assert(!schema['@graph'].some(x=>['Offer','Product','Car','AutoDealer'].includes(x['@type'])),'No fictitious offer markup');
  assert(!/href="#(?:comprar|vender|lojistas|veiculo\/)/.test(html),'No fragment routing');
}
for(const filename of ['app.js','seo.js','motion.js','measurement.js','site-config.js']){
  const check=spawnSync(process.execPath,['--check',path.join(root,filename)],{encoding:'utf8'});
  assert.equal(check.status,0,check.stderr);
}
const prod=spawnSync(process.execPath,[path.join(root,'tools/build-site.mjs'),'--production','--out',path.join(root,'test-production-must-fail')],{encoding:'utf8'});
assert.notEqual(prod.status,0,'Production must reject demo inventory');
assert.match(prod.stderr,/anúncios fictícios/);
console.log('PASS: '+routes.length+' pre-rendered pages, unique SEO tags, noindex, canonical, schema, real links, JS and demo-production gate.');
