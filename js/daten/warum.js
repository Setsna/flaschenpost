/* Flaschenpost: Inhalte für Modul „Warum sagt er das?“ (Absicht).
   Daten, kein Code. Aufbau wie in js/daten/wer.js (dort steht die Beschreibung der Felder).
   Quelle der Texte: Dateien/Beispiele-Entwuerfe/warum-1.md und warum-2.md (von Ingo geprüft am 11.11.2026).
   Alle Briefe, Firmen, Läden und Absender sind ausgedacht. */

export const stationen = {
  'warum-1': {
    modul: 'warum',
    titel: 'Der Seegras-Saft',
    uebst: 'Was will der Absender erreichen?',
    rahmen: 'Diese Anzeige stand in der Riff-Zeitung.',
    brief: {
      ueberschrift: 'NEU! Seegras-Saft',
      text: 'Ein Schluck, und du bist stark wie ein Hai! Alle Kinder lieben ihn. Nur diese Woche: zwei Flaschen zum Preis von einer. Jetzt im Riff-Laden!',
      unterschrift: 'Anzeige der Firma Wellengrün'
    },
    aufgaben: [
      {
        id: 'a1', art: 'eine',
        frage: 'Warum gibt es diese Anzeige?',
        antworten: [
          { text: 'Die Firma möchte, dass du den Saft kaufst.', richtig: true },
          { text: 'Die Zeitung möchte dir etwas über Haie erklären.', rueck: 'Der Hai kommt nur in einem Werbesatz vor. Über Haie lernst du hier nichts.' },
          { text: 'Die Zeitung möchte dir einen Tipp für gesundes Trinken geben.', rueck: 'Unten steht, wer das geschrieben hat: die Firma Wellengrün, nicht die Zeitung. Und ein Tipp sagt nicht „Jetzt im Riff-Laden!“.' }
        ],
        richtigText: 'Die Firma Wellengrün will ihren Saft verkaufen.',
        erklaerung: 'Eine Anzeige will meistens etwas verkaufen. Die Firma bezahlt die Zeitung dafür, dass ihre Anzeige dort steht.',
        tipps: [
          'Lies ganz unten: Wer hat die Anzeige geschrieben?',
          'Was möchte eine Firma, die Saft macht?',
          'Lies den letzten Satz: „Jetzt im Riff-Laden!“'
        ]
      },
      {
        id: 'a2', art: 'mehrere',
        frage: 'Woran erkennst du, dass die Anzeige etwas verkaufen will? Tippe alles an, was passt.',
        antworten: [
          { text: '„Jetzt im Riff-Laden!“', richtig: true },
          { text: '„zwei Flaschen zum Preis von einer“', richtig: true },
          { text: '„Anzeige der Firma Wellengrün“', richtig: true },
          { text: 'Die Anzeige erklärt, wie Seegras wächst.' }
        ],
        richtigText: 'Alle drei Stellen zeigen: Hier soll etwas gekauft werden.',
        nochNichtText: 'Prüfe jede Antwort: Steht das so in der Anzeige?',
        erklaerung: 'Werbung erkennst du oft daran: Sie sagt, wo du etwas kaufen kannst. Sie macht ein Angebot. Und manchmal steht das Wort „Anzeige“ dabei. Wie Seegras wächst, steht nicht in der Anzeige.',
        tipps: [
          'Geh jede Antwort einzeln durch: Steht das in der Anzeige?',
          'Drei Antworten passen.',
          'Erklärt die Anzeige wirklich etwas über Seegras?'
        ]
      },
      {
        id: 'a3', art: 'eine',
        frage: '„Ein Schluck, und du bist stark wie ein Hai!“ Stimmt das?',
        antworten: [
          { text: 'Ja, das steht doch in der Zeitung.', rueck: 'Es steht in einer Anzeige. Die schreibt die Firma, nicht die Zeitung.' },
          { text: 'Nein. Das ist ein großes Versprechen. Ein Saft macht nicht so stark wie ein Hai.', richtig: true },
          { text: 'Ja, weil alle Kinder ihn lieben.', rueck: '„Alle Kinder lieben ihn“ ist auch ein Werbesatz. Woher will die Firma das wissen?' }
        ],
        richtigText: 'Werbung verspricht gern mehr, als ein Saft halten kann.',
        erklaerung: 'Werbung lobt, was sie verkaufen will. Große Versprechen wie „stark wie ein Hai“ sollen Lust auf den Saft machen. Ob er schmeckt, weißt du erst, wenn du ihn probierst.',
        tipps: [
          'Kann ein Saft einen Menschen so stark machen wie einen Hai?',
          'Wer hat diesen Satz geschrieben: die Zeitung oder die Firma?'
        ]
      },
      {
        id: 'a4', art: 'merk',
        frage: 'Dein Freund will sofort zwei Flaschen kaufen. Was sagst du ihm?',
        hinweis: 'Überlege dir eine Antwort. Dann tippe auf „Vergleichen“.',
        muster: 'Das ist eine Anzeige. Die Firma will ihren Saft verkaufen. Stark wie ein Hai macht kein Saft. Überleg erst, ob du ihn wirklich willst.',
        selbst: {
          ja: { knopf: 'Hatte ich auch', rueck: 'Super. Du hast die Werbung durchschaut.' },
          nein: { knopf: 'Hatte ich noch nicht', rueck: 'Kein Problem. Jetzt weißt du, worauf du achten kannst.' }
        },
        erklaerung: 'Kaufen darf man trotzdem. Wichtig ist, dass du weißt: Werbung will dich überreden.',
        tipps: [
          'Wer hat die Anzeige geschrieben, und was will er?',
          'Welcher Satz in der Anzeige verspricht zu viel?'
        ]
      }
    ],
    zusatz: {
      id: 'z1', art: 'eine',
      frage: 'Ist Werbung immer schlecht?',
      antworten: [
        { text: 'Ja, Werbung lügt immer.', rueck: 'Werbung darf zeigen, was es zu kaufen gibt. Vieles davon stimmt auch.' },
        { text: 'Nein. Werbung zeigt, was es gibt. Aber sie zeigt nur die guten Seiten.', richtig: true },
        { text: 'Nein, Werbung sagt immer die Wahrheit.', rueck: 'Werbung lobt nur. Was nicht so gut ist, steht meistens nicht drin.' }
      ],
      richtigText: 'Werbung zeigt nur die guten Seiten.',
      erklaerung: 'Werbung ist nicht verboten und nicht immer falsch. Sie erzählt aber nur das Gute. Darum lohnt es sich, selbst nachzudenken.',
      tipps: ['Zeigt Werbung auch, was an einem Saft nicht so gut ist?']
    },
    woerter: [
      { wort: 'Werbung', erklaerung: 'Nachrichten, die dich dazu bringen sollen, etwas zu kaufen.', beispiel: 'Eine Anzeige in der Zeitung ist Werbung.' },
      { wort: 'Absicht', erklaerung: 'Das, was jemand mit seiner Nachricht erreichen will.', beispiel: 'Die Absicht der Anzeige ist: verkaufen.' },
      { wort: 'Angebot', erklaerung: 'Etwas gibt es für kurze Zeit günstiger.', beispiel: '„Nur diese Woche: zwei Flaschen zum Preis von einer.“' }
    ],
    amTisch: {
      material: 'Papier, Stift und Buntstifte',
      schritte: [
        'Erfinde selbst eine Anzeige für etwas Ausgedachtes, zum Beispiel einen fliegenden Radiergummi.',
        'Male ein kleines Bild und schreibe zwei Werbesätze dazu.',
        'Tauscht mit dem Nachbarn oder der Nachbarin: Woran erkennt ihr, dass es Werbung ist?'
      ]
    },
    eintrag: {
      frage: 'Wo hast du schon einmal Werbung gesehen? Was wollte sie dir verkaufen?'
    }
  },

  'warum-2': {
    modul: 'warum',
    titel: 'Drei Texte über die neue Bank',
    uebst: 'Informieren, unterhalten oder überzeugen?',
    rahmen: 'Auf dem Schulhof steht eine neue Bank. Drei Texte erzählen davon.',
    brief: {
      nachrichten: [
        { text: 'Seit Montag steht neben dem Klettergerüst eine neue Holzbank. Der Hausmeister hat sie aufgebaut. Sie hat Platz für sechs Kinder.', absender: 'Schülerzeitung' },
        { text: 'Treffen sich zwei Bänke. Sagt die eine: „Komm, setz dich zu mir!“', absender: 'Witz-Ecke der Schülerzeitung' },
        { text: 'Eine Bank ist zu wenig! Wir wünschen uns eine zweite Bank am Fußballplatz. Unterschreibt hier, wenn ihr auch eine wollt!', absender: 'Plakat der Klasse 4' }
      ]
    },
    aufgaben: [
      {
        id: 'a1', art: 'eine',
        frage: 'Was will die Schülerzeitung mit Text 1?',
        antworten: [
          { text: 'Sie will informieren: Was ist neu auf dem Schulhof?', richtig: true },
          { text: 'Sie will dir eine Bank verkaufen.', rueck: 'In Text 1 steht kein Preis und kein Laden.' },
          { text: 'Sie will dich zum Lachen bringen.', rueck: 'Text 1 enthält keinen Witz. Er erzählt nur, was neu ist.' }
        ],
        richtigText: 'Text 1 erzählt, was passiert ist: wo, wann und wie viele Kinder Platz haben.',
        erklaerung: 'Wer informiert, erzählt, was passiert ist. Er will dich nicht überreden.',
        tipps: [
          'Was erfährst du aus Text 1?',
          'Steht in Text 1 ein Witz oder ein Preis?',
          'Wann, wo, wie viele: So schreibt man, wenn man informiert.'
        ]
      },
      {
        id: 'a2', art: 'eine',
        frage: 'Welcher Text will dich zum Lachen bringen?',
        antworten: [
          { text: 'Text 1', rueck: 'Text 1 erzählt, was neu ist. Er will informieren.' },
          { text: 'Text 2', richtig: true },
          { text: 'Text 3', rueck: 'Text 3 möchte, dass du unterschreibst. Lustig sein will er nicht.' }
        ],
        richtigText: 'Text 2 ist ein Witz aus der Witz-Ecke. Er will unterhalten.',
        erklaerung: 'Witze, Rätsel und lustige Geschichten wollen unterhalten. Ob Bänke wirklich sprechen, ist dabei egal: Alle wissen, dass es ein Witz ist.',
        tipps: [
          'Lies, von wem die Texte kommen.',
          'Welcher Text steht in der Witz-Ecke?'
        ]
      },
      {
        id: 'a3', art: 'eine',
        frage: 'Was will die Klasse 4 mit ihrem Plakat?',
        antworten: [
          { text: 'Sie will dich überzeugen, dass eine zweite Bank gut wäre.', richtig: true },
          { text: 'Sie will dir eine Bank verkaufen.', rueck: 'Die Klasse 4 will kein Geld. Sie will, dass du mitmachst.' },
          { text: 'Sie will nur erzählen, wie viele Bänke es gibt.', rueck: '„Eine Bank ist zu wenig!“ ist eine Meinung. Die Klasse 4 will mehr als erzählen.' }
        ],
        richtigText: 'Die Klasse 4 möchte, dass du ihrer Meinung bist und unterschreibst.',
        erklaerung: 'Wer überzeugen will, möchte, dass du seiner Meinung bist oder etwas tust. Das ist erlaubt. Du darfst aber selbst entscheiden.',
        tipps: [
          'Was soll man am Ende von Text 3 tun?',
          'Will die Klasse 4 Geld oder deine Unterschrift?'
        ]
      },
      {
        id: 'a4', art: 'merk',
        frage: 'Ein Kind aus der Klasse 4 fragt dich: „Unterschreibst du auch?“ Was überlegst du, bevor du unterschreibst?',
        hinweis: 'Überlege dir eine Antwort. Dann tippe auf „Vergleichen“.',
        muster: 'Ich überlege: Was wollen sie? Eine zweite Bank. Finde ich das auch gut? Ich darf Ja sagen oder Nein.',
        selbst: {
          ja: { knopf: 'Hatte ich auch', rueck: 'Super. Du entscheidest selbst.' },
          nein: { knopf: 'Hatte ich noch nicht', rueck: 'Kein Problem. Jetzt weißt du: Du darfst in Ruhe überlegen.' }
        },
        erklaerung: 'Jemand darf versuchen, dich zu überzeugen. Ob du mitmachst, entscheidest du.',
        tipps: [
          'Was möchte die Klasse 4 genau?',
          'Musst du unterschreiben, oder darfst du wählen?'
        ]
      }
    ],
    zusatz: {
      id: 'z1', art: 'eine',
      frage: 'Darf die Klasse 4 versuchen, dich zu überzeugen?',
      antworten: [
        { text: 'Ja, das ist erlaubt. Ich entscheide selbst.', richtig: true },
        { text: 'Nein, überzeugen ist verboten.', rueck: 'Jeder darf sagen, was er sich wünscht, und andere fragen.' },
        { text: 'Ja, und ich muss dann mitmachen.', rueck: 'Du darfst auch Nein sagen.' }
      ],
      richtigText: 'Überzeugen ist erlaubt. Du entscheidest selbst.',
      erklaerung: 'Überzeugen ist in Ordnung, wenn niemand gezwungen wird. Du hörst zu, denkst nach und entscheidest selbst.',
      tipps: ['Darf man anderen sagen, was man sich wünscht?']
    },
    woerter: [
      { wort: 'informieren', erklaerung: 'erzählen, was passiert ist.', beispiel: '„Seit Montag steht eine neue Bank auf dem Schulhof.“' },
      { wort: 'unterhalten', erklaerung: 'jemanden zum Lachen bringen oder ihm Spaß machen.', beispiel: 'ein Witz in der Witz-Ecke' },
      { wort: 'überzeugen', erklaerung: 'jemanden dazu bringen, dass er derselben Meinung ist oder mitmacht.', beispiel: '„Unterschreibt hier, wenn ihr auch eine Bank wollt!“' }
    ],
    amTisch: {
      material: 'Papier und Stift',
      schritte: [
        'Denkt euch zu zweit ein Thema aus, zum Beispiel ein neues Pausenspiel.',
        'Schreibt drei kurze Sätze dazu: einen, der informiert, einen, der zum Lachen bringt, und einen, der überzeugen will.',
        'Lest sie einem anderen Paar vor. Die anderen raten: Was will jeder Satz?'
      ]
    },
    eintrag: {
      frage: 'Hat dich schon einmal jemand von etwas überzeugt? Wovon?'
    }
  }
};

/* Modul-Abschluss „Warum sagt er das?“. Ids nicht mehr ändern. */
export const abschluss = {
  modul: 'warum',
  saetze: [
    { id: 's1', text: 'Ich frage bei einer Nachricht: Warum schreibt jemand das?' },
    { id: 's2', text: 'Ich erkenne Werbung, die mir etwas verkaufen will.' },
    { id: 's3', text: 'Ich weiß: Ich darf selbst entscheiden, ob mich jemand überzeugt.' }
  ]
};
