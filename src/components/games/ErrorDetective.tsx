import { useMemo, useState } from "react";

export type DetectiveStatement = {
  id: string;
  speaker: string;
  text: string;
  isError: boolean;
};

type Props = {
  title: string;
  prompt: string;
  statements: DetectiveStatement[];
  hint: string;
  explanation: string;
  sourceRefs: string[];
};

const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export function ErrorDetective({
  title,
  prompt,
  statements,
  hint,
  explanation,
  sourceRefs,
}: Props) {
  const shuffled = useMemo(() => shuffle(statements), [statements]);
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [state, setState] = useState<"idle" | "hint" | "correct" | "solution">("idle");

  function check() {
    const chosen = statements.find((item) => item.id === selected);
    const ok = Boolean(chosen?.isError);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (ok) setState("correct");
    else if (nextAttempts === 1) setState("hint");
    else {
      setState("solution");
      setSelected(statements.find((item) => item.isError)?.id ?? null);
    }
  }

  return (
    <section className="game-card">
      <div className="eyebrow">Fehlerdetektiv</div>
      <h2>{title}</h2>
      <p className="lead compact">{prompt}</p>

      <div className="statement-grid">
        {shuffled.map((item) => (
          <button
            key={item.id}
            className={`statement-card ${selected === item.id ? "selected" : ""}`}
            onClick={() => setSelected(item.id)}
          >
            <span>{item.speaker}</span>
            <strong>„{item.text}“</strong>
          </button>
        ))}
      </div>

      {state !== "idle" && (
        <div className={`feedback ${state}`}>
          {state === "hint" && <>Hinweis: {hint}</>}
          {state === "correct" && <>Gefunden. {explanation}</>}
          {state === "solution" && <>Der Fehler ist markiert. {explanation}</>}
        </div>
      )}

      <div className="game-actions">
        <button className="primary-button" onClick={check}>Aussage prüfen</button>
      </div>

      <details className="teacher-note">
        <summary>Quellen</summary>
        <p>{sourceRefs.join(" · ")}</p>
      </details>
    </section>
  );
}
