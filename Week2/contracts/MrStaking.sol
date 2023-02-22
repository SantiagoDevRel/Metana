// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";




contract MrStakingv2 is IERC721Receiver {

    IERC721 public nft;
    MrTokenv2 public token;

    constructor(IERC721 _nft, MrTokenv2 _token){
        nft = _nft;
        token = _token;
    }

    //mapping from the user to the NFT id the user has staked
    mapping(address => mapping(uint => bool)) public userToNFTStaked;

    //mapping from user -> tokenid -> block.timestamp to see at what time the NFT was staked
    mapping(address => mapping(uint => uint)) public timeNFTStakedByUser;

    //mapping to track the rewards of each user from user --> tokenId --> reward
    mapping(address => mapping(uint => uint)) public balanceOfRewardsPerNFT;

    //function to stake the NFT into the contract
    function stakeNFT(uint _tokenId) public {
        //user must approve before
        //transfer NFT from the user to this contract
        nft.safeTransferFrom(msg.sender, address(this), _tokenId);
        //set true the mapping from the user to the tokenId staked
        userToNFTStaked[msg.sender][_tokenId] = true;
        //call function to setup the time when the NFT is staked
        _stakingERC20(_tokenId);
    }

    //function that sets the time when the user stakes NFT
    function _stakingERC20(uint _tokenId) internal {
        //set up block.timestamp when the user stakes an NFT
        timeNFTStakedByUser[msg.sender][_tokenId] = block.timestamp;
    }

    /*
        * Function to Withdraw NFT:
        * check the mapping to see if the user has staked the NFT with that tokenID
        * check if user can withdraw rewards and call that function to generate the rewards for the user
        * call the contract MrToken and mint the rewards for the user
        * remove the mapping user-->tokenId-->false
        * set the rewards of the user to 0 again
    */
    function witdrawNFT(uint _tokenId) public{
        require(userToNFTStaked[msg.sender][_tokenId], "MrStaking: You are not allowed to withdraw this token");
        require(userCanWithdrawRewards(_tokenId), "MrStaking: The 24h have not passed yet, try later.");
        token.mint(msg.sender, balanceOfRewardsPerNFT[msg.sender][_tokenId]);
        nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        userToNFTStaked[msg.sender][_tokenId] = false;
        balanceOfRewardsPerNFT[msg.sender][_tokenId] = 0;
    }

    /*
        * Function to check if user can withdraw:
        * find the difference between the time the user staked the NFT and the current time in seoncds
        * if the user has staked for more than 1 minute (should be 24 hours), it will generate the rewards for the user
        * return true
    */
    function userCanWithdrawRewards(uint _tokenId) internal returns(bool){
        uint timeStaked = timeNFTStakedByUser[msg.sender][_tokenId];
        if(timeStaked + 1 minutes < block.timestamp){
            _generateRewards(block.timestamp - timeStaked, _tokenId);
            return true;
        }
        return false;
    }

    /*
        * Function to generate the rewards
        * the user will get rewarded with 10 tokens x 24h || 0.00011574074 tokens x second == 11574074 tokens x second
    */
    function _generateRewards(uint timeInSeconds, uint _tokenId) internal {
        uint reward = timeInSeconds * 11574074;
        balanceOfRewardsPerNFT[msg.sender][_tokenId] += reward;
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
