# Staking Algorithm

[Youtube source](https://www.youtube.com/watch?v=NsKZZ3OrlSA)

    1. Once someone stakes, calculate reward per token (rj)
        r += (Rewards/TotalStaked )* (currentTime - lastTimeUpdated )

    2. Calculate reward earned by user
        rewards[user] += balanceOf[user] * (r -userRewardPerTokenPaid[user])

    3. Calculate user reward per token paid
        userRewardPerTokenPaid[user] = r

    4. Track the last time reward per token was updated
        lastUpdateTime = block.timestamp

    5. Update staked amount per user
        balanceOf[user] +/-= amount (+ staking and - withdrawing)
        totalSupply +/-= amount (+ staking and - withdrawing)
