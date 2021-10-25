require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const { PROJECT_ID, PRIVATE_KEY } = process.env;

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${PROJECT_ID}`,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${PROJECT_ID}`,
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: "0.8.4",
};
