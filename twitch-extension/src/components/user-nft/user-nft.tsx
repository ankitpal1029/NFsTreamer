import { ethers } from "ethers";
import React, { useEffect } from "react";
import Web3Modal from "web3modal";

const UserNFT: React.FC = () => {
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
  };
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {/*{nfts.map((nft, i) => (*/}
          <div className="border shadow rounded-xl overflow-hidden">
            <img
              src="https://www.fillmurray.com/640/360"
              alt="whre"
              className="rounded"
            />
            <div className="p-4 bg-black">
              <p className="text-2xl font-bold text-white">Price - 1 Eth</p>
            </div>
          </div>

          <div className="border shadow rounded-xl overflow-hidden">
            <img
              src="https://www.fillmurray.com/640/360"
              alt="whre"
              className="rounded"
            />
            <div className="p-4 bg-black">
              <p className="text-2xl font-bold text-white">Price - 1 Eth</p>
            </div>
          </div>
          {/*))}*/}
        </div>
      </div>
    </div>
  );
};

export default UserNFT;
