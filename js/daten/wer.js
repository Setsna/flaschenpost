/* Flaschenpost: Inhalte für Modul „Wer sagt das?“ (Absender).
   Daten, kein Code: neue Briefe entstehen hier, ohne dass sich das Programm ändert.
   Quelle der Texte: Dateien/Beispiele-Entwuerfe/wer-1.md und wer-2.md (von Ingo geprüft am 11.11.2026).
   Alle Briefe, Absender und Namen sind ausgedacht.

   Aufbau einer Aufgabe:
     art: 'eine'     eine Antwort wählen       (antworten[].richtig genau einmal true)
          'mehrere'  mehrere Antworten wählen  (antworten[].richtig mindestens einmal true)
          'merk'     Merkfrage mit Musterlösung und Selbsteinschätzung
     frage, erklaerung (kommt immer), tipps (der letzte erst nach einem Versuch)
     antworten[].rueck: was das Kind nach genau dieser falschen Antwort liest
     richtigText / nochNichtText: kurze Rückmeldung (nochNichtText nur bei 'mehrere')

   Brief: entweder ueberschrift + text (+ unterschrift) oder nachrichten: [{ text, absender }] */

export const stationen = {
  'wer-1': {
    modul: 'wer',
    titel: 'Der Zettel an der Tür',
    uebst: 'Wer hat das geschrieben?',
    rahmen: 'Dieser Zettel hing heute Morgen an der Tür der Klasse 3.',
    brief: {
      ueberschrift: 'ACHTUNG!',
      text: 'Ab Montag dürfen in der Mittagspause keine Bälle mehr auf den Schulhof. Wer trotzdem einen Ball mitbringt, muss ihn abgeben. Das ist ganz sicher! Sagt es allen weiter, damit es jeder weiß!',
      unterschrift: ''
    },
    aufgaben: [
      {
        id: 'a1', art: 'eine',
        frage: 'Wer hat den Zettel geschrieben?',
        antworten: [
          { text: 'Die Schulleitung.', rueck: 'Vielleicht war es die Schulleitung, vielleicht nicht. Schau noch einmal ganz unten auf den Zettel: Woran würdest du es erkennen?' },
          { text: 'Ein Kind aus der Klasse 3.', rueck: 'Vielleicht war es ein Kind, vielleicht nicht. Schau noch einmal ganz unten auf den Zettel: Woran würdest du es erkennen?' },
          { text: 'Das steht nicht auf dem Zettel.', richtig: true }
        ],
        richtigText: 'Auf dem Zettel steht kein Name und keine Unterschrift.',
        erklaerung: 'Der Zettel könnte von der Schulleitung sein, von einem Kind oder von jemand anderem. Wir wissen es nicht. „Das weiß ich nicht“ ist hier die ehrliche Antwort. Raten hilft nicht weiter.',
        tipps: [
          'Lies den Zettel noch einmal genau. Steht irgendwo ein Name?',
          'Schau auch ganz unten. Dort steht oft, wer etwas geschrieben hat.',
          'Wenn kein Name dabeisteht, darfst du sagen: Das weiß ich nicht.'
        ]
      },
      {
        id: 'a2', art: 'mehrere',
        frage: 'Was fehlt auf dem Zettel? Tippe alles an, was fehlt.',
        antworten: [
          { text: 'ein Name', richtig: true },
          { text: 'ein Datum', richtig: true },
          { text: 'eine Überschrift' },
          { text: 'was ab Montag neu ist' }
        ],
        richtigText: 'Es fehlen der Name und das Datum.',
        nochNichtText: 'Prüfe jede Antwort einzeln: Steht das auf dem Zettel?',
        erklaerung: 'Es fehlen der Name und das Datum. Ohne Datum weißt du nicht einmal, welcher Montag gemeint ist. Die Überschrift („ACHTUNG!“) und was ab Montag neu ist, stehen dagegen auf dem Zettel.',
        tipps: [
          'Geh die Antworten einzeln durch. Steht das auf dem Zettel: ja oder nein?',
          'Es fehlen zwei Dinge.',
          'Das Wort ACHTUNG ganz oben ist die Überschrift.'
        ]
      },
      {
        id: 'a3', art: 'eine',
        frage: 'Du willst wissen, ob das stimmt. Welche Frage hilft dir am meisten?',
        antworten: [
          { text: 'Wer hat den Zettel aufgehängt?', richtig: true },
          { text: 'Welche Farbe hat der Zettel?', rueck: 'An der Farbe erkennst du nicht, ob die Regel stimmt.' },
          { text: 'Wie viele Kinder haben den Zettel schon gelesen?', rueck: 'Auch wenn viele Kinder den Zettel gelesen haben, wird er davon nicht richtiger.' }
        ],
        richtigText: 'Wenn du weißt, wer ihn geschrieben hat, kannst du dort nachfragen.',
        erklaerung: 'Die wichtigste Frage ist: Wer sagt das? Dann weißt du, wen du fragen kannst. Wie oft etwas gelesen oder weitererzählt wird, sagt nichts darüber, ob es stimmt.',
        tipps: [
          'Welche Frage bringt dich zu der Person, die es wirklich weiß?',
          'Viele Leser machen eine Nachricht nicht wahrer.'
        ]
      },
      {
        id: 'a4', art: 'merk',
        frage: 'Ein Kind sagt zu dir: „Hast du gehört? Ab Montag keine Bälle mehr!“ Was machst du, bevor du es weitersagst?',
        hinweis: 'Überlege dir eine Antwort. Dann tippe auf „Vergleichen“.',
        muster: 'Ich frage, wer das gesagt hat. Dann frage ich eine Lehrerin oder einen Lehrer, ob es stimmt. Bis dahin sage ich: „Das weiß ich noch nicht.“',
        selbst: {
          ja: { knopf: 'Hatte ich auch', rueck: 'Super. So hält sich kein falsches Gerücht.' },
          nein: { knopf: 'Hatte ich noch nicht', rueck: 'Kein Problem. Jetzt weißt du, was du fragen kannst.' }
        },
        erklaerung: 'Nachfragen heißt nicht, dass du jemandem misstraust. Es hilft, dass nichts Falsches herumerzählt wird.',
        tipps: [
          'Wer könnte wissen, ob die Regel wirklich stimmt?',
          'Du musst nicht sofort entscheiden. „Das weiß ich noch nicht“ ist auch eine gute Antwort.'
        ]
      }
    ],
    zusatz: {
      id: 'z1', art: 'eine',
      einleitung: 'Neben dem ersten Zettel hängt jetzt ein zweiter:',
      zettel: {
        text: 'Ab Montag bleiben die Bälle in der Mittagspause in der Klasse. Wir probieren eine neue Pausenregel aus.',
        unterschrift: 'Frau Berg, Schulleitung, 13. November'
      },
      frage: 'Was ist bei diesem Zettel anders?',
      antworten: [
        { text: 'Jetzt weiß ich, wer ihn geschrieben hat, und kann bei ihr nachfragen.', richtig: true },
        { text: 'Jetzt ist ganz sicher, dass es stimmt.', rueck: 'Ein Name macht einen Zettel verlässlicher, aber nicht ganz sicher.' },
        { text: 'Nichts ist anders.', rueck: 'Schau ganz unten: Dort steht jetzt etwas.' }
      ],
      richtigText: 'Unten stehen jetzt Name, Amt und Datum.',
      erklaerung: 'Das hilft dir sehr: Du weißt, wen du fragen kannst und wann es geschrieben wurde. So ein Zettel ist meistens verlässlich. Ganz sicher bist du, wenn du nachgefragt hast.',
      tipps: ['Vergleiche ganz unten: Was steht dort jetzt?']
    },
    woerter: [
      { wort: 'Absender', erklaerung: 'Die Person, die eine Nachricht schreibt oder schickt.', beispiel: 'Auf einem Briefumschlag steht der Absender oft oben links. Manchmal steht das Wort davor:', zeile: 'ABSENDER: Mira, Muschelweg 1, Lagunenstadt' },
      { wort: 'Quelle', erklaerung: 'Das, woher eine Information kommt: eine Person, ein Buch, eine Zeitung oder eine Internetseite.', beispiel: '„Das hat mir meine Lehrerin gesagt.“ Die Lehrerin ist die Quelle.' },
      { wort: 'Gerücht', erklaerung: 'Etwas, das weitererzählt wird, obwohl niemand genau weiß, ob es stimmt.', beispiel: '„Ich habe gehört, dass …“' }
    ],
    amTisch: {
      material: 'Papier und Stift',
      schritte: [
        'Schreibe zwei kurze Nachrichten an deine Klasse. Unter die erste schreibst du deinen Namen. Die zweite bleibt ohne Namen.',
        'Schreib nur nette oder lustige Sachen, nichts über andere Kinder.',
        'Tausche mit deinem Nachbarn oder deiner Nachbarin. Zu Hause tauschst du mit jemandem aus deiner Familie.',
        'Legt die Nachrichten auf zwei Stapel: „Ich weiß, wer es war“ und „Ich weiß es nicht“.',
        'Sprecht darüber: Welcher Nachricht glaubt ihr eher? Warum?'
      ]
    },
    eintrag: {
      frage: 'Was hast du heute entdeckt? Oder: Wo hast du schon einmal eine Nachricht ohne Absender gesehen?'
    }
  },
  'wer-2': {
    modul: 'wer',
    titel: 'Vier Nachrichten zum Ausflug',
    uebst: 'Wer kann es wirklich wissen?',
    rahmen: 'Die Klasse 3 fährt bald ins Aquarium. Dazu gibt es vier Nachrichten. Lies sie genau.',
    brief: {
      nachrichten: [
        { text: 'Am Freitag fährt die Klasse 3 ins Aquarium. Der Bus fährt um 8:30 Uhr ab. Bitte bringt ein Pausenbrot mit.', absender: 'Frau Lindner, Klassenlehrerin' },
        { text: 'Ich glaube, wir fahren schon um 7 Uhr los!', absender: 'Kiki, in der Pause' },
        { text: 'Neu im Aquarium: der Riesen-Krake! Jetzt Karten kaufen!', absender: 'Anzeige in der Riff-Zeitung' },
        { text: 'Mein großer Bruder sagt, im Aquarium darf man die Fische füttern.', absender: 'Ella, auf dem Schulhof' }
      ]
    },
    aufgaben: [
      {
        id: 'a1', art: 'eine',
        frage: 'Wann fährt der Bus ab? Welcher Nachricht glaubst du?',
        antworten: [
          { text: '8:30 Uhr. Das schreibt die Klassenlehrerin.', richtig: true },
          { text: '7 Uhr. Das sagt Kiki.', rueck: 'Kiki sagt „Ich glaube“. Sie ist sich selbst nicht sicher.' },
          { text: 'Das kann ich so noch nicht sagen.', rueck: 'Hier kannst du es schon sagen: Die Lehrerin plant den Ausflug, sie weiß es.' }
        ],
        richtigText: 'Frau Lindner plant den Ausflug. Sie weiß, wann der Bus fährt.',
        erklaerung: 'Die Klassenlehrerin plant den Ausflug. Sie kann es wirklich wissen. Kiki sagt nur, was sie glaubt. Wenn zwei Nachrichten nicht zusammenpassen, frag dich: Wer kann es wirklich wissen?',
        tipps: [
          'Wer plant den Ausflug?',
          'Lies genau, wie Kikis Nachricht anfängt.',
          '„Ich glaube“ heißt: Kiki ist sich nicht sicher.'
        ]
      },
      {
        id: 'a2', art: 'eine',
        frage: 'Ella sagt, man darf im Aquarium die Fische füttern. Wen fragst du am besten?',
        antworten: [
          { text: 'Die Klassenlehrerin oder die Leute vom Aquarium.', richtig: true },
          { text: 'Ellas großen Bruder noch einmal.', rueck: 'Der Bruder hat es schon gesagt. Er bestimmt aber nicht die Regeln im Aquarium.' },
          { text: 'Kiki.', rueck: 'Kiki war genauso wenig dabei wie du.' }
        ],
        richtigText: 'Die Lehrerin oder die Leute vom Aquarium kennen die Regeln dort.',
        erklaerung: 'Frag die Menschen, die es wissen können: die, die den Ausflug planen, oder die, die im Aquarium arbeiten.',
        tipps: [
          'Wer bestimmt, was man im Aquarium darf?',
          'Wer plant den Ausflug oder arbeitet im Aquarium?'
        ]
      },
      {
        id: 'a3', art: 'eine',
        frage: 'Nachricht 3 sagt: „Jetzt Karten kaufen!“ Von wem kommt sie wohl?',
        antworten: [
          { text: 'Vom Aquarium, das Karten verkaufen möchte.', richtig: true },
          { text: 'Von der Klassenlehrerin.', rueck: 'Die Lehrerin schreibt über den Ausflug, nicht über Karten.' },
          { text: 'Von Kiki.', rueck: 'Kiki hat in der Pause etwas erzählt. In die Zeitung schreibt sie nicht.' }
        ],
        richtigText: 'Eine Anzeige bezahlt meistens der, der etwas verkaufen will.',
        erklaerung: 'Die Anzeige steht in der Riff-Zeitung, aber geschrieben hat sie wohl das Aquarium. Es möchte, dass viele Leute kommen. Über euren Ausflug sagt sie nichts.',
        tipps: [
          'Wer möchte, dass jemand Karten kauft?',
          'Eine Anzeige ist Werbung.'
        ]
      },
      {
        id: 'a4', art: 'merk',
        frage: 'Kiki sagt in der Pause: „Ich glaube, wir fahren um 7 Uhr!“ Was antwortest du Kiki?',
        hinweis: 'Überlege dir eine Antwort. Dann tippe auf „Vergleichen“.',
        muster: 'Im Brief von Frau Lindner steht 8:30 Uhr. Sie plant den Ausflug. Wenn du unsicher bist, frag sie morgen.',
        selbst: {
          ja: { knopf: 'Hatte ich auch', rueck: 'Super. So hilfst du auch Kiki.' },
          nein: { knopf: 'Hatte ich noch nicht', rueck: 'Kein Problem. Jetzt weißt du, wie du freundlich helfen kannst.' }
        },
        erklaerung: 'Du musst Kiki nicht auslachen. Zeig ihr, wo die sichere Nachricht steht.',
        tipps: [
          'Welche Nachricht kommt von der Person, die den Ausflug plant?',
          'Wie kannst du Kiki freundlich helfen?'
        ]
      }
    ],
    zusatz: {
      id: 'z1', art: 'eine',
      frage: 'Ist Ellas Nachricht über die Fische falsch?',
      antworten: [
        { text: 'Ja, sie ist sicher falsch.', rueck: 'Vielleicht stimmt es sogar. Wir wissen es nur noch nicht.' },
        { text: 'Das weiß ich noch nicht. Ich frage nach.', richtig: true },
        { text: 'Ja, große Brüder flunkern immer.', rueck: 'Nicht jeder große Bruder flunkert. Vielleicht war er schon einmal dort.' }
      ],
      richtigText: '„Das weiß ich noch nicht“ ist eine gute Antwort.',
      erklaerung: 'Ellas Nachricht kann stimmen oder nicht. Der Bruder war vielleicht schon im Aquarium. Er bestimmt aber nicht die Regeln. Darum: nachfragen.',
      tipps: ['Muss eine Nachricht falsch sein, nur weil du sie nicht prüfen kannst?']
    },
    woerter: [
      { wort: 'verlässlich', erklaerung: 'Eine Quelle ist verlässlich, wenn sie es wirklich wissen kann.', beispiel: 'Die Klassenlehrerin ist für den Ausflug eine verlässliche Quelle.' },
      { wort: 'Anzeige', erklaerung: 'Werbung in einer Zeitung, einer Zeitschrift oder im Internet.', beispiel: '„Jetzt Karten kaufen!“ steht in einer Anzeige.' }
    ],
    amTisch: {
      material: 'Papier und Stift',
      schritte: [
        'Schreibe drei Fragen über eure Schule auf. Zum Beispiel: Wann ist der nächste Ausflug? Wann hat die Bücherei geöffnet? Was gibt es morgen zum Mittagessen?',
        'Schreibe neben jede Frage, wer die Antwort sicher weiß.',
        'Vergleiche mit deinem Nachbarn oder deiner Nachbarin: Habt ihr dieselben Personen aufgeschrieben?'
      ]
    },
    eintrag: {
      frage: 'Wen fragst du, wenn du etwas über die Schule sicher wissen willst?'
    }
  }
};

/* Modul-Abschluss: kommt nach „Fertig!“, sobald alle Briefe des Moduls fertig sind.
   Die Sätze landen mit „Kann ich!“ oder „Übe ich noch“ im Fundbuch (kannIch). Ids nicht mehr ändern. */
export const abschluss = {
  modul: 'wer',
  saetze: [
    { id: 's1', text: 'Ich frage bei einer Nachricht: Wer hat das geschrieben?' },
    { id: 's2', text: 'Ich merke, wenn kein Absender dabeisteht.' },
    { id: 's3', text: 'Ich weiß, wen ich fragen kann, wenn ich etwas sicher wissen will.' }
  ]
};
