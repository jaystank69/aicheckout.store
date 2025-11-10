const CACHE = "aicheckout-v1";
const ASSETS = [
  "/", "/index.html", "/products.html",
  "/assets/css/styles.css",
  "/assets/js/app.js", "/assets/js/stories.js", "/assets/js/products.js",
  "/assets/img/logo.svg", "/favicon.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    );
  }
});
