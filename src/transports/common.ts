import {
  type EIP1193Parameters,
  type EIP1193RequestFn as viem_EIP1193RequestFn,
  type RpcSchema,
  UnionToTuple,
} from "viem";

export type RpcMethod<
  rpcSchema extends RpcSchema,
  method extends rpcSchema[number]["Method"],
> = Extract<rpcSchema[number], { Method: method }>;

export type RpcMethods<
  rpcSchema extends RpcSchema,
  method extends rpcSchema[number]["Method"],
> = UnionToTuple<RpcMethod<rpcSchema, method>>;

export type TransportRequestFn<rpcSchema extends RpcSchema> = <
  args extends EIP1193Parameters<rpcSchema> = EIP1193Parameters<rpcSchema>,
>(
  args: args,
  options?: Parameters<viem_EIP1193RequestFn>[1]
) => Promise<
  Extract<rpcSchema[number], { Method: args["method"] }>["ReturnType"]
>;
