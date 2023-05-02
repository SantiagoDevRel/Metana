const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { network, ethers } = require("hardhat");

//address on mainnet
const WALLET_ADDRESS = "0xE46203ca942c4bA1A9249B6B9B27A79761819606";
const WETH10_ADDRESS = "0xf4BB2e28688e89fCcE3c0580D37d36A7672E8A9F";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("FlashMint", function () {
  let flashMintContract, signer, weth10Contract;
  async function testSwapUniswap() {
    //impersonate account parameters
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WALLET_ADDRESS],
    });

    //instance of signer
    signer = await ethers.getSigner(WALLET_ADDRESS);

    //instace of WETH10
    weth10Contract = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", WETH10_ADDRESS);

    //instance of FlashMint
    const Flash = await ethers.getContractFactory("FlashMint");
    flashMintContract = await Flash.deploy();

    return { flashMintContract, signer, weth10Contract };
  }

  describe("Flash mint", function () {
    it("Update all the storage variables from the onFlashLoan()", async function () {
      const { flashMintContract, signer, weth10Contract } = await loadFixture(testSwapUniswap);
      const ZERO = "0";
      const ZERO_BYTES = "0x";

      //expect all the storage variables from the contract to be the default
      expect(await flashMintContract.s_initiator()).to.be.equal(ZERO_ADDRESS);
      expect(await flashMintContract.s_token()).to.be.equal(ZERO_ADDRESS);
      expect(await flashMintContract.s_balance()).to.be.equal(ZERO);
      expect(await flashMintContract.s_fee()).to.be.equal(ZERO);
      expect(await flashMintContract.s_bytes()).to.be.equal(ZERO_BYTES);

      const flashTx = await flashMintContract.connect(signer).flash();
      await flashTx.wait();

      console.log("Initiator (address(this)", await flashMintContract.s_initiator());
      console.log("Address token caller    ", await flashMintContract.s_token());
      console.log("Amount Borrowed         ", await flashMintContract.s_balance());
      console.log("Fee                     ", await flashMintContract.s_fee());
      console.log("Bytes decode            ", await flashMintContract.s_bytes());
    });
  });
});
