const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Multi Signature wallet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployWallet() {
    // Contracts are deployed using the first signer/account by default
    const [owner1, owner2, owner3] = await ethers.getSigners();
    const arrayOwners = [owner1.address, owner2.address, owner3.address];
    const requiredSignatures = 2;
    const Contract = await ethers.getContractFactory("MultiSigWallet");
    console.log(arrayOwners);
    const contractWallet = await Contract.deploy(arrayOwners, requiredSignatures);
    await contractWallet.deployed();
    return { contractWallet, owner1, owner2, owner3, requiredSignatures };
  }

  describe("setSignaturesRequired", function () {
    it("should update the required number of signatures", async function () {
      const { contractWallet, owner1, owner2, owner3, requiredSignatures } = await loadFixture(deployWallet);
      const oldSignatures = await contractWallet.signaturesRequired();
      expect(oldSignatures).to.equal(requiredSignatures);
      const newSignature = 3;
      //update signature
      const updateSignTx = await contractWallet.connect(owner1).setSignaturesRequired(newSignature);
      await updateSignTx.wait();
      //get new signature
      const newSignatures = await contractWallet.signaturesRequired();
      expect(newSignatures).to.equal(newSignature);
    });

    it("should not allow the required number of signatures to be set to more than the number of owners", async function () {
      const { contractWallet, owner1, owner2, owner3 } = await loadFixture(deployWallet);
      await expect(contractWallet.connect(owner1).setSignaturesRequired(4)).to.be.revertedWith("MultiSig: Wrong number of signatures required");
    });

    it("should not allow the required number of signatures to be set to zero", async function () {
      const { contractWallet, owner1, owner2, owner3 } = await loadFixture(deployWallet);
      await expect(contractWallet.connect(owner1).setSignaturesRequired(0)).to.be.revertedWith("MultiSig: Wrong number of signatures required");
    });
  });
});
