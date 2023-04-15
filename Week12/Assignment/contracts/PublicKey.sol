pragma solidity ^0.4.21;

//1. here we need to pass a value bytes that we can hash 
//  and the result must be the same address as the owner variable

contract PublicKeyChallenge {
    address owner = 0x92b28647ae1f3264661f72fb2eb9625a89d88a31;
    bool public isComplete;

    function authenticate(bytes publicKey) public {
        require(address(keccak256(publicKey)) == owner);

        isComplete = true;
    }
}

