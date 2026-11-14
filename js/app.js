/* Flaschenpost: Ansichten und Bedienung.
   Anmeldung mit dem Code (seit dem Konto-Umbau, 14.11.2026), Startseite „Nächster Brief“, Fundbuch, Urkunde.
   Die Briefe (Stationen) stehen in js/station.js. */
import { config as C } from './config.js?v=67';
import * as S from './speicher.js?v=67';
const cloud = S.cloud;
import * as L from './lernzeit.js?v=67';
import { stationZeigen, gibtStation, bedienen, STATIONEN, ABSCHLUESSE } from './station.js?v=67';
import { urkundeAnbieten, urkundeTeilen } from './urkunde.js?v=67';
import { eltern as ELTERN, lehrkraefte as LEHRKRAEFTE } from './daten/erwachsene.js?v=67';

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

let ansicht = '';
const MOMENT = 'Einen Moment …';

/* Ergebnis von cloud.anmelden() oder start() anzeigen */
function nachAnmelden(r) {
  if (!r.ok) {
    if (ansicht === 'code' && app.querySelector('#code')) {
      app.querySelector('#code-form button[type="submit"]').disabled = false;
      app.querySelector('#code-hinweis').textContent = r.grund || '';
      app.querySelector('#code').focus();
    } else ansichtCode(r.grund);
    return;
  }
  ansichtStart();
  if (r.gespeichert === false) melden(SPEICHER_FEHLT);
}

function ansichtCode(hinweis = '') {
  zeigen(`
    ${kopf('Wer hat das geschrieben?', true)}
    <section class="papier" aria-labelledby="h-code">
      <p>Ich bin ${esc(C.maskottchen)}. Ich sammle Flaschenpost. Bei jedem Brief fragen wir zusammen: Wer hat das geschrieben? Warum? Und woher weiß er das?</p>
      <h2 id="h-code">Wie lautet dein Code?</h2>
      <form id="code-form" novalidate>
        <label for="code">Dein Code</label>
        <input type="text" id="code" name="code" class="code-feld" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" maxlength="${C.codeLaenge + 4}" aria-describedby="code-hinweis code-info">
        <p id="code-hinweis" class="hinweis-feld" aria-live="polite">${esc(hinweis || '')}</p>
        <p class="knopfreihe"><button type="submit" class="knopf haupt">Weiter</button></p>
      </form>
      <p id="code-info" class="leise">Dein Code hat ${C.codeLaenge} Zeichen: Buchstaben und Zahlen. Es ist derselbe Code wie beim Perlentaucher.</p>
    </section>
    ${erwachsene()}`, '');
  ansicht = 'code';
  app.querySelector('#code-form').addEventListener('submit', e => {
    e.preventDefault();
    const knopf = e.target.querySelector('button[type="submit"]');
    if (knopf.disabled) return;
    knopf.disabled = true;
    app.querySelector('#code-hinweis').textContent = MOMENT;
    cloud.anmelden(app.querySelector('#code').value).then(nachAnmelden, () => nachAnmelden({ ok: false, grund: cloud.TEXT.sonst }));
  });
}

/* Zeile auf der Startseite, wenn der Stand gerade nicht in der Datenbank ankommt */
function netzText() {
  const z = cloud.zustand().art;
  if (z === 'lokal') return 'Gerade ohne Internet. Dein Stand bleibt auf diesem Gerät und wird später abgeglichen.';
  if (z === 'fehler') return 'Dein Stand konnte gerade nicht im Internet gespeichert werden. Er bleibt auf diesem Gerät. Bitte sag deiner Lehrkraft Bescheid.';
  return '';
}
cloud.beiZustand(() => {
  const p = app.querySelector('#netz-zeile');
  if (p) { p.textContent = netzText(); p.hidden = !p.textContent; }
});

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
  if (!k) { ansichtCode(); return; }
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
      ${S.istVorschau ? '' : '<button type="button" class="knopf glas-knopf" data-aktion="abmelden">Abmelden</button>'}
    </nav>
    <p class="vorschau-satz netz-zeile" id="netz-zeile" role="status"${netzText() ? '' : ' hidden'}>${esc(netzText())}</p>
    ${S.istVorschau ? '<p class="vorschau-satz">In der Vorschau wird nichts gespeichert und nichts gelöscht.</p>' : ''}
    ${erwachsene()}`, `Hallo, ${k.name}`);
  app.classList.add('seite--start');
  ansicht = 'start';
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

/* Einträge liegen nur auf diesem Gerät (js/speicher.js), nicht im Stand */
function eintragListe() {
  const e = S.eintraege();
  return C.module.flatMap(m => m.stationen)
    .filter(id => e[id] && String(e[id].text || '').trim())
    .map(id => ({ titel: briefName(id), text: String(e[id].text).trim(), t: e[id].t }));
}

function ansichtFundbuch() {
  const k = S.aktiv();
  if (!k) { ansichtCode(); return; }
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

  const eintraege = eintragListe();
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
    <section class="papier buch" aria-labelledby="h-eintraege"><h2 id="h-eintraege">Meine Einträge</h2>${eintragTeil}<p class="leise">Deine Einträge bleiben nur auf diesem Gerät.</p></section>
    ${S.istVorschau ? '<p class="vorschau-satz">Vorschau: Alles hier sind Beispiele.</p>' : ''}
    <p class="knopfreihe zurueck"><button type="button" class="knopf glas-knopf" data-aktion="start">Zurück zur Flaschenpost</button></p>
    `, `Fundbuch von ${k.name}`);
  app.classList.add('seite--buch');
  ansicht = 'fundbuch';
  adresse('fundbuch');
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
  const text = eintragListe().map(e => `${e.titel}\n${e.text}`).join('\n\n');
  try {
    await navigator.share({ title: `Einträge von ${k.name} – Flaschenpost`, text });
    status.textContent = 'Geteilt.';
  } catch (e) {
    if (e && e.name === 'AbortError') status.textContent = '';
    else status.textContent = 'Teilen klappt hier gerade nicht.';
  }
}

