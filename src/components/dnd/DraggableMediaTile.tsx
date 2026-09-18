import { DragOverlay, useDraggable } from "@dnd-kit/react";
import { MediaCard, type MediaItem } from "../media/MediaCard";

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
  const { ref, isDragging } = useDraggable({ id, disabled });

  return (
    <div
      ref={ref}
      className={`dnd-tile-shell ${isDragging ? "dragging" : ""} ${disabled ? "locked" : ""}`}
    >
      <MediaCard item={item} selected={selected} matched={disabled} onClick={onClick} />
    </div>
  );
}

export function MediaDragOverlay({
  items,
}: {
  items: Record<string, MediaItem>;
}) {
  return (
    <DragOverlay>
      {(source) => {
        const item = items[String(source.id)];
        if (!item) return null;
        return (
          <div className="dnd-overlay-card">
            <MediaCard item={item} />
          </div>
        );
      }}
    </DragOverlay>
  );
}
