// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenSale is ERC20 {
    address public owner;
    mapping(address => uint256) private _balances;
    uint256 private _totalSupply;
    
    constructor() ERC20("TokenSale","METANA"){
        owner = msg.sender;
        _totalSupply = 0;
        _balances[msg.sender] = _totalSupply;
    }

    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    //Function to mint, paying exactly 1 ether
    function preSale() external payable {
        require(msg.value == 1 ether && totalSupply() <= 1000000);
        _balances[msg.sender] = 1000;
        _totalSupply += 1000;
    }

    function balanceOf(address account) public view override returns(uint){
        return _balances[account];
    }

    function totalSupply() public view override returns(uint){
        return _totalSupply;
    }
    
    //Function to withdraw the funds to the owner, only the owner can call it
    function withdrawFunds() external onlyOwner returns (bool){
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        return success;
    }
}