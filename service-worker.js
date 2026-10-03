/* ============================================================
   Prime Vector LMS — service-worker.js (PWA Offline Service Worker)
   ============================================================ */

const CACHE_NAME = 'primevector-lms-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'login.html',
  'register.html',
  'student.html',
  'course.html',
  'placement.html',
  'resume-builder.html',
  'compiler.html',
  'quiz.html',
  'classes.html',
  'css/style.css',
  'css/navbar.css',
  'css/sidebar.css',
  'css/dashboard.css',
  'css/placement.css',
  'js/app.js',
  'js/login.js',
  'js/student.js',
  'js/online-data.js',
  'js/resume-builder.js'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[PWA SW] Pre-caching static assets for offline capability');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[PWA SW] Removing old cache keys', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Network First, fallback to Cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      console.log('[PWA SW] Offline: Serving resource from cache', event.request.url);
      return caches.match(event.request);
    })
  );
});
