import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
//import axios from "axios";

import { nftaddress } from "../newconfig";

import NFT from "../artifacts/contracts/LazyNFT.sol/LazyNFT.json";

interface INFTDetails {
  collection: string;
  creator: string;
  owner: string;
  price: BigNumber;
  tokenId: string;
  uri: string;
}

export default function MyAsset() {
  const [nfts, setNFTs] = useState<INFTDetails[]>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const nftsOwned = await tokenContract.fetchNFTsOwned(signer.getAddress());

    let nftsForDisplay = [];

    //nftsOwned.forEach((nft: INFTDetails) => {
    //let thisnft = {
    //collection: nft.collection,
    //creator: nft.creator,
    //owner: nft.owner,
    //price: nft.price,
    //tokenId: nft.tokenId,
    //uri: nft.uri,
    //};

    //console.log(thisnft);

    //nftsForDisplay.push(thisnft);
    //});

    let i = 0;
    while (nftsOwned[i]) {
      let thisnft = {
        collection: nftsOwned[i].collection,
        creator: nftsOwned[i].creator,
        owner: nftsOwned[i].owner,
        price: nftsOwned[i].price,
        tokenId: nftsOwned[i].tokenId,
        uri: nftsOwned[i].uri,
      };
      nftsForDisplay.push(thisnft);
      i++;
    }

    console.log(nftsForDisplay);
    //setNFTs(nftsForDisplay);

    //console.log(typeof nftsOwned[0]);
    //const a = [1, 2, 3, 4];
    //setNFTs(a);
    //console.log(typeof a);

    //setNFTs(typeof nftsOwned[0]);
  };
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No assets owned</h1>;

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.length ? (
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">
                    Price - {nft.price} Eth
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div>No assets found</div>
          )}
        </div>
      </div>
    </div>
  );
}
