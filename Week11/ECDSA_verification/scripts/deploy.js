const { ethers } = require("hardhat");

//1. Deploy VerifySignature.sol

async function main() {
  const Contract = await ethers.getContractFactory("DemoSignature");
  const contract = await Contract.deploy();
  await contract.deployed();
  console.log("Contract deployed to", contract.address);
  console.log("Contract owner is:", await contract.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
