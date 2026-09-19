# Physik 3 – Verbindlicher Qualitätsstandard für interaktive Lerneinheiten

Version 1.1

## Zweck

Dieser Standard gilt für alle neuen und überarbeiteten Einheiten der Lernplattform Physik 3.

Ziel ist eine Plattform, die fachlich korrekt, didaktisch wirksam, visuell hochwertig, für Schüler:innen verständlich und technisch konsistent ist. Neue Einheiten werden nicht jedes Mal neu erfunden, sondern nach denselben Qualitätsregeln aufgebaut.

---

## 1. Fachliche Quelle zuerst

Die Wissensdatenbank ist die fachliche Grundlage. Die Plattform ist die didaktische Umsetzung.

Für jede Aufgabe gilt:

- Inhalte müssen durch die ausgewählten Buchseiten bzw. Wissensdatenbank-Einträge gedeckt sein.
- Jede Aufgabe behält intern ihre `sourceRefs`.
- Wenn Kompetenzbezüge vorhanden sind, werden sie intern getrennt als Kompetenzreferenzen geführt.
- Keine zusätzlichen fachlichen Aussagen einschmuggeln, nur weil sie allgemein richtig sind.
- Ableitungen sind erlaubt, wenn sie eindeutig aus den Quellen folgen.
- Unsichere oder ergänzte Inhalte müssen als solche gekennzeichnet werden.
- Buchseiten oder Buchabbildungen werden nicht öffentlich reproduziert. Aufgaben werden neu formuliert und Grafiken neu erstellt.

### Fachliche Freigabe
Vor Veröffentlichung prüfen:
- Ist jede Aussage von der Quelle gedeckt?
- Sind Formelzeichen, Einheiten und Begriffe korrekt?
- Ist die verwendete Darstellung für die Schulstufe üblich?
- Enthält die Aufgabe unbeabsichtigt Wissen aus späteren Seiten?

---

## 2. Denken vor Klicken

Interaktivität allein ist kein Lernziel.

Jede Aufgabe muss eine echte kognitive Entscheidung verlangen.

Bevorzugter Ablauf:

**entscheiden → vollständig bearbeiten → prüfen → korrigieren → ggf. Hinweis → ggf. Lösung**

Nicht akzeptabel:
- durch bloßes Ausprobieren sofort erkennen, wo eine Kachel angenommen wird,
- Sofortfeedback beim Ablegen, das die Lösung verrät,
- Aufgaben, bei denen man ohne fachliches Nachdenken nur weiterklicken muss,
- dekorative Interaktionen ohne Lernfunktion.

Falsche Ablagen müssen grundsätzlich möglich sein, sofern die Aufgabe eine Zuordnung prüft.

---

## 3. Einheitliches Punkteprinzip

Bewertete Aufgaben verwenden möglichst dieselbe Logik.

Standard:
- erster richtiger Versuch: 3 Punkte,
- nach einem Fehlversuch: maximal 2 Punkte,
- nach weiteren Fehlversuchen entsprechend weniger,
- nach eingeblendeter Lösung: 0 Punkte für den betroffenen Teil.

Punkte sollen:
- sorgfältiges Nachdenken belohnen,
- blindes Probieren unattraktiv machen,
- Fehlerkorrektur weiterhin ermöglichen.

Nicht jede Aktivität muss Punkte haben. Offene Experimente dürfen auch nur als durchgeführt markiert werden. Sobald eine fachliche Auswertung bewertet wird, gilt das gemeinsame Punktesystem.

---

## 4. Visualisieren, wenn Physik sichtbar ist

Wenn ein physikalischer Gegenstand oder Aufbau sinnvoll gezeigt werden kann, wird er nicht durch eine bloße Wortkarte ersetzt.

Bevorzugt:
- reale oder stilisierte Bauteile,
- fachlich korrekte Schaltsymbole,
- Messgeräte,
- Diagramme,
- Versuchsanordnungen,
- Messwerte,
- Graphen,
- Animationen,
- hochwertige Simulationen.

Textkarten sind sinnvoll für:
- Aussagen,
- Begriffe,
- Hypothesen,
- Schlussfolgerungen,
- Begründungen.

