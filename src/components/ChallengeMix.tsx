import { ErrorDetective } from "./games/ErrorDetective";
import { MatchingGame } from "./games/MatchingGame";
import { SortingGame } from "./games/SortingGame";

export function ChallengeMix() {
  return (
    <div className="challenge-stack">
      <MatchingGame
        title="Stromstärke entschlüsseln"
        prompt="Ordne Symbol, Einheit und Messgerät richtig zu. Die Karten werden bei jedem Laden neu gemischt."
        pairs={[
          { id: "symbol", left: "Symbol der Stromstärke", right: "I" },
          { id: "unit", left: "Einheit der Stromstärke", right: "Ampere (A)" },
          { id: "meter", left: "Messgerät für die Stromstärke", right: "Amperemeter" },
        ]}
        hint="Ein Symbol ist kurz, eine Einheit beschreibt den Messwert und ein Messgerät ist ein Gerät."
        explanation="Stromstärke: Symbol I, Einheit Ampere (A), Messgerät Amperemeter."
        sourceRefs={["P3-K3-S046-M02", "P3-K3-S047-M01", "P3-FD-018"]}
      />

      <SortingGame
        title="Widerstands-Rennen"
        prompt="Bei allen drei Leitern bleibt die Spannung gleich. Sortiere von der größten zur kleinsten Stromstärke."
        items={[
          { id: "r2", label: "R = 2 Ω" },
          { id: "r4", label: "R = 4 Ω" },
          { id: "r8", label: "R = 8 Ω" },
        ]}
        correctOrder={["r2", "r4", "r8"]}
        hint="Je kleiner der Widerstand, desto größer ist bei gleicher Spannung die Stromstärke."
        explanation="Kleiner Widerstand bedeutet größere Stromstärke; hoher Widerstand bedeutet kleinere Stromstärke."
        sourceRefs={["P3-K3-S048-M02", "P3-KOMP-044"]}
      />

      <ErrorDetective
        title="Wer hat den Denkfehler?"
        prompt="Nur eine Aussage widerspricht den Buchseiten. Finde sie."
        statements={[
          {
            id: "mia",
            speaker: "Mia",
            text: "In einem geschlossenen Stromkreis bewegen sich Elektronen durch die Leitungen.",
            isError: false,
          },
          {
            id: "leon",
            speaker: "Leon",
            text: "Im Elektrogerät wird der Elektronenstrom verbraucht.",
            isError: true,
          },
          {
            id: "dilara",
            speaker: "Dilara",
            text: "Eine Spannungsquelle hält die Elektronenbewegung aufrecht.",
            isError: false,
          },
        ]}
        hint="Achte darauf, was laut Buch mit dem Elektronenstrom im geschlossenen Stromkreis passiert."
        explanation="Der Elektronenstrom wird im Elektrogerät nicht verbraucht."
        sourceRefs={["P3-K3-S044-M01", "P3-K3-S045-M01", "P3-FD-017"]}
      />
    </div>
  );
}
