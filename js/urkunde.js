/* Flaschenpost: Urkunde als PDF, ganz auf dem Gerät (kein Server, keine Bibliothek).
   Jede Seite wird auf ein Canvas gezeichnet (A4 hochkant, 150 dpi) und als JPEG in ein kleines PDF gelegt.
   Technik übernommen vom KI-Korallenriff (js/riff-urkunde.js), Gestaltung nach DESIGN.md:
   ruhig, Navy auf Weiß, Libre Caslon für Namen und Fragen, Andika für Lesetext, Wachssiegel, kein Konfetti.
   Die Urkunde ist ein Ausdruck, keine Sicherung: Sie lässt sich nicht wieder einlesen. */

const B = 1240, H = 1754;                  /* A4 hochkant, 150 dpi */
const NAVY = '#0b3155', LEISE = '#4a6275', LINIE = '#d9d3c2', WELLE = '#2d6f98', PAPIER = '#f5f3ec';
const CASLON = '"Libre Caslon Text", Georgia, serif';
const ANDIKA = '"Andika", "Trebuchet MS", sans-serif';

const bildCache = {};
function bild(src) {
  if (!bildCache[src]) {
    bildCache[src] = new Promise((ok, nein) => {
      const img = new Image();
      img.onload = () => ok(img);
      img.onerror = () => nein(new Error('Bild fehlt: ' + src));
      img.src = src;
    });
  }
  return bildCache[src];
}

async function schriftenLaden() {
  if (!document.fonts || !document.fonts.load) return;
  await Promise.all([`400 80px ${CASLON}`, `400 40px ${ANDIKA}`, `700 40px ${ANDIKA}`]
    .map(f => document.fonts.load(f).catch(() => null)));
}

function neueSeite() {
  const c = document.createElement('canvas');
  c.width = B; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, B, H);
  return { c, ctx };
}

/* Text mittig setzen, bei Bedarf verkleinern, bis er passt */
function zeile(ctx, text, x, y, schrift, groesse, maxB, farbe) {
  let g = groesse;
  do { ctx.font = schrift.replace('#', g); g -= 2; } while (ctx.measureText(text).width > maxB && g > 20);
  ctx.fillStyle = farbe;
  ctx.fillText(text, x, y);
}

function umbrechen(ctx, text, maxB) {
  const zeilen = [];
  let z = '';
  text.split(/\s+/).forEach(w => {
    const probe = z ? z + ' ' + w : w;
    if (ctx.measureText(probe).width > maxB && z) { zeilen.push(z); z = w; } else z = probe;
  });
  if (z) zeilen.push(z);
  return zeilen;
}

/* Doppelter Haarlinien-Rahmen wie ein Briefbogen */
function rahmen(ctx) {
  ctx.save();
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 3;
  ctx.strokeRect(70, 70, B - 140, H - 140);
  ctx.strokeStyle = LINIE;
  ctx.lineWidth = 2;
  ctx.strokeRect(92, 92, B - 184, H - 184);
  ctx.restore();
}

/* Kleine Wellenlinie unter der Wortmarke (wie im Kopf der Seite) */
function welle(ctx, mx, y, breite) {
  ctx.save();
  ctx.strokeStyle = WELLE;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  const n = 4, s = breite / n;
  ctx.beginPath();
  ctx.moveTo(mx - breite / 2, y);
  for (let i = 0; i < n; i++) {
    const x0 = mx - breite / 2 + i * s;
    ctx.quadraticCurveTo(x0 + s / 4, y - 8, x0 + s / 2, y);
    ctx.quadraticCurveTo(x0 + 3 * s / 4, y + 8, x0 + s, y);
  }
  ctx.stroke();
  ctx.restore();
}

