import { AccountButton } from "@latticexyz/entrykit/internal";
import { useSyncProgress } from "./mud/useSyncProgress";
import { Explorer } from "./Explorer";
import { stash } from "./mud/stash";
import { tables } from "./common";
import { useRecords } from "./mud/useRecords";
import { Map } from "./Map";
import { Tasks } from "./Tasks";

export function App() {
  const { isLive, message, percentage } = useSyncProgress();

  const players = useRecords({ stash, table: tables.Position });

  return (
    <div className="absolute inset-0 grid grid-cols-[16rem_auto]">
      <div className="p-4 space-y-4">
        <AccountButton />
        <Tasks />
      </div>
      <div className="p-4 grid place-items-center">
        {isLive ? (
          <Map players={Object.values(players)} />
        ) : (
          <div className="tabular-nums">
            {message} ({percentage.toFixed(1)}%)…
          </div>
        )}
      </div>

      <Explorer />
    </div>
  );
}
