const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("Testing Payable functions", () => {
  let contract = null,
    deployer = null,
    user2 = null,
    provider = null;

  beforeEach(async () => {
    const [acc1, acc2] = await ethers.getSigners();
    deployer = acc1;
    user2 = acc2;

    const Contract = await ethers.getContractFactory("PayableFn");
    contract = await Contract.deploy();
    await contract.deployed();

    /*
            *Send balance to a specific wallet from Hardhat
            1. create an instance of provider
            2. send ethers from the provider to the account
            3. requirement: send the value of ether in hexadecimal
        */
    provider = await ethers.provider;

    /*
            1. ParseEther convert 200 to wei
            2. toHexString convert that amount of ether to Hexadecimal
            3. Use hexStripZeros to remove leading zeros
        */
    const amountToSend = ethers.utils.hexStripZeros(
      ethers.utils.parseEther("200").toHexString()
    );

    await provider.send("hardhat_setBalance", [deployer.address, amountToSend]);
  });

  it("Contract balance should be 0", async () => {
    const balance = await provider.getBalance(contract.address);
    expect(balance).to.be.equal(new BigNumber.from(0));
  });

  it("Deployer should have 200 ethers", async () => {
    const balance = await provider.getBalance(deployer.address);
    expect(balance).to.be.equal(
      new BigNumber.from(ethers.utils.parseEther("200"))
    );
  });

  it("Deposit 100 ethers in the contract from deployer", async () => {
    const tx = await contract
      .connect(deployer)
      .deposit({ value: ethers.utils.parseEther("100") });
    await tx.wait();

    /*
     * ==> Deployer balance will be 100 - gasFees from the last transaction
     * so I use .to.be.closeTo(100 ethers)
     */
    const balanceDeployer = await provider.getBalance(deployer.address);
    expect(balanceDeployer).to.be.closeTo(
      new BigNumber.from(ethers.utils.parseEther("100")), //<-- close to
      new BigNumber.from(ethers.utils.parseEther("0.001"))
    ); //<-- range expected

    const balanceContract = await provider.getBalance(contract.address);
    expect(balanceContract).to.be.equal(
      new BigNumber.from(ethers.utils.parseEther("100"))
    );
  });

  it("Withdraw 100 ethers from deployer after deposit", async () => {
    const tx1 = await contract
      .connect(deployer)
      .deposit({ value: ethers.utils.parseEther("100") });
    await tx1.wait();
    const tx2 = await contract.connect(deployer).withdraw();
    await tx2.wait();

    const balanceOfDeployer = await provider.getBalance(deployer.address);
    expect(balanceOfDeployer).to.be.closeTo(
      new BigNumber.from(ethers.utils.parseEther("200")),
      new BigNumber.from(ethers.utils.parseEther("0.001"))
    );
  });

  it("Withdraw 100 ethers with no deposit (revert)", async () => {
    //for reverts() await always goes before expect
    await expect(contract.connect(deployer).withdraw()).to.be.revertedWith(
      "You don't have any ether here."
    );
  });
});
