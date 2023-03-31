import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { ethers } from "ethers";
import jsonWhiteList from "../artifacts/contracts/WhiteList.sol/whiteListForERC721.json" assert { type: "json" };
import fs from "fs";


//create a provider in Sepolia network
const provider = new ethers.providers.InfuraProvider("goerli")

console.log(
  ethers.utils.formatEther(
    await provider.getBalance("0xA3286628134baD128faeef82F44e99AA64085C94")
  ).toString()
);

const addressWhiteList = ""
const {abi} = jsonWhiteList
console.log(abi)
const contractWhiteList = new ethers.Contract( address , abiWhiteList , provider );
async function getValues(){
    const privateIDs = await contractWhiteList.getPrivateListIDs()
    const publicIDs = await contractWhiteList.getPrivateListIDs()
    console.log(privateIDs)
    console.log(publicIDs)
    return createMerkleTree(privateIDs, publicIDs)
}

//~~~~~~~~~~ Merkle Tree ~~~~~~~~~~
//(1) send the arrays for the merkleTrees as a parameters
function createMerkleTree(privateValues, publicValues){
      //(2) Create the merkleTree using the above values
      const privateTree = StandardMerkleTree.of(privateValues, ["bytes32"]);
      const publicTree = StandardMerkleTree.of(publicValues, ["bytes32"]);

      //(3) Get the merkle tree root
      const privateRoot = privateTree.root
      const publicRoot= publicTree.root
      console.log("Private Root:", privateRoot);
      console.log("Public Root:", publicRoot);
      
      //(4) Create a json file with the merkleTree
      fs.writeFileSync("private.json", JSON.stringify(privateTree.dump()));
      fs.writeFileSync("public.json", JSON.stringify(publicTree.dump()));
}

getValues()
