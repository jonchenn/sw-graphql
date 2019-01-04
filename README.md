# How to implement Service Worker with GraphQL

## TL;DR

TBD

## Getting started

### Start node.js server

Install Node modules and run node server locally. This will open up http://localhost:4000 for the website, and http://localhost:4000/graphql for GraphiQL test web.

```
npm install
node server.js
```

### Test GraphQL API endpoint

(Optional) You can open up http://localhost:4000/graphql to test GraphQL API endpoint with the following query string:

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

### Test service worker's caching for GraphQL requests.

TBD

## Reference

- [Caching POST requests for offline use in a PWA](https://a.kabachnik.info/offline-post-requests-via-service-worker-and-indexeddb.html)
- [Creating A GraphQL Server With Node.js And Express](https://medium.com/codingthesmartway-com-blog/creating-a-graphql-server-with-node-js-and-express-f6dddc5320e1)
- [Dexie.js - A JS library for IndexedDB](https://dexie.org/docs/Tutorial/Getting-started)
- [GraphQL official site](https://graphql.org/)
