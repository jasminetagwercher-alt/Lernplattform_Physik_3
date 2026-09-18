import { GroupDropGame } from "./dnd/GroupDropGame";
import { PairDropGame } from "./dnd/PairDropGame";

export function MediaTraining() {
  return (
    <div className="challenge-stack">
      <PairDropGame
        title="Finde die passenden Paare"
        prompt="Ziehe jede Kachel auf die passende Bedeutung."
        pairs={[
          {
            id: "stromstaerke",
            tile: { id: "i", kind: "symbol", symbol: "I", caption: "Symbol" },
            target: { id: "stromstaerke-name", kind: "text", text: "Stromstärke" },
            targetTitle: "Stromstärke",
          },
          {
            id: "ampere",
            tile: { id: "a", kind: "symbol", symbol: "A", caption: "Einheitensymbol" },
            target: { id: "ampere-name", kind: "text", text: "Ampere" },
            targetTitle: "Ampere",
          },
          {
            id: "widerstand",
            tile: { id: "r", kind: "symbol", symbol: "R", caption: "Symbol" },
            target: { id: "widerstand-name", kind: "text", text: "Widerstand" },
            targetTitle: "Widerstand",
          },
          {
            id: "ohm",
            tile: { id: "omega", kind: "symbol", symbol: "Ω", caption: "Einheitensymbol" },
            target: { id: "ohm-name", kind: "text", text: "Ohm" },
            targetTitle: "Ohm",
          },
        ]}
      />

      <GroupDropGame
        title="Stromstärke oder Widerstand?"
        prompt="Ziehe jede Kachel in den passenden Bereich."
        groups={[
          { id: "strom", title: "Stromstärke", subtitle: "I" },
          { id: "widerstand", title: "Widerstand", subtitle: "R" },
        ]}
        tiles={[
          { id: "i", groupId: "strom", media: { id: "gi", kind: "symbol", symbol: "I", caption: "Symbol" } },
          { id: "a", groupId: "strom", media: { id: "ga", kind: "symbol", symbol: "A", caption: "Einheit" } },
          { id: "amperemeter", groupId: "strom", media: { id: "gm", kind: "text", text: "Amperemeter", caption: "Messgerät" } },
          { id: "r", groupId: "widerstand", media: { id: "gr", kind: "symbol", symbol: "R", caption: "Symbol" } },
          { id: "omega", groupId: "widerstand", media: { id: "go", kind: "symbol", symbol: "Ω", caption: "Einheit" } },
          { id: "material", groupId: "widerstand", media: { id: "gmat", kind: "text", text: "Material", caption: "Einflussgröße" } },
        ]}
      />
    </div>
  );
}
