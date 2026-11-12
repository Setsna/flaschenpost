/* Flaschenpost: Ansichten und Bedienung (Stand Etappe 1c).
   Willkommen, Kindwahl, Startseite „Nächster Brief“, Neu anfangen.
   Briefe (Stationen) und Fundbuch folgen ab Etappe 2. */
import { config as C } from './config.js?v=66';
import * as S from './speicher.js?v=66';
import * as L from './lernzeit.js?v=66';
import { stationZeigen, gibtStation, bedienen, STATIONEN, ABSCHLUESSE } from './station.js?v=66';
import { urkundeAnbieten, urkundeTeilen } from './urkunde.js?v=66';
import { eltern as ELTERN, lehrkraefte as LEHRKRAEFTE } from './daten/erwachsene.js?v=66';

const app = document.getElementById('app');
const meldung = document.getElementById('meldung');
const live = document.getElementById('live');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Sichtbare Meldung unten, wird von Screenreadern angesagt (role=status). */
let meldungUhr = 0;
function melden(text) {
  clearTimeout(meldungUhr);
  meldung.textContent = '';
  if (!text) return;
  setTimeout(() => { meldung.textContent = text; }, 30);
  /* Kurze Hinweise gehen nach einer Weile von selbst; Fehler bleiben stehen */
  if (text.length < 80) meldungUhr = setTimeout(() => { meldung.textContent = ''; }, 9000);
}
/* Nur für Screenreader (Rückmeldungen ab Etappe 3) */
export function ansagen(text) {
  live.textContent = '';
  setTimeout(() => { live.textContent = text; }, 30);
}
const SPEICHER_FEHLT = 'Dein Stand konnte gerade nicht gespeichert werden. Vielleicht ist der Speicher voll oder ausgeschaltet. Bitte sag deiner Lehrkraft Bescheid.';
const LADEN_FEHLT = 'Der gespeicherte Stand auf diesem Gerät konnte nicht gelesen werden. Damit nichts verloren geht, speichert die Seite gerade nichts. Bitte sag deiner Lehrkraft Bescheid.';

