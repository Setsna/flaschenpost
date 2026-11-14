/* Flaschenpost: Lernzeit je Modul.
   - Zählt nur, solange eine Station offen und die Seite sichtbar ist (Muster Korallenriff).
   - Eine Sitzung zählt höchstens config.lernzeit.hoechstensSek, unter mindestensSek gar nicht.
   - Wird in Etappe 3 eingeschaltet: Station öffnen -> starten(modulId), verlassen -> beenden(). */
import { config as C } from './config.js?v=67';
import * as S from './speicher.js?v=67';

let modul = null;
let seit = 0;
let uhr = () => Date.now();

/* Nur für Tests: eine eigene Uhr setzen */
export function uhrSetzen(f) { uhr = typeof f === 'function' ? f : () => Date.now(); }

/* Laufende Zeit gutschreiben. Gibt die gezählten Sekunden zurück (0, wenn nichts zählte). */
function abschliessen() {
  if (!modul || !seit) return 0;
  const sek = Math.min(C.lernzeit.hoechstensSek, Math.round((uhr() - seit) / 1000));
  seit = 0;
  if (sek < C.lernzeit.mindestensSek) return 0;
  S.zeitMerken(modul, sek);
  return sek;
}

export function starten(modulId) {
  beenden();
  if (!C.module.some(m => m.id === modulId)) return;
  modul = modulId;
  seit = document.hidden ? 0 : uhr();
}

export function beenden() {
  const sek = abschliessen();
  modul = null;
  return sek;
}

export const laeuft = () => modul !== null && seit > 0;

/* Versteckter Tab oder iPad gesperrt: Zeit anhalten, beim Zurückkommen neu starten */
document.addEventListener('visibilitychange', () => {
  if (!modul) return;
  if (document.hidden) abschliessen();
  else seit = uhr();
});
window.addEventListener('pagehide', () => { abschliessen(); });
