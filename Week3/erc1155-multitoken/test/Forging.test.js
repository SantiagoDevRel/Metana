/* eslint-disable jest/valid-expect */
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("Deploy MultiToken & Forging contract", () => {
  let forging = null,
    multitoken = null,
    owner = null,
    user2 = null,
    provider = null,
    forgingSigner = null;

  beforeEach(async () => {
    //get deployer & user2 signers
    const [acc1, acc2] = await ethers.getSigners();
    owner = acc1;
    user2 = acc2;

    //deploy multitoken
    const ContractMultiToken = await ethers.getContractFactory("MultiToken");
    multitoken = await ContractMultiToken.deploy();
    await multitoken.deployed();

    //deploy forging
    const ContractForging = await ethers.getContractFactory("Forging");
    forging = await ContractForging.deploy(multitoken.address);
    await forging.deployed();
  });

  describe("Test Multitoken", () => {
    it("SetURI() from owner", async () => {
      const tokenId = 0;

      const setUri = await multitoken
        .connect(owner)
        .setURI(tokenId, "https://github.com/strujilloz/");
      await setUri.wait();
    });

    it("SetURI() from user2 - reverted", async () => {
      const tokenId = 0;

      await expect(
        multitoken
          .connect(user2)
          .setURI(tokenId, "https://github.com/strujilloz/")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("set uri and call uri()", async () => {
      const tokenId = 0;
      const setUri = await multitoken
        .connect(owner)
        .setURI(tokenId, "https://github.com/strujilloz/");
      await setUri.wait();

      const uri = await multitoken.uri(tokenId);
      expect(uri).to.be.equal(`https://github.com/strujilloz/${tokenId}`);
    });

    it("SetMinter() from owner", async () => {
      const setMinter = await multitoken
        .connect(owner)
        .setMinter(forging.address);
      await setMinter.wait();
    });

    it("SetMinter() from user2 - reverted", async () => {
      await expect(
        multitoken.connect(user2).setMinter(forging.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Mint() directly on MultiToken - reverted", async () => {
      await expect(
        multitoken.connect(owner).mint(user2.address, 0, 1)
      ).to.be.revertedWith("MultiToken: You are not the minter");
    });

    it("MintBatch() directly on MultiToken - reverted", async () => {
      await expect(
        multitoken.connect(owner).mintBatch(user2.address, [0, 1, 2], [1, 1, 1])
      ).to.be.revertedWith("MultiToken: You are not the minter");
    });

    it("burnBatch() directly on MultiToken - reverted", async () => {
      await expect(
        multitoken.connect(owner).burnBatch(user2.address, [0, 1, 2], [1, 1, 1])
      ).to.be.revertedWith("MultiToken: You are not the minter");
    });

    it("burn() directly on MultiToken - reverted", async () => {
      await expect(
        multitoken.connect(owner).burn(user2.address, [0, 1, 2], [1, 1, 1])
      ).to.be.revertedWith("MultiToken: You are not the minter");
    });
  });
});
