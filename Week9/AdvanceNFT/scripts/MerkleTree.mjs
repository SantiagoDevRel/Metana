import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { ethers } from "ethers"; 

//1. create a provider in Sepolia network
const provider = new ethers.InfuraProvider("sepolia")
console.log((await provider.getBalance("0xA3286628134baD128faeef82F44e99AA64085C94")).toString())


// (1)
const values = [
  ["0xbcbfcade519d8e05213b379ed08db14c76aa6038a2794522e942ee0ecc128417"],
  ["0xbcbfcade519d8e05213b379ed08db14c76aa6038a2794522e942ee0ecc128418"]
];

// (2)
const tree = StandardMerkleTree.of(values, ["bytes32"]);

// (3)
console.log('Merkle Root:', tree.root);

// (4)
