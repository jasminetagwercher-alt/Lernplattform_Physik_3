import { useMemo } from "react";
import type { AssessmentResult } from "./assessment/useScoredAssessment";
import { useActivityResults } from "./assessment/useActivityResults";
import { GroupDropGame } from "./dnd/GroupDropGame";
import { PairDropGame } from "./dnd/PairDropGame";
import { asMediaImage, electricityAssets as a } from "../content/electricityAssets";

const pick = <T,>(items: T[], count: number) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((x, y) => x.sort - y.sort)
    .slice(0, count)
    .map(({ value }) => value);

export function ChapterCheck({
  onComplete,
}: {
  onComplete?: (result: AssessmentResult) => void;
}) {
  const activity = useActivityResults({
    taskIds: ["visuals", "concepts", "resistance"],
    onComplete,
  });

  const visualPairs = useMemo(
    () =>
      pick(
        [
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
        ],
        3,
      ),
    [],
  );

  const conceptTiles = useMemo(
    () =>
      pick(
        [
          {
            id: "current",
            groupId: "true",
            media: {
              id: "cc-current",
              kind: "text" as const,
              text: "Elektrischer Strom ist die geordnete Bewegung von Elektronen.",
            },
          },
          {
            id: "source",
            groupId: "true",
            media: {
              id: "cc-source",
              kind: "text" as const,
              text: "Eine Spannungsquelle hält die Elektronenbewegung aufrecht.",
            },
          },
          {
            id: "consumed",
            groupId: "false",
            media: {
              id: "cc-consumed",
              kind: "text" as const,
              text: "Im Elektrogerät wird der Elektronenstrom verbraucht.",
            },
          },
          {
            id: "ampere-resistance",
            groupId: "false",
            media: {
              id: "cc-ampere-r",
              kind: "text" as const,
              text: "Ampere ist die Einheit des elektrischen Widerstands.",
            },
          },
          {
            id: "ohm-resistance",
            groupId: "true",
            media: {
              id: "cc-ohm-r",
              kind: "text" as const,
              text: "Der elektrische Widerstand wird in Ohm angegeben.",
            },
          },
          {
            id: "high-r",
            groupId: "true",
            media: {
              id: "cc-high-r",
              kind: "text" as const,
              text: "Hoher Widerstand bedeutet kleine Stromstärke.",
            },
          },
        ],
        4,
      ),
    [],
  );

  return (
    <div className="challenge-stack chapter-check">
      <div className="activity-mini-progress">
        {activity.completedTasks}/{activity.totalTasks} Aufgaben abgeschlossen
      </div>

      <PairDropGame
        title="Bauteile erkennen"
        prompt="Ordne die drei zufällig ausgewählten Bauteile ihren Schaltsymbolen zu."
        pairs={visualPairs}
        onComplete={(result) => activity.record("visuals", result)}
        hint="Vergleiche die Form der Bauteile mit der Funktion des jeweiligen Schaltsymbols."
      />

      <GroupDropGame
        title="Physik-Aussagen prüfen"
        prompt="Entscheide erst für alle Aussagen und prüfe dann gemeinsam."
        groups={[
          { id: "true", title: "stimmt" },
          { id: "false", title: "stimmt nicht" },
        ]}
        tiles={conceptTiles}
        onComplete={(result) => activity.record("concepts", result)}
        hint="Achte besonders auf Einheiten und darauf, ob Elektronen im Stromkreis verbraucht werden."
      />

      <GroupDropGame
        title="Widerstand und Stromstärke"
        prompt="Bei gleicher Spannung: Ordne die Widerstände nach der zu erwartenden Stromstärke."
        groups={[
          { id: "large", title: "große Stromstärke" },
          { id: "medium", title: "mittlere Stromstärke" },
          { id: "small", title: "kleine Stromstärke" },
        ]}
        tiles={[
          {
            id: "r2",
            groupId: "large",
            media: { id: "cc-r2", kind: "symbol", symbol: "2 Ω" },
          },
          {
            id: "r5",
            groupId: "medium",
            media: { id: "cc-r5", kind: "symbol", symbol: "5 Ω" },
          },
          {
            id: "r10",
            groupId: "small",
            media: { id: "cc-r10", kind: "symbol", symbol: "10 Ω" },
          },
        ]}
        onComplete={(result) => activity.record("resistance", result)}
        hint="Bei gleicher Spannung gilt: kleiner Widerstand → größere Stromstärke."
      />
    </div>
  );
}
