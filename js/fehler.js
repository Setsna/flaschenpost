/* Flaschenpost: Skriptfehler sammeln, damit der Rauchtest sie sieht.
   Klassisches Skript, wird vor allen Modulen geladen. */
'use strict';
window.FEHLER = [];
window.addEventListener('error', e => window.FEHLER.push(String(e.message || e)));
window.addEventListener('unhandledrejection', e => window.FEHLER.push(String(e.reason)));