/* ---------- Ansichten ---------- */
let ersterAufruf = true;
function zeigen(html, titel) {
  L.beenden();  /* Lernzeit läuft nur in einer offenen Station */
  melden('');
  app.className = 'seite';
  app.innerHTML = html;
  document.title = titel ? `${titel} – ${C.name}` : C.name;
  const h1 = app.querySelector('h1');
  if (h1 && !ersterAufruf) { h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
  ersterAufruf = false;
  window.scrollTo(0, 0);
}

const WELLE = '<svg class="welle" viewBox="0 0 62 14" aria-hidden="true" focusable="false"><path d="M2 5c5-4 9-4 14 0s9 4 14 0 9-4 14 0 9 4 14 0M10 11c4-3 8-3 12 0s8 3 12 0 8-3 12 0" fill="none" stroke-width="1.6" stroke-linecap="round"/></svg>';
const MIRA = `<picture><source srcset="bilder/mira-512.webp?b=${C.bildStand}" type="image/webp"><img class="mira" src="bilder/mira-512.jpg?b=${C.bildStand}" alt="Mira, ein goldenes Seepferdchen, hält eine Flasche mit einem Brief darin." width="512" height="512"></picture>`;

function kopf(titel, mitMira = false) {
  return `<header class="kopf">
      <a class="wortmarke" href="./">${esc(C.name)}${WELLE}</a>
      <h1>${titel}</h1>
      ${mitMira ? MIRA : ''}
    </header>`;
}

function ansichtNeu() {
  const andere = S.alleKinder().length > 0;
  zeigen(`
    ${kopf(andere ? 'Neues Kind' : 'Wer hat das geschrieben?', !andere)}
    <section class="papier" aria-labelledby="h-neu">
      ${andere ? '' : `<p>Ich bin ${esc(C.maskottchen)}. Ich sammle Flaschenpost. Bei jedem Brief fragen wir zusammen: Wer hat das geschrieben? Warum? Und woher weiß er das?</p>`}
      <h2 id="h-neu">Wie heißt du?</h2>
      <form id="neu-form" novalidate>
        <label for="name">Dein Vorname</label>
        <input type="text" id="name" name="name" autocomplete="off" autocapitalize="words" spellcheck="false" maxlength="${C.nameMaxLaenge}" aria-describedby="name-hinweis name-info">
        <p id="name-hinweis" class="hinweis-feld" aria-live="polite"></p>
        <p class="knopfreihe">
          <button type="submit" class="knopf haupt">Los geht’s</button>
          ${andere ? '<button type="button" class="knopf leise-knopf" data-aktion="wer">Zurück</button>' : ''}
        </p>
      </form>
      <p id="name-info" class="leise">Dein Name bleibt nur auf diesem Gerät.</p>
    </section>
    ${andere ? '' : erwachsene()}`, andere ? 'Neues Kind' : '');
  app.querySelector('#neu-form').addEventListener('submit', e => {
    e.preventDefault();
    const feld = app.querySelector('#name');
    const r = S.anlegen(feld.value);
    app.querySelector('#name-hinweis').textContent = '';
    if (!r.kind) {
      app.querySelector('#name-hinweis').textContent = r.grund;
      feld.focus();
      return;
    }
    ansichtStart();
    if (!r.ok) melden(S.zustand.ladeFehler ? LADEN_FEHLT : SPEICHER_FEHLT);
  });
}

function ansichtWer() {
  const liste = S.alleKinder().map(k => `<li><button type="button" class="knopf" data-aktion="waehlen" data-id="${esc(k.id)}">${esc(k.name)}</button></li>`).join('');
  zeigen(`
    ${kopf('Wer arbeitet heute?')}
    <section class="papier" aria-labelledby="h-namen">
      <h2 id="h-namen">Tippe auf deinen Namen.</h2>
      <ul class="kinder-liste">${liste}</ul>
      <p class="knopfreihe"><button type="button" class="knopf leise-knopf" data-aktion="neu">Ich bin neu hier</button></p>
    </section>
    ${erwachsene()}`, 'Wer arbeitet heute?');
}

/* Eine Flasche je Station: leer (offen) oder mit gerolltem Brief und Siegel (fertig).
   Der Unterschied liegt in der Form, nicht in der Farbe. */
const FLASCHE = fertig => `<svg class="flasche${fertig ? ' flasche--voll' : ''}" viewBox="0 0 24 44" aria-hidden="true" focusable="false">
    <path class="flasche__glas" d="M9.5 6v5.5c0 2.2-5.5 3.6-5.5 8V39a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V19.5c0-4.4-5.5-5.8-5.5-8V6"/>
    <rect class="flasche__korken" x="8.5" y="1.5" width="7" height="4.5" rx="1"/>
    ${fertig ? '<rect class="flasche__brief" x="8" y="21" width="8" height="16" rx="1.6"/><circle class="flasche__siegel" cx="12" cy="29" r="2.6"/>' : ''}
  </svg>`;

/* Adresse in der Leiste mitführen (#fundbuch, #brief/wer-1), damit Neuladen dort bleibt */
function adresse(h) {
  try { history.replaceState(null, '', location.pathname + location.search + (h ? '#' + h : '')); } catch (e) { /* egal */ }
}
const PFEIL = '<button type="button" class="pfeil-knopf" data-aktion="start" aria-label="Zurück zur Startseite"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
/* Was eine Station von der App braucht */
const ctx = { app, zeigen: (h, t) => zeigen(h, t), esc, melden: t => melden(t), ansagen: t => ansagen(t), adresse, pfeilKnopf: PFEIL,
  siegel: (nr, fertig) => SIEGEL(nr, fertig), flasche: fertig => FLASCHE(fertig), speicherFehlt: SPEICHER_FEHLT };

/* Knopf-Ziel: offene Station, wenn es sie schon gibt, sonst „noch unterwegs“ */
const briefZiel = id => (id && gibtStation(id) ? `data-aktion="brief" data-id="${esc(id)}"` : 'data-aktion="unterwegs"');

/* Der nächste offene Brief: erste Station, die noch nicht fertig ist */
function naechsterBrief(k) {
  for (const m of C.module) {
    const i = m.stationen.findIndex(id => !(k.stationen[id] && k.stationen[id].fertig));
    if (i >= 0) return { modul: m, nr: i + 1, id: m.stationen[i] };
  }
  return null;
}

const UNTERWEGS = 'Dieser Brief ist noch unterwegs. Er kommt bald.';

function ansichtStart() {
  const k = S.aktiv();
  const mehrere = S.alleKinder().length > 1;
  const naechster = naechsterBrief(k);
  const fenster = C.module.map(m => {
    const fertig = m.stationen.filter(id => k.stationen[id] && k.stationen[id].fertig).length;
    const offen = m.stationen.find(id => !(k.stationen[id] && k.stationen[id].fertig)) || m.stationen[0];
    return `<li><button type="button" class="fenster" ${briefZiel(offen)}>
        <span class="fenster__name">${esc(m.titel)}</span>
        <span class="fenster__kurz">${esc(m.kurz)}</span>
        <span class="flaschen">${m.stationen.map((_, i) => FLASCHE(i < fertig)).join('')}</span>
        <span class="nurvorlesen">${fertig} von ${m.stationen.length} Briefen geprüft</span>
      </button></li>`;
  }).join('');
  zeigen(`
    ${kopf(`Hallo, ${esc(k.name)}!`)}
    <section class="papier brief" aria-labelledby="h-naechster">
      ${MIRA}
      <h2 id="h-naechster">${naechster ? 'Dein nächster Brief' : 'Alle Briefe geprüft'}</h2>
      <div class="brief__text">
        ${naechster ? `
        <p>${esc(naechster.modul.lockt)}</p>
        <p class="leise brief__meta">${esc(naechster.modul.titel)} · Brief ${naechster.nr} von ${naechster.modul.stationen.length}</p>
        <p class="knopfreihe"><button type="button" class="knopf haupt" ${briefZiel(naechster.id)}>Brief öffnen</button></p>` : `
        <p>Du hast jede Flasche geöffnet und jeden Brief geprüft. In deinem Fundbuch wartet deine Urkunde.</p>
        <p class="knopfreihe"><button type="button" class="knopf haupt" data-aktion="zur-urkunde">Zur Urkunde</button></p>`}
        <p class="leise">Alle Briefe sind ausgedacht, nur zum Üben.</p>
      </div>
    </section>
    <section class="alle" aria-labelledby="h-alle">
      <h2 id="h-alle">Alle Briefe</h2>
      <ul class="fenster-liste">${fenster}</ul>
    </section>
    <nav class="wahl" aria-label="Mehr">
      <button type="button" class="knopf glas-knopf" data-aktion="fundbuch">Mein Fundbuch</button>
      ${S.istVorschau ? '' : `${mehrere ? '<button type="button" class="knopf glas-knopf" data-aktion="wer">Kind wechseln</button>' : ''}
      <button type="button" class="knopf glas-knopf" data-aktion="neu">Neues Kind</button>`}
    </nav>
    ${S.istVorschau ? '<p class="vorschau-satz">In der Vorschau wird nichts gespeichert und nichts gelöscht.</p>' : ''}
    ${erwachsene()}`, `Hallo, ${k.name}`);
  app.classList.add('seite--start');
  adresse('');
}

/* ---------- Fundbuch ---------- */

/* Wachssiegel mit Brief-Nummer (fertig) oder gestrichelter leerer Platz (offen).
   Der Unterschied liegt in der Form: gewellter, gefüllter Rand gegen dünne gestrichelte Linie. */
const SIEGEL_RAND = (() => {
  const zacken = 18, punkte = [];
  for (let i = 0; i < zacken * 2; i++) {
    const w = (Math.PI * i) / zacken, r = i % 2 ? 21.5 : 23.5;
    punkte.push(`${(24 + r * Math.cos(w)).toFixed(2)} ${(24 + r * Math.sin(w)).toFixed(2)}`);
  }
  return 'M' + punkte.join('L') + 'Z';
})();
const SIEGEL = (nr, fertig) => fertig
  ? `<svg class="siegel" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path class="siegel__wachs" d="${SIEGEL_RAND}"/><circle class="siegel__ring" cx="24" cy="24" r="16"/><text class="siegel__nr" x="24" y="30.5" text-anchor="middle">${nr}</text></svg>`
  : `<svg class="siegel siegel--offen" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle class="siegel__platz" cx="24" cy="24" r="21"/><text class="siegel__nr" x="24" y="30.5" text-anchor="middle">${nr}</text></svg>`;

const datum = t => new Date(t).toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });

