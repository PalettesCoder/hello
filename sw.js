
const CACHE_NAME = 'harsha-portfolio-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'css/animate.css',
  'css/bootstrap.min.css',
  'css/fonts.css',
  'css/inter.css',
  'css/pop-up.css',
  'css/style.css',
  'css/styles.css',
  'css/swiper-bundle.min.css',
  'fonts/ApfelGrotezk-Regular.otf',
  'fonts/icomoon.eot',
  'fonts/icomoon.ttf',
  'fonts/icomoon.woff',
  'fonts/Inter-Black.woff2',
  'fonts/Inter-BlackItalic.woff2',
  'fonts/Inter-Bold.woff2',
  'fonts/Inter-BoldItalic.woff2',
  'fonts/Inter-ExtraBold.woff2',
  'fonts/Inter-ExtraBoldItalic.woff2',
  'fonts/Inter-ExtraLight.woff2',
  'fonts/Inter-ExtraLightItalic.woff2',
  'fonts/Inter-Italic.woff2',
  'fonts/Inter-Light.woff2',
  'fonts/Inter-LightItalic.woff2',
  'fonts/Inter-Medium.woff2',
  'fonts/Inter-MediumItalic.woff2',
  'fonts/Inter-Regular.woff2',
  'fonts/Inter-SemiBold.woff2',
  'fonts/Inter-SemiBoldItalic.woff2',
  'fonts/Inter-Thin.woff2',
  'fonts/Inter-ThinItalic.woff2',
  'fonts/InterDisplay-Black.woff2',
  'fonts/InterDisplay-BlackItalic.woff2',
  'fonts/InterDisplay-Bold.woff2',
  'fonts/InterDisplay-BoldItalic.woff2',
  'fonts/InterDisplay-ExtraBold.woff2',
  'fonts/InterDisplay-ExtraBoldItalic.woff2',
  'fonts/InterDisplay-ExtraLight.woff2',
  'fonts/InterDisplay-ExtraLightItalic.woff2',
  'fonts/InterDisplay-Italic.woff2',
  'fonts/InterDisplay-Light.woff2',
  'fonts/InterDisplay-LightItalic.woff2',
  'fonts/InterDisplay-Medium.woff2',
  'fonts/InterDisplay-MediumItalic.woff2',
  'fonts/InterDisplay-Regular.woff2',
  'fonts/InterDisplay-SemiBold.woff2',
  'fonts/InterDisplay-SemiBoldItalic.woff2',
  'fonts/InterDisplay-Thin.woff2',
  'fonts/InterDisplay-ThinItalic.woff2',
  'fonts/InterVariable-Italic.woff2',
  'fonts/InterVariable.woff2',
  'images/1765124454076.jpeg',
  'images/acuvate.png',
  'images/AT4K2YY0SDCR.jpg',
  'images/avatar-boy.png',
  'images/avatar.png',
  'images/award-1.jpg',
  'images/award-2.jpg',
  'images/award-3.jpg',
  'images/award-4.jpg',
  'images/award-5.jpg',
  'images/Behance.png',
  'images/brand-1.svg',
  'images/brand-2.svg',
  'images/brand-3.svg',
  'images/brand-4.svg',
  'images/c2s.webp',
  'images/cloud-bg.png',
  'images/cursor-close.svg',
  'images/edu-2.svg',
  'images/edu-3.svg',
  'images/favicon.svg',
  'images/harsha.jpg',
  'images/harsha.png',
  'images/icomoon.svg',
  'images/LIOWEOIGC8HK.jpg',
  'images/logo-2.svg',
  'images/logo-3.svg',
  'images/logo.svg',
  'images/lpu.png',
  'images/medium.png',
  'images/pale-only.png',
  'images/pale.png',
  'images/profile.jpeg',
  'images/profile.png',
  'images/service-1.jpg',
  'images/service-2.jpg',
  'images/service-3.jpg',
  'images/service-4.jpg',
  'images/service-5.jpg',
  'images/service-6.jpg',
  'images/tech-1.svg',
  'images/tech-2.svg',
  'images/tech-3.svg',
  'images/tes-1.jpg',
  'images/tes-2.jpg',
  'images/tes-3.jpg',
  'images/vector-user.svg',
  'images/work-1.jpg',
  'images/work-2.jpg',
  'images/work-3.jpg',
  'js/animation-change-text.js',
  'js/bootstrap.min.js',
  'js/carousel.js',
  'js/contact.js',
  'js/countto.js',
  'js/gsap.min.js',
  'js/gsapAnimation.js',
  'js/infinityslide.js',
  'js/jquery-validate.js',
  'js/jquery.min.js',
  'js/jquery.nice-select.min.js',
  'js/main.js',
  'js/pop-up.js',
  'js/ScrollSmooth.js',
  'js/ScrollToPlugin.min.js',
  'js/ScrollTrigger.min.js',
  'js/SplitText.min.js',
  'js/swiper-bundle.min.js',
  'media/Hacker.mp4',
  'media/overlay-2.mp4'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
