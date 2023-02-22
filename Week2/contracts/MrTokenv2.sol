
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MrTokenv2 is ERC20 {

    /*
        * After deploy this contract, make sure to set the address of the minter
        * Minter address will be the only smart contract that can mint this token
        * Only the deployer of this contract can set the address of the minter setMinterAddress()
    */
    
    address private minter;
    address private creator;

    constructor() ERC20("Mr Token v2","MRT2"){
        creator = msg.sender;
    }

    function setMinterAddress(address _minter) external {
        require(msg.sender == creator, "ERC20: You are not the creator");
        minter = _minter;
    }

    function mint(address recipient, uint _amount) public {
        require(minter == msg.sender, "ERC20: Only minter can mint");
        _mint(recipient, _amount);
    }
}