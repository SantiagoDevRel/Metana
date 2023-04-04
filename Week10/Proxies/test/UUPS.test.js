const {  loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("Lock", function () {
  async function ProxyFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("MyTokenUpgradable");

    //deploy Transparent proxy
    //const tokenProxy = await hre.upgrades.deployProxy(Token, ["PROXY","PRX"],{ initializer:"initialize"})

    //deploy Universal upgradeable proxy standar UUPS
    //const tokenProxy = await hre.upgrades.deployProxy(Token, ["PROXY","PRX"],{kind:"uups", initializer:"initialize"})

    const tokenProxy = await hre.upgrades.deployProxy(Token, ["PROXY","PRX"],{kind:"uups", initializer:"initialize"})
    await tokenProxy.deployed()

    return { tokenProxy, owner, otherAccount };
  }


  describe("Deployment proxy v1", function () {
    it("Proxy deployed properly", async function () {
      const { tokenProxy } = await loadFixture(ProxyFixture);
      
      expect(await tokenProxy.name()).to.equal("PROXY");
      expect(await tokenProxy.symbol()).to.equal("PRX");
    });

    it("Mint 100 tokens",async ()=>{
        const { tokenProxy, owner } = await loadFixture(ProxyFixture);
        const mintTx = await tokenProxy.connect(owner).mint(owner.address, 100);
        await mintTx.wait()
        expect(await tokenProxy.balanceOf(owner.address)).to.be.equal(BigNumber.from("100"))
    })
  });

  describe("Upgrading v2", function () {
    it("Deployment", async function () {
      const { tokenProxy, owner } = await loadFixture(ProxyFixture);
      
      const TokenV2 = await hre.ethers.getContractFactory("MyTokenUpgradableV2")
      const tokenProxyV2 = await hre.upgrades.upgradeProxy(tokenProxy, TokenV2);

      expect(await tokenProxyV2.name()).to.equal("PROXY");
      expect(await tokenProxyV2.symbol()).to.equal("PRX");
      expect(await tokenProxyV2.version()).to.equal("v2!");
    });
  });
});
