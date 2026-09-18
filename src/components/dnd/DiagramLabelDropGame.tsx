import { useState } from "react";
import type { MediaItem } from "../media/MediaCard";
import { DraggableMediaTile } from "./DraggableMediaTile";
import { PointerDragProvider, usePointerDrag } from "./PointerDragProvider";

export type DiagramLabel = {
  id: string;
  media: MediaItem;
  targetId: string;
};

export type DiagramTarget = {
  id: string;
  x: number;
  y: number;
  width?: number;
};

function Target({
  target,
  placed,
  locked,
  wrong,
  selected,
  onSelectTarget,
  onSelectLabel,
}: {
  target: DiagramTarget;
  placed?: DiagramLabel;
  locked: boolean;
  wrong: boolean;
  selected: string | null;
  onSelectTarget: (id: string) => void;
  onSelectLabel: (id: string) => void;
}) {
  const { overId } = usePointerDrag();
  return (
    <div
      data-drop-id={"diagram:" + target.id}
      className={[
        "diagram-drop-target",
        overId === "diagram:" + target.id ? "over" : "",
        locked ? "correct" : "",
        wrong ? "wrong" : "",
      ].join(" ")}
      style={{
        left: target.x + "%",
        top: target.y + "%",
        width: (target.width ?? 22) + "%",
      }}
      onClick={() => onSelectTarget(target.id)}
    >
      {placed ? (
        <DraggableMediaTile
          id={"tile:" + placed.id}
          item={placed.media}
          disabled={locked}
          selected={selected === placed.id}
          onClick={() => onSelectLabel(placed.id)}
        />
      ) : (
        <span>hier ablegen</span>
      )}
    </div>
  );
}

export function DiagramLabelDropGame({
  title,
  prompt,
  imageSrc,
  imageAlt,
  labels,
  targets,
  hint,
}: {
  title: string;
  prompt: string;
  imageSrc: string;
  imageAlt: string;
  labels: DiagramLabel[];
  targets: DiagramTarget[];
  hint: string;
}) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [locked, setLocked] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [available, setAvailable] = useState<Record<string, number>>(
    () => Object.fromEntries(labels.map((label) => [label.id, 3])),
  );
  const [showHint, setShowHint] = useState(false);
  const [solutionShown, setSolutionShown] = useState(false);

  const maxScore = labels.length * 3;
  const allPlaced = labels.every((label) => placements[label.id]);
  const complete = locked.length === labels.length;

  function place(sourceId: string, destinationId: string) {
    const labelId = sourceId.replace("tile:", "");
    const targetId = destinationId.replace("diagram:", "");
    if (locked.includes(labelId)) return;

    setPlacements((current) => {
      const next = { ...current };
      const displaced = Object.entries(next).find(
        ([otherId, currentTarget]) => otherId !== labelId && currentTarget === targetId,
      );
      if (displaced && locked.includes(displaced[0])) return current;
      if (displaced) delete next[displaced[0]];
      next[labelId] = targetId;
      return next;
    });
    setWrong((items) => items.filter((id) => id !== labelId));
    setSelected(null);
  }

  function chooseTarget(targetId: string) {
    if (!selected) return;
    place("tile:" + selected, "diagram:" + targetId);
  }

  function check() {
    if (!allPlaced || complete) return;

    const correct = labels
      .filter((label) => !locked.includes(label.id) && placements[label.id] === label.targetId)
      .map((label) => label.id);
    const incorrect = labels
      .filter((label) => !locked.includes(label.id) && placements[label.id] !== label.targetId)
      .map((label) => label.id);

    setAttempts((value) => value + 1);
    setLocked((current) => [...current, ...correct]);
    setWrong(incorrect);
    setScore((value) => value + correct.reduce((sum, id) => sum + (available[id] ?? 0), 0));
    setAvailable((current) => {
      const next = { ...current };
      incorrect.forEach((id) => {
        next[id] = Math.max(0, (next[id] ?? 0) - 1);
      });
      return next;
    });
  }

  function reveal() {
    setPlacements(Object.fromEntries(labels.map((label) => [label.id, label.targetId])));
    setLocked(labels.map((label) => label.id));
    setWrong([]);
    setAvailable(Object.fromEntries(labels.map((label) => [label.id, 0])));
    setSelected(null);
    setSolutionShown(true);
  }

  return (
    <section className="game-card dnd-game">
      <div className="task-topline">
        <div>
          <div className="eyebrow">Auf dem Schaltbild zuordnen</div>
          <h2>{title}</h2>
        </div>
        <div className="score-box">
          <strong>{score}/{maxScore}</strong>
          <span>Punkte</span>
        </div>
      </div>
      <p className="lead compact">{prompt}</p>

      <PointerDragProvider onDrop={place}>
        <div className="dnd-bank diagram-label-bank">
          {labels.map((label) => !placements[label.id] && (
            <DraggableMediaTile
              key={label.id}
              id={"tile:" + label.id}
              item={label.media}
              selected={selected === label.id}
              onClick={() => setSelected(selected === label.id ? null : label.id)}
            />
          ))}
          {allPlaced && !complete && <div className="dnd-bank-complete neutral">Alle Kacheln liegen. Jetzt prüfen.</div>}
          {complete && <div className="dnd-bank-complete">Aufgabe abgeschlossen.</div>}
        </div>

        <div className="diagram-label-stage">
          <img src={imageSrc} alt={imageAlt} />
          {targets.map((target) => {
            const placedId = Object.entries(placements).find(([, t]) => t === target.id)?.[0];
            const placed = labels.find((label) => label.id === placedId);
            return (
              <Target
                key={target.id}
                target={target}
                placed={placed}
                locked={Boolean(placedId && locked.includes(placedId))}
                wrong={Boolean(placedId && wrong.includes(placedId))}
                selected={selected}
                onSelectTarget={chooseTarget}
                onSelectLabel={(id) => {
                  if (!locked.includes(id)) setSelected(selected === id ? null : id);
                }}
              />
            );
          })}
        </div>
      </PointerDragProvider>

      <div className="assessment-bar">
        <span>Prüfversuche: {attempts}</span>
        <span>3 Punkte pro Beschriftung beim ersten Versuch</span>
      </div>

      {!complete && (
        <div className="game-actions assessment-actions">
          {attempts >= 1 && <button className="text-button" onClick={() => setShowHint(true)}>Hinweis</button>}
          {attempts >= 3 && <button className="text-button" onClick={reveal}>Lösung zeigen</button>}
          <button className="primary-button" disabled={!allPlaced} onClick={check}>Prüfen</button>
        </div>
      )}

      {showHint && !complete && <div className="feedback hint">{hint}</div>}
      {wrong.length > 0 && !complete && <div className="feedback hint">{wrong.length} Beschriftungen stimmen noch nicht.</div>}
      {complete && (
        <div className={solutionShown ? "feedback solution" : "feedback correct"}>
          {solutionShown ? "Lösung angezeigt." : "Schaltbild richtig beschriftet."} Ergebnis: {score}/{maxScore} Punkte.
        </div>
      )}
    </section>
  );
}
