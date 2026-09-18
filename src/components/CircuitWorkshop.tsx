import { CircuitBuilder } from "./games/CircuitBuilder";
import { HotspotGame } from "./games/HotspotGame";

export function CircuitWorkshop() {
  return (
    <div className="challenge-stack">
      <CircuitBuilder />
      <HotspotGame />
    </div>
  );
}