Technische Bequemlichkeit ist kein Grund für eine textbasierte Ersatzdarstellung.

---

## 5. Schülerkacheln dürfen die Lösung nicht verraten

Auf Schülerkacheln erscheint nur, was für die Aufgabe notwendig ist.

Bei Bildkacheln gilt standardmäßig:
- nur das Bild,
- keine sichtbare Bezeichnung,
- keine Caption, wenn sie die Lösung verrät,
- keine Credits,
- keine Quellen,
- keine Asset-ID,
- keine Wissensdatenbank-ID,
- keine Dateinamen,
- keine Entwicklerhinweise.

Beispiel:
Eine Kachel mit einem geöffneten Schalter darf nicht zusätzlich „Schalter offen“ anzeigen.

Alt-Texte bleiben für Barrierefreiheit vorhanden, werden aber nicht als sichtbare Lösungshilfe dargestellt.

---

## 6. Physikgrafiken müssen fachlich UND geometrisch korrekt sein

Eine Grafik darf nicht nur ungefähr richtig aussehen.

Es gilt:
- schulübliche Standardsymbole verwenden,
- keine unnötig ungewöhnlichen Symbolvarianten,
- Anschlüsse, Pole und Leitungen müssen tatsächlich verbunden sein,
- Bauteile müssen passend zur Leitungsrichtung orientiert sein,
- keine schwebenden oder optisch nur ungefähr angeschlossenen Elemente,
- Zustände wie offen/geschlossen müssen eindeutig erkennbar sein,
- Realansicht und Schaltbildansicht dürfen sich fachlich nicht widersprechen.

Beispiel:
Für eine einzelne Spannungsquelle wird im Unterricht standardmäßig das Symbol einer Zelle verwendet: eine lange und eine kurze Linie. Wird die Zelle in einer vertikalen Leitung eingesetzt, muss das Symbol passend gedreht werden, sodass beide Pole die Leitungen berühren.

---

## 7. Asset-Bibliothek statt Einzelgrafiken

Wiederverwendbare Medien werden als Assets gepflegt.

Jedes Asset erhält intern:
- eindeutige ID,
- Titel,
- Kategorie,
- Thema,
- Dateipfad,
- Alt-Text,
- Herkunft,
- Lizenz,
- Quellenreferenzen,
- mögliche Einsatzformen,
- ggf. Standard-/Normhinweis.

Assets werden erst in Schüleraufgaben verwendet, wenn:
1. Fachbedeutung geklärt ist.
2. Darstellung fachlich geprüft ist.
3. Alt-Text vorhanden ist.
4. Herkunft/Lizenz dokumentiert ist.
5. Darstellung auf Notebook und Tablet lesbar ist.

Interne Asset-Metadaten werden nicht automatisch in der Schüleransicht gezeigt.

---

## 8. LearningApps-/H5P-Prinzip für kurze Übungen

Kurze Übungen sollen medienzentriert und unmittelbar verständlich sein.

Geeignete Formate:
- Bild ↔ Bild,
- Bild ↔ Begriff,
- reale Darstellung ↔ Schaltsymbol,
- visuelle Gruppen,
- Drag auf Bild,
- Hotspots,
- Reihenfolge,
- Paare,
- kurze Quizformen,
- Messwerte/Graphen zuordnen.

Die Interaktion muss ohne lange Bedienungsanleitung verständlich sein.

Große Touch-Ziele und ein klarer visueller Zustand beim Ziehen/Ablegen sind Pflicht.

### Kachelgrößen und Text
- Die Kachel passt sich dem Inhalt an, nicht der Text einer starren Kachel.
- Lange Aussagen werden als breite Aussagekarten dargestellt.
- Text darf niemals sichtbar aus der Kachel hinausragen.
- Lange Wörter müssen innerhalb der Kachel umbrechen können.
- Bild- und Symbolkacheln bleiben kompakter als Textaussagen.
- Zielbereiche dürfen lange Textkarten nicht auf eine für Symbole gedachte Standardbreite zusammendrücken.
- Redundante oder lösungsverratende Captions werden entfernt.

---

## 9. Experimente folgen einem Erkenntnisprozess

Ein gutes virtuelles Experiment ist mehr als ein Regler.

Bevorzugter Ablauf:

