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
