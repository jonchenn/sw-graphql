importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/dexie/2.0.4/dexie.min.js');

var CACHE_NAME = 'main-cache-v1';
var urlsToCache = [
  // '/index.html',
];

// Init indexedDB using Dexie.js (https://dexie.org/).
const db = new Dexie('GraphQL-Cache');
db.version(1).stores({
  post_cache: 'key,response,timestamp'
});

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

// Workbox with custom handler to use IndexedDB for cache.
workbox.routing.registerRoute(
  '/graphql',
  // Uncomment below to see the error thrown from Cache Storage API.
  //workbox.strategies.staleWhileRevalidate(),
  async ({event}) => {
    return staleWhileRevalidate(event);
  },
  'POST'
);

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
  let id = body.query;

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
  let id = body.query;
  let data = await store.get(id);
  return data ? new Response(
    JSON.stringify(data.response.body), data.response) : null;
}

async function getPostKey(request) {
  let body = await request.json();
  return JSON.stringify(body);
}
