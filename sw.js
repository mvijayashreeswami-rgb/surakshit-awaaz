const CACHE_NAME = 'surakshit-awaaz-v1';
const ASSETS = [
  '/surakshit-awaaz/',
  '/surakshit-awaaz/index.html',
  'https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Noto+Sans+Devanagari:wght@300;400;500;600;700;900&family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:wght@400;700&display=swap'
];

// Install — cache assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        return response;
      }).catch(() => cached);
    })
  );
});
