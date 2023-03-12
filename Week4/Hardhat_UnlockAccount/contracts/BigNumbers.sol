// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.16;

//import "hardhat/console.sol";

contract BigNumber {

    uint256 public number;

    constructor (uint _number) {
        number = _number;
    }

    function setToTheMax() external{
        number = type(uint256).max;
        //console.log(number);
    }

    function getNumber() external view returns(uint256){
        return number;
    }

}