import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";

import { useRouter } from "next/router";

import Web3Modal from "web3modal";
const { LazyMinter } = require("../lib");
import Box from '@mui/material/Box';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
    tier: "",
  });

  const router = useRouter();

  async function onChange(e) {
    const image = e.target.files[0];

    setFile(image);
  }

  async function mint() {
    const { name, price, tier } = formInput;
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

      console.log("getting age",tier);

      createSale(cid, name, price,tier);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  

  const createSale = async (cid, name, price,tier) => {
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
    console.log("sending to index.js")
    const { voucher, meta, signature } = await lazyMinter.createVoucher( 
      tokenID,
      `ipfs://${cid}`,
      bigPrice,
      tier,
      name
    );

    console.log("pushing to db")
    objToSend.push({
      voucher,
      meta,
      signature,
    });
    console.log("done pushing")
    try {
      const res = await axios.post("/addVoucher", {
        data: objToSend,
      });
    } catch (err) {
      console.log(err);
    } 
    console.log("finally!!!")
    router.push("/");
  };

  return (
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
          placeholder="Tier"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, tier: e.target.value })
          }
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={(e) => onChange(e)}
        />

        
        <img className="rounded mt-4" width="350" src={fileURL} />
        <button
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
          onClick={mint}
        >
          MINT !
        </button>
        {fileURL && <p>Your IPFS link: {fileURL}</p>}
      </div>
    </div>
  );
};

export default withAuth(CreateItem);
