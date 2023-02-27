const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber, utils } = ethers;

describe("Test PartialRefund contract", () => {
  let contract = null,
    provider = null,
    owner = null,
    user2 = null;

  beforeEach(async () => {
    //Get accounts
    const [acc1, acc2] = await ethers.getSigners();
    owner = acc1;
    user2 = acc2;

    //Deploy contract
    const Contract = await ethers.getContractFactory("PartialRefund");
    contract = await Contract.deploy();
    await contract.deployed();

    //Send 2000 ether to user2 & 1 ether to owner;
    provider = ethers.provider;
    const amountToMint = utils.hexStripZeros(
      utils.parseEther("2000").toHexString()
    );
    const balanceOfOwner = utils.hexStripZeros(
      utils.parseEther("1").toHexString()
    );
    await provider.send("hardhat_setBalance", [user2.address, amountToMint]);
    await provider.send("hardhat_setBalance", [owner.address, balanceOfOwner]);
  });

  it("Owner balance should be 1 ethers", async () => {
    const balanceOfOwner = await provider.getBalance(owner.address);
    expect(balanceOfOwner).to.be.closeTo(
      new BigNumber.from(utils.parseEther("1")),
      new BigNumber.from(utils.parseEther("0.01"))
    );
    console.log(utils.formatEther(balanceOfOwner));
  });

  it("User2 balance should be 2000 ethers", async () => {
    const balanceOfUser2 = await provider.getBalance(user2.address);
    expect(balanceOfUser2).to.be.equal(
      new BigNumber.from(utils.parseEther("2000"))
    );
  });

  it("Contract balance should be 0 ethers", async () => {
    const balanceOfContract = await provider.getBalance(contract.address);
    expect(balanceOfContract).to.be.equal(
      new BigNumber.from(utils.parseEther("0"))
    );
  });

  it("PreSale() paying 2 ethers - reverted", async () => {
    await expect(
      contract.connect(user2).preSale({ value: utils.parseEther("2") })
    ).to.be.revertedWith("ERC20: Pay only 1 ether");
  });

  it("PreSale() should fail --> maxSupply reached", async () => {
    const oneEther = utils.parseEther("1");
    const preSale = async () => {
      const tx = await contract.connect(user2).preSale({ value: oneEther });
      await tx.wait();
    };
    //Mint x1001 times
    for (let i = 0; i <= 1000; i++) {
      if (i === 1000) {
        await expect(preSale()).to.be.revertedWith("ERC20: MaxSupply reached");
        break;
      }
      await preSale();
    }

    //expect balance of the contract to be 1_000 ethers
    expect(await provider.getBalance(contract.address)).to.be.equal(
      new BigNumber.from(utils.parseEther("1000"))
    );
  });

  it("PreSale() x1 time by user2", async () => {
    const oneEther = utils.parseEther("1");
    const tx = await contract.connect(user2).preSale({ value: oneEther });
    await tx.wait();

    const balanceOfUser = await provider.getBalance(user2.address);
    const newBalanceOfUser = utils.parseEther("1999");
    expect(balanceOfUser).to.be.closeTo(
      new BigNumber.from(newBalanceOfUser),
      new BigNumber.from(utils.parseEther("0.0001"))
    );
  });

  it("withdrawFunds() by the owner", async () => {
    //PreSale() 1 ether by user2
    const oneEther = utils.parseEther("1");
    const tx = await contract.connect(user2).preSale({ value: oneEther });
    await tx.wait();

    //Withdraw funds (1 ether) by owner
    const withdraw = await contract.connect(owner).withdrawFunds();
    await withdraw.wait();

    //new balance of owner should be 2 ether - gasFees
    const newBalanceOfOwner = await provider.getBalance(owner.address);
    expect(newBalanceOfOwner).to.be.closeTo(
      new BigNumber.from(utils.parseEther("2")),
      new BigNumber.from(utils.parseEther("0.0001"))
    );
  });

  it("withdrawFunds() by the user2 - reverted", async () => {
    //PreSale() 1 ether by user2
    const oneEther = utils.parseEther("1");
    const tx = await contract.connect(user2).preSale({ value: oneEther });
    await tx.wait();

    //Withdraw funds (1 ether) by user2
    await expect(contract.connect(user2).withdrawFunds()).to.be.revertedWith(
      "ERC20: You are not the owner"
    );
  });

  it("Test withdrawFunds() with callStatic", async () => {
    //test with Owner
    const txByOwner = await contract.connect(owner).callStatic.withdrawFunds();
    expect(txByOwner).to.be.equal(true);

    //test with User2
    await expect(
      contract.connect(user2).callStatic.withdrawFunds()
    ).to.be.revertedWith("ERC20: You are not the owner");
  });

  it("SellBack() by the User2", async () => {
    //Mint (preSal()) 10000 tokens by user2
    const oneEther = utils.parseEther("1");
    const tx = await contract.connect(user2).preSale({ value: oneEther });
    await tx.wait();

    //user should own 1000 tokens
    const oneThousandTokens = utils.parseEther("1000");
    expect(await contract.balanceOf(user2.address)).to.be.equal(
      oneThousandTokens
    );

    /*  //approve 1000 tokens from user to the contract
    const approve = await contract
      .connect(user2)
      .approve(contract.address, oneThousandTokens);
    await approve.wait(); 

    //check allowance from user by the contract = 1000 tokens
    const allowanceFromContractByUser = await contract.allowance(
      user2.address,
      contract.address
    );
    expect(allowanceFromContractByUser).to.be.equal(oneThousandTokens);
    */

    //test sellBack() by user2
    const sellBack = await contract.connect(user2).sellBack(1000);
    await sellBack.wait();

    //user2 should have 0 tokens
    const newBalanceOfUser = await contract.balanceOf(user2.address);
    expect(newBalanceOfUser).to.be.equal(utils.parseEther("0"));
  });

  it("SellBack() fails because no funds in the contract", async () => {
    //Mint (preSal()) 10000 tokens by user2
    const oneEther = utils.parseEther("1");
    const tx = await contract.connect(user2).preSale({ value: oneEther });
    await tx.wait();

    //user should own 1000 tokens
    const oneThousandTokens = utils.parseEther("1000");
    expect(await contract.balanceOf(user2.address)).to.be.equal(
      oneThousandTokens
    );

    /* //approve 1000 tokens from user to the contract
    const approve = await contract
      .connect(user2)
      .approve(contract.address, oneThousandTokens);
    await approve.wait(); 

    //check allowance from user by the contract = 1000 tokens
    const allowanceFromContractByUser = await contract.allowance(
      user2.address,
      contract.address
    );
    expect(allowanceFromContractByUser).to.be.equal(oneThousandTokens);
      */

    //withdraw contract funds
    const withdraw = await contract.connect(owner).withdrawFunds();
    await withdraw.wait();

    //test sellBack() by user2
    await expect(contract.connect(user2).sellBack(1000)).to.be.revertedWith(
      "ERC20: Not enough ether in this contract"
    );

    //user2 should have 1000 tokens
    const newBalanceOfUser = await contract.balanceOf(user2.address);
    expect(newBalanceOfUser).to.be.equal(utils.parseEther("1000"));
  });
});
