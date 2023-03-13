require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-gas-reporter");

const { PRIVATE_KEY, API_URL, EtherscanScanKey, PolygonScanKey } = process.env;

module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  paths: {
    /* artifacts: "./src/artifacts", */
  },
  /*  networks: {
    goerli: {
      url: `${API_URL}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY],
    },
  }, */
  etherscan: {
    apiKey: PolygonScanKey,
  },
  plugins: ["hardhat-gas-reporter"],
};
