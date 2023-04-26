const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Lock", function () {
  async function testSwapUniswap() {
    const [owner] = await ethers.getSigners();
    const WHITEBIT_ADDRESS = "0x1689a089AA12d6CbBd88bC2755E4c192f8702000";
    const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

    const Swap = await ethers.getContractFactory("Lock");
    const swapContract = await Swap.deploy();

    return { swapContract, owner, BINANCE: WHITEBIT_ADDRESS, DAI_ADDRESS };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { swapContract, owner, BINANCE: WHITEBIT_ADDRESS, DAI_ADDRESS } = await loadFixture(testSwapUniswap);

      expect(await lock.unlockTime()).to.equal(unlockTime);
    });
  });
});
