const {  loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { upgrades } = require("hardhat");

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function ProxyFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Box = await ethers.getContractFactory("Box");
    const box = await upgrades.deployProxy(Box,[7], {initializer: "store"})
    await box.deployed()

    return { box, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Value should be 0", async function () {
      const { box } = await loadFixture(ProxyFixture);
      console.log(await box.getValue())
      expect(await box.getValue()).to.equal(7);
    });

   
  });
});
