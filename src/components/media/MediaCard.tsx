import type { ReactNode } from "react";

export type MediaItem =
  | { id: string; kind: "text"; text: string; caption?: string }
  | { id: string; kind: "symbol"; symbol: string; caption?: string }
  | { id: string; kind: "image"; src: string; alt: string; caption?: string; credit?: string };

export function mediaItemLayoutClass(item: MediaItem) {
  if (item.kind === "image") return "media-image-item";
  if (item.kind === "symbol") return "media-symbol-item";

  if (item.text.length > 55) return "media-text-item media-text-long";
  if (item.text.length > 18) return "media-text-item media-text-medium";
  return "media-text-item media-text-short";
}

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
      className={[
        "media-card",
        mediaItemLayoutClass(item),
        selected ? "selected" : "",
        matched ? "matched" : "",
      ].join(" ")}
      onClick={onClick}
    >
      <div className="media-card-visual">
        {item.kind === "image" && <img src={item.src} alt={item.alt} />}
        {item.kind === "symbol" && <span className="media-symbol">{item.symbol}</span>}
        {item.kind === "text" && <span className="media-text" lang="de">{item.text}</span>}
      </div>
      {item.caption && <div className="media-caption">{item.caption}</div>}
      {item.kind === "image" && item.credit && <div className="media-credit">{item.credit}</div>}
      {children}
    </button>
  );
}
