//"use strict";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
);

const CACHE_NAME = "static-cache-v4";
const DATA_CACHE_NAME = "data-cache-v4";
/*
const FILES_TO_CACHE = [
  "/offline.html",
  "/index.html",
  "/scripts/db.js",
  "/scripts/app.js",
  "/scripts/install.js",
  "/images/ic_add_white_24px.svg",
  "/images/ic_refresh_white_24px.svg"
];

self.addEventListener("install", evt => {
  console.log("[ServiceWorker] Install");
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});*/

self.addEventListener("activate", evt => {
  console.log("[ServiceWorker] Activate");
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", evt => {
  console.log("[ServiceWorker] Fetch", evt.request.url);
  if (evt.request.url.includes("/schedules/")) {
    console.log("[Service Worker] Fetch (data)", evt.request.url);
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(evt.request);
          });
      })
    );
    return;
  }
  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});


workbox.precaching.precacheAndRoute([
  {
    url: "/index.html",
    revision: "2237aad9d7e"
  },
  {
    url: "../scripts/db.js",
    revision: "323f746a9ecc"
  },
  {
    url: "../scripts/app.js",
    revision: "423f746a9eoc"
  },
  {
    url: "../styles/inline.css",
    revision: "523f746a9ecl"
  }
  // etc.
]);
