// class CacheStore {
//   constructor() {
//     this.dbPromise = idb.open('graphql-cache', 1, upgradeDB => {
//       upgradeDB.createObjectStore('keyval');
//     });
//
//     this.db = {
//       get(key) {
//         return dbPromise.then(db => {
//           return db.transaction('keyval')
//             .objectStore('keyval').get(key);
//         });
//       },
//       set(key, val) {
//         return dbPromise.then(db => {
//           const tx = db.transaction('keyval', 'readwrite');
//           tx.objectStore('keyval').put(val, key);
//           return tx.complete;
//         });
//       },
//       delete(key) {
//         return dbPromise.then(db => {
//           const tx = db.transaction('keyval', 'readwrite');
//           tx.objectStore('keyval').delete(key);
//           return tx.complete;
//         });
//       },
//       clear() {
//         return dbPromise.then(db => {
//           const tx = db.transaction('keyval', 'readwrite');
//           tx.objectStore('keyval').clear();
//           return tx.complete;
//         });
//       }
//     };
//   }
// }
