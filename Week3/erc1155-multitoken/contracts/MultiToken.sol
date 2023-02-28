// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/*
    MultiToken(ERC1155) features:
        * can create 7 tokens [0,1,2,3,4,5,6] (as much more...)
        * no max supply per token
        * anyone can mint tokens for free tokens[0,1,2] - every minute
        * Tradeable tokens --> token 0, token 1, token 2
        * give permissions to only forgingContract to manipulate the forging
        * trade function
        * NOTE: all the interactions from the user MUST be with the forging contract.
*/
contract MultiToken is ERC1155, Ownable {
    using Strings for uint;

    constructor()ERC1155(""){
    }

    //to save the URIs for each tokenId
    mapping (uint => string) private _uris;

    //the minter is the only contract that can mint in this ERC1155
    address private minter;

    modifier onlyMinter{
        require(msg.sender == minter, "MultiToken: You are not the minter");
        _;
    }

    /*
        * Set URI & Return uri
        * ex: if token1 has a supply of 1000 tokens, the 1000 tokens1 will have the same URI
        * to have unique URIs you need to mint a different token id
        * the URI will always return (baseUri+tokenID)
        * ex: token1 --> "ipfs://uriForToken/1", token2 --> "ipfs://uriForToken/2"
    */
    function setURI(uint _tokenId, string memory _newUri) external onlyOwner {
        _uris[_tokenId] = _newUri;
    }

    function uri(uint256 _tokenId) public view override returns (string memory) {
        return string(abi.encodePacked((_uris[_tokenId]),_tokenId.toString()));
    }

    //Set the minter address who has permissions to mint and burn tokens in this contract
    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    //Mint by one tokenID from the minter
    function mint(address account, uint256 id, uint256 amount) external onlyMinter {
        _mint(account, id, amount,"");
    }

    //Mint by batch[] from the minter
    function mintBatch(address account, uint256[] memory ids, uint256[] memory amounts) external onlyMinter {
        _mintBatch(account, ids, amounts,"");
    }

    //Burn by batch[] from the minter
    function burnBatch(address account, uint[] memory ids, uint[] memory amounts) external  onlyMinter {
        _burnBatch(account, ids, amounts);
    }

    //Burn only by one tokenID from the minter
    function burn(address account, uint id, uint amount) external onlyMinter{
        _burn(account, id, amount);
    }

}