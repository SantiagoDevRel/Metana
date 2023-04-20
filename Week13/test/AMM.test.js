const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  async function deployAMM() {
    const [owner] = await ethers.getSigners();
    //DEPLOY TOKENS
    const TokenA = await hre.ethers.getContractFactory("TokenA");
    const TokenB = await hre.ethers.getContractFactory("TokenB");
    const tokenA = await TokenA.deploy();
    const tokenB = await TokenB.deploy();
    await tokenA.deployed();
    await tokenB.deployed();
    console.log("TokenA", tokenA.address);
    console.log("TokenB", tokenB.address);

    //DEPLOY AMM
    const AMM = await hre.ethers.getContractFactory("AMM");
    const amm = await AMM.deploy(tokenA.address, tokenB.address, 100); //100 = 10% fee
    await amm.deployed();
    console.log("AMM", amm.address);

    return { tokenA, tokenB, amm, owner };
  }

  describe("Deployment", function () {
    it("Should work", async function () {
      const { tokenA, tokenB, amm, owner } = await loadFixture(deployAMM);

      //APPROVE TOKENS - AMM
      const balanceDeployerA = await tokenA.balanceOf(owner.address);
      const balanceDeployerB = await tokenB.balanceOf(owner.address);
      const approveA = await tokenA.approve(amm.address, balanceDeployerA);
      const approveB = await tokenB.approve(amm.address, balanceDeployerB);
      await approveA.wait();
      await approveB.wait();

      //ADD LIQUIDITY
      const addLiquidity = await amm.addLiquidity(balanceDeployerA, balanceDeployerB);
      await addLiquidity.wait();

      console.log("Shares of owner:", await amm.shares(owner.address));
      console.log("Total shares", await amm.getTotalShares());
      console.log("Reserve token A", await amm.getReserveA());
      console.log("Reserve token B", await amm.getReserveB());

      //~~~~~~~~~~~~~ EXTRA ~~~~~~~~~~~~~
      //MINT and add more liquidity
      console.log("1");
      await (await tokenA.mint()).wait();
      await (await tokenB.mint()).wait();

      //APPROVE TOKENS - AMM
      console.log("2");

      const balanceDeployerA2 = await tokenA.balanceOf(owner.address);
      const balanceDeployerB2 = await tokenB.balanceOf(owner.address);
      console.log("3");

      const approveA2 = await tokenA.approve(amm.address, balanceDeployerA2);
      const approveB2 = await tokenB.approve(amm.address, balanceDeployerB2);
      await approveA2.wait();
      await approveB2.wait();

      //ADD LIQUIDITY
      console.log("4");

      const addLiquidity2 = await amm.addLiquidity(balanceDeployerA2, balanceDeployerB2);
      await addLiquidity2.wait();
      console.log("5");

      console.log("Shares of owner:", await amm.shares(owner.address));
      console.log("Total shares", await amm.getTotalShares());

      //REMOVE HALF OF THE LIQUIDITY
      const sharesOwner = hre.ethers.BigNumber.from(await amm.shares(owner.address));
      const sharesToBurn = sharesOwner.div(2);
      console.log("ReserveA:", await amm.getReserveA());
      console.log("ReserveB", await amm.getReserveB());
      const removeLiquidity = await amm.removeLiquidity(sharesToBurn);
      await removeLiquidity.wait();

      console.log("Shares of owner:", await amm.shares(owner.address));
      console.log("Total shares", await amm.getTotalShares());
      console.log("ReserveA:", await amm.getReserveA());
      console.log("ReserveB", await amm.getReserveB());
    });
  });
});
