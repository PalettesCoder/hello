const CACHE_NAME = 'harsha-portfolio-cache-v2';

// Core shell — cached on install for offline support
const CORE_SHELL = [
  '/',
  'index.html',
  'freelance.html',
  'resume.html',
  'tech-stack.html',
  'project-detail.html',
  '404.html',
  'css/bootstrap.min.css',
  'css/styles.css',
  'css/figma-nav.css',
  'css/fonts.css',
  'css/inter.css',
  'css/style.css',
  'css/swiper-bundle.min.css',
  'css/animate.css',
  'css/popup.css',
  'fonts/Inter-Regular.woff2',
  'fonts/Inter-Medium.woff2',
  'fonts/Inter-Bold.woff2',
  'fonts/Inter-SemiBold.woff2',
  'fonts/ApfelGrotezk-Regular.otf',
  'fonts/icomoon.ttf',
  'js/jquery.min.js',
  'js/bootstrap.min.js',
  'js/gsap.min.js',
  'js/ScrollTrigger.min.js',
  'js/SplitText.min.js',
  'js/swiper-bundle.min.js',
  'js/main.js',
  'js/gsapAnimation.js',
  'js/ScrollSmooth.js',
  'js/ScrollToPlugin.min.js',
  'js/contact.js',
  'js/countto.js',
  'js/animation-change-text.js',
  'js/carousel.js',
  'js/infinityslide.js',
  'js/jquery.nice-select.min.js',
  'js/jquery-validate.js',
  'js/snowflake_cursor.js',
  'js/figma-app.js',
  'js/figma-notify.js',
  'images/image.jpg',
  'images/logo.svg',
  'images/logo-3.svg',
  'images/favicon.svg',
  'images/avatar-boy.png',
  'manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching core shell');
        return cache.addAll(CORE_SHELL);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim()) // Take control immediately
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests except CDN
  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isTrustedCDN = url.hostname === 'cdn.jsdelivr.net' || 
                       url.hostname === 'fonts.googleapis.com' || 
                       url.hostname === 'fonts.gstatic.com';

  if (!isSameOrigin && !isTrustedCDN) return;

  // HTML pages: Network-first (always try to get fresh content)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: Stale-while-revalidate
  // Serve from cache immediately, update in background
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});