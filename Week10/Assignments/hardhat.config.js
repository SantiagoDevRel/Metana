require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

const { MUMBAI_KEY, PRIVATE_KEY, POLY_KEY, SEPOLIA_KEY, ETHERSCAN_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "mumbai",
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: MUMBAI_KEY,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: SEPOLIA_KEY,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
};
