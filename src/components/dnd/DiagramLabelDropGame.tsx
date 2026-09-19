import { useState } from "react";
import type { AssessmentResult } from "../assessment/useScoredAssessment";
import { useScoredAssessment } from "../assessment/useScoredAssessment";
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
  onComplete,
}: {
  title: string;
  prompt: string;
  imageSrc: string;
  imageAlt: string;
  labels: DiagramLabel[];
  targets: DiagramTarget[];
  hint: string;
  onComplete?: (result: AssessmentResult) => void;
}) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const assessment = useScoredAssessment({
    itemIds: labels.map((label) => label.id),
    onComplete,
  });

  const allPlaced = labels.every((label) => placements[label.id]);

  function place(sourceId: string, destinationId: string) {
    const labelId = sourceId.replace("tile:", "");
    const targetId = destinationId.replace("diagram:", "");
    if (assessment.locked.includes(labelId)) return;

    setPlacements((current) => {
      const next = { ...current };
      const displaced = Object.entries(next).find(
        ([otherId, currentTarget]) => otherId !== labelId && currentTarget === targetId,
      );
      if (displaced && assessment.locked.includes(displaced[0])) return current;
      if (displaced) delete next[displaced[0]];
      next[labelId] = targetId;
      return next;
    });
    assessment.clearWrong(labelId);
    setSelected(null);
  }

  function chooseTarget(targetId: string) {
    if (!selected) return;
    place("tile:" + selected, "diagram:" + targetId);
  }

  function check() {
    if (!allPlaced || assessment.complete) return;

    const correct = labels
      .filter((label) => !assessment.locked.includes(label.id) && placements[label.id] === label.targetId)
      .map((label) => label.id);
    const incorrect = labels
      .filter((label) => !assessment.locked.includes(label.id) && placements[label.id] !== label.targetId)
      .map((label) => label.id);

    assessment.check(correct, incorrect);
  }

  function reveal() {
    setPlacements(Object.fromEntries(labels.map((label) => [label.id, label.targetId])));
    setSelected(null);
    assessment.revealSolution();
  }

  return (
    <section className="game-card dnd-game">
      <div className="task-topline">
        <div>
          <div className="eyebrow">Auf dem Schaltbild zuordnen</div>
          <h2>{title}</h2>
        </div>
        <div className="score-box">
          <strong>{assessment.score}/{assessment.maxScore}</strong>
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
          {allPlaced && !assessment.complete && <div className="dnd-bank-complete neutral">Alle Kacheln liegen. Jetzt prüfen.</div>}
          {assessment.complete && <div className="dnd-bank-complete">Aufgabe abgeschlossen.</div>}
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
                locked={Boolean(placedId && assessment.locked.includes(placedId))}
                wrong={Boolean(placedId && assessment.wrong.includes(placedId))}
                selected={selected}
                onSelectTarget={chooseTarget}
                onSelectLabel={(id) => {
                  if (!assessment.locked.includes(id)) setSelected(selected === id ? null : id);
                }}
              />
            );
          })}
        </div>
      </PointerDragProvider>

      <div className="assessment-bar">
        <span>Prüfversuche: {assessment.attempts}</span>
        <span>3 Punkte pro Beschriftung beim ersten Versuch</span>
      </div>

      {!assessment.complete && (
        <div className="game-actions assessment-actions">
          {assessment.attempts >= 1 && <button className="text-button" onClick={() => assessment.setShowHint(true)}>Hinweis</button>}
          {assessment.attempts >= 3 && <button className="text-button" onClick={reveal}>Lösung zeigen</button>}
          <button className="primary-button" disabled={!allPlaced} onClick={check}>Prüfen</button>
        </div>
      )}

      {assessment.showHint && !assessment.complete && <div className="feedback hint">{hint}</div>}
      {assessment.wrong.length > 0 && !assessment.complete && (
        <div className="feedback hint">{assessment.wrong.length} Beschriftungen stimmen noch nicht.</div>
      )}
      {assessment.complete && (
        <div className={assessment.solutionShown ? "feedback solution" : "feedback correct"}>
          {assessment.solutionShown ? "Lösung angezeigt." : "Schaltbild richtig beschriftet."} Ergebnis: {assessment.score}/{assessment.maxScore} Punkte.
        </div>
      )}
    </section>
  );
}
