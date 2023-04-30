const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { network, ethers } = require("hardhat");

//address on mainnet
const WHITEBIT_ADDRESS = "0x1689a089AA12d6CbBd88bC2755E4c192f8702000";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const PAIR_DAI_USDC = "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5";

describe("Swap", function () {
  let flashSwapContract, signer, daiContract;
  async function testSwapUniswap() {
    //impersonate account parameters
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WHITEBIT_ADDRESS],
    });

    //instance of signer
    signer = await ethers.getSigner(WHITEBIT_ADDRESS);

    //instace of DAI
    daiContract = await ethers.getContractAt("IERC20", DAI_ADDRESS);

    const Flash = await ethers.getContractFactory("FlashSwap");
    flashSwapContract = await Flash.deploy();

    return { flashSwapContract, signer, daiContract };
  }

  describe("Flash swap, borrow 1million DAI", function () {
    it("Should borrow 1m DAI token", async function () {
      const { flashSwapContract, signer, daiContract } = await loadFixture(testSwapUniswap);
      const tokenToBorrow = daiContract.address;
      const amountToBorrow = ethers.utils.parseEther("10000");

      //check balance before the TX
      const balanceBefore = await daiContract.balanceOf(signer.address);
      console.log("balance before", balanceBefore);

      //1 transfer dai token to the flashSwap contract
      const transfer = await daiContract.connect(signer).transfer(flashSwapContract.address, balanceBefore);
      await transfer.wait();

      //2 flash swap
      const borrowTx = await flashSwapContract.connect(signer).flashSwap(tokenToBorrow, amountToBorrow);
      const receipt = await borrowTx.wait();
      console.log("LOGS:", receipt.logs);

      //balance before => 23.024,107_398_134_999_992_832
      //amount0 =>        10.000_000_000_000_000_000_000
      //amount1 =>        0
      //amountToborrow => 10.000_000_000_000_000_000_000
      //fee =>                30,090_270_812_437_311_936
      //amount repay =>   10.030_090_270_812_437_311_936

      //~~ BALANCES BEFORE PAYING BACK ~~
      //balance token0 => 33.024_107_398_134_999_992_832 (balance before + amountToBorrow)
      //balance token1 => 0
    });
  });
});
