const { expect } = require("chai");
const { ethers } = require("hardhat");
const { LazyMinter } = require("../lib");
const { solidity } = require("ethereum-waffle");
const chai = require("chai");
const axios = require("axios").default;
chai.use(solidity);

async function deploy() {
  const [minter, redeemer, _] = await ethers.getSigners();

  let factory = await ethers.getContractFactory("LazyNFT");
  const contract = await factory.deploy();

  // the redeemerContract is an instance of the contract that's wired up to the redeemer's signing key
  const redeemerFactory = factory.connect(redeemer);
  const redeemerContract = redeemerFactory.attach(contract.address);

  return {
    minter,
    redeemer,
    contract,
    redeemerContract,
  };
}

describe("LazyNFT", function () {
  /*
  it("Should deploy", async function () {
    const signers = await ethers.getSigners();
    const minter = signers[0].address;

    const LazyNFT = await ethers.getContractFactory("LazyNFT");
    const lazynft = await LazyNFT.deploy();
    await lazynft.deployed();
  });
  */

  it("Should redeem an NFT from a signed voucher", async function () {
    const { contract, redeemerContract, redeemer, minter } = await deploy();

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: minter,
    });
    const collection = "meme";
    const minPrice = ethers.constants.WeiPerEther; // charge 1 ETH

    const { voucher, meta, signature } = await lazyMinter.createVoucher(
      1,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      0,
      1,
      collection
    );

    await expect(
      redeemerContract.redeem(redeemer.address, voucher, meta, signature, {
        value: minPrice,
      })
    )
      .to.emit(contract, "Transfer") // transfer from null address to minter
      .withArgs(
        "0x0000000000000000000000000000000000000000",
        minter.address,
        voucher.tokenId
      )
      .and.to.emit(contract, "Transfer") // transfer from minter to redeemer
      .withArgs(minter.address, redeemer.address, voucher.tokenId);
  });

  it("Should fail to redeem an NFT that's already been claimed", async function () {
    const { contract, redeemerContract, redeemer, minter } = await deploy();

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: minter,
    });
    const collection = "meme";
    const { voucher, meta, signature } = await lazyMinter.createVoucher(
      1,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      0,
      1,
      collection
    );

    await expect(
      redeemerContract.redeem(redeemer.address, voucher, meta, signature)
    )
      .to.emit(contract, "Transfer") // transfer from null address to minter
      .withArgs(
        "0x0000000000000000000000000000000000000000",
        minter.address,
        voucher.tokenId
      )
      .and.to.emit(contract, "Transfer") // transfer from minter to redeemer
      .withArgs(minter.address, redeemer.address, voucher.tokenId);

    await expect(
      redeemerContract.redeem(redeemer.address, voucher, meta, signature)
    ).to.be.revertedWith("ERC721: token already minted");
  });

  it("Should fail to redeem an NFT voucher that's signed by an unauthorized account", async function () {
    const { contract, redeemerContract, redeemer, minter } = await deploy();
    console.log(`deploying/minter account: ${minter.address}`);

    const signers = await ethers.getSigners();
    console.log(signers.length);
    const rando = signers[signers.length - 1];
    console.log(`random accout: ${rando.address}`);

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: rando,
    });
    const collection = "meme";
    const { voucher, meta, signature } = await lazyMinter.createVoucher(
      1,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      0,
      1,
      collection
    );


    await expect(
      redeemerContract.redeem(redeemer.address, voucher, meta, signature)
      ).to.be.revertedWith("Signature invalid or unauthorized");
   
  });

  it("Should fail to redeem an NFT voucher that's been modified", async function () {
    const { contract, redeemerContract, redeemer, minter } = await deploy();

    const signers = await ethers.getSigners();
    const rando = signers[signers.length - 1];

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: rando,
    });
    const collection = "meme";
    const { voucher, meta, signature } = await lazyMinter.createVoucher(
      1,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      0,
      1,
      collection
    );

    voucher.tokenId = 2;
    await expect(
      redeemerContract.redeem(redeemer.address, voucher, meta, signature)
    ).to.be.revertedWith("Signature invalid or unauthorized");
  });
})

