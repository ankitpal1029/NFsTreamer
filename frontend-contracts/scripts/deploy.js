const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer, _] = await ethers.getSigners();

  const NFT = await ethers.getContractFactory("LazyNFT");
  const nft = await NFT.deploy(deployer.address);
  await nft.deployed();

  console.log("LazyNFT deployed to:", nft.address);
  console.log("deployer:", deployer.address);

  let config = `export const nftmarketaddress = "${nft.address}"
export const nftaddress = "${deployer.address}"
  `;

  let data = JSON.stringify(config);
  fs.writeFileSync("config.js", JSON.parse(data));
}

try {
  main();
} catch (err) {
  console.log(err);
}
