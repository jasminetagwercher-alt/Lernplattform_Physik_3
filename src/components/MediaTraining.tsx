import { MediaGroupingGame } from "./media/MediaGroupingGame";
import { MediaMatchingGame } from "./media/MediaMatchingGame";
import { MediaSortingGame } from "./media/MediaSortingGame";
import { MemoryPairsGame } from "./media/MemoryPairsGame";

export function MediaTraining() {
  return (
    <div className="challenge-stack">
      <MemoryPairsGame
        title="Physik-Paare"
        prompt="Finde jeweils die zusammengehörenden Größen, Symbole und Einheiten."
        pairs={[
          {
            id: "stromstaerke",
            a: { id: "i", kind: "symbol", symbol: "I", caption: "Symbol" },
            b: { id: "stromstaerke-name", kind: "text", text: "Stromstärke", caption: "Größe" },
          },
          {
            id: "ampere",
            a: { id: "a", kind: "symbol", symbol: "A", caption: "Einheitensymbol" },
            b: { id: "ampere-name", kind: "text", text: "Ampere", caption: "Einheit" },
          },
          {
            id: "widerstand",
            a: { id: "r", kind: "symbol", symbol: "R", caption: "Symbol" },
            b: { id: "widerstand-name", kind: "text", text: "Widerstand", caption: "Größe" },
          },
          {
            id: "ohm",
            a: { id: "omega", kind: "symbol", symbol: "Ω", caption: "Einheitensymbol" },
            b: { id: "ohm-name", kind: "text", text: "Ohm", caption: "Einheit" },
          },
        ]}
      />

      <MediaMatchingGame
        title="Symbol trifft Bedeutung"
        prompt="Ordne die beiden physikalischen Größen ihrer passenden Beschreibung zu."
        pairs={[
          {
            id: "i",
            left: { id: "i-left", kind: "symbol", symbol: "I", caption: "Stromstärke" },
            right: {
              id: "i-right",
              kind: "text",
              text: "Wie viele Elektronen in einer bestimmten Zeit durch einen Leiterquerschnitt strömen.",
            },
          },
          {
            id: "r",
            left: { id: "r-left", kind: "symbol", symbol: "R", caption: "Widerstand" },
            right: {
              id: "r-right",
              kind: "text",
              text: "Beeinflusst die Stromstärke: hoher Wert → kleine Stromstärke.",
            },
          },
        ]}
      />

      <MediaGroupingGame
        title="Was gehört zusammen?"
        prompt="Ordne die Karten entweder der Stromstärke oder dem elektrischen Widerstand zu."
        groups={[
          { id: "strom", title: "Stromstärke", subtitle: "I" },
          { id: "widerstand", title: "Widerstand", subtitle: "R" },
        ]}
        items={[
          { id: "i", groupId: "strom", media: { id: "gi", kind: "symbol", symbol: "I", caption: "Symbol" } },
          { id: "a", groupId: "strom", media: { id: "ga", kind: "symbol", symbol: "A", caption: "Einheit" } },
          { id: "amperemeter", groupId: "strom", media: { id: "gm", kind: "text", text: "Amperemeter", caption: "Messgerät" } },
          { id: "r", groupId: "widerstand", media: { id: "gr", kind: "symbol", symbol: "R", caption: "Symbol" } },
          { id: "omega", groupId: "widerstand", media: { id: "go", kind: "symbol", symbol: "Ω", caption: "Einheit" } },
          { id: "material", groupId: "widerstand", media: { id: "gmat", kind: "text", text: "Material", caption: "Einflussgröße" } },
        ]}
      />

      <MediaSortingGame
        title="Widerstand und Stromstärke"
        prompt="Bei gleicher Spannung: Sortiere von der größten zur kleinsten Stromstärke."
        items={[
          { id: "r2", media: { id: "sr2", kind: "symbol", symbol: "2 Ω", caption: "Widerstand" } },
          { id: "r4", media: { id: "sr4", kind: "symbol", symbol: "4 Ω", caption: "Widerstand" } },
          { id: "r8", media: { id: "sr8", kind: "symbol", symbol: "8 Ω", caption: "Widerstand" } },
        ]}
        correctOrder={["r2", "r4", "r8"]}
      />

      <details className="teacher-note">
        <summary>Fachliche Grundlage dieser Medienübungen</summary>
        <p>
          P3-K3-S046-M02 · P3-K3-S047-M01 · P3-K3-S048-M02 · P3-K3-S049-M01 ·
          P3-FD-018
        </p>
      </details>
    </div>
  );
}
