const { ethers } = require("hardhat");
require("dotenv").config();

const { PRIVATE_KEY } = process.env;
const provider = new ethers.providers.InfuraProvider("goerli");
const signer = new ethers.Wallet(PRIVATE_KEY, provider); //testnet2
const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138"; //contract
const USER_ADDRESS = "0x5875da5854c2adAdBc1a7a448b5B2A09b26Baff8"; //testnet3

async function sign() {
  const abiMessage = ethers.utils.defaultAbiCoder.encode(["address", "address"], [CONTRACT_ADDRESS, USER_ADDRESS]);
  console.log(abiMessage);
  const abiToBytes = ethers.utils.arrayify(abiMessage);
  console.log(abiToBytes);
  const hashMessage = ethers.utils.hashMessage(abiToBytes);
  console.log(hashMessage);
  const sign3 = await signer.signMessage(hashMessage);
  console.log(sign3);
}

sign().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
