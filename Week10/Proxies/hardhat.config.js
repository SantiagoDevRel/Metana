require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config()

const {PRIVATE_KEY , SEPOLIA_URL, Etherscan} = process.env


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks:{
    sepolia:{
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY]
    }
  },
  solidity: "0.8.9",
  etherscan:{
    apiKey: Etherscan
  }
};
