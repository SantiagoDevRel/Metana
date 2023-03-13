const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { BigNumber } = ethers;

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
// BINANCE_8_WHALE must be an account, not contract
//Binance 8 account -->
const BINANCE_8_WHALE = "0xF977814e90dA44bFA03b6295A0616a897441aceC";

describe("Test unlock accounts", () => {
  let accounts = null,
    dai = null,
    binance = null,
    myAccount = null;

  beforeEach(async () => {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [BINANCE_8_WHALE],
    });

    binance = await ethers.getSigner(BINANCE_8_WHALE);
    dai = await ethers.getContractAt("IERC20", DAI);
    myAccountAddress = "0xc85eE321199BaB137F0885F045B0f0Ebd151bD11";

    accounts = await ethers.getSigners();
  });

  it("Unlock account ", async () => {
    const balanceOfBinance = await dai.balanceOf(binance.address);

    //expect binance wallet to hold +10'000.000 (million) of DAI
    expect(balanceOfBinance).to.be.greaterThan(
      new BigNumber.from(ethers.utils.parseEther("10000000"))
    );
  });

  it("Check my balance = 0 DAI", async () => {
    const myBalance = await dai.balanceOf(myAccountAddress);
    expect(myBalance).to.be.equal(new BigNumber.from(0));
  });

  it("Expect 1000 DAI in my account from Binance account", async () => {
    const amountOfDai = ethers.utils.parseEther("1000");
    const tx = await dai
      .connect(binance)
      .transfer(myAccountAddress, amountOfDai);
    await tx.wait();

    //expect my balance to be 1000 DAI
    expect(await dai.balanceOf(myAccountAddress)).to.be.equal(
      new BigNumber.from(amountOfDai)
    );
  });
});
