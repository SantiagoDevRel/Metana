// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MrNFT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract MintingContract {

    IERC20 public token;
    MrNFT public nft;

    constructor(IERC20 _token, MrNFT _nft ){
        token = _token;
        nft = MrNFT(_nft);
    }

    //user needs to approve first at least x10 tokens to this contract and then buyNFT()
    function buyNFT() public {
        require(token.transferFrom(msg.sender,address(this),10*10**18), "MintingToken: TransferFrom failed");
        nft.mint(msg.sender);
    }


}