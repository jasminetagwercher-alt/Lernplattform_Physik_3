import { useMemo, useState } from "react";
import type { MediaItem } from "../media/MediaCard";
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
}: {
  title: string;
  prompt: string;
  groups: DropGroup[];
  tiles: GroupTile[];
  hint?: string;
}) {
  const bank = useMemo(() => shuffle(tiles), [tiles]);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [available, setAvailable] = useState<Record<string, number>>(
    () => Object.fromEntries(tiles.map((tile) => [tile.id, 3])),
  );
  const [showHint, setShowHint] = useState(false);
  const [solvedBySolution, setSolvedBySolution] = useState(false);

  const maxScore = tiles.length * 3;
  const allPlaced = tiles.every((tile) => placements[tile.id]);
  const complete = locked.length === tiles.length;

  function place(tileSourceId: string, targetSourceId: string) {
    const tileId = tileSourceId.replace("tile:", "");
    const groupId = targetSourceId.replace("group:", "");
    if (locked.includes(tileId)) return;

    setPlacements((current) => ({ ...current, [tileId]: groupId }));
    setWrong((items) => items.filter((id) => id !== tileId));
    setSelected(null);
  }

  function chooseTarget(groupId: string) {
    if (!selected) return;
    place(`tile:${selected}`, `group:${groupId}`);
  }

  function check() {
    if (!allPlaced || complete) return;

    const newlyCorrect = tiles
      .filter((tile) => !locked.includes(tile.id) && placements[tile.id] === tile.groupId)
      .map((tile) => tile.id);
    const newlyWrong = tiles
      .filter((tile) => !locked.includes(tile.id) && placements[tile.id] !== tile.groupId)
      .map((tile) => tile.id);

    setAttempts((value) => value + 1);
    setLocked((current) => [...current, ...newlyCorrect]);
    setWrong(newlyWrong);
    setScore((value) => value + newlyCorrect.reduce((sum, id) => sum + (available[id] ?? 0), 0));
    setAvailable((current) => {
      const next = { ...current };
      newlyWrong.forEach((id) => {
        next[id] = Math.max(0, (next[id] ?? 0) - 1);
      });
      return next;
    });
  }

  function revealSolution() {
    setPlacements(Object.fromEntries(tiles.map((tile) => [tile.id, tile.groupId])));
    setLocked(tiles.map((tile) => tile.id));
    setWrong([]);
    setAvailable(Object.fromEntries(tiles.map((tile) => [tile.id, 0])));
    setSolvedBySolution(true);
    setSelected(null);
  }

  return (
    <section className="game-card dnd-game">
      <div className="task-topline">
        <div>
          <div className="eyebrow">Kacheln zuordnen</div>
          <h2>{title}</h2>
        </div>
        <div className="score-box">
          <strong>{score}/{maxScore}</strong>
          <span>Punkte</span>
        </div>
      </div>
      <p className="lead compact">{prompt}</p>

      <PointerDragProvider onDrop={place}>
        <div className="dnd-bank">
          {bank.map((tile) => !placements[tile.id] && (
            <DraggableMediaTile
              key={tile.id}
              id={`tile:${tile.id}`}
              item={tile.media}
              selected={selected === tile.id}
              onClick={() => setSelected(selected === tile.id ? null : tile.id)}
            />
          ))}
          {allPlaced && !complete && (
            <div className="dnd-bank-complete neutral">Alle Kacheln liegen. Jetzt erst prüfen.</div>
          )}
          {complete && <div className="dnd-bank-complete">Aufgabe abgeschlossen.</div>}
        </div>

        <div className="group-drop-grid">
          {groups.map((group) => (
            <DroppableZone
              key={group.id}
              id={`group:${group.id}`}
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
                        locked.includes(tile.id) ? "correct" : "",
                        wrong.includes(tile.id) ? "wrong" : "",
                      ].join(" ")}
                      key={tile.id}
                    >
                      <DraggableMediaTile
                        id={`tile:${tile.id}`}
                        item={tile.media}
                        disabled={locked.includes(tile.id)}
                        selected={selected === tile.id}
                        onClick={() => {
                          if (!locked.includes(tile.id)) setSelected(selected === tile.id ? null : tile.id);
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
        <span>Prüfversuche: {attempts}</span>
        <span>Pro Kachel sind anfangs 3 Punkte möglich.</span>
      </div>

      {!complete && (
        <div className="game-actions assessment-actions">
          {attempts >= 1 && <button className="text-button" onClick={() => setShowHint(true)}>Hinweis</button>}
          {attempts >= 3 && <button className="text-button" onClick={revealSolution}>Lösung zeigen</button>}
          <button className="primary-button" disabled={!allPlaced} onClick={check}>Prüfen</button>
        </div>
      )}

      {showHint && !complete && <div className="feedback hint">{hint}</div>}
      {wrong.length > 0 && !complete && (
        <div className="feedback hint">
          {wrong.length} {wrong.length === 1 ? "Kachel liegt" : "Kacheln liegen"} noch falsch. Verschiebe nur diese Kacheln und prüfe erneut.
        </div>
      )}
      {complete && (
        <div className={solvedBySolution ? "feedback solution" : "feedback correct"}>
          {solvedBySolution
            ? `Lösung angezeigt. Dein Ergebnis: ${score} von ${maxScore} Punkten.`
            : `Geschafft: ${score} von ${maxScore} Punkten.`}
        </div>
      )}
    </section>
  );
}
