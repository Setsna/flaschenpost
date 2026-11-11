/* Flaschenpost: Speicher im Browser.
   - Alles bleibt in localStorage dieses Browsers, alle Kinder unter einem Schlüssel.
   - Welches Kind in diesem Tab arbeitet, steht in sessionStorage.
   - ?vorschau=N zeigt einen Beispielstand mit N fertigen Stationen und speichert nichts.
   - Kein Export als Datei (Ingo, 11.11.2026: für Kinder zu schwer, wie beim Zahlenschwarm).
   Aufbau übernommen vom Zahlenschwarm (js/speicher.js), umgebaut auf ein ES-Modul. */
import { config as C } from './config.js?v=62';

const KEY = `${C.speicher.schluessel}-v${C.speicher.schema}`;
const WER = C.speicher.werSchluessel;

const neueId = () => 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const istObjekt = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const objektOderLeer = x => istObjekt(x) ? x : {};

/* Ein Kind. stationen/stempel/zeit/eintraege/kannIch werden ab Etappe 2 gefüllt. */
const leeresKind = name => ({ id: neueId(), name, angelegt: Date.now(), stationen: {}, stempel: {}, zeit: {}, eintraege: {}, kannIch: {} });
const normalisiere = k => ({
  id: String(k.id),
  name: String(k.name).trim().slice(0, C.nameMaxLaenge),
  angelegt: Number(k.angelegt) || Date.now(),
  stationen: objektOderLeer(k.stationen),
  stempel: objektOderLeer(k.stempel),
  zeit: objektOderLeer(k.zeit),
  eintraege: objektOderLeer(k.eintraege),
  kannIch: objektOderLeer(k.kannIch)
});
const kindGueltig = k => istObjekt(k) && typeof k.id === 'string' && k.id && typeof k.name === 'string' && k.name.trim();

let kinder = [];
let aktivId = null;
/* Konnte ein vorhandener Stand nicht gelesen werden, speichert die Seite nichts,
   damit der alte Stand nicht überschrieben wird. */
let ladeFehler = false;
let letzterFehler = null;
let persistGefragt = false;

/* ---------- Vorschau ---------- */
const vorschauWert = new URLSearchParams(location.search).get('vorschau');
export const istVorschau = vorschauWert !== null && /^\d{1,2}$/.test(vorschauWert);
const alleStationen = C.module.flatMap(m => m.stationen);

/* Beispiel-Einträge und Kann-ich-Sätze nur für die Vorschau, erkennbar als Beispiel.
   Datenformen (gelten auch für echte Stände):
   zeit:      { modulId: Sekunden }
   eintraege: { stationId: { text, t } }
   kannIch:   { modulId: { satzId: { text, wert: 'kann' | 'uebe', t } } } */
const VORSCHAU_EINTRAEGE = [
  'Beispiel: Auf dem Zettel stand kein Name. Dann weiß ich nicht, wer ihn geschrieben hat.',
  'Beispiel: Ich frage morgen nach, ob das wirklich stimmt.',
  'Beispiel: Die Anzeige will, dass ich etwas kaufe.'
];
const VORSCHAU_KANN = {   /* Ids und Wortlaut wie in js/daten/*.js (abschluss.saetze) */
  wer: [
    ['s1', 'Ich frage bei einer Nachricht: Wer hat das geschrieben?', 'kann'],
    ['s2', 'Ich merke, wenn kein Absender dabeisteht.', 'uebe']
  ],
  warum: [['s2', 'Ich erkenne Werbung, die mir etwas verkaufen will.', 'kann']],
  woher: [['s1', 'Ich frage bei einer Nachricht: Woher weiß er das?', 'kann']]
};

function vorschauKind(n) {
  const k = leeresKind('Vorschau');
  k.id = 'vorschau';
  alleStationen.slice(0, n).forEach((id, i) => {
    const zeit = Date.now() - (n - i) * 86400000;
    k.stationen[id] = { fertig: zeit };
    k.stempel[id] = zeit;
    if (i < VORSCHAU_EINTRAEGE.length) k.eintraege[id] = { text: VORSCHAU_EINTRAEGE[i], t: zeit };
  });
  for (const m of C.module) {
    const fertig = m.stationen.filter(id => k.stationen[id]).length;
    if (fertig) k.zeit[m.id] = fertig * 11 * 60 + 40;
    if (fertig === m.stationen.length && VORSCHAU_KANN[m.id]) {
      k.kannIch[m.id] = {};
      VORSCHAU_KANN[m.id].forEach(([id, text, wert]) => { k.kannIch[m.id][id] = { text: 'Beispiel: ' + text, wert, t: Date.now() }; });
    }
  }
  return k;
}

/* ---------- Laden ---------- */
function laden() {
  if (istVorschau) {
    kinder = [vorschauKind(Math.min(Number(vorschauWert), alleStationen.length))];
    aktivId = 'vorschau';
    return;
  }
  let roh = null;
  try { roh = localStorage.getItem(KEY); } catch (e) { letzterFehler = e; return; }
  if (roh === null) return;
  try {
    const daten = JSON.parse(roh);
    if (!istObjekt(daten) || !Array.isArray(daten.kinder)) throw new Error('Aufbau unbekannt');
    kinder = daten.kinder.filter(kindGueltig).map(normalisiere);
  } catch (e) {
    ladeFehler = true;
    letzterFehler = e;
    return;
  }
  let gewaehlt = null;
  try { gewaehlt = sessionStorage.getItem(WER); } catch (e) { /* dann fragt die Seite nach */ }
  const k = kinder.length === 1 ? kinder[0] : kinder.find(x => x.id === gewaehlt);
  if (k) aktivId = k.id;
}

