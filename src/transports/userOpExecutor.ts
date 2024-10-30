import {
  Account,
  BundlerRpcSchema,
  Chain,
  Client,
  Hash,
  RpcTransactionReceipt,
  RpcUserOperation,
  RpcUserOperationReceipt,
  Transport,
} from "viem";
import {
  entryPoint07Abi,
  entryPoint07Address,
  formatUserOperation,
  getUserOperationHash,
  toPackedUserOperation,
} from "viem/account-abstraction";
import { RpcMethods, TransportRequestFn } from "./common";
import { writeContract } from "viem/actions";
import { getAction } from "viem/utils";
import { estimateUserOperationGas } from "./methods/estimateUserOperationGas";

export function userOpExecutor<const transport extends Transport>(
  getTransport: transport,
  {
    executor,
  }: {
    executor: Client<Transport, Chain, Account>;
  }
): transport {
  return ((config) => {
    const { request: originalRequest, ...rest } = getTransport(config);

    const receipts = new Map<
      Hash,
      RpcTransactionReceipt | RpcUserOperationReceipt<"0.7">
    >();

    const request: TransportRequestFn<
      RpcMethods<
        BundlerRpcSchema,
        | "eth_sendUserOperation"
        | "eth_getUserOperationReceipt"
        | "eth_estimateUserOperationGas"
      >
    > = async ({ method, params }, options) => {
      if (method === "eth_sendUserOperation") {
        const [rpcUserOp, entrypoint] = params;
        if (entrypoint === entryPoint07Address) {
          const result = await sendUserOp({ executor, rpcUserOp });
          receipts.set(
            result.userOpHash,
            result as RpcUserOperationReceipt<"0.7">
          );
          return result.userOpHash;
        }
      }

      if (method === "eth_getUserOperationReceipt") {
        const [hash] = params;
        const receipt =
          receipts.get(hash) ??
          (await originalRequest({ method, params }, options));
        if (!receipts.has(hash) && receipt) {
          receipts.set(hash, receipt);
        }
        return receipt;
      }

      if (method === "eth_estimateUserOperationGas") {
        return await estimateUserOperationGas(params);
      }

      return await originalRequest({ method, params }, options);
    };

    return { request, ...rest };
  }) as transport;
}

// TODO: move this into a generic to support other versions?
const entryPointVersion = "0.7";
type entryPointVersion = typeof entryPointVersion;

export async function sendUserOp({
  executor,
  rpcUserOp,
}: {
  executor: Client<Transport, Chain, Account>;
  rpcUserOp: RpcUserOperation<entryPointVersion>;
}): Promise<
  Pick<RpcUserOperationReceipt<entryPointVersion>, "success" | "userOpHash"> & {
    receipt: Pick<
      RpcUserOperationReceipt<entryPointVersion>["receipt"],
      "transactionHash"
    >;
  }
> {
  const userOp = formatUserOperation(rpcUserOp);
  const gas =
    userOp.preVerificationGas +
    userOp.verificationGasLimit +
    (userOp.paymasterVerificationGasLimit ?? 0n) +
    (userOp.paymasterPostOpGasLimit ?? 0n) +
    userOp.callGasLimit;

  const packedUserOp = toPackedUserOperation(userOp);

  const userOpHash = getUserOperationHash({
    userOperation: userOp,
    chainId: executor.chain.id,
    entryPointVersion: "0.7",
    entryPointAddress: entryPoint07Address,
  });

  const transactionHash = await getAction(
    executor,
    writeContract,
    "writeContract"
  )({
    abi: entryPoint07Abi,
    address: entryPoint07Address,
    functionName: "handleOps",
    args: [[packedUserOp], executor.account.address],
    chain: executor.chain,
    account: executor.account,
    gas,
  });

  return {
    success: true,
    userOpHash,
    receipt: { transactionHash },
  };
}
