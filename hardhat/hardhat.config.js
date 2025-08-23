// Hardhat config for deploying ChatNFT.sol and ChatMessages.sol
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    fuji: {
      url: process.env.AVALANCHE_FUJI_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Add mainnet or other networks as needed
  },
};
