const { expect } = require("chai");
describe("NFTMarket", function () {
  it("Should create 2 nfts and have tokenId 2 remaining", async function () {
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    // creating nft token
    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    let tx1 = await nft.createToken("https://www.mytokenlocation.com");
    let tx2 = await nft.createToken("https://www.mytokenlocation2.com");
    let tx3 = await nft.createToken("https://www.mytokenlocation2.com");
    let tx4 = await nft.createToken("https://www.mytokenlocation2.com");
    let tx5 = await nft.createToken("https://www.mytokenlocation2.com");

    let tx = await tx5.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    console.log(tokenId);

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    // purchasing that nft from addr1
    const [, addr1] = await ethers.getSigners();
    const [, addr2] = await ethers.getSigners();

    //try {
    //await market
    //.connect(addr1)
    //.createMarketSale(nftContractAddress, 1, { value: auctionPrice });
    //} catch (err) {
    //console.log(err);
    //}

    let items = await market.fetchMarketItems();
    //items = await Promise.all(
    //items.map(async (i) => {
    //const tokenUri = await nft.tokenURI(i.tokenId);
    //let item = {
    //price: i.price.toString(),
    //tokenId: i.tokenId.toString(),
    //seller: i.seller,
    //owner: i.owner,
    //tokenUri,
    //};

    //return item;
    //})
    //);
    //console.log("items:", items);
  });
});
