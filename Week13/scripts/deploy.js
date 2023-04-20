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

  //APPROVE TOKENS - AMM
  const balanceDeployerA = await tokenA.balanceOf(owner.address);
  const balanceDeployerB = await tokenB.balanceOf(owner.address);
  const approveA = await tokenA.approve(amm.address, balanceDeployerA);
  const approveB = await tokenB.approve(amm.address, balanceDeployerB);
  await approveA.wait();
  await approveB.wait();

  //ADD LIQUIDITY
  const addLiquidity = await amm.addLiquidity(balanceDeployerA, balanceDeployerB);
  await addLiquidity.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
