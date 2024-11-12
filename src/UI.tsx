import { AccountButton } from "@latticexyz/entrykit/internal";
import { useSyncProgress } from "./mud/useSyncProgress";
import { Explorer } from "./Explorer";
import { Tasks } from "./Tasks";
import { ReactNode } from "react";

export type Props = {
  children?: ReactNode;
};

export function UI({ children }: Props) {
  const { isLive, message, percentage } = useSyncProgress();

  return (
    <div className="absolute inset-0 grid sm:grid-cols-[auto_16rem]">
      <div className="p-4 grid place-items-center">
        {isLive ? (
          children
        ) : (
          <div className="tabular-nums">
            {message} ({percentage.toFixed(1)}%)…
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        <AccountButton />
        {isLive ? <Tasks /> : null}
      </div>

      <Explorer />
    </div>
  );
}
