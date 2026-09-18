import type { KeyboardEvent, ReactNode } from "react";
import { usePointerDrag } from "./PointerDragProvider";

export function DroppableZone({
  id,
  title,
  subtitle,
  active = false,
  success = false,
  error = false,
  children,
  onClick,
}: {
  id: string;
  title: string;
  subtitle?: string;
  active?: boolean;
  success?: boolean;
  error?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}) {
  const { overId } = usePointerDrag();
  const isOver = overId === id;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.key === "Enter" || event.key === " ") && onClick) {
      event.preventDefault();
      onClick();
    }
  }

  return (
    <div
      data-drop-id={id}
      className={[
        "dnd-drop-zone",
        isOver ? "over" : "",
        active ? "active" : "",
        success ? "success" : "",
        error ? "error" : "",
      ].join(" ")}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className="drop-zone-heading">
        <strong>{title}</strong>
        {subtitle && <small>{subtitle}</small>}
      </span>
      <span className="drop-zone-content">{children ?? "Kachel hier ablegen"}</span>
    </div>
  );
}
