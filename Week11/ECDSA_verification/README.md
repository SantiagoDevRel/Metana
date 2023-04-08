## Sample Verify Signature project

    1. Deploy VerifySignature.sol
    2. Create a signature from the Owner of the contract in a script
    3. hash the message hashMsg = solidityKeccak256([string],[message])
    4. sign the hashMsg --> Signature = sign(arrayify(hashMsg))
    4. This signature will be verified on chain within the contract DemoSignature
    5. using the function: (should return TRUE (signer == owner))
        function isMessageValid(bytes memory _signature)external view returns(address);

    6. verify in this contract

[Contract on Mumbai](https://mumbai.polygonscan.com/address/0x9c3c2469DE37bA75e958C79f52c15E0FF9f619e8#code)

## Signature script

```
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const CONTRACT_ADDRESS = "";
const USER_ADDRESS = "";

async function sign() {
  //1. Hash the message with solidityKeccak256()
  const HashMessage = ethers.utils.solidityKeccak256(["address", "address"], [CONTRACT_ADDRESS, USER_ADDRESS]);

  //2. Sign the hash in ARRAY format, NOT in hexstring
  const rawSignature = await signer.signMessage(ethers.utils.arrayify(HashMessage));
  console.log("RAW SIGNATURE", rawSignature);
}
```

## Verify Function on chain

--> for learning purposes I put \_userAddress as a parameter but should be msg.sender

```
function isMessageValid(bytes memory _signature, address _userAddress)external view returns(address){

        //1. Find the message hash --> Hash(thisContract + msg.sender)
        bytes32 _messageHash = keccak256(abi.encodePacked(address(this),_userAddress));

        //2. Find the ETH message hash (\x19Ethereum Signed Message:\n32,_messageHash)
        bytes32 _ETHMsg = _messageHash.toEthSignedMessageHash();

        //3. Recover the address of the signer
        address _signer = _ETHMsg.recover(_signature);

        //4. must return owner address
        return _signer;

    }
```
