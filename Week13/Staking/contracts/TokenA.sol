// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenA is ERC20, Ownable {
    constructor() ERC20("TokenA", "TKA") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function mint() public {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}