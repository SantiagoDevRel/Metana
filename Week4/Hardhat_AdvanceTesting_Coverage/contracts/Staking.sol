// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Staking{

    uint public constant DURATION = 10 seconds;

    struct Account{
        uint amountStaked;
        uint timeWhenStaked;
    }

    mapping(address => Account) public staked;

    function deposit() external payable{
        require(msg.value>0, "Staking: amount can't be 0");
        staked[msg.sender].amountStaked += msg.value;
        staked[msg.sender].timeWhenStaked = block.timestamp;

    }

    function withdraw() external returns(bool){
        require(staked[msg.sender].amountStaked > 0, "Staking: You don't have funds in this contract");
        require(block.timestamp - staked[msg.sender].timeWhenStaked > DURATION, "Staking: Please wait at least 10 seconds to withdraw");
        uint balanceUser = staked[msg.sender].amountStaked;
        staked[msg.sender].amountStaked -= balanceUser;
        (bool success, ) = payable(msg.sender).call{value: balanceUser }("");
        return success;
    }

}