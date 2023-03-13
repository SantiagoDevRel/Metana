const { expect } = require("chai");
const { ethers } = require("hardhat")
const { BigNumber } = ethers;


describe("External Return Contract", function () {
    let contract = null, provider = null, deployer = null, user2 = null;

    beforeEach(async () => {
        const [owner, account2] = await ethers.getSigners();
        deployer = owner;
        user2 = account2;
        const Contract = await ethers.getContractFactory("Commit");
        contract = await Contract.deploy();
        await contract.deployed()

        const amountToSend = ethers.utils.hexStripZeros(ethers.utils.parseEther("100").toHexString())

        provider = ethers.provider
        await provider.send("hardhat_setBalance", [deployer.address, amountToSend])

    })

    it("Deployer try to bet 2 ether (reverted - must bet 1 ether)", async () => {
        await expect(contract.connect(deployer).gambleOnTheBlockNumber({ value: ethers.utils.parseEther("2") })).to.be.revertedWith("Commit: Please pay 1 ether")
    })

    it("Deployer try to claimWinning without betting (reverted)", async () => {
        await expect(contract.connect(deployer).claimWinning()).to.be.revertedWith("Commit: Too late to claim your rewards")
    })

    it("Deployer bet 1 ether and wait 50 blocks to claim", async () => {
        /*
            MINT BLOCKS IN HARDHAT
            await provider.send("hardhat_mine",[blocks to mine in hex value with no leading zeros])
        */
        const mint101Blocks = ethers.utils.hexStripZeros(ethers.utils.hexValue(101))
        await provider.send("hardhat_mine", [mint101Blocks])

        //bet 1 ether
        const tx = await contract.connect(deployer).gambleOnTheBlockNumber({ value: ethers.utils.parseEther("1") })
        await tx.wait()

        //mint 50 blocks to call claimWinning()
        const mint50Blocks = ethers.utils.hexStripZeros(ethers.utils.hexValue(50))
        await provider.send("hardhat_mine", [mint50Blocks])

        //check if balance of the contract still 1 ether (betted from the user)
        const balanceOfContract = await provider.getBalance(contract.address)
        expect(await balanceOfContract).to.be.equal(ethers.utils.parseEther("1"))

        //call claim winning
        const tx2 = await contract.connect(deployer).claimWinning()
        await tx2.wait()

    })

    it("Deployer comes too late to claim rewards(after 100 blocks)", async () => {
        /*
            MINT BLOCKS IN HARDHAT
            await provider.send("hardhat_mine",[blocks to mine in hex value with no leading zeros])
        */
        const mint101Blocks = ethers.utils.hexStripZeros(ethers.utils.hexValue(101))
        await provider.send("hardhat_mine", [mint101Blocks])

        //bet 1 ether
        const tx = await contract.connect(deployer).gambleOnTheBlockNumber({ value: ethers.utils.parseEther("1") })
        await tx.wait()

        //mint 101 blocks to call claimWinning()
        const mint200Blocks = ethers.utils.hexStripZeros(ethers.utils.hexValue(200))
        await provider.send("hardhat_mine", [mint200Blocks])

        //check if balance of the contract still 1 ether (betted from the user)
        const balanceOfContract = await provider.getBalance(contract.address)
        expect(await balanceOfContract).to.be.equal(ethers.utils.parseEther("1"))

        //call claim winning
        await expect(contract.connect(deployer).claimWinning()).to.be.revertedWith("Commit: Too late to claim your rewards")
    })



})


