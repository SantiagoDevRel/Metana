
const hre = require("hardhat");

async function main() {
  const MultiToken = await hre.ethers.getContractFactory("MultiToken");
  const multiToken = await MultiToken.deploy();

  const Forging = await hre.ethers.getContractAt("Forging")
  const forging = await Forging.deploy(multiToken.address)

  await multiToken.deployed();

  console.log(`MultiToken deployed to ${multiToken.address}`);
  console.log(`Forging deployed to ${forging.address}`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
