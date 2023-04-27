const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { network, ethers } = require("hardhat");

//address on mainnet
const WHITEBIT_ADDRESS = "0x1689a089AA12d6CbBd88bC2755E4c192f8702000";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const PAIR_DAI_USDC = "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5";

describe("Swap", function () {
  let daiContract, whitebitSigner, usdcContract;
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

    //instace of USDC
    usdcContract = await ethers.getContractAt("IERC20", USDC_ADDRESS);

    const OptSwap = await ethers.getContractFactory("OptimalSwap");
    const optimalSwap = await OptSwap.deploy();

    return { optimalSwap, whitebitSigner, daiContract, usdcContract };
  }

  describe("Swap and add liqiduity", function () {
    it("Should start with 0 liquidity and finish with > 0", async function () {
      const { optimalSwap, whitebitSigner, daiContract, usdcContract } = await loadFixture(testSwapUniswap);
      const tokenA = daiContract.address;
      const tokenB = usdcContract.address;
      const amountA = await daiContract.balanceOf(whitebitSigner.address);
      //console.log("ABALANCE DAI", amountA);
      //1 approve tokens to add liquidity contract
      const approve1 = await daiContract.connect(whitebitSigner).approve(optimalSwap.address, amountA);
      await approve1.wait();

      expect(await optimalSwap.connect(whitebitSigner).getBalance(PAIR_DAI_USDC)).to.be.equal(0);

      //2 call add liquidity contract
      const swapTx = await optimalSwap.connect(whitebitSigner).swapAndAdd(tokenA, tokenB, amountA);
      await swapTx.wait();

      expect(await optimalSwap.connect(whitebitSigner).getBalance(PAIR_DAI_USDC)).to.be.greaterThan(1);
    });
  });
});
