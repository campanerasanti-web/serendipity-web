const CACHE_NAME = 'serendipity-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/icon.svg',
    'https://www.transparenttextures.com/patterns/carbon-fibre.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('push', function (event) {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icon.svg',
        badge: '/icon.svg'
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('fetch', (event) => {
    // Solo interceptamos GET para cachear recursos
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Si la red funciona, actualizamos el cache si es un recurso estático o la shell
                if (response.status === 200 && (event.request.url.includes('/_next/static') || STATIC_ASSETS.includes(new URL(event.request.url).pathname))) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Si la red falla, intentamos servir desde el cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    
                    // Si no hay cache y es una navegación, podríamos servir una página offline genérica
                    // return caches.match('/offline');
                });
            })
    );
});
