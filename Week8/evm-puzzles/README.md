# Solutions
````
1. Send value "8" to jump from 00-01 to 08 (skipping the reverts) and then stop in 09

2. We need to send a value that substracting the CODESIZE is equal to 06
    for this I send 4 ether, because we will perform the following:
    callValue(4) - codeSize(10 bytes) = jumpDest(06) to be able to pass the puzzle

3. For this puzzle we need to send a dataSize == 4 bytes
     so I send the data: "0x01020304" and it passed

4. We need to jump to the byte 0A(hex)/10(dec)/1010(bin)
    and to be able to jump there we need to do an XOR of the CODESIZE and CALLVALUE
    CODESIZE == 12 == 1100
    CALLVALUE == (6) == 0110
    JUMPDEST == 10 == 1010
    
5. We need to get into the byte09 "JUMPI" so we can be able to jump to byte 0C "JUMPDEST"
    so to get there we need to pass the "EQ" in byte 06
    -first we send a CALLVALUE = (16)
    -then this value is duplicated DUP1 = (16)
    -then we multiply these 2 values MUL = 256
    -then we PUSH2 0100 = Push(256)
    -we compare if the 2 above numbers are equal EQ = (256 == 256) --> (TRUE)
    -so when we pass that EQ we are able to go to byte 07 PUSH1 0C (12)
    -then we go to JUMPI in byte 09 and automatically we go to JUMPDEST and then STOP

6. First, it push the 0 to the stack and then the CALLDATALOAD will use(pop) this 0 to read from the CALLDATA 
    The CALLDATALOAD reads a 32byte hex number
    and the JUMP will jump to the position that we passes to it
    so before the JUMP we need to pass the position 0A  
    and because CALLDATALOAD receives a 32byte hex number
    so we need to pass a "0x000000000000000000000000000000000000000000000000000000000000000A"
    to point to 0A with the 31 bytes of "0" so CALLDATA is able to read the number

7. We need to pass a byetcode with only 1 opcode to execute, so the bytecode 600060005360016000F3
    to be created as a contract, so its codesize will be 1 (equal 1) to pass the EQ in the byte 0E
    PUSH1 00
    PUSH1 00
    MSTORE8
    PUSH1 01
    PUSH1 00
    RETURN

8. [I wasn't able to get everything 100%]
    In the first 4 instructions, the CALLDATACOPY takes the data and copy into memory
    then create a new contract sending 0 value, deploy the code that is in memory
    in summary, we need to pass a contract bytecode that has a revert within the contract
    0x60FD60005360016000F3
    in this case will be the "FD" in the first PUSH1
    // store in memory the REVERT opcode as the only “code” of the contract
    PUSH1 FD
    PUSH1 00
    MSTORE8
    // make the constructor return the stored runtime code
    PUSH1 01
    PUSH1 00
    RETURN

9. -To pass the first block we need to send a DATA greater than 03 bytes of length --> 0x01020304
    because the stack currently has this:
    [00] == 03
    [01] == DATASIZE
    -and 03 should be lower than DATASIZE, this means --> LT value[00](03) < value[01](DATASIZE)
    -then, in the code 0C we multiply the CALLDATASIZE * CALLVALUE send and it should be equal to 08
    -so the VALUE = 2 and DATA = 0x01020304 (4 bytes of length) = 8 to pass the command EQ in the 0F line.

10. pass first block of code 00-08:
        CODESIZE = 1A + 1 = 27(dec) = 1B(hex)
        CALLVALUE = 28(dec)
        SWAP
        GT = Greater(codesize > callvalue)
    
    pass second block of code 09-0F:
        DATA = 0x00 - DATASIZE = 1
        PUSH2 = 0003 
        SWAP
        MOD = Mod(3%(datasize=1)) = result should be 0
    
    pass the third block from 10-14:
        push 0A = 10(dec)
        ADD callvalue = result should be 19(hex) = 25(dec)
        so 25-10 = 15 should be the VALUE
    
    --> VALUE = 15
    --> DATA = 0x000000 (3 bytes long)
    

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
