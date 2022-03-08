const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [_, deployer] = await ethers.getSigners();

  const NFT = await ethers.getContractFactory("LazyNFT", deployer);
  const nft = await NFT.deploy();
  await nft.deployed();

  console.log("LazyNFT deployed to:", nft.address);
  console.log("deployer:", deployer.address);

  let config = `export const contract= "${nft.address}"
export const deployer= "${deployer.address}"
  `;

  let data = JSON.stringify(config);
  fs.writeFileSync("config_local.js", JSON.parse(data));
}

try {
  main();
} catch (err) {
  console.log(err);
}
