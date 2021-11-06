const { expect, use } = require("chai");
const { solidity } = require("ethereum-waffle");
const { LazyMinter } = require("../lib");
use(solidity);

async function deploy() {
  const [minter, redeemer, _] = await ethers.getSigners();

  // deploying the market
  const Market = await ethers.getContractFactory("LazyNFTMarketPlace");
  const marketContract = await Market.deploy();

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
    marketContract,
  };
}

describe("LazyNFTMarketPlace", function () {
  it("Should deploy the contracts", async function () {
    const signers = await ethers.getSigners();
    const minter = signers[0].address;

    const LazyNFT = await ethers.getContractFactory("LazyNFT");
    const lazynft = await LazyNFT.deploy(minter);
    await lazynft.deployed();

    const LazyNFTMarket = await ethers.getContractFactory("LazyNFTMarketPlace");
    const lazynftmarket = await LazyNFTMarket.deploy();
    await lazynftmarket.deployed();
  });

  it("Should redeem NFT and list in market", async function () {
    const { minter, redeemer, contract, redeemerContract, marketContract } =
      await deploy();

    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: minter,
    });
    const minPrice = ethers.constants.WeiPerEther;
    // creating a voucher
    for (let i = 1; i < 100; i++) {
      await lazyMinter.createVoucher(
        i,
        "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
        minPrice
      );
    }
    const { voucher, signature } = await lazyMinter.createVoucher(
      101,
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      minPrice
    );

    // redeeming the voucher from a different wallet than the minter
    let txn;
    await expect(
      (txn = await redeemerContract.redeem(
        redeemer.address,
        voucher,
        signature,
        {
          value: minPrice,
        }
      ))
    )
      .to.emit(contract, "Transfer")
      .withArgs(
        "0x0000000000000000000000000000000000000000",
        minter.address,
        voucher.tokenId
      )
      .and.to.emit(contract, "Transfer")
      .withArgs(minter.address, redeemer.address, voucher.tokenId);

    let tx = await txn.wait();
    let event = tx.events[0];
    let value = event.args[2];
    // token id stored on the blockchain
    let tokenId = value.toNumber();
    console.log(tokenId);
  });
});
