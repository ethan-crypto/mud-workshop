import { Chain, http, webSocket } from "viem";
import { anvil } from "viem/chains";
import { createWagmiConfig, wiresaw } from "@latticexyz/entrykit/internal";
import { entryKitConfig } from "./entryKitConfig";
import { rhodolite, garnet, redstone } from "@latticexyz/common/chains";

const chains = [
  redstone,
  garnet,
  {
    ...rhodolite,
    rpcUrls: {
      ...rhodolite.rpcUrls,
      wiresaw: {
        http: rhodolite.rpcUrls.default.http,
        webSocket: ["wss://rpc.rhodolitechain.com"],
      },
    },
  } as const satisfies Chain,
  {
    ...anvil,
    rpcUrls: {
      default: {
        http: ["https://anvil.tunnel.offchain.dev"],
        webSocket: ["wss://anvil.tunnel.offchain.dev"],
      },
    },
  } as const satisfies Chain,
] as const;

const transports = {
  [anvil.id]: webSocket(),
  [garnet.id]: http(),
  [rhodolite.id]: wiresaw(http()),
  [redstone.id]: http(),
} as const;

export const wagmiConfig = createWagmiConfig({
  ...entryKitConfig,
  appInfo: {
    ...entryKitConfig.appInfo,
    name: entryKitConfig.appInfo?.name ?? document.title,
  },
  chains,
  transports,
  pollingInterval: {
    [anvil.id]: 100,
    [garnet.id]: 2000,
    [rhodolite.id]: 2000,
    [redstone.id]: 2000,
  },
});
