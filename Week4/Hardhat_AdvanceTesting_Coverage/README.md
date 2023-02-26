# Hardhat testing

## 1. Test every state change
-ethereum balances (provider.getBalance())
-events emitted (to.be.emit("Event name"))
-storage variables value (contract.publicVariable())

## 2. Aim for 100% coverage **and** branch coverage
-run npx hardhat coverage
-open html file in the server
"covered" is not the same as "tested", is just to make sure I cover all the requires, statements and functions of the contract in the test.

## 3. Make sure each test is isolated from the other ones
-use beforeEach() to always re-deploy the smart contract every time I run a test it("...") so every it() starts with a freshly new smart contract with no changes

## 4. Always use BigNumbers in JS
const { BigNumber } = ethers;
ex: expect(await contract.getNumber()).to.be.equal(
      new BigNumber.from("1"))

## 5. Use to.be.closeTo
-This is to take gasFees into consideration
1st argument is the expected balance
2nd argument is the expected range to be close to

ex:
expect(await provider.getBalance(deployer.address)).to.be.closeTo(
            new BigNumber.from(ethers.utils.parseEther("100")),
            new BigNumber.from(ethers.utils.parseEther("0.001")))
    
