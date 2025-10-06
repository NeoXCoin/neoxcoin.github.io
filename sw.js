// sw.js — NeoX Catch v4b
const CACHE = 'neox-cache-v4b'; // ← 改個版本名以強制更新
const ASSETS = [
  './catchgame-v4.html',
  './manifest.webmanifest',
  'https://neoxcoin.github.io/neox-emoji-128.png'
];

// 安裝：預先快取核心資產
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 啟用：清理舊版快取
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => k !== CACHE && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 取用：優先用快取；網絡成功則更新快取；離線退回主頁
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      return r || fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match('./catchgame-v4.html'));
    })
  );
});