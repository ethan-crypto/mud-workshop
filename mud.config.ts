import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  sourceDirectory: "contracts",
  namespace: "app",
  enums: {
    Direction: ["North", "East", "South", "West"],
  },
  tables: {
    Tasks: {
      schema: {
        id: "uint256",
        createdAt: "uint256",
        completedAt: "uint256",
        description: "string",
      },
      key: ["id"],
    },
    Position: {
      schema: { player: "address", x: "int32", y: "int32" },
      key: ["player"],
    },
  },
  modules: [
    {
      artifactPath:
        "@latticexyz/world-modules/out/Unstable_CallWithSignatureModule.sol/Unstable_CallWithSignatureModule.json",
      root: true,
    },
  ],
});
