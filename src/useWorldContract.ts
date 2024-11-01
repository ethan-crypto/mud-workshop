import { useClient } from "wagmi";
import { chainId, worldAbi } from "./common";
import { getContract } from "viem";
import { useSync } from "./stash/useSync";
import { useQuery } from "@tanstack/react-query";
import {
  useSessionClient,
  useEntryKitConfig,
} from "@latticexyz/entrykit/internal";

export function useWorldContract() {
  const { worldAddress } = useEntryKitConfig();
  const { waitForTransaction } = useSync();
  const client = useClient({ chainId });
  const { data: sessionClient, status: sessionClientStatus } =
    useSessionClient();

  console.log("sessionClient", sessionClientStatus, sessionClient);

  const { data: worldContract } = useQuery({
    queryKey: ["worldContract", worldAddress, client?.uid, sessionClient?.uid],
    queryFn: () => {
      if (!client || !sessionClient) {
        throw new Error("Not connected.");
      }

      return getContract({
        abi: worldAbi,
        address: worldAddress,
        client: {
          public: client,
          wallet: sessionClient,
        },
      });
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return worldContract && waitForTransaction
    ? {
        worldContract,
        waitForTransaction,
      }
    : {};
}
