/* Flaschenpost: eine Station („Brief“) – Etappe 3.
   Ablauf: Brief und „So prüfst du“ (links) | rechts nacheinander: Jetzt du! (Aufgaben mit Kontrolle),
   Neue Wörter, Am Tisch, Mein Eintrag, Fertig! (Siegel ins Fundbuch).
   Je Aufgabe: wählen -> Prüfen. Richtig: Rückmeldung + Erklärung.
   Noch nicht: kurze Rückmeldung, einmal „Noch einmal versuchen“; beim zweiten Mal die Lösung + Erklärung.
   Hilfe-Helfer: Mira gibt gestufte Tipps aus den Daten, keine KI, nie die Lösung.
   Antworten werden nicht gespeichert (Ingo, 11.11.2026), nur fertig, Siegel, Eintrag und Lernzeit. */
import { config as C } from './config.js?v=66';
import * as S from './speicher.js?v=66';
import * as L from './lernzeit.js?v=66';
import { stationen as WER, abschluss as WER_AB } from './daten/wer.js?v=66';
import { stationen as WARUM, abschluss as WARUM_AB } from './daten/warum.js?v=66';
import { stationen as WOHER, abschluss as WOHER_AB } from './daten/woher.js?v=66';

export const STATIONEN = { ...WER, ...WARUM, ...WOHER };
export const ABSCHLUESSE = { [WER_AB.modul]: WER_AB, [WARUM_AB.modul]: WARUM_AB, [WOHER_AB.modul]: WOHER_AB };

/* Sätze eines Briefs, in Lesereihenfolge, mit Absender-Kurzname bei mehreren Nachrichten.
   Ohne Lookbehind im Regex, damit es auch auf älteren iPads läuft. */
