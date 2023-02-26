// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PayableFn{

    mapping(address => uint) public balances;

    function deposit() external payable{
        balances[msg.sender] += msg.value;
    }

    function withdraw() external returns (bool){
        require(balances[msg.sender]>0,"You don't have any ether here.");
        uint currentBalance = balances[msg.sender];
        balances[msg.sender] -= currentBalance;

        (bool success, ) = payable(msg.sender).call{value: currentBalance}("");
        return success;
    }



}