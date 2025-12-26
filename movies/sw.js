const CACHE_NAME = 'kranti-matrix-v1';
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://i.postimg.cc/c1Rj1xbK/IMG_3336.png' // আপনার লোগো বা আইকন লিঙ্ক
];

// ফাইলগুলো ফোনের মেমোরিতে সেভ করা
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(assets);
    })
  );
});

// ফাইলগুলো লোড করার সময় ক্যাশ থেকে নেওয়া (যাতে দ্রুত ওপেন হয়)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