/* Lernzeit lesbar machen: "unter 1 Minute", "12 Minuten", "1 Stunde 5 Minuten" (Muster Zahlenschwarm) */
function zeitText(sek) {
  const min = Math.floor((Number(sek) || 0) / 60);
  if (min < 1) return 'unter 1 Minute';
  const m = n => `${n} ${n === 1 ? 'Minute' : 'Minuten'}`;
  if (min < 60) return m(min);
  const h = Math.floor(min / 60);
  return `${h} ${h === 1 ? 'Stunde' : 'Stunden'}${min % 60 ? ' ' + m(min % 60) : ''}`;
}

/* Station-Id zu „Wer sagt das? · Brief 1“ (eigene Titel bekommen die Briefe ab Etappe 3) */
function briefName(id) {
  for (const m of C.module) {
    const i = m.stationen.indexOf(id);
    if (i >= 0) return `${m.titel} · ${gibtStation(id) ? STATIONEN[id].titel : `Brief ${i + 1}`}`;
  }
  return id;
}

function eintragListe(k) {
  return C.module.flatMap(m => m.stationen)
    .filter(id => k.eintraege[id] && String(k.eintraege[id].text || '').trim())
    .map(id => ({ titel: briefName(id), text: String(k.eintraege[id].text).trim(), t: k.eintraege[id].t }));
}

