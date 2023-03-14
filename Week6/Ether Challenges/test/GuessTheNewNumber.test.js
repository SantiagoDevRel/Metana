const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

describe("GuessTheNewNumberChallenge", function () {
  async function deployOneYearLockFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const GuessTheNumber = await ethers.getContractFactory(
      "GuessTheNewNumberChallenge"
    );
    const contractNumber = await GuessTheNumber.deploy({
      value: ethers.utils.parseEther("1"),
    });

    const Solution = await ethers.getContractFactory("SolutionTwo");
    const contractSolution = await Solution.deploy(contractNumber.address);

    provider = ethers.provider;

    return { contractNumber, provider, owner, contractSolution };
  }

  it("Contract GuessTheNewNumber has 1 ether", async () => {
    const { contractNumber, provider } = await loadFixture(
      deployOneYearLockFixture
    );
    const contractBalance = await provider.getBalance(contractNumber.address);
    expect(contractBalance).to.be.equal(
      new BigNumber.from(ethers.utils.parseEther("1"))
    );
  });

  describe("Play the game", () => {
    it("guess()", async () => {
      const { contractNumber, provider, owner, contractSolution } =
        await loadFixture(deployOneYearLockFixture);

      //check isComplete() == false
      const winBefore = await contractNumber.isComplete();

      expect(winBefore).to.be.equal(false);

      //check balance before attack, contractSolution is 0
      const balanceBeforeAttack = await provider.getBalance(
        contractSolution.address
      );
      expect(balanceBeforeAttack).to.be.equal(
        new BigNumber.from(ethers.utils.parseEther("0"))
      );

      //attack contractNumber
      const guessTx = await contractSolution
        .connect(owner)
        .solve({ value: ethers.utils.parseEther("1") });
      await guessTx.wait();

      //check balance after attack, contractSolution is 2 ethers
      const balanceAfterAttack = await provider.getBalance(
        contractSolution.address
      );
      expect(balanceAfterAttack).to.be.equal(
        new BigNumber.from(ethers.utils.parseEther("2"))
      );

      //check isComplete() == true
      const winAfter = await contractNumber.isComplete();

      expect(winAfter).to.be.equal(true);
    });
  });
});
