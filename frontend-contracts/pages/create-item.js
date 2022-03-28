import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";

import { useRouter } from "next/router";

import Web3Modal from "web3modal";
const { LazyMinter } = require("../lib");
import { contract, deployer } from "../lib/config";

// import Navbar from "../components/navbar";
import withAuth from "../components/HOC/withAuth";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
import axios from "../lib/axios_config";
import Image from "next/image";
import { PhotographIcon } from "@heroicons/react/outline";

const CreateItem = () => {
  const [file, setFile] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    tier: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function onChange(e) {
    const image = e.target.files[0];

    setFile(image);
  }

  async function mint() {
    const { name, price, tier } = formInput;
    if (!name || !price) return;

    try {
      console.log(file);
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });

      const cid = added.path;
      console.log("cid:", cid);

      createSale(cid, name, price, tier);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const createSale = async (cid, name, price, tier) => {
    // set spinner to loading
    setLoading(true);

    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    console.log(signer);
    let response = await axios.get("/getCurrentId");
    let tokenID = response.data.currId + 1;

    console.log("should be minter address", signer.getAddress());

    const lazyMinter = new LazyMinter({
      contractAddress: contract,
      signer: signer,
    });

    console.log("This address is signing", await signer.getAddress());
    let objToSend = [];
    const bigPrice = ethers.utils.parseUnits(price.toString(), "ether");
    console.log("sending to index.js");
    const { voucher, meta, signature } = await lazyMinter.createVoucher(
      tokenID,
      `ipfs://${cid}`,
      bigPrice,
      tier,
      name
    );

    console.log("pushing to db");
    objToSend.push({
      voucher,
      meta,
      signature,
    });
    console.log("done pushing");
    try {
      const res = await axios.post("/addVoucher", {
        data: objToSend,
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
    console.log("finally!!!");
    // set spinner to not loading
    router.push("/");
  };

  return (
    <main className="h-screen">
      <div className=" mx-auto py-6 sm:px-6 lg:px-8 ">
        {/* Replace with your content */}
        <div className="border-4 border-dashed border-gray-200 rounded-lg">
          {/* Uploading file */}
          <div className="flex justify-center w-1/2 mx-auto">
            {/* Image Preview */}
            <div className="flex flex-col items-center justify-center w-full h-auto my-20 bg-white sm:w-3/4 sm:rounded-lg sm:shadow-xl">
              {!file && (
                <div className="border-4 border-dashed border-gray-200 rounded-lg px-20 py-20">
                  <PhotographIcon
                    className="block h-48 w-48"
                    aria-hidden="true"
                  />
                </div>
              )}
              {file && (
                <Image
                  src={URL.createObjectURL(file)}
                  width={450}
                  height={500}
                />
              )}
            </div>

            <div className="flex flex-col items-center justify-center w-full h-auto my-20 bg-white sm:w-3/4 sm:rounded-lg sm:shadow-xl">
              <div className="mt-10 mb-10 text-center">
                <h2 className="text-2xl font-semibold mb-2">
                  Upload your files
                </h2>
                <p className="text-xs text-gray-500">
                  File should be of format .mp4, .avi, .mov or .mkv
                </p>
              </div>
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="username"
                  >
                    Collection Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    placeholder="XYZ Collection"
                    onChange={(e) =>
                      updateFormInput({ ...formInput, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Price of Collectible
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    placeholder="Price in MATIC"
                    onChange={(e) =>
                      updateFormInput({ ...formInput, price: e.target.value })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Tier
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="XYZ Tier"
                    onChange={(e) =>
                      updateFormInput({ ...formInput, tier: e.target.value })
                    }
                  />
                </div>
              </form>
              <form
                action="#"
                className="relative w-4/5 h-32 max-w-xs mb-4 bg-white bg-gray-100 rounded-lg shadow-inner"
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => onChange(e)}
                />
                <label
                  htmlFor="file-upload"
                  className="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer"
                >
                  <p className="z-10 text-xs font-light text-center text-gray-500">
                    Drag & Drop your files here
                  </p>
                  <svg
                    className="z-10 w-8 h-8 text-indigo-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                  </svg>
                </label>
              </form>
              <div className="mb-10">
                <button
                  className="font-bold mt-4 bg-blue-700 text-white rounded p-4 w-36 shadow-lg flex justify-center"
                  onClick={mint}
                >
                  {loading ? (
                    // spinner animation
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-700" />
                  ) : (
                    <p>Mint !</p>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default withAuth(CreateItem);
