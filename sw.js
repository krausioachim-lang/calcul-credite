const CACHE_NAME = 'calcul-credite-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://ui-avatars.com/api/?name=CC&background=2563eb&color=fff&size=512&font-size=0.5&bold=true',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// Instalare: Se descarcă toate resursele în memoria locală
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache deschis. Se salvează resursele...');
      // Folosim Promise.all pentru a ne asigura că fiecare resursă este salvată
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return fetch(url, { mode: 'no-cors' }).then(response => {
            return cache.put(url, response);
          }).catch(err => console.error('Eroare la salvarea resursei:', url, err));
        })
      );
    })
  );
  // Forțează activarea imediată
  self.skipWaiting();
});

// Activare: Se șterg versiunile vechi (v1, v2, v3, v4)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Se șterge cache-ul vechi:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Strategie: Cache First, Network Fallback
// Adică: Încearcă să încarci din memorie (pentru viteză și offline), 
// dacă nu găsești, mergi pe internet.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});