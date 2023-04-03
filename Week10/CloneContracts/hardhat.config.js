require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  gasReporter: {
    currency: 'USD',
    gasPrice: 21,
    enabled: true
  }

};