function ansichtFundbuch() {
  const k = S.aktiv();
  const briefe = C.module.map(m => `
      <h3>${esc(m.titel)}</h3>
      <ul class="siegel-liste">${m.stationen.map((id, i) => {
        const t = k.stempel[id];
        return `<li class="siegel-zeile">${SIEGEL(i + 1, !!t)}<span><span class="siegel-zeile__name">${gibtStation(id) ? esc(STATIONEN[id].titel) : `Brief ${i + 1}`}</span><span class="leise">${t ? `Geprüft am <span class="ohne-umbruch">${datum(t)}</span>` : 'Noch nicht geprüft'}</span></span></li>`;
      }).join('')}</ul>`).join('');

  const zeiten = C.module.filter(m => Number(k.zeit[m.id]) > 0);
  const lernzeit = zeiten.length
    ? `<ul class="zeit-liste">${zeiten.map(m => `<li><span>${esc(m.titel)}</span><span>${zeitText(k.zeit[m.id])}</span></li>`).join('')}</ul>`
    : '<p>Noch keine Lernzeit. Sie zählt, sobald du einen Brief öffnest.</p>';

  const saetze = C.module.flatMap(m => Object.values(k.kannIch[m.id] || {}));
  const kann = saetze.filter(s => s.wert === 'kann');
  const uebe = saetze.filter(s => s.wert === 'uebe');
  /* „Kann ich“ und „Übe ich noch“ sind zwei gleichrangige Blätter; das zweite nur, wenn es Sätze hat */
  const satzListe = liste => `<ul class="satz-liste">${liste.map(s => `<li>${esc(s.text)}</li>`).join('')}</ul>`;
  const kannTeil = kann.length ? satzListe(kann)
    : uebe.length ? '<p>Noch kein Satz. Was du schon sicher kannst, kommt hierher.</p>'
    : '<p>Wenn du ein Thema fertig hast, steht hier, was du schon kannst.</p>';
  const uebeBlatt = uebe.length
    ? `<section class="papier buch" aria-labelledby="h-uebe"><h2 id="h-uebe">Das übe ich noch</h2>${satzListe(uebe)}</section>` : '';

  const eintraege = eintragListe(k);
  /* Nur „Teilen“ (Teilen-Menü des Geräts). „Alles kopieren“ gibt es nicht mehr (Ingo, 11.11.2026). */
  const eintragTeil = eintraege.length
    ? `<ul class="eintrag-liste">${eintraege.map(e => `<li><p class="eintrag-liste__text">${esc(e.text)}</p><p class="leise eintrag-liste__meta">${esc(e.titel)}${e.t ? ` · <span class="ohne-umbruch">${datum(e.t)}</span>` : ''}</p></li>`).join('')}</ul>
       ${navigator.share ? '<p class="knopfreihe"><button type="button" class="knopf" data-aktion="teilen">Teilen</button><span class="leise" id="teil-status" aria-live="polite"></span></p>' : ''}`
    : '<p>Hier stehen später deine Einträge. Am Ende jedes Briefs kannst du aufschreiben, was du entdeckt hast.</p>';

  zeigen(`
    <header class="kopf kopf--buch">
      ${PFEIL}
      <h1>Fundbuch von ${esc(k.name)}</h1>
      <p class="kopf__unter">Hier sammelst du alles, was du gefunden hast.</p>
    </header>
    <section class="papier buch" aria-labelledby="h-briefe"><h2 id="h-briefe">Meine Briefe</h2>${briefe}</section>
    ${urkundeBlatt(k)}
    <section class="papier buch" aria-labelledby="h-zeit"><h2 id="h-zeit">Meine Lernzeit</h2>${lernzeit}<p class="leise">Mehr ist nicht besser. Jeder lernt in seinem Tempo.</p></section>
    <section class="papier buch" aria-labelledby="h-kann"><h2 id="h-kann">Das kann ich schon</h2>${kannTeil}</section>
    ${uebeBlatt}
    <section class="papier buch" aria-labelledby="h-eintraege"><h2 id="h-eintraege">Meine Einträge</h2>${eintragTeil}</section>
    ${S.istVorschau ? '<p class="vorschau-satz">Vorschau: Alles hier sind Beispiele.</p>' : ''}
    <p class="knopfreihe zurueck"><button type="button" class="knopf glas-knopf" data-aktion="start">Zurück zur Flaschenpost</button></p>
    <p class="leise-zeile"><button type="button" class="leise-zeile__knopf" data-aktion="loeschen-frage"${S.istVorschau ? ' disabled' : ''}>Alles löschen / Neu anfangen</button></p>
    <dialog class="dialog" id="loeschen-dialog" aria-labelledby="ld-titel" aria-describedby="ld-text">
      <h2 id="ld-titel">Wirklich alles löschen?</h2>
      <p id="ld-text">Alles von ${esc(k.name)} wird gelöscht: Siegel, Lernzeit und deine Einträge. Das geht nicht rückgängig. Die anderen Kinder auf diesem Gerät bleiben.</p>
      <p class="knopfreihe"><button type="button" class="knopf haupt" data-aktion="loeschen-nein" autofocus>Nein, behalten</button><button type="button" class="knopf leise-knopf" data-aktion="loeschen-ja">Ja, alles löschen</button></p>
    </dialog>`, `Fundbuch von ${k.name}`);
  app.classList.add('seite--buch');
  adresse('fundbuch');
  app.querySelector('#loeschen-dialog').addEventListener('cancel', e => { e.preventDefault(); dialogZu('loeschen-dialog', 'loeschen-frage'); });
}

