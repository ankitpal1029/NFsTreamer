require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const { PROJECT_ID, PRIVATE_KEY } = process.env;

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
     mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.TESTNET_DEPLOY_PRIVATE_KEY]
    }
  },
  solidity: "0.8.4",
};
