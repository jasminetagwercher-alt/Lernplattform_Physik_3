# Physik-Asset-Bibliothek

## Ziel

Die Asset-Bibliothek stellt wiederverwendbare, fachlich kontrollierte Medien für interaktive Aufgaben bereit. Physikalische Gegenstände sollen nicht durch bloße Wortkarten ersetzt werden, wenn eine sinnvolle visuelle Darstellung möglich ist.

## Struktur

- `public/assets/electricity/real/`: eigene didaktische Illustrationen realer Bauteile
- `public/assets/electricity/symbols/`: eigene Vektorgrafiken von Schaltsymbolen
- `public/assets/electricity/diagrams/`: zusammengesetzte Schaltbilder
- `src/content/electricityAssets.ts`: Metadaten, Alt-Texte, Quellen-IDs und Verwendung

## Standards

Die Schaltsymbole orientieren sich an der in Europa üblichen IEC-Darstellung. Die Grafiken sind eigenständig gezeichnet und keine Kopien aus der IEC-60617-Datenbank.

IEC 60617 ist die offizielle internationale Referenz für grafische Symbole in elektrotechnischen Diagrammen. Exakte IEC-Grafiken werden wegen der Nutzungsbedingungen der Datenbank nicht in dieses öffentliche Repository kopiert.

## Freigaberegel

Neue Assets werden erst in Schüleraufgaben eingesetzt, wenn:
1. Fachbedeutung und Quellenbezug geklärt sind.
2. Alt-Text vorhanden ist.
3. Herkunft/Lizenz dokumentiert ist.
4. Darstellung auf Notebook und Tablet lesbar bleibt.