/* ---------- Urkunde (Zeichnen und PDF in js/urkunde.js) ---------- */
const alleStationen = () => C.module.flatMap(m => m.stationen);
const ZAHLWOERTER = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'];
const zahlwort = n => ZAHLWOERTER[n] || String(n);
function urkundeBlatt(k) {
  const offen = alleStationen().filter(id => !(k.stationen[id] && k.stationen[id].fertig)).length;
  const inhalt = offen
    ? `<p>Wenn du alle ${zahlwort(alleStationen().length)} Briefe geprüft hast, bekommst du hier deine Urkunde. Noch ${offen} ${offen === 1 ? 'Brief' : 'Briefe'}.</p>`
    : `<p id="urkunde-satz">Du hast alle Briefe geprüft. Hier kannst du deine Urkunde machen. Sie entsteht auf diesem Gerät.</p>
       <p class="knopfreihe" id="urkunde-start"><button type="button" class="knopf haupt" data-aktion="urkunde">Urkunde machen</button></p>
       <p class="knopfreihe" id="urkunde-fertig" hidden><a class="knopf haupt" id="urkunde-ansehen" href="#" target="_blank" rel="noopener">Urkunde ansehen</a><button type="button" class="knopf" id="urkunde-teilen" data-aktion="urkunde-teilen" hidden>Teilen</button></p>
       <p class="leise" id="urkunde-status" role="status"></p>`;
  return `<section class="papier buch" aria-labelledby="h-urkunde"><h2 id="h-urkunde" tabindex="-1">Meine Urkunde</h2>${inhalt}</section>`;
}
function urkundeDaten(k) {
  const saetze = C.module.flatMap(m => ((ABSCHLUESSE[m.id] && ABSCHLUESSE[m.id].saetze) || [])
    .map(x => { const e = (k.kannIch[m.id] || {})[x.id]; return e ? { modulTitel: m.titel, text: e.text, wert: e.wert } : null; })
    .filter(Boolean));
  const zeiten = Object.values(k.stempel).map(Number).filter(t => t > 0);
  return { name: k.name, datum: new Date(zeiten.length ? Math.max(...zeiten) : Date.now()), module: C.module, saetze, miraSrc: `bilder/mira-512.jpg?b=${C.bildStand}` };
}
async function urkundeMachen(knopf) {
  knopf.disabled = true;
  const ok = await urkundeAnbieten(urkundeDaten(S.aktiv()), {
    status: app.querySelector('#urkunde-status'),
    fertig: app.querySelector('#urkunde-fertig'),
    ansehen: app.querySelector('#urkunde-ansehen'),
    teilen: app.querySelector('#urkunde-teilen')
  });
  if (ok) {
    /* Der Satz oben sagt jetzt, dass sie fertig ist; die Statuszeile bleibt für Fehler und Teilen */
    app.querySelector('#urkunde-start').hidden = true;
    app.querySelector('#urkunde-satz').textContent = 'Deine Urkunde ist fertig.';
    app.querySelector('#urkunde-status').textContent = '';
    ansagen('Deine Urkunde ist fertig.');
    app.querySelector('#urkunde-ansehen').focus();
  }
  else knopf.disabled = false;
}

