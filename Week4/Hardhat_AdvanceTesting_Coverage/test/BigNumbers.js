const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat")
const { BigNumber } = ethers;

describe("BigNumbers Contract", function () {

  let contract = null;
  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("BigNumber");
    contract = await Contract.deploy(0);
    await contract.deployed()
  })

  it("Check if number is 0", async () => {
    expect(await contract.getNumber()).to.be.equal(0)
  })

  it("Set to the max", async () => {
    const tx = await contract.setToTheMax()
    await tx.wait()

    expect(await contract.getNumber()).to.be.equal(
      new BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935")
    )
  })


})