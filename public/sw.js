importScripts('https://cdnjs.cloudflare.com/ajax/libs/dexie/2.0.4/dexie.min.js');
importScripts('/cachestore.js');

var CACHE_NAME = 'main-cache-v1';
var urlsToCache = [
  // '/index.html',
  // '/style.css',
  // '/main.js'
];

// Init indexedDB using Dexie.js (https://dexie.org/).
const db = new Dexie('GraphQL-Cache');
db.version(1).stores({
  post_cache: 'key,response,timestamp'
});

// When installing SW.
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Match POST requests. Cache response if it successfully gets responses from
  // API endpoint. When failed, return cached content.
  if (event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request.clone())
      .then(function(response) {
        setCache(event.request.clone(), response.clone(), db.post_cache);
        return response;
      })
      .catch(function() {
        return getCache(event.request.clone(), db.post_cache);
      })
    );
  }
});

async function setCache(request, response, store) {
  var key, data;
  let body = await request.json();
  let id = JSON.stringify(body);
  var entry = {
    key: id,
    response: JSON.stringify(response.clone()),
    timestamp: Date.now()
  };
  store
    .add(entry)
    .catch(function(error) {
      store.update(entry.key, entry);
    });
}

async function getCache(request, store) {
  let body = await request.json();
  let id = JSON.stringify(body);

  let data = await store.get(id);
  if (data) {
    return JSON.parse(data.response);
  } else {
    return new Response('', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

async function getPostKey(request) {
  let body = await request.json();
  return JSON.stringify(body);
}
