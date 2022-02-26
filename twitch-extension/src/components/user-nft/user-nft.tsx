import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";

import { lazynftaddress } from "../../config";

import LazyNFT from "../../artifacts/contracts/LazyNFT.sol/LazyNFT.json";
import { IMessageToBeSent } from "../../pages/panel.html";

interface INFTDetails {
  collection: string;
  creator: string;
  owner: string;
  price: BigNumber;
  tier: number;
  tokenId: string;
  uri: string;
}

const UserNFT = ({
  // setMessage,
  sendMessage,
}: {
  // setMessage: React.Dispatch<React.SetStateAction<IMessageToBeSent>>;
  sendMessage: (event: any, message: IMessageToBeSent) => void;
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
    console.log(await signer.getAddress());
    console.log("nfts owned", nftsOwned);
    setNFTs(nftsOwned);
  };

  const sendMessageToChat = (event: any, uri: string, tier: number) => {
    // setMessage({message: uri, points: tier*0.1});
    sendMessage(event, {message:uri, points: tier*2 });
  };
  return (
    <div className="flex justify-center w-screen h-56 overflow-y-auto">
      <div className="p-4">
        {nfts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft, i) => (
              <div
                key={i}
                className="bg-black border rounded-xl overflow-hidden "
                onClick={(event) => sendMessageToChat(event, nft.uri, nft.tier)}
              >
                <img
                  src={`https://ipfs.io/ipfs/${nft.uri.split("//")[1]}`}
                  alt="couldn't load ..."
                  className="rounded"
                />
                <div className="p-1 bg-black text-xs">
                  <p className="text-xl font-bold text-white text-center">
                    Double Click to use Emote
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-black border rounded-xl overflow-hidden ">
            <div className="p-1 bg-black text-xs">
              <p className="text-2xl font-bold text-white text-center">
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
