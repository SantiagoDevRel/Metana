require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { API_MAINNET_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.16",
  networks: {
    hardhat: {
      forking: {
        url: `${API_MAINNET_URL}`,
      },
    },
  },
};
