require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { API_MAINNET_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.8.18",
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: `${API_MAINNET_URL}`,
      },
    },
  },
};