/* ---------- Abmelden ---------- */
function abmelden(knopf) {
  knopf.disabled = true;
  cloud.abmelden().then(() => { ansichtCode(); }, () => { ansichtCode(); });
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
  if (a === 'abmelden') abmelden(b);
  else if (a === 'unterwegs') melden(UNTERWEGS);
  else if (a === 'fundbuch') ansichtFundbuch();
  else if (a === 'start') ansichtStart();
  else if (a === 'teilen') teilen();
  else if (a === 'urkunde') urkundeMachen(b);
  else if (a === 'urkunde-teilen') urkundeTeilen(app.querySelector('#urkunde-status'));
  else if (a === 'zur-urkunde') { ansichtFundbuch(); const h = app.querySelector('#h-urkunde'); h.closest('section').scrollIntoView({ block: 'start' }); h.focus({ preventScroll: true }); }
  else if (a === 'brief') { stationZeigen(ctx, b.dataset.id); ansicht = 'brief'; }
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
/* #fundbuch und #brief/<id> öffnen direkt die Ansicht (Neuladen, Lesezeichen, Tests) */
function anzeigen() {
  const ziel = location.hash.slice(1);
  if (S.aktiv()) {
    if (ziel === 'fundbuch') ansichtFundbuch();
    else if (ziel.startsWith('brief/') && gibtStation(ziel.slice(6))) { stationZeigen(ctx, ziel.slice(6)); ansicht = 'brief'; }
    else ansichtStart();
  }
  else ansichtCode();
  if (S.zustand.ladeFehler) melden(LADEN_FEHLT);
}

/* Die Lehrkraft hat den Stand zurückgesetzt: Das Gerät hat seinen Stand verworfen (js/konto-cloud.js). */
cloud.beiNeustart(() => {
  if (ansicht === 'start') ansichtStart();
  else if (ansicht === 'fundbuch') ansichtFundbuch();
  melden('Deine Lehrkraft hat deine Flaschenpost neu gestartet. Du fängst von vorn an.');
});

/* Was das Gerät schon weiß, steht sofort da. Die Antwort aus dem Netz kommt nach.
   Gewechselt wird nur auf der Code- oder Startseite, nie mitten in einem Brief. */
const darfWechseln = () => ['code', 'start'].includes(ansicht);
function starten() {
  if (S.istVorschau) { anzeigen(); return; }
  const LA = window.LagunenKonto.adresse;
  const qr = LA.code(), spur = LA.spur();
  LA.saeubern();
  if (qr) {
    /* Ein gescannter Code hat Vorrang vor dem Kind, das auf dem Gerät noch angemeldet ist. */
    if (S.aktiv() && S.code() !== qr) S.S.abmelden();
    if (S.aktiv()) ansichtStart(); else ansichtCode(MOMENT);
    cloud.anmelden(qr).then(r => { if (darfWechseln()) { if (!r.ok) ansichtCode(r.grund); else nachAnmelden(r); } }, () => {});
    return;
  }
  anzeigen();
  if (spur && ansicht === 'code') app.querySelector('#code-hinweis').textContent = 'Der Code wurde nicht ganz gelesen. Tippe ihn bitte ein.';
  const gemerkt = S.code();
  cloud.start().then(r => {
    if (r.ok) { if (darfWechseln()) nachAnmelden(r); return null; }
    if (r.grund) return r;
    /* Firebase kennt niemanden, der Tab aber schon: mit dem gemerkten Code anmelden */
    return gemerkt && S.code() === gemerkt ? cloud.anmelden(gemerkt) : null;
  }).then(r => {
    if (!r) return;
    if (r.ok) { if (ansicht === 'start' && darfWechseln()) ansichtStart(); return; }
    /* Die Lehrkraft hat den Code gesperrt: nicht auf dem Gerät weiterarbeiten lassen */
    if (r.grund === cloud.TEXT.gesperrt && S.aktiv()) { S.S.abmelden(); if (darfWechseln()) ansichtCode(r.grund); }
  }, () => {});
}
starten();

/* Für den Rauchtest */
window.FP = { S, C, L, STATIONEN, cloud, bereit: true };
