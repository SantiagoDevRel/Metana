const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("MyTokenUpgradable");
  const tokenProxy = await hre.upgrades.deployProxy(Token, ["PROXY","PRX"],{ kind:"uups", initializer:"initialize"})

  console.log("BoxProxy deployed to:",tokenProxy.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
