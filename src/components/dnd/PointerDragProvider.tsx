import { createContext, useContext, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MediaCard, type MediaItem } from "../media/MediaCard";

type ActiveDrag = {
  id: string;
  item: MediaItem;
  x: number;
  y: number;
  moved: boolean;
};

type DragContextValue = {
  activeId: string | null;
  overId: string | null;
  startDrag: (id: string, item: MediaItem, event: ReactPointerEvent<HTMLElement>) => void;
};

const DragContext = createContext<DragContextValue | null>(null);

export function usePointerDrag() {
  const context = useContext(DragContext);
  if (!context) throw new Error("usePointerDrag must be used inside PointerDragProvider.");
  return context;
}

export function PointerDragProvider({
  children,
  onDrop,
}: {
  children: ReactNode;
  onDrop: (sourceId: string, targetId: string) => void;
}) {
  const [active, setActive] = useState<ActiveDrag | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const activeRef = useRef<ActiveDrag | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  function findTarget(x: number, y: number) {
    const element = document.elementFromPoint(x, y);
    return element?.closest<HTMLElement>("[data-drop-id]")?.dataset.dropId ?? null;
  }

  function finish(x: number, y: number) {
    const current = activeRef.current;
    const targetId = findTarget(x, y);

    if (current?.moved && targetId) {
      onDrop(current.id, targetId);
    }

    activeRef.current = null;
    setActive(null);
    setOverId(null);
    document.body.classList.remove("pointer-dragging");
    cleanupRef.current?.();
    cleanupRef.current = null;
  }

  function startDrag(
    id: string,
    item: MediaItem,
    event: ReactPointerEvent<HTMLElement>,
  ) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    const initial: ActiveDrag = { id, item, x: startX, y: startY, moved: false };
    activeRef.current = initial;
    setActive(initial);
    document.body.classList.add("pointer-dragging");

    const move = (pointerEvent: PointerEvent) => {
      pointerEvent.preventDefault();
      const current = activeRef.current;
      if (!current) return;

      const moved =
        current.moved ||
        Math.hypot(pointerEvent.clientX - startX, pointerEvent.clientY - startY) > 5;

      const next = {
        ...current,
        x: pointerEvent.clientX,
        y: pointerEvent.clientY,
        moved,
      };

      activeRef.current = next;
      setActive(next);
      setOverId(findTarget(pointerEvent.clientX, pointerEvent.clientY));
    };

    const up = (pointerEvent: PointerEvent) => finish(pointerEvent.clientX, pointerEvent.clientY);
    const cancel = (pointerEvent: PointerEvent) => finish(pointerEvent.clientX, pointerEvent.clientY);

    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up, { passive: false });
    window.addEventListener("pointercancel", cancel, { passive: false });

    cleanupRef.current = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
    };
  }

  useEffect(() => () => cleanupRef.current?.(), []);

  return (
    <DragContext.Provider
      value={{
        activeId: active?.id ?? null,
        overId,
        startDrag,
      }}
    >
      {children}
      {active &&
        createPortal(
          <div
            className="pointer-drag-overlay"
            style={{ left: active.x, top: active.y }}
            aria-hidden="true"
          >
            <MediaCard item={active.item} />
          </div>,
          document.body,
        )}
    </DragContext.Provider>
  );
}
