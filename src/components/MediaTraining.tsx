import { DiagramLabelDropGame } from "./dnd/DiagramLabelDropGame";
import { GroupDropGame } from "./dnd/GroupDropGame";
import { PairDropGame } from "./dnd/PairDropGame";
import { asMediaImage, electricityAssets as a } from "../content/electricityAssets";

export function MediaTraining() {
  return (
    <div className="challenge-stack">
      <PairDropGame
        title="Bauteil und Schaltsymbol"
        prompt="Ordne jeder Darstellung des Bauteils das passende Schaltsymbol zu. Prüfe erst, wenn alle Kacheln liegen."
        hint="Achte auf die Funktion des Bauteils, nicht auf Farbe oder Form der Illustration."
        pairs={[
          {
            id: "battery",
            tile: asMediaImage(a.batteryReal),
            target: asMediaImage(a.batterySymbol),
            targetTitle: "Schaltsymbol",
          },
          {
            id: "lamp",
            tile: asMediaImage(a.lampReal),
            target: asMediaImage(a.lampSymbol),
            targetTitle: "Schaltsymbol",
          },
          {
            id: "switch",
            tile: asMediaImage(a.switchOpenReal),
            target: asMediaImage(a.switchOpenSymbol),
            targetTitle: "Schaltsymbol",
          },
          {
            id: "resistor",
            tile: asMediaImage(a.resistorReal),
            target: asMediaImage(a.resistorSymbol),
            targetTitle: "Schaltsymbol",
          },
          {
            id: "ammeter",
            tile: asMediaImage(a.ammeterReal),
            target: asMediaImage(a.ammeterSymbol),
            targetTitle: "Schaltsymbol",
          },
        ]}
      />

      <GroupDropGame
        title="Schalter: offen oder geschlossen?"
        prompt="Ordne reale Darstellung und Schaltsymbol dem richtigen Zustand zu."
        groups={[
          { id: "open", title: "offen", subtitle: "Stromkreis unterbrochen" },
          { id: "closed", title: "geschlossen", subtitle: "Verbindung hergestellt" },
        ]}
        tiles={[
          { id: "open-real", groupId: "open", media: asMediaImage(a.switchOpenReal) },
          { id: "open-symbol", groupId: "open", media: asMediaImage(a.switchOpenSymbol) },
          { id: "closed-real", groupId: "closed", media: asMediaImage(a.switchClosedReal) },
          { id: "closed-symbol", groupId: "closed", media: asMediaImage(a.switchClosedSymbol) },
        ]}
        hint="Vergleiche bei beiden Darstellungen, ob die beiden Kontakte miteinander verbunden sind."
      />

      <DiagramLabelDropGame
        title="Beschrifte den Stromkreis"
        prompt="Ziehe die vier Begriffe direkt auf das passende Bauteil im Schaltbild."
        imageSrc={a.circuitDiagram.src}
        imageAlt={a.circuitDiagram.alt}
        hint="Suche zuerst das Messgerät mit A und die Lampe mit dem Kreis-und-Kreuz-Symbol."
        labels={[
          {
            id: "battery",
            targetId: "battery",
            media: { id: "label-battery", kind: "text", text: "Spannungsquelle" },
          },
          {
            id: "lamp",
            targetId: "lamp",
            media: { id: "label-lamp", kind: "text", text: "Lampe" },
          },
          {
            id: "ammeter",
            targetId: "ammeter",
            media: { id: "label-ammeter", kind: "text", text: "Amperemeter" },
          },
          {
            id: "switch",
            targetId: "switch",
            media: { id: "label-switch", kind: "text", text: "Schalter" },
          },
        ]}
        targets={[
          { id: "battery", x: 16, y: 50, width: 22 },
          { id: "lamp", x: 50, y: 21, width: 22 },
          { id: "ammeter", x: 84, y: 50, width: 22 },
          { id: "switch", x: 50, y: 79, width: 22 },
        ]}
      />
    </div>
  );
}
