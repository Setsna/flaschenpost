/* Flaschenpost: Speicher (seit dem Konto-Umbau, 14.11.2026).
   - Das Kind meldet sich mit dem Zugangscode des Perlentauchers an (js/konto-cloud.js).
   - Der Fortschritt liegt im Browser, ein Eintrag je Code (js/konto-speicher.js), und wird
     im Hintergrund mit fp_stand/<code> in Firebase abgeglichen.
   - „Mein Eintrag“ (freier Text) bleibt NUR auf diesem Gerät, eigener Schlüssel je Code.
     Er gehört nicht zum Stand und geht nie in die Datenbank (Spec Konto-Umbau, Entscheidung 5).
   - ?vorschau=N zeigt einen Beispielstand mit N fertigen Stationen und speichert nichts.
   - Kein Export als Datei (Ingo, 11.11.2026). Kein Löschknopf für Kinder, Zurücksetzen macht die Lehrkraft.
   Die drei Baukasten-Module sind klassische Skripte und stehen in index.html vor diesem Modul. */
import { config as C } from './config.js?v=67';

const LK = window.LagunenKonto;
const A = LK.abgleich;

const alleStationen = C.module.flatMap(m => m.stationen);
const modulIds = C.module.map(m => m.id);
const SATZ_ID = /^[a-z0-9-]{1,20}$/;
const SATZ_MAX = 300;

/* ---------- Der Stand in fp_stand/<code> ----------
   stationen  { stationId: { fertig: Zeitpunkt } }
   stempel    { stationId: Zeitpunkt }                 das Siegel, das erste bleibt
   zeit       { modulId: Sekunden }
   kannIch    { modulId: { satzId: { text, wert: 'kann' | 'uebe', t } } }
   angelegt, geaendert (setzt konto-speicher.js). Kein Name, keine Einträge. */
function sauber(roh) {
  const r = A.karte(roh);
  const stationen = {}, stempel = {}, zeit = {}, kannIch = {};
  const st = A.karte(r.stationen), sp = A.karte(r.stempel), z = A.karte(r.zeit), ki = A.karte(r.kannIch);
  for (const id of alleStationen) {
    const f = A.zahl(A.karte(st[id]).fertig);
    if (f) stationen[id] = { fertig: Math.round(f) };
    const t = A.zahl(sp[id]);
    if (t) stempel[id] = Math.round(t);
  }
  for (const m of modulIds) {
    const s = A.zahl(z[m]);
    if (s) zeit[m] = Math.round(s);
    const saetze = {};
    for (const [id, e] of Object.entries(A.karte(ki[m]))) {
      if (!SATZ_ID.test(id) || !A.istObjekt(e) || (e.wert !== 'kann' && e.wert !== 'uebe')) continue;
      saetze[id] = { text: String(e.text || '').slice(0, SATZ_MAX), wert: e.wert, t: Math.round(A.zahl(e.t)) };
    }
    if (Object.keys(saetze).length) kannIch[m] = saetze;
  }
  return { stationen, stempel, zeit, kannIch };
}

/* Zwei Stände zusammenführen (Bausteine aus js/konto-abgleich.js) */
export function mische(basis, lokal, fern) {
  const b = sauber(basis), l = sauber(lokal), f = sauber(fern);
  const zeit = {}, kannIch = {};
  for (const m of modulIds) {
    const s = A.zuwachs(b.zeit[m], l.zeit[m], f.zeit[m]);
    if (s) zeit[m] = s;
    const k = A.neuererGewinnt(l.kannIch[m], f.kannIch[m], 't');
    if (Object.keys(k).length) kannIch[m] = k;
  }
  const aus = {
    stationen: A.neuererGewinnt(l.stationen, f.stationen, 'fertig'),
    stempel: A.vereinigeFrueh(l.stempel, f.stempel),
    zeit, kannIch,
    geaendert: A.spaeter(A.karte(lokal).geaendert, A.karte(fern).geaendert)
  };
  const angelegt = A.frueher(A.karte(lokal).angelegt, A.karte(fern).angelegt);
  if (angelegt) aus.angelegt = angelegt;
  return aus;
}

/* Nach dem Zurücksetzen durch die Lehrkraft: leer anfangen */
export const neuanfang = (lokal, jetzt) => ({ stationen: {}, stempel: {}, zeit: {}, kannIch: {}, angelegt: jetzt, geaendert: jetzt });

/* ---------- Vorschau ---------- */
const vorschauWert = new URLSearchParams(location.search).get('vorschau');
const vorschauAn = vorschauWert !== null && /^\d{1,2}$/.test(vorschauWert);

