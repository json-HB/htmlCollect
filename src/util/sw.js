self.addEventListener('install', (event) => {
    console.log(event, 'event')
    event.waitUntil(caches.open('v1').then((cache) => {
        cache.addAll([
            '/img/pic0.jpg',
            '/img/pic1.jpg',
            '/img/pic2.jpg',
        ])
    }))
}, false);

self.addEventListener('activate', (event) => {
    console.log('activated')
    event.waitUntil(chches.keys().then((cacheName) => {
        return Promise.all(cacheName.map(item => {
            console.log(item)
            if (item == 'v1') {
                return caches.delete(item);
            }
        }))
    }))
})

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((res) => {
        if (res != undefined) {
            return res;
        } else {
            return fetch(event.request).then((res) => {
                let cloneRes = res.clone();
                caches.open('v2').then(cache => {
                    cache.put(event.request, cloneRes);
                })
                return res;
            }).catch(res => {
                return caches.match('img/hospital.png')
            })
        }
    }))
}, false)