const CACHE_NAME = 'homepage-shell-v2';
const SHELL_PATH = '/';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) =>
                cache.add(new Request(SHELL_PATH, { cache: 'reload' }))
            )
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((names) =>
                Promise.all(
                    names
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                )
            )
            .then(() => self.clients.claim())
    );
});

const cacheResponse = async (cache, request, response) => {
    if (response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
    }

    return response;
};

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    if (request.mode === 'navigate' && url.pathname === SHELL_PATH) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cached = await cache.match(SHELL_PATH);
                const fresh = fetch(request)
                    .then((response) =>
                        cacheResponse(cache, SHELL_PATH, response)
                    )
                    .catch(() => cached);

                return cached ?? fresh;
            })
        );
        return;
    }

    if (url.pathname.startsWith('/_next/static/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cached = await cache.match(request);

                return (
                    cached ??
                    fetch(request).then((response) =>
                        cacheResponse(cache, request, response)
                    )
                );
            })
        );
    }
});
