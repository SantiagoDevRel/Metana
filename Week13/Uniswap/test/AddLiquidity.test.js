const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { network, ethers } = require("hardhat");

//address on mainnet
const WHITEBIT_ADDRESS = "0x1689a089AA12d6CbBd88bC2755E4c192f8702000";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

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

    //instace of USDC
    usdcContract = await ethers.getContractAt("IERC20", USDC_ADDRESS);

    const AddLiquidity = await ethers.getContractFactory("AddLiquidity");
    const addLiquidityContract = await AddLiquidity.deploy();

    return { addLiquidityContract, whitebitSigner, daiContract, usdcContract };
  }

  describe("Add liquidity", function () {
    it("Should add 100DAI & 100 USDC", async function () {
      const { addLiquidityContract, whitebitSigner, daiContract, usdcContract } = await loadFixture(testSwapUniswap);
      const tokenA = daiContract.address;
      const tokenB = usdcContract.address;
      const amountA = await daiContract.balanceOf(whitebitSigner.address);
      const amountB = await usdcContract.balanceOf(whitebitSigner.address);

      //1 approve tokens to add liquidity contract
      const approve1 = await daiContract.connect(whitebitSigner).approve(addLiquidityContract.address, amountA);
      const approve2 = await usdcContract.connect(whitebitSigner).approve(addLiquidityContract.address, amountB);
      await approve1.wait();
      await approve2.wait();

      //2 call add liquidity contract
      const addLiquidityTx = await addLiquidityContract.connect(whitebitSigner).addLiquidity(tokenA, tokenB, amountA, amountB);
      const receiptTx = await addLiquidityTx.wait();
      const a = receiptTx.events;
      console.log(a[9].args);
      console.log(a[10].args);
      console.log(a[11].args);
      //console.log(b);
      //console.log(l);
    });
  });
});
