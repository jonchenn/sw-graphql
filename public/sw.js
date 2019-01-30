importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js');
importScripts('https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval-iife.min.js');

var CACHE_NAME = 'main-cache-v1';
var urlsToCache = [
  // '/index.html',
];

// Init indexedDB using idb-keyval, https://github.com/jakearchibald/idb-keyval
const store = new idbKeyval.Store('GraphQL-Cache', 'PostResponses');

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
  let cachedResponse = await getCache(event.request.clone());
  let fetchPromise = fetch(event.request.clone())
    .then((response) => {
      setCache(event.request.clone(), response.clone());
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

async function setCache(request, response) {
  var key, data;
  let body = await request.json();
  let id = CryptoJS.MD5(body.query).toString();

  var entry = {
    response: await serializeResponse(response),
    timestamp: Date.now()
  };
  idbKeyval.set(id, entry, store);
    // .add(entry)
    // .catch(function(error) {
    //   store.update(entry.key, entry);
    // });
}

async function getCache(request) {
  let body = await request.json();
  let id = CryptoJS.MD5(body.query).toString();
  let data = await idbKeyval.get(id, store);
  return data ? new Response(
    JSON.stringify(data.response.body), data.response) : null;
}

async function getPostKey(request) {
  let body = await request.json();
  return JSON.stringify(body);
}
