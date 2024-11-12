import { useMutation } from "@tanstack/react-query";
import { Direction, directions } from "./common";
import { useWorldContract } from "./mud/useWorldContract";

export function useMove() {
  const { worldContract, waitForTransaction } = useWorldContract();

  const mutationKey = ["move", worldContract?.address];
  return useMutation<void, Error, Direction>({
    mutationKey,
    async mutationFn(direction) {
      if (!worldContract) {
        throw new Error("World contract not ready. Are you connected?");
      }

      console.log("submitting move", direction);

      const tx = await worldContract.write.app__move([
        directions.indexOf(direction),
      ]);

      console.log("waiting for move receipt", tx);
      const receipt = await waitForTransaction(tx);

      console.log("move done", receipt);
    },
  });
}
