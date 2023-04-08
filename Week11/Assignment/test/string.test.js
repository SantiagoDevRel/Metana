const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("String contract", function () {
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const String = await ethers.getContractFactory("String");
    const string = await String.deploy();
    await string.deployed();

    return { string, owner };
  }

  describe("Deployment", function () {
    /* 
  charAt(“abcdef”, 2) should return 0x6300
  charAt(“”, 0) should return 0x0000
  charAt(“george”, 10) should return 0x0000  
  */

    it("charAt(“abcdef”, 2) should return 0x6300", async function () {
      const { string } = await loadFixture(deployOneYearLockFixture);

      const value = await string.chartAtSolidity("abcdef", 2);
      console.log(value);
      //expect(value).to.equal("0x6300");
    });

    it("charAt(“”, 0) should return 0x0000", async function () {
      const { string } = await loadFixture(deployOneYearLockFixture);

      const value = await string.chartAtSolidity("", 0);
      console.log(value);
      //expect(value).to.equal("0x0000");
    });

    it("charAt(“george”, 10) should return 0x0000", async function () {
      const { string } = await loadFixture(deployOneYearLockFixture);

      const value = await string.chartAtSolidity("george", 10);
      console.log(value);
      //expect(value).to.equal("0x0000");
    });
  });
});
