// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenSale is ERC20 {
    address public owner;
    
    constructor() ERC20("TokenSale","METANA"){
        owner = msg.sender;
    }

    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    //Function to mint, paying exactly 1 ether
    function preSale() external payable {
        require(msg.value == 1 ether && totalSupply() <= 1000000);
        _mint(msg.sender, 1000);
    }

    //Function to withdraw the funds to the owner, only the owner can call it
    function withdrawFunds() external onlyOwner returns (bool){
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        return success;
    }
}