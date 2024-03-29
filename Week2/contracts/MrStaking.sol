// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./MrTokenv2.sol";


contract MrStakingv2 is IERC721Receiver {

    IERC721 private nft;
    MrTokenv2 private token;

    //reward token per second when the user stakes (for learning purposes is constant)
    uint constant tokenPerSecond = 11574074;

    constructor(IERC721 _nft, MrTokenv2 _token){
        nft = _nft;
        token = _token;
    }

    //mapping  User --> NFT id --> bool (to check if the user has staked or not that NFT)
    mapping(address => mapping(uint => bool)) private userToNFTStaked;

    //mapping User --> NFT id --> block.timestamp (to see at what time the NFT was staked)
    mapping(address => mapping(uint => uint)) private timeNFTStakedByUser;

    //mapping User --> NFT id --> rewards 
    //(to see the rewards generated by each NFT, allowing users to stake various NFTs)
    mapping(address => mapping(uint => uint)) private balanceOfRewardsPerNFT;

    /*
        * Function to stake the NFT into this contract
        * User MUST approve before
        * this contract will call safeTransferFrom() to send the NFT to this contract
        * set mapping User --> NFT id --> true (staked)
        * set mapping User --> NFT id --> block.timestamp (time where the NFT is staked)
    */
    function stakeNFT(uint _tokenId) public {
        nft.safeTransferFrom(msg.sender, address(this), _tokenId);
        userToNFTStaked[msg.sender][_tokenId] = true;
        timeNFTStakedByUser[msg.sender][_tokenId] = block.timestamp;
    }


    /*
        * Function to Withdraw NFT:
        * check the mapping to see if the user has staked the NFT with that tokenID
        * send the NFT back to the user using safeTransferFrom()
        * set mapping User --> NFT id --> false (not staked anymore)
    */
    function witdrawNFT(uint _tokenId) public{
        require(userToNFTStaked[msg.sender][_tokenId], "MrStakingv2: You are not allowed to withdraw this token");
        claimRewards(_tokenId);
        nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        userToNFTStaked[msg.sender][_tokenId] = false;
    }

    /*
        * Function to claim the rewards:
        * check if user can withdraw rewards and call that function to generate the rewards for the user
        * if the user pass the require(), then call the contract MrToken and mint the rewards for the user
        * send the rewards (ERC20) to the user
        * set mapping User --> NFT id --> 0 rewards
    */
    function claimRewards(uint _tokenId) public {
        require(userToNFTStaked[msg.sender][_tokenId], "MrStakingv2: You don't have any NFT staked");
        require(userCanWithdrawRewards(_tokenId), "MrStakingv2: The 24h have not passed yet, try later.");
        require(balanceOfRewardsPerNFT[msg.sender][_tokenId] > 0,"MrStakingv2: You have nothing to claim");
        balanceOfRewardsPerNFT[msg.sender][_tokenId] = 0;
        timeNFTStakedByUser[msg.sender][_tokenId] = block.timestamp;
        token.mint(msg.sender, balanceOfRewardsPerNFT[msg.sender][_tokenId]);
    }

    /*
        * Function to check if user can withdraw -(only called from withdrawNFT function)
        * find the difference between the time the user staked the NFT and the current time in seoncds
        * if the user has staked for more than 1 minute (should be 24 hours), it will generate the rewards for the user
        * return true
    */
    function userCanWithdrawRewards(uint _tokenId) internal returns(bool){
        uint timeStaked = (timeNFTStakedByUser[msg.sender][_tokenId]);
        if( timeStaked + 1 minutes < block.timestamp){
            _generateRewards(block.timestamp-timeStaked, _tokenId);
            return true;
        }
        return false;
    }

    /*
        * Function to generate the rewards - (only called from withdrawNFT function)
        * the user will get rewarded with 10 tokens x 24h || 0.00011574074 tokens x second == 11574074 tokens x second
        * set the time staked by the 
    */
    function _generateRewards(uint timeInSeconds, uint _tokenId) internal {
        uint reward = timeInSeconds * tokenPerSecond;
        balanceOfRewardsPerNFT[msg.sender][_tokenId] += reward;
    }


    //Function required to receive ERC721 tokens
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override pure returns (bytes4){
        return IERC721Receiver.onERC721Received.selector;
    }



}

