// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Staking is Ownable{

    //~~~~~~ Immutable ~~~~~~
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;

    //~~~~~~ State variables ~~~~~~
    uint256 private duration; //duration while rewards are being given
    uint256 private finishAt; //time where the staking is over
    uint256 private updatedAt; //last time update the rewards
    uint256 private rewardPerSecond; //rewards that will be given in total to the users per second
    uint256 private rewardPerTokenStored; //rate reward per second(depending on totalStaked)
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
    function setDuration(uint256 _duration) external onlyOwner {
        require(duration == 0, "Staking: duration already set");
        duration = _duration;
    }

    //set the total amount of rewards that will be paid for the specific duration
    //add initial amount of rewards to start the contract
    function addRewardsToStart(address _from, uint256 _amount) external onlyOwner{
        require(duration > 0, "Staking: duration hasn't been set yet");
        require(rewardPerSecond == 0, "Staking: rewards rate already set");
        require(rewardsToken.transferFrom(_from, address(this), _amount));
        rewardPerSecond = _amount / duration;
        require(_validateRewardsAndTime(rewardPerSecond, duration));
        //emit RewardsAdded()
    }

    //add more rewards to the pool of rewards while the contract is running
    function addRewardsWhileStaking(address _from, uint256 _amount) external onlyOwner{
        require(rewardPerSecond > 0, "Staking: rewards rate hasn't been set yet");
        require(rewardsToken.transferFrom(_from, address(this), _amount));
        uint256 remainingRewards = rewardPerSecond * (finishAt - block.timestamp);
        rewardPerSecond = (remainingRewards + _amount) / duration;
        require(_validateRewardsAndTime(rewardPerSecond, duration));
        //emit RewardsAdded()
    }

    function _validateRewardsAndTime(uint256 _rewardPerSecond, uint256 _duration) internal returns(bool){
        require(_rewardPerSecond > 0, "Staking: reward rate can't be 0");
        require(rewardsToken.balanceOf(address(this)) >= _rewardPerSecond * _duration,"Staking: Insufficient funds to pay rewards");
        finishAt = block.timestamp + duration;
        updatedAt = block.timestamp;
        //emit FinishTimeSet()
        return true;
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