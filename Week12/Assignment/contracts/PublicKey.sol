pragma solidity ^0.4.21;

//1. here we need to pass a value bytes (publicKey of the owner) that we can hash 
//  and the result must be the same address as the owner variable
//2. we can recover his public key by going into a block explorer
// and finding a transaction signature, and from his signature (v,r,s)
// we could retrieve the public key using ethers js library

contract PublicKeyChallenge {
    address owner = 0x92b28647ae1f3264661f72fb2eb9625a89d88a31;
    bool public isComplete;

    function authenticate(bytes publicKey) public {
        require(address(keccak256(publicKey)) == owner);

        isComplete = true;
    }
}

