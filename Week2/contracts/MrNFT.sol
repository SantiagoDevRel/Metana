// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MrNFT is ERC721 {

    address private minter;
    address private creator;
    uint public totalSupply;
    uint public constant MAX_SUPPLY = 10;


    constructor() ERC721("Mr NFT","MRN"){
        creator = msg.sender;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmSzfiayDizzpydoFN9SPFgP2MaGCkS85d1JLECy14DQUn/";
    }

    //onlyCreator can set which contract can call the mint() function
    function setMinterAddress(address _minter) external {
        require(msg.sender == creator, "ERC721: You are not the creator");
        minter = _minter;
    }

    //only the address of the MintingContract can call this function to mint NFTs
    function mint(address user) public {
        require(msg.sender == minter, "ERC721: You are not allowed to mint");
        require(totalSupply<MAX_SUPPLY);
        _mint(user, totalSupply);
        totalSupply++;
    }

}