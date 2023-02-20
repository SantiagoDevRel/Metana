// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenSaleWithSellBack is ERC20 {
    address public owner;
  
    constructor() ERC20("TokenSale","METANA"){
        owner = msg.sender;
    }

    //Function to mint, paying exactly 1 ether
    function preSale() external payable {
        require(msg.value == 1 ether && totalSupply() <= 1000000);
        _mint(msg.sender, 1000);
    }

    //Function to withdraw the funds to the owner, only the owner can call it
    function withdrawFunds() external returns (bool){
        require(msg.sender == owner);
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        return success;
    }

    //Users can transfer their tokens to the contract and receive 0.5 ether for every 1000 tokens they transfer. 
    function sellBack(uint amount) public returns(bool) {
        //approve this smart contract to withdraw funds from the user's balance
        super.approve(address(this), amount);

        //super.transfer(address(this), amount); //MAYBE I should transfer the tokens to address(this) contract instead of approving?
         
        //for every TokenSale that the user is giving allowance, send back to the user 0.0005 ether (or 500000000000000 wei)
        uint amountToGiveBack = amount * 0.0005 ether;

        //revert TX if the contract doesn't have enough ether
        require(address(this).balance >= amountToGiveBack, "Not enough ether in this contract");

        //send to the user the ether
        (bool success, ) = payable(msg.sender).call{value: amountToGiveBack}("");

        return success;
    }

}