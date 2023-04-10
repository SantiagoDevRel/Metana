const { ethers } = require("ethers");

//~~~~~~ Constants to generate the signature ~~~~~~
const SIGNER_GANACHE = new ethers.Wallet("50c20848802ade8a7c87c364316b069a71b4290643d731d28eb27012184cd162");
const DOMAIN_NAME = "Vouchers-Santiago"; //Same as the smart contract
const VERSION = "1"; //Same as the smart contract

const CHAIN_ID = "1";
const CONTRACT_ADDRESS = "0xB6e677a576B56581B027B20E1F2aBea290906a93";
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
  const tokenId = "1";
  const buyer = "0xa5676d9158213e84504d489764e6b85fEeac5Ea8";
  const price = "1000000000000000000";
  const uri = `ipfs://QmQ82jo2ymatk9DCyNKENGo6ULYYRUtryRdtsZ1YgYqUZm/${tokenId}`;
  const result = await createNFTicket(tokenId, buyer, price, uri);
  console.log(result);
  console.log(`["${result.tokenId}", "${result.buyer}", "${result.price}", "${result.uri}", "${result.SIGNATURE}"]`);
}
sellTicket();
