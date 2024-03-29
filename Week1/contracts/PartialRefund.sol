// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PartialRefund is ERC20 {
    address public owner;
    uint public constant MAX_SUPPLY = 1_000_000;
  
    constructor() ERC20("PartialRefund","METANA"){
        owner = msg.sender;
    }

    //Function to mint, paying exactly 1 ether
    function preSale() external payable {
        require(msg.value == 1 ether, "ERC20: Pay only 1 ether");
        require(totalSupply() < MAX_SUPPLY*10**decimals(), "ERC20: MaxSupply reached");
        _mint(msg.sender, 1000*10**decimals());
    }

    //Function to withdraw the funds to the owner, only the owner can call it
    function withdrawFunds() external returns (bool){
        require(msg.sender == owner, "ERC20: You are not the owner");
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        return success;
    }

    /*
        * sellBack() --> Users can transfer their tokens to the contract and receive 0.5 
        * ether for every 1000 tokens they transfer. 
        * 1. transfer tokens from user to this contract
        * 2. calculate amount to send to the user
        * 2.1 for every token the user is sending to this contract, will claim 0.0005 ether (or 500000000000000 wei)
        * 3. revertTx() is address(this )contract doesn't have enough balance
        * 4. send ether to the user and return success
    */
    function sellBack(uint amount) public returns(bool) {
        require(msg.sender == tx.origin);
        transfer(address(this), amount*10**decimals()); 
        uint amountToGiveBack = (amount) * 0.0005 ether;
        require(address(this).balance >= amountToGiveBack, "ERC20: Not enough ether in this contract");
        (bool success, ) = payable(msg.sender).call{value: amountToGiveBack}("");
        return success;
    }

}