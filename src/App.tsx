import { AccountButton } from "@latticexyz/entrykit/internal";
import { Map } from "./Map";
import { useSyncProgress } from "./mud/useSyncProgress";

export function App() {
  const { isLive, message, percentage } = useSyncProgress();

  return (
    <div>
      {isLive ? (
        <Map />
      ) : (
        <div className="tabular-nums">
          {message} ({percentage.toFixed(1)}%)…
        </div>
      )}

      <div className="absolute top-0 right-0 m-2">
        <AccountButton />
      </div>
    </div>
  );
}
