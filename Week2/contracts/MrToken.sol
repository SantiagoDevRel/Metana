// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MrToken is ERC20 {

    constructor() ERC20("Mr Token","MRT"){

    }

    //user can mint by 10 tokens at a time(enough to buy 1 MrNFT)
    function mint() public {
        _mint(msg.sender, 10 * 10 ** 18);
    }
}