// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MetanaNFT is ERC721 {
    uint public totalSupply;
    uint public constant MAX_SUPPLY = 10;

    constructor() ERC721("Metana Collection", "MTN"){

    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmSzfiayDizzpydoFN9SPFgP2MaGCkS85d1JLECy14DQUn/";
    }

    function mint() external {
        require(totalSupply<MAX_SUPPLY);
        _mint(msg.sender, totalSupply);
        totalSupply++;
    }

}