**Forschungsfrage → Vermutung → verändern/messen → Messreihe → auswerten → Schlussfolgerung → Vergleich mit Vermutung**

Ein virtuelles Experiment soll mehrere dieser Elemente enthalten:
- manipulierbare Variable,
- sichtbar veränderter Zustand,
- Messgerät oder Messwert,
- Messwertaufnahme,
- Tabelle,
- Diagramm,
- Vergleich,
- Schlussfolgerung.

Wo möglich muss die Vermutung vor der Manipulation abgegeben werden.

---

## 10. PhET sinnvoll einbetten

PhET wird verwendet, wenn die Simulation für den Lernzweck hochwertiger oder reichhaltiger ist als eine Eigenentwicklung.

Die Plattform liefert zusätzlich:
- klare Forschungsaufträge,
- eine Vermutung vor dem Experiment, wenn sinnvoll,
- konkrete Beobachtungsaufträge,
- eine Auswertung,
- eine abschließende fachliche Entscheidung,
- Punkte für die Auswertung, wenn diese bewertet wird.

Die Plattform darf nicht davon ausgehen, dass sie interne PhET-Zustände aus dem eingebetteten Frame auslesen kann.

PhET-Attribution bleibt sichtbar, aber interne Quellen-IDs der Lernplattform gehören nicht in die Schüleransicht.

---

## 11. Schüleransicht bleibt frei von Entwicklertext

Nicht in die Schüleransicht gehören:
- Architekturentscheidungen,
- Hinweise zur Programmierung,
- interne Versionsbegriffe,
- Asset-Herkunft, sofern keine Lizenzattribution sichtbar sein muss,
- Quellen-IDs,
- technische Begründungen,
- Aussagen wie „wurde selbst entwickelt, weil …“.

Schüler:innen sehen:
- Aufgabe,
- relevante fachliche Information,
- Bedienhinweis,
- Punkte/Fortschritt,
- Feedback,
- ggf. fachlich notwendige Attribution.

---

## 12. Fortschritt und Ergebnisse

Für jede Einheit sollen Aktivitäten einheitlich als
- offen,
- begonnen,
- abgeschlossen

darstellbar sein.

Bewertete Aktivitäten speichern:
- erreichte Punkte,
- Maximalpunkte,
- Abschlussstatus,
- ggf. Nutzung der Lösung.

Der Einheitenfortschritt zeigt:
- abgeschlossene Aktivitäten,
- Fortschrittsanteil,
- bisherige Punkte aus bewerteten Bereichen.

In Phase 1 erfolgt die Speicherung lokal im Browser. Später kann dieselbe Logik in ein Backend übernommen werden.

---

## 13. Kapitel-Check statt reiner Abschlussprüfung

Ein Kapitel-Check soll verschiedene Denkformen mischen.

Bevorzugte Mischung:
- visuelle Zuordnung,
- Konzeptverständnis,
- Fehlererkennung,
- Messwert-/Diagramminterpretation,
- kurze Rechenaufgabe,
- ggf. Experimentauswertung.

Ein Teil des Pools darf bei jedem Start neu ausgewählt werden.

Der Kapitel-Check soll nicht nur dieselben Aufgaben wiederholen, die direkt davor bereits identisch gelöst wurden.

---

## 14. Konsistente Komponenten statt Sonderlösungen

Neue Aufgaben sollen vorhandene Bausteine wiederverwenden:
- gemeinsames Drag-&-Drop,
- gemeinsames Punkte-System,
- gemeinsame Feedbackzustände,
- gemeinsame Fortschrittslogik,
- gemeinsame Asset-Registry.

Neue Sonderlogik wird nur eingeführt, wenn der Aufgabentyp einen echten didaktischen Mehrwert bietet.

---

## 15. Bedienbarkeit und Barrierefreiheit

Pflicht:
- Maus und Touch,
- sinnvolle Klick-/Tap-Alternative für Drag-&-Drop,
- große Zielbereiche,
- gute Kontraste,
- lesbare Schriftgrößen,
- Alt-Texte,
- keine Information ausschließlich über Farbe,
- reduzierte Bewegung berücksichtigen,
- mobile Darstellung ohne Funktionsverlust.

