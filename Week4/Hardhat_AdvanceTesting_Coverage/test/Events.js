const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("Test Events contract", () => {
  let contract = null,
    deployerSigner = null,
    user2Signer = null;

  beforeEach(async () => {
    const [deployer, user2] = await ethers.getSigners();
    deployerSigner = deployer;
    user2Signer = user2;
    const Contract = await ethers.getContractFactory("Events");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("Should emit first event", async () => {
    //Test if the function emits and events with specific arguments
    expect(await contract.connect(deployerSigner).firstEvent())
      .to.emit(contract, "First")
      .withArgs(deployerSigner.address);
  });

  it("Should emit second event", async () => {
    expect(await contract.connect(user2Signer).secondEvent())
      .to.emit(contract, "Second")
      .withArgs();
  });
});
