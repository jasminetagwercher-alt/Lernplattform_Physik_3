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

## Verbindlicher Qualitätsstandard

Für alle neuen und überarbeiteten Lerneinheiten gilt `docs/QUALITAETSSTANDARD_LERNPLATTFORM.md` als zentrale Qualitätsvorgabe. Er bündelt Fachlichkeit, Didaktik, Punkte-System, Visuals, Simulationen, Schüleransicht, Fortschritt, Barrierefreiheit und technische Freigabe.

Die Dateien `docs/SKILL_SCHUELERKACHELN_VISUELLE_AUFGABEN.txt`, `docs/PHYSICS_OBJECTS_AND_MEDIA.md` und `docs/ASSET_LIBRARY.md` sind ergänzende Spezialregeln. Bei Überschneidungen ist der zentrale Qualitätsstandard maßgeblich.

## Neue Einheiten

Für neue Themenblöcke gilt der feste Autoren-Workflow:

- `docs/EINHEITEN_VORLAGE.md` – vollständige Planungs- und Freigabevorlage
- `docs/NEUE_EINHEIT_WORKFLOW.md` – kurze Arbeitsanweisung
- `docs/templates/NEUE_EINHEIT.template.ts.txt` – technische Copy-Paste-Vorlage

Grundprinzip: **Quelle → Lernziele → Denkhandlungen → passende Aktivität → Medien/Experiment → Kapitel-Check → Qualitätsfreigabe.**

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
