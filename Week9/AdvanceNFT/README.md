### Questions Week #9

##### 1. Should you be using pausable or nonReentrant in your NFT? Why or why not?

No, because I used 2 different contracts, the first one to raise the funds (Whitelist.sol) and then a different contract (AdvancedNFTwithBitmaps.sol) that based on the merkle tree proof, allows the wallets to mint.

Also, in the Whitelist.sol I used the payment splitter library from OZ, so the only ones that can receive the funds, are the addresses in the array (partners/team members) and this transfer is maded using the Address library, by address.sendValue() that makes a call{}() with a require() to check the payment went through, but there is no sense or reward by making a reentrancy attack here.

##### 2. What trick does OpenZeppelin use to save gas on the nonReentrant modifier?

-The library is not using "0" values, it's only using "1" and "2" because is cheaper to update non-zero values to non-zero values, than zero to non-zero.

-Also, because in the same call of the modifier nonReentrant() the value of \_status is changed from 1 to 2, and then back from 2 to 1, a refund of the gas is triggered.

"// By storing the original value once again, a refund is triggered (see

// https://eips.ethereum.org/EIPS/eip-2200)"

## Advanced NFT

    - Implement Merkle tree airdrop for one-time minting
    - Measure gas cost of mapping vs. bitmap for tracking minted addresses
    - Use commit-reveal for randomly allocating NFT IDs
    - NFT should use state machine to control minting, presale, public sale, and supply run-out
    - Use payment splitter for distribution of funds

## Flow WhiteList.sol for the user

![User flow](./Resources/UserFlow_WhiteList.png)

## Admin outcomes in WhiteList.sol

![Admin outcomes](./Resources/AdminOutcomes_WhiteList.png)

## Flow AdvancedNFT.sol for the user

![User flow](./Resources/UserFlow_AdvancedNFT.png)
