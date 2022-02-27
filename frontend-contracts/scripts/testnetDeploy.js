const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const { TESTNET_DEPLOY_PUBLIC_KEY } = process.env;

  const NFT = await ethers.getContractFactory("LazyNFT");
  const nft = await NFT.deploy();
  await nft.deployed();

  console.log("LazyNFT deployed to:", nft.address);
  console.log("deployer:", TESTNET_DEPLOY_PUBLIC_KEY);
  console.log("contract address: ", nft.address);

  let config = `export const contract= "${nft.address}"
export const deployer= "${TESTNET_DEPLOY_PUBLIC_KEY}"
  `;

  let data = JSON.stringify(config);
  fs.writeFileSync("config.js", JSON.parse(data));
}

try {
  main();
} catch (err) {
  console.log(err);
}
