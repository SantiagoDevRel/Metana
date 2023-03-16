const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

/*
    TESTED TokenBank.sol in remix, it worked
    Here I have the error
    TypeError: contractToken.connect(...).transfer is not a function (line 80)
    -potentially mistake attaching the contract from factory. (line 30)
    -it has all the interface/ABI when I console.log the contractToken 
*/

describe("TokenBankChallenge", function () {
  async function deployOneYearLockFixture() {
    const [deployer, user1] = await ethers.getSigners();

    //deploy bank Contract
    const TokenBankChallenge = await ethers.getContractFactory(
      "TokenBankChallenge"
    );
    const contractBank = await TokenBankChallenge.deploy(user1.address);
    await contractBank.deployed();

    //deploy token Contract
    const tokenAddress = await contractBank.token();
    const contractToken = await ethers.getContractAt(
      "SimpleERC223Token",
      tokenAddress
    );
    await contractToken.deployed();

    //deploy attacker Contract
    const Attacker = await ethers.getContractFactory("Attack");
    const contractAttacker = await Attacker.deploy(
      contractBank.address,
      contractToken.address
    );
    await contractAttacker.deployed();

    provider = ethers.provider;

    return { contractBank, contractToken, contractAttacker, deployer, user1 };
  }

  describe("Hack the bank game", () => {
    it("Setup and attack", async () => {
      const { contractBank, contractToken, contractAttacker, deployer, user1 } =
        await loadFixture(deployOneYearLockFixture);

      //check ERC223 balanceOf(bank) == 1_000_000 tokens
      const balance = await contractToken.balanceOf(contractBank.address);
      expect(balance).to.be.equal(
        new BigNumber.from(ethers.utils.parseEther("1000000"))
      );

      //check user1 balance in the bank == 500_000 tokens
      const balanceUser = await contractBank.balanceOf(user1.address);
      expect(balanceUser).to.be.equal(
        new BigNumber.from(ethers.utils.parseEther("500000"))
      );

      //withdraw the 500_000 tokens from bank to user1
      const withdrawTx1 = await contractBank
        .connect(user1)
        .withdraw(ethers.utils.parseEther("500000"));
      await withdrawTx1.wait();

      //check ERC223 balanceOf(User1) == 500_000 tokens
      const balanceUser2 = await contractToken.balanceOf(user1.address);
      expect(balanceUser2).to.be.equal(
        new BigNumber.from(ethers.utils.parseEther("500000"))
      );

      // ~~~~~~~~~~~~~~~~~~~~ ERROR HERE ~~~~~~~~~~~~~~~~~~~~
      //send the 500_000 tokens from the user1 to the attackerContract
      const transferTx = await contractToken
        .connect(user1)
        .transfer(contractAttacker.address, ethers.utils.parseEther("500000"));
      await transferTx.wait();

      //deposit the 500_000 tokens from attackerContract to the bank
      const deposit = await contractAttacker
        .connect(user1)
        .transferFromAttackToBank(contractBank.address);
      await deposit.wait();
    });
  });
});
