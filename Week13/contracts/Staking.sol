// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Staking is Ownable{

    //~~~~~~ Immutable ~~~~~~
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;

    //~~~~~~ State variables ~~~~~~
    uint256 private duration;
    uint256 private finishAt;
    uint256 private updatedAt;
    uint256 private rewardPerSecond;
    uint256 private rewardPerTokenStored;
    mapping (address => uint256) private userRewardPerTokenPaid;
    mapping (address => uint256) private rewardsEarned;

    uint256 private totalStaked;
    mapping (address => uint256) private balanceOf;

    //~~~~~~ Constructor ~~~~~~
    constructor(address _staking, address _rewards){
        stakingToken = IERC20(_staking);
        rewardsToken = IERC20(_rewards);
    }

    //~~~~~~ Public/External functions ~~~~~~

    //set the duration for this staking contract
    function setRewardsDuration(uint256 _duration) external onlyOwner {
        require(block.timestamp > finishAt, "Staking: Wait until the round is over");
        duration = _duration;
    }

    //set the total amount of rewards that will be paid for this specific above duration
    function notifyRewardAmount(uint256 _amount) external onlyOwner{

    }

    function stake(uint256 _amount) external{

    }

    function withdraw(uint256 _amount) external{

    }

    function earned(address _user) external view returns(uint256){
        return rewardsEarned[_user];
    }

    function claimRewards() external{

    }

}