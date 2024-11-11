import { AccountButton } from "@latticexyz/entrykit/internal";
import { useSyncProgress } from "./mud/useSyncProgress";
import { Explorer } from "./Explorer";
import { stash } from "./mud/stash";
import { Direction, enums, tables } from "./common";
import { useRecords } from "./mud/useRecords";
import { GameMap } from "./GameMap";
import { Tasks } from "./Tasks";
import { useCallback } from "react";
import { useWorldContract } from "./useWorldContract";

export function App() {
  const { isLive, message, percentage } = useSyncProgress();

  const players = useRecords({ stash, table: tables.Position });

  const { worldContract } = useWorldContract();
  const onMove = useCallback(
    async (direction: Direction) => {
      if (!worldContract)
        throw new Error("World contract not ready. Are you connected?");

      await worldContract.write.app__move([enums.Direction.indexOf(direction)]);
    },
    [worldContract]
  );

  return (
    <div className="absolute inset-0 grid sm:grid-cols-[16rem_auto]">
      <div className="p-4 space-y-4">
        <AccountButton />
        <Tasks />
      </div>
      <div className="p-4 grid place-items-center">
        {isLive ? (
          <GameMap players={Object.values(players)} onMove={onMove} />
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
