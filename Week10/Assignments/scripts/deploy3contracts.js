const { ethers, upgrades } = require("hardhat");

async function deployUpERC20() {
  
  const UpERC20 = await ethers.getContractFactory("UpERC20");
  
  const erc20 = await upgrades.deployProxy(UpERC20, ["MetaToken", "MTN"], {initializer: "init", kind: "uups"});
  
  await erc20.deployed();
  let address = erc20.address;
  console.log("erc20 deployed to:", address);
  return address;
}

async function deployUpERC721() {
  
  const UpERC721 = await ethers.getContractFactory("UpNFT");
  
  const erc721 = await upgrades.deployProxy(UpERC721, ["MetaNFT", "MNFT"], {initializer: "init", kind: "uups"});
  
  await erc721.deployed();
  
  let address = erc721.address
  console.log("erc721 deployed to:", address);
  return address;
}

async function deployStakingUpgradeable() {
  //deploy token & nft
  const addressUpERC20 = await deployUpERC20()
  const addressUpERC721 = await deployUpERC721()

  const UpStaking = await ethers.getContractFactory("UpStaking");
  
  const upStaking = await upgrades.deployProxy(UpStaking, [addressUpERC20, addressUpERC721], {initializer: "init", kind: "uups"});
  
  await upStaking.deployed();
  
  let address = upStaking.address
  console.log("staking deployed to:", address);
}

deployStakingUpgradeable().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


