import type { LearningUnit } from "../model";

export const electricityUnit: LearningUnit = {
  id: "elektrizitaet-44-49",
  chapter: "Kapitel 3 · Elektrizität",
  title: "Stromkreis, Stromstärke und Widerstand",
  pages: "S. 44–49",
  description:
    "Experimentiere mit echten Simulationsbauteilen, trainiere zentrale Vorstellungen und untersuche Stromstärke und Widerstand mit Messreihen.",
  activities: [
    {
      id: "phet-stromkreis",
      kind: "phet-lab",
      label: "Experiment",
      title: "Stromkreis-Labor",
      description:
        "Baue in PhET mit realistischen Simulationsbauteilen einen Stromkreis, untersuche den Schalter, wechsle zur Schaltbildansicht und miss die Stromstärke.",
      sourceRefs: ["P3-K3-S044-M02", "P3-K3-S045-M01", "P3-K3-S045-M02", "P3-K3-S047-M01", "P3-KOMP-039"],
    },
    {
      id: "stromcode",
      kind: "mission",
      label: "Übung",
      title: "Grundlagen-Check",
      description:
        "Gemischte Aufgaben mit Hinweisen, plausiblen Fehlantworten und zufälliger Reihenfolge.",
      sourceRefs: ["P3-K3-S044-M01", "P3-K3-S044-M02", "P3-K3-S045-M01", "P3-K3-S046-M02", "P3-K3-S048-M02", "P3-K3-S049-M01"],
    },
    {
      id: "medien-training",
      kind: "media-training",
      label: "Interaktiv",
      title: "Karten & Zuordnen",
      description:
        "Ziehe Karten auf passende Begriffe und ordne sie den richtigen Bereichen zu.",
      sourceRefs: ["P3-K3-S046-M02", "P3-K3-S047-M01", "P3-K3-S048-M02", "P3-K3-S049-M01", "P3-FD-018"],
    },
    {
      id: "challenge-mix",
      kind: "challenge",
      label: "Kurztraining",
      title: "Denken & Prüfen",
      description:
        "Kurze Aufgaben zum Sortieren, Zuordnen und Erkennen typischer Denkfehler.",
      sourceRefs: ["P3-K3-S044-M01", "P3-K3-S045-M01", "P3-K3-S046-M02", "P3-K3-S047-M01", "P3-K3-S048-M02"],
    },
    {
      id: "widerstands-labor",
      kind: "virtual-lab",
      label: "Experiment",
      title: "Widerstands-Labor",
      description:
        "Führe kontrollierte Messreihen durch, speichere Messwerte und untersuche automatisch erzeugte Diagramme.",
      sourceRefs: ["P3-FD-038", "P3-K3-S048-M02", "P3-K3-S046-M02"],
    },
    {
      id: "kapitel-check-44-49",
      kind: "chapter-check",
      label: "Abschluss",
      title: "Kapitel-Check",
      description:
        "Drei gemischte Kachelaufgaben zu Bauteilen, Grundvorstellungen und Widerstand. Ein Teil wird bei jedem Start neu ausgewählt.",
      sourceRefs: [
        "P3-K3-S044-M01",
        "P3-K3-S044-M02",
        "P3-K3-S045-M01",
        "P3-K3-S045-M02",
        "P3-K3-S046-M02",
        "P3-K3-S047-M01",
        "P3-K3-S048-M02",
        "P3-FD-018",
        "P3-FD-038"
      ],
    },
  ],
  tasks: [
    {
      id: "p3-k3-044-01",
      type: "multi-choice",
      title: "Materialcheck",
      prompt: "Welche vier Bestandteile gehören zu einem einfachen Stromkreis?",
      options: [
        { id: "source", label: "Spannungsquelle" },
        { id: "wire", label: "Stromleitungen" },
        { id: "device", label: "Elektrogerät" },
        { id: "switch", label: "Schalter" },
        { id: "ampere", label: "Ampere (A)" },
        { id: "meter", label: "Amperemeter" },
      ],
      correctIds: ["source", "wire", "device", "switch"],
      hint: "Gesucht sind Bauteile des Stromkreises – nicht Einheit oder Messgerät.",
      explanation:
        "Ein einfacher Stromkreis besteht aus Spannungsquelle, Stromleitungen, Elektrogerät und Schalter.",
      sourceRefs: ["P3-K3-S044-M02", "P3-KOMP-039"],
    },
    {
      id: "p3-k3-044-02",
      type: "single-choice",
      title: "Datenprüfung",
      prompt: "Welche Aussage beschreibt elektrischen Strom passend zu den Buchseiten?",
      options: [
        {
          id: "a",
          label:
            "Elektrischer Strom ist die geordnete Bewegung von Elektronen; eine Spannungsquelle hält diese Bewegung aufrecht.",
        },
        {
          id: "b",
          label:
            "Elektrischer Strom entsteht erst im Elektrogerät und endet dort wieder.",
        },
        {
          id: "c",
          label:
            "Die Spannungsquelle bewegt sich durch die Leitung und nimmt die Elektronen mit.",
        },
      ],
      correctId: "a",
      hint: "Achte darauf, was sich im Stromkreis bewegt und welche Aufgabe die Spannungsquelle hat.",
      explanation:
        "Elektrischer Strom ist die geordnete Bewegung von Elektronen. Die Spannungsquelle hält diese Bewegung aufrecht.",
      sourceRefs: ["P3-K3-S044-M01", "P3-FD-017"],
    },
    {
      id: "p3-k3-045-01",
      type: "single-choice",
      title: "Fehlerdetektiv",
      prompt:
        "Mia behauptet: „Im Elektrogerät wird der Elektronenstrom aufgebraucht.“ Welche Antwort passt?",
      options: [
        {
          id: "a",
          label:
            "Mia hat recht: Hinter dem Elektrogerät sind keine Elektronen mehr vorhanden.",
        },
        {
          id: "b",
          label:
            "Der Elektronenstrom wird nicht verbraucht; die Elektronen bewegen sich im geschlossenen Stromkreis weiter.",
        },
        {
          id: "c",
          label:
            "Der Elektronenstrom wird teilweise verbraucht und teilweise neu erzeugt.",
        },
      ],
      correctId: "b",
      hint: "Denke an einen geschlossenen Stromkreis.",
      explanation: "Der Elektronenstrom wird im Elektrogerät nicht verbraucht.",
      sourceRefs: ["P3-K3-S045-M01", "P3-KOMP-018"],
    },
    {
      id: "p3-k3-048-01",
      type: "single-choice",
      title: "Zusammenhang",
      prompt: "Welche Kombination ist richtig?",
      options: [
        { id: "a", label: "Hoher Widerstand → hohe Stromstärke" },
        { id: "b", label: "Hoher Widerstand → kleine Stromstärke" },
        { id: "c", label: "Der Widerstand beeinflusst die Stromstärke nicht." },
      ],
      correctId: "b",
      hint: "Wenn der Widerstand größer wird, wird die Stromstärke laut Buch kleiner.",
      explanation:
        "Hoher Widerstand führt zu kleiner Stromstärke; kleiner Widerstand zu hoher Stromstärke.",
      sourceRefs: ["P3-K3-S048-M02"],
    },
    {
      id: "p3-k3-048-02",
      type: "numeric",
      title: "Widerstands-Konsole",
      prompt: "Für U = 12 und I = 3: Welcher Wert ergibt sich für R?",
      formula: "R = U / I",
      answer: 4,
      unit: "Ω",
      tolerance: 0,
      hint: "Teile den Wert von U durch den Wert von I.",
      explanation: "R = 12 / 3 = 4 Ω.",
      sourceRefs: ["P3-FD-038", "P3-K3-S048-M02"],
    },
    {
      id: "p3-k3-049-01",
      type: "multi-choice",
      title: "Widerstands-Scanner",
      prompt: "Welche Einflussgrößen auf den elektrischen Widerstand werden genannt?",
      options: [
        { id: "material", label: "Material" },
        { id: "length", label: "Länge des Leiters" },
        { id: "cross", label: "Querschnitt des Leiters" },
        { id: "temperature", label: "Temperatur bei reinen Metallen" },
        { id: "ampere", label: "Ampere (A)" },
        { id: "meter", label: "Amperemeter" },
      ],
      correctIds: ["material", "length", "cross", "temperature"],
      hint: "Gesucht sind Eigenschaften des Leiters – nicht Messgerät oder Einheit.",
      explanation:
        "Der Widerstand hängt von Material, Leiterlänge und Querschnitt ab; bei reinen Metallen außerdem von der Temperatur.",
      sourceRefs: ["P3-K3-S049-M01", "P3-KOMP-020"],
    },
  ],
};
