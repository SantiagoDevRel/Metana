const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployCloneERC20() {
    const [owner, otherAccount] = await ethers.getSigners();

    const FactoryErc20 = await ethers.getContractFactory("FactoryERC20");
    const factoryErc20 = await FactoryErc20.deploy();
    await factoryErc20.deployed()

    return { factoryErc20, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Creating tokens ", async function () {
      const { factoryErc20, owner } = await loadFixture(deployCloneERC20);
      
      //Create token with new()
      const createWithNewTx = await factoryErc20.connect(owner).createTokenWithNew("Name","SMB",1000);
      await createWithNewTx.wait()
      const arrayTokensNew = await factoryErc20.getTokensNew()
      expect(arrayTokensNew.length).to.equal(1);

      //Create token with Clone()
      const createWithCLoneTx = await factoryErc20.connect(owner).createTokenWithClones(arrayTokensNew[0]);
      await createWithCLoneTx.wait()
      const arrayTokensClone = await factoryErc20.getTokensClone()
      expect(arrayTokensClone.length).to.equal(1);
    });

   

  });
});