/* Wachssiegel wie im Fundbuch: gewellter Rand (18 Zacken), Ring, Nummer */
function siegel(ctx, x, y, r, nr) {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 36; i++) {
    const w = (Math.PI * i) / 18, rr = i % 2 ? r * 0.915 : r;
    const px = x + rr * Math.cos(w), py = y + rr * Math.sin(w);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = NAVY;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, r * 0.68, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(245, 243, 236, 0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = PAPIER;
  ctx.textAlign = 'center';
  ctx.font = `400 ${Math.round(r * 0.75)}px ${CASLON}`;
  ctx.fillText(String(nr), x, y + r * 0.27);
  ctx.restore();
}

/* Haken als Linie (kein Zeichen aus der Schrift) */
function haken(ctx, x, y, g) {
  ctx.save();
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = g * 0.14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y - g * 0.35);
  ctx.lineTo(x + g * 0.33, y);
  ctx.lineTo(x + g * 0.9, y - g * 0.75);
  ctx.stroke();
  ctx.restore();
}

/* Seite 1: die Urkunde.
   name: Vorname; datum: Date; module: [{ titel, kurz, stationen }] */
export async function vorderseite({ name, datum, module, miraSrc }) {
  await schriftenLaden();
  const mira = await bild(miraSrc);
  const { c, ctx } = neueSeite();
  rahmen(ctx);
  const mitte = B / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  /* Wortmarke */
  zeile(ctx, 'Flaschenpost', mitte, 200, `400 #px ${CASLON}`, 46, 600, NAVY);
  welle(ctx, mitte, 228, 110);

  /* Mira im runden Bild */
  const mr = 125, my = 395;
  ctx.save();
  ctx.beginPath();
  ctx.arc(mitte, my, mr, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(mira, mitte - mr, my - mr, mr * 2, mr * 2);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(mitte, my, mr, 0, Math.PI * 2);
  ctx.strokeStyle = LINIE;
  ctx.lineWidth = 4;
  ctx.stroke();

  /* Titel und Name */
  zeile(ctx, 'Urkunde', mitte, 685, `400 #px ${CASLON}`, 130, 900, NAVY);
  ctx.font = `400 40px ${ANDIKA}`;
  ctx.fillStyle = LEISE;
  ctx.fillText('für', mitte, 760);
  zeile(ctx, name, mitte, 870, `400 #px ${CASLON}`, 104, 900, NAVY);
  ctx.strokeStyle = LINIE;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(mitte - 320, 910); ctx.lineTo(mitte + 320, 910); ctx.stroke();

  ctx.font = `400 46px ${ANDIKA}`;
  ctx.fillStyle = NAVY;
  ctx.fillText('hat alle Briefe der Flaschenpost geprüft', mitte, 990);
  ctx.fillText('und fragt jetzt bei jeder Nachricht:', mitte, 1050);

  /* Die drei Fragen */
  module.forEach((m, i) => zeile(ctx, m.titel, mitte, 1150 + i * 72, `400 #px ${CASLON}`, 56, 900, NAVY));

  /* Sechs Siegel, paarweise je Thema */
  const r = 46, abstandPaar = 116, abstandGruppe = 330;
  module.forEach((m, gi) => {
    const gx = mitte + (gi - 1) * abstandGruppe;
    m.stationen.forEach((_, si) => siegel(ctx, gx + (si - 0.5) * abstandPaar, 1380, r, si + 1));
    ctx.font = `400 28px ${ANDIKA}`;
    ctx.fillStyle = LEISE;
    ctx.fillText(m.kurz, gx, 1462);
  });

  /* Datum und Unterschrift */
  const d = datum.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 2;
  [[190, 560], [680, 1050]].forEach(([a, e]) => { ctx.beginPath(); ctx.moveTo(a, 1588); ctx.lineTo(e, 1588); ctx.stroke(); });
  ctx.font = `400 34px ${ANDIKA}`;
  ctx.fillStyle = NAVY;
  ctx.fillText(d, 375, 1573);
  ctx.font = `400 26px ${ANDIKA}`;
  ctx.fillStyle = LEISE;
  ctx.fillText('Datum', 375, 1622);
  ctx.fillText('Unterschrift der Lehrkraft', 865, 1622);
  return c;
}

/* Offener, gestrichelter Kreis für „Übe ich noch“ (wie der offene Platz im Fundbuch) */
function offen(ctx, x, y, g) {
  ctx.save();
  ctx.strokeStyle = LEISE;
  ctx.lineWidth = Math.max(2, g * 0.09);
  ctx.setLineDash([g * 0.18, g * 0.14]);
  ctx.beginPath();
  ctx.arc(x + g * 0.45, y - g * 0.36, g * 0.45, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/* Seite 2: „Das kann ich schon“ aus den Modul-Abschlüssen.
   saetze: [{ modulTitel, text, wert: 'kann' | 'uebe' }]
   Status steht rechts in einer eigenen Spalte. Passt es nicht, wird die Schrift kleiner. */
export async function rueckseite({ name, saetze }) {
  await schriftenLaden();
  const { c, ctx } = neueSeite();
  rahmen(ctx);
  const mitte = B / 2;
  ctx.textAlign = 'center';
  zeile(ctx, 'Das kann ich schon', mitte, 230, `400 #px ${CASLON}`, 84, 900, NAVY);
  ctx.font = `400 40px ${ANDIKA}`;
  ctx.fillStyle = LEISE;
  ctx.fillText(name, mitte, 296);

  const links = 160, rechts = B - 160, markeB = 64, statusB = 210;
  const textX = links + markeB, maxB = rechts - statusB - textX - 20;
  const oben = 380, unten = H - 200;

  /* Einmal durchrechnen (zeichnen = false), Schrift so lange verkleinern, bis alles passt */
  const lauf = (g, zeichnen) => {
    const zeilenH = Math.round(g * 1.3), abstand = Math.round(g * 0.7), kopfG = Math.round(g * 1.3);
    let y = oben;
    let letztes = '';
    ctx.textAlign = 'left';
    saetze.forEach(s => {
      if (s.modulTitel !== letztes) {
        letztes = s.modulTitel;
        y += Math.round(g * 0.6);
        if (zeichnen) {
          ctx.font = `400 ${kopfG}px ${CASLON}`;
          ctx.fillStyle = NAVY;
          ctx.fillText(s.modulTitel, links, y);
        }
        y += Math.round(g * 0.6);
        if (zeichnen) { ctx.strokeStyle = LINIE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(links, y); ctx.lineTo(rechts, y); ctx.stroke(); }
        y += Math.round(g * 1.5);
      }
      ctx.font = `400 ${g}px ${ANDIKA}`;
      const zeilen = umbrechen(ctx, s.text, maxB);
      if (zeichnen) {
        if (s.wert === 'kann') haken(ctx, links + 6, y - g * 0.15, g * 1.15); else offen(ctx, links + 4, y, g * 1.05);
        ctx.fillStyle = NAVY;
        zeilen.forEach((z, i) => ctx.fillText(z, textX, y + i * zeilenH));
        ctx.textAlign = 'right';
        ctx.font = `700 ${Math.round(g * 0.8)}px ${ANDIKA}`;
        ctx.fillStyle = s.wert === 'kann' ? NAVY : LEISE;
        ctx.fillText(s.wert === 'kann' ? 'Kann ich!' : 'Übe ich noch', rechts, y);
        ctx.textAlign = 'left';
      }
      y += (zeilen.length - 1) * zeilenH + zeilenH + abstand;
    });
    return y;
  };
  let g = 34;
  while (g > 22 && lauf(g, false) > unten) g -= 2;
  lauf(g, true);

  if (!saetze.length) {
    ctx.textAlign = 'center';
    ctx.font = `400 36px ${ANDIKA}`;
    ctx.fillStyle = LEISE;
    ctx.fillText('Hier stehen die Sätze, die du am Ende jedes Themas eingeschätzt hast.', mitte, 520);
  }
  ctx.textAlign = 'center';
  ctx.font = `400 28px ${ANDIKA}`;
  ctx.fillStyle = LEISE;
  ctx.fillText('„Kann ich!“ und „Übe ich noch“ sind beide in Ordnung.', mitte, H - 140);
  return c;
}

function jpegBytes(canvas) {
  const daten = atob(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
  const b = new Uint8Array(daten.length);
  for (let i = 0; i < daten.length; i++) b[i] = daten.charCodeAt(i);
  return b;
}

/* Kleines PDF mit je einem JPEG pro Seite (A4) */
export function pdfAusSeiten(canvasse) {
  const teile = [];
  let laenge = 0;
  const offsets = [];
  const text = s => { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255; teile.push(b); laenge += b.length; };
  const roh = b => { teile.push(b); laenge += b.length; };
  const obj = (nr, inhalt) => { offsets[nr] = laenge; text(`${nr} 0 obj\n${inhalt}\nendobj\n`); };
  const W = 595.28, Hp = 841.89;
  const n = canvasse.length;
  const seitenNr = i => 3 + i * 3;
  text('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, `<< /Type /Pages /Count ${n} /Kids [${canvasse.map((_, i) => `${seitenNr(i)} 0 R`).join(' ')}] >>`);
  canvasse.forEach((cv, i) => {
    const s = seitenNr(i);
    obj(s, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${Hp}] /Resources << /XObject << /Im${i} ${s + 2} 0 R >> >> /Contents ${s + 1} 0 R >>`);
    const strom = `q ${W} 0 0 ${Hp} 0 0 cm /Im${i} Do Q`;
    obj(s + 1, `<< /Length ${strom.length} >>\nstream\n${strom}\nendstream`);
    const jpg = jpegBytes(cv);
    offsets[s + 2] = laenge;
    text(`${s + 2} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${cv.width} /Height ${cv.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
    roh(jpg);
    text('\nendstream\nendobj\n');
  });
  const anzahl = 3 + n * 3;
  const xref = laenge;
  let x = `xref\n0 ${anzahl}\n0000000000 65535 f \n`;
  for (let i = 1; i < anzahl; i++) x += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  text(`${x}trailer\n<< /Size ${anzahl} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(teile, { type: 'application/pdf' });
}

/* ---------- Anbieten im Fundbuch: erstellen, ansehen, teilen ---------- */
let letzteUrl = null;
let letzteDatei = null;

/* Erstellt beide Seiten und das PDF. elemente: { status, fertig, ansehen, teilen } */
export async function urkundeAnbieten(daten, { status, fertig, ansehen, teilen }) {
  status.textContent = 'Deine Urkunde wird gemacht …';
  try {
    const vorne = await vorderseite(daten);
    const hinten = await rueckseite(daten);
    const blob = pdfAusSeiten([vorne, hinten]);
    if (letzteUrl) URL.revokeObjectURL(letzteUrl);
    letzteUrl = URL.createObjectURL(blob);
    const dateiname = `Urkunde Flaschenpost ${String(daten.name).replace(/[\/:*?"<>|]/g, '')}.pdf`;
    ansehen.href = letzteUrl;
    ansehen.download = dateiname;
    letzteDatei = (typeof File === 'function') ? new File([blob], dateiname, { type: 'application/pdf' }) : null;
    teilen.hidden = !(letzteDatei && navigator.canShare && navigator.canShare({ files: [letzteDatei] }));
    fertig.hidden = false;
    status.textContent = 'Deine Urkunde ist fertig.';
    return true;
  } catch (e) {
    status.textContent = 'Die Urkunde konnte gerade nicht gemacht werden. Versuch es noch einmal.';
    return false;
  }
}

/* Teilen-Menü des Geräts (AirDrop, Mail …). Die Seite selbst schickt nichts. */
export async function urkundeTeilen(status) {
  if (!letzteDatei || !navigator.share) return;
  try {
    await navigator.share({ files: [letzteDatei], title: 'Meine Urkunde' });
    status.textContent = 'Geteilt.';
  } catch (e) {
    if (!e || e.name !== 'AbortError') status.textContent = 'Teilen klappt hier gerade nicht. Tippe auf „Urkunde ansehen“.';
  }
}
