const CACHE_NAME = "estore-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/IMG/favicon-192x192.png",
  "/IMG/favicon-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// old cache delete
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// smarter fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
    .then((res) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, res.clone());
        return res;
      });
    })
    .catch(() => caches.match(event.request))
  );
});