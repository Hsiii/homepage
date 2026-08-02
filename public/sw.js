const CACHE_PREFIX = 'homepage-shell-';
const CACHE_NAME = `${CACHE_PREFIX}v5`;
const SHELL_PATH = '/';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
const IS_LOCALHOST = LOCAL_HOSTNAMES.has(self.location.hostname);

self.addEventListener('install', (event) => {
    if (IS_LOCALHOST) {
        event.waitUntil(self.skipWaiting());
        return;
    }

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
    if (IS_LOCALHOST) {
        event.waitUntil(
            caches
                .keys()
                .then((names) =>
                    Promise.all(
                        names
                            .filter((name) => name.startsWith(CACHE_PREFIX))
                            .map((name) => caches.delete(name))
                    )
                )
                .then(() => self.registration.unregister())
        );
        return;
    }

    event.waitUntil(
        caches
            .keys()
            .then((names) =>
                Promise.all(
                    names
                        .filter(
                            (name) =>
                                name.startsWith(CACHE_PREFIX) &&
                                name !== CACHE_NAME
                        )
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
    if (IS_LOCALHOST) {
        return;
    }

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
