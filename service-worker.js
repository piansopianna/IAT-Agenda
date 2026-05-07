// ========================================
// SERVICE WORKER - IAT Agenda MPA
// Caching strategy: Network-first with cache fallback
// ========================================

const CACHE_NAME = 'iat-agenda-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './register.html',
    './login.html',
    './admin.html',
    './manifest.json',
    './assets/css/common-styles.css',
    './assets/js/common-app.js',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap'
];

// ========================================
// SERVICE WORKER INSTALLATION
// ========================================

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching static assets');
                // Cache essential files, skip external CDN on initial install
                return cache.addAll([
                    './',
                    './index.html',
                    './register.html',
                    './login.html',
                    './admin.html',
                    './manifest.json',
                    './assets/css/common-styles.css',
                    './assets/js/common-app.js'
                ]);
            })
            .catch((error) => {
                console.error('[Service Worker] Cache installation failed:', error);
            })
    );

    // Skip waiting and activate immediately
    self.skipWaiting();
});

// ========================================
// SERVICE WORKER ACTIVATION
// ========================================

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    // Claim all clients
    self.clients.claim();
});

// ========================================
// SERVICE WORKER FETCH - NETWORK FIRST STRATEGY
// ========================================

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome extensions
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // Handle different URL patterns
    if (url.origin === location.origin) {
        // LOCAL RESOURCES: Network first, cache fallback
        event.respondWith(networkFirst(request));
    } else if (url.hostname === 'cdn.tailwindcss.com' || 
               url.hostname === 'unpkg.com' ||
               url.hostname === 'fonts.googleapis.com' ||
               url.hostname === 'fonts.gstatic.com') {
        // CDN/External resources: Cache first, network fallback
        event.respondWith(cacheFirst(request));
    } else if (url.hostname === 'script.google.com') {
        // Google Apps Script: Network only
        event.respondWith(networkOnly(request));
    } else {
        // Other external: Network first
        event.respondWith(networkFirst(request));
    }
});

// ========================================
// CACHE STRATEGIES
// ========================================

/**
 * Network First Strategy
 * Try network first, fallback to cache
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        
        // Cache successful responses
        if (response.ok && request.method === 'GET') {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.log('[Service Worker] Network failed, using cache:', request.url);
        
        try {
            return await caches.match(request);
        } catch (cacheError) {
            console.error('[Service Worker] Cache match failed:', cacheError);
            return createOfflineFallback(request);
        }
    }
}

/**
 * Cache First Strategy
 * Try cache first, fallback to network
 */
async function cacheFirst(request) {
    try {
        const cached = await caches.match(request);
        
        if (cached) {
            return cached;
        }
    } catch (error) {
        console.error('[Service Worker] Cache match error:', error);
    }

    try {
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.log('[Service Worker] Network failed for:', request.url);
        
        // Return cached version or offline fallback
        try {
            return await caches.match(request);
        } catch (cacheError) {
            return createOfflineFallback(request);
        }
    }
}

/**
 * Network Only Strategy
 * Always fetch from network
 */
async function networkOnly(request) {
    try {
        return await fetch(request);
    } catch (error) {
        console.error('[Service Worker] Network request failed:', error);
        return createOfflineFallback(request);
    }
}

// ========================================
// OFFLINE FALLBACK
// ========================================

function createOfflineFallback(request) {
    // For HTML pages, return offline page
    if (request.headers.get('accept')?.includes('text/html')) {
        return new Response(`
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - IAT Agenda</title>
                <style>
                    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8fafc; color: #334155; margin: 0; }
                    .offline-box { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 500px; }
                    h1 { color: #0f172a; margin: 0 0 1rem 0; font-size: 1.875rem; }
                    p { color: #64748b; margin: 0.5rem 0; line-height: 1.6; }
                    .icon { font-size: 3rem; margin-bottom: 1rem; }
                    button { background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; margin-top: 1rem; }
                    button:hover { background: #1d4ed8; }
                </style>
            </head>
            <body>
                <div class="offline-box">
                    <div class="icon">📵</div>
                    <h1>Tidak Ada Koneksi Internet</h1>
                    <p>Aplikasi sedang offline. Fitur dasar tersedia dari cache lokal.</p>
                    <p>Silakan periksa koneksi internet Anda dan coba lagi.</p>
                    <button onclick="location.reload()">Coba Lagi</button>
                </div>
            </body>
            </html>
        `, { 
            status: 503, 
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }

    // For other requests, return 503
    return new Response('Offline - Resource not available', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

// ========================================
// BACKGROUND SYNC (Optional)
// ========================================

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-registrations') {
        event.waitUntil(syncRegistrations());
    }
});

async function syncRegistrations() {
    console.log('[Service Worker] Syncing registrations...');
    // Future implementation for syncing pending registrations
}

// ========================================
// PUSH NOTIFICATIONS (Optional)
// ========================================

self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'Notifikasi dari IAT Agenda',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%232563eb" width="192" height="192"/><text x="50%" y="50%" font-size="80" font-weight="bold" fill="white" text-anchor="middle" dy=".3em" font-family="Arial">IAT</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%232563eb" width="192" height="192"/><text x="50%" y="50%" font-size="80" font-weight="bold" fill="white" text-anchor="middle" dy=".3em" font-family="Arial">IAT</text></svg>',
        tag: data.tag || 'iat-notification',
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'IAT Agenda', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});

// ========================================
// MESSAGE HANDLING
// ========================================

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() => {
            console.log('[Service Worker] Cache cleared');
            event.ports[0].postMessage({ success: true });
        });
    }
});

console.log('[Service Worker] Service Worker script loaded');
