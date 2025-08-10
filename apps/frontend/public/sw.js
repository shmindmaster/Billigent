// Service Worker for caching static assets and API responses
const CACHE_NAME = 'billigent-v1';
const STATIC_CACHE_NAME = 'billigent-static-v1';
const API_CACHE_NAME = 'billigent-api-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/assets/index.css',
  '/assets/index.js',
  '/manifest.json'
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/analytics',
  '/api/cases',
  '/api/users'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'image') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
});

async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Only cache GET requests for specific endpoints
  if (request.method === 'GET' && 
      CACHEABLE_APIS.some(api => url.pathname.startsWith(api))) {
    
    try {
      // Try network first for fresh data
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Cache successful responses
        const cache = await caches.open(API_CACHE_NAME);
        await cache.put(request, networkResponse.clone());
        return networkResponse;
      }
      
      // If network fails, try cache
      const cachedResponse = await caches.match(request);
      return cachedResponse || networkResponse;
      
    } catch (error) {
      // Network failed, try cache
      const cachedResponse = await caches.match(request);
      return cachedResponse || new Response('Offline', { 
        status: 503,
        statusText: 'Service Unavailable'
      });
    }
  }
  
  // For non-cacheable API requests, just fetch
  return fetch(request);
}

async function handleStaticRequest(request) {
  try {
    // Try cache first for static assets
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, fetch and cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}
