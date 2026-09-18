// Service Worker for Brian 的個人作品集
const CACHE_NAME = 'brian-site-v1';
const urlsToCache = [
  '/',
  '/about/',
  '/css/diaspora.css',
  '/js/diaspora.js',
  '/js/plugin.js',
  '/js/typed.js',
  '/manifest.json'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const toCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, toCache);
          });
          return response;
        });
      })
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});
