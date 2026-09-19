# Neue Einheit anlegen – Kurzworkflow

Diese Datei ist die kurze Arbeitsanweisung. Für Details siehe:
- `docs/EINHEITEN_VORLAGE.md`
- `docs/QUALITAETSSTANDARD_LERNPLATTFORM.md`

## 1. Wissensdatenbank lesen
- Themenblock bestimmen.
- KI-Ansicht als Ausgangspunkt verwenden.
- sourceRefs, Definitionen, Formeln und Kompetenzen sammeln.
- fachliche Grenzen notieren.

## 2. Einheit planen
- 4–6 überprüfbare Lernziele.
- pro Lernziel Denkhandlung festlegen.
- erst danach passende digitale Aktivität wählen.
- entscheiden, ob ein Experiment überhaupt sinnvoll ist.

## 3. Medien planen
- vorhandene Asset-Bibliothek prüfen.
- nur fehlende Assets neu erstellen.
- Schülerkacheln niemals mit lösungsverratenden Bezeichnungen versehen.

## 4. Umsetzen
- technische Vorlage aus `docs/templates/NEUE_EINHEIT.template.ts.txt` kopieren.
- Unit-Datei in `src/content/` anlegen.
- Unit in `src/content/registry.ts` registrieren.
- vorhandene Komponenten wiederverwenden.
- neue Komponenten nur bei neuem didaktischem Bedarf.

## 5. Abschluss
- Kapitel-Check aus größerem Pool.
- Fortschritt anbinden.
- Qualitätscheck durchführen.
- Build und Pages-Deploy müssen grün sein.

## Entscheidungsregel

Nicht fragen: **„Welchen Aufgabentyp haben wir noch nicht?“**

Sondern: **„Welche Denkhandlung brauchen Schüler:innen für dieses Lernziel – und welches digitale Format unterstützt sie am besten?“**
