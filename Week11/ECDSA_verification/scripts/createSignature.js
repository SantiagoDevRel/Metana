require("dotenv").config();
const { parse } = require("dotenv");
const { ethers } = require("hardhat");

const { PRIVATE_KEY, MUMBAI_NODE } = process.env;

const provider = new ethers.providers.AlchemyProvider("maticmum", MUMBAI_NODE);

const signer = new ethers.Wallet(PRIVATE_KEY, provider); //testnet2
const CONTRACT_ADDRESS = "0x9c3c2469DE37bA75e958C79f52c15E0FF9f619e8"; //contract
const USER_ADDRESS = "0xA3286628134baD128faeef82F44e99AA64085C94"; //testnet3

async function sign() {
  //1. Hash the message with solidityKeccak256()
  const HashMessage = ethers.utils.solidityKeccak256(["address", "address"], [CONTRACT_ADDRESS, USER_ADDRESS]);

  //2. Sign the hash in ARRAY format, NOT in hexstring
  const rawSignature = await signer.signMessage(ethers.utils.arrayify(HashMessage));
  console.log("RAW SIGNATURE", rawSignature);
}

sign().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
