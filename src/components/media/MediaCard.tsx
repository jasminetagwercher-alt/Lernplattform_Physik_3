import type { ReactNode } from "react";

export type MediaItem =
  | { id: string; kind: "text"; text: string; caption?: string }
  | { id: string; kind: "symbol"; symbol: string; caption?: string }
  | { id: string; kind: "image"; src: string; alt: string; caption?: string; credit?: string };

export function MediaCard({
  item,
  selected = false,
  matched = false,
  children,
  onClick,
}: {
  item: MediaItem;
  selected?: boolean;
  matched?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`media-card ${selected ? "selected" : ""} ${matched ? "matched" : ""}`}
      onClick={onClick}
    >
      <div className="media-card-visual">
        {item.kind === "image" && <img src={item.src} alt={item.alt} />}
        {item.kind === "symbol" && <span className="media-symbol">{item.symbol}</span>}
        {item.kind === "text" && <span className="media-text">{item.text}</span>}
      </div>
      {item.caption && <div className="media-caption">{item.caption}</div>}
      {item.kind === "image" && item.credit && <div className="media-credit">{item.credit}</div>}
      {children}
    </button>
  );
}
