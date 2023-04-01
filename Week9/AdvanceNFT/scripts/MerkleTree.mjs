import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { ethers } from "ethers";
import jsonWhiteList from "../artifacts/contracts/WhiteList.sol/WhiteListForERC721.json" assert { type: "json" };
import fs from "fs";
/* 

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

getValues() */

const valuesPrivate = [
  ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "1"],
  ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "2"],
  ["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "3"],
  ["0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", "4"],
  ["0x617F2E2fD72FD9D5503197092aC168c91465E7f2", "5"],
];

// (2)
const treePrivate = StandardMerkleTree.of(valuesPrivate, [
  "address",
  "uint256",
]);

// (3)
const privateRoot = treePrivate.root;
console.log("ROOT", privateRoot);

const leaf = valuesPrivate[0];

const proof = treePrivate.getProof(leaf);
console.log("PROOF:", proof);
console.log("VERIFY", treePrivate.verify(leaf, proof));

//console.log("TREEPRIVATE",treePrivate)
