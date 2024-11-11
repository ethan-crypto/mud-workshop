// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {System} from "@latticexyz/world/src/System.sol";
import {Tasks, TasksData} from "./codegen/tables/Tasks.sol";

contract TaskSystem is System {
  function addTask(uint256 id, string memory description) public {
    Tasks.set(id, TasksData({description: description, createdAt: block.timestamp, completedAt: 0}));
  }

  function completeTask(uint256 id) public {
    Tasks.setCompletedAt(id, block.timestamp);
  }

  function resetTask(uint256 id) public {
    Tasks.setCompletedAt(id, 0);
  }

  function deleteTask(uint256 id) public {
    Tasks.deleteRecord(id);
  }
}
