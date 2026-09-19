import type { AssessmentResult } from "./assessment/useScoredAssessment";
import { useActivityResults } from "./assessment/useActivityResults";
import { GroupDropGame } from "./dnd/GroupDropGame";

export function ChallengeMix({
  onComplete,
}: {
  onComplete?: (result: AssessmentResult) => void;
}) {
  const activity = useActivityResults({
    taskIds: ["statements", "resistance-order", "resistance-factors"],
    onComplete,
  });

  return (
    <div className="challenge-stack">
      <div className="activity-mini-progress">
        {activity.completedTasks}/{activity.totalTasks} Aufgaben abgeschlossen
      </div>

      <GroupDropGame
        title="Stimmt oder stimmt nicht?"
        prompt="Ziehe jede Aussage in das passende Feld. Prüfe erst, wenn alle Kacheln liegen."
        onComplete={(result) => activity.record("statements", result)}
        groups={[
          { id: "true", title: "Stimmt" },
          { id: "false", title: "Stimmt nicht" },
        ]}
        tiles={[
          {
            id: "closed",
            groupId: "true",
            media: {
              id: "closed-card",
              kind: "text",
              text: "In einem geschlossenen Stromkreis bewegen sich Elektronen durch die Leitungen.",
            },
          },
          {
            id: "consumed",
            groupId: "false",
            media: {
              id: "consumed-card",
              kind: "text",
              text: "Im Elektrogerät wird der Elektronenstrom verbraucht.",
            },
          },
          {
            id: "source",
            groupId: "true",
            media: {
              id: "source-card",
              kind: "text",
              text: "Eine Spannungsquelle hält die Elektronenbewegung aufrecht.",
            },
          },
          {
            id: "resistance",
            groupId: "true",
            media: {
              id: "resistance-card",
              kind: "text",
              text: "Hoher Widerstand bedeutet kleine Stromstärke.",
            },
          },
        ]}
        hint="Denke an den geschlossenen Stromkreis und daran, ob der Elektronenstrom im Gerät verbraucht wird."
      />

      <GroupDropGame
        title="Welche Stromstärke ist größer?"
        prompt="Die Spannung ist bei allen drei Fällen gleich. Ordne die Widerstandskacheln nach der Größe der Stromstärke."
        onComplete={(result) => activity.record("resistance-order", result)}
        groups={[
          { id: "largest", title: "größte Stromstärke" },
          { id: "middle", title: "mittlere Stromstärke" },
          { id: "smallest", title: "kleinste Stromstärke" },
        ]}
        tiles={[
          {
            id: "r2",
            groupId: "largest",
            media: { id: "r2-card", kind: "symbol", symbol: "2 Ω" },
          },
          {
            id: "r4",
            groupId: "middle",
            media: { id: "r4-card", kind: "symbol", symbol: "4 Ω" },
          },
          {
            id: "r8",
            groupId: "smallest",
            media: { id: "r8-card", kind: "symbol", symbol: "8 Ω" },
          },
        ]}
        hint="Bei gleicher Spannung gilt: Je größer der Widerstand, desto kleiner die Stromstärke."
      />

      <GroupDropGame
        title="Was beeinflusst den Widerstand?"
        prompt="Ordne alle Kacheln. Welche Größen werden auf den Buchseiten als Einfluss auf den Widerstand genannt?"
        onComplete={(result) => activity.record("resistance-factors", result)}
        groups={[
          { id: "influence", title: "beeinflusst den Widerstand" },
          { id: "not", title: "keine genannte Einflussgröße" },
        ]}
        tiles={[
          {
            id: "material",
            groupId: "influence",
            media: { id: "material-card", kind: "text", text: "Material" },
          },
          {
            id: "length",
            groupId: "influence",
            media: { id: "length-card", kind: "text", text: "Länge des Leiters" },
          },
          {
            id: "cross",
            groupId: "influence",
            media: { id: "cross-card", kind: "text", text: "Querschnitt des Leiters" },
          },
          {
            id: "temperature",
            groupId: "influence",
            media: { id: "temperature-card", kind: "text", text: "Temperatur bei reinen Metallen" },
          },
          {
            id: "ampere",
            groupId: "not",
            media: { id: "ampere-card", kind: "symbol", symbol: "A" },
          },
          {
            id: "ammeter",
            groupId: "not",
            media: { id: "ammeter-card", kind: "text", text: "Amperemeter" },
          },
        ]}
        hint="Gesucht sind Eigenschaften des Leiters. Einheit und Messgerät gehören nicht dazu."
      />
    </div>
  );
}