/* Teilt alle Einträge über das Teilen-Menü des Geräts (AirDrop, Mail …). Die Seite selbst schickt nichts. */
async function teilen() {
  const status = app.querySelector('#teil-status');
  const k = S.aktiv();
  if (!k || !navigator.share) return;
  const text = eintragListe(k).map(e => `${e.titel}\n${e.text}`).join('\n\n');
  try {
    await navigator.share({ title: `Einträge von ${k.name} – Flaschenpost`, text });
    status.textContent = 'Geteilt.';
  } catch (e) {
    if (e && e.name === 'AbortError') status.textContent = '';
    else status.textContent = 'Teilen klappt hier gerade nicht.';
  }
}

/* ---------- Dialoge ---------- */
function dialogAuf(id) {
  const d = document.getElementById(id);
  if (d && typeof d.showModal === 'function' && !d.open) d.showModal();
}
/* Dialog zu, Fokus zurück auf den Knopf, der ihn geöffnet hat */
function dialogZu(id, ausloeser) {
  const d = document.getElementById(id);
  if (d && d.open) d.close();
  const b = typeof ausloeser === 'string' ? app.querySelector(`[data-aktion="${ausloeser}"]`) : ausloeser;
  if (b) b.focus();
}

function loeschenJa() {
  const name = S.aktiv() ? S.aktiv().name : '';
  dialogZu('loeschen-dialog', null);
  const ok = S.aktivLoeschen();
  S.alleKinder().length ? ansichtWer() : ansichtNeu();
  melden(ok ? `Alles von ${name} ist gelöscht.` : SPEICHER_FEHLT);
}

