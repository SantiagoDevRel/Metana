const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

describe("PredictTheFutureChallenge", function () {
  async function deployOneYearLockFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const GuessTheNumber = await ethers.getContractFactory(
      "PredictTheFutureChallenge"
    );
    const contractNumber = await GuessTheNumber.deploy({
      value: ethers.utils.parseEther("1"),
    });

    const Solution = await ethers.getContractFactory("Solution");
    const contractSolution = await Solution.deploy(contractNumber.address);

    provider = ethers.provider;

    return { contractNumber, provider, owner, contractSolution };
  }

  it("Contract PredictTheFuture has 1 ether", async () => {
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

      //check balance before attack, contractSolution is 0
      const balanceBeforeAttack = await provider.getBalance(
        contractSolution.address
      );
      expect(balanceBeforeAttack).to.be.equal(
        new BigNumber.from(ethers.utils.parseEther("0"))
      );

      //setGuess from solutionContract
      const setGuessTx = await contractSolution
        .connect(owner)
        .setGuess({ value: ethers.utils.parseEther("1") });
      await setGuessTx.wait();

      //attack from solutionContract
      for (let i = 0; i < 20; i++) {
        try {
          const attack = await contractSolution.connect(owner).attack();
          await attack.wait();
        } catch (err) {
          //console.log("attack tx reverted", i);
        }
        //simulate the blockchain, everytime I attack, mine 1 block and try again
        mine(2);
      }

      //check balance after attack, contractSolution is 2
      const balanceAfterAttack = await provider.getBalance(
        contractSolution.address
      );
      expect(balanceAfterAttack).to.be.equal(
        new BigNumber.from(ethers.utils.parseEther("2"))
      );

      const win = await contractNumber.isComplete();
      expect(win).to.be.equal(true);
    });
  });
});
