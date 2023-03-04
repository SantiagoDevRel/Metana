# Smart contracts Security

## Re-entrancy

[Reference](https://solidity-by-example.org/hacks/re-entrancy/)
`Let's say that contract A calls contract B. Reentracy exploit allows B to call back into A before A finishes execution.`

## Forcefully send ether to a contract (selfdestruct)

[Reference](https://solidity-by-example.org/hacks/self-destruct/)
`A malicious contract can use selfdestruct to force sending Ether to any contract.`
