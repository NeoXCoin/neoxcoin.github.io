// sw.js — NeoX Catch v4d
const CACHE = 'neox-cache-v4d';
const ASSETS = [
  './catchgame-v4.html',
  './manifest.webmanifest',
  'https://neoxcoin.github.io/neox-emoji-128.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE&&caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  // dev 需要可用 ?nocache 直連跳過 SW
  if (new URL(e.request.url).searchParams.has('nocache')) { e.respondWith(fetch(e.request)); return; }
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request).then(res=>{
      caches.open(CACHE).then(c=>c.put(e.request, res.clone()));
      return res;
    }).catch(()=>caches.match('./catchgame-v4.html')))
  );
});