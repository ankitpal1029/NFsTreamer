const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const { MINTER_PUBLIC_KEY } = process.env;

  const NFT = await ethers.getContractFactory("LazyNFT");
  const nft = await NFT.deploy(MINTER_PUBLIC_KEY);
  await nft.deployed();
  console.log("redeemer:", "some shit not needed");
  console.log("LazyNFT deployed to:", nft.address);
  console.log("minter:", MINTER_PUBLIC_KEY);

  let config = `
  export const nftaddress = "${nft.address}"
  export const redeemeraddress = "some shit not needed"
  export const minteraddress = "${MINTER_PUBLIC_KEY}"
  `;

  let data = JSON.stringify(config);
  fs.writeFileSync("newconfig.js", JSON.parse(data));
}

try {
  main();
} catch (err) {
  console.log(err);
}
