import {
  connectorsForWallets,
  getDefaultWallets,
  WalletList,
} from "@rainbow-me/rainbowkit";
import { Chain, http, webSocket } from "viem";
import { anvil } from "viem/chains";
import { createConfig } from "wagmi";
import { passkeyWallet, wiresaw } from "@latticexyz/entrykit/internal";
import { entryKitConfig } from "./entryKitConfig";
import { rhodolite, garnet, redstone } from "@latticexyz/common/chains";
import { chainId } from "./common";

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

const { wallets: defaultWallets } = getDefaultWallets();
const wallets: WalletList = [
  {
    groupName: "Recommended",
    wallets: [
      passkeyWallet({
        // TODO: allow any chain ID
        chainId,
        bundlerTransport: entryKitConfig.bundlerTransport,
        paymasterAddress: entryKitConfig.paymasterAddress,
        explorerUrl: entryKitConfig.explorerUrl,
      }),
    ],
  },
  ...defaultWallets,
];

const connectors = connectorsForWallets(wallets, {
  appName: entryKitConfig.appInfo?.name ?? document.title,
  projectId: entryKitConfig.walletConnectProjectId,
});

export const wagmiConfig = createConfig({
  connectors,
  chains,
  transports: {
    [anvil.id]: webSocket(),
    [garnet.id]: http(),
    [rhodolite.id]: wiresaw(http()),
    [redstone.id]: http(),
  },
  pollingInterval: {
    [anvil.id]: 100,
    [garnet.id]: 2000,
    [rhodolite.id]: 2000,
    [redstone.id]: 2000,
  },
});
