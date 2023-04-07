const { ethers, upgrades } = require("hardhat");

async function main() {
  const PROXY_NFT = "0x93fe8d93957a27571b2c58f7f4521a74b43b971c";

  const UpNFTV2 = await ethers.getContractFactory("UpNFTV2");

  //Deploy NFT v2 and update the proxy implementation to v2
  const nftv2 = await upgrades.upgradeProxy(PROXY_NFT, UpNFTV2);

  console.log("NFTv2 implementation deployed to the proxy:", nftv2.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
