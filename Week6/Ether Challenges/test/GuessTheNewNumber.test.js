const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("GuessTheNewNumberChallenge", function () {
  async function deployOneYearLockFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const GuessTheNumber = await ethers.getContractFactory(
      "GuessTheNewNumberChallenge"
    );
    const contract = await GuessTheNumber.deploy({
      value: ethers.utils.parseEther("1"),
    });

    provider = ethers.provider;

    return { contract, provider, owner };
  }

  it("Contract has 1 ether", async () => {
    const { contract, provider } = await loadFixture(deployOneYearLockFixture);
    const contractBalance = await provider.getBalance(contract.address);
    expect(contractBalance).to.be.equal(
      new BigNumber.from(ethers.utils.parseEther("1"))
    );
  });

  describe("Play the game", () => {
    it("guess()", async () => {});
  });
});
