import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";

import { lazynftaddress } from "../../config";

import LazyNFT from "../../artifacts/contracts/LazyNFT.sol/LazyNFT.json";

interface INFTDetails {
  collection: string;
  creator: string;
  owner: string;
  price: BigNumber;
  tokenId: string;
  uri: string;
}

const UserNFT = ({
  setMessage,
  sendMessage,
}: {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (event: any) => void;
}) => {
  const [nfts, setNFTs] = useState<INFTDetails[]>([]);
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

    const lazynftContract = new ethers.Contract(
      lazynftaddress,
      LazyNFT.abi,
      signer
    );

    console.log(lazynftContract);

    const nftsOwned = await lazynftContract.fetchNFTsOwned(signer.getAddress());
    console.log("nfts owned", nftsOwned[0]);
    setNFTs(nftsOwned);
  };

  const sendMessageToChat = (event: any, uri: string) => {
    setMessage(uri);
    sendMessage(event);
  };
  return (
    <div className="flex justify-center">
      <div className="p-4">
        {nfts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft, i) => (
              <div
                key={i}
                className="bg-black border rounded-xl overflow-hidden "
                onClick={(event) => sendMessageToChat(event, nft.uri)}
              >
                <img
                  src={`https://ipfs.io/ipfs/${nft.uri.split("//")[1]}`}
                  alt="couldn't load ..."
                  className="rounded"
                />
                <div className="p-1 bg-black text-xs">
                  <p className="text-2xl font-bold text-white">
                    Click for User Chat
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-black border rounded-xl overflow-hidden ">
            <div className="p-1 bg-black text-xs">
              <p className="text-2xl font-bold text-white">
                You don't own any NFTs
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNFT;
