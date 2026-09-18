import { useDroppable } from "@dnd-kit/react";
import type { ReactNode } from "react";

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
  const { ref, isDropTarget } = useDroppable({ id });

  return (
    <button
      ref={ref}
      type="button"
      className={[
        "dnd-drop-zone",
        isDropTarget ? "over" : "",
        active ? "active" : "",
        success ? "success" : "",
        error ? "error" : "",
      ].join(" ")}
      onClick={onClick}
    >
      <span className="drop-zone-heading">
        <strong>{title}</strong>
        {subtitle && <small>{subtitle}</small>}
      </span>
      <span className="drop-zone-content">{children ?? "Kachel hier ablegen"}</span>
    </button>
  );
}
