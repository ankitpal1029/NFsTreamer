import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import axios from "../../lib/axios_config";

interface INFTServerDetails {
  voucher: {
    tokenId: number;
    minPrice: BigNumber;
    uri: string;
    collection: string;
    tier: Number;
  };
  signature: string;
  redeemed: boolean;
}

const AvailableNFTs = () => {
  const [nfts, setNFTs] = useState<INFTServerDetails[]>([]);
  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    try {
      console.log("something come da bunda");
      const response = await axios.get("/fetchVouchers");
      setNFTs(response.data.allVoucher);
      console.log(response.data.allVoucher);
    } catch (err) {
      console.log("error in fetching vouchers", err);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts
            .filter((nft, i) => nft.redeemed === false)
            .map((nft, i) => (
              <div
                key={i}
                className="bg-black border rounded-xl overflow-hidden "
                onClick={() => window.open(`/${nft.signature}`)}
              >
                <img
                  src={`https://ipfs.io/ipfs/${nft.voucher.uri.split("//")[1]}`}
                  alt="couldn't load ..."
                  className="rounded"
                />
                <div className="p-1 bg-black text-xs">
                  <p className="text-2xl font-bold text-white">
                    Click to purchase
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableNFTs;