/* ---------- Speichern ---------- */
/* Gibt true zurück, wenn gespeichert wurde (oder in der Vorschau nichts zu tun ist). */
export function speichern() {
  if (istVorschau) return true;
  if (ladeFehler) return false;
  try {
    localStorage.setItem(KEY, JSON.stringify({ schema: C.speicher.schema, kinder }));
  } catch (e) {
    letzterFehler = e;
    return false;
  }
  letzterFehler = null;
  if (!persistGefragt) {
    persistGefragt = true;
    /* Bittet den Browser, die Daten zu behalten. Ob er zustimmt, entscheidet er selbst. */
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) { /* Normalfall bleibt */ }
  }
  return true;
}

/* ---------- Kinder ---------- */
const gleicherName = (a, b) => a.trim().toLocaleLowerCase('de') === b.trim().toLocaleLowerCase('de');

/* Prüft einen Vornamen. Gibt null zurück, wenn er passt, sonst einen Hinweis für das Kind. */
export function namePruefen(name, ausserId = null) {
  const n = String(name || '').trim();
  if (!n) return 'Schreib bitte deinen Vornamen.';
  if (n.length > C.nameMaxLaenge) return `Der Name ist zu lang. Höchstens ${C.nameMaxLaenge} Zeichen.`;
  if (kinder.some(k => k.id !== ausserId && gleicherName(k.name, n))) return 'Diesen Namen gibt es hier schon. Nimm zum Beispiel noch den ersten Buchstaben vom Nachnamen dazu.';
  return null;
}

export function anlegen(name) {
  if (istVorschau) return { ok: false, grund: 'In der Vorschau kann man keine Kinder anlegen.' };
  const grund = namePruefen(name);
  if (grund) return { ok: false, grund };
  const k = leeresKind(String(name).trim());
  kinder.push(k);
  waehlen(k.id);
  return { ok: speichern(), kind: k };
}

export function waehlen(id) {
  if (!kinder.some(k => k.id === id)) return false;
  aktivId = id;
  if (!istVorschau) { try { sessionStorage.setItem(WER, id); } catch (e) { /* nur dieser Tab */ } }
  return true;
}

export function abmelden() {
  aktivId = null;
  try { sessionStorage.removeItem(WER); } catch (e) { /* egal */ }
}

/* Löscht nur das aktive Kind. In der Vorschau wird nichts gelöscht. */
export function aktivLoeschen() {
  const k = aktiv();
  if (!k || istVorschau) return false;
  kinder = kinder.filter(x => x.id !== k.id);
  abmelden();
  return speichern();
}

export function aktiv() { return kinder.find(k => k.id === aktivId) || null; }

/* Station abgeschlossen („Fertig!“): fertig-Zeit und Siegel (Stempel). Das erste Siegel bleibt. */
export function stationFertig(id) {
  const k = aktiv();
  if (!k) return false;
  const t = Date.now();
  k.stationen[id] = Object.assign({}, k.stationen[id], { fertig: t });
  if (!k.stempel[id]) k.stempel[id] = t;
  return speichern();
}

/* Selbsteinschätzung am Modul-Abschluss: „Kann ich!“ (kann) oder „Übe ich noch“ (uebe).
   Der Satztext wird mitgespeichert, damit das Fundbuch ihn auch später so zeigt, wie das Kind ihn gesehen hat. */
export function kannIchSetzen(modulId, satzId, text, wert) {
  const k = aktiv();
  if (!k || (wert !== 'kann' && wert !== 'uebe')) return false;
  k.kannIch[modulId] = Object.assign({}, k.kannIch[modulId], { [satzId]: { text: String(text), wert, t: Date.now() } });
  return speichern();
}

/* Eigener Eintrag zu einer Station. Leerer Text löscht den Eintrag. */
export const EINTRAG_MAX = 2000;
export function eintragSetzen(id, text) {
  const k = aktiv();
  if (!k) return false;
  const s = String(text || '').slice(0, EINTRAG_MAX);
  if (s.trim()) k.eintraege[id] = { text: s, t: Date.now() };
  else delete k.eintraege[id];
  return speichern();
}

/* Lernzeit gutschreiben (Sekunden je Modul). Gibt zurück, ob gespeichert wurde. */
export function zeitMerken(modulId, sek) {
  const k = aktiv();
  const s = Math.round(Number(sek));
  if (!k || !(s > 0)) return false;
  k.zeit[modulId] = (Number(k.zeit[modulId]) || 0) + s;
  return speichern();
}
export const alleKinder = () => kinder.slice();

laden();

export const zustand = {
  KEY,
  get ladeFehler() { return ladeFehler; },
  get letzterFehler() { return letzterFehler; }
};
