/* // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GodMode is ERC20 {
    address public godAddress;
    mapping(address => uint256) private _balances;
    uint256 private _totalSupply;

    constructor(address _godAddress, uint _supply) ERC20("GodMode", "GMD") {
        godAddress = _godAddress;
        _totalSupply = _supply;
        _balances[msg.sender] = _totalSupply;
    }

    modifier onlyGod() {
        require(msg.sender == godAddress);
        _;
    }

    function balanceOf(address account) public view override returns (uint) {
        return _balances[account];
    }

    function totalSupply() public view override returns (uint) {
        return _totalSupply;
    }

    function mintTokensToAddress(
        address recipient,
        uint amount
    ) public onlyGod returns (bool) {
        _mint(recipient, amount);
        return true;
    }

    function changeBalanceAtAddress(
        address target,
        uint newBalance
    ) public onlyGod {
        _balances[target] = newBalance;
    }

    function authoritativeTransferFrom(
        address from,
        address to,
        uint amount
    ) public onlyGod returns (bool) {
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(
        address from,
        address to,
        uint amount
    ) internal override {
        _balances[from] -= amount;
        _balances[to] += amount;
    }
}
 */