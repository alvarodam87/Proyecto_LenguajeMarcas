const CACHE_NAME = 'frikistore-v2.1.2';
const urlsToCache = [
  'index.html',
  'pages/catalogo.html',
  'pages/ropa.html',
  'pages/preventas.html',
  'pages/contacto.html',
  'css/style.css',
  'img/mario.jpg',
  'img/figuraluffy.jpg'
];

self.addEventListener('install', event => {
  console.log('SW: installing and caching', urlsToCache);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).then(fetchResp => {
          // Clone and store in cache
          return caches.open(CACHE_NAME).then(cache => {
            try {
              cache.put(event.request, fetchResp.clone());
            } catch (err) {
              // ignore opaque responses or other caching errors
            }
            return fetchResp;
          });
        });
      }).catch(() => {
        // Fallback to index for navigations
        return caches.match('/index.html');
      })
  );
});