/* Beispiel-Einträge und Kann-ich-Sätze nur für die Vorschau, erkennbar als Beispiel. */
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
let vorschauEintraege = {};
function vorschauStand() {
  if (!vorschauAn) return null;
  const n = Math.min(Number(vorschauWert), alleStationen.length);
  const k = { stationen: {}, stempel: {}, zeit: {}, kannIch: {} };
  alleStationen.slice(0, n).forEach((id, i) => {
    const zeit = Date.now() - (n - i) * 86400000;
    k.stationen[id] = { fertig: zeit };
    k.stempel[id] = zeit;
    if (i < VORSCHAU_EINTRAEGE.length) vorschauEintraege[id] = { text: VORSCHAU_EINTRAEGE[i], t: zeit };
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

/* ---------- Speicher und Cloud ---------- */
export const S = LK.speicher({
  schluessel: `${C.speicher.schluessel}-v${C.speicher.schema}`,
  nameMax: C.nameMaxLaenge,
  leer: () => ({ stationen: {}, stempel: {}, zeit: {}, kannIch: {} }),
  normalisiere: sauber,
  mische,
  vorschau: vorschauStand
});

export const cloud = LK.cloud({
  firebase: C.firebase,
  sammlung: C.cloud.stand,
  sammlungKinder: C.cloud.kinder,
  speicher: S, mische, neuanfang,
  brauchtAngaben: false,
  schreibPauseMs: C.cloud.schreibPauseMs,
  nameMax: C.nameMaxLaenge
});

export const istVorschau = S.istVorschau;
export const aktiv = () => S.aktiv();
export const code = () => S.code();
export const speichern = () => S.speichern();

/* ---------- „Mein Eintrag“: nur auf diesem Gerät ---------- */
export const EINTRAG_MAX = 2000;
const eintragSchluessel = c => `${S.schluesselFuer(c)}.eintraege`;
let eintragCode = null, eintragCache = {};

/* Alle Einträge des angemeldeten Kindes: { stationId: { text, t } } */
export function eintraege() {
  if (istVorschau) return vorschauEintraege;
  const c = S.code();
  if (!c) return {};
  if (c !== eintragCode) {
    eintragCode = c;
    eintragCache = {};
    try {
      const d = JSON.parse(localStorage.getItem(eintragSchluessel(c)) || 'null');
      for (const [id, e] of Object.entries(A.karte(d))) {
        if (alleStationen.includes(id) && A.istObjekt(e) && typeof e.text === 'string' && e.text.trim()) {
          eintragCache[id] = { text: e.text.slice(0, EINTRAG_MAX), t: A.zahl(e.t) };
        }
      }
    } catch (e) { /* unlesbar: leer anfangen, der alte Text bleibt im Speicher liegen */ }
  }
  return eintragCache;
}

/* Eigener Eintrag zu einer Station. Leerer Text löscht den Eintrag. */
export function eintragSetzen(id, text) {
  if (istVorschau) return true;
  const c = S.code();
  if (!c) return false;
  const alle = eintraege();
  const s = String(text || '').slice(0, EINTRAG_MAX);
  if (s.trim()) alle[id] = { text: s, t: Date.now() };
  else delete alle[id];
  try { localStorage.setItem(eintragSchluessel(c), JSON.stringify(alle)); }
  catch (e) { return false; }
  return true;
}

/* ---------- Fortschritt ---------- */
/* Station abgeschlossen („Fertig!“): fertig-Zeit und Siegel (Stempel). Das erste Siegel bleibt. */
export function stationFertig(id) {
  const k = S.aktiv();
  if (!k) return false;
  const t = Date.now();
  k.stationen[id] = { fertig: t };
  if (!k.stempel[id]) k.stempel[id] = t;
  return S.speichern();
}

/* Selbsteinschätzung am Modul-Abschluss: „Kann ich!“ (kann) oder „Übe ich noch“ (uebe).
   Der Satztext wird mitgespeichert, damit das Fundbuch ihn auch später so zeigt, wie das Kind ihn gesehen hat. */
export function kannIchSetzen(modulId, satzId, text, wert) {
  const k = S.aktiv();
  if (!k || (wert !== 'kann' && wert !== 'uebe')) return false;
  k.kannIch[modulId] = Object.assign({}, k.kannIch[modulId], { [satzId]: { text: String(text).slice(0, SATZ_MAX), wert, t: Date.now() } });
  return S.speichern();
}

/* Lernzeit gutschreiben (Sekunden je Modul). Gibt zurück, ob gespeichert wurde. */
export function zeitMerken(modulId, sek) {
  const k = S.aktiv();
  const s = Math.round(Number(sek));
  if (!k || !(s > 0)) return false;
  k.zeit[modulId] = (Number(k.zeit[modulId]) || 0) + s;
  return S.speichern();
}

export const zustand = {
  get ladeFehler() { return S.ladeFehler; },
  get letzterFehler() { return S.letzterFehler; }
};
