// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


contract MrStakingv2 is IERC721Receiver {

    IERC721 public nft;
    //uint public countStaked;

    constructor(IERC721 _nft){
        nft = _nft;
    }

    //mapping from the user to the NFT id the user has staked
    mapping(address => mapping(uint => bool)) public userToNFTStaked;

    //mapping from user -> tokenid -> block.timestamp to see at what time the NFT was staked
    mapping(address => mapping(uint => uint)) public timeNFTStakedByUser;

    //function to stake the NFT into the contract
    function stakeNFT(uint _tokenId) public {
        //user must approve before
        nft.safeTransferFrom(msg.sender, address(this), _tokenId);
        userToNFTStaked[msg.sender][_tokenId] = true;
        _stakingERC20(_tokenId);
    }

    //function to withdraw the NFT, the timer of the staking will be set to 0 again.
    function witdrawNFT(uint _tokenId) public{
        require(userToNFTStaked[msg.sender][_tokenId], "MrStaking: You are not allowed to withdraw this token");
        nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        userToNFTStaked[msg.sender][_tokenId] = false;
    }

    //function that sets the time when the user stakes NFT
    function _stakingERC20(uint _tokenId) internal {
        timeNFTStakedByUser[msg.sender][_tokenId] = block.timestamp;
    }

    //check if the 24h since the NFT was staked have passed or not (for testing purposes, only 1 minute)
    function userCanWithdrawRewards(uint _tokenId) public view returns(bool){
        uint timeStaked = timeNFTStakedByUser[msg.sender][_tokenId];
        if(timeStaked + 1 minutes < block.timestamp){
            return true;
        }
        return false;
    }

    function withdrawRewards(uint _tokenId) public {
        require(userCanWithdrawRewards(_tokenId), "MrStaking: The 24h have not passed yet, try later.");
        //mint 10 ERC20 tokens
        //send to the user 10 ERC20 tokens
    }



    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override pure returns (bytes4){
        return IERC721Receiver.onERC721Received.selector;
    }



}