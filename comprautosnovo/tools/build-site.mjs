import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=async name=>(await fs.readFile(path.join(root,name),'utf8')).replace(/^\uFEFF/,'');
const config=JSON.parse(await read('seo.config.json'));
const inventory=JSON.parse(await read('inventory.json'));
const environment=process.argv.includes('--production')?'production':'preview';
const outIndex=process.argv.indexOf('--out');
const output=outIndex>=0?path.resolve(process.argv[outIndex+1]):root;
if(environment==='production'&&output===root)throw Error('Use --out com uma pasta separada para não indexar ou substituir a prévia.');
await fs.mkdir(output,{recursive:true});
if(environment==='production'){
  if(!config.productionBaseUrl||!/^https:\/\//.test(config.productionBaseUrl))throw Error('Informe productionBaseUrl com o domínio oficial HTTPS confirmado.');
  if(!config.productionContentVerified||inventory.some(item=>item.isDemo!==false))throw Error('Produção bloqueada: substitua os anúncios fictícios e valide o conteúdo real antes de indexar.');
}
await fs.mkdir(output,{recursive:true});
const baseUrl=new URL(environment==='production'?config.productionBaseUrl:config.previewBaseUrl);
if(!baseUrl.pathname.endsWith('/'))baseUrl.pathname+='/';
const basePath=baseUrl.pathname;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=s=>JSON.stringify(s).replace(/</g,'\\u003c');
const pages={
  inicio:{path:'',title:'Comprautos | Compre e venda carros com uma nova experiência',description:'Encontre seu próximo carro, compare opções e converse com vendedores. Conheça a nova experiência de compra e venda de veículos da Comprautos.'},
  comprar:{path:'comprar/',title:'Comprar carros usados e seminovos | Comprautos',description:'Explore carros por marca, modelo, preço e localização. Compare opções, salve seus favoritos e veja os detalhes de cada veículo na Comprautos.'},
  vender:{path:'vender/',title:'Anunciar e vender seu carro | Comprautos',description:'Apresente seu carro com fotos e informações claras. Conheça o caminho para criar um anúncio e conversar com interessados na Comprautos.'},
  lojistas:{path:'lojistas/',title:'Site e vitrine digital para lojas de veículos | Comprautos',description:'Conheça a proposta Comprautos para garagens e revendas: vitrine com a identidade da loja, estoque organizado e contato com compradores.'},
  favoritos:{path:'favoritos/',title:'Meus carros favoritos | Comprautos',description:'Reúna os veículos que mais combinam com você e compare suas opções na Comprautos.',private:true}
};
for(const item of inventory){
  pages['veiculo/'+item.id]={path:'veiculo/'+item.id+'/',title:`${item.brand} ${item.model} ${item.year} | Comprautos`,description:`Veja os detalhes do ${item.brand} ${item.model} ${item.year}: ${item.version}, ${item.fuel.toLowerCase()}, ${item.city}. Conheça o veículo e converse com o anunciante.`,demo:item.isDemo!==false};
}
for(const [key,page] of Object.entries(pages)){
  if(environment==='preview'){
    page.title=key==='inicio'?'Comprautos | Prévia do novo site de veículos':page.title.replace(' | Comprautos',' | Prévia Comprautos');
    page.description='Protótipo demonstrativo do novo Comprautos. '+(key.startsWith('veiculo/')?'Anúncio fictício para apresentação do layout; não é uma oferta real.':page.description);
  }
  const canonical=new URL(page.path,baseUrl).href;
  const website={'@type':'WebSite','@id':baseUrl.href+'#website',url:baseUrl.href,name:environment==='preview'?'Comprautos — prévia do novo site':config.siteName,inLanguage:config.locale};
  const webpage={'@type':key==='comprar'?'CollectionPage':'WebPage','@id':canonical+'#webpage',url:canonical,name:page.title,description:page.description,inLanguage:config.locale,isPartOf:{'@id':website['@id']}};
  const graph=[website,webpage];
  if(key!=='inicio')graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Comprautos',item:baseUrl.href},{'@type':'ListItem',position:2,name:key.startsWith('veiculo/')?(environment==='preview'?'Anúncio demonstrativo':page.title.split('|')[0].trim()):page.title.split('|')[0].trim(),item:canonical}]});
  if(environment==='production'&&key==='inicio')graph.push({'@type':'Organization','@id':baseUrl.href+'#organization',name:config.organization.name,url:baseUrl.href,logo:new URL('assets/logo.svg',baseUrl).href,...(config.organization.legalName?{legalName:config.organization.legalName}:{}),...(config.organization.phone?{telephone:config.organization.phone}:{}),...(config.organization.email?{email:config.organization.email}:{}),...(config.organization.sameAs?.length?{sameAs:config.organization.sameAs}:{})});
  if(environment==='production'&&key.startsWith('veiculo/')&&!page.demo){
    const item=inventory.find(item=>'veiculo/'+item.id===key);
    graph.push({'@type':'Car','@id':canonical+'#vehicle',name:item.brand+' '+item.model+' '+item.year,description:page.description,image:new URL('assets/'+item.image,baseUrl).href,brand:{'@type':'Brand',name:item.brand},model:item.model,vehicleModelDate:String(item.year),fuelType:item.fuel,...(item.transmission?{vehicleTransmission:item.transmission}:{}),mileageFromOdometer:{'@type':'QuantitativeValue',value:item.km,unitCode:'KMT'},offers:{'@type':'Offer',url:canonical,price:String(item.price),priceCurrency:'BRL',...(item.status==='available'?{availability:'https://schema.org/InStock'}:{})}});
  }
  page.schema={'@context':'https://schema.org','@graph':graph};
}
const site={environment,baseUrl:baseUrl.href,basePath,siteName:config.siteName,inventory,pages,measurement:environment==='production'?config.measurement:{ga4Id:null,googleAdsId:null,googleAdsLeadLabel:null}};
const generatedConfig='window.comprautosSite='+json(site)+';\n';
await fs.writeFile(path.join(output,'site-config.js'),generatedConfig);
if(output!==root){
  await fs.cp(path.join(root,'assets'),path.join(output,'assets'),{recursive:true});
  for(const name of ['style.css','seo.js','app.js','motion.js','measurement.js'])await fs.copyFile(path.join(root,name),path.join(output,name));
}
const appSource=await read('app.js');
const template=await read('source/index.template.html');
const assetNames=['style.css','site-config.js','seo.js','app.js','motion.js','measurement.js'];
const versions=Object.fromEntries(await Promise.all(assetNames.map(async name=>[name,createHash('sha256').update(name==='site-config.js'?generatedConfig:await read(name)).digest('hex').slice(0,10)])));
function snapshot(key){
  const elements=new Map();
  const element=()=>({innerHTML:'',textContent:'',hidden:false,open:false,classList:{remove(){},toggle(){},add(){}},addEventListener(){},getAttribute(){return null;},setAttribute(){}});
  elements.set('#app',element());
  elements.set('meta[name="app-base"]',{getAttribute:()=>basePath});
  const document={title:'',querySelector(selector){if(!elements.has(selector))elements.set(selector,element());return elements.get(selector);},querySelectorAll:()=>[],addEventListener(){}};
  const url=new URL(pages[key].path,baseUrl);
  const window={comprautosSite:site,addEventListener(){},scrollTo(){}};
  const context={document,window,location:url,history:{replaceState(){},pushState(){}},localStorage:{getItem:()=>null,setItem(){}},URL,URLSearchParams,Intl,setTimeout:()=>0,clearTimeout(){},console};
  vm.runInNewContext(appSource,context,{timeout:2000});
  return elements.get('#app').innerHTML;
}
const rewriteLinks=html=>html.replace(/href="#(inicio|comprar|favoritos|vender|lojistas|veiculo\/\d+)(\?[^"#]*)?"/g,(_,route,query)=>`href="${basePath+(route==='inicio'?'':route+'/')+(query||'')}"`);
for(const [key,page] of Object.entries(pages)){
  const canonical=new URL(page.path,baseUrl).href;
  const noindex=environment!=='production'||page.private||page.demo;
  const image=new URL('assets/share.jpg',baseUrl).href;
  const head=`<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<base href="${esc(basePath)}"><meta name="app-base" content="${esc(basePath)}">
<title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}">
<meta name="robots" content="${noindex?'noindex, follow':'index, follow, max-image-preview:large'}">
<link rel="canonical" href="${esc(canonical)}"><meta name="theme-color" content="#0e45ab">
<meta property="og:type" content="website"><meta property="og:site_name" content="Comprautos"><meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(image)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="800"><meta property="og:image:alt" content="Nova experiência Comprautos: SUV branco em cenário arquitetônico">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(page.title)}"><meta name="twitter:description" content="${esc(page.description)}"><meta name="twitter:image" content="${esc(image)}"><meta name="twitter:image:alt" content="Novo visual do Comprautos">
${config.verification.googleSearchConsole?`<meta name="google-site-verification" content="${esc(config.verification.googleSearchConsole)}">`:''}
${config.verification.bingWebmasterTools?`<meta name="msvalidate.01" content="${esc(config.verification.bingWebmasterTools)}">`:''}
<link rel="icon" href="assets/logo.svg" type="image/svg+xml">
<link rel="preload" href="assets/manrope-400.ttf" as="font" type="font/ttf" crossorigin><link rel="preload" href="assets/manrope-800.ttf" as="font" type="font/ttf" crossorigin>
${key==='inicio'?'<link rel="preload" href="assets/hero.webp" as="image" fetchpriority="high">':''}
<link rel="stylesheet" href="style.css?v=${versions['style.css']}">
<script type="application/ld+json" id="structured-data">${json(page.schema)}</script>
${['site-config.js','seo.js','app.js','motion.js','measurement.js'].map(name=>`<script defer src="${name}?v=${versions[name]}"></script>`).join('\n')}
</head>`;
  let html=template.replace(/<head>[\s\S]*?<\/head>/,head).replace('<main id="app" tabindex="-1"></main>',`<main id="app" tabindex="-1">${snapshot(key)}</main>`);
  html=html.replace('<body>','<body><a href="#app" class="skip-link">Pular para o conteúdo</a>');
  html=html.replace('</body>','<noscript><p class="noscript-note">O conteúdo está disponível sem JavaScript. Para usar filtros, favoritos e contato demonstrativo, ative o JavaScript.</p></noscript></body>');
  html=rewriteLinks(html);
  const folder=path.join(output,page.path);
  await fs.mkdir(folder,{recursive:true});
  await fs.writeFile(path.join(folder,'index.html'),html);
}
// A production export belongs at the OFFICIAL domain's root. A robots.txt under
// /previas/ is not authoritative for github.io; the preview uses HTML noindex.
const robots=environment==='production'?`User-agent: *\nAllow: /\nDisallow: ${basePath}api/\nDisallow: ${basePath}admin/\nDisallow: ${basePath}auth/\nSitemap: ${new URL('sitemap.xml',baseUrl).href}\n`:'User-agent: *\nAllow: /\n# Preview: every HTML page carries noindex, follow. Do not submit this preview.\n';
await fs.writeFile(path.join(output,'robots.txt'),robots);
if(environment==='production'){
  const urls=Object.values(pages).filter(p=>!p.private&&!p.demo).map(p=>new URL(p.path,baseUrl).href);
  await fs.writeFile(path.join(output,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(url=>`<url><loc>${esc(url)}</loc></url>`).join('\n')+'\n</urlset>\n');
}
console.log(`${Object.keys(pages).length} pages generated; environment=${environment}; preview noindex=${environment==='preview'}`);
