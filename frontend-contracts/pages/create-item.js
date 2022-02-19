import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";

import { useRouter } from "next/router";

import Web3Modal from "web3modal";
import { LazyMinter } from "../lib/index";

import { contract, deployer} from "../config";

import Navbar from "../components/navbar";
import withAuth from "../components/HOC/withAuth";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
import axios from "../lib/axios_config";


const CreateItem = () => {
  const [file, setFile] = useState(null);
  const [displayURL, setdisplayURL] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
  });

  const router = useRouter();

  async function onChange(e) {
    const image = e.target.files[0];

    setFile(image);
  }

  async function mint() {
    const { name, price } = formInput;
    //console.log(name)
    if (!name || !price) return;

    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      setdisplayURL(`https://ipfs.io/ipfs/${added.path}`);
      
      const cid = added.path;
      console.log("logging CID");
      console.log(cid);
      createSale(cid, name, price);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const createSale = async (cid, name, price) => {
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

    const lazyMinter = new LazyMinter({
      contractAddress: contract,
      signer: signer,
    });

    console.log("This address is signing", await signer.getAddress());
    let objToSend = [];
    const bigPrice = ethers.utils.parseUnits(price.toString(), "ether");
    const { voucher, meta, signature } = await lazyMinter.createVoucher(
      tokenID,
      `ipfs://${cid}`,
      bigPrice,
      name
    );


    objToSend.push({
      voucher,
      meta,
      signature,
    });

    try {
      const res = await axios.post("/addVoucher", {
        data: objToSend,
      });
    } catch (err) {
      console.log(err);
    }

    // router.push("/");
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <input
            placeholder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <input
            placeholder="Asset Price in ETH"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
          <input
            type="file"
            name="Asset"
            className="my-4"
            onChange={(e) => onChange(e)}
          />
          <img className="rounded mt-4" width="350" src={displayURL} alt="something"/>
          <button
            className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
            onClick={mint}
          >
            MINT !
          </button>
          {fileURL && <p>Your IPFS link: {fileURL}</p>}
        </div>
      </div>
    </div>
  );
};

export default withAuth(CreateItem);
