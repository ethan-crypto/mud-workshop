import { Chain, http, webSocket } from "viem";
import { anvil } from "viem/chains";
import { createWagmiConfig } from "@latticexyz/entrykit/internal";
import { rhodolite, garnet, redstone } from "@latticexyz/common/chains";
import { chainId } from "./common";

const chains = [
  redstone,
  garnet,
  rhodolite,
  {
    ...anvil,
    rpcUrls: {
      ...anvil.rpcUrls,
      // TODO: automatically grant allowance in anvil instead of requiring the service
      quarryPassIssuer: {
        http: ["http://127.0.0.1:3003/rpc"],
      },
    },
    contracts: {
      // TODO: make optional in entrykit?
      quarryPaymaster: {
        address: "0x20Ab596d26ef6cdD2aF4588284e3c09728Bfb1b9",
      },
    },
  },
] as const satisfies Chain[];

const transports = {
  [anvil.id]: webSocket(),
  [garnet.id]: http(),
  [rhodolite.id]: http(),
  [redstone.id]: http(),
} as const;

export const wagmiConfig = createWagmiConfig({
  chainId,
  walletConnectProjectId: "14ce88fdbc0f9c294e26ec9b4d848e44",
  appName: document.title,
  chains,
  transports,
  pollingInterval: {
    [anvil.id]: 2000,
    [garnet.id]: 2000,
    [rhodolite.id]: 2000,
    [redstone.id]: 2000,
  },
});
