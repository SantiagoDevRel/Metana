const hre = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
  //DEPLOY TOKENS
  const TokenA = await hre.ethers.getContractFactory("TokenA");
  const TokenB = await hre.ethers.getContractFactory("TokenB");
  const tokenA = await TokenA.deploy();
  const tokenB = await TokenB.deploy();
  await tokenA.deployed();
  await tokenB.deployed();
  console.log("TokenA", tokenA.address);
  console.log("TokenB", tokenB.address);

  //DEPLOY AMM
  const AMM = await hre.ethers.getContractFactory("AMM");
  const amm = await AMM.deploy(tokenA.address, tokenB.address, 100); //100 = 10% fee
  await amm.deployed();
  console.log("AMM", amm.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
