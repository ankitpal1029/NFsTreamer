const { expect } = require("chai");
const { ethers } = require("hardhat");
const { LazyMinter } = require("../lib");
const { solidity } = require("ethereum-waffle");
const chai = require("chai");
const axios = require("axios").default;
chai.use(solidity);

async function deploy() {
  const [owner, minter, minter2, redeemer, redeemer2] =
    await ethers.getSigners();

  let factory = await ethers.getContractFactory("LazyNFT");
  const contract = await factory.deploy();

  // the redeemerContract is an instance of the contract that's wired up to the redeemer's signing key
  const redeemerFactory = factory.connect(redeemer);
  const redeemerContract = redeemerFactory.attach(contract.address);

  console.log("=============================");
  console.log(redeemerContract);
  console.log("=============================");
  console.log(redeemerFactory);
  console.log("=============================");

  return {
    minter,
    minter2,
    redeemer,
    redeemer2,
    contract,
    redeemerContract,
  };
}

describe("LazyNFT", function () {
  it("Should deploy", async function () {
    const LazyNFT = await ethers.getContractFactory("LazyNFT");
    const lazynft = await LazyNFT.deploy();
    const response = await lazynft.deployed();
  });

  it("Should setup role to signer[1]", async function () {
    const { contract, redeemerContract, redeemer, minter, minter2 } =
      await deploy();
    const MINTER_ROLE = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("MINTER_ROLE")
    );

    // const minterCount = await redeemerContract.getRoleMemberCount(MINTER_ROLE);
    console.log(minterCount);
    // const minterCount = await redeemerContract.getRoleMemberCount(MINTER_ROLE);
  });
});
