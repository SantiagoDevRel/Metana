// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract ExtReturn{

    address public owner;
    mapping(address => uint) public balances;

    constructor(){
        owner = msg.sender;
        balances[msg.sender] = 10;
    }

    function transfer(address _from, address _to, uint amount) external returns(bool){
        require(msg.sender == owner,"You are not the owner");
        balances[_from] -= amount;
        balances[_to] += amount;
        
        return true;

    }

    function getBalance(address account) external view returns(uint){
        return balances[account];
    }


}