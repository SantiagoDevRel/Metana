pragma solidity ^0.4.21;

//this challenge is deprecated because we can't get the (v,r,s) from the msg.msg.sender
//  because ropsten is deprecated

contract AccountTakeoverChallenge {
    address owner = 0x6B477781b0e68031109f21887e6B5afEAaEB002b;
    bool public isComplete;

    function authenticate() public {
        require(msg.sender == owner);

        isComplete = true;
    }
}