/* Zwei Aufklapper am Ende der Startseite (Texte in js/daten/erwachsene.js) */
function erwachsenenTeil(bereich, klasse) {
  const abschnitt = x => `
      <h3>${esc(x.titel)}</h3>
      ${(x.absaetze || []).map(t => `<p>${esc(t)}</p>`).join('')}
      ${x.tabelle ? `<div class="tabelle-rahmen"><table class="tabelle"><thead><tr><th scope="col">Prinzip</th><th scope="col">Umsetzung</th></tr></thead><tbody>${x.tabelle.map(([a, b]) => `<tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td></tr>`).join('')}</tbody></table></div>` : ''}
      ${x.liste ? `<ul class="erwachsene__liste">${x.liste.map(([a, b]) => `<li><b>${esc(a)}</b> ${esc(b)}</li>`).join('')}</ul>` : ''}
      ${x.datenschutzLink ? '<p>Mehr steht unter <a href="datenschutz.html">Datenschutz</a>.</p>' : ''}
      ${x.link ? `<p><a href="${esc(x.link.url)}" target="_blank" rel="noopener noreferrer">${esc(x.link.text)}</a> <span class="leise">(öffnet einen neuen Tab)</span></p>` : ''}`;
  return `
    <details class="papier erwachsene ${klasse}">
      <summary><h2>${esc(bereich.titel)}</h2></summary>
      ${bereich.abschnitte.map(abschnitt).join('')}
    </details>`;
}
function erwachsene() {
  return erwachsenenTeil(ELTERN, 'erwachsene--eltern') + erwachsenenTeil(LEHRKRAEFTE, 'erwachsene--lehrkraefte');
}

/* ---------- Bedienung ---------- */
app.addEventListener('submit', e => { bedienen(e); });
app.addEventListener('change', e => { bedienen(e); });
app.addEventListener('input', e => { bedienen(e); });
app.addEventListener('click', e => {
  if (bedienen(e)) return;
  const b = e.target.closest('[data-aktion]');
  if (!b || b.disabled) return;
  const a = b.dataset.aktion;
  if (a === 'neu') ansichtNeu();
  else if (a === 'wer') { S.abmelden(); ansichtWer(); }
  else if (a === 'waehlen') { if (S.waehlen(b.dataset.id)) ansichtStart(); }
  else if (a === 'loeschen-frage') dialogAuf('loeschen-dialog');
  else if (a === 'loeschen-nein') dialogZu('loeschen-dialog', 'loeschen-frage');
  else if (a === 'loeschen-ja') loeschenJa();
  else if (a === 'unterwegs') melden(UNTERWEGS);
  else if (a === 'fundbuch') ansichtFundbuch();
  else if (a === 'start') ansichtStart();
  else if (a === 'teilen') teilen();
  else if (a === 'urkunde') urkundeMachen(b);
  else if (a === 'urkunde-teilen') urkundeTeilen(app.querySelector('#urkunde-status'));
  else if (a === 'zur-urkunde') { ansichtFundbuch(); const h = app.querySelector('#h-urkunde'); h.closest('section').scrollIntoView({ block: 'start' }); h.focus({ preventScroll: true }); }
  else if (a === 'brief') stationZeigen(ctx, b.dataset.id);
});

/* ---------- Licht und Blasen: ruhen außer Sicht und bei verstecktem Tab (wie Lernlagune) ---------- */
let ausserSicht = false;
function ruheSetzen() {
  document.body.classList.toggle('ruht', ausserSicht || document.hidden);
}
document.addEventListener('visibilitychange', ruheSetzen);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(e => { ausserSicht = !e[0].isIntersecting; ruheSetzen(); })
    .observe(document.querySelector('.blasen'));
}

/* ---------- Start ---------- */
if (S.istVorschau) {
  const h = document.getElementById('vorschau-hinweis');
  h.textContent = 'Vorschau: Hier wird nichts gespeichert.';
  h.hidden = false;
}
/* #fundbuch öffnet direkt das Fundbuch (Lesezeichen, Tests) */
/* #fundbuch und #brief/<id> öffnen direkt die Ansicht (Neuladen, Lesezeichen, Tests) */
const ziel = location.hash.slice(1);
if (S.aktiv()) {
  if (ziel === 'fundbuch') ansichtFundbuch();
  else if (ziel.startsWith('brief/') && gibtStation(ziel.slice(6))) stationZeigen(ctx, ziel.slice(6));
  else ansichtStart();
}
else if (S.alleKinder().length) ansichtWer();
else ansichtNeu();
if (S.zustand.ladeFehler) melden(LADEN_FEHLT);

/* Für den Rauchtest */
window.FP = { S, C, L, STATIONEN, bereit: true };
