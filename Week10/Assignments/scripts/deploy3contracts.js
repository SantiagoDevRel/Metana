const { ethers, upgrades } = require("hardhat");

async function main() {
  //Deploy ERC20
  const UpERC20 = await ethers.getContractFactory("UpERC20");
  
  const erc20 = await upgrades.deployProxy(UpERC20, ["MetaToken", "MTN"], {initializer: "init", kind: "uups"});
  
  await erc20.deployed();
  const ADDRESS_ERC20 = erc20.address;
  console.log("erc20 deployed to:", ADDRESS_ERC20);
  
  //Deploy ERC721
  const UpERC721 = await ethers.getContractFactory("UpNFT");
  
  const erc721 = await upgrades.deployProxy(UpERC721, ["MetaNFT", "MNFT"], {initializer: "init", kind: "uups"});
  
  await erc721.deployed();
  
  const ADDRESS_ERC721 = erc721.address
  console.log("erc721 deployed to:", ADDRESS_ERC721);

  //Deploy staking
  const UpStaking = await ethers.getContractFactory("UpStaking");
  
  const upStaking = await upgrades.deployProxy(UpStaking, [ADDRESS_ERC20, ADDRESS_ERC721], {initializer: "init", kind: "uups"});

  
  await upStaking.deployed();
  
  const ADDRESS_STAKING = upStaking.address
  console.log("staking deployed to:", ADDRESS_STAKING);

  //SetMinter on ERC20
  const setMinterTx = await erc20.setMinterAddress(ADDRESS_STAKING);
  await setMinterTx.wait();

  console.log("Should be true:", await erc20.getMinter(ADDRESS_STAKING))

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


