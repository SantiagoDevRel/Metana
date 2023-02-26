// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Commit{

    uint public constant MIN_DURATION_IN_BLOCKS = 10;
    uint public constant MAX_DURATION_IN_BLOCKS = 100;

    mapping (address => uint) public bettingOnTheBlock;

    function gambleOnTheBlockNumber() external payable{
        require(msg.value == 1 ether, "Commit: Please pay 1 ether");
        require(address(this).balance>= 1 ether, "Commit: Sorry, I can't gamble with you");
        //User must wait 90 blocks to bet again 
        require(block.number > bettingOnTheBlock[msg.sender] + MAX_DURATION_IN_BLOCKS, "Commit: Please wait to bet again 100 blocks");
        bettingOnTheBlock[msg.sender] = block.number + MIN_DURATION_IN_BLOCKS;
    }

    function claimWinning() external returns(bool) {
        require(block.number > bettingOnTheBlock[msg.sender] + MIN_DURATION_IN_BLOCKS, "Commit: Wait at least 10 blocks");
        require(block.number <= bettingOnTheBlock[msg.sender] + MAX_DURATION_IN_BLOCKS, "Commit: Too late to claim your rewards");
        if(uint256(blockhash(bettingOnTheBlock[msg.sender])) % 2 == 0){
            payable(msg.sender).transfer(1 ether);
            return true;
        }
        return false;
    }


}