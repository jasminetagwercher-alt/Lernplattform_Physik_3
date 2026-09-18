import { DragDropProvider } from "@dnd-kit/react";
import { useMemo, useState } from "react";
import type { MediaItem } from "../media/MediaCard";
import { DraggableMediaTile, MediaDragOverlay } from "./DraggableMediaTile";
import { DroppableZone } from "./DroppableZone";

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
}: {
  title: string;
  prompt: string;
  groups: DropGroup[];
  tiles: GroupTile[];
}) {
  const bank = useMemo(() => shuffle(tiles), [tiles]);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongGroup, setWrongGroup] = useState<string | null>(null);

  const tileMedia = Object.fromEntries(tiles.map((tile) => [`tile:${tile.id}`, tile.media]));

  function attempt(tileId: string, targetId: string) {
    const id = tileId.replace("tile:", "");
    const groupId = targetId.replace("group:", "");
    const tile = tiles.find((item) => item.id === id);
    if (!tile) return;

    if (tile.groupId === groupId) {
      setPlaced((current) => ({ ...current, [id]: groupId }));
      setSelected(null);
      setWrongGroup(null);
      return;
    }

    setWrongGroup(groupId);
    window.setTimeout(() => setWrongGroup(null), 650);
  }

  function chooseTarget(groupId: string) {
    if (!selected) return;
    attempt(`tile:${selected}`, `group:${groupId}`);
  }

  const done = Object.keys(placed).length === tiles.length;

  return (
    <section className="game-card dnd-game">
      <div className="eyebrow">Gruppieren</div>
      <h2>{title}</h2>
      <p className="lead compact">{prompt}</p>

      <DragDropProvider
        onDragEnd={(event: any) => {
          if (event.canceled) return;
          const sourceId = String(event.operation.source?.id ?? "");
          const targetId = String(event.operation.target?.id ?? "");
          if (sourceId.startsWith("tile:") && targetId.startsWith("group:")) {
            attempt(sourceId, targetId);
          }
        }}
      >
        <div className="dnd-bank">
          {bank.map((tile) => !placed[tile.id] && (
            <DraggableMediaTile
              key={tile.id}
              id={`tile:${tile.id}`}
              item={tile.media}
              selected={selected === tile.id}
              onClick={() => setSelected(selected === tile.id ? null : tile.id)}
            />
          ))}
          {done && <div className="dnd-bank-complete">Alle Kacheln sind verteilt.</div>}
        </div>

        <div className="group-drop-grid">
          {groups.map((group) => (
            <DroppableZone
              key={group.id}
              id={`group:${group.id}`}
              title={group.title}
              subtitle={group.subtitle}
              active={selected !== null}
              error={wrongGroup === group.id}
              onClick={() => chooseTarget(group.id)}
            >
              <div className="group-drop-contents">
                {tiles
                  .filter((tile) => placed[tile.id] === group.id)
                  .map((tile) => (
                    <div className="mini-placed-tile" key={tile.id}>
                      {tile.media.kind === "symbol" && <strong>{tile.media.symbol}</strong>}
                      {tile.media.kind === "text" && <span>{tile.media.text}</span>}
                      {tile.media.kind === "image" && <img src={tile.media.src} alt={tile.media.alt} />}
                    </div>
                  ))}
                {tiles.filter((tile) => placed[tile.id] === group.id).length === 0 && (
                  <span className="empty-zone-copy">Kacheln hier ablegen</span>
                )}
              </div>
            </DroppableZone>
          ))}
        </div>

        <MediaDragOverlay items={tileMedia} />
      </DragDropProvider>

      <div className="dnd-help">Falsche Kacheln springen zurück. Richtige bleiben im Zielbereich.</div>
      {done && <div className="feedback correct">Alles richtig gruppiert.</div>}
    </section>
  );
}
