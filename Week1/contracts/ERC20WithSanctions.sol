// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20SanctionsMode is ERC20 {
    address public authority;
    mapping(address => uint256) private _balances;
    uint256 private _totalSupply;
    
    constructor(address _authority, uint _supply) ERC20("SanctionsMode","SMD"){
        authority = _authority;
        _totalSupply = _supply;
        _balances[msg.sender] = _totalSupply;
    }

    mapping(address => bool) public blackList;

    modifier onlyAuthority{
        require(msg.sender == authority);
        _;
    }

    //Add wallet to the blackList
    function addToBlackList(address account) public onlyAuthority{
        blackList[account] = true;
    }

    //Remove wallet from blackList
    function removeFromBlackList(address account) external onlyAuthority{
        blackList[account] = false;
    }


    function balanceOf(address account) public view override returns(uint){
        return _balances[account];
    }

    function totalSupply() public view override returns(uint){
        return _totalSupply;
    }

    function _transfer(address from, address to, uint amount) internal override {
        //Check if the sender or receiver are in the blackList
        require(!blackList[from], "You can't send tokens from a sanctioned wallet");
        require(!blackList[to], "You can't send tokens to a sanctioned wallet");

         _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
            // decrementing then incrementing.
            _balances[to] += amount;
        }

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }
}