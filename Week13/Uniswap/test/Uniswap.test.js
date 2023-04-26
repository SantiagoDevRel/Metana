const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { network, ethers } = require("hardhat");
const { BigNumber } = ethers;

//address on mainnet
const WHITEBIT_ADDRESS = "0x1689a089AA12d6CbBd88bC2755E4c192f8702000";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

describe("Swap", function () {
  let dai, whitebitSigner;
  async function testSwapUniswap() {
    //impersonate account parameters
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WHITEBIT_ADDRESS],
    });
    //instance of signer
    whitebitSigner = await ethers.getSigner(WHITEBIT_ADDRESS);

    //get instace of DAI
    dai = await ethers.getContractAt("IERC20", DAI_ADDRESS);
    console.log("BAALNCE", await dai.balanceOf(whitebitSigner.address));

    const Swap = await ethers.getContractFactory("Test");
    const swapContract = await Swap.deploy();

    return { swapContract, whitebitSigner, dai };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { swapContract, whitebitSigner, dai } = await loadFixture(testSwapUniswap);

      console.log();
    });
  });
});
