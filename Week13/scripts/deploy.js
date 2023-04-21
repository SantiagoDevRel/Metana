const { ethers, upgrades } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
  //DEPLOY TOKENS
  const TokenA = await ethers.getContractFactory("TokenA");
  const TokenB = await ethers.getContractFactory("TokenB");
  const tokenA = await TokenA.deploy();
  const tokenB = await TokenB.deploy();
  await tokenA.deployed();
  await tokenB.deployed();
  console.log("TokenA", tokenA.address);
  console.log("TokenB", tokenB.address);

  //DEPLOY constant sum automated market maker
  const CSAMM = await ethers.getContractFactory("CSAMM");
  const csamm = await upgrades.deployProxy(CSAMM, [tokenA.address, tokenB.address, 100], { initializer: "init", kind: "uups" }); //100 = 10% fee

  await csamm.deployed();
  console.log("csamm", csamm.address);

  //APPROVE TOKENS - csamm
  const balanceDeployerA = await tokenA.balanceOf(owner.address);
  const balanceDeployerB = await tokenB.balanceOf(owner.address);
  const approveA = await tokenA.approve(csamm.address, balanceDeployerA);
  const approveB = await tokenB.approve(csamm.address, balanceDeployerB);
  await approveA.wait();
  await approveB.wait();

  //ADD LIQUIDITY
  const addLiquidity = await csamm.addLiquidity(balanceDeployerA, balanceDeployerB);
  await addLiquidity.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
