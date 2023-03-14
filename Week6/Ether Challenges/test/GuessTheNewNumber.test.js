const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber, utils } = ethers;

describe("GuessTheNewNumberChallenge", function () {
  async function deployOneYearLockFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const GuessTheNumber = await ethers.getContractFactory(
      "GuessTheNewNumberChallenge"
    );
    const contract = await GuessTheNumber.deploy({
      value: ethers.utils.parseEther("1"),
    });

    const Solution = await ethers.getContractFactory("Solution");
    const contractSolution = await Solution.deploy(contract.address);

    provider = ethers.provider;

    return { contract, provider, owner, contractSolution };
  }

  it("Contract has 1 ether", async () => {
    const { contract, provider } = await loadFixture(deployOneYearLockFixture);
    const contractBalance = await provider.getBalance(contract.address);
    expect(contractBalance).to.be.equal(
      new BigNumber.from(ethers.utils.parseEther("1"))
    );
  });

  describe("Play the game", () => {
    it("guess()", async () => {
      const { contract, provider, owner, contractSolution } = await loadFixture(
        deployOneYearLockFixture
      );

      //check balance of contract solution is 0
      const balance = await provider.getBalance(contractSolution.address);
      console.log("balance", balance);

      const contractBalance = await provider.getBalance(contract.address);
      console.log("Balance2", contractBalance);

      const solution = ethers.utils.hexValue(
        ethers.utils.keccak256(
          ethers.utils.solidityPack(
            ["bytes32", "uint256"],
            [
              await ethers.provider
                .getBlock((await ethers.provider.getBlockNumber()) - 1)
                .then((block) => block.hash),
              Math.floor(Date.now() / 1000),
            ]
          )
        )
      );

      const solveTx = await contract.guess(solution, {
        value: ethers.utils.parseEther("1"),
      });
      await solveTx.wait();

      const win = await contract.isComplete();
      console.log("WIN", win);
    });
  });
});
