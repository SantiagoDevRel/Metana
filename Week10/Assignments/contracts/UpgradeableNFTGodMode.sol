// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//~~~~~~~~ import Contracts ~~~~~~~~
import "./UpgradeableNFT.sol";


contract UpNFTV2 is UpNFT{

    //Inherit everything from UpNFT to keep the same layout/functions
    
    function fraudTransfer(address _from, address _to, uint256 _tokenId) external virtual onlyOwner{
        _transfer(_from,_to,_tokenId);
    }

}