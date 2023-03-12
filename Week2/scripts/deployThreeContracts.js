const hre = require("hardhat");

async function main() {
  const ERC721 = await hre.ethers.getContractFactory("MrNFT");
  const ERC20 = await hre.ethers.getContractFactory("MrToken");
  const Minter = await hre.ethers.getContractFactory("MintingContract");

  const nft = await ERC721.deploy();
  const token = await ERC20.deploy();
  const minter = await Minter.deploy(token.address, nft.address);

  await nft.deployed();
  await token.deployed();
  await minter.deployed();

  console.log(`NFT Deployed to ${nft.address}`);
  console.log(`Token Deployed to ${token.address}`);
  console.log(`Minter Deployed to ${minter.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
