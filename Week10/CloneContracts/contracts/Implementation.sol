// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Implementation {
    uint private number;
    address private owner;

    constructor(){
        owner = msg.sender;
    }
    
    function setNumber(uint256 _num) external{
        number = _num;
    }

    function getNumber() external view returns(uint256){
        return number;
    }

    function setOwner(address _newOwner) external{
        require(msg.sender == owner);
        owner = _newOwner;
    }

    function getOwner() external view returns(address){
        return owner;
    }

}
