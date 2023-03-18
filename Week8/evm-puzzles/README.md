# Solutions
````
1. Send value "8" to jump from 00-01 to 08 (skipping the reverts) and then stop in 09

2. We need to send a value that substracting the CODESIZE is equal to 06
    for this I send 4 ether, because we will perform the following:
    callValue(4) - codeSize(10 bytes) = jumpDest(06) to be able to pass the puzzle

3. For this puzzle we need to send a dataSize == 4 bytes
     so I send the data: "0404004" and it passed

4. 

````

# EVM puzzles

A collection of EVM puzzles. Each puzzle consists on sending a successful transaction to a contract. The bytecode of the contract is provided, and you need to fill the transaction data that won't revert the execution.

## How to play

Clone this repository and install its dependencies (`npm install` or `yarn`). Then run:

```
npx hardhat play
```

And the game will start.

In some puzzles you only need to provide the value that will be sent to the contract, in others the calldata, and in others both values.

You can use [`evm.codes`](https://www.evm.codes/)'s reference and playground to work through this.
