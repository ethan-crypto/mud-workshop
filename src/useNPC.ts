import { useState, useEffect } from "react";
import { Direction } from "./common";

export type NPCState = [playerX: number, playerY: number, hunterX: number, hunterY: number];

// TODO: not sure what are params reused across proving calls
type EZKLState = any;

type MoveResult = {
  direction: Direction;
  proof: Uint8Array;
}

// TODO: ezkl prover should compute the next move with a proof.
async function computeMove (npcState: NPCState, ezState: EZKLState): Promise<MoveResult> {
  return Promise.reject("unimplemented");
}

export function useNPC() {
  const [ezkl, setEzkl] = useState(null);
  useEffect(() => {
    // TODO: init wasm
  });
  return {
    move: (state: NPCState) => {
      if (ezkl) {
	const result = computeMove(state, ezkl);
      } else {
	console.error("EZKL was not initialized");
      }
    }
  }
}
