const hre = require("hardhat");

async function main() {
  const Box = await hre.ethers.getContractFactory("Box");
  const boxProxy = await hre.upgrades.deployProxy(Box,[7],{initializer:"store"})

  console.log("BoxProxy deployed to:",boxProxy.address)
  console.log("Box implementation deployed to:", Box.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
