import { useMemo, useState } from "react";
import type { AssessmentResult } from "../assessment/useScoredAssessment";
import { useScoredAssessment } from "../assessment/useScoredAssessment";
import { mediaItemLayoutClass, type MediaItem } from "../media/MediaCard";
import { DraggableMediaTile } from "./DraggableMediaTile";
import { DroppableZone } from "./DroppableZone";
import { PointerDragProvider } from "./PointerDragProvider";

export type DropGroup = {
  id: string;
  title: string;
  subtitle?: string;
};

export type GroupTile = {
  id: string;
  groupId: string;
  media: MediaItem;
};

const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export function GroupDropGame({
  title,
  prompt,
  groups,
  tiles,
  hint = "Vergleiche die Karten noch einmal mit den Überschriften der Zielbereiche.",
  onComplete,
}: {
  title: string;
  prompt: string;
  groups: DropGroup[];
  tiles: GroupTile[];
  hint?: string;
  onComplete?: (result: AssessmentResult) => void;
}) {
  const bank = useMemo(() => shuffle(tiles), [tiles]);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const assessment = useScoredAssessment({
    itemIds: tiles.map((tile) => tile.id),
    onComplete,
  });

  const allPlaced = tiles.every((tile) => placements[tile.id]);

  function place(tileSourceId: string, targetSourceId: string) {
    const tileId = tileSourceId.replace("tile:", "");
    const groupId = targetSourceId.replace("group:", "");
    if (assessment.locked.includes(tileId)) return;

    setPlacements((current) => ({ ...current, [tileId]: groupId }));
    assessment.clearWrong(tileId);
    setSelected(null);
  }

  function chooseTarget(groupId: string) {
    if (!selected) return;
    place("tile:" + selected, "group:" + groupId);
  }

  function check() {
    if (!allPlaced || assessment.complete) return;

    const correct = tiles
      .filter((tile) => !assessment.locked.includes(tile.id) && placements[tile.id] === tile.groupId)
      .map((tile) => tile.id);
    const incorrect = tiles
      .filter((tile) => !assessment.locked.includes(tile.id) && placements[tile.id] !== tile.groupId)
      .map((tile) => tile.id);

    assessment.check(correct, incorrect);
  }

  function revealSolution() {
    setPlacements(Object.fromEntries(tiles.map((tile) => [tile.id, tile.groupId])));
    setSelected(null);
    assessment.revealSolution();
  }

  return (
    <section className="game-card dnd-game">
      <div className="task-topline">
        <div>
          <div className="eyebrow">Kacheln zuordnen</div>
          <h2>{title}</h2>
        </div>
        <div className="score-box">
          <strong>{assessment.score}/{assessment.maxScore}</strong>
          <span>Punkte</span>
        </div>
      </div>
      <p className="lead compact">{prompt}</p>

      <PointerDragProvider onDrop={place}>
        <div className="dnd-bank">
          {bank.map((tile) => !placements[tile.id] && (
            <DraggableMediaTile
              key={tile.id}
              id={"tile:" + tile.id}
              item={tile.media}
              selected={selected === tile.id}
              onClick={() => setSelected(selected === tile.id ? null : tile.id)}
            />
          ))}
          {allPlaced && !assessment.complete && (
            <div className="dnd-bank-complete neutral">Alle Kacheln liegen. Jetzt erst prüfen.</div>
          )}
          {assessment.complete && <div className="dnd-bank-complete">Aufgabe abgeschlossen.</div>}
        </div>

        <div className="group-drop-grid">
          {groups.map((group) => (
            <DroppableZone
              key={group.id}
              id={"group:" + group.id}
              title={group.title}
              subtitle={group.subtitle}
              active={selected !== null}
              onClick={() => chooseTarget(group.id)}
            >
              <div className="group-drop-contents">
                {tiles
                  .filter((tile) => placements[tile.id] === group.id)
                  .map((tile) => (
                    <div
                      className={[
                        "placed-draggable",
                        mediaItemLayoutClass(tile.media),
                        assessment.locked.includes(tile.id) ? "correct" : "",
                        assessment.wrong.includes(tile.id) ? "wrong" : "",
                      ].join(" ")}
                      key={tile.id}
                    >
                      <DraggableMediaTile
                        id={"tile:" + tile.id}
                        item={tile.media}
                        disabled={assessment.locked.includes(tile.id)}
                        selected={selected === tile.id}
                        onClick={() => {
                          if (!assessment.locked.includes(tile.id)) {
                            setSelected(selected === tile.id ? null : tile.id);
                          }
                        }}
                      />
                    </div>
                  ))}
                {tiles.filter((tile) => placements[tile.id] === group.id).length === 0 && (
                  <span className="empty-zone-copy">Kacheln hier ablegen</span>
                )}
              </div>
            </DroppableZone>
          ))}
        </div>
      </PointerDragProvider>

      <div className="assessment-bar">
        <span>Prüfversuche: {assessment.attempts}</span>
        <span>Pro Kachel sind anfangs 3 Punkte möglich.</span>
      </div>

      {!assessment.complete && (
        <div className="game-actions assessment-actions">
          {assessment.attempts >= 1 && <button className="text-button" onClick={() => assessment.setShowHint(true)}>Hinweis</button>}
          {assessment.attempts >= 3 && <button className="text-button" onClick={revealSolution}>Lösung zeigen</button>}
          <button className="primary-button" disabled={!allPlaced} onClick={check}>Prüfen</button>
        </div>
      )}

      {assessment.showHint && !assessment.complete && <div className="feedback hint">{hint}</div>}
      {assessment.wrong.length > 0 && !assessment.complete && (
        <div className="feedback hint">
          {assessment.wrong.length} {assessment.wrong.length === 1 ? "Kachel liegt" : "Kacheln liegen"} noch falsch.
        </div>
      )}
      {assessment.complete && (
        <div className={assessment.solutionShown ? "feedback solution" : "feedback correct"}>
          {assessment.solutionShown
            ? "Lösung angezeigt. Dein Ergebnis: " + assessment.score + " von " + assessment.maxScore + " Punkten."
            : "Geschafft: " + assessment.score + " von " + assessment.maxScore + " Punkten."}
        </div>
      )}
    </section>
  );
}
