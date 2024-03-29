// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract DemoSignature {

    using ECDSA for bytes32;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function isMessageValid(bytes memory _signature, address _userAddress)external view returns(address){
       
        //1. Find the message hash --> Hash(thisContract + msg.sender)
        bytes32 _messageHash = keccak256(abi.encodePacked(address(this),_userAddress));
       
        //2. Find the ETH message hash (\x19Ethereum Signed Message:\n32,_messageHash)
        bytes32 _ETHMsg = _messageHash.toEthSignedMessageHash();
       
        //3. Recover the address of the signer
        address _signer = _ETHMsg.recover(_signature);  

        //4. must return owner address
        return _signer;   

    }


}