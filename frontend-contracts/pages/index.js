import { useState, Component, useEffect } from "react";
import React from "react";
import ReactDOM from "react-dom";
import { Image } from "next/image";

import { ethers } from "ethers";
import Web3Modal from "web3modal";

// component imports
import withAuth from "../components/HOC/withAuth";
import { ShortenAddress } from "../lib/shorten_address";

import LazyNFT from "../artifacts/contracts/LazyNFT.sol/LazyNFT.json";
import axios from "../lib/axios_config";
import { contract, deployer, IPFS_GATEWAY } from "../lib/config";

// redux imports
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/auth/authSlice.js";

const ListVouchers = () => {
  const dispatch = useDispatch();
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    dispatch(login());
    axios.get("/fetchVouchers").then((response) => {
      setVouchers(response.data.allVoucher);
    });
  }, []);

  const _redm = async (voucher, meta, signature) => {
    console.log("redeem");
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const lazynftContract = new ethers.Contract(contract, LazyNFT.abi, signer);

    try {
      const res = await lazynftContract.redeem(
        signer.getAddress(),
        voucher,
        meta,
        signature,
        {
          value: voucher.minPrice,
        }
      );
      console.log("redeeming!!!!!");
      console.log(res);
      try {
        console.log("tryna delete");
        await axios
          .post("/deleteOne", {
            tokenId: voucher.tokenId,
          })
          .then((res) => {
            console.log(res.data);
          });
      } catch (err) {
        console.log("delete one not working", err);
      }
    } catch (err) {
      console.log("redeem not working", err);
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {vouchers.length ? (
            vouchers.map((v, index) => {
              if (!v.redeemed) {
                return (
                  <div
                    className="bg-white rounded overflow-hidden shadow-2xl"
                    key={index}
                  >
                    <img
                      src={`${IPFS_GATEWAY}${v.voucher.uri.split("//")[1]}`}
                      height={50}
                      width={50}
                      className="w-full object-center object-cover h-96"
                    />
                    <div>
                      <div className="p-2 flex justify-between">
                        <div>
                          <span className="font-bold">
                            {v.voucher.collection}
                          </span>
                          <span className="block text-gray-500 text-sm">
                            {parseInt(v.voucher.minPrice.hex, 16) /
                              Math.pow(10, 18)}{" "}
                            ETH
                          </span>
                          <p className="mt-1 text-lg font-medium text-gray-900"></p>
                        </div>

                        <div>
                          <button
                            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                            onClick={() =>
                              _redm(v.voucher, v.meta, v.signature)
                            }
                          >
                            Redeem
                          </button>
                        </div>
                      </div>
                      <div className="p-2 text-center text-gray-500 font-bold">
                        {ShortenAddress(v.signature)}
                      </div>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <div>No Vouchers!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(ListVouchers);
