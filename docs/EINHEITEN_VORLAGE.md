# Physik 3 – Vorlage für neue Lerneinheiten

Version 1.0

Diese Vorlage ist der Standardablauf für jede neue Einheit der Lernplattform.

Sie wird **vor der Programmierung** ausgefüllt. Die Wissensdatenbank liefert die fachliche Grundlage; diese Vorlage entscheidet, wie daraus eine didaktisch sinnvolle digitale Einheit wird.

---

# A. Einheit festlegen

## 1. Identität

- **Unit-ID:** `...`
- **Kapitel:** ...
- **Thema:** ...
- **Buchseiten:** S. ...–...
- **Arbeitstitel für Schüler:innen:** ...
- **Kurze Beschreibung:** ...

### Abgrenzung
- Gehört fachlich in diese Einheit:
  - ...
- Gehört ausdrücklich noch NICHT in diese Einheit:
  - ...

Die Seitengrenzen werden nicht automatisch übernommen. Ein Themenblock darf größer oder kleiner als ein Seitenintervall sein, wenn das didaktisch sinnvoller ist.

---

# B. Fachliche Grundlage aus der Wissensdatenbank

## 2. Quellenpaket

### Merksätze / Fachwissen
- `SOURCE-ID` – ...
- `SOURCE-ID` – ...

### Formeln / Definitionen
- `SOURCE-ID` – ...

### Kompetenzen
- `KOMP-ID` – ...

### Wichtige Einschränkungen
Hier wird notiert, was die Quelle **nicht** aussagt.

Beispiele:
- Richtung eines Zusammenhangs nicht angegeben
- genaue Symbolform nicht aus Buchtext ableitbar
- Begriff erst auf späterer Seite eingeführt
- nur qualitative, noch keine quantitative Aussage

Dieser Block verhindert, dass die Plattform unbemerkt Wissen aus späteren Kapiteln einführt.

---

# C. Lernziele

## 3. Nach der Einheit können Schüler:innen ...

Maximal 4–6 überprüfbare Lernziele.

Formulierung mit beobachtbarer Handlung:

- ... erkennen.
- ... zuordnen.
- ... erklären.
- ... messen.
- ... vergleichen.
- ... aus Messwerten schließen.
- ... berechnen.

Nicht verwenden:
- „verstehen“
- „kennen“
- „wissen“

wenn nicht zusätzlich beschrieben wird, woran das sichtbar wird.

---

# D. Didaktische Entscheidungen

## 4. Welche Denkhandlungen brauchen wir?

Für jedes Lernziel mindestens eine geeignete Denkhandlung auswählen.

| Lernziel | Denkhandlung | Geeignete digitale Form |
|---|---|---|
| ... | erkennen / unterscheiden | Bildkacheln, Hotspot |
| ... | zuordnen | Bild ↔ Symbol, Drag & Drop |
| ... | Zusammenhang untersuchen | Mini-Simulation / Experiment |
| ... | Messdaten auswerten | Tabelle, Graph, Schlussfolgerung |
| ... | Begriff anwenden | Kurzaufgabe / Fehlerdetektiv |
| ... | berechnen | Zahlenaufgabe |

**Regel:** Nicht zuerst einen Aufgabentyp wählen und anschließend Inhalt hineinpressen. Zuerst Lernziel und Denkhandlung bestimmen.

---

# E. Aktivitätsmix

## 5. Aktivitätsplan

Eine Einheit benötigt nicht automatisch alle Aktivitätstypen.

### Grundlagen-Check
- [ ] sinnvoll
- Ziel:
- geplante Aufgabentypen:
- Quellen:

### Karten & Zuordnen / visuelle Übung
- [ ] sinnvoll
- Ziel:
- welche visuellen Objekte:
- Quellen:

### Denken & Prüfen
- [ ] sinnvoll
- Ziel:
- typische Fehlvorstellungen / Kontraste:
- Quellen:

### Experiment / Simulation
- [ ] eigenes Mini-Labor
- [ ] PhET
- [ ] kein Experiment notwendig

Falls Experiment:
- Forschungsfrage:
- Vermutung:
- veränderbare Größe:
- beobachtete / gemessene Größe:
- Messreihe:
- Auswertung:
- Schlussfolgerung:
- Quellen:

### Kapitel-Check
- [ ] erforderlich
- Welche Denkformen werden gemischt:
  1. ...
  2. ...
  3. ...
- Welche Aufgaben werden aus einem Pool zufällig gewählt:

---

# F. Medien- und Asset-Plan

## 6. Welche Physik muss sichtbar werden?

| Asset | vorhandenes Asset verwenden | neu erstellen | fachliche Prüfung |
|---|---:|---:|---|
| ... | [ ] | [ ] | ... |
| ... | [ ] | [ ] | ... |

