const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

describe("PredictTheBlockHashChallenge", function () {
  async function deployOneYearLockFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const PredictHash = await ethers.getContractFactory(
      "PredictTheBlockHashChallenge"
    );
    const contractFuture = await PredictHash.deploy({
      value: ethers.utils.parseEther("1"),
    });

    const Solution = await ethers.getContractFactory("SolutionThree");
    const contractSolution = await Solution.deploy(contractFuture.address);

    provider = ethers.provider;

    return { contractFuture, provider, owner, contractSolution };
  }

  it("Contract PredictTheFuture has 1 ether", async () => {
    const { contractFuture, provider } = await loadFixture(
      deployOneYearLockFixture
    );
    const contractBalance = await provider.getBalance(contractFuture.address);
    expect(contractBalance).to.be.equal(
      new BigNumber.from(ethers.utils.parseEther("1"))
    );
  });

  describe("Play the game", () => {
    it("guess()", async () => {
      const { contractFuture, provider, owner, contractSolution } =
        await loadFixture(deployOneYearLockFixture);

      //check balance before attack, owner is 0
      const balanceBeforeAttack = await provider.getBalance(owner.address);
      expect(balanceBeforeAttack).to.be.closeTo(
        new BigNumber.from(ethers.utils.parseEther("1000")),
        new BigNumber.from(ethers.utils.parseEther("10"))
      );

      const win = await contractFuture.isComplete();
      console.log("WIN", win);
    });
  });
});
/* 
9998999150837893645848;
1000000000000000000000;
10000000000000000000
 */
