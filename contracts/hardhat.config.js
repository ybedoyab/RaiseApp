require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

if (!process.env.PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in the .env file");
}

if (!process.env.AVALANCHE_FUJI_RPC_URL) {
  throw new Error("Please set your AVALANCHE_FUJI_RPC_URL in the .env file");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    "avalanche-fuji": {
      url: process.env.AVALANCHE_FUJI_RPC_URL,
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 