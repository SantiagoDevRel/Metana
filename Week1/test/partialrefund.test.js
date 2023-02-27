const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber, utils } = ethers;

describe("Test PartialRefund contract", () => {
  let contract = null,
    provider = null,
    owner = null,
    user2 = null;

  beforeEach(async () => {
    //Get accounts
    const [acc1, acc2] = await ethers.getSigners();
    owner = acc1;
    user2 = acc2;

    //Deploy contract
    const Contract = await ethers.getContractFactory("PartialRefund");
    contract = await Contract.deploy();
    await contract.deployed();

    //Send 10 ether to user2
    provider = ethers.provider;
    const amountToMint = utils.hexStripZeros(
      utils.parseEther("1001").toHexString()
    );
    const balanceOfOwner = utils.hexStripZeros(
      utils.parseEther("1").toHexString()
    );
    await provider.send("hardhat_setBalance", [user2.address, amountToMint]);
    await provider.send("hardhat_setBalance", [owner.address, balanceOfOwner]);
  });

  it("Owner balance should be 1 ethers", async () => {
    const balanceOfOwner = await provider.getBalance(owner.address);
    expect(balanceOfOwner).to.be.closeTo(
      new BigNumber.from(utils.parseEther("1")),
      new BigNumber.from(utils.parseEther("0.01"))
    );
    console.log(utils.formatEther(balanceOfOwner));
  });

  it("User2 balance should be 1001 ethers", async () => {
    const balanceOfUser2 = await provider.getBalance(user2.address);
    expect(balanceOfUser2).to.be.equal(
      new BigNumber.from(utils.parseEther("1001"))
    );
  });

  it("Contract balance should be 0 ethers", async () => {
    const balanceOfContract = await provider.getBalance(contract.address);
    expect(balanceOfContract).to.be.equal(
      new BigNumber.from(utils.parseEther("0"))
    );
  });

  it("PreSale() should fail --> pay 2 ethers", async () => {
    await expect(
      contract.connect(user2).preSale({ value: utils.parseEther("2") })
    ).to.be.revertedWith("ERC20: Pay only 1 ether");
  });
  /* 
  it("PreSale() should fail --> maxSupply reached", async () => {
    for(let i=0;i<1000;i++){
      const tx = await contract.

    }
  }); */
});
