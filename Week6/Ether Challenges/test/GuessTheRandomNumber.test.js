const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("GuessTheRandomNumberChallenge", function () {
  async function deployOneYearLockFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const GuessTheNumber = await ethers.getContractFactory(
      "GuessTheRandomNumberChallenge"
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
    it("get variable from storage and guess()", async () => {
      const { contract, owner, provider } = await loadFixture(
        deployOneYearLockFixture
      );

      //get variable slot#0
      const slotOne = await contract.provider.getStorageAt(contract.address, 0);
      const slotOneToDecimal = parseInt(slotOne, 16);

      //call function guess() with the value found on slot#0
      const guessTx = await contract
        .connect(owner)
        .guess(slotOneToDecimal, { value: ethers.utils.parseEther("1") });
      await guessTx.wait();

      //call function isComplete()
      const win = await contract.isComplete();
      expect(win).to.be.equal(true);
    });
  });
});
