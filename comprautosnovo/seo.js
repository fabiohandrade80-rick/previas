/* Metadata mirrors the pre-rendered document after client-side navigation. */
(() => {
  'use strict';
  function update() {
    const site=window.comprautosSite;
    if(!site)return;
    const path=decodeURIComponent(location.pathname.slice(site.basePath.length)).replace(/\/$/,'')||'inicio';
    const page=site.pages[path];
    if(!page)return;
    const canonical=new URL(page.path,site.baseUrl).href;
    const query=new URLSearchParams(location.search);
    const isFiltered=[...query.keys()].some(key=>!key.startsWith('utm_')&&!['gclid','gbraid','wbraid'].includes(key));
    const noindex=site.environment!=='production'||page.private||page.demo||isFiltered;
    const meta=(key,value,property=false)=>{
      const attr=property?'property':'name';
      let el=document.head.querySelector(`meta[${attr}="${key}"]`);
      if(!el){el=document.createElement('meta');el.setAttribute(attr,key);document.head.append(el)}
      el.setAttribute('content',value);
    };
    document.title=page.title;
    meta('description',page.description);
    meta('robots',noindex?'noindex, follow':'index, follow, max-image-preview:large');
    let link=document.head.querySelector('link[rel="canonical"]');
    if(!link){link=document.createElement('link');link.rel='canonical';document.head.append(link)}
    link.href=canonical;
    meta('og:title',page.title,true);meta('og:description',page.description,true);meta('og:url',canonical,true);
    meta('twitter:title',page.title);meta('twitter:description',page.description);
    const schema=document.querySelector('#structured-data');
    if(schema)schema.textContent=JSON.stringify(page.schema);
    document.dispatchEvent(new CustomEvent('comprautos:page-view',{detail:{route:path,isDemo:site.environment!=='production'}}));
  }
  window.comprautosSEO={update};
})();
