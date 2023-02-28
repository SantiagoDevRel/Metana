/* eslint-disable jest/valid-expect */
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber, toHexString, toString } = ethers;

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

  describe("Test Forging", () => {
    beforeEach(async () => {
      //setMinter() on multitoken for the forging address to be able to call multiToken
      const setMinter = await multitoken
        .connect(owner)
        .setMinter(forging.address);
      await setMinter.wait();
    });

    it("mintBatchToken() by forging", async () => {
      const tokenIds = [0, 1, 2];
      const quantity = [5, 5, 5];

      //mintBatch()
      const mintBatchTx = await forging
        .connect(user2)
        .mintBatchToken(tokenIds, quantity);
      await mintBatchTx.wait();

      //retrieve balancesOfBatch from multitoken
      const [balanceToken0Hex, balanceToken1Hex, balanceToken2Hex] =
        await multitoken.balanceOfBatch(
          [user2.address, user2.address, user2.address],
          tokenIds
        );

      //parse hex to decimal number
      const balanceToken0Number = balanceToken0Hex.toNumber();
      const balanceToken1Number = balanceToken1Hex.toNumber();
      const balanceToken2Number = balanceToken2Hex.toNumber();

      //compare balances
      expect(balanceToken0Number).to.be.equal(quantity[0]);
      expect(balanceToken1Number).to.be.equal(quantity[1]);
      expect(balanceToken2Number).to.be.equal(quantity[2]);
    });

    it("Forge tokens to get token3,4,5 & 6", async () => {
      const tokenIds = [0, 1, 2];
      const quantity = [10, 10, 10];

      //mintBatch() x10(tokens 0,1 & 2)
      const mintBatchTx = await forging
        .connect(user2)
        .mintBatchToken(tokenIds, quantity);
      await mintBatchTx.wait();

      //forge x1(Tokens 0) + x1(Token 1) ==> x1(Token 3)
      const forgeTx3 = await forging.connect(user2).forgeTokens([0, 1], [1, 1]);
      await forgeTx3.wait();

      //forge x1(Tokens 1) + x1(Token 2) ==> x1(Token 4)
      const forgeTx4 = await forging.connect(user2).forgeTokens([1, 2], [1, 1]);
      await forgeTx4.wait();

      //forge x1(Tokens 0) + x1(Token 2) ==> x1(Token 5)
      const forgeTx5 = await forging.connect(user2).forgeTokens([0, 2], [1, 1]);
      await forgeTx5.wait();

      //forge x1(Token 0) + x1(Token 1) + x1(Token 2) ==> x1(Token 6)
      const forgeTx6 = await forging
        .connect(user2)
        .forgeTokens([0, 1, 2], [1, 1, 1]);
      await forgeTx6.wait();

      const userArray = [
        user2.address,
        user2.address,
        user2.address,
        user2.address,
        user2.address,
        user2.address,
        user2.address,
      ];
      const idsArray = [0, 1, 2, 3, 4, 5, 6];
      const [
        balanceToken0Hex,
        balanceToken1Hex,
        balanceToken2Hex,
        balanceToken3Hex,
        balanceToken4Hex,
        balanceToken5Hex,
        balanceToken6Hex,
      ] = await multitoken.balanceOfBatch(userArray, idsArray);

      expect(balanceToken0Hex.toNumber()).to.be.equal(7);
      expect(balanceToken1Hex.toNumber()).to.be.equal(7);
      expect(balanceToken2Hex.toNumber()).to.be.equal(7);
      expect(balanceToken3Hex.toNumber()).to.be.equal(1);
      expect(balanceToken4Hex.toNumber()).to.be.equal(1);
      expect(balanceToken5Hex.toNumber()).to.be.equal(1);
      expect(balanceToken6Hex.toNumber()).to.be.equal(1);

      //forge all tokens
      const forgeAll = await forging
        .connect(user2)
        .forgeTokens([0, 1, 2, 3, 4, 5, 6], [1, 1, 1, 1, 1, 1, 1]);
      await forgeAll.wait();

      //check new balances again
      const [
        newBalanceToken0Hex,
        newBalanceToken1Hex,
        newBalanceToken2Hex,
        newBalanceToken3Hex,
        newBalanceToken4Hex,
        newBalanceToken5Hex,
        newBalanceToken6Hex,
      ] = await multitoken.balanceOfBatch(userArray, idsArray);

      expect(newBalanceToken0Hex.toNumber()).to.be.equal(6);
      expect(newBalanceToken1Hex.toNumber()).to.be.equal(6);
      expect(newBalanceToken2Hex.toNumber()).to.be.equal(6);
      expect(newBalanceToken3Hex.toNumber()).to.be.equal(0);
      expect(newBalanceToken4Hex.toNumber()).to.be.equal(0);
      expect(newBalanceToken5Hex.toNumber()).to.be.equal(0);
      expect(newBalanceToken6Hex.toNumber()).to.be.equal(1);

      //forge tokens[0,1,6]
      const forgeAgain = await forging
        .connect(user2)
        .forgeTokens([0, 1, 6], [1, 1, 1]);
      await forgeAgain.wait();

      const balanceToken0 = await multitoken.balanceOf(user2.address, 0);
      const balanceToken1 = await multitoken.balanceOf(user2.address, 1);
      const balanceToken3 = await multitoken.balanceOf(user2.address, 3);
      const balanceToken6 = await multitoken.balanceOf(user2.address, 6);

      expect(balanceToken0).to.be.equal(5);
      expect(balanceToken1).to.be.equal(5);
      expect(balanceToken3).to.be.equal(1);
      expect(balanceToken6).to.be.equal(0);
    });

    it("Mint tokens and burn token 3,4,5 & 6", async () => {
      const tokenIds = [0, 1, 2];
      const quantity = [10, 10, 10];

      //mintBatch() x10(tokens 0,1 & 2)
      const mintBatchTx = await forging
        .connect(user2)
        .mintBatchToken(tokenIds, quantity);
      await mintBatchTx.wait();

      //forge x1(Tokens 0) + x1(Token 1) ==> x1(Token 3)
      const forgeTx3 = await forging.connect(user2).forgeTokens([0, 1], [1, 1]);
      await forgeTx3.wait();

      //forge x1(Tokens 1) + x1(Token 2) ==> x1(Token 4)
      const forgeTx4 = await forging.connect(user2).forgeTokens([1, 2], [1, 1]);
      await forgeTx4.wait();

      //forge x1(Tokens 0) + x1(Token 2) ==> x1(Token 5)
      const forgeTx5 = await forging.connect(user2).forgeTokens([0, 2], [1, 1]);
      await forgeTx5.wait();

      //forge x1(Token 0) + x1(Token 1) + x1(Token 2) ==> x1(Token 6)
      const forgeTx6 = await forging
        .connect(user2)
        .forgeTokens([0, 1, 2], [1, 1, 1]);
      await forgeTx6.wait();

      const forge3456 = await forging
        .connect(user2)
        .forgeTokens([3, 4, 5, 6], [1, 1, 1, 1]);
      await forge3456.wait();
      const balanceToken3 = await multitoken.balanceOf(user2.address, 3);
      const balanceToken4 = await multitoken.balanceOf(user2.address, 4);
      const balanceToken5 = await multitoken.balanceOf(user2.address, 5);
      const balanceToken6 = await multitoken.balanceOf(user2.address, 6);

      expect(balanceToken3).to.be.equal(0);
      expect(balanceToken4).to.be.equal(0);
      expect(balanceToken5).to.be.equal(0);
      expect(balanceToken6).to.be.equal(0);
    });

    it("tradeTokens()", async () => {
      const tokenIds = [0, 1, 2];
      const quantity = [5, 5, 5];

      //mintBatch()
      const mintBatchTx = await forging
        .connect(user2)
        .mintBatchToken(tokenIds, quantity);
      await mintBatchTx.wait();

      //function tradeTokens(uint _tokenIdGive, uint _amountToExchange, uint _tokenIdReceive) public {

      //trade token 0 for token1 & check balance
      const trade0for1 = await forging.connect(user2).tradeTokens(0, 1, 1);
      await trade0for1.wait();
      const balanceToken0 = await multitoken.balanceOf(user2.address, 0);
      expect(balanceToken0).to.be.equal(4);
      const balanceToken1 = await multitoken.balanceOf(user2.address, 1);
      expect(balanceToken1).to.be.equal(6);

      //trade token 0 for token2 & check balance
      const trade0for2 = await forging.connect(user2).tradeTokens(0, 1, 2);
      await trade0for2.wait();
      const newBalanceToken0 = await multitoken.balanceOf(user2.address, 0);
      expect(newBalanceToken0).to.be.equal(3);
      const newBalanceToken2 = await multitoken.balanceOf(user2.address, 2);
      expect(newBalanceToken2).to.be.equal(6);

      //trade token 1 for token2 & check balance
      const trade1for2 = await forging.connect(user2).tradeTokens(1, 1, 2);
      await trade1for2.wait();
      const newNewBalanceToken0 = await multitoken.balanceOf(user2.address, 1);
      expect(newNewBalanceToken0).to.be.equal(5);
      const newNewBalanceToken2 = await multitoken.balanceOf(user2.address, 2);
      expect(newNewBalanceToken2).to.be.equal(7);
    });

    it("MintBatch() again before 1 minute - reverted", async () => {
      const tokenIds = [0, 1, 2];
      const quantity = [5, 5, 5];

      //mintBatch()
      const mintBatchTx = await forging
        .connect(user2)
        .mintBatchToken(tokenIds, quantity);
      await mintBatchTx.wait();

      //mintBatch() again - reverted
      await expect(
        forging.connect(user2).mintBatchToken(tokenIds, quantity)
      ).to.be.revertedWith("FORGING: Please wait 1 minute.");
    });

    it("Try to mint token 3 4 or 5", async () => {
      const tokenIds = [3, 4, 5];
      const quantity = [5, 5, 5];

      //mintBatch() - reverted
      await expect(
        forging.connect(user2).mintBatchToken(tokenIds, quantity)
      ).to.be.revertedWith("FORGING: You can mint only tokens 0,1 and 2.");
    });

    it("Try to trade tokens 3,4,5 or 6", async () => {
      await expect(
        forging.connect(user2).tradeTokens(3, 1, 0)
      ).to.be.rejectedWith("FORGING: You can trade only tokens 0,1, and 2.");
      await expect(
        forging.connect(user2).tradeTokens(4, 1, 1)
      ).to.be.rejectedWith("FORGING: You can trade only tokens 0,1, and 2.");
      await expect(
        forging.connect(user2).tradeTokens(5, 1, 2)
      ).to.be.rejectedWith("FORGING: You can trade only tokens 0,1, and 2.");
      await expect(
        forging.connect(user2).tradeTokens(0, 1, 3)
      ).to.be.rejectedWith("FORGING: You can trade only tokens 0,1, and 2.");
    });
  });
});
