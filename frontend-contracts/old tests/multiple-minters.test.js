const { expect } = require("chai");
const { ethers } = require("hardhat");
const { LazyMinter } = require("../lib");
const { solidity } = require("ethereum-waffle");
const chai = require("chai");
const axios = require("axios").default;
const { BigNumber } = require("ethereum-waffle/node_modules/ethers");
chai.use(solidity);

async function deploy() {
  const [owner, minter, minter2, redeemer, redeemer2] =
    await ethers.getSigners();

  let factory = await ethers.getContractFactory("LazyNFT");
  const contract = await factory.deploy();

  // the redeemerContract is an instance of the contract that's wired up to the redeemer's signing key
  const redeemerFactory = factory.connect(redeemer);
  const redeemerContract = redeemerFactory.attach(contract.address);

  const ownerFactory = factory.connect(owner);
  const ownerContract = ownerFactory.attach(contract.address);

  return {
    owner,
    ownerContract,
    minter,
    minter2,
    redeemer,
    redeemer2,
    contract,
    redeemerContract,
  };
}

async function signer1RoleSetup() {
  const {
    owner,
    ownerContract,
    contract,
    redeemerContract,
    redeemer,
    minter,
    minter2,
  } = await deploy();

  const MINTER_ROLE = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("MINTER_ROLE")
  );

  await ownerContract.setNewMinter(minter.address);

  return {
    owner,
    ownerContract,
    contract,
    redeemerContract,
    redeemer,
    minter,
    minter2,
    MINTER_ROLE,
  };
}

describe("LazyNFT", function () {
  it("Should deploy", async function () {
    const LazyNFT = await ethers.getContractFactory("LazyNFT");
    const lazynft = await LazyNFT.deploy();
    const response = await lazynft.deployed();
  });

  it("Should setup role to signer[1]", async function () {
    const { redeemerContract, minter, MINTER_ROLE } = await signer1RoleSetup();

    expect(await redeemerContract.getRoleMember(MINTER_ROLE, 1)).to.equal(
      minter.address
    );
  });

  it("Should setup role to signer[1] and generate voucher, and redeem it", async function () {
    const {
      owner,
      ownerContract,
      contract,
      redeemerContract,
      redeemer,
      minter,
      minter2,
      MINTER_ROLE,
    } = await signer1RoleSetup();

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
      collection
    );

    // Generating a voucher

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

    await expect(
      redeemerContract.redeem(redeemer.address, voucher, meta, signature, {
        value: minPrice,
      })
    ).to.be.revertedWith("ERC721: token already minted");
  });

  it("Should Add then remove Signer[1] from role and fail to mint voucher", async function () {
    const {
      owner,
      ownerContract,
      contract,
      redeemerContract,
      redeemer,
      minter,
      minter2,
      MINTER_ROLE,
    } = await signer1RoleSetup();

    await ownerContract.removeMinter(minter.address);

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: minter,
    });
    const collection = "meme";
    const { voucher, meta, signature } = await lazyMinter.createVoucher(
      1,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      0,
      collection
    );

    await expect(
      redeemerContract.redeem(redeemer.address, voucher, meta, signature)
    ).to.be.revertedWith("Signature invalid or unauthorized");
  });

  it("Should fail to create new minter from non Owner", async function () {
    const { redeemerContract, minter } = await deploy();

    await expect(
      redeemerContract.setNewMinter(minter.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
