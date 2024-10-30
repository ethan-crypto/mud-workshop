import { EntryKitConfig, wiresaw } from "@latticexyz/entrykit/internal";
import { createClient, http } from "viem";
import { chainId } from "./common";
import { gasEstimator } from "./transports/gasEstimator";
import { userOpExecutor } from "./transports/userOpExecutor";
import { privateKeyToAccount } from "viem/accounts";
import { anvil } from "viem/chains";
import { transactionQueue } from "@latticexyz/common/actions";

const baseConfig = {
  walletConnectProjectId: "14ce88fdbc0f9c294e26ec9b4d848e44",
} as const satisfies Pick<
  EntryKitConfig,
  "walletConnectProjectId" | "appInfo" | "theme"
>;

function getEntryKitConfig(
  chainId: number
): Omit<EntryKitConfig, "worldAddress"> {
  // TODO: move these values into chain config

  if (chainId === 31337) {
    return {
      ...baseConfig,
      chainId,
      bundlerTransport: userOpExecutor(http(), {
        executor: createClient({
          chain: anvil,
          transport: http(),
          account: privateKeyToAccount(
            import.meta.env.VITE_ANVIL_USER_OP_EXECUTOR_PRIVATE_KEY
          ),
        }).extend(transactionQueue()),
      }),
      paymasterAddress: "0x20Ab596d26ef6cdD2aF4588284e3c09728Bfb1b9",
      passIssuerTransport: http("https://issuer.tunnel.offchain.dev/rpc"),
    };
  }

  if (chainId === 17420) {
    return {
      ...baseConfig,
      chainId,
      bundlerTransport: gasEstimator(
        wiresaw(http("https://rpc.rhodolitechain.com"))
      ),
      // https://github.com/latticexyz/quarry-paymaster/blob/a8bb2f3630c086f91ec3c283fac555ac441899b3/packages/contracts/worlds.json#L3
      paymasterAddress: "0x37257e51a4a496bb921fb634c2cbe20e945e7da8",
      passIssuerTransport: http("https://rpc.rhodolitechain.com"),
      explorerUrl: "https://explorer.mud.dev",
    };
  }

  throw new Error(`Missing EntryKit config for chain ${chainId}.`);
}

export const entryKitConfig = getEntryKitConfig(chainId);
