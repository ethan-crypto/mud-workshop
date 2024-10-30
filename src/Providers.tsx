import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { StashSyncProvider } from "./stash/StashSyncProvider";
import { stash } from "./stash/stash";
import { Address } from "viem";
import { EntryKitProvider } from "@latticexyz/entrykit/internal";
import { entryKitConfig } from "./entryKitConfig";
import { wagmiConfig } from "./wagmiConfig";

const queryClient = new QueryClient();

export type Props = {
  worldDeploy: {
    address: Address;
    blockNumber: bigint | null;
  };
  children: ReactNode;
};

export function Providers({ worldDeploy, children }: Props) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <EntryKitProvider
          config={{ worldAddress: worldDeploy.address, ...entryKitConfig }}
        >
          <StashSyncProvider
            address={worldDeploy.address}
            startBlock={worldDeploy.blockNumber ?? undefined}
            stash={stash}
          >
            {children}
          </StashSyncProvider>
        </EntryKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
