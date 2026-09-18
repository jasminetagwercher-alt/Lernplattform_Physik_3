import type { PointerEvent } from "react";
import { MediaCard, type MediaItem } from "../media/MediaCard";
import { usePointerDrag } from "./PointerDragProvider";

export function DraggableMediaTile({
  id,
  item,
  selected = false,
  disabled = false,
  onClick,
}: {
  id: string;
  item: MediaItem;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const { activeId, startDrag } = usePointerDrag();
  const dragging = activeId === id;

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    startDrag(id, item, event);
  }

  return (
    <div
      className={`dnd-tile-shell ${dragging ? "dragging" : ""} ${disabled ? "locked" : ""}`}
      onPointerDown={handlePointerDown}
      onClick={disabled || !onClick ? undefined : (event) => { event.stopPropagation(); onClick(); }}
    >
      <MediaCard item={item} selected={selected} matched={disabled} />
    </div>
  );
}
