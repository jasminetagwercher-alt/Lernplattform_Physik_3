import { useMemo, useState } from "react";
import { MediaCard, type MediaItem } from "./MediaCard";

export type GroupItem = {
  id: string;
  groupId: string;
  media: MediaItem;
};

export type GroupDefinition = {
  id: string;
  title: string;
  subtitle?: string;
};

const shuffle = <T,>(items: T[]) =>
  [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export function MediaGroupingGame({
  title,
  prompt,
  groups,
  items,
}: {
  title: string;
  prompt: string;
  groups: GroupDefinition[];
  items: GroupItem[];
}) {
  const shuffled = useMemo(() => shuffle(items), [items]);
  const [selected, setSelected] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  function place(groupId: string) {
    if (!selected) return;
    setPlacements((current) => ({ ...current, [selected]: groupId }));
    setSelected(null);
    setChecked(false);
  }

  const allPlaced = items.every((item) => placements[item.id]);
  const correct = allPlaced && items.every((item) => placements[item.id] === item.groupId);

  return (
    <section className="game-card">
      <div className="eyebrow">Gruppieren</div>
      <h2>{title}</h2>
      <p className="lead compact">{prompt}</p>

      <div className="grouping-bank">
        {shuffled.map((item) => (
          <MediaCard
            key={item.id}
            item={item.media}
            selected={selected === item.id}
            matched={Boolean(placements[item.id])}
            onClick={() => setSelected(item.id)}
          >
            {placements[item.id] && (
              <span className="placed-badge">
                {groups.find((group) => group.id === placements[item.id])?.title}
              </span>
            )}
          </MediaCard>
        ))}
      </div>

      <div className="group-targets">
        {groups.map((group) => (
          <button key={group.id} className="group-target" onClick={() => place(group.id)}>
            <strong>{group.title}</strong>
            {group.subtitle && <span>{group.subtitle}</span>}
            <small>{Object.values(placements).filter((id) => id === group.id).length} Karten</small>
          </button>
        ))}
      </div>

      <div className="game-actions">
        <button className="primary-button" disabled={!allPlaced} onClick={() => setChecked(true)}>
          Gruppierung prüfen
        </button>
      </div>

      {checked && (
        <div className={correct ? "feedback correct" : "feedback hint"}>
          {correct ? "Alle Karten sind richtig gruppiert." : "Mindestens eine Karte liegt noch in der falschen Gruppe."}
        </div>
      )}
    </section>
  );
}
