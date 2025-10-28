const urlsToCache = ["/", "/index.html", "/favicon.ico", "/app.webmanifest"];
self.addEventListener("install", (event) => {
  event.waitUntil(async function () {
    const cache = await caches.open("static-cache");
    return await cache.addAll(urlsToCache);
  });
});
self.addEventListener("activate", (event) => {});

self.addEventListener("fetch", (event) => {
  // get / fetch the request from the cache
  //
  event.respondWith(
    caches.match(event.request).then((response) => {
      //
      return response || fetch(event.request);
    })
  );
});
