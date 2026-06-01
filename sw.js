const CACHE = 'guaraca-v3'
const STATIC = ['./icon.svg', './manifest.json']

// Instalar: cachear solo los assets estáticos
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)))
  self.skipWaiting()
})

// Activar: borrar caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch: network-first para HTML, cache-first para el resto
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  const isHTML = e.request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')

  if (isHTML) {
    // Siempre intentar la red primero para tener la última versión
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone()
          caches.open(CACHE).then(c => c.put(e.request, clone))
          return res
        })
        .catch(() => caches.match(e.request))
    )
  } else {
    // Assets estáticos: cache primero
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    )
  }
})
