//const hre = require("hardhat");
const { LazyMinter } = require("../lib");
const fs = require("fs");
const { ethers } = require("hardhat");
const axios = require("axios").default;

async function main() {
  try {
    await axios.post("http://localhost:5000/deleteAll");
  } catch (err) {
    console.log("deleting", err);
  }
  const [redeemer, minter, _] = await ethers.getSigners();

  const NFT = await ethers.getContractFactory("LazyNFT");
  const nft = await NFT.deploy(minter.address);
  await nft.deployed();
  console.log("redeemer:", redeemer.address);
  console.log("LazyNFT deployed to:", nft.address);
  console.log("minter:", minter.address);

  let config = `
  export const nftaddress = "${nft.address}"
  export const redeemeraddress = "${redeemer.address}"
  export const minteraddress = "${minter.address}"
  `;

  let data = JSON.stringify(config);
  fs.writeFileSync("newconfig.js", JSON.parse(data));

  const lazyMinter = new LazyMinter({
    contractAddress: nft.address,
    signer: minter,
  });
  const numberToMint = 2;
  let objToSend = [];
  let currtokenId;
  try {
    currtokenId = await axios.get("http://localhost:5000/getCurrentId");
  } catch (err) {
    console.log(err);
  }
  console.log(currtokenId.data.currId);
  const tokenId = currtokenId.data.currId + 1;
  for (let i = tokenId; i < tokenId + 1; i++) {
    const minPrice = ethers.constants.WeiPerEther; // charge 1 Eth
    let tokenId = i;
    const collection = "meme";
    const { voucher, signature } = await lazyMinter.createVoucher(
      tokenId,
      "ipfs://bafkreic27jl77iopgjqo7m77v7b6nr5n6s3mdhlsit5xszmixkp2aulsoa",
      minPrice,
      collection
    );
    objToSend.push({
      voucher,
      signature,
      ipfs: "ipfs://bafkreic27jl77iopgjqo7m77v7b6nr5n6s3mdhlsit5xszmixkp2aulsoa",
      tokenId,
    });
  }

  for (let i = tokenId + 1; i < tokenId + 2; i++) {
    const minPrice = ethers.constants.WeiPerEther; // charge 1 Eth
    let tokenId = i;
    const collection = "meme";
    const { voucher, signature } = await lazyMinter.createVoucher(
      tokenId,
      "ipfs://bafkreicguici2ysirkeygac5wbop2ptytcdgmippdqal2okoe4m5fn5h3y",
      minPrice,
      collection
    );
    objToSend.push({
      voucher,
      signature,
      ipfs: "ipfs://bafkreicguici2ysirkeygac5wbop2ptytcdgmippdqal2okoe4m5fn5h3y",
      tokenId,
    });
  }
  console.log("obj to send", objToSend);

  try {
    const res = await axios.post("http://localhost:5000/addVoucher", {
      data: objToSend,
    });
  } catch (err) {
    console.log(err);
  }

  //let vouchers;
  //try {
  //vouchers = await axios.get("http://localhost:5000/fetchVouchers");
  //} catch (err) {
  //console.log("some error bitch", err);
  //}

  //console.log(vouchers.data.allVoucher[0]);

  //redeem the first voucher
  //const minPrice = await ethers.constants.WeiPerEther; // charge 1 Eth

  //try {
  //const res = await nft.redeem(
  //redeemer.address,
  //vouchers.data.allVoucher[0].voucher,
  //vouchers.data.allVoucher[0].signature,
  //{
  //value: minPrice,
  //}
  //);
  //console.log(res);
  //} catch (err) {
  //console.log("error in contract call", err);
  //}

  //const something = await nft.fetchNFTsOwned(redeemer.address);
  //console.log("something", something);
}

try {
  main();
} catch (err) {
  console.log("some error", err);
}
