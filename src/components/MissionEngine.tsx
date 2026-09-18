import { useMemo, useState } from "react";
import type { Task } from "../model";

type Props = {
  tasks: Task[];
  onComplete: () => void;
};

const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export function MissionEngine({ tasks, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [numberValue, setNumberValue] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "hint" | "correct" | "solution">("idle");

  const task = tasks[index];
  const options = useMemo(
    () => ("options" in task ? shuffle(task.options) : []),
    [task.id],
  );

  function isCorrect() {
    if (task.type === "single-choice") return selected[0] === task.correctId;
    if (task.type === "multi-choice") {
      const a = [...selected].sort();
      const b = [...task.correctIds].sort();
      return JSON.stringify(a) === JSON.stringify(b);
    }
    const value = Number(numberValue);
    const tolerance = task.tolerance ?? 0;
    return Number.isFinite(value) && Math.abs(value - task.answer) <= tolerance;
  }

  function check() {
    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);

    if (isCorrect()) {
      setFeedback("correct");
      return;
    }

    setFeedback(nextAttempt === 1 ? "hint" : "solution");
  }

  function next() {
    if (index === tasks.length - 1) {
      onComplete();
      return;
    }
    setIndex((value) => value + 1);
    setSelected([]);
    setNumberValue("");
    setAttempt(0);
    setFeedback("idle");
  }

  function toggleOption(id: string) {
    if (feedback === "correct" || feedback === "solution") return;
    if (task.type === "single-choice") {
      setSelected([id]);
      return;
    }
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  const done = feedback === "correct" || feedback === "solution";

  return (
    <section className="mission-card">
      <div className="mission-progress">
        <span>Datensatz {index + 1} / {tasks.length}</span>
        <div className="progress-track">
          <div
            className="progress-bar"
            style={{ width: `${((index + (done ? 1 : 0)) / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="eyebrow">{task.title}</div>
      <h2>{task.prompt}</h2>

      {task.type !== "numeric" && (
        <div className={task.type === "multi-choice" ? "chip-grid" : "option-grid"}>
          {options.map((option) => (
            <button
              key={option.id}
              className={
                task.type === "multi-choice"
                  ? `choice-chip ${selected.includes(option.id) ? "selected" : ""}`
                  : `answer-option ${selected.includes(option.id) ? "selected" : ""}`
              }
              onClick={() => toggleOption(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {task.type === "numeric" && (
        <div className="numeric-box">
          {task.formula && <div className="formula">{task.formula}</div>}
          <label>
            Dein Ergebnis
            <div className="input-with-unit">
              <input
                value={numberValue}
                onChange={(event) => setNumberValue(event.target.value)}
                inputMode="decimal"
              />
              {task.unit && <strong>{task.unit}</strong>}
            </div>
          </label>
        </div>
      )}

      {feedback !== "idle" && (
        <div className={`feedback ${feedback}`}>
          {feedback === "hint" && <>Hinweis: {task.hint}</>}
          {feedback === "correct" && <>Richtig. {task.explanation}</>}
          {feedback === "solution" && <>Lösung: {task.explanation}</>}
        </div>
      )}

      <div className="mission-actions">
        {!done ? (
          <button className="primary-button" onClick={check}>
            Prüfen
          </button>
        ) : (
          <button className="primary-button" onClick={next}>
            {index === tasks.length - 1 ? "Mission abschließen" : "Weiter"}
          </button>
        )}
      </div>
    </section>
  );
}
