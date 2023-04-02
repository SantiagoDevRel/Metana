const hre = require("hardhat");

async function main() {
  const BOX_ADDRESS = "0xA6af8e4437e4A55fDb452AaE1316Db85c95598cF"
  const BoxV2 = await ethers.getContractFactory("BoxV2");
  const boxProxy = await upgrades.upgradeProxy(BOX_ADDRESS, BoxV2);
  console.log("Box upgraded to: ", boxProxy.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
