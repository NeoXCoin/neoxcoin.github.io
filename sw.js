// sw.js — NeoX Catch v4c
const CACHE = 'neox-cache-v4c'; // ← 新版名，確保強制刷新
const ASSETS = [
  './catchgame-v4c.html',
  './manifest.webmanifest',
  'https://neoxcoin.github.io/neox-emoji-128.png'
];

// 安裝：預先快取主要資產
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 啟用：刪除舊版快取
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => k !== CACHE && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 取用：離線優先，有網絡則更新
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      return r || fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match('./catchgame-v4c.html'));
    })
  );
});