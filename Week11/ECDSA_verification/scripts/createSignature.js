const { Wallet } = require("ethers");
const { ethers } = require("hardhat");
require("dotenv").config();

const { PRIVATE_KEY } = process.env;
const provider = new ethers.providers.InfuraProvider("goerli");
const signer = new ethers.Wallet(PRIVATE_KEY, provider); //testnet2
const CONTRACT_ADDRESS = "0x614ac46D354093518E9330258C7EA142F02faFc3"; //contract
const USER_ADDRESS = "0x5875da5854c2adAdBc1a7a448b5B2A09b26Baff8"; //testnet3

async function sign() {
  //1. abi.encodePacked(CONTRACT_ADDRESS,USER_ADDRESS) --> return string of 64 bytes long
  const abiEncodePackedInHexString = ethers.utils.defaultAbiCoder.encode(["address", "address"], [CONTRACT_ADDRESS, USER_ADDRESS]);
  console.log(abiEncodePackedInHexString);

  //2. abiEncodePackedInHexString to array of bytes
  const abiEncodePackedToBytes = ethers.utils.arrayify(abiEncodePackedInHexString);
  console.log(abiEncodePackedToBytes);

  //3. keccak256(of the previous arrayOfBytes)
  const keccak256ofAbiEncodePackedToBytes = ethers.utils.hashMessage(abiEncodePackedToBytes);
  console.log(keccak256ofAbiEncodePackedToBytes);

  //4. sign the previous hash
  const rawSignature = await signer.signMessage(keccak256ofAbiEncodePackedToBytes);
  console.log(rawSignature);

  const { r, s, v } = ethers.utils.splitSignature(rawSignature);
  const formattedSignature = { r, s, v };
  console.log(formattedSignature);
  const signerAddress = ethers.utils.recoverAddress(keccak256ofAbiEncodePackedToBytes, formattedSignature);
  //MUST be the same
  console.log(signerAddress);
  console.log(await signer.getAddress());
  console.log(Wallet.isSigner(signer));
}

sign().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
