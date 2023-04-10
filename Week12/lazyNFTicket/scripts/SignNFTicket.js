const { ethers } = require("ethers");

//1. Update the contract address
//2. Update the DOMAIN_NAME and VERSION with the same info of the current contract
//3. Update buyer's address
//4. Generate the signature

//~~~~~~ Constants to generate the signature ~~~~~~
const SIGNER_GANACHE = new ethers.Wallet("754dfe3c78f7ad3023bc78ecbdb19a5a045b4a441414f36f76139a29037d3806");
const DOMAIN_NAME = "Vouchers-Santiago"; //Same as the smart contract
const VERSION = "1"; //Same as the smart contract

const CHAIN_ID = "1";
const CONTRACT_ADDRESS = "0x584C10E01bC1d4BE2993c6a1Cc2f6E7Bdb7A3F72";
//Create domain, types and ticket
async function createNFTicket(tokenId, buyer, price, uri) {
  const domain = {
    name: DOMAIN_NAME,
    version: VERSION,
    verifyingContract: CONTRACT_ADDRESS,
    chainId: CHAIN_ID,
  };
  const types = {
    NFTicket: [
      { name: "tokenId", type: "uint256" },
      { name: "buyer", type: "address" },
      { name: "price", type: "uint256" },
      { name: "uri", type: "string" },
    ],
  };
  const ticket = { tokenId, buyer, price, uri };

  const SIGNATURE = await SIGNER_GANACHE._signTypedData(domain, types, ticket);
  return {
    ...ticket,
    SIGNATURE,
  };
}

//Call createNFTicket() from this function
async function sellTicket() {
  const tokenId = "2";
  const buyer = "0xa5676d9158213e84504d489764e6b85fEeac5Ea8";
  const price = "1000000000000000000";
  const uri = `ipfs://QmQ82jo2ymatk9DCyNKENGo6ULYYRUtryRdtsZ1YgYqUZm/${tokenId}`;
  const result = await createNFTicket(tokenId, buyer, price, uri);
  console.log(result);
  console.log(`["${result.tokenId}", "${result.buyer}", "${result.price}", "${result.uri}", "${result.SIGNATURE}"]`);
}
sellTicket();
