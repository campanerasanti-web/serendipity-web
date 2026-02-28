self.addEventListener('push', function (event) {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icon.svg',
        badge: '/icon.svg'
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('fetch', function (event) {
    // Solo interceptar si es necesario, por ahora dejamos pasar para no romper el dev mode
});
