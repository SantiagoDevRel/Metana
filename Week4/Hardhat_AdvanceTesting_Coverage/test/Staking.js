const { expect } = require("chai");
const { ethers } = require("hardhat")
const { BigNumber } = ethers;



describe("Test Staking contract", () => {
    let contract = null, provider = null, deployer = null;

    beforeEach(async () => {
        const [acc1] = await ethers.getSigners()
        deployer = acc1;

        const Contract = await ethers.getContractFactory("Staking");
        contract = await Contract.deploy();
        await contract.deployed()

        provider = ethers.provider
        const amountToSend = ethers.utils.hexStripZeros(ethers.utils.parseEther("100").toHexString())
        await provider.send("hardhat_setBalance", [deployer.address, amountToSend]);

    })

    it("Deployer should have 100 ethers", async () => {
        const balanceDeployer = await provider.getBalance(deployer.address)
        expect(balanceDeployer).to.be.equal(new BigNumber.from(ethers.utils.parseEther("100")))
    })

    it("Stake 30 ethers", async () => {
        const tx = await contract.connect(deployer).deposit({ value: ethers.utils.parseEther("30") })
        await tx.wait()

        //calling the mapping address => Account(struct), destructure to get the amountStaked
        const { amountStaked } = await contract.staked(deployer.address)
        expect(amountStaked).to.be.equal(new BigNumber.from(ethers.utils.parseEther("30")))
    })

    it("Try to withdraw with no previous stake (reverted)", async () => {
        expect(contract.connect(deployer).withdraw()).to.be.revertedWith("Staking: You don't have funds in this contract")
    })

    it("Stake 50 ethers and try to withdraw rigth away (reverted)", async () => {
        const tx = await contract.connect(deployer).deposit({ value: ethers.utils.parseEther("50") })
        await tx.wait()

        const { amountStaked } = await contract.staked(deployer.address)
        expect(amountStaked).to.be.equal(new BigNumber.from(ethers.utils.parseEther("50")))

        await expect(contract.connect(deployer).withdraw()).to.be.revertedWith("Staking: Please wait at least 10 seconds to withdraw")
    })

    it("Stake 70 ethers and try to withdraw 20 seconds later", async () => {
        function wait15Seconds() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 15000);
            });
        }

        const tx = await contract.connect(deployer).deposit({ value: ethers.utils.parseEther("70") })
        await tx.wait()

        //await wait15Seconds();
        /*
            -Instead of waiting 15 seconds I can change the time of the virtual evm
            --> await provider.send("evm_increaseTime",[incrementSecondsHere])
            -ex: await provider.send("evm_increaseTime",[24*60*60+1]) --> 86401 seconds --> 1 day + 1 second
        */

        await provider.send("evm_increaseTime", [11])

        const tx2 = await contract.connect(deployer).withdraw()
        await tx2.wait()

        const { amountStaked } = await contract.staked(deployer.address)
        expect(amountStaked).to.be.equal(new BigNumber.from(ethers.utils.parseEther("0")))

        expect(await provider.getBalance(deployer.address)).to.be.closeTo(
            new BigNumber.from(ethers.utils.parseEther("100")),
            new BigNumber.from(ethers.utils.parseEther("0.001")))
    })










})