// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {System} from "@latticexyz/world/src/System.sol";

import {IWorld} from "./codegen/world/IWorld.sol";
import {Direction} from "./codegen/common.sol";
import {Position, PositionData} from "./codegen/tables/Position.sol";
import {MAP_SIZE} from "./constants.sol";
import {Halo2Verifier} from "./verifier.sol";

contract HunterNPCSystem is System {
  Halo2Verifier immutable verifier = new Halo2Verifier();

  function move(bytes calldata proof, uint256[] calldata instances) public {
    verifier.verifyProof(proof, instances);
    IWorld(_world()).move(direction);
  }
}
