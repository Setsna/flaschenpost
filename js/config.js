/* Flaschenpost: alle Einstellungen an einer Stelle. */

export const config = {
  name: 'Flaschenpost',
  unterzeile: 'Wer hat das geschrieben?',
  maskottchen: 'Mira',

  /* Speicher im Browser (seit dem Konto-Umbau 14.11.2026, Schema 2):
     localStorage  flaschenpost-v2.<code>             Stand samt Vorname (für die Anzeige ohne Netz)
                   flaschenpost-v2.<code>.abgleich    zuletzt abgeglichener Stand
                   flaschenpost-v2.<code>.eintraege   „Mein Eintrag“, nur auf diesem Gerät
     sessionStorage flaschenpost-v2-wer               welcher Code in diesem Tab angemeldet ist
     Der alte Stand ohne Konto (flaschenpost-v1) wird nicht übernommen und nicht gelöscht. */
  speicher: {
    schluessel: 'flaschenpost',
    schema: 2
  },
  codeLaenge: 8,

  /* Gemeinsames Konto (Konto-Umbau): das Firebase-Projekt des Perlentauchers.
     Diese Angaben sind keine Geheimnisse, sie stehen bei jeder Firebase-Seite im Quelltext.
     Geschützt werden die Daten durch die Regeln in der Firebase-Konsole. */
  firebase: {
    apiKey: 'AIzaSyBX3MUJq69uFyejbEiJimGeAtHMER3OCdE',
    authDomain: 'lernplattform-44aa1.firebaseapp.com',
    projectId: 'lernplattform-44aa1',
    storageBucket: 'lernplattform-44aa1.firebasestorage.app',
    messagingSenderId: '213839225177',
    appId: '1:213839225177:web:4cf676269e50c708466c48'
  },
  cloud: {
    kinder: 'kinder',        /* kinder/<code>: Vorname, von der Lehrkraft angelegt (nur lesen) */
    stand: 'fp_stand',       /* fp_stand/<code>: der Fortschritt dieses Kindes in der Flaschenpost */
    schreibPauseMs: 2500     /* so lange nach der letzten Änderung warten, dann gebündelt schreiben */
  },
  nameMaxLaenge: 20,

  /* Module und Stationen des ersten Wurfs (Inhalte ab Etappe 3).
     Die Ids landen im Speicher; nicht mehr umbenennen, sobald Kinder damit arbeiten. */
  /* kurz: Unterzeile im Modulfenster. lockt: Text auf dem Startblatt, solange der
     nächste Brief aus diesem Modul kommt (bis die Stationen eigene Texte haben). */
  module: [
    { id: 'wer', titel: 'Wer sagt das?', kurz: 'Der Absender', stationen: ['wer-1', 'wer-2'],
      lockt: 'Jemand hat eine Nachricht geschrieben, aber wer? Das findest du heraus.' },
    { id: 'warum', titel: 'Warum sagt er das?', kurz: 'Die Absicht', stationen: ['warum-1', 'warum-2'],
      lockt: 'Jeder schreibt aus einem Grund. Will der Absender informieren, etwas verkaufen oder dich zum Lachen bringen?' },
    { id: 'woher', titel: 'Woher weiß er das?', kurz: 'Die Belege', stationen: ['woher-1', 'woher-2'],
      lockt: 'Woher weiß der Absender, was er schreibt? Hat er es selbst gesehen oder nur gehört?' }
  ],

  /* Versionsnummer der Bilder, getrennt von ?v=N für js und css. */
  bildStand: 1,

  /* Lernzeit: eine Sitzung zählt höchstens 30 Minuten, unter 3 Sekunden gar nicht (ab Etappe 2) */
  lernzeit: { hoechstensSek: 1800, mindestensSek: 3 }
};
