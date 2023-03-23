import { ethers } from 'ethers';

const ETHERNAUT_12 = "0xdc7f818a1d13E17293c42FBBcdF3d31445FD4cF0"
const provider = new ethers.providers.InfuraProvider("goerli")


/*
    slot 0 - 32bytes --> bool public locked = true;  
    slot 1 - 32bytes --> uint256 public ID = block.timestamp;
    slot 2 -  1 byte --> uint8 private flattening = 10;
    slot 2 -  1 byte --> uint8 private denomination = 255;
    slot 2 -  2 bytes --> uint16 private awkwardness = uint16(block.timestamp);
    slot 3 - 32 bytes --> data[0];
    slot 4 - 32 bytes --> data[1];
    slot 5 - 32 bytes --> data[2];
    
    the slot5 contains the data[2], then we need to take the first 16 bytes of the number
    and then we send those 16 bytes to the function unlock() including the 0x in the begining.
*/


async function findStorages(){

    const slot0 = await provider.getStorageAt(ETHERNAUT_12, 0);
    console.log("Slot0",(slot0))
    const slot1 = await provider.getStorageAt(ETHERNAUT_12, 1);
    console.log("Slot1",(slot1))
    const slot2 = await provider.getStorageAt(ETHERNAUT_12, 2);
    console.log("Slot2",(slot2))
    const slot3 = await provider.getStorageAt(ETHERNAUT_12, 3);
    console.log("Slot3",(slot3))
    const slot4 = await provider.getStorageAt(ETHERNAUT_12, 4);
    console.log("Slot4",(slot4))
    const slot5 = await provider.getStorageAt(ETHERNAUT_12, 5);
    console.log("Slot5",(slot5))
    //const slot5_no0x = (slot5.substring(2))
    //console.log(slot5_no0x)
    const slot5_bytes16 = slot5.substring(0,34)
    console.log((slot5_bytes16))
    console.log(ethers.utils.arrayify(slot5_bytes16))
}

findStorages()
