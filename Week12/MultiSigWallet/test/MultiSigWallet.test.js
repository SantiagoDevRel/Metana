const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployWallet() {
    // Contracts are deployed using the first signer/account by default
    const [owner1, owner2, owner3] = await ethers.getSigners();
    const requiredSignatures = 2;
    const Contract = await ethers.getContractFactory("MultiSigWallet");
    const wallet = await Contract.deploy([owner1, owner2, owner3], requiredSignatures);

    return { wallet, owner1, owner2, owner3 };
  }

  describe("setSignaturesRequired", function () {
    it("should update the required number of signatures", async function () {
      const { wallet, owner1, owner2, owner3 } = await loadFixture(deployWallet);
      const oldSignatures = await wallet.signaturesRequired();
      await wallet.setSignaturesRequired(oldSignatures - 1);
      const newSignatures = await wallet.signaturesRequired();
      expect(newSignatures).to.equal(oldSignatures - 1);
    });

    it("should revert if not called by an owner", async function () {
      const attacker = await ethers.getSigner();
      await expect(wallet.connect(attacker).setSignaturesRequired(1)).to.be.revertedWith("MultiSig: Caller must be an owner");
    });
  });

  describe("submitNewTx", function () {
    it("should add a new transaction to the list", async function () {
      const { wallet, owner1, owner2, owner3 } = await loadFixture(deployWallet);

      const to = owner1.address;
      const value = ethers.utils.parseEther("1");
      const data = "0x";
      await wallet.connect(owner2).submitNewTx(to, value, data);
      const tx = await wallet.getTransactionAtIndex(0);
      expect(tx.to).to.equal(to);
      expect(tx.value).to.equal(value);
      expect(tx.data).to.equal(data);
      expect(tx.executed).to.be.false;
    });

    it("should revert if not called by an owner", async function () {
      const { wallet, owner1, owner2, owner3 } = await loadFixture(deployWallet);

      const to = owner1.address;
      const value = ethers.utils.parseEther("1");
      const data = "0x";
      const attacker = await ethers.getSigner();
      await expect(wallet.connect(attacker).submitNewTx(to, value, data)).to.be.revertedWith("MultiSig: Caller must be an owner");
    });
  });

  describe("approveTx", function () {
    it("should mark a transaction as approved by an owner", async function () {
      const { wallet, owner1, owner2, owner3 } = await loadFixture(deployWallet);

      const to = owner1.address;
      const value = ethers.utils.parseEther("1");
      const data = "0x";
      await wallet.submitNewTx(to, value, data);
      const txID = 0;
      await wallet.approveTx(txID);
      const approved = await wallet.TxIsApprovedByOwner(txID, owner1.address);
      expect(approved).to.be.true;
    });

    it("should revert if the transaction has already been executed", async function () {
      const { wallet, owner1, owner2, owner3 } = await loadFixture(deployWallet);

      const to = owner1.address;
      const value = ethers.utils.parseEther("1");
      const data = "0x";
      await wallet.submitNewTx(to, value, data);
      const txID = 0;
      await wallet.executeTx(txID);
      await expect(wallet.approveTx(txID)).to.be.revertedWith("MultiSig: Transaction already executed");
    });
  });
});
