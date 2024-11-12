// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {StoreSwitch} from "@latticexyz/store/src/StoreSwitch.sol";

import {IWorld} from "../codegen/world/IWorld.sol";
import {Tasks, TasksData} from "../codegen/tables/Tasks.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    StoreSwitch.setStoreAddress(worldAddress);
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    vm.startBroadcast(deployerPrivateKey);

    uint256 id = 0;
    IWorld(worldAddress).app__addTask(++id, "start new project");
    // IWorld(worldAddress).app__completeTask(id);

    IWorld(worldAddress).app__addTask(++id, "add position table");
    IWorld(worldAddress).app__addTask(++id, "show explorer");
    IWorld(worldAddress).app__addTask(++id, "add move system");
    IWorld(worldAddress).app__addTask(++id, "render players");
    IWorld(worldAddress).app__addTask(++id, "deploy to devnet");
    IWorld(worldAddress).app__addTask(++id, "upload app");

    vm.stopBroadcast();
  }
}
