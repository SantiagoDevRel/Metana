const { ethers, upgrades } = require("hardhat");

async function deployUpERC20() {
  
  const UpERC20 = await ethers.getContractFactory("UpERC20");
  
  const erc20 = await upgrades.deployProxy(UpERC20, ["MetaToken", "MTN"], {initializer: "init", kind: "uups"});
  
  await erc20.deployed();
  
  console.log("erc20 deployed to:", erc20.address);

}

deployUpERC20().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
