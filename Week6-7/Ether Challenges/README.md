## Ether challenges

[Guess the Number](https://capturetheether.com/challenges/lotteries/guess-the-number/)
[Guess the Secret Number](https://capturetheether.com/challenges/lotteries/guess-the-secret-number/)
[Guess the Random Number](https://capturetheether.com/challenges/lotteries/guess-the-random-number/)
[Guess the New Number](https://capturetheether.com/challenges/lotteries/guess-the-new-number/)
[Predict the Future](https://capturetheether.com/challenges/lotteries/predict-the-future/)
[Predict the block hash](https://capturetheether.com/challenges/lotteries/predict-the-block-hash/)
[Token Bank](https://capturetheether.com/challenges/miscellaneous/token-bank/)
[Token Sale](https://capturetheether.com/challenges/math/token-sale/)
[Token Whale](https://capturetheether.com/challenges/math/token-whale/)

# Smart contracts Security

## Re-entrancy

[Reference](https://solidity-by-example.org/hacks/re-entrancy/)
`Let's say that contract A calls contract B. Reentracy exploit allows B to call back into A before A finishes execution.`

## Forcefully send ether to a contract (selfdestruct)

[Reference](https://solidity-by-example.org/hacks/self-destruct/)
`A malicious contract can use selfdestruct to force sending Ether to any contract.`

## Accesing private state variables

[Reference](https://solidity-by-example.org/hacks/accessing-private-data/)
`All data on a smart contract can be read.`

## Delegate call

[Reference](https://solidity-by-example.org/hacks/delegatecall/)

`delegatecall preserves context (storage, caller, etc...)`
`storage layout must be the same for the contract calling delegatecall and the contract getting called`

## Denial of service

[Reference](https://solidity-by-example.org/hacks/denial-of-service/)

`There are many ways to attack a smart contract to make it unusable.`
`One exploit we introduce here is denial of service by making the function to send Ether fail.`
`Use PUSH vs PULL (deposit() and withdraw()) --> always update state variables before sending ether.`

## Hiding code

[Reference](https://solidity-by-example.org/hacks/hiding-malicious-code-with-external-contract/)

`In Solidity any address can be casted into specific contract, even if the contract at the address is not the one being casted.`
`-->Initialize a new contract inside the constructor`
`-->Make the address of external contract public so that the code of the external contract can be reviewed`

## Honeypot

[Reference](https://solidity-by-example.org/hacks/honeypot/)

`Combining two exploits, reentrancy and hiding malicious code, we can build a contract, that will catch malicious users.`
`Allowing the hacker to do a reentrancy attack, but at the end of the reentrancy, call a function that will revert the whole transaction`

## Front-running

[Reference](https://solidity-by-example.org/hacks/front-running/)

`Transactions take some time before they are mined. An attacker can watch the transaction pool and send a transaction, have it included in a block before the original transaction. This mechanism can be abused to re-order transactions to the attacker's advantage.`

## Block.timestamp manipulation

[Consensys 15 seconds rule](https://consensys.net/blog/developers/solidity-best-practices-for-smart-contract-security/)
[Reference](https://solidity-by-example.org/hacks/block-timestamp-manipulation/)

`block.timestamp can be manipulated by miners with the following constraints`
`it cannot be stamped with an earlier time than its parent & it cannot be too far in the future`
`--> 15 seconds rule: if the scale of your time-dependent event can vary by 15 seconds and maintain integrity, it is safe to use a block.timestamp.`
