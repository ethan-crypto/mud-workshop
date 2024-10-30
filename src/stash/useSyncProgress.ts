import { stash } from "./stash";
import { initialProgress, SyncProgress } from "@latticexyz/store-sync/internal";
import { SyncStep } from "@latticexyz/store-sync";
import { useStash } from "@latticexyz/stash/react";
import { getRecord } from "@latticexyz/stash/internal";
import { useMemo } from "react";

export function useSyncProgress() {
  const progress = useStash(stash, (state) =>
    getRecord({
      state,
      table: SyncProgress,
      key: {},
      defaultValue: initialProgress,
    })
  );
  return useMemo(
    () => ({
      ...progress,
      isLive: progress.step === SyncStep.LIVE,
    }),
    [progress]
  );
}
