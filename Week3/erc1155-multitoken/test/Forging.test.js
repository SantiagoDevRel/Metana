const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("Testing Payable functions", () => {
  let forging = null,
    deployer = null,
    user2 = null,
    provider = null;

  beforeEach(async () => {
    const [acc1, acc2] = await ethers.getSigners();
    deployer = acc1;
    user2 = acc2;

    const Contract = await ethers.getContractFactory("Forging");
    forging = await Contract.deploy();
    await forging.deployed();
  });

  //test all the functions
});
