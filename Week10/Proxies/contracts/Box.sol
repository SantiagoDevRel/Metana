// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Box {
    
    uint256 private value;

    event updatedValue(uint256 newValue);

    function store(uint256 _newValue) public{
        value = _newValue;
        emit updatedValue(_newValue);
    }

    function getValue() external view returns(uint256){
        return value; 
    }

}
