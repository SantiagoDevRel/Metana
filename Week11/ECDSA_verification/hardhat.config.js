require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { GOERLY_NODE, PRIVATE_KEY, GOERLI_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "goerli",
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: GOERLY_NODE,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: GOERLI_KEY,
  },
};
