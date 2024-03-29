require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, MUMBAI_NODE, POLY_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "mumbai",
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: MUMBAI_NODE,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: POLY_KEY,
  },
};
