import { Chain, http, webSocket } from "viem";
import { anvil } from "viem/chains";
import { createWagmiConfig } from "@latticexyz/entrykit/internal";
import { rhodolite, garnet, redstone } from "@latticexyz/common/chains";
import { chainId } from "./common";

const chains = [
  redstone,
  garnet,
  {
    ...rhodolite,
    rpcUrls: {
      ...rhodolite.rpcUrls,
      // TODO: move these into MUD and make sure we are okay with naming
      wiresaw: rhodolite.rpcUrls.default,
      bundler: rhodolite.rpcUrls.default,
      issuer: rhodolite.rpcUrls.default,
    },
    contracts: {
      ...rhodolite.contracts,
      // TODO: move these into MUD and make sure we are okay with naming
      paymaster: {
        // https://github.com/latticexyz/quarry-paymaster/blob/a8bb2f3630c086f91ec3c283fac555ac441899b3/packages/contracts/worlds.json#L3
        address: "0x37257e51a4a496bb921fb634c2cbe20e945e7da8",
        blockCreated: 301260,
      },
    },
    blockExplorers: {
      default: {
        name: "Blockscout",
        url: "https://explorer.rhodolitechain.com",
      },
      // TODO: finalize key/name and move to MUD
      worldsExplorer: {
        name: "Worlds Explorer",
        url: "https://explorer.mud.dev/rhodolite/worlds",
      },
    },
  },
  {
    ...anvil,

    rpcUrls: {
      ...anvil.rpcUrls,
      // TODO: automatically grant allowance in anvil instead of requiring the service
      issuer: {
        http: ["http://127.0.0.1:3003/rpc"],
      },
    },
    contracts: {
      paymaster: {
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
