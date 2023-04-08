## Sample Verify Signature project

    1. Deploy VerifySignature.sol
    2. Create a signature from the Owner of the contract in a script
    3. hash the message hashMsg = solidityKeccak256([string],[message])
    4. sign the hashMsg --> Signature = sign(arrayify(hashMsg))
    4. This signature will be verified on chain within the contract DemoSignature
    5. using the function: (should return TRUE (signer == owner))
        function isMessageValid(bytes memory _signature)external view returns(address);

    6. verify in this contract

`https://goerli.etherscan.io/address/0x614ac46d354093518e9330258c7ea142f02fafc3#code`
