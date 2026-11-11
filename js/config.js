/* Flaschenpost: alle Einstellungen an einer Stelle. */

export const config = {
  name: 'Flaschenpost',
  unterzeile: 'Wer hat das geschrieben?',
  maskottchen: 'Mira',

  /* Speicher im Browser. Ändert sich der Aufbau der Daten, schema hochzählen
     und in js/speicher.js eine Umwandlung vom alten Stand ergänzen. */
  speicher: {
    schluessel: 'flaschenpost',        /* localStorage: flaschenpost-v<schema> */
    schema: 1,
    werSchluessel: 'flaschenpost-wer'  /* sessionStorage: welches Kind in diesem Tab arbeitet */
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
