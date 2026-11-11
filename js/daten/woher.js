/* Flaschenpost: Inhalte für Modul „Woher weiß er das?“ (Belege).
   Daten, kein Code. Aufbau wie in js/daten/wer.js, dazu die Aufgabenart 'satz':
     art: 'satz'   Das Kind wählt den Satz aus dem Brief, der den Beleg nennt.
                   Die Sätze schneidet station.js aus dem Brief; „Hier steht kein Beleg.“ gibt es immer dazu.
                   richtigerSatz: genauer Wortlaut des richtigen Satzes (oder null = „kein Beleg“ ist richtig)
                   rueckSatz: Rückmeldung bei einem anderen Satz, rueckKein: bei „Hier steht kein Beleg.“
   Quelle der Texte: Dateien/Beispiele-Entwuerfe/woher-1.md und woher-2.md (von Ingo geprüft am 11.11.2026).
   Szenen und Namen sind ausgedacht. Der Seepferdchen-Fakt ist echt (Belege in woher-1.md). */

export const stationen = {
  'woher-1': {
    modul: 'woher',
    titel: 'Noah und die Seepferdchen',
    uebst: 'Woher weiß er das?',
    rahmen: 'Noah erzählt vor dem Unterricht etwas über Seepferdchen.',
    hinweisEcht: 'Die Szene ist ausgedacht. Was Noah über Seepferdchen erzählt, stimmt aber.',
    brief: {
      text: 'Wusstet ihr das? Bei Seepferdchen bekommt der Vater die Babys! Die Mutter legt ihre Eier in eine Tasche am Bauch des Vaters. Dort wachsen die Kleinen heran. Das habe ich in meinem Tierbuch über das Meer gelesen.',
      unterschrift: 'Noah, vor dem Unterricht'
    },
    aufgaben: [
      {
        id: 'a1', art: 'satz',
        frage: 'Tippe den Satz an, der sagt, woher Noah das weiß.',
        richtigerSatz: 'Das habe ich in meinem Tierbuch über das Meer gelesen.',
        rueckSatz: 'Dieser Satz erzählt, was Noah weiß. Gesucht ist der Satz, der sagt, woher er es weiß.',
        rueckKein: 'Lies den letzten Satz noch einmal.',
        richtigText: 'In diesem Satz sagt Noah, woher er es weiß: aus seinem Tierbuch.',
        erklaerung: 'Ein Beleg zeigt, woher jemand etwas weiß. Noah sagt es selbst: Er hat es in einem Tierbuch gelesen. So kannst du nachschauen.',
        tipps: [
          'Suche ein Wort wie „gelesen“, „gesehen“ oder „gehört“.',
          'Der Satz steht am Ende.',
          'Welcher Satz nennt ein Buch?'
        ]
      },
      {
        id: 'a2', art: 'eine',
        frage: 'Woher weiß Noah das?',
        antworten: [
          { text: 'Er hat es in einem Tierbuch gelesen.', richtig: true },
          { text: 'Er hat es selbst im Meer gesehen.', rueck: 'Davon erzählt Noah nichts.' },
          { text: 'Er hat es nur von jemandem gehört.', rueck: 'Noah sagt, wo er es gelesen hat.' }
        ],
        richtigText: 'Noah sagt: „Das habe ich in meinem Tierbuch gelesen.“',
        erklaerung: 'Selbst gesehen, gelesen oder gehört: Das sind drei verschiedene Wege, etwas zu wissen. Noah hat es gelesen.',
        tipps: ['Lies noch einmal den Satz, den du eben angetippt hast.']
      },
      {
        id: 'a3', art: 'eine',
        frage: 'Ist Noahs Tierbuch eine gute Quelle?',
        antworten: [
          { text: 'Meistens ja. Ein Sachbuch über Tiere ist oft gut geprüft. Man kann darin nachschauen.', richtig: true },
          { text: 'Nein, in Büchern steht nie etwas Richtiges.', rueck: 'In Sachbüchern steht meistens Richtiges. Viele Menschen haben daran gearbeitet.' },
          { text: 'Ja, alles, was irgendwo geschrieben steht, stimmt.', rueck: 'Nicht alles, was geschrieben steht, ist richtig. Ein Sachbuch ist aber meistens gut geprüft.' }
        ],
        richtigText: 'Sachbücher über Tiere sind meistens eine gute Quelle.',
        erklaerung: 'Ein Sachbuch ist eine gute Quelle, weil man nachschauen kann und weil es meistens sorgfältig gemacht ist. Ganz sicher bist du, wenn eine zweite Quelle dasselbe sagt.',
        tipps: [
          'Was ist ein Sachbuch?',
          'Kann man in einem Buch nachschauen?'
        ]
      },
      {
        id: 'a4', art: 'merk',
        frage: 'Du willst prüfen, ob Noah recht hat. Was kannst du tun?',
        hinweis: 'Überlege dir eine Antwort. Dann tippe auf „Vergleichen“.',
        muster: 'Ich frage Noah, ob ich in sein Tierbuch schauen darf. Oder ich suche in einem anderen Tierbuch nach oder frage meine Lehrerin oder meinen Lehrer.',
        selbst: {
          ja: { knopf: 'Hatte ich auch', rueck: 'Super. So prüft man nach.' },
          nein: { knopf: 'Hatte ich noch nicht', rueck: 'Kein Problem. Jetzt weißt du, wie du nachprüfen kannst.' }
        },
        erklaerung: 'Übrigens: Noah hat recht. Bei Seepferdchen trägt wirklich der Vater die Babys in seiner Bauchtasche.',
        tipps: ['Noah hat dir gesagt, wo es steht. Was kannst du damit machen?']
      }
    ],
    zusatz: {
      id: 'z1', art: 'eine',
      frage: 'Ein anderes Kind sagt: „Das stimmt nicht, das habe ich noch nie gehört!“ Wer hat den besseren Beleg?',
      antworten: [
        { text: 'Noah. Er sagt, wo es steht. Das kann man nachprüfen.', richtig: true },
        { text: 'Das andere Kind. Es hat das noch nie gehört.', rueck: '„Noch nie gehört“ ist kein Beleg. Es gibt vieles, was wir noch nicht gehört haben.' },
        { text: 'Beide gleich.', rueck: 'Noah nennt eine Quelle, das andere Kind nicht.' }
      ],
      richtigText: 'Noah nennt eine Quelle, die man nachprüfen kann.',
      erklaerung: 'Etwas noch nie gehört zu haben, heißt nicht, dass es falsch ist. Ein guter Beleg sagt, wo man nachschauen kann.',
      tipps: ['Welches Kind sagt, wo man nachschauen kann?']
    },
    woerter: [
      { wort: 'Beleg', erklaerung: 'Etwas, das zeigt, woher man etwas weiß.', beispiel: '„Das steht in meinem Tierbuch.“' },
      { wort: 'Sachbuch', erklaerung: 'Ein Buch, das echtes Wissen erklärt, zum Beispiel über Tiere.', beispiel: 'ein Tierbuch über das Meer' }
    ],
    amTisch: {
      material: 'Papier und Stift',
      schritte: [
        'Schreibe eine Sache auf, die du über ein Tier weißt.',
        'Schreibe dazu, woher du es weißt: selbst gesehen, gelesen oder gehört?',
        'Tauscht mit dem Nachbarn oder der Nachbarin: Welche Sachen könnte man nachprüfen? Wo?'
      ]
    },
    eintrag: {
      frage: 'Was weißt du über ein Tier? Und woher weißt du es?'
    }
  },

  'woher-2': {
    modul: 'woher',
    titel: 'Der große Fisch am Strand',
    uebst: 'Selbst gesehen oder nur gehört?',
    rahmen: 'Nach dem Wochenende erzählen zwei Kinder von einem großen Fisch am Strand.',
    brief: {
      nachrichten: [
        { text: 'Am Samstag war ich mit Papa am Strand. Da habe ich einen riesigen Fisch gesehen. Er war so lang wie mein Arm! Papa hat ein Foto gemacht.', absender: 'Tim, vor dem Unterricht' },
        { text: 'Mein Cousin sagt, am Strand gibt es einen Fisch, der so groß ist wie ein Auto!', absender: 'Jana, in der Pause' }
      ]
    },
    aufgaben: [
      {
        id: 'a1', art: 'eine',
        frage: 'Wer hat den Fisch selbst gesehen?',
        antworten: [
          { text: 'Tim', richtig: true },
          { text: 'Jana', rueck: 'Jana erzählt, was ihr Cousin sagt. Sie war nicht selbst dabei.' },
          { text: 'Tim und Jana', rueck: 'Nur Tim war am Strand. Jana hat es von ihrem Cousin gehört.' }
        ],
        richtigText: 'Tim sagt: „Da habe ich einen riesigen Fisch gesehen.“',
        erklaerung: 'Tim hat den Fisch selbst gesehen. Jana kennt ihn nur aus einer Erzählung. Wer etwas selbst gesehen hat, kann meistens genauer erzählen.',
        tipps: [
          'Wer war am Samstag am Strand?',
          'Lies, wie Janas Nachricht anfängt.',
          '„Mein Cousin sagt“ heißt: Jana hat es gehört.'
        ]
      },
      {
        id: 'a2', art: 'satz',
        frage: 'Tippe den Satz an, der zeigt: Jana hat es nur gehört.',
        richtigerSatz: 'Mein Cousin sagt, am Strand gibt es einen Fisch, der so groß ist wie ein Auto!',
        rueckSatz: 'Dieser Satz ist von Tim. Gesucht ist Janas Satz.',
        rueckKein: 'Jana sagt selbst, von wem sie es hat.',
        richtigText: '„Mein Cousin sagt“ zeigt: Jana erzählt weiter, was sie gehört hat.',
        erklaerung: 'Wörter wie „er sagt“, „ich habe gehört“ oder „angeblich“ zeigen: Hier wird etwas weitererzählt.',
        tipps: [
          'Janas Nachricht hat nur einen Satz.',
          'Suche die Wörter „Mein Cousin sagt“.'
        ]
      },
      {
        id: 'a3', art: 'eine',
        frage: 'Gibt es am Strand wirklich einen Fisch, der so groß ist wie ein Auto?',
        antworten: [
          { text: 'Ja, Jana hat es doch gesagt.', rueck: 'Jana hat es selbst nur gehört. Sie war nicht dabei.' },
          { text: 'Nein, das ist sicher gelogen.', rueck: 'Vielleicht hat der Cousin wirklich einen großen Fisch gesehen und ein bisschen übertrieben. Wir wissen es nicht.' },
          { text: 'Das weiß ich noch nicht. Jana hat es nur gehört, und ich habe keinen Beleg.', richtig: true }
        ],
        richtigText: 'Ohne Beleg kannst du es noch nicht sagen.',
        erklaerung: 'Wenn etwas oft weitererzählt wird, wird es manchmal größer. „Das weiß ich noch nicht“ ist hier die beste Antwort.',
        tipps: [
          'Hat Jana den Fisch selbst gesehen?',
          'Musst du sofort Ja oder Nein sagen?'
        ]
      },
      {
        id: 'a4', art: 'merk',
        frage: 'Wie könntest du herausfinden, wie groß der Fisch wirklich war?',
        hinweis: 'Überlege dir eine Antwort. Dann tippe auf „Vergleichen“.',
        muster: 'Ich frage Tim, ob ich das Foto sehen darf. Und ich frage Jana, ob ihr Cousin den Fisch selbst gesehen hat.',
        selbst: {
          ja: { knopf: 'Hatte ich auch', rueck: 'Super. Du fragst bei denen nach, die dabei waren.' },
          nein: { knopf: 'Hatte ich noch nicht', rueck: 'Kein Problem. Jetzt weißt du, wen du fragen kannst.' }
        },
        erklaerung: 'Frag möglichst nah an der Quelle: bei dem, der es selbst gesehen hat.',
        tipps: ['Wer war dabei, und wer hat ein Foto?']
      }
    ],
    zusatz: {
      id: 'z1', art: 'eine',
      frage: 'Tim hat ein Foto. Zeigt das Foto genau, wie lang der Fisch war?',
      antworten: [
        { text: 'Das Foto hilft. Aber auf einem Foto sieht man nicht immer, wie groß etwas wirklich ist.', richtig: true },
        { text: 'Ja, ein Foto zeigt immer alles ganz genau.', rueck: 'Ob der Fisch nah an der Kamera war oder weit weg, macht viel aus.' },
        { text: 'Nein, Fotos sind immer falsch.', rueck: 'Ein Foto ist ein guter Beleg dafür, dass Tim den Fisch gesehen hat.' }
      ],
      richtigText: 'Ein Foto hilft, zeigt aber nicht immer die echte Größe.',
      erklaerung: 'Ein Foto zeigt, dass es den Fisch gab. Wie groß er war, sieht man besser, wenn etwas Bekanntes daneben ist, zum Beispiel Tims Arm.',
      tipps: ['Sieht etwas auf einem Foto größer aus, wenn es nah an der Kamera ist?']
    },
    woerter: [
      { wort: 'Augenzeuge', erklaerung: 'Jemand, der etwas selbst gesehen hat.', beispiel: 'Tim ist Augenzeuge, er war am Strand.' },
      { wort: 'nachprüfen', erklaerung: 'schauen, ob etwas wirklich stimmt.', beispiel: 'Ich frage Tim nach dem Foto.' }
    ],
    amTisch: {
      material: 'kein Material, nur ein Zettel und ein Stift für die Lehrkraft',
      schritte: [
        'Stille Post: Die Lehrerin oder der Lehrer schreibt einen kurzen Satz auf einen Zettel und flüstert ihn dem ersten Kind ins Ohr.',
        'Jedes Kind flüstert den Satz einmal weiter.',
        'Das letzte Kind sagt laut, was es gehört hat. Dann wird der Zettel vorgelesen.',
        'Sprecht darüber: Was hat sich verändert? Wer kennt den Satz am genauesten?'
      ]
    },
    eintrag: {
      frage: 'Hast du schon einmal etwas weitererzählt, das du nur gehört hattest?'
    }
  }
};

/* Modul-Abschluss „Woher weiß er das?“ mit Brücke zum KI-Korallenriff (Station „Klingt richtig“).
   Ids nicht mehr ändern. */
export const abschluss = {
  modul: 'woher',
  saetze: [
    { id: 's1', text: 'Ich frage bei einer Nachricht: Woher weiß er das?' },
    { id: 's2', text: 'Ich unterscheide: selbst gesehen, gelesen oder nur gehört.' },
    { id: 's3', text: 'Ich darf sagen: „Das weiß ich noch nicht.“' }
  ],
  bruecke: {
    text: 'Auch ein Computer kann Sätze schreiben, die richtig klingen und trotzdem falsch sind. Wie das kommt, erfährst du im KI-Korallenriff.',
    linkText: 'Zum KI-Korallenriff (Station „Klingt richtig“)',
    url: 'https://setsna.github.io/ki-korallenriff/#c3',
    hinweis: 'Öffnet eine andere Lernseite in einem neuen Tab. Fragt sie nach deinem Namen, schreib ihn auf. Die Station heißt „Klingt richtig“.'
  }
};
