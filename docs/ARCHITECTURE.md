# Architektur der Lernplattform

## Grundprinzip

Die Plattform trennt **Fachinhalt**, **Interaktionsform** und **Darstellung**.

### 1. Fachinhalt
Jede Aufgabe besitzt:
- eindeutige ID
- Kapitel / Thema / Buchseiten
- Aufgabenstellung
- Lösung
- Hinweis
- Erklärung
- Quellen-IDs aus der Wissensdatenbank

### 2. Interaktionsform
Wiederverwendbare Komponenten:
- Single Choice
- Multiple Choice
- Matching
- Drag & Drop
- numerische Aufgaben
- Fehlerdetektiv
- Hotspot
- Sortieren
- Circuit Builder
- virtuelle Experimente
- Missionen / Escape Rooms / Boss-Level

### 3. Darstellung
Ein gemeinsames Designsystem sorgt dafür, dass neue Kapitel ohne neues Seitenlayout ergänzt werden können.

## Simulationen und virtuelle Experimente

Simulationen werden nicht als dekorative Animationen verstanden. Ein virtueller Versuch soll mindestens zwei der folgenden Merkmale besitzen:

- veränderbare Parameter über Regler oder Schalter
- sichtbare Zustandsänderung / Animation
- Messinstrument oder Messwert
- Messwertaufnahme
- Messreihe oder Protokoll
- Forscherauftrag
- Vergleich mehrerer Einstellungen
- automatische Auswertung, wenn fachlich sinnvoll

### Fachliche Grenze

Eine Simulation darf keine zusätzlichen physikalischen Behauptungen einführen, die nicht von der Wissensquelle gedeckt sind. Visualisierungen müssen als Modell bzw. Darstellung erkennbar bleiben.

## Geplante Ebenen

### Ebene A – öffentlich, ohne Login
- Kapitel- und Themenübersicht
- Übungen und Spiele
- virtuelle Experimente
- Fortschritt lokal im Browser
- Quellen nur intern

### Ebene B – später mit Login
- Google-Anmeldung
- Rollen student / teacher / admin
- Klassen
- gespeicherter Lernfortschritt
- Lehrer-Dashboard
- Analyse häufiger Fehlvorstellungen

## Inhaltsstruktur

Empfohlene Struktur:

```
src/
  content/
    kapitel-01/
    kapitel-02/
    kapitel-03/
      ...
  components/
  simulations/
```

Die erste Referenzeinheit liegt derzeit in `src/content/electricity.ts`. Wenn weitere Kapitel hinzukommen, wird sie in die endgültige Kapitelstruktur aufgeteilt.

## Entwicklungsregel

Neue Aufgaben sollen möglichst **Daten ergänzen**, nicht neue Sonderlogik erzeugen. Neue Logik wird nur dann entwickelt, wenn ein wirklich neuer Interaktionstyp gebraucht wird.
