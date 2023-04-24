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

    modifier updateRewards(address _user){
        rewardPerTokenStored = rewardPerToken();
        updatedAt = lastTimeRewardApplicable();
        if(_user != address(0)){
            rewardsEarned[_user] = earned(_user);
            userRewardPerTokenPaid[_user] = rewardPerTokenStored;
        }
        _;
    }

    //~~~~~~ Constructor ~~~~~~
    constructor(address _staking, address _rewards, uint256 _duration){
        stakingToken = IERC20(_staking);
        rewardsToken = IERC20(_rewards);
        duration = _duration;
    }

    //~~~~~~ Public/External functions ~~~~~~

    //set the total amount of rewards that will be paid for the specific duration
    //add initial amount of rewards to start the contract
    function addRewardsToStart(address _from, uint256 _amount) updatedAt(address(0)) external onlyOwner{
        require(duration > 0, "Staking: duration hasn't been set yet");
        require(rewardPerSecond == 0, "Staking: rewards rate already set");
        require(rewardsToken.transferFrom(_from, address(this), _amount));
        rewardPerSecond = _amount / duration;
        require(_validateRewardsAndTime(rewardPerSecond, duration));
        //emit RewardsAdded()
    }

    //add more rewards to the pool of rewards while the contract is running
    function addRewardsAndNewDuration(address _from, uint256 _amount) updatedAt(address(0)) external onlyOwner{
        require(rewardPerSecond > 0, "Staking: rewards rate hasn't been set yet");
        require(rewardsToken.transferFrom(_from, address(this), _amount));
        uint256 remainingRewards = rewardPerSecond * (finishAt - block.timestamp);
        rewardPerSecond = (remainingRewards + _amount) / duration;
        require(_validateRewardsAndTime(rewardPerSecond, duration));
        //emit RewardsAdded()
    }

    

    function stake(uint256 _amount) updateRewards(msg.sender) external {
        require(_amount> 0, "Staking: amount can't be 0");
        require(stakingToken.transferFrom(msg.sender, address(this), _amount));
        balanceOf[msg.sender] += _amount;
        totalStaked += _amount;

    }

    function withdraw(uint256 _amount) updateRewards(msg.sender) external{
        require(_amount>0, "Staking: Amount can't be 0");
        require(balanceOf[msg.sender] >= _amount, "Insufficient funds");
        balanceOf -= _amount;
        totalStaked -= _amount;
        require(stakingToken.transfer(msg.sender,_amount));

    }

    function earned(address _user) public view returns(uint256){
        return balanceOf[_user] * (
            (rewardPerToken() - userRewardPerTokenPaid[_user]) / 1e18) 
            + rewardsEarned[_user];
    }

    function rewardPerToken() public view returns(uint256){
        if(totalStaked == 0 ){
            return rewardPerTokenStored;
        }else{
            return rewardPerTokenStored + (rewardPerSecond * 
            (lastTimeRewardApplicable() - updatedAt) * 1e18) / totalStaked;
        }
    }

    function lastTimeRewardApplicable() public view returns(uint256){
        return _min(block.timestamp,finishAt);
    }

    function claimRewards() external{

    }

    //~~~~~~ Internal/Private functions ~~~~~~

    function _validateRewardsAndTime(uint256 _rewardPerSecond, uint256 _duration) internal returns(bool){
        require(_rewardPerSecond > 0, "Staking: reward rate can't be 0");
        require(rewardsToken.balanceOf(address(this)) >= _rewardPerSecond * _duration,"Staking: Insufficient funds to pay rewards");
        finishAt = block.timestamp + duration;
        updatedAt = block.timestamp;
        //emit FinishAtSet()
        return true;    
    }

    function _min(uint256 a, uint256 b) private pure returns(uint256){
        return a <= b ? a : b;
    }


}