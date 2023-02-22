// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract MrNFTv2 is ERC721{

    uint public totalSupply;
    uint public constant MAX_SUPPLY = 10;


    constructor() ERC721("Mr NFT v2","MRN2"){
    }
    

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmSzfiayDizzpydoFN9SPFgP2MaGCkS85d1JLECy14DQUn/";
    }

    //Anyone can mint an NFT for free
    function mint() public {
        require(totalSupply<MAX_SUPPLY);
        _mint(msg.sender, totalSupply);
        totalSupply++;
    }
}