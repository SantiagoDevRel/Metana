## Ethernaut6 
    -Send a transaction to Delegation, triggering the fallback() 
    -The data "0xdd365b8b" == "pwn()", so it will trigget the pwn() function in the Delegate contract
    and it will change the owner state variable of Delegation contract
`await contract.sendTransaction({from: player, to: instance, data: "0xdd365b8b"})`

## Ethernaut 16

## Ethernaut 24

## Ethernaut 25 (proxy of the proxy)
