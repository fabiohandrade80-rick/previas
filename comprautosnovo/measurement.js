/* No third-party requests until explicit consent AND real production IDs exist. */
(() => {
  'use strict';
  const site=window.comprautosSite;
  if(!site)return;
  const ids=site.measurement||{};
  const state={analytics:false,ads:false};
  const configured=site.environment==='production';
  let loaded=false;
  window.dataLayer=window.dataLayer||[];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  function load(){
    const id=state.analytics&&ids.ga4Id?ids.ga4Id:state.ads&&ids.googleAdsId?ids.googleAdsId:null;
    if(!configured||!id)return;
    if(!loaded){const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);document.head.append(script);gtag('js',new Date());loaded=true;}
    if(state.analytics&&ids.ga4Id)gtag('config',ids.ga4Id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});
    if(state.ads&&ids.googleAdsId)gtag('config',ids.googleAdsId,{allow_ad_personalization_signals:false});
  }
  function emit(name,detail={}){
    // A deliberately small, non-PII allowlist. No form contents or search text.
    const allowed={};
    for(const key of ['route','item_id','filter_count'])if(detail[key]!==undefined)allowed[key]=detail[key];
    if(!configured){window.dataLayer.push({event:'demo_'+name,is_demo:true,...allowed});return;}
    if(state.analytics&&ids.ga4Id)gtag('event',name,{...allowed,page_location:location.origin+location.pathname,page_title:document.title,send_to:ids.ga4Id});
  }
  function pageView(){
    const route=location.pathname.slice(site.basePath.length).replace(/\/$/,'')||'inicio';
    emit('page_view',{route});
  }
  window.comprautosConsent={
    update(value){
      state.analytics=value?.analytics===true;state.ads=value?.ads===true;
      gtag('consent','update',{analytics_storage:state.analytics?'granted':'denied',ad_storage:state.ads?'granted':'denied',ad_user_data:state.ads?'granted':'denied',ad_personalization:'denied'});
      load();pageView();
    },
    status:()=>({...state})
  };
  // Only a confirmed production backend success may call leadConfirmed().
  // The prototype never calls this method and never reports real conversions.
  window.comprautosMeasurement={
    leadConfirmed(){
      if(!configured)return;
      emit('generate_lead');
      if(state.ads&&ids.googleAdsId&&ids.googleAdsLeadLabel)gtag('event','conversion',{send_to:ids.googleAdsId+'/'+ids.googleAdsLeadLabel});
    }
  };
  document.addEventListener('comprautos:page-view',pageView);
  document.addEventListener('click',event=>{
    const target=event.target.closest('[data-contact],[data-fav]');
    if(target)emit(target.hasAttribute('data-contact')?'contact_open':'favorite_toggle',{item_id:String(target.dataset.contact||target.dataset.fav)});
  });
  document.addEventListener('submit',event=>{
    if(event.target.id==='home-search'||event.target.id==='filter-form')emit('search',{filter_count:[...new FormData(event.target).values()].filter(Boolean).length});
    if(event.target.id==='contact-form'&&!configured)emit('contact_submit');
  });
  pageView();
})();
