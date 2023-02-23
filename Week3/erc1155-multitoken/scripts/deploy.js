
const hre = require("hardhat");

async function main() {
  console.log("1")
  const MultiToken = await hre.ethers.getContractFactory("MultiToken");
  console.log("2")
  const multiToken = await MultiToken.deploy();
  console.log("3")
  await multiToken.deployed();

  console.log(`MultiToken deployed to ${multiToken.address}`);

  console.log("1")
  const Forging = await hre.ethers.getContractFactory("Forging")
  console.log("2")
  const forging = await Forging.deploy(multiToken.address)
  console.log("3")
  await forging.deployed();

  console.log(`Forging deployed to ${forging.address}`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
