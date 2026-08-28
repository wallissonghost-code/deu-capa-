const CACHE='deucapa-v4';
const SHELL=['./','./index.html','./edicoes.html','./inscricao.html','./anuncie.html','./privacidade.html','./termos.html','./revista3d-real.html','./manifest.webmanifest','./icon.svg','./styles.css','./recruitment.css','./participant-search.css','./edicoes.css','./inscricao.css','./anuncie.css','./legal.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin||u.pathname.includes('/admin.html'))return;
  const isLiveAsset=/\.(?:js|css)$/i.test(u.pathname);
  if(r.mode==='navigate'||isLiveAsset){e.respondWith(fetch(r,{cache:'no-store'}).then(x=>{if(x.ok){const c=x.clone();caches.open(CACHE).then(k=>k.put(r,c))}return x}).catch(()=>caches.match(r).then(x=>x||(r.mode==='navigate'?caches.match('./index.html'):Promise.reject()))));return}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(CACHE).then(k=>k.put(r,c))}return x})))
});