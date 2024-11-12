import worldAbi from "../out/IWorld.sol/IWorld.abi.json";

export const chainId = parseInt(import.meta.env.VITE_CHAIN_ID) || 31337;
export const url = new URL(window.location.href);

export const directions = ["North", "East", "South", "West"] as const;
export type Direction = (typeof directions)[number];

export { worldAbi };
