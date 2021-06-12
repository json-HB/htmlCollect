self.addEventListener('install', (event) => {
    console.log(event, 'event')
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/img/pic0.jpg',
                '/img/pic1.jpg',
                '/img/pic2.jpg',
            ])
        })
    )
}, false)

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
      );
      console.log(event)
  });