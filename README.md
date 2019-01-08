# Cache GraphQL POST requests with Service Worker

## TL;DR

This is a demo of how to use service worker to cache GraphQL POST requests. As [Cache Storage API](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) doesn't support caching POST requests, the option is to cache POST responses in IndexedDB instead of the Cache Storage.

Sine Workbox uses CacheStorage API by default, we will hand-craft the service worker caching functionality in this demo instead of using Workbox.

## Getting started

### Start node.js server

Install Node modules and run node server locally. This will open up http://localhost:4000 for the website, and http://localhost:4000/graphql for GraphiQL test web.

```
npm install
node server.js
```

### Inspect and live-reload server

You can also run inspector if you'd like to debug the node server:

```
node --inspect server.js
```

Or, use nodemon to run the server with live-reload:

```
nodemon --inspect server.js
```

## Test GraphQL API endpoint (Optional)

You can open up http://localhost:4000/graphql to test GraphQL API endpoint with the following query string:

```
{
  restaurants(type:"Japanese", stars: 3) {
    name
    stars
  }
}
```

This shall return the query result in JSON format like the following:
```
{
  "data": {
    "restaurants": [
      {
        "name": "Masa",
        "stars": 3
      }
    ]
  }
}
```

## Test service worker's caching for GraphQL requests.

Open up [http://localhost:4000](http://localhost:4000) in Chrome's Incognito mode. You will see the index page for 2018 Michelin-Star Restaurants in New York City with two dropdown filters (stars and types). Follow the steps below to verify if a service worker is installed correctly:

- Open up Chrome's DevTools
- Go to ***Application*** tab and select ***Service Workers*** You shall see a service worker (sw.js) is installed and running.
- Select ***IndexedDB***, and this shall be empty if it's the first time opening up the web app.

In the index page, try changing one filter (e.g. changing Michelin Stars to 3). This will make an GraphQL POST request to the backend. The service worker will cache it in the IndexedDB based on the query.

Now, follow the steps below to verify the cached POST responses in IndexedDB.

- Refresh the index page.
- In the Chrome's DevTools, select ***IndexedDB > GraphQL-Cache > post_cache***.
- In the IndexedDB table, you will see a row with key and value.
- Expand the value data, and you shall see a key composed of query string, a response JSON based on the POST request, and a timestamp.

Try a different combination of filters and see if it updates the IndexedDB cache.

## Questions and Issues?

Please file issues at [https://github.com/jonchenn/sw-graphql/issues](https://github.com/jonchenn/sw-graphql/issues)

## Reference

- [Caching POST requests for offline use in a PWA](https://a.kabachnik.info/offline-post-requests-via-service-worker-and-indexeddb.html)
- [Creating A GraphQL Server With Node.js And Express](https://medium.com/codingthesmartway-com-blog/creating-a-graphql-server-with-node-js-and-express-f6dddc5320e1)
- [Dexie.js - A JS library for IndexedDB](https://dexie.org/docs/Tutorial/Getting-started)
- [GraphQL official site](https://graphql.org/)
