const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("External Return Contract", function () {
  let contract = null,
    deployer,
    user2;

  beforeEach(async () => {
    const [owner, account2] = await ethers.getSigners();
    deployer = owner;
    user2 = account2;
    const Contract = await ethers.getContractFactory("ExtReturn");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Balance owner should be 10", async () => {
    console.log(await contract.getBalance(deployer.address));
    //ALWAYS TEST WITH BigNumber
    expect(await contract.getBalance(deployer.address)).to.be.equal(
      new BigNumber.from(10)
    );
  });

  it("User 2 balance should be 0", async () => {
    expect(await contract.getBalance(user2.address)).to.be.equal(
      new BigNumber.from(0)
    );
  });

  it("User 2 balance should be 5", async () => {
    const tx = await contract
      .connect(deployer)
      .transfer(deployer.address, user2.address, 5);
    await tx.wait();
    expect(await contract.getBalance(user2.address)).to.be.equal(
      new BigNumber.from(5)
    );
  });

  it("Test TX signature transfer", async () => {
    //CHECK the return value of the function transfer() - but NOT actually executing it.
    const tx = await contract.callStatic.transfer(
      deployer.address,
      user2.address,
      10
    );
    expect(tx).to.be.equal(true);
  });

  it("Test owner is equal deployer", async () => {
    expect(await contract.owner()).to.be.equal(deployer.address);
  });

  it("Test TX signature revert", async () => {
    //for reverts() await always goes before expect
    await expect(
      contract.connect(user2).transfer(user2.address, deployer.address, 10)
    ).to.be.revertedWith("You are not the owner");
  });
});
