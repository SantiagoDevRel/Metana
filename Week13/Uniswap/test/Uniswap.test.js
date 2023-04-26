const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { network, ethers } = require("hardhat");
const { BigNumber } = ethers;

//address on mainnet
const WHITEBIT_ADDRESS = "0x1689a089AA12d6CbBd88bC2755E4c192f8702000";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const WBTC_ADDRESS = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

describe("Swap", function () {
  let daiContract, whitebitSigner, wbtcContract;
  async function testSwapUniswap() {
    //impersonate account parameters
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WHITEBIT_ADDRESS],
    });

    //instance of signer
    whitebitSigner = await ethers.getSigner(WHITEBIT_ADDRESS);

    //instace of DAI
    daiContract = await ethers.getContractAt("IERC20", DAI_ADDRESS);

    //instace of WBTC
    wbtcContract = await ethers.getContractAt("IERC20", WBTC_ADDRESS);

    const Swap = await ethers.getContractFactory("Swap");
    const swapContract = await Swap.deploy();

    return { swapContract, whitebitSigner, daiContract, wbtcContract };
  }

  describe("Swap", function () {
    it("Should swap 100 DAI for WBTC", async function () {
      const { swapContract, whitebitSigner, daiContract, wbtcContract } = await loadFixture(testSwapUniswap);
      const tokenIn = daiContract.address;
      const tokenOut = WBTC_ADDRESS;
      const amountIn = ethers.utils.parseEther("100");
      const amountOut = "1";
      const to = whitebitSigner.address;

      //check that WBTC balance is 0
      const WBTC_BALANCEOF_BEFORE = await wbtcContract.balanceOf(whitebitSigner.address);
      expect(WBTC_BALANCEOF_BEFORE).to.equal(0);

      //approve DAI
      const approveTx = await daiContract.connect(whitebitSigner).approve(swapContract.address, amountIn);
      await approveTx.wait();

      //swap DAI for WBTC
      const swapTx = await swapContract.connect(whitebitSigner).swap(tokenIn, tokenOut, amountIn, amountOut, to);
      await swapTx.wait();

      //check WBTC balance > 1
      const WBTC_BALANCEOF_AFTER = await wbtcContract.balanceOf(whitebitSigner.address);
      expect(WBTC_BALANCEOF_AFTER).to.be.greaterThan(1);
    });
  });
});
