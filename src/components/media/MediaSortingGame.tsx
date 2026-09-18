import { useMemo, useState } from "react";
import { MediaCard, type MediaItem } from "./MediaCard";

export type MediaSortItem = {
  id: string;
  media: MediaItem;
};

const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export function MediaSortingGame({
  title,
  prompt,
  items,
  correctOrder,
}: {
  title: string;
  prompt: string;
  items: MediaSortItem[];
  correctOrder: string[];
}) {
  const initial = useMemo(() => shuffle(items), [items]);
  const [order, setOrder] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

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
    setChecked(false);
  }

  function move(id: string, direction: -1 | 1) {
    setOrder((current) => {
      const index = current.findIndex((item) => item.id === id);
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setChecked(false);
  }

  const correct =
    JSON.stringify(order.map((item) => item.id)) === JSON.stringify(correctOrder);

  return (
    <section className="game-card">
      <div className="eyebrow">Grafisch sortieren</div>
      <h2>{title}</h2>
      <p className="lead compact">{prompt}</p>

      <div className="media-sort-list">
        {order.map((item, index) => (
          <div
            key={item.id}
            className="media-sort-row"
            draggable
            onDragStart={() => setDragId(item.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => dropOn(item.id)}
          >
            <span className="sort-number">{index + 1}</span>
            <MediaCard item={item.media} />
            <div className="sort-controls">
              <button onClick={() => move(item.id, -1)}>↑</button>
              <button onClick={() => move(item.id, 1)}>↓</button>
            </div>
          </div>
        ))}
      </div>

      <div className="game-actions">
        <button className="primary-button" onClick={() => setChecked(true)}>Reihenfolge prüfen</button>
      </div>

      {checked && (
        <div className={correct ? "feedback correct" : "feedback hint"}>
          {correct ? "Die Reihenfolge stimmt." : "Die Reihenfolge stimmt noch nicht."}
        </div>
      )}
    </section>
  );
}