Für neue Assets festlegen:
- Realansicht oder stilisierte Darstellung
- Schaltsymbol / Diagramm
- Zustände
- Anschlusspunkte
- Alt-Text
- Quellen-ID
- Herkunft / Lizenz

**Regel:** Kein Text-Ersatz, wenn ein physikalisches Objekt sinnvoll visuell gezeigt werden kann.

---

# G. Punkte und Fortschritt

## 7. Bewertung

Für bewertete Aufgaben Standard:

- 3 Punkte: erster richtiger Versuch
- 2 Punkte: nach erstem Fehlversuch
- weitere Fehlversuche: weiterer Punkteverlust
- Lösung eingeblendet: 0 Punkte für den ungelösten Teil

Festlegen:
- Welche Aktivitäten sind bewertet?
- Welche Aktivitäten gelten nur als durchgeführt?
- Welche Ergebnisse werden im Einheitenfortschritt angezeigt?

---

# H. Schüleransicht

## 8. UI-Check vor Umsetzung

- [ ] keine sichtbaren Quellen-IDs
- [ ] keine Asset-IDs
- [ ] keine Entwicklertexte
- [ ] keine unnötigen Credits auf Kacheln
- [ ] keine verräterischen Captions
- [ ] Bildkacheln zeigen nur notwendige Information
- [ ] Text bleibt vollständig innerhalb der Kachel
- [ ] lange Aussagen werden als breite Karten dargestellt
- [ ] Touch-Ziele ausreichend groß
- [ ] Aufgabe ohne lange Bedienungsanleitung verständlich

---

# I. Technische Umsetzung

## 9. Dateien

Typischer Aufbau:

```text
src/
  content/
    <unit>.ts
    <topic>Assets.ts        # nur wenn neue Assets nötig sind
  components/
    <TopicSpecific>.tsx     # nur bei wirklich neuem Interaktionstyp
public/
  assets/
    <topic>/
      real/
      symbols/
      diagrams/
```

Vorhandene Komponenten bevorzugen:
- `MissionEngine`
- `PairDropGame`
- `GroupDropGame`
- `DiagramLabelDropGame`
- gemeinsames Assessment
- gemeinsamer Fortschritt
- vorhandene Labor-/Graph-Bausteine

Neue Spezialkomponente nur bei echtem didaktischem Mehrwert.

---

# J. Einheiten-Reihenfolge

## 10. Empfohlener Produktionsablauf

### Phase 1 – Quelle
1. Themenblock aus KI-Ansicht bestimmen.
2. relevante sourceRefs sammeln.
3. Definitionen/Formeln/Kompetenzen ergänzen.
4. fachliche Grenzen notieren.

### Phase 2 – Didaktik
5. 4–6 Lernziele formulieren.
6. Denkhandlungen bestimmen.
7. Aktivitätstypen auswählen.
8. Experiment nur einplanen, wenn es fachlich sinnvoll ist.

### Phase 3 – Medien
9. vorhandene Assets suchen.
10. nur fehlende Assets erstellen.
11. Symbolik und Geometrie fachlich prüfen.

### Phase 4 – Umsetzung
12. Unit-Datei erstellen.
13. kurze Übungen umsetzen.
14. Experiment/Simulation umsetzen.
15. Kapitel-Check aus einem größeren Aufgabenpool erstellen.
16. Fortschritt anbinden.

### Phase 5 – Freigabe
17. Qualitätsstandard abarbeiten.
18. Desktop prüfen.
19. mobile/touch prüfen.
20. Inhaltsvalidierung + TypeScript + Build + Publish + Pages grün.

---

# K. Definition of Done

Eine Einheit ist erst fertig, wenn:

- [ ] Seitengrenzen und Fachumfang klar sind.
- [ ] sourceRefs vollständig hinterlegt sind.
- [ ] Lernziele überprüfbar formuliert sind.
- [ ] jede Aktivität einen erkennbaren Lernzweck hat.
- [ ] kein Aufgabentyp nur aus Abwechslung eingebaut wurde.
- [ ] physikalisch sinnvolle Inhalte visuell dargestellt sind.
- [ ] Experimente einem Erkenntnisprozess folgen.
- [ ] Punkte-/Feedbacklogik konsistent ist.
- [ ] Kapitel-Check mehrere Denkformen prüft.
- [ ] Fortschritt funktioniert.
- [ ] alle Schülertexte und Kacheln sauber dargestellt werden.
- [ ] Qualitätsstandard vollständig geprüft ist.
- [ ] technischer Deploy grün ist.

---

# Referenz

Erste Referenz: **Kapitel 3 · Elektrizität · S. 44–49**.

Die Referenzeinheit zeigt den Qualitätsgrad, nicht eine starre Reihenfolge oder Pflichtanzahl an Aktivitäten.
