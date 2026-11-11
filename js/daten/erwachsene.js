/* Flaschenpost: Texte für Lehrkräfte und Eltern (zwei Aufklapper am Ende der Startseite).
   Quelle: Ausgaben/Erwachsenenbereich Entwurf.md (von Ingo geprüft am 11.11.2026). Ansprache: Sie.
   Daten, kein Code: Absätze sind Strings, Listen sind Arrays. */

export const eltern = {
  titel: 'Für Lehrkräfte und Eltern',
  abschnitte: [
    {
      titel: 'Worum es geht',
      absaetze: [
        'Die Flaschenpost übt mit Kindern der Klassen 3 und 4 eine einfache Denkweise. Bei jeder Nachricht fragen sie: Wer sagt das? Warum sagt er das? Woher weiß er das?',
        'Es geht nicht darum, zu raten, ob etwas „echt“ oder „fake“ ist. Die Kinder begründen ihre Antwort. „Das weiß ich noch nicht“ ist dabei ausdrücklich eine gute Antwort. Und nicht alles ist falsch: Viele Quellen sind verlässlich, und die Kinder lernen, sie zu erkennen.'
      ]
    },
    {
      titel: 'Prinzip und Umsetzung',
      tabelle: [
        ['Drei Fragen statt Tricks', 'Jeder Brief übt eine der drei Fragen. Sie gelten auch in einigen Jahren noch. Aufgaben wie „Ist dieses Bild von einer KI?“ gibt es bewusst nicht, weil sich solche Merkmale schnell ändern.'],
        ['Begründen statt Raten', 'Nach jeder Antwort kommt eine Erklärung, auch nach einer richtigen. Bei einer falschen Antwort gibt es einen Hinweis und einen zweiten Versuch.'],
        ['„Das weiß ich noch nicht“ ist erlaubt', 'Bei manchen Aufgaben ist das die richtige Antwort, bei anderen nicht. So bleibt sie eine echte Entscheidung und kein Ausweg.'],
        ['Nicht alles ist Fake', 'Verlässliche Quellen kommen vor: die Klassenlehrerin, ein Sachbuch, ein Zettel mit Name und Datum.'],
        ['Ruhe statt Druck', 'Keine Punkte, keine Uhr, kein Ranking. Die Lernzeit wird angezeigt, aber nicht zusammengezählt.'],
        ['Hilfe ohne Lösung', 'Das Seepferdchen Mira gibt gestufte Tipps. Mira ist keine KI, die Tipps sind vorbereitet. Ist die Lösung schon sichtbar, gibt es keine Tipps mehr.'],
        ['Lernen auch ohne Bildschirm', 'Zu jedem Brief gehört eine Aufgabe „Am Tisch“ mit Papier und Stift.'],
        ['Ehrliche Selbsteinschätzung', 'Am Ende jedes Themas schätzen die Kinder Sätze wie „Ich merke, wenn kein Absender dabeisteht“ ein: „Kann ich!“ oder „Übe ich noch“. Beides ist in Ordnung.']
      ]
    },
    {
      titel: 'Zu Hause',
      liste: [
        ['Gemeinsam nachfragen:', 'Bei Werbung, einem Zettel im Briefkasten oder einer Nachricht in der Familie fragen: „Wer hat das geschrieben?“'],
        ['Werbung zusammen anschauen:', 'Was soll ich kaufen? Was wird versprochen? Was wird nicht gesagt?'],
        ['Selbst vormachen:', 'Sagen Sie ruhig einmal „Das weiß ich noch nicht, das schaue ich nach.“ Kinder lernen viel daraus, dass Erwachsene nachprüfen.'],
        ['Fragen statt belehren:', '„Woher weißt du das?“ hilft meist mehr als „Das stimmt nicht.“'],
        ['Neugier statt Misstrauen:', 'Nicht alles, was man liest oder hört, ist falsch. Ziel ist, gute Quellen zu erkennen und Unsicheres nachzuprüfen.']
      ]
    },
    {
      titel: 'Daten',
      absaetze: [
        'Es gibt kein Konto und keine Anmeldung. Gespeichert werden der Vorname, der Lernstand und die eigenen Einträge, und zwar nur im Browser dieses Geräts. Nichts wird an einen Server geschickt. Eine Sicherungskopie gibt es nicht: Werden die Browserdaten gelöscht, ist der Stand weg. Arbeiten mehrere Kinder an einem Gerät, sind ihre Namen nicht durch ein Passwort geschützt.'
      ],
      datenschutzLink: true
    },
    {
      titel: 'Mehr zum Thema KI',
      absaetze: [
        'Wie Künstliche Intelligenz funktioniert und warum ein Chatbot manchmal überzeugend falsch liegt, üben die Kinder im KI-Korallenriff. Es ist genauso gebaut: ohne Konto und ohne Werbung.'
      ],
      link: { text: 'Zum KI-Korallenriff', url: 'https://setsna.github.io/ki-korallenriff/' }
    }
  ]
};

export const lehrkraefte = {
  titel: 'Für Lehrkräfte: Einsatz im Unterricht',
  abschnitte: [
    {
      titel: 'Ablauf',
      liste: [
        ['Aufbau:', 'drei Themen mit je zwei Briefen: „Wer sagt das?“ (Absender), „Warum sagt er das?“ (Absicht), „Woher weiß er das?“ (Belege). Die Reihenfolge ist empfohlen, die Briefe bauen aufeinander auf.'],
        ['Zeit:', 'Ein Brief dauert am iPad etwa 10 bis 15 Minuten, dazu kommt die Aufgabe „Am Tisch“. Das ist geschätzt, ein Test mit Kindern steht noch aus.'],
        ['Material für „Am Tisch“:', 'Papier und Stift, bei einem Brief auch Buntstifte. Für „Stille Post“ braucht nur die Lehrkraft einen Zettel.'],
        ['Ausgedacht:', 'Alle Briefe, Absender, Firmen und Namen sind ausgedacht. Eine Ausnahme: Was im Brief „Noah und die Seepferdchen“ über Seepferdchen steht, ist ein echter Sachverhalt.'],
        ['Fundbuch:', 'Jedes Kind sieht dort seine Siegel, seine Lernzeit, seine Selbsteinschätzung und seine Einträge. Mit „Teilen“ schickt ein Kind seine Einträge über das Teilen-Menü des iPads, zum Beispiel per AirDrop an die Lehrkraft. „Alles kopieren“ holt sie in ein Dokument. Nach allen sechs Briefen gibt es dort eine Urkunde als PDF.']  /* „sechs“ anpassen, wenn Briefe dazukommen */
      ]
    },
    {
      titel: 'Lehrplanbezug',
      absaetze: ['Lehrplan Thüringen (Erprobungsfassung) und Mediencurriculum der Schule:'],
      liste: [
        ['Deutsch:', 'Medien kritisch hinterfragen (S. 11); Fragen an den Text stellen, Informationen mit Textstellen belegen, Sinnhaftigkeit von Aussagen prüfen (S. 25); Textsorten in Form, Inhalt und Absicht vergleichen, Autor oder Autorin einer Information erkennen (S. 28).'],
        ['Heimat- und Sachkunde:', 'Informationen suchen und bewerten (S. 11); den Wahrheitsgehalt von Informationen kritisch prüfen (S. 21); Werbung und ihre Wirkung untersuchen (Klasse 4, S. 32).'],
        ['Mediencurriculum der Schule Klasse 3/4:', 'die Autorenschaft einer Quelle erkennen, den Informationsgehalt einer Quelle altersangemessen bewerten (S. 16, S. 24).']
      ]
    }
  ]
};
