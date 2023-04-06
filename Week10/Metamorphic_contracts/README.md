## Metamorphic smart contracts
    -This is deprecated because selfdestruct() can't be used anymore, so metamorphic can't be used either.
    CREATE --> Sha3(deployerAddress, currentNonce)
    CREATE2 --> Sha3("0xff", deployerAddress, salt, sha3(bytecode))

[Metamorphic Contract Detector](https://github.com/a16z/metamorphic-contract-detector)
![](https://raw.githubusercontent.com/a16z/metamorphic-contract-detector/main/images/anatomy.jpg)