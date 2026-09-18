import { useMemo, useState } from "react";

export type MatchPair = {
  id: string;
  left: string;
  right: string;
};

type Props = {
  title: string;
  prompt: string;
  pairs: MatchPair[];
  hint: string;
  explanation: string;
  sourceRefs: string[];
};

const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export function MatchingGame({
  title,
  prompt,
  pairs,
  hint,
  explanation,
  sourceRefs,
}: Props) {
  const leftItems = useMemo(() => shuffle(pairs), [pairs]);
  const rightItems = useMemo(() => shuffle(pairs), [pairs]);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [state, setState] = useState<"idle" | "hint" | "correct" | "solution">("idle");

  function place(leftId: string, rightId: string) {
    if (state === "correct" || state === "solution") return;
    setPlacements((current) => {
      const next = { ...current };
      for (const key of Object.keys(next)) {
        if (next[key] === rightId) delete next[key];
      }
      next[leftId] = rightId;
      return next;
    });
    setSelectedRight(null);
  }

  function check() {
    const ok = pairs.every((pair) => placements[pair.id] === pair.id);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (ok) {
      setState("correct");
    } else if (nextAttempts === 1) {
      setState("hint");
    } else {
      setState("solution");
      setPlacements(Object.fromEntries(pairs.map((pair) => [pair.id, pair.id])));
    }
  }

  function onDragStart(event: React.DragEvent<HTMLButtonElement>, rightId: string) {
    event.dataTransfer.setData("text/plain", rightId);
  }

  return (
    <section className="game-card">
      <div className="eyebrow">Zuordnung</div>
      <h2>{title}</h2>
      <p className="lead compact">{prompt}</p>

      <div className="matching-layout">
        <div className="matching-column">
          {rightItems.map((pair) => (
            <button
              key={pair.id}
              draggable
              className={`match-token ${selectedRight === pair.id ? "selected" : ""}`}
              onDragStart={(event) => onDragStart(event, pair.id)}
              onClick={() => setSelectedRight(pair.id)}
            >
              {pair.right}
            </button>
          ))}
        </div>

        <div className="matching-column">
          {leftItems.map((pair) => {
            const placed = placements[pair.id];
            const label = pairs.find((item) => item.id === placed)?.right;
            return (
              <div
                key={pair.id}
                className="match-slot"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const rightId = event.dataTransfer.getData("text/plain");
                  if (rightId) place(pair.id, rightId);
                }}
                onClick={() => selectedRight && place(pair.id, selectedRight)}
              >
                <strong>{pair.left}</strong>
                <span>{label ?? "Karte hier ablegen"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {state !== "idle" && (
        <div className={`feedback ${state}`}>
          {state === "hint" && <>Hinweis: {hint}</>}
          {state === "correct" && <>Richtig. {explanation}</>}
          {state === "solution" && <>Lösung eingeblendet. {explanation}</>}
        </div>
      )}

      <div className="game-actions">
        <button className="primary-button" onClick={check}>
          Prüfen
        </button>
      </div>

      <details className="teacher-note">
        <summary>Quellen</summary>
        <p>{sourceRefs.join(" · ")}</p>
      </details>
    </section>
  );
}
