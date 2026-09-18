# Lernplattform Physik 3

Interaktive Lernplattform passend zu **Physik verstehen 3**.

## Ziel

Die Plattform bildet den Stoff der 3. Klasse schrittweise in interaktiven Lernmodulen ab. Inhalte werden nach Kapitel, Thema und Buchseiten strukturiert. Fachwissen und Quellenbezüge sind von der Darstellung getrennt, damit dieselben Inhalte in unterschiedlichen Spiel- und Übungsformaten wiederverwendet werden können.

## Architektur

- **React + TypeScript + Vite**
- **GitHub** für Code, Versionierung und Qualitätssicherung
- **GitHub Pages** für die Veröffentlichung
- später optional **Supabase** für Login, Rollen, Klassen und Lernfortschritt
- Inhalte als strukturierte TypeScript-Daten
- wiederverwendbare Übungs- und Simulationskomponenten

## Didaktische Bausteine

- Multiple Choice / Mehrfachauswahl
- Zuordnung und Drag & Drop
- Fehlerdetektiv
- Zahlenaufgaben
- Missionen und Boss-Level
- physikalische Animationen
- virtuelle Experimente mit Reglern, Messwerten und Zustandsänderungen

## Fachliche Leitlinie

Jede Aufgabe erhält interne Quellen-IDs aus der Wissensdatenbank. Die Schüleransicht zeigt diese Metadaten nicht. Eigene Simulationen visualisieren nur fachliche Beziehungen, die in der zugrunde liegenden Wissensquelle freigegeben sind.

## Erste Referenzeinheit

**Kapitel Elektrizität · S. 44–49**

- Stromkreis und Elektronenstrom
- Stromstärke
- elektrischer Widerstand
- Mission „Stromcode“
- erstes virtuelles Widerstands-Experiment

## Lokale Entwicklung

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Die GitHub-Action unter `.github/workflows/deploy-pages.yml` baut die Plattform für GitHub Pages.
