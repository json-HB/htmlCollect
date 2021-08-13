self.addEventListener(
  'install',
  event => {
    console.log(event, 'event');
    event.waitUntil(
      caches.open('v1').then(cache => {
        return cache.addAll(['./img/pic0.jpg', './img/pic1.jpg', './img/pic2.jpg']);
      })
    );
  },
  false
);

self.addEventListener('fetch', function(event) {
  console.log(event);
  event.respondWidth(
    caches.match(event.request).then(res => {
      if (res === undefined) {
        return new Response('hello');
      } else {
        return fetch(event.request).then(resp => {
          return caches.open('v1').then(cache => {
            cache.put(event.request, resp.clone());
            return resp;
          });
        });
      }
    })
  );
});

// self.addEventListener('fetch', event => {
//   event.respondWidth(
//     caches.match(event.request).then(res => {
//       return fetch(event.request)
//         .then(resd => {
//           return caches.open('v1').then(cache => {
//             cache.put(event.request, resd.clone());
//             return resd;
//           });
//         })
//         .catch(err => {
//           return caches.match('error.html');
//         });
//     })
//   );
// });