---

## 16. Technische Freigabe

Eine Änderung gilt erst als veröffentlicht, wenn mindestens:
- Inhaltsvalidierung erfolgreich,
- TypeScript-Build erfolgreich,
- Vite-Build erfolgreich,
- Publish erfolgreich,
- GitHub-Pages-Deploy erfolgreich.

Ein fehlgeschlagener Zwischencommit ist kein freigegebener Stand.


---

## 17. Standardworkflow für neue Einheiten

Jede neue Einheit wird mit `docs/EINHEITEN_VORLAGE.md` geplant.

Die technische Ausgangsdatei ist:
`docs/templates/NEUE_EINHEIT.template.ts.txt`

Kurzworkflow:
`docs/NEUE_EINHEIT_WORKFLOW.md`

Verbindliche Reihenfolge:

**Quelle → fachliche Grenzen → Lernziele → Denkhandlungen → Aktivitätsmix → Asset-Plan → Umsetzung → Kapitel-Check → Qualitätsprüfung → Deploy**

Die vorhandene Referenzeinheit darf als Qualitätsbeispiel dienen, aber ihre Aktivitätstypen werden nicht mechanisch kopiert.

---

# Freigabe-Checkliste für jede neue Aufgabe

Vor Veröffentlichung mit JA beantworten:

### Fachlich
- [ ] Ist jede fachliche Aussage durch die gewählte Quelle gedeckt?
- [ ] Stimmen Formelzeichen, Einheit und Terminologie?
- [ ] Ist die Darstellung für diese Schulstufe üblich?
- [ ] Sind Anschlüsse, Pole, Messpunkte und Geometrie korrekt?

### Didaktisch
- [ ] Muss der Schüler wirklich entscheiden oder nachdenken?
- [ ] Ist blindes Probieren nicht der einfachste Lösungsweg?
- [ ] Erfolgt Prüfung erst nach einer echten Entscheidung?
- [ ] Sind Hinweis und Lösung sinnvoll gestuft?
- [ ] Passt die Punkte-Logik zum gemeinsamen System?

### Visuell
- [ ] Wird ein darstellbares Physikobjekt tatsächlich gezeigt?
- [ ] Verrät keine Beschriftung die Lösung?
- [ ] Sind keine internen Metadaten sichtbar?
- [ ] Ist das Medium fachlich sauber und gut lesbar?
- [ ] Sind Touch-Ziele groß genug?
- [ ] Bleibt jeder Text vollständig innerhalb seiner Kachel?
- [ ] Ist die Kachelbreite der Textmenge angemessen?
- [ ] Sind unnötige oder lösungsverratende Captions entfernt?

### Experiment
- [ ] Gibt es eine klare Forschungsfrage?
- [ ] Muss vor dem Experiment eine Vermutung abgegeben werden, wenn sinnvoll?
- [ ] Werden Messungen oder Beobachtungen tatsächlich ausgewertet?
- [ ] Gibt es eine Schlussfolgerung statt nur „fertig“?

### Technik
- [ ] Funktioniert Maus?
- [ ] Funktioniert Touch/Klick-Fallback?
- [ ] Funktioniert Punkte-/Fortschrittsspeicherung?
- [ ] Ist die mobile Ansicht brauchbar?
- [ ] Läuft der vollständige Build und Deploy grün?

Wenn ein kritischer Punkt mit NEIN beantwortet wird, wird die Aufgabe vor Veröffentlichung überarbeitet.

---

# Referenz-Einheit

Die Einheit **Kapitel 3 · Elektrizität · S. 44–49** dient als erste Referenz für diesen Qualitätsstandard.

Sie enthält als Muster:
- Grundlagen-Check mit Punkten,
- visuelle Bauteil-/Schaltsymbol-Zuordnung,
- Bild-Drag-Aufgabe,
- Denken-&-Prüfen-Kachelaufgaben,
- PhET-Forschungsauftrag mit Vermutung und Auswertung,
- virtuelles Widerstands-Labor mit Messreihe,
- Fortschrittsanzeige,
- Kapitel-Check.

Neue Einheiten sollen sich an diesem Zusammenspiel orientieren, ohne die Aufgabentypen mechanisch zu kopieren.
