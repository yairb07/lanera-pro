const CACHE = "laneraApp-v2";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json"
];

// Instalar — guarda los archivos en caché
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activar — limpia cachés viejos
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — Network First (siempre pide la última versión si hay internet)
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      // Si falla la red, buscar en caché
      return caches.match(e.request).then(cached => {
        return cached || caches.match("/");
      });
    })
  );
});
