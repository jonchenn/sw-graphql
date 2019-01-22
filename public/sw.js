importScripts('https://cdnjs.cloudflare.com/ajax/libs/dexie/2.0.4/dexie.min.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js');

var CACHE_NAME = 'main-cache-v1';
var urlsToCache = [
  // '/index.html',
];

// Init indexedDB using Dexie.js (https://dexie.org/).
const db = new Dexie('GraphQL-Cache');
db.version(1).stores({
  post_cache: 'key,response,timestamp'
});

// When installing SW.
self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Return cached response when possible, and fetch new results from server in
// the background and update the cache.
self.addEventListener('fetch', async (event) => {
  if (event.request.method === 'POST') {
    event.respondWith(staleWhileRevalidate(event));
  }

  // TODO: Handles other types of requests.
});

async function staleWhileRevalidate(event) {
  let promise = null;
  let cachedResponse = await getCache(event.request.clone(), db.post_cache);
  let fetchPromise = fetch(event.request.clone())
    .then((response) => {
      setCache(event.request.clone(), response.clone(), db.post_cache);
      return response;
    })
    .catch((err) => {
      console.error(err);
    });
  return cachedResponse ? Promise.resolve(cachedResponse) : fetchPromise;
}

async function serializeResponse(response) {
  let serializedHeaders = {};
  for (var entry of response.headers.entries()) {
		serializedHeaders[entry[0]] = entry[1];
	}
  let serialized = {
		headers: serializedHeaders,
		status: response.status,
		statusText: response.statusText
  };
  serialized.body = await response.json();
  return serialized;
}

async function setCache(request, response, store) {
  var key, data;
  let body = await request.json();
  let id = CryptoJS.MD5(body.query).toString();

  var entry = {
    key: id,
    response: await serializeResponse(response),
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
  let id = CryptoJS.MD5(body.query).toString();
  let data = await store.get(id);
  return data ? new Response(
    JSON.stringify(data.response.body), data.response) : null;
}

async function getPostKey(request) {
  let body = await request.json();
  return JSON.stringify(body);
}