export function briefSaetze(brief) {
  const teile = brief.nachrichten
    ? brief.nachrichten.map(n => ({ text: n.text, wer: String(n.absender).split(',')[0].trim() }))
    : [{ text: brief.text, wer: '' }];
  return teile.flatMap(t => (t.text.match(/[^.!?]+[.!?]+[“”"]?/g) || [t.text]).map(x => ({ satz: x.trim(), wer: t.wer })));
}

/* Aufgabenart 'satz' wird zur Auswahl aus den Sätzen des Briefs plus „Hier steht kein Beleg.“ */
const aufbereitet = new WeakMap();
function aufbereiten(a) {
  if (a.art !== 'satz') return a;
  if (!aufbereitet.has(a)) {
    const antworten = briefSaetze(st.brief).map(x => ({
      text: `„${x.satz}“${x.wer ? ` (${x.wer})` : ''}`,
      richtig: x.satz === a.richtigerSatz,
      rueck: a.rueckSatz
    }));
    antworten.push({ text: 'Hier steht kein Beleg.', richtig: a.richtigerSatz === null, rueck: a.rueckKein });
    aufbereitet.set(a, Object.assign({}, a, { art: 'eine', satzwahl: true, antworten }));
  }
  return aufbereitet.get(a);
}
export const gibtStation = id => Object.prototype.hasOwnProperty.call(STATIONEN, id);

const PRUEFFRAGEN = [
  ['Wer sagt das?', 'Schau, ob ein Name, eine Unterschrift oder ein Absender dabeisteht.'],
  ['Warum sagt er das?', 'Was will der Schreiber erreichen?'],
  ['Woher weiß er das?', 'Hat er es selbst gesehen, gelesen oder nur gehört?']
];

/* Formen für die Rückmeldung: gefüllter Kreis mit Haken (stimmt) oder offener Kreis (noch nicht).
   Die Bedeutung trägt immer auch das Wort daneben. */
/* Wachssiegel wie im Fundbuch, für die kleine Größe mit weniger, aber tieferen Zacken (12),
   damit es auch bei 2.5rem als Siegel lesbar ist */
const SIEGEL_24 = (() => {
  const p = [];
  for (let i = 0; i < 24; i++) {
    const w = (Math.PI * i) / 12, r = i % 2 ? 9.6 : 11.9;
    p.push(`${(12 + r * Math.cos(w)).toFixed(2)} ${(12 + r * Math.sin(w)).toFixed(2)}`);
  }
  return 'M' + p.join('L') + 'Z';
})();
const FORM_JA = `<svg class="form" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${SIEGEL_24}" class="form__voll"/><path d="M7.5 12.4l3 3L16.6 9.2" class="form__haken"/></svg>`;
const FORM_NOCH = '<svg class="form" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10.5" class="form__offen"/></svg>';
const HAKEN = '<svg class="marke" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 12.5l4 4L18 8"/></svg>';
/* Kleiner Haken im gewählten Knopf: gewählt ist nicht nur dunkler, sondern auch markiert */
const KNOPF_HAKEN = '<svg class="knopf-haken" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 12.5l4 4L18 8"/></svg>';

let ctx = null;
let id = '';
let st = null;
let aufgaben = [];
let nr = 0;
let versuch = 0;
let imZusatz = false;
let phase = 'aufgaben';   /* aufgaben | aufgaben-fertig | woerter | tisch | eintrag | fertig */
let karte = 0;
let tippStufe = 0;
let geloest = false;   /* Lösung oder Musterlösung steht schon da: keine Tipps mehr */

/* Mira klein (Hilfe-Knopf, Dialog): 160-px-Bild statt 512 */
const miraKlein = klasse => `<picture><source srcset="bilder/mira-160.webp?b=${C.bildStand}" type="image/webp"><img${klasse ? ` class="${klasse}"` : ''} src="bilder/mira-160.jpg?b=${C.bildStand}" alt="" width="160" height="160"></picture>`;

export function stationZeigen(c, stationId) {
  ctx = c;
  id = stationId;
  st = STATIONEN[id];
  aufgaben = st.aufgaben;
  nr = 0; versuch = 0; imZusatz = false; phase = 'aufgaben'; karte = 0;
  const modul = C.module.find(m => m.id === st.modul);
  const modulNr = C.module.indexOf(modul);
  const briefNr = modul.stationen.indexOf(id) + 1;
  const e = ctx.esc;
  const b = st.brief;

  ctx.zeigen(`
    <header class="kopf kopf--brief">
      ${ctx.pfeilKnopf}
      <h1>${e(st.titel)}</h1>
      <p class="kopf__unter">Du übst: ${e(st.uebst)} · <span class="ohne-umbruch">Brief ${briefNr} von ${modul.stationen.length}</span></p>
      <button type="button" class="mira-knopf" data-st="hilfe" aria-haspopup="dialog">${miraKlein('')}<span>Hilfe</span></button>
    </header>
    <div class="brief-raster">
      <div class="brief-raster__links">
        <section class="papier fundstueck" aria-labelledby="h-brief">
          <h2 id="h-brief">Der Brief</h2>
          <p>${e(st.rahmen)}</p>
          ${b.nachrichten ? `<ol class="nachrichten">${b.nachrichten.map((n, i) => `
            <li class="zettel zettel--nachricht"><span class="nachricht__nr" aria-hidden="true">${i + 1}.</span><div><p class="zettel__text">${e(n.text)}</p><p class="zettel__unterschrift">${e(n.absender)}</p></div></li>`).join('')}
          </ol>` : `<div class="zettel">
            ${b.ueberschrift ? `<p class="zettel__kopf">${e(b.ueberschrift)}</p>` : ''}
            <p class="zettel__text">${e(b.text)}</p>
            ${b.unterschrift ? `<p class="zettel__unterschrift">${e(b.unterschrift)}</p>` : ''}
          </div>`}
          <p class="leise">${e(st.hinweisEcht || 'Ausgedacht für diese Übung.')}</p>
        </section>
        <details class="papier so-pruefst"${id === C.module[0].stationen[0] ? ' open' : ''}>
          <summary><h2 id="h-so">So prüfst du</h2></summary>
          <ol class="schritte">${PRUEFFRAGEN.map(([f, t], i) => `<li${i === modulNr ? ' class="schritte__jetzt"' : ''}><b>${f}</b> ${t}${i === modulNr ? ' <span class="leise">(Darum geht es heute.)</span>' : ''}</li>`).join('')}</ol>
        </details>
      </div>
      <section class="papier aufgabe" aria-labelledby="h-du">
        <h2 id="h-du">Jetzt du!</h2>
        <div id="aufgabe-inhalt"></div>
      </section>
    </div>
    <dialog class="dialog hilfe" id="hilfe-dialog" aria-labelledby="hd-titel">
      <div class="hilfe__kopf">${miraKlein('hilfe__mira')}<h2 id="hd-titel">Tipp von ${e(C.maskottchen)}</h2></div>
      <div id="hilfe-text" aria-live="polite"></div>
      <p class="knopfreihe" id="hilfe-knoepfe"></p>
    </dialog>`, st.titel);
  ctx.app.classList.add('seite--brief');
  ctx.adresse('brief/' + id);
  ctx.app.querySelector('#hilfe-dialog').addEventListener('cancel', ev => { ev.preventDefault(); hilfeZu(); });
  ctx.app.querySelector('.so-pruefst').addEventListener('toggle', klebenPruefen);
  aufgabeZeigen(false);
  klebenPruefen();
  /* Mit Ersatzschrift gemessen wäre die Spalte zu kurz: nach dem Laden der Schriften noch einmal */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(klebenPruefen);
  L.starten(st.modul);
}

/* Querformat: Die Briefspalte läuft nur mit, wenn sie ganz auf den Bildschirm passt.
   Sonst (z. B. vier Nachrichten) bliebe ihr unteres Ende unerreichbar, solange sie klebt. */
function klebenPruefen() {
  const l = ctx && ctx.app.querySelector('.brief-raster__links');
  if (!l) return;
  l.classList.remove('brief-raster__links--frei');
  if (l.getBoundingClientRect().height > window.innerHeight - 24) l.classList.add('brief-raster__links--frei');
}
window.addEventListener('resize', () => { if (st && ctx && ctx.app.classList.contains('seite--brief')) klebenPruefen(); });

const inhalt = () => ctx.app.querySelector('#aufgabe-inhalt');
function teilZeigen(titel, html) {
  ctx.app.querySelector('#h-du').textContent = titel;
  inhalt().innerHTML = html;
  ctx.app.querySelector('.aufgabe').scrollIntoView({ block: 'start' });
}

/* ---------- Aufgaben ---------- */
const aktuelle = () => aufbereiten(imZusatz ? st.zusatz : aufgaben[nr]);

function aufgabeZeigen(fokus = true) {
  const a = aktuelle();
  const e = ctx.esc;
  versuch = 0; tippStufe = 0; geloest = false; phase = 'aufgaben';
  ctx.app.querySelector('#h-du').textContent = 'Jetzt du!';
  const stand = imZusatz ? 'Zusatzaufgabe (freiwillig)' : `Aufgabe ${nr + 1} von ${aufgaben.length}`;
  let html = '';
  if (a.einleitung) html += `<p>${e(a.einleitung)}</p>`;
  if (a.zettel) html += `<div class="zettel zettel--klein"><p class="zettel__text">${e(a.zettel.text)}</p>${a.zettel.unterschrift ? `<p class="zettel__unterschrift">${e(a.zettel.unterschrift)}</p>` : ''}</div>`;

  if (a.art === 'merk') {
    html += `
      <p class="frage" id="frage" tabindex="-1">${e(a.frage)}</p>
      <p class="leise">${e(a.hinweis)}</p>
      <p class="knopfreihe"><button type="button" class="knopf haupt" data-st="vergleichen">Vergleichen</button></p>
      <div id="rueck" class="rueck" tabindex="-1"></div>`;
  } else {
    const typ = a.art === 'mehrere' ? 'checkbox' : 'radio';
    html += `
      <form id="aufgabe-form" class="wahl-form${a.satzwahl ? ' wahl-form--saetze' : ''}" novalidate>
        <fieldset>
          <legend class="frage" id="frage" tabindex="-1">${e(a.frage)}</legend>
          <div class="antworten">${a.antworten.map((x, i) => `
            <label class="antwort"><input type="${typ}" name="antwort" value="${i}"><span class="antwort__text">${e(x.text)}</span></label>`).join('')}
          </div>
        </fieldset>
        <p class="knopfreihe"><button type="submit" class="knopf haupt" data-st="pruefen" disabled>Prüfen</button></p>
      </form>
      <div id="rueck" class="rueck" tabindex="-1"></div>`;
  }
  html += `<p class="leise aufgabe__stand">${stand}</p>`;
  if (nr > 0 || imZusatz) html += `<p class="aufgabe__vorn"><button type="button" class="textknopf" data-st="vorn">Von vorn anfangen</button></p>`;
  inhalt().innerHTML = html;
  if (fokus) {
    /* Neue Aufgabe zeigen. Passen Frage, Antworten und „Prüfen“ samt Kopf (Zurück, Mira-Hilfe) auf den Bildschirm,
       nach ganz oben; sonst „Jetzt du!“ an den oberen Rand (z. B. Hochformat, wo der Brief darüber steht) */
    const auf = ctx.app.querySelector('.aufgabe');
    const ende = ctx.app.querySelector('[data-st="pruefen"], [data-st="vergleichen"]') || auf;
    if (ende.getBoundingClientRect().bottom + window.scrollY + 16 <= window.innerHeight) window.scrollTo(0, 0);
    else auf.scrollIntoView({ block: 'start' });
    ctx.app.querySelector('#frage').focus({ preventScroll: true });
  }
}

function gewaehlt() {
  return [...ctx.app.querySelectorAll('#aufgabe-form input:checked')].map(i => Number(i.value));
}

function pruefen() {
  const a = aktuelle();
  const wahl = gewaehlt();
  if (!wahl.length) return;
  const soll = a.antworten.map((x, i) => (x.richtig ? i : -1)).filter(i => i >= 0);
  const stimmt = wahl.length === soll.length && soll.every(i => wahl.includes(i));
  versuch++;
  if (stimmt) return loesungZeigen(true);
  if (versuch >= 2) return loesungZeigen(false);
  const rueck = a.art === 'mehrere' ? a.nochNichtText : (a.antworten[wahl[0]].rueck || '');
  rueckmelden(false, `<p><b>Das stimmt noch nicht ganz.</b> ${ctx.esc(rueck)}</p>
    <p class="knopfreihe"><button type="button" class="knopf haupt" data-st="nochmal">Noch einmal versuchen</button></p>`,
  'Das stimmt noch nicht ganz. ' + rueck);
  sperren(true);
}

function loesungZeigen(warRichtig) {
  const a = aktuelle();
  geloest = true;
  sperren(true);
  ctx.app.querySelectorAll('#aufgabe-form .antwort').forEach((l, i) => {
    if (a.antworten[i].richtig) {
      l.classList.add('antwort--richtig');
      l.insertAdjacentHTML('beforeend', `${HAKEN}<span class="nurvorlesen"> (richtige Antwort)</span>`);
    }
  });
  const kopf = warRichtig
    ? `<p><b>Das stimmt.</b> ${ctx.esc(a.richtigText || '')}</p>`
    : `<p><b>Hier ist die Lösung.</b> ${a.art === 'mehrere' ? 'Die richtigen Antworten haben einen Haken.' : 'Die richtige Antwort ist mit einem Haken markiert.'}</p>`;
  rueckmelden(warRichtig, `${kopf}<p>${ctx.esc(a.erklaerung)}</p>${weiterKnopf()}`,
    (warRichtig ? 'Das stimmt. ' : 'Hier ist die Lösung. ') + a.erklaerung);
}

function vergleichen() {
  const a = aktuelle();
  versuch++;
  geloest = true;
  ctx.app.querySelector('[data-st="vergleichen"]').closest('.knopfreihe').remove();
  rueckmelden(null, `<p><b>So könnte die Antwort lauten:</b></p>
    <p class="muster">${ctx.esc(a.muster)}</p>
    <p>Wie war deine Antwort?</p>
    <p class="knopfreihe"><button type="button" class="knopf" data-st="selbst" data-wert="ja" aria-pressed="false">${KNOPF_HAKEN}${ctx.esc(a.selbst.ja.knopf)}</button><button type="button" class="knopf" data-st="selbst" data-wert="nein" aria-pressed="false">${KNOPF_HAKEN}${ctx.esc(a.selbst.nein.knopf)}</button></p>`,
  'So könnte die Antwort lauten: ' + a.muster);
}

function selbst(wert) {
  const a = aktuelle();
  const s = a.selbst[wert];
  ctx.app.querySelectorAll('[data-st="selbst"]').forEach(k => {
    k.disabled = true; k.setAttribute('aria-pressed', String(k.dataset.wert === wert));
  });
  const rueck = ctx.app.querySelector('#rueck');
  rueck.querySelector('.rueck__text').insertAdjacentHTML('beforeend', `<div class="rueck__nachtrag"><p><b>${ctx.esc(s.rueck)}</b></p><p>${ctx.esc(a.erklaerung)}</p>${weiterKnopf()}</div>`);
  ctx.ansagen(s.rueck + ' ' + a.erklaerung);
  rueck.querySelector('[data-st="weiter"]').focus();
}

function weiterKnopf() {
  const letzte = imZusatz || nr === aufgaben.length - 1;
  return `<p class="knopfreihe"><button type="button" class="knopf haupt" data-st="weiter">${letzte ? 'Fertig mit den Aufgaben' : 'Weiter'}</button></p>`;
}

/* Rückmeldung zeigen: Form + Wort, Fokus auf den Bereich, Ansage für Screenreader */
function rueckmelden(richtig, html, ansage) {
  const r = ctx.app.querySelector('#rueck');
  const form = richtig === true ? FORM_JA : richtig === false ? FORM_NOCH : '';
  r.className = 'rueck rueck--sichtbar' + (richtig === true ? ' rueck--ja' : richtig === false ? ' rueck--noch' : '');
  r.innerHTML = `${form ? `<div class="rueck__form">${form}</div>` : ''}<div class="rueck__text">${html}</div>`;
  ctx.ansagen(ansage);
  r.focus({ preventScroll: true });
  /* ganz ins Bild holen, auch den Knopf darunter (Querformat: sonst knapp unter dem Rand) */
  r.scrollIntoView({ block: 'nearest' });
}

function sperren(an) {
  ctx.app.querySelectorAll('#aufgabe-form input').forEach(i => { i.disabled = an; });
  const p = ctx.app.querySelector('[data-st="pruefen"]');
  if (p) { p.disabled = an || !gewaehlt().length; p.closest('.knopfreihe').hidden = an; }
}

function nochmal() {
  const r = ctx.app.querySelector('#rueck');
  r.className = 'rueck'; r.innerHTML = '';
  ctx.app.querySelectorAll('#aufgabe-form input').forEach(i => { i.checked = false; });
  sperren(false);
  ctx.app.querySelector('#frage').focus();
}

function weiter() {
  if (!imZusatz && nr < aufgaben.length - 1) { nr++; return aufgabeZeigen(); }
  abschluss();
}

/* Nach den Aufgaben: Zusatzaufgabe anbieten, dann weiter zu den Wörtern */
function abschluss() {
  const zusatzOffen = st.zusatz && !imZusatz;
  phase = 'aufgaben-fertig';
  inhalt().innerHTML = `
    <p class="frage" id="frage" tabindex="-1">Du hast alle Aufgaben geschafft.</p>
    ${zusatzOffen ? '<p>Möchtest du noch eine Zusatzaufgabe? Sie ist freiwillig.</p>' : ''}
    <p class="knopfreihe">
      ${zusatzOffen ? '<button type="button" class="knopf" data-st="zusatz">Zusatzaufgabe</button>' : ''}
      <button type="button" class="knopf haupt" data-st="woerter">Weiter</button>
    </p>
    <p class="aufgabe__vorn"><button type="button" class="textknopf" data-st="vorn">Aufgaben von vorn anfangen</button></p>`;
  ctx.app.querySelector('#frage').focus();
}

/* ---------- Neue Wörter: Karten zum Durchtippen ---------- */
function woerterZeigen() {
  phase = 'woerter';
  const w = st.woerter[karte];
  const e = ctx.esc;
  const n = st.woerter.length;
  teilZeigen('Neue Wörter', `
    <div class="wortkarte" id="wortkarte" tabindex="-1" aria-live="polite">
      <h3 class="wortkarte__wort">${e(w.wort)}</h3>
      <p>${e(w.erklaerung)}</p>
      <p><b>Beispiel:</b> ${e(w.beispiel)}</p>
      ${w.zeile ? `<p class="wortkarte__zeile">${e(w.zeile)}</p>` : ''}
      <p class="leise wortkarte__stand">Karte ${karte + 1} von ${n}</p>
    </div>
    <p class="knopfreihe">
      <button type="button" class="knopf" data-st="karte" data-schritt="-1"${karte === 0 ? ' disabled' : ''}>Zurück</button>
      ${karte < n - 1
        ? '<button type="button" class="knopf haupt" data-st="karte" data-schritt="1">Nächste Karte</button>'
        : '<button type="button" class="knopf haupt" data-st="tisch">Weiter</button>'}
    </p>`);
  ctx.app.querySelector('#wortkarte').focus({ preventScroll: true });
}

/* ---------- Am Tisch ---------- */
function tischZeigen() {
  phase = 'tisch';
  const t = st.amTisch;
  teilZeigen('Am Tisch', `
    <p id="tisch-start" tabindex="-1">Das machst du ohne iPad. Du brauchst: <b>${ctx.esc(t.material)}</b>.</p>
    <ol class="schritte">${t.schritte.map(s => `<li>${ctx.esc(s)}</li>`).join('')}</ol>
    <p class="knopfreihe"><button type="button" class="knopf haupt" data-st="eintrag">Weiter</button></p>`);
  ctx.app.querySelector('#tisch-start').focus({ preventScroll: true });
}

/* ---------- Mein Eintrag und Fertig! ---------- */
function eintragZeigen() {
  phase = 'eintrag';
  const k = S.aktiv();
  const alt = k && k.eintraege[id] ? k.eintraege[id].text : '';
  teilZeigen('Mein Eintrag', `
    <label for="eintrag-feld" class="eintrag__frage">${ctx.esc(st.eintrag.frage)}</label>
    <p class="leise" id="eintrag-hinweis">Schreib keine echten Namen, keine Adressen und nichts, was nur dich etwas angeht. Du kannst das Feld auch leer lassen.</p>
    <textarea id="eintrag-feld" class="eintrag__feld" rows="5" maxlength="${S.EINTRAG_MAX}" aria-describedby="eintrag-hinweis">${ctx.esc(alt)}</textarea>
    <p class="knopfreihe"><button type="button" class="knopf haupt" data-st="fertig">Fertig!</button></p>`);
  /* Fokus auf die Überschrift, nicht ins Feld: sonst springt am iPad sofort die Tastatur auf */
  const h = ctx.app.querySelector('#h-du');
  h.tabIndex = -1;
  h.focus({ preventScroll: true });
}

let eintragFehlerGemeldet = false;
function eintragMerken(text) {
  if (!S.eintragSetzen(id, text) && !eintragFehlerGemeldet) { eintragFehlerGemeldet = true; ctx.melden(ctx.speicherFehlt); }
}

function fertig() {
  const feld = ctx.app.querySelector('#eintrag-feld');
  if (feld) eintragMerken(feld.value);
  L.beenden();
  const ok = S.stationFertig(id);
  phase = 'fertig';
  const modul = C.module.find(m => m.id === st.modul);
  const nrImModul = modul.stationen.indexOf(id) + 1;
  const k = S.aktiv();
  const modulFertig = k && modul.stationen.every(x => k.stationen[x] && k.stationen[x].fertig);
  const ab = modulFertig ? ABSCHLUESSE[modul.id] : null;
  if (ab) phase = 'abschluss';
  const naechster = k && C.module.flatMap(m => m.stationen).find(x => STATIONEN[x] && !(k.stationen[x] && k.stationen[x].fertig));
  teilZeigen(ab ? 'Thema geschafft!' : 'Fertig!', `
    <div class="fertig" id="fertig" tabindex="-1">
      ${ctx.siegel(nrImModul, true)}
      <p class="frage">Du hast den Brief geprüft.</p>
      <p>Dein Siegel liegt jetzt in deinem Fundbuch.</p>
    </div>
    ${ab ? abschlussHtml(modul, ab, k) : ''}
    ${naechster ? `<p class="knopfreihe knopfreihe--mitte"><button type="button" class="knopf haupt" data-aktion="brief" data-id="${ctx.esc(naechster)}">Nächster Brief</button></p>` : ''}
    <p class="knopfreihe knopfreihe--mitte${naechster ? ' knopfreihe--neben' : ''}">
      <button type="button" class="knopf${naechster ? '' : ' haupt'}" data-aktion="start">Zur Startseite</button>
      <button type="button" class="knopf" data-aktion="fundbuch">Zum Fundbuch</button>
    </p>`);
  ctx.app.querySelector('#fertig').focus({ preventScroll: true });
  ctx.ansagen('Du hast den Brief geprüft. Dein Siegel liegt jetzt in deinem Fundbuch.');
  if (!ok) ctx.melden(ctx.speicherFehlt);
}

/* ---------- Modul-Abschluss: Ich-weiß-Sätze mit „Kann ich!“ / „Übe ich noch“ ---------- */
function abschlussHtml(modul, ab, k) {
  const e = ctx.esc;
  const alt = (k && k.kannIch[modul.id]) || {};
  return `
    <section class="abschluss" aria-labelledby="h-abschluss">
      <p class="abschluss__flaschen" aria-hidden="true">${modul.stationen.map(() => ctx.flasche(true)).join('')}</p>
      <h3 id="h-abschluss">Das hast du im Thema „${e(modul.titel)}“ geübt</h3>
      <p>Tippe bei jedem Satz an, wie gut du ihn schon kannst. Beides ist in Ordnung.</p>
      <ul class="saetze">${ab.saetze.map(x => {
        const w = alt[x.id] && alt[x.id].wert;
        return `<li class="satz" id="satz-${e(x.id)}">
          <p class="satz__text">${e(x.text)}</p>
          <p class="knopfreihe" role="group" aria-label="${e(x.text)}">
            <button type="button" class="knopf" data-st="kann" data-satz="${e(x.id)}" data-wert="kann" aria-pressed="${w === 'kann'}">${KNOPF_HAKEN}Kann ich!</button>
            <button type="button" class="knopf" data-st="kann" data-satz="${e(x.id)}" data-wert="uebe" aria-pressed="${w === 'uebe'}">${KNOPF_HAKEN}Übe ich noch</button>
          </p>
        </li>`;
      }).join('')}</ul>
      <p class="leise">Im Fundbuch siehst du später, was du schon kannst und was du noch übst.</p>
      ${ab.bruecke ? `<div class="bruecke">
        <p>${e(ab.bruecke.text)}</p>
        <p class="knopfreihe"><a class="knopf" href="${e(ab.bruecke.url)}" target="_blank" rel="noopener noreferrer">${e(ab.bruecke.linkText)}</a></p>
        <p class="leise">${e(ab.bruecke.hinweis)}</p>
      </div>` : ''}
    </section>`;
}

function kannSetzen(knopf) {
  const ab = ABSCHLUESSE[st.modul];
  const satz = ab && ab.saetze.find(x => x.id === knopf.dataset.satz);
  if (!satz) return;
  const wert = knopf.dataset.wert;
  const ok = S.kannIchSetzen(st.modul, satz.id, satz.text, wert);
  knopf.closest('.knopfreihe').querySelectorAll('[data-st="kann"]').forEach(b => b.setAttribute('aria-pressed', String(b === knopf)));
  ctx.ansagen(wert === 'kann' ? 'Kann ich. Gespeichert.' : 'Übe ich noch. Gespeichert.');
  if (!ok) ctx.melden(ctx.speicherFehlt);
}

/* ---------- Hilfe-Helfer ---------- */
/* Welche Tipps gibt es gerade? Bei drei oder mehr Tipps kommt der letzte erst nach einem Versuch. */
function tippsJetzt() {
  if (phase !== 'aufgaben' || geloest) return null;
  const t = aktuelle().tipps || [];
  return t.length >= 3 && versuch === 0 ? t.slice(0, -1) : t;
}
const ALLGEMEIN = {
  geloest: 'Die Antwort steht schon da. Lies die Erklärung in Ruhe. Dann tippe auf „Weiter“.',
  'aufgaben-fertig': 'Du hast alle Aufgaben geschafft. Tippe auf „Weiter“. Die Zusatzaufgabe ist freiwillig.',
  woerter: 'Lies die Karte in Ruhe. Mit „Nächste Karte“ und „Zurück“ kannst du blättern.',
  tisch: 'Diese Aufgabe machst du mit Papier und Stift. Frag deine Lehrerin oder deinen Lehrer, wann ihr sie macht.',
  eintrag: 'Schreib auf, was dir heute aufgefallen ist. Ein Satz reicht. Du kannst das Feld auch leer lassen.',
  fertig: 'Gut gemacht. Im Fundbuch siehst du dein Siegel.',
  abschluss: 'Tippe bei jedem Satz an, ob du ihn schon kannst oder noch übst. Beides ist richtig. Es gibt dafür keine Punkte.'
};

function hilfeAuf() {
  const d = ctx.app.querySelector('#hilfe-dialog');
  if (tippsJetzt() && tippStufe === 0) tippStufe = 1;
  hilfeFuellen();
  if (typeof d.showModal === 'function' && !d.open) d.showModal();
  d.querySelector('[data-st="hilfe-zu"]').focus();
}

function hilfeFuellen() {
  const t = tippsJetzt();
  const text = ctx.app.querySelector('#hilfe-text');
  const knoepfe = ctx.app.querySelector('#hilfe-knoepfe');
  const e = ctx.esc;
  if (!t) {
    const schluessel = phase === 'aufgaben' && geloest ? 'geloest' : phase;
    text.innerHTML = `<p>${e(ALLGEMEIN[schluessel] || ALLGEMEIN.eintrag)}</p>`;
    knoepfe.innerHTML = '<button type="button" class="knopf haupt" data-st="hilfe-zu">Danke!</button>';
    return;
  }
  const sichtbar = t.slice(0, Math.min(tippStufe, t.length));
  const wartet = aktuelle().tipps.length > t.length && tippStufe >= t.length;
  text.innerHTML = `<ol class="tipps">${sichtbar.map(x => `<li>${e(x)}</li>`).join('')}</ol>
    ${wartet ? '<p class="leise">Probier es erst einmal. Danach habe ich noch einen Tipp für dich.</p>' : ''}`;
  knoepfe.innerHTML = `${tippStufe < t.length ? '<button type="button" class="knopf" data-st="noch-tipp">Noch ein Tipp</button>' : ''}
    <button type="button" class="knopf haupt" data-st="hilfe-zu">Ich probiere es</button>`;
}

function nochTipp() {
  tippStufe++;
  hilfeFuellen();
  const t = tippsJetzt();
  ctx.ansagen(t[Math.min(tippStufe, t.length) - 1]);
  ctx.app.querySelector('#hilfe-dialog [data-st="hilfe-zu"]').focus();
}

function hilfeZu() {
  const d = ctx.app.querySelector('#hilfe-dialog');
  if (d && d.open) d.close();
  const k = ctx.app.querySelector('[data-st="hilfe"]');
  if (k) k.focus();
}

/* ---------- Bedienung (nur innerhalb einer Station) ---------- */
export function bedienen(e) {
  if (!st || !ctx.app.classList.contains('seite--brief')) return false;
  if (e.type === 'change' && e.target.closest('#aufgabe-form')) { sperren(false); return true; }
  if (e.type === 'input' && e.target.id === 'eintrag-feld') { eintragMerken(e.target.value); return true; }
  if (e.type === 'submit' && e.target.id === 'aufgabe-form') { e.preventDefault(); pruefen(); return true; }
  if (e.type !== 'click') return false;
  const k = e.target.closest('[data-st]');
  if (!k || k.disabled) return false;
  const a = k.dataset.st;
  if (a === 'pruefen') return false;           /* läuft über submit */
  if (a === 'nochmal') nochmal();
  else if (a === 'weiter') weiter();
  else if (a === 'vergleichen') vergleichen();
  else if (a === 'selbst') selbst(k.dataset.wert);
  else if (a === 'vorn') { nr = 0; imZusatz = false; aufgabeZeigen(); }
  else if (a === 'zusatz') { imZusatz = true; aufgabeZeigen(); }
  else if (a === 'woerter') { karte = 0; woerterZeigen(); }
  else if (a === 'karte') { karte = Math.max(0, Math.min(st.woerter.length - 1, karte + Number(k.dataset.schritt))); woerterZeigen(); }
  else if (a === 'tisch') tischZeigen();
  else if (a === 'eintrag') eintragZeigen();
  else if (a === 'fertig') fertig();
  else if (a === 'hilfe') hilfeAuf();
  else if (a === 'noch-tipp') nochTipp();
  else if (a === 'hilfe-zu') hilfeZu();
  else if (a === 'kann') kannSetzen(k);
  return true;
}
