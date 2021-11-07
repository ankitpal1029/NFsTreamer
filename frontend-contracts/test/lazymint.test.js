const { expect } = require("chai");
const { ethers } = require("hardhat");
const { LazyMinter } = require("../lib");
const { solidity } = require("ethereum-waffle");
const chai = require("chai");
const axios = require("axios").default;
chai.use(solidity);

async function deploy() {
  const [minter, redeemer, _] = await ethers.getSigners();

  let factory = await ethers.getContractFactory("LazyNFT", minter);
  const contract = await factory.deploy(minter.address);

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
  it("Should deploy", async function () {
    const signers = await ethers.getSigners();
    const minter = signers[0].address;

    const LazyNFT = await ethers.getContractFactory("LazyNFT");
    const lazynft = await LazyNFT.deploy(minter);
    await lazynft.deployed();
  });

  it("Should redeem an NFT from a signed voucher", async function () {
    const { contract, redeemerContract, redeemer, minter } = await deploy();

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: minter,
    });
    const collection = "meme";
    const minPrice = ethers.constants.WeiPerEther; // charge 1 Eth
    const { voucher, signature } = await lazyMinter.createVoucher(
      1,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      0,
      collection
    );

    await expect(redeemerContract.redeem(redeemer.address, voucher, signature))
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
    const { voucher, signature } = await lazyMinter.createVoucher(
      1,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      0,
      collection
    );

    await expect(redeemerContract.redeem(redeemer.address, voucher, signature))
      .to.emit(contract, "Transfer") // transfer from null address to minter
      .withArgs(
        "0x0000000000000000000000000000000000000000",
        minter.address,
        voucher.tokenId
      )
      .and.to.emit(contract, "Transfer") // transfer from minter to redeemer
      .withArgs(minter.address, redeemer.address, voucher.tokenId);

    await expect(
      redeemerContract.redeem(redeemer.address, voucher, signature)
    ).to.be.revertedWith("ERC721: token already minted");
  });

  it("Should fail to redeem an NFT voucher that's signed by an unauthorized account", async function () {
    const { contract, redeemerContract, redeemer, minter } = await deploy();

    const signers = await ethers.getSigners();
    const rando = signers[signers.length - 1];

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: rando,
    });
    const collection = "meme";
    const { voucher, signature } = await lazyMinter.createVoucher(
      1,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      0,
      collection
    );

    await expect(
      redeemerContract.redeem(redeemer.address, voucher, signature)
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
    const { voucher, signature } = await lazyMinter.createVoucher(
      1,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      0,
      collection
    );

    voucher.tokenId = 2;
    await expect(
      redeemerContract.redeem(redeemer.address, voucher, signature)
    ).to.be.revertedWith("Signature invalid or unauthorized");
  });

  it("Should redeem if payment is >= minPrice", async function () {
    const { contract, redeemerContract, redeemer, minter } = await deploy();

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: minter,
    });
    const collection = "meme";
    const minPrice = ethers.constants.WeiPerEther; // charge 1 Eth
    const { voucher, signature } = await lazyMinter.createVoucher(
      1,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      minPrice,
      collection
    );

    await expect(
      redeemerContract.redeem(redeemer.address, voucher, signature, {
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

  it("Should fail to redeem if payment is < minPrice", async function () {
    const { contract, redeemerContract, redeemer, minter } = await deploy();

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: minter,
    });
    const minPrice = ethers.constants.WeiPerEther; // charge 1 Eth
    const collection = "meme";
    const { voucher, signature } = await lazyMinter.createVoucher(
      1,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      minPrice,
      collection
    );

    const payment = minPrice.sub(10000);
    await expect(
      redeemerContract.redeem(redeemer.address, voucher, signature, {
        value: payment,
      })
    ).to.be.revertedWith("Insufficient funds to redeem");
  });

  it("Should make payments available to minter for withdrawal", async function () {
    const { contract, redeemerContract, redeemer, minter } = await deploy();

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: minter,
    });
    const minPrice = ethers.constants.WeiPerEther; // charge 1 Eth
    const collection = "meme";
    const { voucher, signature } = await lazyMinter.createVoucher(
      1,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      minPrice,
      collection
    );

    //the payment should be sent from the redeemer's account to the contract address
    await expect(
      await redeemerContract.redeem(redeemer.address, voucher, signature, {
        value: minPrice,
      })
    ).to.changeEtherBalances(
      [redeemer, contract],
      [minPrice.mul(-1), minPrice]
    );

    //minter should have funds available to withdraw
    expect(await contract.availableToWithdraw()).to.equal(minPrice);

    //withdrawal should increase minter's balance
    await expect(await contract.withdraw()).to.changeEtherBalance(
      minter,
      minPrice
    );

    //minter should now have zero available
    expect(await contract.availableToWithdraw()).to.equal(0);
  });

  it("Should add 2 vouchers to the database", async function () {
    const { contract, redeemerContract, redeemer, minter } = await deploy();

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: minter,
    });

    const numberToMint = 2;
    let objToSend = [];

    for (let i = 0; i < numberToMint; i++) {
      const minPrice = ethers.constants.WeiPerEther; // charge 1 Eth
      let tokenId = i + 1;
      const collection = "meme";
      const { voucher, signature } = await lazyMinter.createVoucher(
        tokenId,
        "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
        minPrice,
        collection
      );
      objToSend.push({
        voucher,
        signature,
        ipfs: "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
        tokenId,
      });
    }

    try {
      const res = await axios.post("http://localhost:5000/addVoucher", {
        data: objToSend,
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  });

  it("Should add 2 vouchers after fetching current tokenId", async function () {
    const { contract, redeemerContract, redeemer, minter } = await deploy();

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
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
    for (let i = tokenId; i <= tokenId + 2; i++) {
      const minPrice = ethers.constants.WeiPerEther; // charge 1 Eth
      let tokenId = i + 1;
      const collection = "meme";
      const { voucher, signature } = await lazyMinter.createVoucher(
        tokenId,
        "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
        minPrice,
        collection
      );
      objToSend.push({
        voucher,
        signature,
        ipfs: "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
        tokenId,
      });
    }

    try {
      const res = await axios.post("http://localhost:5000/addVoucher", {
        data: objToSend,
      });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  });
});
