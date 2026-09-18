import { useMemo, useState } from "react";

export type SortItem = {
  id: string;
  label: string;
};

type Props = {
  title: string;
  prompt: string;
  items: SortItem[];
  correctOrder: string[];
  hint: string;
  explanation: string;
  sourceRefs: string[];
};

const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export function SortingGame({
  title,
  prompt,
  items,
  correctOrder,
  hint,
  explanation,
  sourceRefs,
}: Props) {
  const initial = useMemo(() => shuffle(items), [items]);
  const [order, setOrder] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [state, setState] = useState<"idle" | "hint" | "correct" | "solution">("idle");

  function move(id: string, direction: -1 | 1) {
    setOrder((current) => {
      const index = current.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function dropOn(targetId: string) {
    if (!dragId || dragId === targetId) return;
    setOrder((current) => {
      const from = current.findIndex((item) => item.id === dragId);
      const to = current.findIndex((item) => item.id === targetId);
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDragId(null);
  }

  function check() {
    const current = order.map((item) => item.id);
    const ok = JSON.stringify(current) === JSON.stringify(correctOrder);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (ok) setState("correct");
    else if (nextAttempts === 1) setState("hint");
    else {
      setState("solution");
      setOrder(correctOrder.map((id) => items.find((item) => item.id === id)!));
    }
  }

  return (
    <section className="game-card">
      <div className="eyebrow">Sortieren</div>
      <h2>{title}</h2>
      <p className="lead compact">{prompt}</p>

      <div className="sort-list">
        {order.map((item, index) => (
          <div
            key={item.id}
            draggable
            className="sort-row"
            onDragStart={() => setDragId(item.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => dropOn(item.id)}
          >
            <span className="sort-number">{index + 1}</span>
            <strong>{item.label}</strong>
            <div className="sort-controls">
              <button onClick={() => move(item.id, -1)} aria-label="nach oben">↑</button>
              <button onClick={() => move(item.id, 1)} aria-label="nach unten">↓</button>
            </div>
          </div>
        ))}
      </div>

      {state !== "idle" && (
        <div className={`feedback ${state}`}>
          {state === "hint" && <>Hinweis: {hint}</>}
          {state === "correct" && <>Richtig. {explanation}</>}
          {state === "solution" && <>Lösung eingeblendet. {explanation}</>}
        </div>
      )}

      <div className="game-actions">
        <button className="primary-button" onClick={check}>Prüfen</button>
      </div>

      <details className="teacher-note">
        <summary>Quellen</summary>
        <p>{sourceRefs.join(" · ")}</p>
      </details>
    </section>
  );
}
