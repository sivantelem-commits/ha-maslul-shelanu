// Service Worker - "מעטפת" האפליקציה (HTML/CSS/JS) נשמרת במטמון כדי
// שהאפליקציה תיפתח גם בלי אינטרנט, אבל תמיד מנסה קודם לטעון גרסה
// טרייה מהרשת (network-first) - כך שעדכונים עתידיים ייכנסו לתוקף
// באופן מיידי, ולא יישארו "תקועים" על גרסה ישנה שנשמרה במטמון.
// הנתונים עצמם (מים/משקל/תפריט) תמיד דורשים חיבור לאינטרנט כדי
// להסתנכרן מול Supabase - הם לא נשמרים כאן בכלל.
const CACHE_NAME = 'ha-maslul-shelanu-v2';
const APP_SHELL = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/storage.js',
  './js/supabase-config.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // רק בקשות GET לקבצים באותו מקור (לא בקשות ל-Supabase/Google)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)) // אין אינטרנט - נופלים חזרה לגרסה השמורה
  );
});
